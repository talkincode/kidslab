const BGM_LOOP_END = 1497734 / 44100;
const MASTER_LEVEL = 0.7;

export function createAudio() {
  const store = {
    get(key, fallback) {
      try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : value === '1';
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try { localStorage.setItem(key, value ? '1' : '0'); } catch { /* no-op */ }
    },
  };

  let ctx = null;
  let master = null;
  let musicGain = null;
  let sfxGain = null;
  let bgmBuffer = null;
  let victoryBuffer = null;
  let bgmSource = null;
  let loading = null;
  let unlocked = false;
  let musicOn = store.get('kidslab.venn-port.music', true);
  let sfxOn = store.get('kidslab.venn-port.sfx', true);

  function ensureContext() {
    if (ctx) return true;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return false;
    try {
      ctx = new AudioContextClass();
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -17;
      compressor.knee.value = 18;
      compressor.ratio.value = 4;
      compressor.attack.value = 0.008;
      compressor.release.value = 0.22;
      compressor.connect(ctx.destination);

      master = ctx.createGain();
      master.gain.value = MASTER_LEVEL;
      master.connect(compressor);

      musicGain = ctx.createGain();
      musicGain.gain.value = 0;
      musicGain.connect(master);

      sfxGain = ctx.createGain();
      sfxGain.gain.value = sfxOn ? 0.86 : 0;
      sfxGain.connect(master);
      return true;
    } catch {
      ctx = null;
      return false;
    }
  }

  function loadBuffers() {
    if (!ctx) return Promise.resolve(false);
    if (loading) return loading;
    const decode = async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`audio fetch failed: ${response.status}`);
      return ctx.decodeAudioData(await response.arrayBuffer());
    };
    loading = Promise.all([
      decode(new URL('./audio/orbital-customs.ogg', import.meta.url)),
      decode(new URL('./audio/clear-to-dock.ogg', import.meta.url)),
    ]).then(([bgm, victory]) => {
      bgmBuffer = bgm;
      victoryBuffer = victory;
      return true;
    }).catch(() => false);
    return loading;
  }

  function ramp(node, value, seconds = 0.2) {
    if (!ctx || !node) return;
    const now = ctx.currentTime;
    node.gain.cancelScheduledValues(now);
    node.gain.setValueAtTime(Math.max(0.0001, node.gain.value), now);
    node.gain.exponentialRampToValueAtTime(Math.max(0.0001, value), now + seconds);
  }

  function startBgm() {
    if (!ctx || !bgmBuffer || bgmSource || !musicOn || !unlocked) return;
    const source = ctx.createBufferSource();
    source.buffer = bgmBuffer;
    source.loop = true;
    source.loopStart = 0;
    source.loopEnd = Math.min(BGM_LOOP_END, bgmBuffer.duration);
    source.connect(musicGain);
    source.start(ctx.currentTime + 0.04);
    bgmSource = source;
    ramp(musicGain, 0.38, 1.25);
  }

  async function unlock() {
    if (!ensureContext()) return false;
    unlocked = true;
    try {
      if (ctx.state === 'suspended') await ctx.resume();
    } catch {
      return false;
    }
    const loaded = await loadBuffers();
    if (loaded) startBgm();
    return true;
  }

  function oscillator({ type = 'sine', from, to = from, at, duration, level }) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(30, from), at);
    osc.frequency.exponentialRampToValueAtTime(Math.max(30, to), at + duration);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(level, at + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    osc.connect(gain).connect(sfxGain);
    osc.start(at);
    osc.stop(at + duration + 0.03);
  }

  function noise({ at, duration, level, frequency = 1100, q = 1.4 }) {
    const count = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, count, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let seed = 0x6c8e9cf;
    for (let index = 0; index < count; index += 1) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      data[index] = ((seed / 0xffffffff) * 2 - 1) * (1 - index / count);
    }
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = buffer;
    filter.type = 'bandpass';
    filter.frequency.value = frequency;
    filter.Q.value = q;
    gain.gain.setValueAtTime(level, at);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    source.connect(filter).connect(gain).connect(sfxGain);
    source.start(at);
  }

  const ready = () => Boolean(ctx && unlocked && sfxOn && ctx.state === 'running');

  function grab() {
    if (!ready()) return;
    const now = ctx.currentTime;
    oscillator({ type: 'sine', from: 520, to: 710, at: now, duration: 0.075, level: 0.055 });
  }

  function scan() {
    if (!ready()) return;
    const now = ctx.currentTime;
    oscillator({ type: 'square', from: 780, to: 1180, at: now, duration: 0.08, level: 0.035 });
    oscillator({ type: 'sine', from: 1260, to: 1260, at: now + 0.09, duration: 0.11, level: 0.045 });
  }

  function dock() {
    if (!ready()) return;
    const now = ctx.currentTime;
    noise({ at: now, duration: 0.13, level: 0.026, frequency: 540, q: 0.8 });
    oscillator({ type: 'triangle', from: 240, to: 170, at: now, duration: 0.14, level: 0.09 });
    oscillator({ type: 'sine', from: 660, to: 880, at: now + 0.12, duration: 0.24, level: 0.045 });
  }

  function invalid() {
    if (!ready()) return;
    const now = ctx.currentTime;
    oscillator({ type: 'sawtooth', from: 190, to: 118, at: now, duration: 0.12, level: 0.04 });
    oscillator({ type: 'sawtooth', from: 150, to: 92, at: now + 0.13, duration: 0.14, level: 0.035 });
  }

  function hint() {
    if (!ready()) return;
    const now = ctx.currentTime;
    oscillator({ type: 'sine', from: 698, to: 698, at: now, duration: 0.24, level: 0.05 });
    oscillator({ type: 'sine', from: 1047, to: 1047, at: now + 0.08, duration: 0.3, level: 0.035 });
  }

  function win() {
    if (!ready()) return;
    if (victoryBuffer) {
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      source.buffer = victoryBuffer;
      gain.gain.value = 0.68;
      source.connect(gain).connect(sfxGain);
      source.start();
      return;
    }
    hint();
  }

  function setMusic(value) {
    musicOn = Boolean(value);
    store.set('kidslab.venn-port.music', musicOn);
    if (!ctx) return;
    if (musicOn) {
      startBgm();
      ramp(musicGain, 0.38, 0.65);
    } else {
      ramp(musicGain, 0.0001, 0.3);
    }
  }

  function setSfx(value) {
    sfxOn = Boolean(value);
    store.set('kidslab.venn-port.sfx', sfxOn);
    if (sfxGain) ramp(sfxGain, sfxOn ? 0.86 : 0.0001, 0.12);
  }

  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden && ctx.state === 'running') {
      ctx.suspend().catch(() => {});
    } else if (!document.hidden && unlocked && (musicOn || sfxOn)) {
      ctx.resume().then(startBgm).catch(() => {});
    }
  });

  return {
    unlock,
    grab,
    scan,
    dock,
    invalid,
    hint,
    win,
    setMusic,
    setSfx,
    get musicOn() { return musicOn; },
    get sfxOn() { return sfxOn; },
  };
}
