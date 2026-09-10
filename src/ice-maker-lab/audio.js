const MUSIC_LEVEL = 0.18;

export function createLabAudio({ bgmUrl, muted = false } = {}) {
  let ctx = null;
  let musicGain = null;
  let sfxGain = null;
  let bgmBuffer = null;
  let bgmSource = null;
  let unlocked = false;
  let loading = null;
  let isMuted = muted;
  let humNodes = null;

  function ensure() {
    if (ctx) return true;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return false;
    try {
      ctx = new Ctor();
      const master = ctx.createGain();
      master.gain.value = 0.8;
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
      sfxGain.gain.value = isMuted ? 0 : 0.9;
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

  function startBgm() {
    if (!ctx || !bgmBuffer || bgmSource || isMuted || !unlocked) return;
    try {
      const source = ctx.createBufferSource();
      source.buffer = bgmBuffer;
      source.loop = true;
      source.connect(musicGain);
      source.start();
      bgmSource = source;
      const now = ctx.currentTime;
      musicGain.gain.cancelScheduledValues(now);
      musicGain.gain.setValueAtTime(0.0001, now);
      musicGain.gain.exponentialRampToValueAtTime(MUSIC_LEVEL, now + 1.2);
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
    if (isMuted) return true;
    const ok = await loadBgm();
    if (ok) startBgm();
    return true;
  }

  function beep(kind = 'tap') {
    if (isMuted || !ensure()) return;
    try {
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      const now = ctx.currentTime;
      const settings = {
        tap: { notes: [392], type: 'triangle', gain: 0.07, duration: 0.12 },
        fill: { notes: [480, 620], type: 'sine', gain: 0.06, duration: 0.16 },
        power: { notes: [90, 180], type: 'sawtooth', gain: 0.05, duration: 0.22 },
        freeze: { notes: [880, 1175], type: 'sine', gain: 0.05, duration: 0.18 },
        harvest: { notes: [880, 1175, 1568], type: 'triangle', gain: 0.06, duration: 0.2 },
        good: { notes: [523, 659], type: 'sine', gain: 0.08, duration: 0.22 },
        bad: { notes: [180, 140], type: 'sawtooth', gain: 0.05, duration: 0.2 },
        win: { notes: [523, 659, 784], type: 'sine', gain: 0.09, duration: 0.42 },
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

  function stopHum() {
    if (!humNodes || !ctx) {
      humNodes = null;
      return;
    }
    try {
      const now = ctx.currentTime;
      humNodes.gain.gain.cancelScheduledValues(now);
      humNodes.gain.gain.setValueAtTime(Math.max(0.0001, humNodes.gain.gain.value), now);
      humNodes.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      const nodes = humNodes;
      setTimeout(() => {
        try { nodes.o1.stop(); nodes.o2.stop(); } catch { /* ignore */ }
      }, 120);
    } catch { /* ignore */ }
    humNodes = null;
  }

  function setHum(on, level = 2) {
    if (!on || isMuted) {
      stopHum();
      return;
    }
    if (!ensure()) return;
    try {
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      if (!humNodes) {
        const o1 = ctx.createOscillator();
        const o2 = ctx.createOscillator();
        const gain = ctx.createGain();
        o1.type = 'sine';
        o2.type = 'triangle';
        o1.frequency.value = 52;
        o2.frequency.value = 104;
        gain.gain.value = 0.0001;
        o1.connect(gain);
        o2.connect(gain);
        gain.connect(sfxGain);
        o1.start();
        o2.start();
        humNodes = { o1, o2, gain };
      }
      const now = ctx.currentTime;
      const target = 0.01 + level * 0.004;
      humNodes.gain.gain.setTargetAtTime(target, now, 0.08);
      humNodes.o1.frequency.setTargetAtTime(46 + level * 10, now, 0.12);
      humNodes.o2.frequency.setTargetAtTime(92 + level * 20, now, 0.12);
    } catch {
      humNodes = null;
    }
  }

  function setMuted(next) {
    isMuted = next;
    if (next) stopHum();
    if (!ctx) return;
    try {
      if (sfxGain) sfxGain.gain.value = next ? 0 : 0.9;
      if (musicGain) {
        const now = ctx.currentTime;
        musicGain.gain.cancelScheduledValues(now);
        musicGain.gain.setValueAtTime(Math.max(0.0001, musicGain.gain.value), now);
        musicGain.gain.exponentialRampToValueAtTime(next ? 0.0001 : MUSIC_LEVEL, now + 0.18);
      }
      if (next) ctx.suspend?.().catch(() => {});
      else if (unlocked) {
        ctx.resume?.().catch(() => {});
        startBgm();
      }
    } catch {
      // Mute must never break the lab.
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend?.().catch(() => {});
    else if (!isMuted && unlocked) ctx.resume?.().then(() => startBgm()).catch(() => {});
  });

  return {
    unlock,
    beep,
    setHum,
    setMuted,
    get muted() { return isMuted; },
  };
}
