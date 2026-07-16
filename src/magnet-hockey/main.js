/* ============================================================
   磁力冰球 · KidsLab 双语/主题模板
   —— 「语言 & 主题」段落是平台约定，整段复制、按需加 key，勿改机制
   ============================================================ */
(() => {
  'use strict';

  /* ================= 语言 & 主题 · Language & Theme ================= */
  const I18N = {
    zh: {
      doc: '磁力冰球 · KidsLab', back: '返回平台', title: '磁力冰球', tip0: '移动手磁铁，翻转 N/S，用吸力和斥力把冰球送进球门。',
      eyebrow: 'G2-3 · 看不见的力', heroTitle: '不许碰球，也能进球！', flip: '翻转磁铁', goggles: '磁场眼镜', gogglesOn: '摘下眼镜', reset: '重来', level: '关卡', time: '用时', flips: '翻面', north: 'N 北极', south: 'S 南极', next: '下一关', goalLabel: '球门', ironLabel: '铁板', woodLabel: '木板', fixedLabel: '固定磁铁', goalTitle: '进球啦！',
      l1: '1 推球入门', l2: '2 绕开雪糕桶', l3: '3 木板也挡不住', l4: '4 铁板偷走磁力', l5: '5 弯道固定磁铁', l6: '6 S 型冰道', l7: '7 限时射门', l8: '8 冠军混合赛',
      start: '手磁铁跟随指针。红 N 对红 N 会斥开，红 N 对蓝 S 会吸近。空格/按钮/双击可翻面。', fieldWow: '哇！磁场眼镜打开了：铁屑沿着看不见的磁力线排队，力现形了！', win: (s, f, star) => `进球！用时 ${s}s，翻面 ${f} 次，${star}`, foul: '哔——贴脸碰球犯规！海豹裁判把球捞回来了。', out: '球飞出界啦！海豹裁判摇摇头，重新开球。', blocked: '铁板会把磁力偷走；木板不会，磁力能隔着它作用。', fixed: '固定磁铁会推/拉冰球，试试借它打弧线球。', timeup: '时间到！别急，重开一次找更短路线。',
    },
    en: {
      doc: 'Magnet Hockey · KidsLab', back: 'Back to platform', title: 'Magnet Hockey', tip0: 'Move your hand magnet, flip N/S, pull and push the puck into the goal.',
      eyebrow: 'G2-3 · Invisible forces', heroTitle: 'Score without touching the puck!', flip: 'Flip magnet', goggles: 'Field goggles', gogglesOn: 'Remove goggles', reset: 'Reset', level: 'Level', time: 'Time', flips: 'Flips', north: 'N north', south: 'S south', next: 'Next level', goalLabel: 'GOAL', ironLabel: 'IRON', woodLabel: 'WOOD', fixedLabel: 'fixed', goalTitle: 'Goal!',
      l1: '1 Push to score', l2: '2 Around cones', l3: '3 Wood cannot stop it', l4: '4 Iron steals magnetism', l5: '5 Fixed-magnet curve', l6: '6 S-curve rink', l7: '7 Timed shot', l8: '8 Champion mix',
      start: 'The hand magnet follows your pointer. Red N repels red N; red N attracts blue S. Space/button/double-tap flips it.', fieldWow: 'Wow! Field goggles on: iron filings line up along invisible magnetic field lines!', win: (s, f, star) => `Goal! ${s}s, ${f} flips, ${star}`, foul: 'Tweet! Too close — touching the puck is a foul. Seal referee resets it.', out: 'The puck flew out! Seal referee shakes its head and drops it back.', blocked: 'Iron steals the magnetic force; wood does not, so the force passes through wood.', fixed: 'Fixed magnets can pull or push the puck. Borrow them for a curve shot.', timeup: 'Time up! Reset and hunt for a shorter route.',
    },
  };

  const LS = { lang: 'kidslab.lang', theme: 'kidslab.theme' };
  const store = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* 忽略 */ } } };
  let lang = store.get(LS.lang) || (navigator.language?.startsWith('zh') ? 'zh' : 'en');
  if (!I18N[lang]) lang = 'zh';
  let theme = store.get(LS.theme) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (theme !== 'light' && theme !== 'dark') theme = 'light';
  const t = (key) => I18N[lang][key] ?? I18N.zh[key] ?? key;
  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const langBtn = document.getElementById('langBtn');
  const themeBtn = document.getElementById('themeBtn');
  function applyLang() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = t('doc');
    document.querySelectorAll('[data-t]').forEach((n) => { const v = I18N[lang][n.dataset.t]; if (typeof v === 'string') n.textContent = v; });
    if (langBtn) langBtn.textContent = lang === 'zh' ? 'EN' : '中';
    fillLevels(); render();
  }
  function applyTheme() {
    document.documentElement.dataset.theme = theme;
    if (themeBtn) themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
    dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    render();
  }
  langBtn?.addEventListener('click', () => { lang = lang === 'zh' ? 'en' : 'zh'; store.set(LS.lang, lang); applyLang(); });
  themeBtn?.addEventListener('click', () => { theme = theme === 'light' ? 'dark' : 'light'; store.set(LS.theme, theme); applyTheme(); });

  /* ======================= 游戏区 · Game ======================= */
  const $ = (s) => document.querySelector(s);
  const canvas = $('#rink'), ctx = canvas.getContext('2d');
  const ui = { flip: $('#flipBtn'), goggles: $('#gogglesBtn'), reset: $('#resetBtn'), level: $('#levelSelect'), time: $('#timeText'), flips: $('#flipText'), narrator: $('#narrator'), modal: $('#winModal'), modalTitle: $('#modalTitle'), modalDesc: $('#modalDesc'), modalEmoji: $('#modalEmoji'), next: $('#nextBtn') };
  const LEVELS = [
    { key: 'l1', start: [.22, .5], goal: [.88, .5], limit: 0, obs: [], fixed: [] },
    { key: 'l2', start: [.2, .5], goal: [.88, .5], limit: 0, obs: [{ x: .48, y: .35, w: .08, h: .30, type: 'wood' }, { x: .6, y: .12, w: .05, h: .18, type: 'cone' }, { x: .6, y: .70, w: .05, h: .18, type: 'cone' }], fixed: [] },
    { key: 'l3', start: [.2, .72], goal: [.86, .28], limit: 0, obs: [{ x: .45, y: .12, w: .06, h: .76, type: 'wood' }], fixed: [] },
    { key: 'l4', start: [.18, .5], goal: [.88, .5], limit: 0, obs: [{ x: .45, y: .08, w: .07, h: .38, type: 'iron' }, { x: .45, y: .54, w: .07, h: .38, type: 'iron' }, { x: .62, y: .38, w: .05, h: .24, type: 'wood' }], fixed: [] },
    { key: 'l5', start: [.18, .76], goal: [.88, .28], limit: 0, obs: [{ x: .47, y: .36, w: .08, h: .28, type: 'wood' }], fixed: [{ x: .55, y: .25, pole: 1 }, { x: .65, y: .69, pole: -1 }] },
    { key: 'l6', start: [.14, .82], goal: [.9, .18], limit: 0, obs: [{ x: .32, y: .10, w: .06, h: .58, type: 'wood' }, { x: .55, y: .32, w: .06, h: .58, type: 'wood' }, { x: .72, y: .08, w: .05, h: .38, type: 'iron' }], fixed: [{ x: .44, y: .72, pole: -1 }] },
    { key: 'l7', start: [.2, .5], goal: [.89, .5], limit: 25, obs: [{ x: .5, y: .12, w: .06, h: .33, type: 'wood' }, { x: .5, y: .55, w: .06, h: .33, type: 'wood' }], fixed: [{ x: .68, y: .5, pole: 1 }] },
    { key: 'l8', start: [.15, .76], goal: [.9, .24], limit: 35, obs: [{ x: .34, y: .08, w: .06, h: .48, type: 'iron' }, { x: .34, y: .64, w: .06, h: .26, type: 'wood' }, { x: .58, y: .26, w: .06, h: .55, type: 'wood' }, { x: .75, y: .05, w: .05, h: .36, type: 'iron' }], fixed: [{ x: .48, y: .2, pole: -1 }, { x: .72, y: .7, pole: 1 }] },
  ];
  let W = 1000, H = 600, dpr = 1, colors = {}, levelIndex = 0, running = true, won = false, goggles = false, gogglesShown = false;
  let puck, hand, flips = 0, elapsed = 0, last = 0, acc = 0, particles = [], sparks = [];
  let actx = null;

  function fillLevels() { const old = ui.level.value || '0'; ui.level.innerHTML = LEVELS.map((l, i) => `<option value="${i}">${t(l.key)}</option>`).join(''); ui.level.value = old; }
  function setNarrator(s) { ui.narrator.textContent = s; }
  function tone(freq, dur = .12, type = 'sine', gain = .13) {
    try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); const o = actx.createOscillator(), g = actx.createGain(), now = actx.currentTime; o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(gain, now); g.gain.exponentialRampToValueAtTime(.001, now + dur); o.connect(g).connect(actx.destination); o.start(now); o.stop(now + dur); } catch { /* no audio */ }
  }
  function level() { return LEVELS[levelIndex]; }
  function resetLevel(msg = true) { const l = level(); puck = { x: l.start[0] * W, y: l.start[1] * H, vx: 0, vy: 0, r: 24, pole: 1 }; hand = { x: W * .18, y: H * .18, pole: -1, active: false }; flips = 0; elapsed = 0; won = false; running = true; sparks = []; ui.modal.hidden = true; if (msg) setNarrator(t('start') + ' ' + (levelIndex === 3 ? t('blocked') : levelIndex === 4 ? t('fixed') : '')); updateHud(); }
  function updateHud() { ui.time.textContent = elapsed.toFixed(1); ui.flips.textContent = String(flips); ui.goggles.textContent = goggles ? t('gogglesOn') : t('goggles'); }
  function flipHand() { hand.pole *= -1; flips++; tone(hand.pole > 0 ? 660 : 440, .1, 'square', .09); pop(hand.x, hand.y, '↻'); updateHud(); }
  function toggleGoggles() { goggles = !goggles; if (goggles && !gogglesShown) { gogglesShown = true; setNarrator(t('fieldWow')); tone(523, .12); setTimeout(() => tone(784, .18, 'sine', .1), 80); } updateHud(); }
  function pop(x, y, text) { sparks.push({ x, y, text, life: 1, vy: -28 }); }
  function rectPx(o) { return { x: o.x * W, y: o.y * H, w: o.w * W, h: o.h * H, type: o.type }; }
  function inRect(x, y, r) { return x + r > r.x && x - r < r.x + r.w && y + r > r.y && y - r < r.y + r.h; }
  function circleRectCollide(c, r) {
    const nx = Math.max(r.x, Math.min(c.x, r.x + r.w)), ny = Math.max(r.y, Math.min(c.y, r.y + r.h));
    const dx = c.x - nx, dy = c.y - ny; return dx * dx + dy * dy < c.r * c.r;
  }
  function lineIntersectsRect(ax, ay, bx, by, r) {
    const steps = 16; for (let i = 0; i <= steps; i++) { const x = ax + (bx - ax) * i / steps, y = ay + (by - ay) * i / steps; if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return true; } return false;
  }
  function forceFrom(mx, my, mpole, strength = 980000) {
    let dx = puck.x - mx, dy = puck.y - my, d2 = dx * dx + dy * dy; const d = Math.sqrt(d2) || 1; d2 = Math.max(2100, d2); dx /= d; dy /= d;
    let shield = 1; level().obs.filter((o) => o.type === 'iron').map(rectPx).forEach((r) => { if (lineIntersectsRect(mx, my, puck.x, puck.y, r)) shield = 0; });
    const sign = mpole === puck.pole ? 1 : -1; const f = Math.max(-650, Math.min(650, sign * strength / d2)) * shield;
    return { ax: dx * f, ay: dy * f, shield };
  }
  function physics(dt) {
    if (!running || won) return; elapsed += dt;
    const l = level(); if (l.limit && elapsed > l.limit) { setNarrator(t('timeup')); resetLevel(false); return; }
    if (hand.active) { const f = forceFrom(hand.x, hand.y, hand.pole); puck.vx += f.ax * dt; puck.vy += f.ay * dt; if (f.shield === 0 && Math.random() < .08) pop((hand.x + puck.x) / 2, (hand.y + puck.y) / 2, '🧲?'); }
    l.fixed.forEach((m) => { const f = forceFrom(m.x * W, m.y * H, m.pole, 470000); puck.vx += f.ax * dt; puck.vy += f.ay * dt; });
    const speed = Math.hypot(puck.vx, puck.vy), max = 560; if (speed > max) { puck.vx = puck.vx / speed * max; puck.vy = puck.vy / speed * max; }
    puck.x += puck.vx * dt; puck.y += puck.vy * dt; puck.vx *= Math.pow(.985, dt * 60); puck.vy *= Math.pow(.985, dt * 60);
    if (Math.hypot(puck.x - hand.x, puck.y - hand.y) < puck.r + 18 && hand.active) { setNarrator(t('foul')); tone(180, .18, 'sawtooth', .12); resetLevel(false); return; }
    if (puck.x < -40 || puck.x > W + 40 || puck.y < -40 || puck.y > H + 40) { setNarrator(t('out')); tone(150, .2, 'sawtooth', .1); resetLevel(false); return; }
    const wall = 18; if (puck.x < wall + puck.r) { puck.x = wall + puck.r; puck.vx = Math.abs(puck.vx) * .75; } if (puck.x > W - wall - puck.r) { puck.x = W - wall - puck.r; puck.vx = -Math.abs(puck.vx) * .75; } if (puck.y < wall + puck.r) { puck.y = wall + puck.r; puck.vy = Math.abs(puck.vy) * .75; } if (puck.y > H - wall - puck.r) { puck.y = H - wall - puck.r; puck.vy = -Math.abs(puck.vy) * .75; }
    l.obs.map(rectPx).forEach((r) => { if (r.type === 'cone') return; if (circleRectCollide(puck, r)) { const cx = Math.max(r.x, Math.min(puck.x, r.x + r.w)); const cy = Math.max(r.y, Math.min(puck.y, r.y + r.h)); const dx = puck.x - cx, dy = puck.y - cy; if (Math.abs(dx) > Math.abs(dy)) { puck.vx *= -0.72; puck.x += Math.sign(dx || 1) * 6; } else { puck.vy *= -0.72; puck.y += Math.sign(dy || 1) * 6; } tone(120, .05, 'triangle', .05); } });
    const g = goalRect(); if (puck.x > g.x && puck.x < g.x + g.w && puck.y > g.y && puck.y < g.y + g.h) winLevel();
  }
  function stars() { const l = level(); const target = l.limit || [10, 16, 18, 22, 25, 30, 25, 35][levelIndex]; const n = elapsed <= target * .65 && flips <= 6 ? 3 : elapsed <= target && flips <= 10 ? 2 : 1; return '★'.repeat(n) + '☆'.repeat(3 - n); }
  function winLevel() { won = true; running = false; const st = stars(); tone(523, .1); setTimeout(() => tone(659, .12), 90); setTimeout(() => tone(784, .18), 180); ui.modalEmoji.textContent = '🏒⭐'; ui.modalTitle.textContent = t('goalTitle'); ui.modalDesc.textContent = t('win')(elapsed.toFixed(1), flips, st); ui.modal.hidden = false; setNarrator(t('win')(elapsed.toFixed(1), flips, st)); for (let i = 0; i < 30; i++) pop(goalRect().x, goalRect().y + Math.random() * goalRect().h, ['🎉','⭐','🧲'][i % 3]); }
  function goalRect() { return { x: W * .92, y: H * (levelIndex === 0 || levelIndex === 1 || levelIndex === 3 || levelIndex === 6 ? .38 : .12), w: W * .06, h: H * .24 }; }
  function resize() { dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1)); const r = canvas.getBoundingClientRect(); W = Math.max(640, Math.floor(r.width)); H = Math.max(430, Math.floor(r.height)); canvas.width = Math.floor(W * dpr); canvas.height = Math.floor(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); colors = Object.fromEntries(['--ink','--ink-soft','--line-strong','--card','--paper-2','--accent','--north','--south','--wood','--iron','--ice','--ice-2','--field','--goal'].map((k) => [k, cssVar(k)])); makeParticles(); resetLevel(false); render(); }
  function makeParticles() { particles = Array.from({ length: 210 }, (_, i) => ({ x: ((i * 37) % 100) / 100, y: ((i * 61 + 13) % 100) / 100, jitter: (i % 7) / 7 })); }
  function fieldVector(x, y) { let vx = 0, vy = 0; [[hand.x, hand.y, hand.pole, hand.active ? 1 : 0], [puck.x, puck.y, puck.pole, 1], ...level().fixed.map((m) => [m.x * W, m.y * H, m.pole, 1])].forEach(([mx, my, pole, on]) => { if (!on) return; const dx = x - mx, dy = y - my, d2 = Math.max(900, dx * dx + dy * dy), d = Math.sqrt(d2); const s = pole * 12000 / d2; vx += dx / d * s; vy += dy / d * s; }); return Math.atan2(vy, vx); }
  function roundRect(x, y, w, h, r, fill = true, stroke = true) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); if (fill) ctx.fill(); if (stroke) ctx.stroke(); }
  function drawMagnet(x, y, r, pole, label = true) { ctx.save(); ctx.translate(x, y); ctx.rotate(pole > 0 ? 0 : Math.PI); ctx.lineWidth = 3; ctx.strokeStyle = colors['--line-strong']; ctx.fillStyle = colors['--north']; ctx.beginPath(); ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2); ctx.lineTo(0, -r); ctx.fill(); ctx.stroke(); ctx.fillStyle = colors['--south']; ctx.beginPath(); ctx.arc(0, 0, r, Math.PI / 2, Math.PI * 1.5); ctx.lineTo(0, r); ctx.fill(); ctx.stroke(); ctx.fillStyle = colors['--card']; ctx.font = `900 ${r * .55}px ui-rounded, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; if (label) { ctx.fillText('N', r * .38, 0); ctx.fillText('S', -r * .38, 0); } ctx.restore(); }
  function drawField() { if (!goggles) return; ctx.save(); ctx.globalAlpha = .9; ctx.strokeStyle = colors['--field']; ctx.lineWidth = 2; particles.forEach((p) => { const x = p.x * W, y = p.y * H, a = fieldVector(x, y), len = 14 + p.jitter * 8; ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * len / 2, y - Math.sin(a) * len / 2); ctx.lineTo(x + Math.cos(a) * len / 2, y + Math.sin(a) * len / 2); ctx.stroke(); }); ctx.restore(); }
  function draw() {
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = colors['--ice']; roundRect(8, 8, W - 16, H - 16, 26, true, true); ctx.strokeStyle = colors['--card']; ctx.lineWidth = 2; ctx.globalAlpha = .45; for (let y = 48; y < H; y += 44) { ctx.beginPath(); ctx.moveTo(24, y); ctx.lineTo(W - 24, y - 16); ctx.stroke(); } ctx.globalAlpha = 1;
    drawField(); const g = goalRect(); ctx.fillStyle = colors['--goal']; roundRect(g.x, g.y, g.w, g.h, 14, true, true); ctx.fillStyle = colors['--card']; ctx.font = '900 24px ui-rounded, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(t('goalLabel'), g.x + g.w / 2, g.y + g.h / 2 + 8);
    level().obs.map(rectPx).forEach((r) => { ctx.fillStyle = r.type === 'iron' ? colors['--iron'] : r.type === 'cone' ? colors['--accent'] : colors['--wood']; ctx.strokeStyle = colors['--line-strong']; roundRect(r.x, r.y, r.w, r.h, 12, true, true); ctx.fillStyle = colors['--ink']; ctx.font = '900 17px ui-rounded, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(r.type === 'iron' ? t('ironLabel') : r.type === 'wood' ? t('woodLabel') : '▲', r.x + r.w / 2, r.y + r.h / 2 + 6); });
    level().fixed.forEach((m) => { drawMagnet(m.x * W, m.y * H, 28, m.pole); ctx.fillStyle = colors['--ink-soft']; ctx.font = '900 12px ui-rounded, sans-serif'; ctx.fillText(t('fixedLabel'), m.x * W, m.y * H + 46); });
    drawMagnet(puck.x, puck.y, puck.r, puck.pole); ctx.strokeStyle = colors['--line-strong']; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(puck.x, puck.y, puck.r + 5, 0, Math.PI * 2); ctx.stroke();
    ctx.save(); ctx.globalAlpha = hand.active ? 1 : .72; drawMagnet(hand.x, hand.y, 34, hand.pole); ctx.fillStyle = colors['--ink']; ctx.font = '900 18px ui-rounded, sans-serif'; ctx.fillText('✋', hand.x, hand.y - 46); ctx.restore();
    if (level().limit) { const left = Math.max(0, level().limit - elapsed) / level().limit; ctx.fillStyle = colors['--paper-2']; roundRect(W * .08, 22, W * .5, 16, 8, true, true); ctx.fillStyle = colors['--accent']; roundRect(W * .08, 22, W * .5 * left, 16, 8, true, false); }
    sparks.forEach((s) => { ctx.globalAlpha = Math.max(0, s.life); ctx.font = '900 25px ui-rounded, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = colors['--accent']; ctx.fillText(s.text, s.x, s.y); ctx.globalAlpha = 1; });
  }
  function render() { if (!ctx || !puck) return; updateHud(); draw(); }
  function frame(ts) { const dt = Math.min(.05, (ts - last) / 1000 || .016); last = ts; acc += dt; while (acc >= 1 / 60) { physics(1 / 60); acc -= 1 / 60; } sparks.forEach((s) => { s.life -= dt; s.y += s.vy * dt; s.vy += 50 * dt; }); sparks = sparks.filter((s) => s.life > 0); render(); requestAnimationFrame(frame); }
  function pointer(e) { const r = canvas.getBoundingClientRect(); hand.x = (e.clientX - r.left) * W / r.width; hand.y = (e.clientY - r.top) * H / r.height; hand.active = true; try { canvas.setPointerCapture(e.pointerId); } catch { /* ignore */ } tone(300, .03, 'sine', .02); }
  canvas.addEventListener('pointerdown', pointer); canvas.addEventListener('pointermove', (e) => { if (e.buttons || e.pointerType === 'touch') pointer(e); }); canvas.addEventListener('pointerup', () => { hand.active = false; }); canvas.addEventListener('pointercancel', () => { hand.active = false; }); canvas.addEventListener('dblclick', flipHand);
  ui.flip.addEventListener('click', flipHand); ui.goggles.addEventListener('click', toggleGoggles); ui.reset.addEventListener('click', () => resetLevel()); ui.level.addEventListener('change', () => { levelIndex = Number(ui.level.value); resetLevel(); }); ui.next.addEventListener('click', () => { levelIndex = (levelIndex + 1) % LEVELS.length; ui.level.value = String(levelIndex); resetLevel(); });
  addEventListener('keydown', (e) => { if (e.code === 'Space') { e.preventDefault(); flipHand(); } }); addEventListener('resize', resize); addEventListener('themechange', resize);

  /* ============================ 启动 ============================ */
  applyTheme(); applyLang(); fillLevels(); resize(); resetLevel(); requestAnimationFrame(frame);
})();
