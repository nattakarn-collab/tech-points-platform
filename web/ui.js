window.UI = (function () {
  const $ = (id) => document.getElementById(id);

  function getTabFromUrl() {
    const u = new URL(window.location.href);
    const tab = (u.searchParams.get("tab") || "").toLowerCase();
    if (window.APP_CONFIG.TABS.includes(tab)) return tab;

    // รองรับ hash เช่น #points
    const hash = (u.hash || "").replace("#", "").toLowerCase();
    if (window.APP_CONFIG.TABS.includes(hash)) return hash;

    return window.APP_CONFIG.DEFAULT_TAB;
  }

  function setActiveTab(tab) {
    window.APP_CONFIG.TABS.forEach(t => {
      const panel = $(`panel-${t}`);
      if (panel) panel.style.display = (t === tab) ? "" : "none";
    });

    document.querySelectorAll(".tab").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tab);
    });
  }

  function bindTabs() {
    document.querySelectorAll(".tab").forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        // อัปเดต URL ให้แชร์ลิงก์ได้
        const u = new URL(window.location.href);
        u.searchParams.set("tab", tab);
        history.replaceState({}, "", u.toString());
        setActiveTab(tab);
      });
    });
  }

  function renderProfile(p) {
    $("status").textContent = "LIFF Ready ✅";
    $("displayName").textContent = p?.displayName || "-";
    $("userId").textContent = p?.userId || "-";
  }

  function renderOut(id, obj) {
    $(id).textContent = JSON.stringify(obj, null, 2);
  }

  function setStatus(text) { $("status").textContent = text; }

  return {
    $,
    getTabFromUrl,
    setActiveTab,
    bindTabs,
    renderProfile,
    renderOut,
    setStatus,
  };
})();
