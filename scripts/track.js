/**
 * KidsLab 埋点 tracker —— 构建时由 scripts/build.mjs 压缩并内联注入课件 index.html。
 *
 * 目标：回答「哪个交互本身好玩」——复玩率、久玩不腻、停留时长、退出点、循环行为。
 * 手段：语义事件 + 计数，不采集坐标、不录屏、不存任何个人信息。
 *
 * 自动事件（课件零改动即有）:
 *   enter  进入课件（携带该设备第几次玩、是否首次）
 *   beat   可见状态下每 30s 心跳（携带累计活跃秒数、区间点击数）
 *   leave  离开/切后台（携带累计活跃秒数、当前阶段 → 退出点）
 *
 * 课件可选 API（埋点由构建注入，课件侧务必用可选链，未注入时自然空操作）:
 *   window.cool?.stage('level2')             // 汇报阶段切换 → 哪一步退出/哪一步开始探索
 *   window.cool?.track('flip')               // 汇报语义动作 → 重复次数/循环行为
 *   window.cool?.track('score', {value: 3})  // 可附带数值
 *
 * 隐私守卫：尊重 DNT / GPC / localStorage kidslab.track === 'off'，命中任一则整体空转。
 * 设备 id 是本地生成的随机串，与真实身份无关；上报仅含事件名/计数/时长。
 *
 * 占位符 ANALYTICS_ENDPOINT / COURSE_ID（双下划线包裹）由 build.mjs 替换；未配置 endpoint 时不注入。
 */
(() => {
  'use strict';
  const ENDPOINT = '__ANALYTICS_ENDPOINT__';
  const COURSE = '__COURSE_ID__';
  const w = window;
  const noop = { track() {}, stage() {} };

  let optOut = false;
  try {
    optOut = navigator.doNotTrack === '1' || !!navigator.globalPrivacyControl ||
      localStorage.getItem('kidslab.track') === 'off';
  } catch { /* 忽略 */ }
  if (w.cool || !ENDPOINT || ENDPOINT.charAt(0) === '_' || optOut) { w.cool = w.cool || noop; return; }

  const now = () => Date.now();
  const rid = () => {
    try { return crypto.randomUUID().replace(/-/g, '').slice(0, 8); }
    catch { return Math.random().toString(36).slice(2, 10); }
  };
  const ls = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* 忽略 */ } },
  };

  // 匿名设备 id（本地随机串）+ 本课件在此设备的累计游玩次数 → 复玩率
  let did = ls.get('kidslab.did');
  if (!did) { did = rid(); ls.set('kidslab.did', did); }
  let visits = 1;
  try {
    const map = JSON.parse(ls.get('kidslab.visits') || '{}');
    visits = (map[COURSE] || 0) + 1;
    map[COURSE] = visits;
    ls.set('kidslab.visits', JSON.stringify(map));
  } catch { /* 忽略 */ }

  const sid = rid();
  const lang = ls.get('kidslab.lang') ||
    ((navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en');
  let pointer = 'mouse';
  try { if (matchMedia('(pointer: coarse)').matches) pointer = 'touch'; } catch { /* 忽略 */ }

  const t0 = now();
  let stage = '';                                    // 当前阶段，由 cool.stage() 汇报
  let activeMs = 0;                                  // 累计可见时长
  let visibleSince = document.hidden ? 0 : t0;
  let taps = 0;                                      // 自上次心跳以来的 pointerdown 数
  let streakName = '';                               // 连续重复动作检测
  let streak = 0;
  let acts = 0;                                      // 自定义事件会话配额
  let leaveSent = false;
  const active = () => activeMs + (visibleSince ? now() - visibleSince : 0);

  let queue = [];
  function push(n, g, extra) {
    queue.push(Object.assign({ n, g: g || stage, t: now() - t0 }, extra));
    if (queue.length >= 20) flush();
  }
  function flush() {
    if (!queue.length) return;
    const body = JSON.stringify({ v: 1, c: COURSE, d: did, s: sid, l: lang, p: pointer, e: queue });
    queue = [];
    try {
      // text/plain 避免 CORS 预检；sendBeacon 保证卸载页面时仍可送达
      const sent = navigator.sendBeacon &&
        navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'text/plain' }));
      if (!sent)
        fetch(ENDPOINT, { method: 'POST', body, keepalive: true, headers: { 'content-type': 'text/plain' } })
          .catch(() => {});
    } catch { /* 埋点永不影响课件 */ }
  }
  function snapshot(n) {
    push(n, stage, { a: Math.round(active() / 1000), taps });
    taps = 0;
  }

  // ---- 自动事件 ----
  push('enter', '', { visits, first: visits === 1 ? 1 : 0 });
  flush();

  addEventListener('pointerdown', () => { taps++; }, { capture: true, passive: true });

  const beatTimer = setInterval(() => {
    if (document.hidden) return;
    if (active() > 3600000) { clearInterval(beatTimer); return; }   // 60 分钟后停止心跳
    snapshot('beat');
    flush();
  }, 30000);

  function onHide() {
    if (leaveSent) return;
    leaveSent = true;
    if (visibleSince) { activeMs += now() - visibleSince; visibleSince = 0; }
    snapshot('leave');
    flush();
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) onHide();
    else { leaveSent = false; if (!visibleSince) visibleSince = now(); }
  });
  addEventListener('pagehide', onHide);

  // ---- 课件可选 API ----
  w.cool = {
    track(name, opts) {
      if (typeof name !== 'string' || !name || acts >= 500) return;
      name = name.slice(0, 48);
      const g = (opts && typeof opts.stage === 'string' ? opts.stage.slice(0, 48) : '') || stage;
      if (name === streakName) streak++; else { streakName = name; streak = 1; }
      // 与队列中上一条同名动作合并计数：连点 50 次也只占 1 行（k=50, streak=最长连击）
      const last = queue[queue.length - 1];
      if (last && last.n === 'act:' + name && last.g === g) {
        last.k = (last.k || 1) + 1;
        last.streak = streak;
        last.t = now() - t0;
      } else {
        acts++;
        push('act:' + name, g, {
          k: 1, streak,
          val: opts && typeof opts.value === 'number' && isFinite(opts.value) ? opts.value : 0,
        });
      }
    },
    stage(name) {
      if (typeof name !== 'string' || !name || name === stage) return;
      stage = name.slice(0, 48);
      streakName = ''; streak = 0;
      push('stage', stage, {});
    },
  };
})();
