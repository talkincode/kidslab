const BGM_URL = new URL('./audio/lab-glow.ogg', import.meta.url);
const BGM_LEVEL = 0.22;
const MASTER_LEVEL = 0.74;

export function createAudio(storageKey = 'kidslab.statistics-sampling-lab') {
  const store = {
    get(key, fallback) {
      try {
        const value = localStorage.getItem(`${storageKey}.${key}`);
        return value === null ? fallback : value === '1';
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try { localStorage.setItem(`${storageKey}.${key}`, value ? '1' : '0'); } catch { /* private mode */ }
    },
  };

  let ctx = null;
  let master = null;
  let musicGain = null;
  let sfxGain = null;
  let compressor = null;
  let bgmBuffer = null;
  let bgmSource = null;
  let loading = null;
  let unlocked = false;
  let musicOn = store.get('music', true);
  let sfxOn = store.get('sfx', true);

  function ensureContext() {
    if (ctx) return true;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return false;
    try {
      ctx = new Ctor();
      compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -18;
      compressor.knee.value = 18;
      compressor.ratio.value = 3.5;
      compressor.attack.value = 0.008;
      compressor.release.value = 0.22;
      compressor.connect(ctx.destination);

      master = ctx.createGain();
      master.gain.value = MASTER_LEVEL;
      master.connect(compressor);

      musicGain = ctx.createGain();
      musicGain.gain.value = 0.0001;
      musicGain.connect(master);

      sfxGain = ctx.createGain();
      sfxGain.gain.value = sfxOn ? 0.9 : 0.0001;
      sfxGain.connect(master);
      return true;
    } catch {
      ctx = null;
      return false;
    }
  }

  function loadBgm() {
    if (!ctx) return Promise.resolve(false);
    if (loading) return loading;
    loading = fetch(BGM_URL)
      .then((response) => {
        if (!response.ok) throw new Error('bgm missing');
        return response.arrayBuffer();
      })
      .then((buffer) => ctx.decodeAudioData(buffer))
      .then((decoded) => {
        bgmBuffer = decoded;
        return true;
      })
      .catch(() => false);
    return loading;
  }

  function ramp(node, value, seconds = 0.18) {
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
    source.connect(musicGain);
    source.start(ctx.currentTime + 0.03);
    bgmSource = source;
    ramp(musicGain, BGM_LEVEL, 1.2);
  }

  async function unlock() {
    if (!ensureContext()) return false;
    unlocked = true;
    try {
      if (ctx.state === 'suspended') await ctx.resume();
    } catch {
      return false;
    }
    const loaded = await loadBgm();
    if (loaded) startBgm();
    return true;
  }

  function readyForSfx() {
    return Boolean(ctx && unlocked && sfxOn && ctx.state === 'running');
  }

  function tone({ type = 'sine', from, to = from, at, duration, level }) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(30, from), at);
    osc.frequency.exponentialRampToValueAtTime(Math.max(30, to), at + duration);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(level, at + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    osc.connect(gain).connect(sfxGain);
    osc.start(at);
    osc.stop(at + duration + 0.02);
  }

  function bounce(speed = 1) {
    if (!readyForSfx()) return;
    const now = ctx.currentTime;
    const punch = Math.min(1.4, 0.45 + speed * 0.18);
    tone({ type: 'triangle', from: 220 + speed * 40, to: 90, at: now, duration: 0.11, level: 0.09 * punch });
    tone({ type: 'sine', from: 520, to: 180, at: now + 0.015, duration: 0.08, level: 0.05 * punch });
  }

  function click() {
    if (!readyForSfx()) return;
    const now = ctx.currentTime;
    tone({ type: 'triangle', from: 640, to: 420, at: now, duration: 0.05, level: 0.045 });
  }

  function record() {
    if (!readyForSfx()) return;
    const now = ctx.currentTime;
    tone({ type: 'sine', from: 660, to: 880, at: now, duration: 0.12, level: 0.06 });
    tone({ type: 'sine', from: 880, to: 1180, at: now + 0.08, duration: 0.16, level: 0.05 });
  }

  function drop() {
    if (!readyForSfx()) return;
    const now = ctx.currentTime;
    tone({ type: 'sine', from: 180, to: 140, at: now, duration: 0.09, level: 0.05 });
  }

  function sample() {
    if (!readyForSfx()) return;
    const now = ctx.currentTime;
    tone({ type: 'triangle', from: 420, to: 640, at: now, duration: 0.09, level: 0.05 });
    tone({ type: 'sine', from: 720, to: 520, at: now + 0.06, duration: 0.1, level: 0.04 });
  }

  function census() {
    if (!readyForSfx()) return;
    const now = ctx.currentTime;
    tone({ type: 'sine', from: 220, to: 330, at: now, duration: 0.18, level: 0.06 });
    tone({ type: 'triangle', from: 440, to: 660, at: now + 0.12, duration: 0.2, level: 0.05 });
  }

  function error() {
    if (!readyForSfx()) return;
    const now = ctx.currentTime;
    tone({ type: 'square', from: 220, to: 110, at: now, duration: 0.14, level: 0.04 });
  }

  function success() {
    if (!readyForSfx()) return;
    const now = ctx.currentTime;
    tone({ type: 'sine', from: 523, to: 784, at: now, duration: 0.16, level: 0.06 });
    tone({ type: 'sine', from: 659, to: 988, at: now + 0.12, duration: 0.22, level: 0.05 });
  }

  function setMusic(value) {
    musicOn = Boolean(value);
    store.set('music', musicOn);
    if (!ctx) return;
    if (musicOn) {
      startBgm();
      ramp(musicGain, BGM_LEVEL, 0.6);
    } else {
      ramp(musicGain, 0.0001, 0.28);
    }
  }

  function setSfx(value) {
    sfxOn = Boolean(value);
    store.set('sfx', sfxOn);
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
    bounce,
    click,
    record,
    drop,
    sample,
    census,
    error,
    success,
    setMusic,
    setSfx,
    get musicOn() { return musicOn; },
    get sfxOn() { return sfxOn; },
  };
}
