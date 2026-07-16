/**
 * KidsLab platform SDK — always injected into built courseware.
 * Preferences and i18n stay local; analytics extends this object only when configured.
 */
(() => {
  'use strict';

  const w = window;
  const cool = w.cool || {};
  if (cool.sdkVersion) return;

  const storage = {
    get(key, fallback = null) {
      try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : value;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch {
        return false;
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch {
        return false;
      }
    },
  };

  const listeners = new Set();
  const validLangs = new Set(['zh', 'en']);
  const validThemes = new Set(['light', 'dark']);
  const systemLang = (navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en';
  let systemTheme = 'light';
  try {
    systemTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    // Browsers without matchMedia use the light theme.
  }

  let lang = storage.get('kidslab.lang', systemLang);
  let theme = storage.get('kidslab.theme', systemTheme);
  if (!validLangs.has(lang)) lang = systemLang;
  if (!validThemes.has(theme)) theme = systemTheme;

  function applyDocument() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.documentElement.dataset.theme = theme;
  }

  function notify(kind, value) {
    const change = { kind, value };
    for (const listener of [...listeners]) listener(change);
    w.dispatchEvent(new CustomEvent(`${kind}change`, { detail: { [kind]: value } }));
  }

  const preferences = {
    get lang() {
      return lang;
    },
    get theme() {
      return theme;
    },
    setLang(value) {
      if (!validLangs.has(value)) throw new RangeError(`Unsupported language: ${value}`);
      if (value === lang) return;
      lang = value;
      storage.set('kidslab.lang', value);
      applyDocument();
      notify('lang', value);
    },
    setTheme(value) {
      if (!validThemes.has(value)) throw new RangeError(`Unsupported theme: ${value}`);
      if (value === theme) return;
      theme = value;
      storage.set('kidslab.theme', value);
      applyDocument();
      notify('theme', value);
    },
    toggleLang() {
      this.setLang(lang === 'zh' ? 'en' : 'zh');
    },
    toggleTheme() {
      this.setTheme(theme === 'light' ? 'dark' : 'light');
    },
    subscribe(listener) {
      if (typeof listener !== 'function') throw new TypeError('Preference listener must be a function');
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };

  function bindI18n(messages, options = {}) {
    if (!messages || typeof messages !== 'object') throw new TypeError('Messages must be an object');
    const root = options.root || document;
    if (!root.querySelectorAll && !root.matches) throw new TypeError('i18n root must be a Document or Element');

    function t(key, ...args) {
      const value = messages[lang]?.[key] ?? messages.zh?.[key] ?? messages.en?.[key];
      if (typeof value === 'function') return value(...args);
      return value ?? key;
    }

    function render(kind = 'lang') {
      const nodes = [];
      if (root.matches?.('[data-t]')) nodes.push(root);
      if (root.querySelectorAll) nodes.push(...root.querySelectorAll('[data-t]'));
      for (const node of nodes) {
        const value = t(node.dataset.t);
        if (typeof value === 'string') node.textContent = value;
      }
      options.onChange?.({ kind, lang, theme, t });
    }

    const unsubscribe = preferences.subscribe(({ kind }) => {
      if (kind === 'lang') render('lang');
      else options.onChange?.({ kind, lang, theme, t });
    });
    render('init');

    return {
      t,
      render,
      destroy: unsubscribe,
    };
  }

  cool.sdkVersion = 1;
  cool.storage = storage;
  cool.preferences = preferences;
  cool.bindI18n = bindI18n;
  if (typeof cool.track !== 'function') cool.track = () => {};
  if (typeof cool.stage !== 'function') cool.stage = () => {};
  w.cool = cool;
  applyDocument();
})();
