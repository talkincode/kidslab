/* ============================================================
   轻史诗 BGM · Light-epic procedural score (Web Audio API)
   Am–F–C–G 弦乐长音 + 五声音阶星铃 + 深太鼓 + 转场升腾
   全程序化合成，无任何音频素材；强度随宇宙尺度增长。
   ============================================================ */

const BPM = 72;
const BEAT = 60 / BPM;          // 0.833s
const BAR = BEAT * 4;           // 3.333s

/* 和弦（每个和弦 2 小节）：Am → F → C → G，轻史诗经典进行 */
const CHORDS = [
  { root: 55.0,  notes: [110.0, 164.81, 220.0, 261.63, 329.63], pent: [220.0, 261.63, 329.63, 440.0, 523.25, 659.26] },   // Am
  { root: 43.65, notes: [87.31, 130.81, 174.61, 220.0, 261.63], pent: [261.63, 349.23, 440.0, 523.25, 698.46, 880.0] },   // F
  { root: 65.41, notes: [130.81, 196.0, 261.63, 329.63, 392.0], pent: [261.63, 329.63, 392.0, 523.25, 659.26, 783.99] },  // C
  { root: 49.0,  notes: [98.0, 146.83, 196.0, 246.94, 293.66],  pent: [293.66, 392.0, 493.88, 587.33, 783.99, 987.77] },  // G
];

export function createMusic() {
  let ctx = null;
  let master, dry, wet, comp;
  let noiseBuf = null;
  let timer = 0;
  let nextBar = 0;
  let barCount = 0;
  let intensity = 0.3;
  let on = false;

  function ensureCtx() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();

    comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -20;
    comp.knee.value = 24;
    comp.ratio.value = 5;
    comp.attack.value = 0.01;
    comp.release.value = 0.28;
    comp.connect(ctx.destination);

    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(comp);

    dry = ctx.createGain();
    dry.gain.value = 0.85;
    dry.connect(master);

    /* 程序化混响：指数衰减噪声脉冲 */
    const rev = ctx.createConvolver();
    const len = Math.floor(ctx.sampleRate * 2.8);
    const impulse = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = impulse.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.1);
    }
    rev.buffer = impulse;
    wet = ctx.createGain();
    wet.gain.value = 0.5;
    wet.connect(rev);
    rev.connect(master);

    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    return true;
  }

  function out(node, wetAmt = 0.4) {
    node.connect(dry);
    const w = ctx.createGain();
    w.gain.value = wetAmt;
    node.connect(w);
    w.connect(wet);
  }

  /* ---- 弦乐长音层：锯齿+三角 过低通，慢起慢收 ---- */
  function pad(chord, t0, dur, level) {
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 420 + intensity * 620;
    lp.Q.value = 0.6;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(level, t0 + 1.6);
    g.gain.setValueAtTime(level, t0 + dur - 1.6);
    g.gain.linearRampToValueAtTime(0.0001, t0 + dur + 0.9);
    lp.connect(g);
    out(g, 0.45);

    chord.notes.forEach((f, i) => {
      const top = i >= 3;
      if (top && intensity < 0.45) return;      // 高声部随强度加入
      [-5, 4].forEach((cents) => {
        const o = ctx.createOscillator();
        o.type = i < 2 ? 'sawtooth' : 'triangle';
        o.frequency.value = f;
        o.detune.value = cents + (Math.random() - 0.5) * 3;
        const vg = ctx.createGain();
        vg.gain.value = (i < 2 ? 0.05 : 0.038) * (top ? 0.7 : 1);
        o.connect(vg);
        vg.connect(lp);
        o.start(t0);
        o.stop(t0 + dur + 1.2);
      });
    });

    const bass = ctx.createOscillator();
    bass.type = 'sine';
    bass.frequency.value = chord.root;
    const bg = ctx.createGain();
    bg.gain.setValueAtTime(0.0001, t0);
    bg.gain.linearRampToValueAtTime(0.11, t0 + 1.2);
    bg.gain.setValueAtTime(0.11, t0 + dur - 1.2);
    bg.gain.linearRampToValueAtTime(0.0001, t0 + dur + 0.6);
    bass.connect(bg);
    out(bg, 0.15);
    bass.start(t0);
    bass.stop(t0 + dur + 0.8);
  }

  /* ---- 星铃：正弦+泛音，稀疏五声音阶闪烁 ---- */
  function bell(freq, t0, vol) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.9);
    const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (pan) { pan.pan.value = (Math.random() - 0.5) * 1.1; g.connect(pan); out(pan, 0.75); }
    else out(g, 0.75);
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

  /* ---- 深太鼓：下坠正弦 ---- */
  function boom(t0, vol) {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(88, t0);
    o.frequency.exponentialRampToValueAtTime(41, t0 + 0.32);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.85);
    o.connect(g);
    out(g, 0.3);
    o.start(t0);
    o.stop(t0 + 1);
  }

  /* ---- 转场升腾：带通噪声扫频 + 高音微光 ---- */
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
    g.gain.linearRampToValueAtTime(0.055, t0 + 2.1);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 3);
    src.connect(bp);
    bp.connect(g);
    out(g, 0.8);
    src.start(t0);
    src.stop(t0 + 3.1);
    const shimmer = 1046.5 + Math.random() * 200;
    bell(shimmer, t0 + 2.15, 0.05);
    bell(shimmer * 1.5, t0 + 2.4, 0.038);
  }

  /* ---- 调度器：每 2 小节换和弦，铃铛/鼓按强度点缀 ---- */
  function scheduleBar(t0, bar) {
    const chord = CHORDS[(bar >> 1) % CHORDS.length];
    if (bar % 2 === 0) pad(chord, t0, BAR * 2, 0.5 + intensity * 0.35);

    if (intensity > 0.42) boom(t0, 0.28 + intensity * 0.3);
    if (intensity > 0.72) boom(t0 + BEAT * 2.5, 0.14 + intensity * 0.14);

    const density = 0.16 + intensity * 0.42;
    for (let s = 0; s < 8; s++) {
      if (Math.random() < density * (s % 2 ? 0.55 : 1)) {
        const n = chord.pent[(Math.random() * chord.pent.length) | 0];
        bell(n, t0 + s * BEAT * 0.5 + Math.random() * 0.03, 0.028 + Math.random() * 0.03 + intensity * 0.02);
      }
    }
  }

  function tick() {
    if (!ctx || ctx.state !== 'running') return;
    while (nextBar < ctx.currentTime + 1.2) {
      scheduleBar(Math.max(nextBar, ctx.currentTime + 0.05), barCount);
      nextBar += BAR;
      barCount++;
    }
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
        master.gain.linearRampToValueAtTime(0.3, t + 2.4);
        nextBar = Math.max(nextBar, t + 0.08);
        if (!timer) timer = setInterval(tick, 180);
        tick();
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
      clearInterval(timer);
      timer = 0;
      setTimeout(() => { if (!on && ctx && ctx.state === 'running') ctx.suspend(); }, 650);
    },
    /** 0..1，随宇宙尺度增长 */
    setIntensity(v) { intensity = Math.max(0, Math.min(1, v)); },
    /** 场景切换时的升腾音 */
    swell() { if (on && ctx && ctx.state === 'running') riser(ctx.currentTime + 0.05); },
    suspend() { if (ctx && on) ctx.suspend(); },
    resume() { if (ctx && on) ctx.resume(); },
  };
}
