// docs/api.js
window.Api = (function () {
  async function post(payload) {
    const url = window.APP_CONFIG?.APPS_SCRIPT_URL;
    if (!url) throw new Error("APPS_SCRIPT_URL is missing in config.js");

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Apps Script จะตอบเป็น JSON string
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { ok:false, raw:text }; }

    return data;
  }

  return { post };
})();
