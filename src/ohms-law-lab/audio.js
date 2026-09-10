const BGM_URL = new URL('./audio/bgm-calm-tech-01.ogg', import.meta.url);
const BGM_LEVEL = 0.2;
const MASTER_LEVEL = 0.74;

export function createAudio(storageKey = 'kidslab.ohms-law-lab') {
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

  function legacyMuted() {
    try {
      return localStorage.getItem(`${storageKey}.sound`) === 'true';
    } catch {
      return false;
    }
  }

  const mutedByLegacy = legacyMuted();
  let ctx = null;
  let master = null;
  let musicGain = null;
  let sfxGain = null;
  let bgmBuffer = null;
  let bgmSource = null;
  let loading = null;
  let unlocked = false;
  let musicOn = mutedByLegacy ? false : store.get('music', true);
  let sfxOn = mutedByLegacy ? false : store.get('sfx', true);

  function ensureContext() {
    if (ctx) return true;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return false;
    try {
      ctx = new Ctor();
      const compressor = ctx.createDynamicsCompressor();
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
    try {
      const source = ctx.createBufferSource();
      source.buffer = bgmBuffer;
      source.loop = true;
      source.connect(musicGain);
      source.start(ctx.currentTime + 0.03);
      bgmSource = source;
      source.onended = () => {
        if (bgmSource === source) bgmSource = null;
      };
      ramp(musicGain, BGM_LEVEL, 1.2);
    } catch {
      bgmSource = null;
    }
  }

  async function unlock() {
    if (!ensureContext()) return false;
    unlocked = true;
    try {
      if (ctx.state === 'suspended') await ctx.resume();
    } catch {
      return false;
    }
    if (musicOn) {
      const loaded = await loadBgm();
      if (loaded) startBgm();
    }
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

  function click() {
    if (!readyForSfx()) return;
    const now = ctx.currentTime;
    tone({ type: 'triangle', from: 640, to: 420, at: now, duration: 0.05, level: 0.045 });
  }

  function pickup() {
    if (!readyForSfx()) return;
    const now = ctx.currentTime;
    tone({ type: 'triangle', from: 392, to: 520, at: now, duration: 0.08, level: 0.05 });
  }

  function record() {
    if (!readyForSfx()) return;
    const now = ctx.currentTime;
    tone({ type: 'sine', from: 660, to: 880, at: now, duration: 0.12, level: 0.06 });
    tone({ type: 'sine', from: 880, to: 1180, at: now + 0.08, duration: 0.16, level: 0.05 });
  }

  function error() {
    if (!readyForSfx()) return;
    const now = ctx.currentTime;
    tone({ type: 'square', from: 180, to: 90, at: now, duration: 0.14, level: 0.05 });
  }

  function success() {
    if (!readyForSfx()) return;
    const now = ctx.currentTime;
    tone({ type: 'sine', from: 520, to: 780, at: now, duration: 0.16, level: 0.06 });
    tone({ type: 'triangle', from: 780, to: 1040, at: now + 0.07, duration: 0.18, level: 0.045 });
  }

  function setMusic(value) {
    musicOn = Boolean(value);
    store.set('music', musicOn);
    try { localStorage.setItem(`${storageKey}.sound`, musicOn || sfxOn ? 'false' : 'true'); } catch { /* private mode */ }
    if (!ctx) return;
    if (musicOn) {
      loadBgm().then((ok) => { if (ok) startBgm(); });
      ramp(musicGain, BGM_LEVEL, 0.6);
    } else {
      ramp(musicGain, 0.0001, 0.28);
    }
  }

  function setSfx(value) {
    sfxOn = Boolean(value);
    store.set('sfx', sfxOn);
    try { localStorage.setItem(`${storageKey}.sound`, musicOn || sfxOn ? 'false' : 'true'); } catch { /* private mode */ }
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
    click,
    pickup,
    record,
    error,
    success,
    setMusic,
    setSfx,
    get musicOn() { return musicOn; },
    get sfxOn() { return sfxOn; },
  };
}
