// docs/app.js
(function () {
  "use strict";

  // -------------------------
  // Helpers
  // -------------------------
  const $ = (sel) => document.querySelector(sel);
  const getQuery = (key) => new URLSearchParams(location.search).get(key);

  function setText(sel, text) {
    const el = $(sel);
    if (el) el.textContent = text ?? "";
  }

  function setHtml(sel, html) {
    const el = $(sel);
    if (el) el.innerHTML = html ?? "";
  }

  function val(id) {
    const el = document.getElementById(id);
    return el ? String(el.value || "").trim() : "";
  }

  function requireVal(id, label) {
    const v = val(id);
    if (!v) throw new Error(`กรุณากรอก ${label}`);
    return v;
  }

  function showReady(isReady, note = "") {
    // ถ้าหน้าคุณมี element สถานะ เช่น #statusText ก็จะแสดงให้
    // (ถ้าไม่มี ก็ไม่เป็นไร)
    if (isReady) {
      setText("#statusText", note ? `Ready ✅ (${note})` : "Ready ✅");
    } else {
      setText("#statusText", note ? `Not Ready ❌ (${note})` : "Not Ready ❌");
    }
  }

  function showResult(obj) {
    // ถ้าหน้าคุณมีพื้นที่แสดงผล เช่น #resultBox / #resultJson
    // (ถ้าไม่มี ก็ไม่เป็นไร)
    const pretty = JSON.stringify(obj, null, 2);
    const el = $("#resultBox") || $("#resultJson");
    if (el) el.textContent = pretty;
    console.log("API response:", obj);
  }

  // -------------------------
  // User Context (LIFF/WEB)
  // -------------------------
  const state = {
    noliff: getQuery("noliff") === "1",
    tab: getQuery("tab") || (window.APP_CONFIG?.DEFAULT_TAB || "register"),
    user: {
      displayName: "-",
      userId: "-",
      pictureUrl: "",
      mode: "UNKNOWN",
    },
  };

  function renderUserCard() {
    // ปรับ selector ตามที่หน้าเว็บคุณใช้
    // (ในภาพมี "Name:" และ "UserId:")
    setText("#userName", state.user.displayName);
    setText("#userId", state.user.userId);

    // ถ้ามี element โชว์โหมด
    const note = state.noliff ? "NO-LIFF mode (test)" : "LIFF mode";
    setText("#modeText", note);
  }

  async function initUser() {
    // NO-LIFF mode
    if (state.noliff) {
      state.user = {
        displayName: "Web Test",
        userId: "U_WEB_TEST",
        pictureUrl: "",
        mode: "NO_LIFF",
      };
      showReady(true, "NO-LIFF");
      renderUserCard();
      return;
    }

    // LIFF mode (ถ้ามี liff)
    try {
      if (!window.liff) {
        // ถ้าไม่มี liff.js โหลดมา
        state.user = { displayName: "-", userId: "-", pictureUrl: "", mode: "NO_LIFF_FALLBACK" };
        showReady(true, "Web (no LIFF SDK)");
        renderUserCard();
        return;
      }

      const liffId = window.APP_CONFIG?.LIFF_ID;
      if (!liffId) throw new Error("LIFF_ID missing in config.js");

      await window.liff.init({ liffId });

      if (!window.liff.isLoggedIn()) {
        window.liff.login();
        return; // จะ redirect กลับมา
      }

      const profile = await window.liff.getProfile();
      state.user = {
        displayName: profile.displayName || "-",
        userId: profile.userId || "-",
        pictureUrl: profile.pictureUrl || "",
        mode: "LIFF",
      };

      showReady(true, "LIFF");
      renderUserCard();
    } catch (err) {
      console.error("LIFF init error:", err);
      showReady(false, "LIFF error");
      // ยังให้ใช้แบบเว็บได้ แต่ userId จะเป็น "-"
      state.user = { displayName: "-", userId: "-", pictureUrl: "", mode: "LIFF_ERROR" };
      renderUserCard();
    }
  }

  // -------------------------
  // Actions
  // -------------------------
  async function submitRegister() {
    // ✅ จุดสำคัญ: ส่ง userId (ตัว I ใหญ่) ให้ตรงกับ Apps Script
    const payload = {
      action: "register",
      userId: state.user.userId, // ✅ ต้องชื่อ userId

      // form fields
      no: requireVal("m_no", "รหัสช่าง (no)"),
      name: requireVal("m_name", "ชื่อจริง"),
      lastName: requireVal("m_lastName", "นามสกุล"),
      phone: requireVal("m_phone", "เบอร์โทร"),
      birthday: requireVal("m_birthday", "วันเกิด"),
      province: requireVal("m_province", "จังหวัด"),
      bankName: requireVal("m_bankName", "ชื่อธนาคาร"),
      bankAccountNo: requireVal("m_bankAccountNo", "เลขบัญชี"),
      bankAccountName: requireVal("m_bankAccountName", "ชื่อบัญชี"),
      eMail: requireVal("m_email", "Email"),

      // optional URL fields (ถ้าหน้าคุณมี)
      bookBankPhoto: val("m_bookBankPhoto") || "",
      idPhoto: val("m_idPhoto") || "",
    };

    // กันกรณี LIFF error แล้ว userId เป็น "-"
    if (!payload.userId || payload.userId === "-") {
      // ถ้าเป็นโหมดทดสอบให้ใส่ค่าทดสอบแทน
      if (state.noliff) payload.userId = "U_WEB_TEST";
      else throw new Error("ไม่พบ UserId จาก LIFF (ลองเปิดด้วย ?noliff=1 เพื่อทดสอบเว็บก่อน)");
    }

    // ยิงเข้า Apps Script
    const resp = await window.Api.post(payload);
    showResult(resp);

    if (!resp || resp.ok !== true) {
      throw new Error(resp?.error || "ส่งข้อมูลไม่สำเร็จ");
    }

    return resp;
  }

  // -------------------------
  // Wire up UI
  // -------------------------
  function bindEvents() {
    // ปุ่มบันทึกสมัครสมาชิก
    // ใส่ id ให้ปุ่มใน index.html เป็น id="btnRegister"
    const btn = $("#btnRegister");
    if (btn) {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          btn.disabled = true;
          showResult({ ok: false, message: "Submitting..." });

          const resp = await submitRegister();
          showResult({ ok: true, message: "บันทึกสำเร็จ ✅", resp });

          // ถ้าต้องการ reset ฟอร์มหลังบันทึก
          const form = $("#formRegister");
          if (form && typeof form.reset === "function") form.reset();
        } catch (err) {
          console.error(err);
          showResult({ ok: false, error: String(err.message || err) });
        } finally {
          btn.disabled = false;
        }
      });
    }
  }

  function ensureApiLoaded() {
    if (!window.Api || typeof window.Api.post !== "function") {
      console.error("Api.post not found. Check docs/api.js loaded before app.js");
      showReady(false, "Api missing");
      showResult({ ok: false, error: "Api.post not found (check script order)" });
      return false;
    }
    return true;
  }

  async function boot() {
    // แสดง tab (ถ้าหน้าคุณมีระบบ tab ก็อาจไม่ต้องใช้)
    // อย่างน้อยเก็บ state.tab ไว้ก่อน
    // console.log("TAB:", state.tab);

    if (!ensureApiLoaded()) return;

    await initUser();
    bindEvents();
  }

  // start
  document.addEventListener("DOMContentLoaded", boot);
})();
