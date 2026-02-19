// app.js
window.addEventListener("DOMContentLoaded", async () => {
  try {
    UI.setStatus("Loading LIFF...");

    const p = await LiffAuth.init();
    if (!p) return;

    UI.renderProfile(p);
    UI.bindTabs();

    const startTab = UI.getTabFromUrl();
    UI.setActiveTab(startTab);

    UI.$("btnRegister").addEventListener("click", () => onRegister(p));
    UI.$("btnInstall").addEventListener("click", () => onInstall(p));
    UI.$("btnPoints").addEventListener("click", () => onPoints(p));
    UI.$("btnRedeem").addEventListener("click", () => onRedeem(p));

    if (startTab === "points") await onPoints(p);
  } catch (err) {
    console.error(err);
    UI.setStatus("LIFF Error ❌");
    alert("Error: " + (err?.message || err));
  }
});

// ===== Step 1: Register (Members) =====
async function onRegister(profile) {
  try {
    // user-require ตาม workflow
    const no = UI.requireValue("m_no", "รหัสช่าง (no)");
    const name = UI.requireValue("m_name", "ชื่อจริง");
    const lastName = UI.requireValue("m_lastName", "นามสกุล");
    const phone = UI.requireValue("m_phone", "เบอร์โทร");
    const birthday = UI.requireValue("m_birthday", "วันเกิด");
    const province = UI.requireValue("m_province", "จังหวัด");
    const bankName = UI.requireValue("m_bankName", "ชื่อธนาคาร");
    const bankAccountNo = UI.requireValue("m_bankAccountNo", "เลขบัญชี");
    const bankAccountName = UI.requireValue("m_bankAccountName", "ชื่อบัญชี");
    const eMail = UI.requireValue("m_email", "Email");

    const payload = {
      action: "register",
      // Line (LIFF)
      userId: profile.userId,
      displayName: profile.displayName || "",
      pictureUrl: profile.pictureUrl || "",

      // user-require
      no, name, lastName, phone, birthday, province,
      bankName, bankAccountNo, bankAccountName, eMail,

      // user-non-require (เป็น URL ถ้ามี)
      bookBankPhoto: UI.$("m_bookBankPhoto").value.trim(),
      idPhoto: UI.$("m_idPhoto").value.trim(),
    };

    const out = await Api.post(payload);
    UI.renderOut("outRegister", out);
  } catch (e) {
    UI.renderOut("outRegister", { ok: false, error: e.message || String(e) });
  }
}

// ===== Step 2: Install =====
async function onInstall(profile) {
  try {
    // user-require ตาม workflow
    const dealer = UI.requireValue("i_dealer", "ชื่อร้านค้า (dealer)");
    const btu = UI.requireValue("i_btu", "ขนาดเครื่อง (btu)");
    const serialNumber = UI.requireValue("i_serial", "serialNumber");
    const serialNumberPhoto = UI.requireValue("i_serialPhoto", "รูป serialNumberPhoto (URL)");
    const installPhoto = UI.requireValue("i_installPhoto", "รูป installPhoto (URL)");

    const payload = {
      action: "install",
      userId: profile.userId,     // Line
      dealer,                     // user-require
      btu,                        // user-require (09-12, 18-24)
      serialNumber,               // user-require
      serialNumberPhoto,          // user-require
      installPhoto,               // user-require
    };

    const out = await Api.post(payload);
    UI.renderOut("outInstall", out);
  } catch (e) {
    UI.renderOut("outInstall", { ok: false, error: e.message || String(e) });
  }
}

// ===== Step 3: Points =====
async function onPoints(profile) {
  const payload = { action: "points", userId: profile.userId };
  const out = await Api.post(payload);
  UI.$("balance").textContent = (out?.balancePoints ?? "-");
  UI.renderOut("outPoints", out);
}

// ===== Step 4: Redeem =====
async function onRedeem(profile) {
  try {
    const pts = Number(UI.requireValue("r_points", "แต้มที่ต้องการแลก"));
    if (!(pts > 0)) throw new Error("แต้มต้องมากกว่า 0");

    const payload = { action: "redeem", userId: profile.userId, points: pts };
    const out = await Api.post(payload);
    UI.renderOut("outRedeem", out);
  } catch (e) {
    UI.renderOut("outRedeem", { ok: false, error: e.message || String(e) });
  }
}
