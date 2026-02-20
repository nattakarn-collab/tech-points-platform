// docs/api.js
window.Api = (function () {
  async function post(payload) {
    const url = window.APP_CONFIG?.APPS_SCRIPT_URL;
    if (!url) throw new Error("APPS_SCRIPT_URL is missing in config.js");

    const body = JSON.stringify(payload);

    // 1) พยายามส่งแบบ Beacon ก่อน (กัน CORS ได้ดีมาก)
    //    ข้อดี: เบราว์เซอร์ไม่ทำ preflight และส่งออกจริง
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: "text/plain;charset=UTF-8" });
        const ok = navigator.sendBeacon(url, blob);
        if (ok) {
          return { ok: true, mode: "BEACON_SENT", note: "Sent. Please check Google Sheet." };
        }
        // ถ้า sendBeacon ส่งไม่สำเร็จ ค่อย fallback ไป fetch no-cors
      }
    } catch (e) {
      // ignore แล้วไป fallback
    }

    // 2) Fallback: fetch แบบ no-cors (ส่งได้ แต่ “อ่านผลตอบกลับไม่ได้”)
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body,
    });

    // no-cors จะได้ opaque response อ่านไม่ได้ → ให้ถือว่าส่งแล้ว
    return { ok: true, mode: "FETCH_NO_CORS_SENT", note: "Sent. Please check Google Sheet." };
  }

  return { post };
})();
