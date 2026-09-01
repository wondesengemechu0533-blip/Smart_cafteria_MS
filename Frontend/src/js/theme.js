/**
 * ================================================================
 * SHARED THEME - Light / Dark Mode
 * ================================================================
 * Include <script src="/src/js/theme.js"></script> in <head> of every
 * page to apply the saved theme before paint (avoids white flash).
 * ================================================================
 */
(function () {
  "use strict";

  var STORAGE_KEY = "scos_theme";

  function getTheme() {
    return localStorage.getItem(STORAGE_KEY) || "light";
  }

  function applyTheme(theme) {
    var root = document.documentElement;
    root.classList.remove("theme-light", "theme-dark", "dark");
    if (theme === "dark") {
      root.classList.add("theme-dark", "dark");
    } else if (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      root.classList.add("theme-dark", "dark");
    } else {
      root.classList.add("theme-light");
    }
    // Sync toggle buttons if they exist on the page
    syncToggleButtons(theme);
  }

  function syncToggleButtons(theme) {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      var t = btn.getAttribute("data-theme-toggle");
      if (t === theme) {
        btn.classList.add("active-theme-btn");
        btn.classList.remove("inactive-theme-btn");
      } else {
        btn.classList.remove("active-theme-btn");
        btn.classList.add("inactive-theme-btn");
      }
    });
  }

  function toggleTheme() {
    var current = getTheme();
    var next = current === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
    syncToggleButtons(next);
  }

  // Apply immediately (script is in <head>)
  applyTheme(getTheme());

  // Expose globally
  window.ScosTheme = { get: getTheme, apply: applyTheme, toggle: toggleTheme };

  // Listen for changes from other tabs
  window.addEventListener("storage", function (e) {
    if (e.key === STORAGE_KEY && e.newValue) {
      applyTheme(e.newValue);
      syncToggleButtons(e.newValue);
    }
  });
})();
