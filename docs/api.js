// docs/api.js
window.Api = (function () {
  async function post(payload) {
    const url = window.APP_CONFIG?.APPS_SCRIPT_URL;
    if (!url) throw new Error("APPS_SCRIPT_URL is missing in config.js");

    // ✅ no-cors + ไม่ตั้ง headers = ไม่เกิด preflight
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(payload),
    });

    // no-cors อ่าน response ไม่ได้ ให้ถือว่าส่งออกไปแล้ว
    return { ok: true, mode: "FETCH_NO_CORS_SENT" };
  }

  return { post };
})();
