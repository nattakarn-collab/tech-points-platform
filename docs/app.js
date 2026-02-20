async function onRegister(profile) {
  try {
    // USER-REQUIRE (บังคับกรอก) -> ลง phone/birthday/eMail (ไม่มี _2)
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

      // LINE (from LIFF)
      userId: profile.userId,
      displayName: profile.displayName || "",
      pictureUrl: profile.pictureUrl || "",

      // LINE extra fields (ถ้ามีแหล่งส่งมา) -> *_2
      phone_2: profile.phone_2 || "",
      birthday_2: profile.birthday_2 || "",
      eMail_2: profile.eMail_2 || "",

      // USER-required -> ไม่มี _2
      no, name, lastName,
      phone, birthday, eMail,
      province,
      bankName, bankAccountNo, bankAccountName,

      // user-non-require
      bookBankPhoto: UI.$("m_bookBankPhoto") ? UI.$("m_bookBankPhoto").value.trim() : "",
      idPhoto: UI.$("m_idPhoto") ? UI.$("m_idPhoto").value.trim() : "",
    };

    const out = await Api.post(payload);
    UI.renderOut("outRegister", out);
  } catch (e) {
    UI.renderOut("outRegister", { ok:false, error: e.message || String(e) });
  }
}

// ===== MAIN BOOTSTRAP =====
(async function main() {
  try {
    UI.bindTabs();

    const tab = UI.getTabFromUrl();
    UI.setActiveTab(tab);

    const u = new URL(location.href);
    const noliff = u.searchParams.get("noliff") === "1";

    let profile = null;

    if (noliff) {
      // โหมดทดสอบบนเว็บ: ไม่เรียก LIFF
      UI.setStatus("NO-LIFF mode (test) ✅");
      profile = { userId: "U_WEB_TEST", displayName: "Web Test", pictureUrl: "" };
      UI.renderProfile(profile);
    } else {
      UI.setStatus("Initializing LIFF...");
      profile = await LiffAuth.init();
      if (!profile) return;
      UI.renderProfile(profile);
      UI.setStatus("Ready ✅");
    }

    UI.$("btnRegister")?.addEventListener("click", () => onRegister(profile));

    // ถ้าคุณทำ onInstall/onPoints/onRedeem แล้วค่อย bind เพิ่ม
    // UI.$("btnInstall")?.addEventListener("click", () => onInstall(profile));
    // UI.$("btnPoints")?.addEventListener("click", () => onPoints(profile));
    // UI.$("btnRedeem")?.addEventListener("click", () => onRedeem(profile));

  } catch (e) {
    console.error(e);
    UI.setStatus("ERROR: " + (e?.message || String(e)));
  }
})();
