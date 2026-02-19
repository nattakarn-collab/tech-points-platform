window.LiffAuth = (function () {
  let profile = null;

  async function init() {
    const { LIFF_ID } = window.APP_CONFIG;

    await liff.init({ liffId: LIFF_ID });

    if (!liff.isLoggedIn()) {
      liff.login();
      return null; // หลัง login จะ reload เข้ามาใหม่
    }

    profile = await liff.getProfile();
    return profile;
  }

  function getProfile() {
    return profile;
  }

  return { init, getProfile };
})();
