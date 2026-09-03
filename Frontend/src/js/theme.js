/**
 * ================================================================
 * SMART CAFETERIA - SHARED THEME LIGHT / DARK / SYSTEM MODE
 * ================================================================
 * Features:
   - Light / Dark / System mode support
   - Smooth transitions (120ms)
   - System preference detection
   - localStorage persistence
   - Cross-tab synchronization
   - No white-flash on load (applies saved theme immediately)
 * ================================================================
 */
(function () {
  "use strict";

  var STORAGE_KEY = "scos_theme";

  function getTheme() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;

    // Check system preference if no explicit selection
    if (window.matchMedia) {
      var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    }
    return "light";
  }

  function applyTheme(theme) {
    var root = document.documentElement;

    // Remove all theme classes first
    root.classList.remove("theme-light", "theme-dark", "system", "dark");

    // Resolve the effective theme when in "system" mode so that the
    // data-theme attribute (used by target="_blank" CSS like dark-theme.css)
    // reflects the actual system preference.
    var effective;
    if (theme === "system") {
      root.classList.add("system");
      effective = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      effective = theme;
    }

    if (effective === "dark") {
      root.classList.add("theme-dark", "dark");
    } else {
      root.classList.add("theme-light");
    }

    // Keep CSS that targets [data-theme="..."] in sync (e.g. dark-theme.css).
    root.setAttribute("data-theme", effective);

    // Store the selected theme (not system, since system is inferred)
    if (theme !== "system") {
      localStorage.setItem(STORAGE_KEY, theme);
    }

    // Update exposed theme value for external use
    window.ScosTheme.current = theme;
  }

  function initTheme() {
    var current = getTheme();
    applyTheme(current);
    return current;
  }

  // Apply immediately on script load (in <head> to avoid flash)
  window.ScosTheme = {
    get: function() { return localStorage.getItem(STORAGE_KEY) || "light"; },
    apply: applyTheme,
    init: initTheme,
    current: "light"
  };

  // Listen for changes from other tabs
  window.addEventListener("storage", function (e) {
    if (e.key === STORAGE_KEY && e.newValue) {
      applyTheme(e.newValue);
    }
  });

  // In "system" mode, react to OS-level theme changes.
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
      var current = localStorage.getItem(STORAGE_KEY);
      if (!current || current === "system") applyTheme("system");
    });
  }

  // Export initial theme
  window.ScosTheme.current = initTheme();

  // ---- Generic theme-toggle wiring (works on any page that loads this file) ----
  function syncToggleIcons() {
    var current = window.ScosTheme.get();
    var root = document.documentElement;
    var isDark = root.classList.contains("dark");

    document.querySelectorAll("[data-theme-toggle], .theme-toggle, .theme-toggle-btn").forEach(function (btn) {
      var target = btn.getAttribute("data-theme-toggle");
      // If the button declares a specific target theme, mark it active only
      // when it matches. Otherwise (a simple toggle button) reflect state.
      if (target === "dark" || target === "light") {
        btn.classList.toggle("active-theme-btn", target === (isDark ? "dark" : "light"));
      }
      var icon = btn.querySelector("i");
      if (icon && !target) {
        icon.className = "fa-solid " + (isDark ? "fa-sun" : "fa-moon");
        btn.title = isDark ? "Light Mode" : "Dark Mode";
      }
    });
  }

  function setupToggleButtons() {
    document.querySelectorAll("[data-theme-toggle], .theme-toggle, .theme-toggle-btn").forEach(function (btn) {
      if (btn.dataset.scosBound) return;
      btn.dataset.scosBound = "1";
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-theme-toggle");
        var next;
        if (target === "dark") {
          next = "dark";
        } else if (target === "light") {
          next = "light";
        } else if (target === "system") {
          next = "system";
        } else {
          // Plain toggle button: flip current preference.
          next = document.documentElement.classList.contains("dark") ? "light" : "dark";
        }
        applyTheme(next);
        syncToggleIcons();
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      syncToggleIcons();
      setupToggleButtons();
    });
  } else {
    syncToggleIcons();
    setupToggleButtons();
  }
})();