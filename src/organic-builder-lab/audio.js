const BGM_URL = new URL('./audio/bgm-lab.ogg', import.meta.url);
const BGM_LEVEL = 0.18;
const MASTER_LEVEL = 0.78;

export function createLabAudio(storageKey = 'kidslab.organic-builder-lab') {
  const store = {
    get(key, fallbackOn) {
      try {
        const value = localStorage.getItem(`${storageKey}.${key}`);
        if (value === null) return fallbackOn;
        return value !== 'off' && value !== '0';
      } catch {
        return fallbackOn;
      }
    },
    set(key, on) {
      try { localStorage.setItem(`${storageKey}.${key}`, on ? 'on' : 'off'); } catch { /* private mode */ }
    },
  };

  let ctx = null;
  let master = null;
  let musicGain = null;
  let sfxGain = null;
  let bgmBuffer = null;
  let bgmSource = null;
  let loading = null;
  let unlocked = false;
  let musicOn = store.get('music', true);
  let sfxOn = store.get('sound', true);

  function ensureContext() {
    if (ctx) return true;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return false;
    try {
      ctx = new Ctor();
      const compressor = ctx.createDynamicsCompressor?.();
      master = ctx.createGain();
      master.gain.value = MASTER_LEVEL;
      if (compressor) {
        compressor.threshold.value = -18;
        compressor.ratio.value = 3;
        compressor.connect(ctx.destination);
        master.connect(compressor);
      } else {
        master.connect(ctx.destination);
      }
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
    if (!ctx || loading) return loading;
    if (typeof ctx.decodeAudioData !== 'function' || typeof ctx.createBufferSource !== 'function') {
      return Promise.resolve(false);
    }
    loading = fetch(BGM_URL)
      .then((response) => (response.ok ? response.arrayBuffer() : Promise.reject()))
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
      source.start();
      bgmSource = source;
      ramp(musicGain, BGM_LEVEL, 1.2);
      source.onended = () => { if (bgmSource === source) bgmSource = null; };
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
      const ok = await loadBgm();
      if (ok) startBgm();
    }
    return true;
  }

  function readyForSfx() {
    return Boolean(ctx && unlocked && sfxOn);
  }

  function chord(notes, { type = 'sine', gain = 0.05, duration = 0.18, step = 0.09 } = {}) {
    if (!readyForSfx() || !ensureContext()) return;
    try {
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      const now = ctx.currentTime;
      notes.forEach((frequency, index) => {
        const osc = ctx.createOscillator();
        const env = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, now + index * step);
        env.gain.setValueAtTime(0.0001, now + index * step);
        env.gain.exponentialRampToValueAtTime(gain, now + index * step + 0.012);
        env.gain.exponentialRampToValueAtTime(0.0001, now + index * step + duration);
        osc.connect(env).connect(sfxGain);
        osc.start(now + index * step);
        osc.stop(now + index * step + duration + 0.02);
      });
    } catch {
      // Sound is optional.
    }
  }

  function setMusic(next) {
    musicOn = Boolean(next);
    store.set('music', musicOn);
    if (!ctx) return;
    if (musicOn) {
      if (unlocked) loadBgm().then((ok) => { if (ok) startBgm(); });
      ramp(musicGain, BGM_LEVEL, 0.5);
    } else {
      ramp(musicGain, 0.0001, 0.28);
    }
  }

  function setSfx(next) {
    sfxOn = Boolean(next);
    store.set('sound', sfxOn);
    if (sfxGain) ramp(sfxGain, sfxOn ? 0.9 : 0.0001, 0.12);
  }

  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend?.().catch(() => {});
    else if (!document.hidden && unlocked && (musicOn || sfxOn)) {
      ctx.resume?.().then(() => startBgm()).catch(() => {});
    }
  });

  return {
    unlock,
    place: () => chord([392], { duration: 0.14, gain: 0.045 }),
    pick: () => chord([330], { type: 'triangle', duration: 0.1, gain: 0.035 }),
    bond: () => chord([330, 494], { type: 'triangle', duration: 0.22, gain: 0.05 }),
    measure: () => chord([587], { duration: 0.16, gain: 0.04 }),
    dripYes: () => chord([523, 659], { duration: 0.24, gain: 0.055 }),
    dripNo: () => chord([220], { type: 'triangle', duration: 0.18, gain: 0.04 }),
    success: () => chord([523, 659], { duration: 0.26, gain: 0.055 }),
    error: () => chord([175, 140], { type: 'sawtooth', duration: 0.2, gain: 0.035, step: 0.08 }),
    complete: () => chord([440, 554, 659, 880], { duration: 0.42, gain: 0.055, step: 0.1 }),
    clear: () => chord([262], { type: 'triangle', duration: 0.16, gain: 0.04 }),
    setMusic,
    setSfx,
    get musicOn() { return musicOn; },
    get sfxOn() { return sfxOn; },
  };
}
