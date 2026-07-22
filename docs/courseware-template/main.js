/* ============================================================
   ✏️ 课件名 · KidsLab 双语/主题模板
   —— 「语言 & 主题」段落是平台约定，整段复制、按需加 key，勿改机制
   ============================================================ */
(() => {
  'use strict';

  /* ================= 语言 & 主题 · Language & Theme ================= */
  const I18N = {
    zh: {
      doc: '✏️ 课件名 · KidsLab',
      back: '返回平台',
      title: '✏️ 课件名',
      tip0: '✏️ 一句 30 秒能看懂的上手提示',
      /* ✏️ 静态文案 key…；动态文案用函数：score: (n) => `得分 ${n}` */
    },
    en: {
      doc: '✏️ Course Title · KidsLab',
      back: 'Back to platform',
      title: '✏️ Course Title',
      tip0: '✏️ A one-line hint anyone gets in 30 seconds',
    },
  };

  /** 取当前语言文案；函数型 key 直接返回函数供调用方传参 */
  let t = (key) => key;
  /** 读取 CSS 主题变量（Canvas/three.js 取色必须走这里，勿硬编码） */
  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  const langBtn = document.getElementById('langBtn');
  const themeBtn = document.getElementById('themeBtn');

  langBtn?.addEventListener('click', () => window.cool.preferences.toggleLang());
  themeBtn?.addEventListener('click', () => window.cool.preferences.toggleTheme());

  /* ======================= ✏️ 游戏区 · Game ======================= */
  // ✏️ 状态、Canvas 初始化、玩法逻辑写在这里。
  //    - 触屏：用 pointerdown/pointermove/pointerup
  //    - 画布：监听 resize 与 themechange
  //    - 音频：核心操作/成功/错误/通关按实际状态提供不同音效，并配可见、可访问的静音开关
  //      AudioContext 只能在首次用户手势后创建或 resume()；失败时静默降级，音效不能是唯一反馈
  //      禁止在 pointermove、requestAnimationFrame 或物理帧中无节制创建音源；连续反馈要做状态边界、节流或复用节点

  /** 每帧/每次状态变化的统一渲染入口（语言、主题切换都会调用） */
  function render() {
    // ✏️ 用 t('key') / cssVar('--ink') 刷新动态界面
  }

  /* ============================ 启动 ============================ */
  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang, theme }) {
      t = translate;
      document.title = t('doc');
      if (langBtn) langBtn.textContent = lang === 'zh' ? 'EN' : '中';
      if (themeBtn) themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
      render();
    },
  });
})();
