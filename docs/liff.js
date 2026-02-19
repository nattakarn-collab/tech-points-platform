// liff.js
window.LiffAuth = (function () {
  let profile = null;

  async function init() {
    const LIFF_ID = window.APP_CONFIG?.LIFF_ID;
    if (!LIFF_ID) throw new Error("LIFF_ID ยังไม่ถูกตั้งค่าใน config.js");

    try {
      await liff.init({
        liffId: LIFF_ID,
        withLoginOnExternalBrowser: true, // ✅ สำคัญ: ให้ login ได้ใน Chrome/Safari
      });

      // ถ้ายังไม่ login -> ให้ login แล้วกลับมาหน้าเดิม (คง tab เดิมไว้)
      if (!liff.isLoggedIn()) {
        liff.login({ redirectUri: location.href }); // ✅ สำคัญ: กลับมาหน้าเดิม
        return null;
      }

      profile = await liff.getProfile();
      return profile;

    } catch (e) {
      // ให้เห็น error ชัด ๆ บนหน้าเว็บ
      if (window.UI?.setStatus) UI.setStatus("LIFF ERROR: " + (e?.message || String(e)));
      console.error("LIFF init error:", e);
      throw e;
    }
  }

  function getProfile() {
    return profile;
  }

  return { init, getProfile };
})();
