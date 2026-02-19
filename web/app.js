window.addEventListener("DOMContentLoaded", async () => {
  try {
    UI.setStatus("Loading LIFF...");

    const p = await LiffAuth.init();
    if (!p) return; // กรณี redirect ไป login แล้ว

    UI.renderProfile(p);
    UI.bindTabs();

    // เปิดแท็บตาม ?tab=xxx
    const startTab = UI.getTabFromUrl();
    UI.setActiveTab(startTab);

    // Bind ปุ่ม
    UI.$("btnRegister").addEventListener("click", () => onRegister(p));
    UI.$("btnInstall").addEventListener("click", () => onInstall(p));
    UI.$("btnPoints").addEventListener("click", () => onPoints(p));
    UI.$("btnRedeem").addEventListener("click", () => onRedeem(p));

    // ถ้าเข้าแท็บ points จาก rich menu ให้โหลดคะแนนอัตโนมัติ
    if (startTab === "points") {
      await onPoints(p);
    }
  } catch (err) {
    console.error(err);
    UI.setStatus("LIFF Error ❌");
    alert("Error: " + (err?.message || err));
  }
});

async function onRegister(profile) {
  const payload = {
    action: "register",
    userId: profile.userId,
    displayName: profile.displayName || "",
    pictureUrl: profile.pictureUrl || "",

    no: UI.$("m_no").value.trim(),
    name: UI.$("m_name").value.trim(),
    lastName: UI.$("m_lastName").value.trim(),
    phone: UI.$("m_phone").value.trim(),
    province: UI.$("m_province").value.trim(),

    bankName: UI.$("m_bankName").value.trim(),
    bankAccountNo: UI.$("m_bankAccountNo").value.trim(),
    bankAccountName: UI.$("m_bankAccountName").value.trim(),
    eMail: UI.$("m_email").value.trim(),
  };

  const out = await Api.post(payload);
  UI.renderOut("outRegister", out);
}

async function onInstall(profile) {
  const serial = UI.$("i_serial").value.trim();
  if (!serial) {
    UI.renderOut("outInstall", { ok:false, error:"กรุณากรอก serialNumber" });
    return;
  }

  const payload = {
    action: "install",
    userId: profile.userId,
    serialNumber: serial,
    serialNumberPhoto: UI.$("i_serialPhoto").value.trim(),
    installPhoto: UI.$("i_installPhoto").value.trim(),
  };

  const out = await Api.post(payload);
  UI.renderOut("outInstall", out);
}

async function onPoints(profile) {
  const payload = { action: "points", userId: profile.userId };
  const out = await Api.post(payload);

  UI.$("balance").textContent = (out?.balancePoints ?? "-");
  UI.renderOut("outPoints", out);
}

async function onRedeem(profile) {
  const pts = Number(UI.$("r_points").value || 0);
  if (!(pts > 0)) {
    UI.renderOut("outRedeem", { ok:false, error:"กรุณากรอกแต้มที่ต้องการแลก (มากกว่า 0)" });
    return;
  }

  const payload = { action: "redeem", userId: profile.userId, points: pts };
  const out = await Api.post(payload);
  UI.renderOut("outRedeem", out);
}
