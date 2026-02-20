window.Api = (function () {
  async function post(payload) {
    const url = window.APP_CONFIG?.APPS_SCRIPT_URL;
    if (!url) throw new Error("Missing APPS_SCRIPT_URL");

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text(); // เผื่อไม่ใช่ JSON จะได้เห็นข้อความ
    try { return JSON.parse(text); } catch { return { ok:false, raw:text }; }
  }
  return { post };
})();
