// liff.js
window.LiffAuth = (function () {
  let profile = null;

  async function init() {
    const LIFF_ID = window.APP_CONFIG?.LIFF_ID;
    if (!LIFF_ID) throw new Error("LIFF_ID ยังไม่ถูกตั้งค่าใน config.js");

    // อ่าน tab ปัจจุบัน แล้วสร้าง redirect กลับมาหน้าเดิม (คง tab)
    const u = new URL(location.href);
    const tab = u.searchParams.get("tab") || window.APP_CONFIG?.DEFAULT_TAB || "register";
    u.searchParams.set("tab", tab);
    const redirectUri = u.toString();

    try {
      await liff.init({
        liffId: LIFF_ID,
        withLoginOnExternalBrowser: true, // ✅ ทำให้ login บน Chrome/Safari ได้
      });

      // ถ้าเปิดนอก LINE และยังไม่ login -> ให้ login แล้วเด้งกลับมาหน้าเดิม
      if (!liff.isLoggedIn()) {
        if (window.UI?.setStatus) UI.setStatus("Redirecting to LINE login...");
        liff.login({ redirectUri });
        return null;
      }

      profile = await liff.getProfile();
      return profile;

    } catch (e) {
      const msg = e?.message || String(e);
      if (window.UI?.setStatus) UI.setStatus("LIFF ERROR: " + msg);
      console.error("LIFF init error:", e);
      throw e;
    }
  }

  function getProfile() {
    return profile;
  }

  return { init, getProfile };
})();
