/**
 * Language Switcher Component
 * Unified wrapper – delegates to global i18n engine (utils/i18n.js)
 * Allows users to switch between English and Amharic on ALL pages
 */
import { getCurrentLanguage, setLanguage, applyTranslations, renderLangSwitcher as renderGlobalSwitcher } from "./utils/i18n.js";

export function initLanguageSwitcher() {
  // Try to find header container; global i18n will auto-inject anyway, but we also support manual placement
  const header = document.querySelector(".header .container") ||
                 document.querySelector(".nav-container") ||
                 document.querySelector("header") ||
                 document.querySelector("nav");
  if (header && !header.querySelector(".scos-lang-select, #langToggleSelect")) {
    const wrapper = document.createElement("div");
    renderGlobalSwitcher(wrapper);
    header.appendChild(wrapper.firstElementChild || wrapper);
  }
  attachLanguageSwitcherEvents();
}

export function attachLanguageSwitcherEvents() {
  document.querySelectorAll(".scos-lang-select, #langToggleSelect, #preferred-language").forEach((el) => {
    if (el.dataset.i18nBound) return;
    el.dataset.i18nBound = "1";
    el.addEventListener("change", (e) => setLanguage(e.target.value));
  });
  // Also bind button-style switchers (.lang-btn)
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    if (btn.dataset.i18nBound) return;
    btn.dataset.i18nBound = "1";
    btn.addEventListener("click", function () {
      const lang = this.getAttribute("data-lang");
      setLanguage(lang);
      updateActiveButton(lang);
    });
  });
  updateActiveButton(getCurrentLanguage());
}

function updateActiveButton(lang) {
  document.querySelectorAll(".lang-btn").forEach((btn) => btn.classList.remove("active"));
  const activeBtn = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
  if (activeBtn) activeBtn.classList.add("active");
  document.querySelectorAll(".scos-lang-select, #langToggleSelect").forEach((s) => { s.value = lang; });
}

export function translateText(key) {
  const { getText } = require ? require("./utils/i18n.js") : { getText: null };
  if (getText) return getText(key);
  // Fallback to global
  if (typeof window !== "undefined" && window.getText) return window.getText(key);
  return key;
}

if (typeof window !== "undefined") {
  window.addEventListener("language:changed", () => {
    applyTranslations();
    updateActiveButton(getCurrentLanguage());
  });
  window.addEventListener("languageChanged", () => {
    applyTranslations();
    updateActiveButton(getCurrentLanguage());
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLanguageSwitcher);
  } else {
    initLanguageSwitcher();
  }
}
