(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '🏝️ 真话岛 · KidsLab',
      back: '返回平台',
      title: '真话岛',
      eyebrow: '侦探航海日志',
      caseLabel: '案件',
      notebook: '推理手账',
      caseSolved: '案件破解',
      soundOn: '关闭音效',
      soundOff: '开启音效',
      theme: '切换主题',
      reset: '重开本关',
      hint: '提示',
      levels: ['身份徽章', '月门线索', '传说一问'],
      chapters: ['第一案 · 双族徽章', '第二案 · 月门岔路', '最终案 · 双守卫'],
      missions: ['谁只说真话？', '宝藏在哪条路？', '问出不会失败的问题'],
      panelTitles: ['身份排除', '拆开“或”和“非”', '设计一个神问题'],
      tips: [
        '听清每句话，再让身份和线索彼此对得上。',
        '真话族的话必须为真；“或”只需一边成立。',
        '让两位守卫都指向同一条错路，然后反着走。',
      ],
      mia: '米娅',
      noah: '诺亚',
      unknown: '?',
      truth: '真话族',
      liar: '反话族',
      statements0: ['“诺亚是反话族。”', '“米娅和我是同一族。”'],
      statements1: ['“宝藏在左边，或者月门开着。”', '“月门没有打开。”'],
      statements2: ['“你只能问一个问题。”', '“选好问题，我来回答。”'],
      status0: '给两位村民贴上身份徽章，再检查两句话。',
      status1: '已知米娅是真话族、诺亚是反话族。月门现在关着。',
      status2: '一位守卫说真话，一位说反话；宝藏只在一条路上。',
      caseRule: '岛规：两人中恰好一位真话族、一位反话族。',
      assignPrompt: '给每个人选一个身份',
      checkBadges: '检查徽章',
      chooseBoth: '两枚徽章都要贴好，侦探才能核对。',
      identityWrong: '这组身份会让至少一句话和说话者的身份冲突。换一组试试。',
      identityRight: '完全一致：米娅的话为真，诺亚的“同族”说法为假。',
      identityHint: '先假设米娅说真话：那么诺亚是什么族？再检查诺亚的话。',
      key0: '<code>排除法</code> 假设身份 → 检查每句话 → 有冲突就排除。',
      moonFact: '现场证据：月门关着，所以“月门开着”为假。',
      roadQuestion: '米娅说的“左边 或 月门开着”要为真。宝藏在哪边？',
      leftRoad: '← 左边小路',
      rightRoad: '右边小路 →',
      roadWrong: '右边不成立。月门开着也是假的，那会让米娅整句话都变成假话。',
      roadRight: '推对了！“月门开着”为假，所以“或”的另一边必须为真：宝藏在左边。',
      roadHint: '“A 或 B”只要一边为真即可。现在 B 已经被现场证据排除了。',
      key1: '<code>OR 或</code> 至少一边为真。<code>NOT 非</code> 把真假翻转。',
      questionPrompt: '你可以任选一位守卫，只问一次。问哪句？',
      questions: [
        '“哪条路有宝藏？”',
        '“你是真话族吗？”',
        '“如果我问另一位，他会指哪条路？”',
      ],
      directFail: '直接问路不行：你还不知道回答者会说真话还是反话。',
      selfFail: '两族都会说“是”：真话族如实回答，反话族会对真实身份说反话。',
      magicAnswer: '神问题问对了！不管问谁，他都会指向右边的错误道路。',
      afterPoint: '两位都会指右边。真正的宝藏在哪边？',
      finalWrong: '那正是两位守卫都会指的错路。把答案反过来！',
      finalRight: '你走向相反的左路，古老宝箱从沙地里升起来了！',
      questionHint: '好问题要消掉“我问到谁”的影响。试着把另一个人的回答包进问题里。',
      key2: '<code>双重反转</code> 真话者转述假话；说谎者歪曲真话，结果都指错路。',
      solvedTitles: ['徽章严丝合缝！', '月门线索破解！', '真话岛宝藏找到！'],
      solvedTexts: [
        '把身份假设代回两句话，只有“米娅真、诺亚假”不会撞上矛盾。',
        '“或”命题必须至少有一边为真。月门没开，所以宝藏只能在左边。',
        '真话守卫会如实转述错答案，反话守卫会把正确答案说反；问谁都得到错路，反着走就对了。',
      ],
      next: '打开下一案',
      replay: '再破一次案',
      locked: '先破解前一个案件。',
    },
    en: {
      doc: '🏝️ Truth Island · KidsLab',
      back: 'Back to platform',
      title: 'Truth Island',
      eyebrow: "Detective's sea log",
      caseLabel: 'Case',
      notebook: 'Reasoning notebook',
      caseSolved: 'Case solved',
      soundOn: 'Mute sound',
      soundOff: 'Turn sound on',
      theme: 'Switch theme',
      reset: 'Restart case',
      hint: 'Hint',
      levels: ['Identity Badges', 'Moon Gate Clue', 'Legendary Question'],
      chapters: ['Case 1 · Two badges', 'Case 2 · Moon Gate fork', 'Final case · Two guards'],
      missions: ['Who always tells the truth?', 'Which path hides the treasure?', 'Ask the question that cannot fail'],
      panelTitles: ['Eliminate identities', 'Unpack OR and NOT', 'Design one magic question'],
      tips: [
        'Listen to each claim, then make every identity and clue agree.',
        'A truth-teller must be right. An OR needs at least one true side.',
        'Make either guard point to the same wrong road, then go the other way.',
      ],
      mia: 'Mia',
      noah: 'Noah',
      unknown: '?',
      truth: 'Truth-teller',
      liar: 'Liar',
      statements0: ['“Noah is a liar.”', '“Mia and I are the same type.”'],
      statements1: ['“The treasure is left, OR the Moon Gate is open.”', '“The Moon Gate is NOT open.”'],
      statements2: ['“You may ask only one question.”', '“Choose carefully. I will answer.”'],
      status0: 'Badge both villagers, then check the two claims.',
      status1: 'Mia is known truthful and Noah is known to lie. The Moon Gate is closed.',
      status2: 'One guard tells truth and one lies. Only one road holds treasure.',
      caseRule: 'Island rule: exactly one villager tells truth and one lies.',
      assignPrompt: 'Choose an identity for each villager',
      checkBadges: 'Check badges',
      chooseBoth: 'Place both badges before checking your deduction.',
      identityWrong: 'At least one claim clashes with its speaker’s badge. Try the other arrangement.',
      identityRight: 'Everything agrees: Mia’s claim is true, while Noah’s “same type” claim is false.',
      identityHint: 'Assume Mia tells truth first. What must Noah be? Then test Noah’s claim.',
      key0: '<code>Elimination</code> Assume → test every claim → reject contradictions.',
      moonFact: 'Scene evidence: the Moon Gate is closed, so “the gate is open” is false.',
      roadQuestion: 'Mia’s “left OR gate open” claim must be true. Where is the treasure?',
      leftRoad: '← Left path',
      rightRoad: 'Right path →',
      roadWrong: 'Right cannot work. “Gate open” is also false, making Mia’s whole claim false.',
      roadRight: 'Correct! “Gate open” is false, so the other side of OR must be true: treasure is left.',
      roadHint: '“A OR B” is true when at least one side is true. The evidence has ruled out B.',
      key1: '<code>OR</code> needs at least one true side. <code>NOT</code> flips truth and falsehood.',
      questionPrompt: 'Ask either guard one question. Which question works?',
      questions: [
        '“Which road has the treasure?”',
        '“Are you a truth-teller?”',
        '“If I asked the other guard, which road would they point to?”',
      ],
      directFail: 'A direct question fails because you do not know whether this guard lies.',
      selfFail: 'Both types answer “yes”: one truthfully, the other by lying about their real identity.',
      magicAnswer: 'Legendary question unlocked! Either guard points to the wrong road on the right.',
      afterPoint: 'Both point right. Which road really has the treasure?',
      finalWrong: 'That is the wrong road both guards indicate. Reverse the answer!',
      finalRight: 'You take the opposite left path, and an ancient chest rises from the sand!',
      questionHint: 'A strong question cancels out which guard you picked. Put the other guard’s answer inside it.',
      key2: '<code>Double reversal</code> Truth reports a lie; a liar flips truth. Both point wrong.',
      solvedTitles: ['The badges fit!', 'Moon Gate clue cracked!', 'Truth Island treasure found!'],
      solvedTexts: [
        'Testing both assignments leaves only “Mia truthful, Noah liar” without a contradiction.',
        'An OR needs at least one true side. The gate is not open, so the treasure must be left.',
        'Truth reports the liar’s wrong answer; the liar reverses the truthful answer. Either way, go opposite.',
      ],
      next: 'Open next case',
      replay: 'Solve it again',
      locked: 'Solve the previous case first.',
    },
  };

  const SAVE_KEY = 'kidslab.truth-island';
  const MUTE_KEY = 'kidslab.sound.muted';
  const $ = (selector) => document.querySelector(selector);
  const el = {
    lang: $('#langBtn'),
    theme: $('#themeBtn'),
    sound: $('#soundBtn'),
    levels: $('#levelStrip'),
    caseNumber: $('#caseNumber'),
    tip: $('#tip'),
    chapter: $('#chapterLabel'),
    mission: $('#missionTitle'),
    panelTitle: $('#panelTitle'),
    workspace: $('#workspace'),
    logicKey: $('#logicKey'),
    hint: $('#hintBtn'),
    reset: $('#resetBtn'),
    scene: $('#islandScene'),
    status: $('#status'),
    miaName: $('#miaName'),
    noahName: $('#noahName'),
    miaSpeech: $('#miaSpeech'),
    noahSpeech: $('#noahSpeech'),
    miaBadge: $('#miaBadge'),
    noahBadge: $('#noahBadge'),
    modal: $('#modal'),
    modalMagic: $('#modalMagic'),
    modalTitle: $('#modalTitle'),
    modalText: $('#modalText'),
    next: $('#nextBtn'),
  };

  let t = (key) => key;
  let lang = window.cool.preferences.lang;
  let level = 0;
  let unlocked = 0;
  let assignments = { mia: '', noah: '' };
  let magicAsked = false;
  let solved = false;
  let statusKey = 'status0';
  let statusType = '';
  let hintTimer = 0;
  let completionTimer = 0;
  let audioContext = null;
  let muted = false;

  try {
    muted = localStorage.getItem(MUTE_KEY) === 'true';
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
    if (saved && Number.isInteger(saved.level) && Number.isInteger(saved.unlocked)) {
      level = Math.max(0, Math.min(2, saved.level));
      unlocked = Math.max(level, Math.min(2, saved.unlocked));
    }
  } catch {
    // Storage is optional; the game remains playable in this tab.
  }

  function persist() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ level, unlocked }));
    } catch {
      // Storage is optional.
    }
  }

  function ensureAudio() {
    if (muted) return null;
    try {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return null;
      audioContext ||= new AudioCtor();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
      return audioContext;
    } catch {
      return null;
    }
  }

  function tone(kind) {
    const context = ensureAudio();
    if (!context) return;
    const patterns = {
      pick: [[300, 0, .06, .04]],
      wrong: [[185, 0, .12, .05], [138, .1, .16, .045]],
      correct: [[420, 0, .08, .05], [560, .08, .13, .055]],
      complete: [[392, 0, .1, .05], [523, .1, .12, .06], [659, .21, .18, .065]],
    };
    const now = context.currentTime;
    for (const [frequency, offset, duration, volume] of patterns[kind] || patterns.pick) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = kind === 'wrong' ? 'square' : 'sine';
      oscillator.frequency.setValueAtTime(frequency, now + offset);
      gain.gain.setValueAtTime(.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(volume, now + offset + .015);
      gain.gain.exponentialRampToValueAtTime(.0001, now + offset + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + duration + .025);
    }
  }

  function setStatus(key, type = '') {
    statusKey = key;
    statusType = type;
    el.status.textContent = t(key);
    el.status.classList.toggle('is-error', type === 'error');
    el.status.classList.toggle('is-success', type === 'success');
  }

  function scheduleHint() {
    clearTimeout(hintTimer);
    hintTimer = window.setTimeout(() => {
      if (el.modal.hidden) showHint(false);
    }, 30000);
  }

  function badgeText(role) {
    return role ? t(role) : t('unknown');
  }

  function renderBadges() {
    const fixed = level > 0;
    const miaRole = fixed ? 'truth' : assignments.mia;
    const noahRole = fixed ? 'liar' : assignments.noah;
    for (const [node, role] of [[el.miaBadge, miaRole], [el.noahBadge, noahRole]]) {
      node.textContent = badgeText(role);
      node.classList.toggle('is-truth', role === 'truth');
      node.classList.toggle('is-liar', role === 'liar');
    }
  }

  function renderLevels() {
    el.levels.innerHTML = t('levels').map((name, index) =>
      `<button class="level-button ${index === level ? 'is-active' : ''} ${index < unlocked ? 'is-done' : ''}" type="button" data-level="${index}" ${index > unlocked ? 'disabled' : ''}>${index + 1}. ${name}</button>`).join('');
    el.levels.querySelectorAll('[data-level]').forEach((button) => {
      button.addEventListener('click', () => setLevel(Number(button.dataset.level)));
    });
  }

  function assignmentCard(person, name, statement) {
    return `<section class="assignment">
      <div class="assignment__head">
        <span>${name}</span>
        <small class="assignment__statement">${statement}</small>
        <strong>${badgeText(assignments[person])}</strong>
      </div>
      <div class="badge-choices">
        <button class="choice-button ${assignments[person] === 'truth' ? 'is-selected' : ''}" type="button" data-person="${person}" data-role="truth">✓ ${t('truth')}</button>
        <button class="choice-button ${assignments[person] === 'liar' ? 'is-selected' : ''}" type="button" data-person="${person}" data-role="liar">× ${t('liar')}</button>
      </div>
    </section>`;
  }

  function renderLevelZero() {
    el.workspace.innerHTML = `<p class="case-note"><strong>${t('assignPrompt')}</strong><br>${t('caseRule')}</p>
      ${assignmentCard('mia', t('mia'), t('statements0')[0])}
      ${assignmentCard('noah', t('noah'), t('statements0')[1])}
      <button class="primary-button" id="checkBtn" type="button">${t('checkBadges')}</button>`;
    el.workspace.querySelectorAll('[data-person]').forEach((button) => {
      button.addEventListener('click', () => assignRole(button.dataset.person, button.dataset.role));
    });
    $('#checkBtn').addEventListener('click', checkAssignments);
  }

  function renderLevelOne() {
    el.workspace.innerHTML = `<p class="case-note"><strong>${t('moonFact')}</strong><br>${t('roadQuestion')}</p>
      <div class="road-grid">
        <button class="road-button" type="button" data-road="left">${t('leftRoad')}</button>
        <button class="road-button" type="button" data-road="right">${t('rightRoad')}</button>
      </div>`;
    el.workspace.querySelectorAll('[data-road]').forEach((button) => {
      button.addEventListener('click', () => chooseRoad(button.dataset.road));
    });
  }

  function renderLevelTwo() {
    if (!magicAsked) {
      el.workspace.innerHTML = `<p class="case-note"><strong>${t('questionPrompt')}</strong></p>
        <div class="question-list">${t('questions').map((question, index) =>
          `<button class="question-button" type="button" data-question="${index}">${question}</button>`).join('')}</div>`;
      el.workspace.querySelectorAll('[data-question]').forEach((button) => {
        button.addEventListener('click', () => askQuestion(Number(button.dataset.question)));
      });
      return;
    }
    el.workspace.innerHTML = `<p class="case-note"><strong>${t('magicAnswer')}</strong><br>${t('afterPoint')}</p>
      <div class="road-grid">
        <button class="road-button" type="button" data-final-road="left">${t('leftRoad')}</button>
        <button class="road-button" type="button" data-final-road="right">${t('rightRoad')}</button>
      </div>`;
    el.workspace.querySelectorAll('[data-final-road]').forEach((button) => {
      button.addEventListener('click', () => chooseFinalRoad(button.dataset.finalRoad));
    });
  }

  function render() {
    document.body.dataset.level = String(level);
    el.caseNumber.textContent = String(level + 1).padStart(2, '0');
    el.tip.textContent = t('tips')[level];
    el.chapter.textContent = t('chapters')[level];
    el.mission.textContent = t('missions')[level];
    el.panelTitle.textContent = t('panelTitles')[level];
    el.miaName.textContent = t('mia');
    el.noahName.textContent = t('noah');
    el.miaSpeech.textContent = t(`statements${level}`)[0];
    el.noahSpeech.textContent = t(`statements${level}`)[1];
    el.logicKey.innerHTML = t(`key${level}`);
    el.sound.textContent = muted ? '🔇' : '🔊';
    el.sound.setAttribute('aria-label', muted ? t('soundOff') : t('soundOn'));
    el.sound.setAttribute('aria-pressed', String(muted));
    el.theme.setAttribute('aria-label', t('theme'));
    el.reset.setAttribute('aria-label', t('reset'));
    el.hint.setAttribute('aria-label', t('hint'));
    el.scene.classList.toggle('is-pointing', level === 2 && magicAsked);
    el.scene.classList.toggle('is-solved', solved);
    setStatus(statusKey, statusType);
    renderBadges();
    renderLevels();
    if (level === 0) renderLevelZero();
    else if (level === 1) renderLevelOne();
    else renderLevelTwo();
  }

  function assignRole(person, role) {
    assignments[person] = role;
    setStatus('status0');
    tone('pick');
    window.cool.track('place_identity_badge');
    render();
    scheduleHint();
  }

  function checkAssignments() {
    if (!assignments.mia || !assignments.noah) {
      setStatus('chooseBoth', 'error');
      tone('wrong');
      return;
    }
    if (assignments.mia !== 'truth' || assignments.noah !== 'liar') {
      setStatus('identityWrong', 'error');
      tone('wrong');
      window.cool.track('retry_identity_badges');
      scheduleHint();
      return;
    }
    setStatus('identityRight', 'success');
    tone('correct');
    window.cool.track('solve_identity_case');
    completeLevel();
  }

  function chooseRoad(road) {
    if (road !== 'left') {
      setStatus('roadWrong', 'error');
      tone('wrong');
      window.cool.track('retry_or_clue');
      scheduleHint();
      return;
    }
    solved = true;
    setStatus('roadRight', 'success');
    tone('correct');
    window.cool.track('solve_or_clue');
    completeLevel();
  }

  function askQuestion(index) {
    if (index !== 2) {
      setStatus(index === 0 ? 'directFail' : 'selfFail', 'error');
      tone('wrong');
      window.cool.track('retry_guard_question');
      scheduleHint();
      return;
    }
    magicAsked = true;
    setStatus('magicAnswer', 'success');
    tone('correct');
    window.cool.track('ask_other_guard_question');
    render();
    scheduleHint();
  }

  function chooseFinalRoad(road) {
    if (road !== 'left') {
      setStatus('finalWrong', 'error');
      tone('wrong');
      window.cool.track('retry_opposite_road');
      scheduleHint();
      return;
    }
    solved = true;
    setStatus('finalRight', 'success');
    window.cool.track('find_truth_island_treasure');
    window.cool.complete?.();
    tone('complete');
    render();
    completeLevel();
  }

  function completeLevel() {
    if (level < 2) {
      unlocked = Math.max(unlocked, level + 1);
      persist();
    }
    clearTimeout(completionTimer);
    completionTimer = window.setTimeout(() => {
      el.modalMagic.textContent = level === 2 ? '🏝️ 🗝️ ✨' : '🧭 ✦';
      el.modalTitle.textContent = t('solvedTitles')[level];
      el.modalText.textContent = t('solvedTexts')[level];
      el.next.textContent = level === 2 ? t('replay') : t('next');
      el.modal.hidden = false;
      renderLevels();
    }, 260);
  }

  function resetLevel() {
    clearTimeout(hintTimer);
    clearTimeout(completionTimer);
    assignments = { mia: '', noah: '' };
    magicAsked = false;
    solved = false;
    statusType = '';
    statusKey = `status${level}`;
    el.modal.hidden = true;
    window.cool.stage(`case-${level + 1}`);
    render();
    scheduleHint();
  }

  function setLevel(nextLevel) {
    if (nextLevel > unlocked) {
      setStatus('locked', 'error');
      tone('wrong');
      return;
    }
    level = nextLevel;
    persist();
    resetLevel();
  }

  function nextLevel() {
    el.modal.hidden = true;
    setLevel(level === 2 ? 0 : level + 1);
  }

  function showHint(withSound = true) {
    setStatus(['identityHint', 'roadHint', 'questionHint'][level]);
    if (withSound) tone('pick');
    window.cool.track('open_truth_island_hint');
    scheduleHint();
  }

  function toggleSound() {
    muted = !muted;
    try {
      localStorage.setItem(MUTE_KEY, String(muted));
    } catch {
      // Sound preference persistence is optional.
    }
    if (muted && audioContext?.state === 'running') audioContext.suspend().catch(() => {});
    render();
    if (!muted) tone('pick');
  }

  el.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  el.sound.addEventListener('click', toggleSound);
  el.hint.addEventListener('click', () => showHint());
  el.reset.addEventListener('click', resetLevel);
  el.next.addEventListener('click', nextLevel);

  window.cool.bindI18n(I18N, {
    onChange(context) {
      t = context.t;
      lang = context.lang;
      document.title = t('doc');
      el.lang.textContent = lang === 'zh' ? 'EN' : '中';
      el.theme.textContent = context.theme === 'light' ? '🌙' : '☀️';
      render();
    },
  });

  resetLevel();
})();
