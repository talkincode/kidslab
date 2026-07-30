(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '密码社 · KidsLab',
      back: '返回平台',
      title: '密码社',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      themeLabel: '切换主题',
      missionsLabel: '密码任务',
      lockedMission: '先完成上一张纸条',
      missionLabel: (n, title) => `任务 ${n}：${title}`,
      hint: '轻提示',
      next: '领取下一张纸条',
      key: '钥匙',
      plainText: '明文',
      cipherText: '密文',
      foundKey: '找到的钥匙',
      decodeDirection: '把每个字母向后退 5 格，找回集合地点。',
      interceptedMessage: '截获的长纸条',
      frequencyTitle: '密文字母出现次数',
      chooseKey: '旋转钥匙',
      keyDown: '钥匙减一',
      keyUp: '钥匙加一',
      sealNote: '封好纸条',
      choosePlain: '哪张纸条是还原后的明文？',
      chooseFrequent: '第一步：点出次数最多的密文字母',
      chooseMapping: '第二步：先猜它可能对应哪个常见明文字母',
      crackMessage: '用推出的钥匙 3 破译',
      finalKicker: '三封秘密纸条全部破解',
      finalTitle: '欢迎加入密码社！',
      finalText: '你会用钥匙加密和解密，还能从重复的字母中寻找没有钥匙的突破口。',
      playAgain: '重新接受入社考验',
      act1Kicker: '入社考验 · 加密',
      act1Title: '把转盘调到钥匙 3，封好第一张纸条',
      act1Text: '每个字母一起向前走 3 格，空格保持不动。',
      act1Desk: '让两圈字母错开 3 格',
      act1Lesson: '凯撒密码让字母同走几格；越过 Z 就从 A 继续。',
      act1Ready: '先转动钥匙，再看明文怎样变成密文。',
      act1Wrong: '钥匙还没对上。社团徽章上的数字是 3，再转一转。',
      act1Done: '封印成功：MEET AT TREE 变成 PHHW DW WUHH。',
      act1Hint: '点击加号三次。M 向前走 3 格，会落到 P。',
      act2Kicker: '截获任务 · 解密',
      act2Title: '倒转钥匙 5，找回集合地点',
      act2Text: '解密要沿加密的反方向移动相同格数。',
      act2Desk: '从四张纸条里找回明文',
      act2Lesson: '加密向前走几格，解密就用同一把钥匙向后退几格。',
      act2Ready: '密文 HQZG WTTR 使用钥匙 5。哪张纸条才是原话？',
      act2Wrong: '这张纸条没有还原。试试 H 向后退 5 格会到哪个字母。',
      act2Done: '解密成功：HQZG WTTR 还原成 CLUB ROOM。',
      act2Hint: '从 H 开始向后数 5 格：G、F、E、D、C。',
      act3Kicker: '终极考核 · 破译',
      act3Title: '没有钥匙，也能从字母频率破译密文',
      act3Text: '先统计重复字母，再用常见字母猜出可能的位移。',
      act3Desk: '从频率最高的字母开始试探',
      act3Lesson: '频率只是线索；短纸条会“偏科”，猜完还要检查全文。',
      act3Ready: '先看统计柱，找出这段密文里出现次数最多的字母。',
      act3WrongLetter: '选中的不是最高柱。比较数字和柱子的高度，再试一次。',
      act3LetterDone: '找到了：H 出现 11 次。现在猜它在英文明文里可能是谁。',
      act3WrongMap: '这个猜法暂时拼不出通顺单词。先试最常见的 E。',
      act3MapDone: '如果 H → E，字母倒退 3 格；可能的钥匙就是 3。',
      act3Done: '破译成功：MEET ME AFTER SCHOOL. KEEP THE MESSAGE SECRET.',
      act3Hint: '最高频的是 H。一般英文里 E 常见，所以先试 H → E，再检查全文。',
    },
    en: {
      doc: 'Cipher Club · KidsLab',
      back: 'Back to platform',
      title: 'Cipher Club',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      themeLabel: 'Switch theme',
      missionsLabel: 'Cipher missions',
      lockedMission: 'Finish the previous note first',
      missionLabel: (n, title) => `Mission ${n}: ${title}`,
      hint: 'Small hint',
      next: 'Collect the next note',
      key: 'Key',
      plainText: 'Plaintext',
      cipherText: 'Ciphertext',
      foundKey: 'Recovered key',
      decodeDirection: 'Move every letter back 5 places to recover the meeting spot.',
      interceptedMessage: 'Intercepted long note',
      frequencyTitle: 'Cipher-letter counts',
      chooseKey: 'Turn the key',
      keyDown: 'Decrease key',
      keyUp: 'Increase key',
      sealNote: 'Seal the note',
      choosePlain: 'Which note contains the recovered plaintext?',
      chooseFrequent: 'Step one: choose the most frequent cipher letter',
      chooseMapping: 'Step two: guess which common plaintext letter it may represent',
      crackMessage: 'Crack it with the inferred key 3',
      finalKicker: 'ALL THREE SECRET NOTES CRACKED',
      finalTitle: 'Welcome to Cipher Club!',
      finalText: 'You can encrypt and decrypt with a key, then use repeated letters to find a way in when the key is missing.',
      playAgain: 'Retake the club test',
      act1Kicker: 'ENTRY TEST · ENCRYPT',
      act1Title: 'Set the Wheel to Key 3 and Seal Your First Note',
      act1Text: 'Move every letter forward 3 places while spaces stay put.',
      act1Desk: 'Offset the two alphabets by 3',
      act1Lesson: 'Caesar shifts every letter equally and wraps Z back to A.',
      act1Ready: 'Turn the key and watch plaintext become ciphertext.',
      act1Wrong: 'The key is not aligned yet. The club badge says 3—turn it again.',
      act1Done: 'Sealed: MEET AT TREE became PHHW DW WUHH.',
      act1Hint: 'Tap plus three times. Move M forward 3 places to land on P.',
      act2Kicker: 'INTERCEPT · DECRYPT',
      act2Title: 'Reverse Key 5 to Recover the Meeting Spot',
      act2Text: 'Decryption moves the same distance in the opposite direction.',
      act2Desk: 'Recover the plaintext from four notes',
      act2Lesson: 'If encryption moves forward, decryption uses the same key to move backward.',
      act2Ready: 'Ciphertext HQZG WTTR used key 5. Which note contains the original words?',
      act2Wrong: 'That note was not recovered. Try moving H back 5 places.',
      act2Done: 'Decrypted: HQZG WTTR became CLUB ROOM.',
      act2Hint: 'Count back 5 from H: G, F, E, D, C.',
      act3Kicker: 'FINAL TEST · CRACK',
      act3Title: 'Crack a Message without Its Key Using Letter Frequency',
      act3Text: 'Count repeated letters, then test a common-letter guess to infer the shift.',
      act3Desk: 'Start with the most frequent letter',
      act3Lesson: 'Frequency is a clue, not a guarantee. Test guesses against the whole message.',
      act3Ready: 'Read the chart and choose the letter that appears most often in this ciphertext.',
      act3WrongLetter: 'That is not the tallest bar. Compare the counts and try again.',
      act3LetterDone: 'Found it: H appears 11 times. Now guess which English plaintext letter it may represent.',
      act3WrongMap: 'That guess does not make readable words. Try the common letter E first.',
      act3MapDone: 'If H → E, letters move back 3 places, so the likely key is 3.',
      act3Done: 'Cracked: MEET ME AFTER SCHOOL. KEEP THE MESSAGE SECRET.',
      act3Hint: 'H is highest. E is common in English, so test H → E, then check the whole message.',
    },
  };

  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const SAVE_KEY = 'kidslab.cipher-club';
  const SOUND_KEY = 'kidslab.sound.muted';
  const MISSIONS = [
    { kicker: 'act1Kicker', title: 'act1Title', text: 'act1Text', desk: 'act1Desk', lesson: 'act1Lesson', hint: 'act1Hint', icon: '+3' },
    { kicker: 'act2Kicker', title: 'act2Title', text: 'act2Text', desk: 'act2Desk', lesson: 'act2Lesson', hint: 'act2Hint', icon: '−5' },
    { kicker: 'act3Kicker', title: 'act3Title', text: 'act3Text', desk: 'act3Desk', lesson: 'act3Lesson', hint: 'act3Hint', icon: 'H→E' },
  ];
  const DECODE_ANSWERS = ['CODE ROOM', 'CLUB ROOM', 'CLUB ROOF', 'BLUE ROOM'];
  const FREQUENCIES = [
    { letter: 'H', count: 11 },
    { letter: 'V', count: 4 },
    { letter: 'W', count: 4 },
    { letter: 'P', count: 3 },
    { letter: 'K', count: 2 },
    { letter: 'D', count: 2 },
  ];
  const $ = (selector) => document.querySelector(selector);
  const el = {
    course: $('.course'),
    missionNumber: $('#missionNumber'),
    missionKicker: $('#missionKicker'),
    missionTitle: $('#missionTitle'),
    missionText: $('#missionText'),
    missionNav: $('#missionNav'),
    status: $('#status'),
    wheelScene: $('#wheelScene'),
    decodeScene: $('#decodeScene'),
    frequencyScene: $('#frequencyScene'),
    outerWheel: $('#outerWheel'),
    innerWheel: $('#innerWheel'),
    wheelKey: $('#wheelKey'),
    cipherPreview: $('#cipherPreview'),
    alphabetStrip: $('#alphabetStrip'),
    frequencyBars: $('#frequencyBars'),
    deskKicker: $('#deskKicker'),
    deskTitle: $('#deskTitle'),
    keyPanel: $('#keyPanel'),
    decodePanel: $('#decodePanel'),
    crackPanel: $('#crackPanel'),
    keyDown: $('#keyDownBtn'),
    keyUp: $('#keyUpBtn'),
    keyValue: $('#keyValue'),
    seal: $('#sealBtn'),
    answerGrid: $('#answerGrid'),
    letterStep: $('#letterStep'),
    mapStep: $('#mapStep'),
    crack: $('#crackBtn'),
    lessonIcon: $('#lessonIcon'),
    lessonText: $('#lessonText'),
    hint: $('#hintBtn'),
    next: $('#nextBtn'),
    sound: $('#soundBtn'),
    theme: $('#themeBtn'),
    lang: $('#langBtn'),
    modal: $('#completeModal'),
    playAgain: $('#playAgainBtn'),
  };

  let t = (key) => key;
  let language = 'zh';
  let missionIndex = 0;
  let unlocked = 0;
  let completed = new Set();
  let currentKey = 0;
  let crackStep = 0;
  let statusMessage = { key: 'act1Ready', tone: '' };

  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    unlocked = Math.min(2, Math.max(0, Number(saved.unlocked) || 0));
    completed = new Set(Array.isArray(saved.completed)
      ? saved.completed.filter((value) => Number.isInteger(value) && value >= 0 && value <= 2)
      : []);
  } catch {
    unlocked = 0;
    completed = new Set();
  }
  let restoreCompletion = completed.has(2);
  if (restoreCompletion) {
    missionIndex = 2;
    crackStep = 2;
    statusMessage = { key: 'act3Done', tone: 'good' };
  }

  class SoundEngine {
    constructor() {
      try { this.muted = ['true', '1'].includes(localStorage.getItem(SOUND_KEY)); }
      catch { this.muted = false; }
      this.context = null;
      this.sources = new Set();
    }

    ensure() {
      if (this.muted) return null;
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      try {
        this.context ||= new AudioContextClass();
        if (this.context.state === 'suspended') this.context.resume().catch(() => {});
        return this.context;
      } catch {
        return null;
      }
    }

    tone(frequency, duration, volume, type = 'sine', delay = 0) {
      const context = this.ensure();
      if (!context) return;
      const start = context.currentTime + delay;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain).connect(context.destination);
      this.sources.add(oscillator);
      oscillator.addEventListener('ended', () => this.sources.delete(oscillator), { once: true });
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    }

    turn() { this.tone(220 + currentKey * 11, 0.075, 0.022, 'square'); }
    correct() {
      [392, 523, 659].forEach((frequency, index) =>
        this.tone(frequency, 0.2, 0.025, 'triangle', index * 0.055));
    }
    error() {
      this.tone(150, 0.15, 0.028, 'sawtooth');
      this.tone(105, 0.2, 0.022, 'sawtooth', 0.07);
    }
    finale() {
      [330, 440, 554, 659, 880].forEach((frequency, index) =>
        this.tone(frequency, 0.32, 0.027, 'triangle', index * 0.07));
    }
    setMuted(value) {
      this.muted = value;
      try { localStorage.setItem(SOUND_KEY, value ? '1' : '0'); } catch {}
      if (value && this.context) {
        this.sources.forEach((source) => {
          try { source.stop(); } catch {}
        });
        this.sources.clear();
      }
    }
  }

  const sound = new SoundEngine();

  function caesar(text, shift) {
    return text.replace(/[A-Z]/g, (letter) => {
      const index = ALPHABET.indexOf(letter);
      return ALPHABET[(index + shift + 26) % 26];
    });
  }

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ unlocked, completed: [...completed] }));
    } catch {}
  }

  function setStatus(key, tone = '') {
    statusMessage = { key, tone };
    el.status.textContent = t(key);
    el.status.className = `status${tone ? ` ${tone}` : ''}`;
  }

  function resetMissionState() {
    currentKey = 0;
    crackStep = 0;
  }

  function switchMission(index) {
    if (index > unlocked) return;
    missionIndex = index;
    resetMissionState();
    statusMessage = { key: `act${index + 1}Ready`, tone: '' };
    window.cool?.stage?.(`cipher-${index + 1}`);
    sound.turn();
    render();
  }

  function renderAlphabetWheel(container, inner = false) {
    container.replaceChildren();
    [...ALPHABET].forEach((letter, index) => {
      const span = document.createElement('span');
      span.textContent = inner ? ALPHABET[(index + currentKey) % 26] : letter;
      span.style.setProperty('--i', index);
      container.append(span);
    });
  }

  function renderWheel() {
    renderAlphabetWheel(el.outerWheel);
    renderAlphabetWheel(el.innerWheel, true);
    el.wheelKey.textContent = currentKey;
    el.keyValue.textContent = currentKey;
    el.cipherPreview.textContent = caesar('MEET AT TREE', currentKey);
  }

  function renderAlphabetStrip() {
    const pairs = ['H→C', 'Q→L', 'Z→U', 'G→B', 'W→R', 'T→O', 'R→M'];
    el.alphabetStrip.replaceChildren(...pairs.map((pair) => {
      const span = document.createElement('span');
      span.textContent = pair;
      return span;
    }));
  }

  function renderAnswers() {
    el.answerGrid.replaceChildren(...DECODE_ANSWERS.map((answer) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'answer-btn';
      button.dataset.answer = answer;
      button.textContent = answer;
      button.addEventListener('click', () => choosePlaintext(answer));
      return button;
    }));
  }

  function renderFrequencyBars() {
    const max = Math.max(...FREQUENCIES.map(({ count }) => count));
    el.frequencyBars.replaceChildren(...FREQUENCIES.map(({ letter, count }) => {
      const item = document.createElement('div');
      item.className = 'frequency-bar';
      item.innerHTML = `<b style="--height:${count / max * 100}%"><i>${count}</i></b><span>${letter}</span>`;
      return item;
    }));
  }

  function renderNav() {
    el.missionNav.replaceChildren();
    MISSIONS.forEach((mission, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `mission-btn${index === missionIndex ? ' current' : ''}${completed.has(index) ? ' done' : ''}`;
      button.textContent = String(index + 1).padStart(2, '0');
      button.disabled = index > unlocked;
      button.setAttribute('aria-label', index > unlocked
        ? t('lockedMission')
        : t('missionLabel', index + 1, t(mission.title)));
      button.addEventListener('click', () => switchMission(index));
      el.missionNav.append(button);
    });
  }

  function renderControls() {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.title = t('doc');
    el.lang.textContent = language === 'zh' ? 'EN' : '中';
    el.theme.textContent = document.documentElement.dataset.theme === 'light' ? '🌙' : '☀️';
    el.theme.setAttribute('aria-label', t('themeLabel'));
    el.sound.textContent = sound.muted ? '🔇' : '🔊';
    el.sound.setAttribute('aria-pressed', String(sound.muted));
    el.sound.setAttribute('aria-label', sound.muted ? t('soundOn') : t('soundOff'));
    el.missionNav.setAttribute('aria-label', t('missionsLabel'));
    el.keyDown.setAttribute('aria-label', t('keyDown'));
    el.keyUp.setAttribute('aria-label', t('keyUp'));
  }

  function renderCrackSteps() {
    el.letterStep.hidden = crackStep >= 1;
    el.mapStep.hidden = crackStep !== 1;
    el.crack.hidden = crackStep !== 2;
  }

  function render() {
    const mission = MISSIONS[missionIndex];
    el.missionNumber.textContent = String(missionIndex + 1).padStart(2, '0');
    el.missionKicker.textContent = t(mission.kicker);
    el.missionTitle.textContent = t(mission.title);
    el.missionText.textContent = t(mission.text);
    el.deskKicker.textContent = missionIndex === 0
      ? (language === 'zh' ? 'CIPHER DESK / 密码台' : 'CIPHER DESK')
      : missionIndex === 1
        ? (language === 'zh' ? 'INTERCEPT DESK / 截获台' : 'INTERCEPT DESK')
        : (language === 'zh' ? 'CRYPTO LAB / 破译台' : 'CRYPTO LAB');
    el.deskTitle.textContent = t(mission.desk);
    el.lessonIcon.textContent = mission.icon;
    el.lessonText.textContent = t(mission.lesson);
    el.wheelScene.hidden = missionIndex !== 0;
    el.decodeScene.hidden = missionIndex !== 1;
    el.frequencyScene.hidden = missionIndex !== 2;
    el.keyPanel.hidden = missionIndex !== 0;
    el.decodePanel.hidden = missionIndex !== 1;
    el.crackPanel.hidden = missionIndex !== 2;
    el.next.hidden = !completed.has(missionIndex) || missionIndex === 2;
    setStatus(statusMessage.key, statusMessage.tone);
    renderNav();
    renderControls();
    renderWheel();
    renderAlphabetStrip();
    renderAnswers();
    renderFrequencyBars();
    renderCrackSteps();
  }

  function completeMission() {
    completed.add(missionIndex);
    unlocked = Math.max(unlocked, Math.min(2, missionIndex + 1));
    save();
    if (missionIndex === 2) {
      sound.finale();
      window.cool?.complete?.();
      setTimeout(showCompletion, 280);
    } else {
      sound.correct();
    }
    render();
  }

  function showCompletion() {
    el.course.inert = true;
    el.modal.hidden = false;
    el.playAgain.focus();
  }

  function rotateKey(delta) {
    if (missionIndex !== 0 || completed.has(0)) return;
    currentKey = (currentKey + delta + 26) % 26;
    sound.turn();
    window.cool?.track?.('turn-cipher-wheel', { key: currentKey });
    renderWheel();
  }

  function sealNote() {
    if (missionIndex !== 0 || completed.has(0)) return;
    if (currentKey !== 3) {
      sound.error();
      setStatus('act1Wrong', 'bad');
      return;
    }
    setStatus('act1Done', 'good');
    window.cool?.track?.('encrypt-secret-note', { key: currentKey });
    completeMission();
  }

  function choosePlaintext(answer) {
    if (missionIndex !== 1 || completed.has(1)) return;
    if (answer !== 'CLUB ROOM') {
      sound.error();
      setStatus('act2Wrong', 'bad');
      return;
    }
    setStatus('act2Done', 'good');
    window.cool?.track?.('decrypt-secret-note', { key: 5 });
    completeMission();
  }

  function chooseFrequentLetter(letter) {
    if (missionIndex !== 2 || crackStep !== 0) return;
    if (letter !== 'H') {
      sound.error();
      setStatus('act3WrongLetter', 'bad');
      return;
    }
    crackStep = 1;
    sound.correct();
    setStatus('act3LetterDone', 'good');
    window.cool?.track?.('find-frequent-letter', { letter });
    renderCrackSteps();
  }

  function chooseMapping(letter) {
    if (missionIndex !== 2 || crackStep !== 1) return;
    if (letter !== 'E') {
      sound.error();
      setStatus('act3WrongMap', 'bad');
      return;
    }
    crackStep = 2;
    sound.correct();
    setStatus('act3MapDone', 'good');
    window.cool?.track?.('infer-cipher-key', { cipher: 'H', plain: letter, key: 3 });
    renderCrackSteps();
  }

  function crackMessage() {
    if (missionIndex !== 2 || crackStep !== 2 || completed.has(2)) return;
    setStatus('act3Done', 'good');
    window.cool?.track?.('crack-secret-message', { key: 3 });
    completeMission();
  }

  el.keyDown.addEventListener('click', () => rotateKey(-1));
  el.keyUp.addEventListener('click', () => rotateKey(1));
  el.seal.addEventListener('click', sealNote);
  document.querySelectorAll('[data-letter]').forEach((button) =>
    button.addEventListener('click', () => chooseFrequentLetter(button.dataset.letter)));
  document.querySelectorAll('[data-map]').forEach((button) =>
    button.addEventListener('click', () => chooseMapping(button.dataset.map)));
  el.crack.addEventListener('click', crackMessage);
  el.hint.addEventListener('click', () => {
    sound.turn();
    setStatus(MISSIONS[missionIndex].hint);
  });
  el.next.addEventListener('click', () => switchMission(Math.min(2, missionIndex + 1)));
  el.sound.addEventListener('click', () => {
    sound.setMuted(!sound.muted);
    renderControls();
    if (!sound.muted) sound.turn();
  });
  el.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  el.playAgain.addEventListener('click', () => {
    el.modal.hidden = true;
    el.course.inert = false;
    missionIndex = 0;
    unlocked = 0;
    completed.clear();
    resetMissionState();
    save();
    statusMessage = { key: 'act1Ready', tone: '' };
    window.cool?.stage?.('cipher-1');
    render();
    el.keyUp.focus();
  });

  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang }) {
      t = translate;
      language = lang;
      render();
      if (restoreCompletion) {
        restoreCompletion = false;
        showCompletion();
      }
    },
  });
})();
