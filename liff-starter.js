// ===== CONFIG (ของคุณ) =====
const LIFF_ID = "2009127023-sgWJernO";
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzyzubdy2RHBv88vZmylzxy2_tL1FzQypLUSmQCbeH9Dq3KOAIKPrkA23DvZln9zx783Q/exec";

// ===== INIT =====
async function liffInit(){
  await liff.init({ liffId: LIFF_ID });

  if (!liff.isLoggedIn()){
    liff.login();
    return;
  }

  const profile = await liff.getProfile();
  window.__LIFF_PROFILE__ = profile;

  const uidEl = document.getElementById("userId");
  if (uidEl) uidEl.textContent = profile.userId;

  const dnEl = document.getElementById("displayName");
  if (dnEl) dnEl.textContent = profile.displayName || "-";
}

// ===== API POST =====
async function apiPost(sheet, action, payload){
  const url = `${WEB_APP_URL}?sheet=${encodeURIComponent(sheet)}&action=${encodeURIComponent(action)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type":"text/plain;charset=utf-8" },
    body: JSON.stringify(payload || {})
  });

  const text = await res.text();
  try { return JSON.parse(text); }
  catch { return { ok:false, error:"INVALID_JSON", raw:text }; }
}

// ===== TOAST =====
function toast(msg, ok=true){
  const el = document.getElementById("toast");
  if (!el) return alert(msg);
  el.textContent = msg;
  el.className = ok ? "mini ok" : "mini err";
}

// เริ่มทำงานเมื่อหน้าโหลดเสร็จ
window.addEventListener("load", () => {
  if (typeof liff === "undefined"){
    // ถ้า LIFF SDK ยังไม่มา จะเห็นข้อความนี้ในหน้าเว็บ
    toast("LIFF SDK not loaded", false);
    return;
  }
  liffInit().catch(err => toast(String(err), false));
});
