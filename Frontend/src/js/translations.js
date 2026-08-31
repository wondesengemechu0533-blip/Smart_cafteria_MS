/**
 * SMART CAFETERIA - BILINGUAL TRANSLATION SYSTEM
 * Unified wrapper around utils/i18n.js for backward compatibility
 * Now delegates to the global i18n engine so language persists across ALL pages.
 */

import { translations, getCurrentLanguage, setLanguage as setGlobalLang, getText, applyTranslations } from "./utils/i18n.js";

// Re-export as TRANSLATIONS for legacy code (mapped from unified translations)
export const TRANSLATIONS = translations;

export class LanguageManager {
  constructor() {
    this.currentLanguage = getCurrentLanguage();
    this.applyLanguage();
  }

  setLanguage(lang) {
    if (lang === "en" || lang === "am") {
      this.currentLanguage = lang;
      setGlobalLang(lang);
      this.applyLanguage();
    }
  }

  getLanguage() {
    return getCurrentLanguage();
  }

  t(key) {
    return getText(key);
  }

  applyLanguage() {
    applyTranslations();
    const lang = getCurrentLanguage();
    document.documentElement.lang = lang;
    document.body.classList.toggle("lang-am", lang === "am");
    document.body.classList.toggle("lang-en", lang === "en");
  }

  translateElement(element, key) {
    if (!element) return;
    const translation = getText(key);
    if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
      if (element.hasAttribute("placeholder")) element.setAttribute("placeholder", translation);
      else element.placeholder = translation;
    } else {
      element.textContent = translation;
    }
  }

  translateElements() {
    applyTranslations();
  }

  translatePage() {
    applyTranslations();
  }
}

// Auto-initialize on page load, but delegate to global engine
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.languageManager = new LanguageManager();
    window.languageManager.translatePage();
  });
} else {
  window.languageManager = new LanguageManager();
  window.languageManager.translatePage();
}

// Keep storage keys in sync
window.addEventListener("language:changed", () => {
  if (window.languageManager) window.languageManager.currentLanguage = getCurrentLanguage();
});
window.addEventListener("languageChanged", () => {
  if (window.languageManager) window.languageManager.currentLanguage = getCurrentLanguage();
});
