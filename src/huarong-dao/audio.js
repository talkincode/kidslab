const BGM_LOOP_END = 1380520 / 44100;
const MASTER_LEVEL = 0.72;

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
  let compressor = null;
  let bgmBuffer = null;
  let victoryBuffer = null;
  let bgmSource = null;
  let loading = null;
  let unlocked = false;
  let musicOn = store.get('kidslab.huarong-dao.music', true);
  let sfxOn = store.get('kidslab.huarong-dao.sfx', true);

  function ensureContext() {
    if (ctx) return true;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return false;
    try {
      ctx = new AudioContextClass();
      compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -18;
      compressor.knee.value = 20;
      compressor.ratio.value = 4;
      compressor.attack.value = 0.008;
      compressor.release.value = 0.24;
      compressor.connect(ctx.destination);

      master = ctx.createGain();
      master.gain.value = MASTER_LEVEL;
      master.connect(compressor);

      musicGain = ctx.createGain();
      musicGain.gain.value = 0;
      musicGain.connect(master);

      sfxGain = ctx.createGain();
      sfxGain.gain.value = sfxOn ? 0.9 : 0;
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
      decode(new URL('./audio/wooden-gate.ogg', import.meta.url)),
      decode(new URL('./audio/pass-clear.ogg', import.meta.url)),
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
    ramp(musicGain, 0.42, 1.4);
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
    osc.stop(at + duration + 0.02);
  }

  function noise({ at, duration, level, frequency = 900, q = 1.2 }) {
    const count = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, count, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let seed = 0x2f6e2b1;
    for (let i = 0; i < count; i += 1) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      data[i] = ((seed / 0xffffffff) * 2 - 1) * (1 - i / count);
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

  function readyForSfx() {
    return Boolean(ctx && unlocked && sfxOn && ctx.state === 'running');
  }

  function pick() {
    if (!readyForSfx()) return;
    const now = ctx.currentTime;
    oscillator({ type: 'triangle', from: 460, to: 620, at: now, duration: 0.07, level: 0.075 });
  }

  function slide() {
    if (!readyForSfx()) return;
    const now = ctx.currentTime;
    noise({ at: now, duration: 0.12, level: 0.035, frequency: 720, q: 0.9 });
    oscillator({ type: 'triangle', from: 210, to: 135, at: now + 0.075, duration: 0.09, level: 0.11 });
  }

  function invalid() {
    if (!readyForSfx()) return;
    const now = ctx.currentTime;
    oscillator({ type: 'square', from: 150, to: 112, at: now, duration: 0.11, level: 0.055 });
    oscillator({ type: 'square', from: 122, to: 92, at: now + 0.13, duration: 0.13, level: 0.05 });
  }

  function hint() {
    if (!readyForSfx()) return;
    const now = ctx.currentTime;
    oscillator({ type: 'sine', from: 660, to: 660, at: now, duration: 0.32, level: 0.055 });
    oscillator({ type: 'sine', from: 990, to: 990, at: now + 0.07, duration: 0.38, level: 0.04 });
  }

  function win() {
    if (!readyForSfx()) return;
    if (victoryBuffer) {
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      source.buffer = victoryBuffer;
      gain.gain.value = 0.72;
      source.connect(gain).connect(sfxGain);
      source.start();
      return;
    }
    hint();
  }

  function setMusic(value) {
    musicOn = Boolean(value);
    store.set('kidslab.huarong-dao.music', musicOn);
    if (!ctx) return;
    if (musicOn) {
      startBgm();
      ramp(musicGain, 0.42, 0.7);
    } else {
      ramp(musicGain, 0.0001, 0.35);
    }
  }

  function setSfx(value) {
    sfxOn = Boolean(value);
    store.set('kidslab.huarong-dao.sfx', sfxOn);
    if (sfxGain) ramp(sfxGain, sfxOn ? 0.9 : 0.0001, 0.12);
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
    pick,
    slide,
    invalid,
    hint,
    win,
    setMusic,
    setSfx,
    get musicOn() { return musicOn; },
    get sfxOn() { return sfxOn; },
  };
}
