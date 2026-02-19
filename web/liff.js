// liff.js
window.LiffAuth = (function () {
  let profile = null;

  async function init() {
    const LIFF_ID = window.APP_CONFIG?.LIFF_ID;
    if (!LIFF_ID) throw new Error("LIFF_ID ยังไม่ถูกตั้งค่าใน config.js");

    await liff.init({ liffId: LIFF_ID });

    if (!liff.isLoggedIn()) {
      liff.login();
      return null; // redirect ไป login
    }

    profile = await liff.getProfile();
    return profile;
  }

  function getProfile() {
    return profile;
  }

  return { init, getProfile };
})();
