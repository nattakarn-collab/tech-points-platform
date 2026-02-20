window.Api = (function () {
  async function post(payload) {
    const url = window.APP_CONFIG?.APPS_SCRIPT_URL;
    if (!url) throw new Error("Missing APPS_SCRIPT_URL");

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return await res.json();
  }

  return { post };
})();
