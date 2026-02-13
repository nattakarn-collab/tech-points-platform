const LIFF_ID = "2009127023-sgWJernO";

const $ = (id) => document.getElementById(id);

async function initLiff() {
  try {
    await liff.init({ liffId: LIFF_ID });

    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    const profile = await liff.getProfile();

    if ($("status")) $("status").textContent = "LIFF Ready ✅";
    if ($("displayName")) $("displayName").textContent = profile.displayName || "-";
    if ($("userId")) $("userId").textContent = profile.userId || "-";

    // เก็บไว้ใช้ต่อ (ส่งไป Apps Script/Backend)
    window.__LIFF_PROFILE__ = profile;

  } catch (err) {
    console.error(err);
    if ($("status")) $("status").textContent = "LIFF Error ❌";
    alert("LIFF init error: " + (err?.message || err));
  }
}

window.addEventListener("DOMContentLoaded", initLiff);
