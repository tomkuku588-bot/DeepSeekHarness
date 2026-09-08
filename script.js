(function () {
  "use strict";

  const supportedLanguages = new Set(["zh", "en"]);
  const storageKey = "dsharness.legal.language";
  const query = new URLSearchParams(window.location.search);

  function readStoredLanguage() {
    try {
      return localStorage.getItem(storageKey);
    } catch (_error) {
      return null;
    }
  }

  function storeLanguage(language) {
    try {
      localStorage.setItem(storageKey, language);
    } catch (_error) {
      // Language switching remains available when storage is blocked.
    }
  }

  function initialLanguage() {
    const requested = query.get("lang");
    if (supportedLanguages.has(requested)) {
      return requested;
    }

    const stored = readStoredLanguage();
    if (supportedLanguages.has(stored)) {
      return stored;
    }

    return navigator.language && navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
  }

  function preserveLanguageInLinks(language) {
    document.querySelectorAll("[data-preserve-lang]").forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:")) {
        return;
      }

      const target = new URL(href, window.location.href);
      target.searchParams.set("lang", language);
      const file = target.pathname.split("/").pop() || "index.html";
      link.setAttribute("href", `${file}${target.search}${target.hash}`);
    });
  }

  function applyLanguage(language) {
    const active = supportedLanguages.has(language) ? language : "zh";
    document.documentElement.lang = active === "zh" ? "zh-CN" : "en";

    document.querySelectorAll("[data-lang-panel]").forEach((panel) => {
      panel.hidden = panel.getAttribute("data-lang-panel") !== active;
    });

    document.querySelectorAll("[data-lang-button]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-lang-button") === active));
    });

    document.querySelectorAll("[data-i18n-zh][data-i18n-en]").forEach((node) => {
      node.textContent = node.getAttribute(`data-i18n-${active}`);
    });

    const title = document.body.getAttribute(`data-title-${active}`);
    if (title) {
      document.title = title;
    }

    preserveLanguageInLinks(active);
    storeLanguage(active);

    const current = new URL(window.location.href);
    current.searchParams.set("lang", active);
    window.history.replaceState({}, "", current);
  }

  document.querySelectorAll("[data-lang-button]").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.getAttribute("data-lang-button")));
  });

  applyLanguage(initialLanguage());
})();
