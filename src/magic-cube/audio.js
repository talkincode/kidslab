/* ============================================================
   魔方小达人 · 轻量音效（WebAudio 合成，无素材文件）
   首次用户手势里 resume()；支持静音开关。
   ============================================================ */
export function createAudio() {
  let ctx = null;
  let muted = false;

  function ensure() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; }
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }

  /** 短促咔哒（转层吸附） */
  function click(pitch = 1) {
    if (muted) return;
    const c = ensure(); if (!c) return;
    const t = c.currentTime;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(680 * pitch, t);
    o.frequency.exponentialRampToValueAtTime(240 * pitch, t + 0.07);
    g.gain.setValueAtTime(0.13, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    o.connect(g).connect(c.destination);
    o.start(t); o.stop(t + 0.1);
  }

  /** 沙沙转动声（拖拽进行时轻微、随速度） */
  function whoosh() {
    if (muted) return;
    const c = ensure(); if (!c) return;
    const t = c.currentTime;
    const len = 0.12;
    const buf = c.createBuffer(1, c.sampleRate * len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = c.createBufferSource();
    src.buffer = buf;
    const f = c.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 1.4;
    const g = c.createGain();
    g.gain.setValueAtTime(0.05, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    src.connect(f).connect(g).connect(c.destination);
    src.start(t);
  }

  /** 胜利琶音 */
  function win() {
    if (muted) return;
    const c = ensure(); if (!c) return;
    const t0 = c.currentTime;
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => {
      const t = t0 + i * 0.11;
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      o.connect(g).connect(c.destination);
      o.start(t); o.stop(t + 0.55);
    });
  }

  return {
    ensure, click, whoosh, win,
    setMuted: (v) => { muted = v; },
    get muted() { return muted; },
  };
}
