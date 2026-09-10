const MUSIC_LEVEL = 0.2;
const MASTER_LEVEL = 0.78;

export function createLabAudio({
  bgmUrl,
  storageKey = 'kidslab.motion-tracker-lab',
} = {}) {
  const store = {
    get(key, fallback) {
      try {
        const value = localStorage.getItem(`${storageKey}.${key}`);
        if (value === null) return fallback;
        return value === '1' || value === 'on' || value === 'true';
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try { localStorage.setItem(`${storageKey}.${key}`, value ? '1' : '0'); } catch { /* private mode */ }
    },
  };

  let ctx = null;
  let musicGain = null;
  let sfxGain = null;
  let bgmBuffer = null;
  let bgmSource = null;
  let unlocked = false;
  let loading = null;
  let musicOn = store.get('music', true);
  let sfxOn = store.get('sfx', true);

  function ensure() {
    if (ctx) return true;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return false;
    try {
      ctx = new Ctor();
      const master = ctx.createGain();
      master.gain.value = MASTER_LEVEL;
      const compressor = ctx.createDynamicsCompressor?.();
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
    if (!ctx || !bgmUrl || loading) return loading;
    if (typeof ctx.decodeAudioData !== 'function' || typeof ctx.createBufferSource !== 'function') {
      return Promise.resolve(false);
    }
    loading = fetch(bgmUrl)
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
      ramp(musicGain, MUSIC_LEVEL, 1.2);
      source.onended = () => {
        if (bgmSource === source) bgmSource = null;
      };
    } catch {
      bgmSource = null;
    }
  }

  async function unlock() {
    if (!ensure()) return false;
    unlocked = true;
    try {
      if (ctx.state === 'suspended') await ctx.resume();
    } catch {
      return false;
    }
    if (!musicOn && !sfxOn) return true;
    const ok = await loadBgm();
    if (ok) startBgm();
    return true;
  }

  function beep(kind = 'tap') {
    if (!sfxOn || !ensure()) return;
    try {
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      const now = ctx.currentTime;
      const settings = {
        mark: { notes: [392], type: 'triangle', gain: 0.07, duration: 0.12 },
        switch: { notes: [370], type: 'sine', gain: 0.05, duration: 0.1 },
        good: { notes: [523, 659], type: 'sine', gain: 0.08, duration: 0.22 },
        bad: { notes: [180, 140], type: 'sawtooth', gain: 0.05, duration: 0.2 },
        complete: { notes: [523, 659, 784], type: 'sine', gain: 0.09, duration: 0.42 },
        tap: { notes: [349], type: 'sine', gain: 0.05, duration: 0.1 },
      }[kind] || { notes: [370], type: 'sine', gain: 0.06, duration: 0.14 };
      settings.notes.forEach((frequency, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = settings.type;
        osc.frequency.setValueAtTime(frequency, now + index * 0.09);
        gain.gain.setValueAtTime(0.0001, now + index * 0.09);
        gain.gain.exponentialRampToValueAtTime(settings.gain, now + index * 0.09 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.09 + settings.duration);
        osc.connect(gain).connect(sfxGain);
        osc.start(now + index * 0.09);
        osc.stop(now + index * 0.09 + settings.duration + 0.02);
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
      if (unlocked) {
        ctx.resume?.().catch(() => {});
        if (!bgmBuffer) loadBgm().then((ok) => { if (ok) startBgm(); });
        else startBgm();
      }
      ramp(musicGain, MUSIC_LEVEL, 0.6);
    } else {
      ramp(musicGain, 0.0001, 0.28);
    }
  }

  function setSfx(next) {
    sfxOn = Boolean(next);
    store.set('sfx', sfxOn);
    if (sfxGain) ramp(sfxGain, sfxOn ? 0.9 : 0.0001, 0.12);
  }

  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend?.().catch(() => {});
    else if (unlocked && (musicOn || sfxOn)) ctx.resume?.().then(() => startBgm()).catch(() => {});
  });

  return {
    unlock,
    beep,
    setMusic,
    setSfx,
    get musicOn() { return musicOn; },
    get sfxOn() { return sfxOn; },
  };
}
