/**
 * KidsLab platform SDK — always injected into built courseware.
 * Preferences and i18n stay local; analytics extends this object only when configured.
 */
(() => {
  'use strict';

  const w = window;
  const cool = w.cool || {};
  if (cool.sdkVersion) return;

  /* 触控延时优化：取消双击缩放的手势仲裁等待，点按即时响应。
     只收紧浏览器手势，不影响课件内 touch-action:none 的拖拽画布。 */
  try { document.documentElement.style.touchAction = 'manipulation'; } catch { /* noop */ }

  const configuredCourseId = '__COURSE_ID__';
  const pathParts = location.pathname.split('/').filter(Boolean);
  const pathTail = pathParts.at(-1) || '';
  const inferredCourseId = pathTail.includes('.') ? pathParts.at(-2) : pathTail;
  const courseId = configuredCourseId.startsWith('__') ? inferredCourseId : configuredCourseId;

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

  const progressKey = courseId ? `kidslab.progress.${courseId}` : '';
  function readProgress() {
    if (!progressKey) return null;
    try {
      const value = JSON.parse(storage.get(progressKey, 'null'));
      if (!value || !['played', 'completed'].includes(value.status)) return null;
      return value;
    } catch {
      return null;
    }
  }

  function writeProgress(status, stage) {
    if (!progressKey) return null;
    const current = readProgress() || {};
    const next = {
      status: current.status === 'completed' ? 'completed' : status,
      stage: stage || current.stage || '',
      updatedAt: Date.now(),
    };
    if (current.status === next.status && current.stage === next.stage) return current;
    storage.set(progressKey, JSON.stringify(next));
    return next;
  }

  const progress = {
    get: readProgress,
    clear() {
      if (!progressKey) return false;
      return storage.remove(progressKey);
    },
  };

  cool.sdkVersion = 2;
  cool.courseId = courseId;
  cool.storage = storage;
  cool.preferences = preferences;
  cool.bindI18n = bindI18n;
  cool.progress = progress;
  if (typeof cool.track !== 'function') cool.track = () => {};
  cool.stage = (name) => {
    if (typeof name !== 'string' || !name) return;
    writeProgress('played', name.slice(0, 48));
  };
  cool.complete = () => writeProgress('completed');
  w.cool = cool;
  applyDocument();
})();
