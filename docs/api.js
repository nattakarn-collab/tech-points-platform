// api.js
window.Api = (function () {
  async function post(payload) {
    const url = window.APP_CONFIG?.APPS_SCRIPT_URL;
    if (!url || String(url).includes("PUT_YOUR")) {
      throw new Error("APPS_SCRIPT_URL ยังไม่ถูกตั้งค่าใน config.js");
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return await res.json();
  }

  return { post };
})();
