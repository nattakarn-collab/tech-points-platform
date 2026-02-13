document.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById("status");
  const btn = document.getElementById("btn");

  status.textContent = "Ready ✅ (GitHub Pages)";

  btn.addEventListener("click", () => {
    alert("Hello! Web is working ✅");
  });
});
