/* ============================================================
   轻史诗 BGM · Layered score (scorekit + Web Audio API)
   由 scorekit 作曲渲染的三层无缝循环（scripts/bgm/welcome-theme.yaml）：
     base — 音乐盒主题 + 竖琴 + 暖垫（台灯书桌）
     mid  — 弦乐长音 + 大提琴 + 小提琴应答（城市 → 太阳系）
     epic — 人声合唱 + 定音鼓 + 星尘钟琴（银河 → 宇宙之网）
   A 小调 72BPM，Am–F–C–G；层增益随宇宙尺度(intensity)渐入。
   转场升腾音保留程序化合成（带通噪声扫频 + 泛音铃）。
   ============================================================ */

const LAYERS = [
  { id: 'base', url: new URL('./audio/bgm-base.m4a', import.meta.url), lo: 0.0, hi: 0.3, floor: 0.9 },
  { id: 'mid', url: new URL('./audio/bgm-mid.m4a', import.meta.url), lo: 0.25, hi: 0.62, floor: 0 },
  { id: 'epic', url: new URL('./audio/bgm-epic.m4a', import.meta.url), lo: 0.55, hi: 0.95, floor: 0 },
];
const RAMP = 1.5;          // 层增益追赶时间常数(s)
const MASTER_LEVEL = 0.72; // 总输出
const LOOP_SECONDS = 2351999 / 44100; // scorekit meta.json 的精确循环长度，绕过 AAC 尾部 padding

export function createMusic() {
  let ctx = null;
  let master, comp, noiseBuf;
  let layers = null;       // [{ gain, src, buf }]
  let loading = null;
  let intensity = 0.3;
  let applied = -1;        // 最近一次已应用到增益的强度
  let on = false;

  function ensureCtx() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();

    comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.knee.value = 22;
    comp.ratio.value = 4;
    comp.attack.value = 0.01;
    comp.release.value = 0.3;
    comp.connect(ctx.destination);

    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(comp);

    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    return true;
  }

  /* 层目标增益：intensity 在 [lo, hi] 区间内 smoothstep 渐入，floor 为常开底量 */
  function levelOf(L) {
    const x = Math.max(0, Math.min(1, (intensity - L.lo) / (L.hi - L.lo)));
    const s = x * x * (3 - 2 * x);
    return L.floor + (1 - L.floor) * s;
  }

  function loadLayers() {
    if (loading) return loading;
    loading = Promise.all(LAYERS.map(async (L) => {
      const res = await fetch(L.url);
      if (!res.ok) throw new Error(`bgm fetch failed: ${L.id}`);
      const buf = await ctx.decodeAudioData(await res.arrayBuffer());
      return { def: L, buf };
    }));
    return loading;
  }

  function startSources(decoded) {
    if (layers || !on) return;
    const t = ctx.currentTime + 0.05;
    layers = decoded.map(({ def, buf }) => {
      const gain = ctx.createGain();
      gain.gain.value = levelOf(def);
      gain.connect(master);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      src.loopEnd = Math.min(buf.duration, LOOP_SECONDS);
      src.connect(gain);
      src.start(t);
      return { def, gain, src };
    });
  }

  function applyIntensity() {
    if (!layers || !ctx) return;
    const t = ctx.currentTime;
    for (const L of layers) {
      L.gain.gain.cancelScheduledValues(t);
      L.gain.gain.setTargetAtTime(levelOf(L.def), t, RAMP);
    }
    applied = intensity;
  }

  /* ---- 转场升腾：带通噪声扫频 + 高音微光（程序化，保持即时性） ---- */
  function bell(freq, t0, vol) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.9);
    const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (pan) { pan.pan.value = (Math.random() - 0.5) * 1.1; g.connect(pan); pan.connect(master); }
    else g.connect(master);
    [[1, 1], [2, 0.34], [2.99, 0.12]].forEach(([mul, amp]) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = freq * mul;
      const og = ctx.createGain();
      og.gain.value = amp;
      o.connect(og);
      og.connect(g);
      o.start(t0);
      o.stop(t0 + 2);
    });
  }

  function riser(t0) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    src.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 1.4;
    bp.frequency.setValueAtTime(260, t0);
    bp.frequency.exponentialRampToValueAtTime(2600, t0 + 2.4);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(0.05, t0 + 2.1);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 3);
    src.connect(bp);
    bp.connect(g);
    g.connect(master);
    src.start(t0);
    src.stop(t0 + 3.1);
    const shimmer = 1046.5 + Math.random() * 200;
    bell(shimmer, t0 + 2.15, 0.05);
    bell(shimmer * 1.5, t0 + 2.4, 0.038);
  }

  return {
    get on() { return on; },
    /** 必须由用户手势调用 */
    start() {
      if (!ensureCtx()) return false;
      on = true;
      ctx.resume().then(() => {
        const t = ctx.currentTime;
        master.gain.cancelScheduledValues(t);
        master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), t);
        master.gain.linearRampToValueAtTime(MASTER_LEVEL, t + 2.4);
        loadLayers().then((decoded) => {
          startSources(decoded);
          applyIntensity();
        }).catch(() => {});
      }).catch(() => {});
      return true;
    },
    stop() {
      on = false;
      if (!ctx) return;
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(0.0001, t + 0.5);
      setTimeout(() => { if (!on && ctx && ctx.state === 'running') ctx.suspend(); }, 650);
    },
    /** 0..1，随宇宙尺度增长 */
    setIntensity(v) {
      intensity = Math.max(0, Math.min(1, v));
      if (layers && Math.abs(intensity - applied) >= 0.003) applyIntensity();
    },
    /** 场景切换时的升腾音 */
    swell() { if (on && ctx && ctx.state === 'running') riser(ctx.currentTime + 0.05); },
    suspend() { if (ctx && on) ctx.suspend(); },
    resume() { if (ctx && on) ctx.resume(); },
  };
}
