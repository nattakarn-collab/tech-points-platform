// ui.js
window.UI = (function () {
  const $ = (id) => document.getElementById(id);

  function setStatus(text) {
    $("status").textContent = text;
  }

  function renderProfile(p) {
    $("displayName").textContent = p?.displayName || "-";
    $("userId").textContent = p?.userId || "-";
  }

  function renderOut(outId, obj) {
    $(outId).textContent = JSON.stringify(obj, null, 2);
  }

  function bindTabs() {
    document.querySelectorAll(".tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        setActiveTab(tab);
        const u = new URL(location.href);
        u.searchParams.set("tab", tab);
        history.replaceState(null, "", u.toString());
      });
    });
  }

  function setActiveTab(tab) {
    const allowed = window.APP_CONFIG?.TABS || [];
    const t = allowed.includes(tab) ? tab : (window.APP_CONFIG?.DEFAULT_TAB || "register");

    document.querySelectorAll(".tab").forEach((b) => b.classList.toggle("active", b.dataset.tab === t));
    document.querySelectorAll(".panel").forEach((p) => (p.style.display = "none"));
    const panel = $("panel-" + t);
    if (panel) panel.style.display = "";

    setStatus("Ready ✅");
    return t;
  }

  function getTabFromUrl() {
    const u = new URL(location.href);
    return u.searchParams.get("tab") || (window.APP_CONFIG?.DEFAULT_TAB || "register");
  }

  function requireValue(id, label) {
    const v = $(id).value.trim();
    if (!v) throw new Error(`กรุณากรอก ${label}`);
    return v;
  }

  return { $, setStatus, renderProfile, renderOut, bindTabs, setActiveTab, getTabFromUrl, requireValue };
})();
