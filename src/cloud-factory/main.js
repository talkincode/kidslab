/* ============================================================
   ☁️ 云朵工厂 · KidsLab 双语/主题模板
   —— 「语言 & 主题」段落是平台约定，整段复制、按需加 key，勿改机制
   ============================================================ */
(() => {
  'use strict';

  /* ================= 语言 & 主题 · Language & Theme ================= */
  const I18N = {
    zh: {
      doc: '云朵工厂 · KidsLab',
      back: '返回平台',
      title: '云朵工厂',
      tip0: '调太阳蒸发湖水，开上升气流造云，再按降水按钮完成订单。',
      eyebrow: '天空运营公司 · 粒子模拟', heroTitle: '把一滴水送去旅行',
      currentOrder: '当前订单', water: '湖水', cloudWeight: '云重', fogDepth: '雾浓', budget: '能量',
      legendVapor: '水汽=淡点', legendCloud: '云滴=团块', legendRain: '降水=雨/雪/雹', legendTemp: '蓝虚线=凝结高度 · 右侧=温度尺',
      console: '天气操作台', sun: '☀️ 太阳强度', lift: '🌬️ 上升气流', cold: '🧊 冷锋高度',
      precip: '🌧️ 降水！', precipFog: '🌫️ 起雾！', track: '🔎 跟踪一滴水', trackOn: '🔎 跟踪中', reset: '重开订单', next: '下一单', again: '再开一轮',
      termsTitle: '术语卡', termsHint: '先让粒子跑起来，术语会在循环完成后出现。',
      layerHigh: '高层', layerMid: '中层', layerLow: '贴地', ready: '云够重了，按下降水按钮！',
      notReady: '云还太轻：继续蒸发、升空、凝结。', rain: '雨', snow: '雪', hail: '冰雹', fog: '雾',
      success: (stars) => `订单完成！获得 ${stars} 颗星。`, fail: (need, got) => `这次是${got}，订单需要${need}。调整参数再试！`,
      fogDone: '贴地凝结成雾，城市灯变朦胧啦。', clearDone: '隐患解除，雨安全落下，菜棚保住了！',
      snowMagic: '魔法时刻：一滴水蒸发、升空、结晶，变成雪花落到滑雪场！',
      winTitle: '天空公司全订单交付！', winDesc: (s) => `8 单完成，共拿到 ${s} 颗星。你已经看懂蒸发、凝结、降水和径流。`,
      termsFull: '蒸发 → 凝结 → 降水 → 径流：水一直换造型，但总量在循环。',
      deliver: '☁️ 云朵出发，正赶往目的地…',
      fogHint: '起雾秘诀：🧊 冷锋拉到贴地、🌬️ 气流调小，水汽就会贴地凝成雾。',
      fogReady: '雾够浓啦，按下起雾按钮交付！',
      safeRainWindy: '雨是下了，可气流太猛，差点砸出冰雹！把 🌬️ 调小再降水。',
      cycleNeedTrack: '先点亮 🔎 跟踪一滴水，再降水就能看完整旅行。',
      hintSun: '小提示：☀️ 太阳调大一点，湖水才会冒出水汽。',
      hintLift: '小提示：🌬️ 上升气流调大，水汽才能升到高空变云。',
      runoffDone: '💧 小水流沿地面回到湖里——水循环闭环！',
      exhausted: '⚡ 能量用完了，点「重开订单」再来一次。',
      lakeDry: '湖水快蒸发光了！等雨落回湖里，或点「重开订单」。',
      forecast: '现在会下',
      hailHint: '想要冰雹：🌬️ 上升气流开到最大、🧊 冷锋别贴地，水滴上下翻滚就冻成冰球！',
      snowHint: '想要雪：🧊 把冷锋拉到最左（贴地），整层空气冻住，雪花落地不化。',
      rainHint: '想要雨：🧊 冷锋往右抬高些，低层暖一点，雪就化成雨。',
      safeHint: '🌬️ 气流太猛！调小到一半左右，雨才不会变成冰雹。',
      stEvap: '蒸发', stCond: '凝结', stPrec: '降水', stRun: '径流',
      badgeVapor: '💨 水汽 · 气态', badgeCloud: '💧 云滴 · 液态', badgeRain: '🌧️ 雨滴 · 液态',
      badgeSnow: '❄️ 雪花 · 固态', badgeHail: '🧊 冰雹 · 固态', badgeRun: '💦 径流 · 流回湖',
      orderRainFarm: '农田要一场雨', orderRainFarmD: '让云在农田上方攒够重量，降落路径保持温暖。',
      orderSnowSki: '滑雪场要下雪', orderSnowSkiD: '把冷空气压到低层，水滴结晶后一路不融化。',
      orderFogCity: '城市要一层雾', orderFogCityD: '降低冷锋、减小上升气流，让水汽贴地凝结。',
      orderSafeRain: '除掉冰雹隐患再降雨', orderSafeRainD: '别让强对流翻滚，安全给菜棚浇水。',
      orderMountain: '地形雨补给雪山', orderMountainD: '开中等气流，山坡会把空气抬升成云下雨。',
      orderHail: '冰雹警报演示', orderHailD: '把 🌬️ 气流开到最猛制造强对流（冷锋别贴地），看小人举锅盖挡冰雹。',
      orderCityRain: '城市降一场短雨', orderCityRainD: '云飘到城市上方后降雨，别下成雪。',
      orderCycle: '一滴水的旅行', orderCycleD: '启动跟踪镜头，完整看见蒸发、凝结、降水、径流。',
    },
    en: {
      doc: 'Cloud Factory · KidsLab',
      back: 'Back to platform', title: 'Cloud Factory',
      tip0: 'Heat the lake, lift vapor into clouds, then press precipitation to fill each order.',
      eyebrow: 'Sky company · particle simulation', heroTitle: 'Send one drop on a journey',
      currentOrder: 'Current order', water: 'Lake', cloudWeight: 'Cloud', fogDepth: 'Fog', budget: 'Energy',
      legendVapor: 'Vapor=pale dots', legendCloud: 'Cloud=droplet clusters', legendRain: 'Precip=rain/snow/hail', legendTemp: 'Dashed line=condensation level · right=thermometer',
      console: 'Weather console', sun: '☀️ Sun power', lift: '🌬️ Updraft', cold: '🧊 Cold-front height',
      precip: '🌧️ Precipitate!', precipFog: '🌫️ Make fog!', track: '🔎 Track one drop', trackOn: '🔎 Tracking…', reset: 'Restart order', next: 'Next order', again: 'Play again',
      termsTitle: 'Word card', termsHint: 'Let particles move first; terms appear after a full cycle.',
      layerHigh: 'High', layerMid: 'Middle', layerLow: 'Ground', ready: 'The cloud is heavy enough — press precipitation!',
      notReady: 'Cloud is too light: evaporate, lift and condense more vapor.', rain: 'rain', snow: 'snow', hail: 'hail', fog: 'fog',
      success: (stars) => `Order shipped! ${stars} stars earned.`, fail: (need, got) => `That was ${got}; this order needs ${need}. Tune the weather and try again!`,
      fogDone: 'Ground condensation made fog; city lights are fuzzy.', clearDone: 'Hail risk removed. Safe rain saved the greenhouse!',
      snowMagic: 'Magic moment: one drop evaporates, rises, crystallizes, and lands as snow!',
      winTitle: 'All sky orders delivered!', winDesc: (s) => `8 orders done, ${s} stars total. You now know evaporation, condensation, precipitation and runoff.`,
      termsFull: 'Evaporation → condensation → precipitation → runoff: water changes costumes, then cycles again.',
      deliver: '☁️ Cloud dispatched — heading to the drop zone…',
      fogHint: 'Fog recipe: pull 🧊 the cold front to the ground and keep 🌬️ updraft low, so vapor condenses near the ground.',
      fogReady: 'Fog is thick enough — press the fog button!',
      safeRainWindy: 'It rained, but the updraft was wild — almost hail! Lower 🌬️ and try again.',
      cycleNeedTrack: 'Turn on 🔎 tracking first, then precipitate to watch the full journey.',
      hintSun: 'Hint: raise ☀️ sun power so the lake releases vapor.',
      hintLift: 'Hint: raise 🌬️ updraft so vapor climbs high enough to form clouds.',
      runoffDone: '💧 Runoff flowed back into the lake — the cycle is complete!',
      exhausted: '⚡ Energy is empty. Press “Restart order” to retry.',
      lakeDry: 'The lake is nearly dry! Wait for rain to return, or restart the order.',
      forecast: 'Current mix makes',
      hailHint: 'For hail: max out 🌬️ updraft and keep 🧊 the cold front off the ground — tumbling drops freeze into ice balls!',
      snowHint: 'For snow: drag 🧊 the cold front all the way down so the whole air column stays frozen.',
      rainHint: 'For rain: raise 🧊 the cold front a bit so low air warms up and snow melts into rain.',
      safeHint: '🌬️ The updraft is wild! Ease it to about half so rain stays safe.',
      stEvap: 'Evaporate', stCond: 'Condense', stPrec: 'Precipitate', stRun: 'Runoff',
      badgeVapor: '💨 Vapor · gas', badgeCloud: '💧 Droplet · liquid', badgeRain: '🌧️ Raindrop · liquid',
      badgeSnow: '❄️ Snowflake · solid', badgeHail: '🧊 Hailstone · solid', badgeRun: '💦 Runoff · back to lake',
      orderRainFarm: 'Farm needs rain', orderRainFarmD: 'Build a cloud above the field and keep the falling path warm.',
      orderSnowSki: 'Ski hill needs snow', orderSnowSkiD: 'Push cold air to the ground so crystals do not melt.',
      orderFogCity: 'Make city fog', orderFogCityD: 'Lower the cold front and keep updraft weak so vapor condenses near ground.',
      orderSafeRain: 'Remove hail risk, then rain', orderSafeRainD: 'Avoid violent convection; water the greenhouse safely.',
      orderMountain: 'Orographic mountain rain', orderMountainD: 'Use medium wind; the mountain lifts air into rain clouds.',
      orderHail: 'Hail alarm demo', orderHailD: 'Max the 🌬️ updraft for violent convection (cold front off the ground) and watch the pot-lid defense.',
      orderCityRain: 'Short city shower', orderCityRainD: 'Rain over the city, not snow.',
      orderCycle: 'One drop journey', orderCycleD: 'Turn on tracking and watch evaporation, condensation, precipitation and runoff.',
    },
  };

  const LS = { lang: 'kidslab.lang', theme: 'kidslab.theme' };
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* 忽略 */ } },
  };

  let lang = store.get(LS.lang) || (navigator.language?.startsWith('zh') ? 'zh' : 'en');
  if (!I18N[lang]) lang = 'zh';
  let theme = store.get(LS.theme)
    || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (theme !== 'light' && theme !== 'dark') theme = 'light';

  /** 取当前语言文案；函数型 key 直接返回函数供调用方传参 */
  const t = (key) => I18N[lang][key] ?? I18N.zh[key] ?? key;
  /** 读取 CSS 主题变量（Canvas/three.js 取色必须走这里，勿硬编码） */
  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  const langBtn = document.getElementById('langBtn');
  const themeBtn = document.getElementById('themeBtn');

  function applyLang() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = t('doc');
    document.querySelectorAll('[data-t]').forEach((n) => {
      const v = I18N[lang][n.dataset.t];
      if (typeof v === 'string') n.textContent = v;
    });
    if (langBtn) langBtn.textContent = lang === 'zh' ? 'EN' : '中';
    render(); // 语言切换后重绘动态文案
  }

  function applyTheme() {
    document.documentElement.dataset.theme = theme;
    if (themeBtn) themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
    /* Canvas / three.js 课件监听该事件重取 cssVar 配色 */
    dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    render();
  }

  langBtn?.addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    store.set(LS.lang, lang);
    applyLang();
  });
  themeBtn?.addEventListener('click', () => {
    theme = theme === 'light' ? 'dark' : 'light';
    store.set(LS.theme, theme);
    applyTheme();
  });

  /* ======================= ✏️ 游戏区 · Game ======================= */

  const $ = (s) => document.querySelector(s);
  const canvas = $('#sky');
  const ctx = canvas.getContext('2d');
  const ui = {
    sun: $('#sun'), lift: $('#lift'), cold: $('#cold'), sunOut: $('#sunOut'), liftOut: $('#liftOut'), coldOut: $('#coldOut'),
    water: $('#waterMeter'), cloud: $('#cloudMeter'), budget: $('#budgetMeter'), precip: $('#precipBtn'), track: $('#trackBtn'), reset: $('#resetBtn'), next: $('#nextBtn'),
    orderTitle: $('#orderTitle'), orderDesc: $('#orderDesc'), orders: $('#orders'), stars: $('#stars'), orderNum: $('#orderNum'), tip: $('#tip'), terms: $('#terms'), toast: $('#toast'), win: $('#win'), winTitle: $('#winTitle'), winDesc: $('#winDesc'), again: $('#againBtn'), stage: $('.stage-card'),
    cloudLabel: $('.meters [data-t="cloudWeight"]'), forecast: $('#forecast'),
  };

  const FOG_NEED = 60; // 雾浓度交付线

  const ORDERS = [
    { key: 'orderRainFarm', desc: 'orderRainFarmD', zone: 'farm', need: 'rain', minCloud: 45 },
    { key: 'orderSnowSki', desc: 'orderSnowSkiD', zone: 'ski', need: 'snow', minCloud: 42 },
    { key: 'orderFogCity', desc: 'orderFogCityD', zone: 'city', need: 'fog', minCloud: 24 },
    { key: 'orderSafeRain', desc: 'orderSafeRainD', zone: 'farm', need: 'safeRain', minCloud: 48 },
    { key: 'orderMountain', desc: 'orderMountainD', zone: 'mountain', need: 'rain', minCloud: 50, mountain: true },
    { key: 'orderHail', desc: 'orderHailD', zone: 'farm', need: 'hail', minCloud: 58 },
    { key: 'orderCityRain', desc: 'orderCityRainD', zone: 'city', need: 'rain', minCloud: 44 },
    { key: 'orderCycle', desc: 'orderCycleD', zone: 'lake', need: 'cycle', minCloud: 40 },
  ];

  const state = {
    w: 960, h: 540, dpr: 1, running: true, last: 0, order: 0, totalStars: 0,
    sun: 55, lift: 50, cold: 58, water: 100, budget: 100, cloudWeight: 0,
    vapors: [], cloud: [], precip: [], splashes: [], runoffs: [], taps: [], fx: [],
    completed: false, tracking: false, tracked: null, trackedPhase: null, path: [],
    journey: { cond: false, prec: false, run: false }, trackCooldown: 0,
    snowMagicSeen: false, termsUnlocked: false, fogBank: 0, hailDamage: 0,
    delivery: null, spawnAcc: 0, idle: 0, lowNotice: false, runoffDoneSeen: false,
  };

  /* ---- 主题色缓存：每帧取色走这里，避免逐粒子 getComputedStyle ---- */
  let C = {};
  function cacheColors() {
    C = {
      ink: cssVar('--line-strong'), skyA: cssVar('--sky-a'), skyB: cssVar('--sky-b'),
      card: cssVar('--card'), water: cssVar('--water'), grass: cssVar('--grass'),
      soil: cssVar('--soil'), accent: cssVar('--accent'), accent2: cssVar('--accent-2'),
      white: cssVar('--white-ink'), soft: cssVar('--ink-soft'), paper2: cssVar('--paper-2'),
      mtn: cssVar('--mtn'), sun: cssVar('--sun'), win: cssVar('--window'),
      stars: parseFloat(cssVar('--stars')) || 0, font: cssVar('--font'),
    };
  }

  function rand(a, b) { return a + Math.random() * (b - a); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function zoneX(zone) {
    const map = { lake: 0.18, farm: 0.46, city: 0.63, ski: 0.84, mountain: 0.80 };
    return state.w * (map[zone] || 0.5);
  }
  /** 地形高度：平原 + 右侧山体，绘制与物理共用同一条线 */
  function groundY(x) {
    const w = state.w, h = state.h;
    if (x > w * 0.71) {
      const upX = w * 0.71, apexX = w * 0.86, baseY = h * 0.78, apexY = h * 0.40;
      const k = x <= apexX
        ? (x - upX) / (apexX - upX)
        : 1 - ((x - apexX) / (w - apexX)) * 0.5;
      return baseY - (baseY - apexY) * clamp(k, 0, 1);
    }
    return h * 0.78 + Math.sin(x * 0.02) * 4;
  }
  /** 凝结高度（冷锋越高云越高），随滑杆连续变化 */
  function condensationY() { return state.h * (0.66 - state.cold * 0.0046); }
  /** 三层温度：与降水规则自洽 —— cold<26 ⇔ 低层≤0°C ⇔ 雪 */
  function temps() {
    return {
      low: state.cold < 26 ? -6 + state.cold * 0.23 : 3 + (state.cold - 26) * 0.14,
      mid: -9 + state.cold * 0.14,
      high: -22 + state.cold * 0.12,
    };
  }
  /** 按当前参数会下什么（云重已达标时调用） */
  function typeNow() {
    if (state.lift > 82 && state.cold > 45) return 'hail';
    if (state.cold < 26) return 'snow';
    return 'rain';
  }
  function needName(need) {
    if (need === 'safeRain') return t('rain');
    if (need === 'cycle') return lang === 'zh' ? '完整水循环' : 'full cycle';
    return t(need);
  }
  function gotName(got) { return got === 'none' ? (lang === 'zh' ? '空云' : 'empty cloud') : t(got); }
  /** 配方提示：想要的天气和当前参数不匹配时，告诉孩子往哪拧 */
  function recipeHint(need, f) {
    if (need === 'hail') return t('hailHint');
    if (need === 'snow') return t('snowHint');
    if (f === 'hail' || (need === 'safeRain' && state.lift >= 78)) return t('safeHint');
    if (f === 'snow') return t('rainHint');
    return null;
  }
  function addFx(x, y, key) { state.fx.push({ x, y, key, life: 0 }); }

  function resetOrder(keepStars = true) {
    Object.assign(state, {
      water: 100, budget: 100, cloudWeight: 0, vapors: [], cloud: [], precip: [], splashes: [], runoffs: [], taps: [], fx: [],
      completed: false, fogBank: 0, hailDamage: 0, path: [], tracked: null, trackedPhase: null,
      journey: { cond: false, prec: false, run: false }, trackCooldown: 0,
      delivery: null, spawnAcc: 0, idle: 0, lowNotice: false, runoffDoneSeen: false,
    });
    if (!keepStars) state.totalStars = 0;
    const o = ORDERS[state.order];
    if (o.need === 'cycle') state.tracking = true; // 「一滴水的旅行」自动点亮跟踪
    ui.next.hidden = true;
    toast(`📦 ${t(o.key)}`, 1800);
    render();
  }

  function resize() {
    const box = canvas.getBoundingClientRect();
    state.dpr = Math.min(devicePixelRatio || 1, 2);
    state.w = Math.max(320, Math.floor(box.width));
    state.h = Math.max(300, Math.floor(box.height));
    canvas.width = Math.floor(state.w * state.dpr);
    canvas.height = Math.floor(state.h * state.dpr);
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    render();
  }

  /* ---------------------- 模拟 · Simulation ---------------------- */

  function spawnVapor(dt) {
    if (state.water <= 0 || state.budget <= 0) return;
    state.spawnAcc += dt * (8 + state.sun * 0.66);
    let n = Math.floor(state.spawnAcc);
    if (!n) return;
    state.spawnAcc -= n;
    n = Math.min(n, Math.max(0, 380 - state.vapors.length - state.cloud.length));
    for (let i = 0; i < n; i++) {
      const p = { x: rand(state.w * 0.05, state.w * 0.31), y: rand(state.h * 0.70, state.h * 0.77), vx: rand(-4, 12) / 10, vy: rand(-0.45, -1.2), r: rand(2, 4), age: 0, tracked: false };
      state.vapors.push(p);
      if (state.tracking && !state.tracked && state.trackCooldown <= 0 && Math.random() < 0.25) {
        p.tracked = true; state.tracked = p; state.trackedPhase = 'vapor';
        state.journey = { cond: false, prec: false, run: false };
        state.path = [[p.x, p.y]];
        addFx(p.x, p.y, 'badgeVapor');
      }
      state.water = clamp(state.water - 0.05, 0, 100);
    }
  }

  function deliveryStep(dt) {
    const d = state.delivery;
    d.t += dt;
    const cy = condensationY();
    // 云团整体滑向目标区上空
    state.cloud.forEach((p, i) => {
      const tx = d.cx + ((i % 9) - 4) * 15 + Math.sin(i * 2.4) * 7;
      const ty = cy + ((i % 5) - 2) * 10;
      p.x += (tx - p.x) * Math.min(1, dt * 3);
      p.y += (ty - p.y) * Math.min(1, dt * 3);
      if (p.tracked && state.tracked === p) state.path.push([p.x, p.y]);
    });
    if (!d.rained && d.t >= 0.85) {
      d.rained = true;
      const n = Math.min(110, Math.floor(d.weight * 1.4));
      for (let i = 0; i < n; i++) {
        const src = state.cloud.length ? state.cloud[i % state.cloud.length] : { x: d.cx, y: cy };
        const keepTrack = !!(src.tracked && state.tracked === src);
        const drop = { x: src.x + rand(-14, 14), y: src.y + rand(-6, 10), vx: rand(-0.5, 0.5), vy: d.type === 'snow' ? rand(0.3, 0.8) : rand(1.5, 3.5), type: d.type, life: 0, tracked: keepTrack };
        state.precip.push(drop);
        if (keepTrack) {
          state.tracked = drop; state.trackedPhase = d.type; state.journey.prec = true;
          addFx(drop.x, drop.y, d.type === 'snow' ? 'badgeSnow' : d.type === 'hail' ? 'badgeHail' : 'badgeRain');
          src.tracked = false;
        }
      }
      state.cloud = []; state.cloudWeight = 0;
    }
    if (d.rained && d.t >= 2.0) { state.delivery = null; finish(d.type, d.lift); }
  }

  function update(dt) {
    const order = ORDERS[state.order];
    const oro = !!order.mountain;
    if (!state.completed && !state.delivery && state.sun > 3) spawnVapor(dt);
    if (!state.completed) {
      state.budget = clamp(state.budget - dt * (0.3 + state.sun * 0.012 + state.lift * 0.006), 0, 100);
      if ((state.budget <= 0 || state.water <= 0.5) && !state.lowNotice) {
        state.lowNotice = true;
        toast(t(state.budget <= 0 ? 'exhausted' : 'lakeDry'), 3200);
      }
    }
    const cy = condensationY();

    for (let i = state.vapors.length - 1; i >= 0; i--) {
      const p = state.vapors[i];
      p.age += dt;
      // 地形雨订单：气流带着水汽贴低空向山飘，山坡强制抬升
      const beforeHill = oro && p.x < state.w * 0.70;
      const onHill = oro && p.x >= state.w * 0.70;
      p.x += (p.vx + state.lift * 0.006 + (beforeHill ? 0.95 : 0) + (onHill ? 0.4 : 0) + Math.sin(p.age * 4) * 0.18) * dt * 60;
      p.y += (p.vy * (beforeHill ? 0.3 : 1) - state.lift * 0.012 * (beforeHill ? 0.25 : 1) - (onHill ? 0.9 : 0)) * dt * 60;
      if (state.tracked === p) state.path.push([p.x, p.y]);
      const fogCond = state.cold < 26 && state.lift < 30 && p.y < state.h * 0.69;
      if (p.y < cy || fogCond) {
        state.vapors.splice(i, 1);
        if (fogCond && order.need === 'fog') {
          state.fogBank = clamp(state.fogBank + 0.4, 0, 100);
          if (state.tracked === p) { state.tracked = null; state.trackedPhase = null; }
        } else {
          state.cloudWeight = clamp(state.cloudWeight + 0.12, 0, 100);
          const dropY = (p.y < cy ? cy : p.y) + rand(-18, 14);
          if (state.cloud.length < state.cloudWeight * 1.35 + 1 || p.tracked) {
            const c = { x: p.x, y: dropY, vx: rand(-0.12, 0.22), r: rand(8, 18), a: rand(0.45, 0.95), tracked: p.tracked };
            state.cloud.push(c);
            if (p.tracked) {
              state.tracked = c; state.trackedPhase = 'cloud';
              state.journey.cond = true;
              addFx(c.x, c.y, 'badgeCloud');
            }
          }
        }
      } else if (p.x > state.w || p.y < 0) {
        if (state.tracked === p) { state.tracked = null; state.trackedPhase = null; }
        state.vapors.splice(i, 1);
      }
    }

    while (state.cloud.length > state.cloudWeight * 1.35 + 8) {
      const rm = state.cloud.shift();
      if (rm.tracked && state.tracked === rm) {
        const nc = state.cloud[state.cloud.length - 1];
        if (nc) { nc.tracked = true; state.tracked = nc; } else { state.tracked = null; state.trackedPhase = null; }
      }
    }

    if (state.delivery) {
      deliveryStep(dt);
    } else {
      const nowMs = performance.now();
      // 冰雹配方达成时云内“翻滚”加剧，直观看到强气流托举
      const churn = typeNow() === 'hail' ? 3 : 1;
      state.cloud.forEach((p, i) => {
        p.x += (p.vx + Math.sin(nowMs / (churn > 1 ? 380 : 900) + i) * 0.025 * churn) * dt * 60;
        p.y += Math.sin(nowMs / (churn > 1 ? 300 : 700) + i) * 0.03 * churn * dt * 60;
        if (p.x < state.w * 0.03 || p.x > state.w * 0.97) p.vx *= -1;
        if (p.tracked && state.tracked === p) state.path.push([p.x, p.y]);
      });
    }

    for (let i = state.precip.length - 1; i >= 0; i--) {
      const p = state.precip[i];
      p.life += dt;
      p.vy += (p.type === 'snow' ? 0.4 : 5.2) * dt;
      p.x += (p.vx + (p.type === 'snow' ? Math.sin(p.life * 5) * 0.55 : 0)) * dt * 60;
      p.y += p.vy * dt * 60;
      if (p.tracked) state.path.push([p.x, p.y]);
      const gy = groundY(p.x);
      if (p.y >= gy) {
        if (p.type === 'hail') state.hailDamage += 1;
        state.water = clamp(state.water + 0.22, 0, 100); // 降水回到地表，湖水补回
        state.splashes.push({ x: p.x, y: gy, type: p.type, life: 0 });
        if (p.tracked) {
          const r = { x: p.x, y: gy - 2, tracked: true };
          state.runoffs.push(r);
          state.tracked = r; state.trackedPhase = 'runoff';
          state.journey.run = true;
          addFx(p.x, gy - 8, 'badgeRun');
        }
        state.precip.splice(i, 1);
      }
    }

    // 径流：被跟踪的水滴沿地面流回湖里，闭环
    const lakeX = state.w * 0.18;
    for (let i = state.runoffs.length - 1; i >= 0; i--) {
      const r = state.runoffs[i];
      r.x += (r.x > lakeX ? -1 : 1) * 2.0 * dt * 60;
      r.y = groundY(r.x) - 2;
      if (r.tracked && state.tracked === r) state.path.push([r.x, r.y]);
      if (Math.abs(r.x - lakeX) < state.w * 0.02) {
        state.water = clamp(state.water + 2, 0, 100);
        state.splashes.push({ x: r.x, y: r.y + 2, type: 'rain', life: 0 });
        if (state.tracked === r) { state.tracked = null; state.trackedPhase = null; state.trackCooldown = 4; }
        if (!state.runoffDoneSeen && ORDERS[state.order].need === 'cycle') {
          state.runoffDoneSeen = true;
          toast(t('runoffDone'), 3000);
        }
        state.runoffs.splice(i, 1);
      }
    }

    for (let i = state.splashes.length - 1; i >= 0; i--) { state.splashes[i].life += dt; if (state.splashes[i].life > 1.4) state.splashes.splice(i, 1); }
    for (let i = state.taps.length - 1; i >= 0; i--) { state.taps[i].life += dt; if (state.taps[i].life > 0.9) state.taps.splice(i, 1); }
    for (let i = state.fx.length - 1; i >= 0; i--) { state.fx[i].life += dt; if (state.fx[i].life > 1.3) state.fx.splice(i, 1); }
    if (state.trackCooldown > 0) state.trackCooldown -= dt;
    if (state.fogBank > 0 && (state.sun > 72 || state.lift > 55)) state.fogBank = clamp(state.fogBank - dt * 18, 0, 100);

    // 卡住约 30 秒：按情境递台阶提示
    if (!state.completed && !state.delivery) {
      state.idle += dt;
      if (state.idle > 30) {
        state.idle = 0;
        const o = ORDERS[state.order];
        if (o.need === 'fog' && state.fogBank < FOG_NEED) toast(t('fogHint'), 3200);
        else if (state.cloudWeight < o.minCloud) toast(t(state.sun < 30 ? 'hintSun' : 'hintLift'), 3000);
        else toast(recipeHint(o.need, typeNow()) ?? t('ready'), 3200);
      }
    }
  }

  function precipitate() {
    if (state.completed || state.delivery) return;
    state.idle = 0;
    const order = ORDERS[state.order];
    if (order.need === 'fog') {
      if (state.fogBank >= FOG_NEED) finish('fog', state.lift);
      else toast(t('fogHint'), 2800);
      return;
    }
    if (state.cloudWeight < order.minCloud) { toast(t('notReady')); return; }
    if (order.need === 'cycle' && !state.tracking) { toast(t('cycleNeedTrack'), 2600); return; }
    // 参数在按下瞬间定型；云先滑到目标区再降下
    state.delivery = { cx: zoneX(order.zone), t: 0, rained: false, type: typeNow(), lift: state.lift, weight: state.cloudWeight };
    toast(t('deliver'), 1200);
  }

  function finish(type, liftAtPress) {
    const order = ORDERS[state.order];
    let ok = order.need === type;
    if (order.need === 'safeRain') ok = type === 'rain' && liftAtPress < 78;
    if (order.need === 'cycle') ok = state.tracking && (type === 'rain' || type === 'snow') && state.path.length > 20;
    if (order.need === 'fog') ok = state.fogBank >= FOG_NEED;
    state.termsUnlocked = true;
    if (!ok) {
      state.budget = clamp(state.budget - 8, 0, 100);
      if (order.need === 'safeRain' && type === 'rain') toast(t('safeRainWindy'), 3000);
      else toast(t('fail')(needName(order.need), gotName(type)), 2600);
      render();
      return;
    }
    const stars = state.budget > 68 ? 3 : state.budget > 38 ? 2 : 1;
    state.totalStars += stars; state.completed = true; ui.next.hidden = false;
    if (type === 'snow' && !state.snowMagicSeen) {
      state.snowMagicSeen = true;
      ui.stage.classList.add('flash');
      setTimeout(() => ui.stage.classList.remove('flash'), 900);
      toast(t('snowMagic'), 3600);
    } else {
      toast(order.need === 'safeRain' ? t('clearDone') : order.need === 'fog' ? t('fogDone') : t('success')(stars), 2600);
    }
    render();
  }

  function nextOrder() {
    if (!state.completed) return;
    if (state.order >= ORDERS.length - 1) {
      ui.winTitle.textContent = t('winTitle'); ui.winDesc.textContent = t('winDesc')(state.totalStars); ui.win.hidden = false; return;
    }
    state.order += 1; resetOrder(true);
  }

  /* ---------------------- 绘制 · Drawing ---------------------- */

  function drawScene() {
    const w = state.w, h = state.h, nowMs = performance.now();
    // 天空
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, C.skyA); g.addColorStop(0.48, C.skyB); g.addColorStop(1, C.card);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    // 夜空星星（仅暗色主题，--stars 控制）
    if (C.stars > 0) {
      ctx.save();
      ctx.fillStyle = C.white;
      for (let i = 0; i < 24; i++) {
        const sx = ((i * 173) % 97) / 97 * w, sy = ((i * 89) % 53) / 53 * h * 0.5;
        ctx.globalAlpha = C.stars * (0.35 + 0.3 * Math.sin(nowMs / 800 + i * 1.7));
        ctx.beginPath(); ctx.arc(sx, sy, i % 3 ? 1.2 : 1.8, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
    // 太阳：大小与光晕跟随强度
    const sunR = 14 + state.sun * 0.16, sunX = w * 0.09, sunY = h * 0.13;
    ctx.save();
    const glowR = sunR * (1.8 + state.sun * 0.02);
    const glow = ctx.createRadialGradient(sunX, sunY, sunR * 0.4, sunX, sunY, glowR);
    glow.addColorStop(0, C.sun); glow.addColorStop(1, 'rgba(255, 200, 60, 0)');
    ctx.globalAlpha = 0.25 + state.sun * 0.004;
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(sunX, sunY, glowR, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1; ctx.fillStyle = C.sun; ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = C.sun; ctx.lineWidth = 3; ctx.globalAlpha = 0.5 + state.sun * 0.005;
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4 + nowMs / 6000;
      ctx.beginPath();
      ctx.moveTo(sunX + Math.cos(a) * (sunR + 6), sunY + Math.sin(a) * (sunR + 6));
      ctx.lineTo(sunX + Math.cos(a) * (sunR + 12 + state.sun * 0.06), sunY + Math.sin(a) * (sunR + 12 + state.sun * 0.06));
      ctx.stroke();
    }
    ctx.restore();
    // 上升气流指示（强度=透明度与流速）
    const cy = condensationY();
    if (state.lift > 4) {
      ctx.save(); ctx.strokeStyle = C.accent2; ctx.lineWidth = 2.5; ctx.setLineDash([7, 9]);
      ctx.globalAlpha = 0.12 + state.lift * 0.004;
      const speed = 20 + state.lift * 1.3;
      [0.22, 0.33, 0.44].forEach((fx, i) => {
        const x = w * fx, topY = cy + 26, botY = h * 0.72;
        ctx.lineDashOffset = -((nowMs / 1000) * speed + i * 12) % 32;
        ctx.beginPath(); ctx.moveTo(x, botY); ctx.lineTo(x, topY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x - 5, topY + 8); ctx.lineTo(x, topY); ctx.lineTo(x + 5, topY + 8); ctx.stroke();
      });
      ctx.restore();
    }
    // 冷锋 / 凝结高度虚线
    ctx.save();
    ctx.strokeStyle = C.accent2; ctx.globalAlpha = 0.55; ctx.lineWidth = 2; ctx.setLineDash([14, 10]);
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w - 130, cy); ctx.stroke(); ctx.setLineDash([]);
    ctx.globalAlpha = 0.95; ctx.fillStyle = C.accent2; ctx.font = `800 14px ${C.font}`;
    ctx.fillText('❄', 8, cy - 6);
    ctx.restore();
    // 地形（含山体，与 groundY 同一条线）
    ctx.fillStyle = C.grass; ctx.strokeStyle = C.ink; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, groundY(0));
    for (let x = 0; x <= w; x += 12) ctx.lineTo(x, groundY(x));
    ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath(); ctx.fill(); ctx.stroke();
    // 山体岩石
    ctx.save();
    ctx.beginPath(); ctx.moveTo(w * 0.715, groundY(w * 0.715));
    for (let x = w * 0.715; x <= w; x += 10) ctx.lineTo(x, groundY(x));
    ctx.lineTo(w, h); ctx.lineTo(w * 0.715, h); ctx.closePath();
    ctx.fillStyle = C.mtn; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.stroke();
    // 雪顶
    ctx.beginPath(); ctx.moveTo(w * 0.78, groundY(w * 0.78));
    for (let x = w * 0.78; x <= w * 0.94; x += 8) ctx.lineTo(x, groundY(x));
    for (let x = w * 0.94; x >= w * 0.78; x -= 8) ctx.lineTo(x, groundY(x) + 24 + Math.sin(x * 0.08) * 6);
    ctx.closePath(); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 2; ctx.stroke();
    // 滑雪场小旗
    [0.80, 0.845].forEach((fx) => {
      const x = w * fx, y = groundY(x);
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 16); ctx.stroke();
      ctx.fillStyle = C.accent;
      ctx.beginPath(); ctx.moveTo(x, y - 16); ctx.lineTo(x + 10, y - 12); ctx.lineTo(x, y - 8); ctx.closePath(); ctx.fill();
    });
    ctx.restore();
    // 湖：渐变 + 波纹
    ctx.save();
    const lg = ctx.createLinearGradient(0, h * 0.75, 0, h * 0.86);
    lg.addColorStop(0, C.accent2); lg.addColorStop(1, C.water);
    ctx.fillStyle = lg; ctx.strokeStyle = C.ink; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(w * 0.18, h * 0.80, w * 0.16, h * 0.055, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.globalAlpha = 0.5; ctx.strokeStyle = C.white; ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const wy = h * (0.785 + i * 0.013), wx = w * (0.10 + i * 0.045);
      ctx.beginPath(); ctx.moveTo(wx, wy); ctx.quadraticCurveTo(wx + w * 0.02, wy - 3, wx + w * 0.04, wy); ctx.stroke();
    }
    ctx.restore();
    // 农田：土壤 + 垄沟 + 幼苗 + 菜棚
    ctx.save();
    ctx.fillStyle = C.soil; ctx.strokeStyle = C.ink; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(w * 0.36, h * 0.80, w * 0.18, h * 0.12, 6); ctx.fill(); ctx.stroke();
    ctx.globalAlpha = 0.3; ctx.lineWidth = 1.5;
    for (let i = 1; i < 4; i++) { const y = h * (0.80 + i * 0.03); ctx.beginPath(); ctx.moveTo(w * 0.37, y); ctx.lineTo(w * 0.53, y); ctx.stroke(); }
    ctx.globalAlpha = 1; ctx.strokeStyle = C.grass; ctx.lineWidth = 2.5;
    for (let i = 0; i < 6; i++) {
      const x = w * (0.375 + i * 0.026), y = h * 0.815;
      ctx.beginPath(); ctx.moveTo(x - 4, y - 8); ctx.lineTo(x, y); ctx.lineTo(x + 4, y - 8); ctx.stroke();
    }
    // 菜棚（拱形温室）
    const ghX = w * 0.492, ghW = w * 0.046, ghBase = h * 0.80;
    ctx.beginPath(); ctx.moveTo(ghX, ghBase);
    ctx.quadraticCurveTo(ghX + ghW / 2, ghBase - h * 0.056, ghX + ghW, ghBase);
    ctx.closePath();
    ctx.fillStyle = C.accent2; ctx.globalAlpha = 0.45; ctx.fill();
    ctx.globalAlpha = 1; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ghX + ghW / 2, ghBase); ctx.lineTo(ghX + ghW / 2, ghBase - h * 0.042); ctx.stroke();
    ctx.restore();
    // 城市：三栋楼 + 亮窗（雾时被雾罩住变朦胧）
    ctx.save();
    const blds = [[0.575, 0.10, 0.034], [0.615, 0.145, 0.04], [0.662, 0.085, 0.032]];
    blds.forEach(([fx, fh, fw]) => {
      const bx = w * fx, bw = w * fw, bh = h * fh, by = h * 0.795 - bh;
      ctx.fillStyle = C.paper2; ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = C.win;
      const rows = Math.max(2, Math.floor(bh / 16));
      for (let r = 0; r < rows; r++) for (let c = 0; c < 2; c++) {
        ctx.fillRect(bx + bw * (0.16 + c * 0.45), by + 6 + r * (bh - 10) / rows, bw * 0.24, 6);
      }
    });
    ctx.restore();
    // 人物与装饰（emoji 自带彩色）
    ctx.font = `${Math.max(20, w * 0.024)}px ${C.font}`;
    ctx.fillText('🌽', w * 0.452, h * 0.79);
    ctx.fillText(state.hailDamage ? '🙆‍♂️🛡️' : '🧑‍🌾', w * 0.408, h * 0.782);
    ctx.fillText('⛷️', w * 0.832, groundY(w * 0.835) - 8);
    drawThermometer(w - 52, 34, 20, Math.min(h * 0.52, 290));
  }

  function drawThermometer(x, y, tw, th) {
    ctx.save();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.fillStyle = C.card;
    ctx.beginPath(); ctx.roundRect(x, y, tw, th, 11); ctx.fill(); ctx.stroke();
    const tp = temps();
    const rows = [[t('layerHigh'), tp.high], [t('layerMid'), tp.mid], [t('layerLow'), tp.low]];
    ctx.textAlign = 'right';
    rows.forEach(([label, v], i) => {
      const yy = y + 20 + i * (th - 40) / 2;
      ctx.fillStyle = v <= 0 ? C.accent2 : C.accent;
      ctx.beginPath(); ctx.arc(x + tw / 2, yy, 5.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = C.soft; ctx.font = `800 12.5px ${C.font}`;
      ctx.fillText(`${label} ${Math.round(v)}°C`, x - 8, yy + 4);
    });
    ctx.textAlign = 'left';
    ctx.restore();
  }

  function drawParticles() {
    ctx.lineWidth = 2;
    state.vapors.forEach((p) => {
      if (p === state.tracked) return;
      ctx.save(); ctx.globalAlpha = 0.45;
      ctx.fillStyle = C.water;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });
    state.cloud.forEach((p) => {
      if (p === state.tracked) return;
      ctx.save(); ctx.globalAlpha = p.a;
      ctx.fillStyle = C.white; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.restore();
    });
    if (state.fogBank > 0) {
      ctx.save(); ctx.globalAlpha = Math.min(0.8, state.fogBank / 110); ctx.fillStyle = C.white;
      for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        ctx.ellipse(state.w * (0.50 + i * 0.026), state.h * (0.70 + Math.sin(i) * 0.012), 62, 15, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    state.precip.forEach((p) => {
      if (p === state.tracked) return;
      ctx.save();
      ctx.strokeStyle = C.water; ctx.fillStyle = C.white; ctx.lineWidth = 2.2;
      if (p.type === 'rain') { ctx.beginPath(); ctx.moveTo(p.x, p.y - 8); ctx.lineTo(p.x - 2, p.y + 10); ctx.stroke(); }
      else if (p.type === 'snow') { ctx.translate(p.x, p.y); ctx.rotate(p.life); for (let a = 0; a < 6; a++) { ctx.rotate(Math.PI / 3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 9); ctx.stroke(); } }
      else { ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = C.ink; ctx.stroke(); }
      ctx.restore();
    });
    state.runoffs.forEach((r) => {
      if (r === state.tracked) return;
      ctx.save(); ctx.fillStyle = C.accent; ctx.strokeStyle = C.white; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(r.x, r.y, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.restore();
    });
    state.splashes.forEach((s) => {
      ctx.save(); ctx.globalAlpha = 1 - s.life / 1.4;
      ctx.strokeStyle = s.type === 'hail' ? C.accent2 : C.water; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(s.x, s.y, 5 + s.life * 14, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    });
    state.taps.forEach((tp) => {
      ctx.save(); ctx.globalAlpha = 1 - tp.life / 0.9;
      ctx.font = `900 16px ${C.font}`; ctx.fillStyle = C.accent;
      ctx.fillText(tp.label, tp.x - 14, tp.y - tp.life * 40);
      ctx.restore();
    });
    if (state.path.length > 1) {
      ctx.save(); ctx.strokeStyle = C.accent; ctx.lineWidth = 4; ctx.setLineDash([8, 8]);
      ctx.beginPath();
      state.path.slice(-140).forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      ctx.stroke(); ctx.setLineDash([]);
      if (!state.tracked) {
        const last = state.path[state.path.length - 1];
        ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(last[0], last[1], 8, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
    drawFx();
    drawTracked();
    drawJourney();
  }

  /** 圆角标签牌：跟踪徽章 / 相变提示共用 */
  function pill(x, y, text, bg, fg) {
    ctx.font = `900 12.5px ${C.font}`;
    const tw = ctx.measureText(text).width;
    const px = clamp(x, 8, state.w - tw - 24);
    const py = clamp(y, 44, state.h - 10);
    ctx.fillStyle = bg; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(px, py - 16, tw + 16, 22, 11); ctx.fill(); ctx.stroke();
    ctx.fillStyle = fg; ctx.fillText(text, px + 8, py);
  }

  /** 相变瞬间的扩散圈 + 上浮标签 */
  function drawFx() {
    state.fx.forEach((f) => {
      const k = f.life / 1.3;
      ctx.save();
      ctx.globalAlpha = 1 - k;
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(f.x, f.y, 8 + k * 30, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 1 - k * 0.75;
      pill(f.x + 14, f.y - 18 - k * 26, t(f.key), C.card, C.ink);
      ctx.restore();
    });
  }

  /** 被跟踪的那滴水：按物态画不同形状（气态散、液态聚、固态晶） */
  function drawTracked() {
    const tk = state.tracked, ph = state.trackedPhase;
    if (!tk || !ph) return;
    const x = tk.x, y = tk.y, nowMs = performance.now();
    ctx.save();
    ctx.strokeStyle = C.accent; ctx.globalAlpha = 0.85; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y, 13 + Math.sin(nowMs / 260) * 2.5, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 1;
    if (ph === 'vapor') {
      // 气态：分子散开各自游动，加两缕上飘热气
      ctx.fillStyle = C.accent;
      for (let i = 0; i < 3; i++) {
        const a = nowMs / 500 + i * 2.1;
        ctx.beginPath(); ctx.arc(x + Math.cos(a) * 6.5, y + Math.sin(a * 1.3) * 6.5, 3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.strokeStyle = C.accent; ctx.globalAlpha = 0.5; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x - 4, y + 10); ctx.quadraticCurveTo(x - 9, y + 3, x - 4, y - 3); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + 5, y + 12); ctx.quadraticCurveTo(x + 10, y + 5, x + 5, y - 1); ctx.stroke();
    } else if (ph === 'snow') {
      // 固态：慢旋六臂雪晶（带侧枝）
      ctx.strokeStyle = C.accent; ctx.lineWidth = 2;
      ctx.translate(x, y); ctx.rotate(nowMs / 1400);
      for (let a = 0; a < 6; a++) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 11); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, 6); ctx.lineTo(3.5, 9); ctx.moveTo(0, 6); ctx.lineTo(-3.5, 9); ctx.stroke();
      }
    } else if (ph === 'hail') {
      // 固态：分层冰球——冰雹在云里翻滚时一圈圈冻大
      ctx.fillStyle = C.white; ctx.strokeStyle = C.accent; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = C.accent2; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.8;
      ctx.beginPath(); ctx.arc(x, y, 5.5, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.stroke();
    } else {
      // 液态（云滴 / 雨滴 / 径流）：抱成一团的泪滴 + 高光
      const s = ph === 'runoff' ? 0.85 : 1;
      ctx.fillStyle = C.water; ctx.strokeStyle = C.accent; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x, y - 9 * s);
      ctx.bezierCurveTo(x + 7 * s, y - 1 * s, x + 6.5 * s, y + 7 * s, x, y + 7 * s);
      ctx.bezierCurveTo(x - 6.5 * s, y + 7 * s, x - 7 * s, y - 1 * s, x, y - 9 * s);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = C.white; ctx.globalAlpha = 0.85;
      ctx.beginPath(); ctx.arc(x - 2 * s, y + 1 * s, 1.8, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    const badge = ph === 'vapor' ? 'badgeVapor' : ph === 'cloud' ? 'badgeCloud' : ph === 'rain' ? 'badgeRain' : ph === 'snow' ? 'badgeSnow' : ph === 'hail' ? 'badgeHail' : 'badgeRun';
    pill(x + 18, y - 14, t(badge), C.card, C.ink);
  }

  /** 旅程进度条：蒸发→凝结→降水→径流，跟踪开启时常驻画布左上角 */
  function drawJourney() {
    if (!state.tracking) return;
    const j = state.journey;
    const steps = [
      [t('stEvap'), !!state.tracked || j.cond || j.prec || j.run],
      [t('stCond'), j.cond],
      [t('stPrec'), j.prec],
      [t('stRun'), j.run],
    ];
    ctx.save();
    ctx.font = `900 12.5px ${C.font}`;
    let x = 12; const y = 12;
    steps.forEach(([label, done], i) => {
      const text = (done ? '✓ ' : '') + label;
      const tw = ctx.measureText(text).width;
      ctx.globalAlpha = 0.96;
      ctx.fillStyle = done ? C.accent : C.card;
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(x, y, tw + 14, 22, 11); ctx.fill(); ctx.stroke();
      ctx.fillStyle = done ? C.ink : C.soft;
      ctx.fillText(text, x + 7, y + 15.5);
      x += tw + 18;
      if (i < 3) { ctx.fillStyle = C.soft; ctx.fillText('→', x - 2, y + 15.5); x += 14; }
    });
    ctx.restore();
  }

  /* ---------------------- UI 同步 ---------------------- */

  function loop(now) {
    if (!state.running) { state.last = now; requestAnimationFrame(loop); return; }
    const dt = Math.min(0.04, (now - state.last) / 1000 || 0.016); state.last = now;
    update(dt); updateLiveUi(); drawScene(); drawParticles();
    requestAnimationFrame(loop);
  }

  function toast(msg, ms = 1500) { ui.toast.textContent = msg; ui.toast.hidden = false; clearTimeout(toast.id); toast.id = setTimeout(() => { ui.toast.hidden = true; }, ms); }

  function updateLiveUi() {
    const o = ORDERS[state.order];
    const fogOrder = o.need === 'fog';
    ui.sunOut.textContent = `${state.sun}%`; ui.liftOut.textContent = `${state.lift}%`;
    ui.coldOut.textContent = state.cold < 26 ? t('layerLow') : state.cold > 66 ? t('layerHigh') : t('layerMid');
    ui.water.value = state.water; ui.budget.value = state.budget;
    // 雾订单时，「云重」表改显示雾浓度；达标线随订单动态变化
    ui.cloud.value = fogOrder ? state.fogBank : state.cloudWeight;
    ui.cloud.high = fogOrder ? FOG_NEED : o.minCloud;
    ui.cloud.low = (fogOrder ? FOG_NEED : o.minCloud) * 0.55;
    const ready = fogOrder ? state.fogBank >= FOG_NEED : state.cloudWeight >= o.minCloud;
    ui.precip.disabled = !!state.delivery || state.completed || !ready;
    // 天气预报牌：实时告诉孩子当前参数会下什么，冰雹/雪的配方靠它变得可见
    const fogRecipe = state.cold < 26 && state.lift < 30;
    const f = fogOrder && fogRecipe ? 'fog' : typeNow();
    const icon = f === 'hail' ? '🧊' : f === 'snow' ? '❄️' : f === 'fog' ? '🌫️' : '🌧️';
    const match = fogOrder ? f === 'fog'
      : o.need === 'cycle' ? (f === 'rain' || f === 'snow')
        : o.need === 'safeRain' ? (f === 'rain' && state.lift < 78)
          : f === o.need;
    if (ui.forecast) {
      ui.forecast.textContent = `${match ? '✅ ' : ''}${t('forecast')}${lang === 'zh' ? '：' : ': '}${icon} ${t(f)}`;
      ui.forecast.classList.toggle('match', match);
    }
    if (!state.completed) {
      let tip;
      if (state.delivery) tip = t('deliver');
      else if (fogOrder) tip = ready ? t('fogReady') : t('fogHint');
      else if (!match) tip = recipeHint(o.need, f) ?? (ready ? t('ready') : t('notReady'));
      else tip = ready ? t('ready') : t('notReady');
      ui.tip.textContent = tip;
    }
  }

  /** 每次状态变化的统一渲染入口（语言、主题切换都会调用） */
  function render() {
    if (!ui.orderTitle) return;
    const o = ORDERS[state.order];
    const fogOrder = o.need === 'fog';
    ui.orderTitle.textContent = t(o.key); ui.orderDesc.textContent = t(o.desc);
    ui.orderNum.textContent = `${state.order + 1}/${ORDERS.length}`;
    ui.stars.textContent = `⭐ ${state.totalStars}/${ORDERS.length * 3}`;
    ui.precip.textContent = fogOrder ? t('precipFog') : t('precip');
    ui.track.textContent = state.tracking ? t('trackOn') : t('track');
    if (ui.cloudLabel) ui.cloudLabel.textContent = fogOrder ? t('fogDepth') : t('cloudWeight');
    updateLiveUi();
    ui.terms.textContent = state.termsUnlocked ? t('termsFull') : t('termsHint');
    ui.track.classList.toggle('on', state.tracking);
    ui.orders.innerHTML = ORDERS.map((ord, i) => `<li class="${i === state.order ? 'on' : ''}${i < state.order ? ' done' : ''}">${i < state.order ? '✓ ' : ''}${t(ord.key)}</li>`).join('');
    drawScene(); drawParticles();
  }

  ['sun', 'lift', 'cold'].forEach((id) => {
    ui[id].addEventListener('input', () => { state[id] = Number(ui[id].value); state.idle = 0; render(); });
  });
  ui.precip.addEventListener('click', precipitate);
  ui.track.addEventListener('click', () => {
    state.tracking = !state.tracking;
    state.tracked = null; state.trackedPhase = null; state.path = []; state.fx = [];
    state.journey = { cond: false, prec: false, run: false }; state.trackCooldown = 0;
    state.idle = 0;
    toast(state.tracking ? t('orderCycleD') : t('termsHint'));
    render();
  });
  ui.reset.addEventListener('click', () => resetOrder(true));
  ui.next.addEventListener('click', nextOrder);
  ui.again.addEventListener('click', () => { ui.win.hidden = true; state.order = 0; state.totalStars = 0; state.snowMagicSeen = false; state.termsUnlocked = false; state.tracking = false; resetOrder(false); });
  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width * state.w;
    const y = (e.clientY - r.top) / r.height * state.h;
    state.idle = 0;
    let label;
    if (x < state.w * 0.35) { state.sun = clamp(state.sun + 12, 0, 100); ui.sun.value = state.sun; label = '☀️ +'; }
    else { state.lift = clamp(state.lift + 10, 0, 100); ui.lift.value = state.lift; label = '🌬️ +'; }
    state.taps.push({ x, y, label, life: 0 });
    render();
  });
  document.addEventListener('visibilitychange', () => { state.running = !document.hidden; });
  addEventListener('resize', resize);
  addEventListener('themechange', () => { cacheColors(); resize(); });

  /* ============================ 启动 ============================ */
  cacheColors();
  resize();
  resetOrder(true);
  requestAnimationFrame(loop);
  applyTheme();
  applyLang();
})();
