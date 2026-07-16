(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '🏥 虫虫医院 · KidsLab',
      back: '返回平台',
      title: '虫虫医院',
      caseLabel: '病床',
      chart: '电子病历 · 程序',
      monitor: '变量监护仪',
      output: '程序说',
      surgery: '微创手术 · 只能改一行',
      reset: '↻ 重开本例',
      chooseLine: '先预测病灶行',
      startTrace: '开始单步听诊',
      nextStep: '执行下一步',
      openSurgery: '查看手术方案',
      nextCase: '下一位病人',
      replay: '再值一次班',
      winTitle: '首席调试医生！',
      winText: '你没有乱改代码，而是先预测、再单步观察、最后只修病灶。真正的程序员就是这样抓 bug 的。',
      phasePredict: '① 预测',
      phaseTrace: '② 听诊',
      phaseOperate: '③ 手术',
      phaseHealthy: '✓ 康复',
      statusSick: '程序发烧中',
      statusChecking: '正在逐行听诊',
      statusAlarm: '抓到 bug 现行！',
      statusHealthy: '程序恢复健康',
      tipPredict: '先点一行：你预测 bug 藏在哪里？',
      tipRightPrediction: '好眼力！预测命中。现在单步执行，亲眼确认。',
      tipWrongPrediction: '大胆猜很好！单步执行会告诉你真正的病灶。',
      tipTrace: '每点一次只执行一行，盯住右边的变量监护仪。',
      tipBug: '停！这一行让结果不对。现在只改这一行。',
      tipWrongPatch: '这个方案还会让病人不舒服，再比较一下预期结果。',
      tipHealed: '修复成功！你用证据找到了 bug，而不是靠乱猜。',
      predicted: '预测',
      bugMark: '病灶',
      surgeryTitle: '哪一针能让程序恢复正常？',
      predictionScore: (n) => `预测命中 ${n}/3`,
      case1Name: '多吃一颗的计数器',
      case1Goal: '药盒应该发出 4 颗药，却说自己发了 5 颗。',
      case1Program: '自动配药计数器',
      case1Symptom: '目标 4 颗 · 实际显示 5 颗',
      case1Output: (n) => `${n} 颗`,
      case1Healed: '准确发出 4 颗药！',
      case2Name: '倒着走的送药机器人',
      case2Goal: '机器人应该向右走 3 格，却跑到了 −3 格。',
      case2Program: '病房送药路线',
      case2Symptom: '目标 +3 格 · 实际位置 −3',
      case2Output: (n) => `位置 ${n}`,
      case2Healed: '机器人顺利到达 +3！',
      case3Name: '永远下不了班的巡房车',
      case3Goal: '走满 4 步就该停下，可它一直转圈。',
      case3Program: '夜间巡房循环',
      case3Symptom: '目标 4 步停止 · 实际不停循环',
      case3Output: (n) => n === 'loop' ? '循环中…' : `${n} 步`,
      case3Healed: '第 4 步准时停下！',
      reportCase: (n) => `病例 ${n} ✓`,
    },
    en: {
      doc: '🏥 Bug Hospital · KidsLab',
      back: 'Back',
      title: 'Bug Hospital',
      caseLabel: 'BED',
      chart: 'Digital chart · Program',
      monitor: 'Variable monitor',
      output: 'Program says',
      surgery: 'One-line surgery',
      reset: '↻ Restart case',
      chooseLine: 'Predict a sick line',
      startTrace: 'Start step-through',
      nextStep: 'Run next line',
      openSurgery: 'See treatments',
      nextCase: 'Next patient',
      replay: 'Take another shift',
      winTitle: 'Chief Debug Doctor!',
      winText: 'You did not change code at random. You predicted, stepped through, watched the evidence, and fixed only the sick line. That is real debugging.',
      phasePredict: '① Predict',
      phaseTrace: '② Trace',
      phaseOperate: '③ Repair',
      phaseHealthy: '✓ Healed',
      statusSick: 'Program has a fever',
      statusChecking: 'Stepping line by line',
      statusAlarm: 'Bug caught in action!',
      statusHealthy: 'Program is healthy',
      tipPredict: 'Pick one line: where do you predict the bug is hiding?',
      tipRightPrediction: 'Sharp eye! Now step through and prove your prediction.',
      tipWrongPrediction: 'A brave guess is useful! Stepping through will reveal the evidence.',
      tipTrace: 'Run one line at a time and watch the variable monitor.',
      tipBug: 'Stop! This line caused the wrong result. Change only this line.',
      tipWrongPatch: 'That treatment still feels wrong. Compare it with the expected result.',
      tipHealed: 'Repair complete! You found the bug with evidence, not random guesses.',
      predicted: 'guess',
      bugMark: 'bug',
      surgeryTitle: 'Which one-line treatment will heal the program?',
      predictionScore: (n) => `${n}/3 predictions`,
      case1Name: 'The extra-pill counter',
      case1Goal: 'The dispenser should count 4 pills, but reports 5.',
      case1Program: 'Automatic pill counter',
      case1Symptom: 'Goal: 4 pills · Reported: 5',
      case1Output: (n) => `${n} pills`,
      case1Healed: 'Exactly 4 pills dispensed!',
      case2Name: 'The backward delivery bot',
      case2Goal: 'The bot should move right 3 spaces, but lands at −3.',
      case2Program: 'Ward delivery route',
      case2Symptom: 'Goal: +3 · Actual position: −3',
      case2Output: (n) => `position ${n}`,
      case2Healed: 'The bot arrived at +3!',
      case3Name: 'The cart that never clocks out',
      case3Goal: 'It should stop after 4 steps, but loops forever.',
      case3Program: 'Night patrol loop',
      case3Symptom: 'Goal: stop at 4 · Actual: endless loop',
      case3Output: (n) => n === 'loop' ? 'looping…' : `${n} steps`,
      case3Healed: 'Stopped right on step 4!',
      reportCase: (n) => `Case ${n} ✓`,
    },
  };

  const CASES = [
    {
      emoji: '💊',
      name: 'case1Name',
      goal: 'case1Goal',
      program: 'case1Program',
      symptom: 'case1Symptom',
      healed: 'case1Healed',
      output: 'case1Output',
      bugLine: 3,
      watch: ['pills'],
      code: {
        zh: ['药片 = 0', '重复 4 次：', '　药片 = 药片 + 1', '显示（药片 + 1）'],
        en: ['pills = 0', 'repeat 4 times:', '  pills = pills + 1', 'show (pills + 1)'],
      },
      trace: [
        { line: 0, vars: { pills: 0 }, output: '…' },
        { line: 1, vars: { pills: 0 }, output: '…' },
        { line: 2, vars: { pills: 1 }, output: '…' },
        { line: 2, vars: { pills: 2 }, output: '…' },
        { line: 2, vars: { pills: 3 }, output: '…' },
        { line: 2, vars: { pills: 4 }, output: '…' },
        { line: 3, vars: { pills: 4 }, output: 5, bug: true },
      ],
      patches: {
        zh: ['显示（药片）', '显示（药片 + 2）', '药片 = 1'],
        en: ['show (pills)', 'show (pills + 2)', 'pills = 1'],
      },
      correctPatch: 0,
      healthyVars: { pills: 4 },
      healthyOutput: 4,
    },
    {
      emoji: '🤖',
      name: 'case2Name',
      goal: 'case2Goal',
      program: 'case2Program',
      symptom: 'case2Symptom',
      healed: 'case2Healed',
      output: 'case2Output',
      bugLine: 2,
      watch: ['position'],
      code: {
        zh: ['位置 = 0', '重复 3 次：', '　位置 = 位置 − 1', '报告（位置）'],
        en: ['position = 0', 'repeat 3 times:', '  position = position − 1', 'report (position)'],
      },
      trace: [
        { line: 0, vars: { position: 0 }, output: '…' },
        { line: 1, vars: { position: 0 }, output: '…' },
        { line: 2, vars: { position: -1 }, output: '…' },
        { line: 2, vars: { position: -2 }, output: '…' },
        { line: 2, vars: { position: -3 }, output: '…', bug: true },
      ],
      patches: {
        zh: ['位置 = 位置 − 2', '位置 = 位置 + 1', '位置 = 1'],
        en: ['position = position − 2', 'position = position + 1', 'position = 1'],
      },
      correctPatch: 1,
      healthyVars: { position: 3 },
      healthyOutput: 3,
    },
    {
      emoji: '🚑',
      name: 'case3Name',
      goal: 'case3Goal',
      program: 'case3Program',
      symptom: 'case3Symptom',
      healed: 'case3Healed',
      output: 'case3Output',
      bugLine: 3,
      watch: ['steps'],
      code: {
        zh: ['步数 = 0', '当 步数 < 4：', '　向前走一步', '　步数 = 步数'],
        en: ['steps = 0', 'while steps < 4:', '  move one step', '  steps = steps'],
      },
      trace: [
        { line: 0, vars: { steps: 0 }, output: 0 },
        { line: 1, vars: { steps: 0 }, output: 0 },
        { line: 2, vars: { steps: 0 }, output: 1 },
        { line: 3, vars: { steps: 0 }, output: 1 },
        { line: 1, vars: { steps: 0 }, output: 1 },
        { line: 2, vars: { steps: 0 }, output: 2 },
        { line: 3, vars: { steps: 0 }, output: 'loop', bug: true },
      ],
      patches: {
        zh: ['步数 = 0', '步数 = 步数 − 1', '步数 = 步数 + 1'],
        en: ['steps = 0', 'steps = steps − 1', 'steps = steps + 1'],
      },
      correctPatch: 2,
      healthyVars: { steps: 4 },
      healthyOutput: 4,
    },
  ];

  const LS = { lang: 'kidslab.lang', theme: 'kidslab.theme' };
  const store = {
    get: (key) => { try { return localStorage.getItem(key); } catch { return null; } },
    set: (key, value) => { try { localStorage.setItem(key, value); } catch { /* Ignore storage errors. */ } },
  };

  let lang = store.get(LS.lang) || (navigator.language?.startsWith('zh') ? 'zh' : 'en');
  if (!I18N[lang]) lang = 'zh';
  let theme = store.get(LS.theme) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (!['light', 'dark'].includes(theme)) theme = 'light';

  let caseIndex = 0;
  let phase = 'predict';
  let prediction = null;
  let traceIndex = -1;
  let solved = new Set();
  let predictionHits = new Set();
  let wrongPatch = null;

  const $ = (id) => document.getElementById(id);
  const els = {
    langBtn: $('langBtn'),
    themeBtn: $('themeBtn'),
    caseNumber: $('caseNumber'),
    caseName: $('caseName'),
    caseGoal: $('caseGoal'),
    progress: $('progress'),
    tip: $('tip'),
    statusDot: $('statusDot'),
    statusText: $('statusText'),
    patient: $('patient'),
    symptom: $('symptom'),
    programName: $('programName'),
    phaseBadge: $('phaseBadge'),
    codeList: $('codeList'),
    monitor: document.querySelector('.monitor'),
    watchList: $('watchList'),
    outputValue: $('outputValue'),
    surgery: $('surgery'),
    surgeryTitle: $('surgeryTitle'),
    patches: $('patches'),
    resetBtn: $('resetBtn'),
    stepBtn: $('stepBtn'),
    nextBtn: $('nextBtn'),
    win: $('win'),
    report: $('report'),
    replayBtn: $('replayBtn'),
  };

  const t = (key, ...args) => {
    const value = I18N[lang][key] ?? I18N.zh[key] ?? key;
    return typeof value === 'function' ? value(...args) : value;
  };

  function currentCase() {
    return CASES[caseIndex];
  }

  function applyLang() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = t('doc');
    document.querySelectorAll('[data-t]').forEach((node) => {
      const value = I18N[lang][node.dataset.t];
      if (typeof value === 'string') node.textContent = value;
    });
    els.langBtn.textContent = lang === 'zh' ? 'EN' : '中';
    render();
  }

  function applyTheme() {
    document.documentElement.dataset.theme = theme;
    els.themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
  }

  function phaseKey() {
    return {
      predict: 'phasePredict',
      trace: 'phaseTrace',
      operate: 'phaseOperate',
      healthy: 'phaseHealthy',
    }[phase];
  }

  function tipKey() {
    if (phase === 'predict') return prediction === null ? 'tipPredict' : (prediction === currentCase().bugLine ? 'tipRightPrediction' : 'tipWrongPrediction');
    if (phase === 'trace') return 'tipTrace';
    if (phase === 'operate') return wrongPatch === null ? 'tipBug' : 'tipWrongPatch';
    return 'tipHealed';
  }

  function renderProgress() {
    els.progress.innerHTML = CASES.map((_, index) => {
      const state = solved.has(index) ? 'is-done' : index === caseIndex ? 'is-current' : '';
      const label = solved.has(index) ? '✓' : index + 1;
      return `<span class="progress-dot ${state}">${label}</span>`;
    }).join('');
  }

  function renderCode() {
    const item = currentCase();
    const activeLine = traceIndex >= 0 ? item.trace[traceIndex]?.line : -1;
    const bugVisible = phase === 'operate' || phase === 'healthy';
    els.codeList.innerHTML = item.code[lang].map((line, index) => {
      const classes = [
        'code-line',
        prediction === index ? 'is-picked' : '',
        phase === 'trace' && activeLine === index ? 'is-active' : '',
        bugVisible && item.bugLine === index ? 'is-bug' : '',
      ].filter(Boolean).join(' ');
      let mark = '';
      if (bugVisible && item.bugLine === index) mark = '🦠';
      else if (prediction === index) mark = '🔎';
      return `<button class="${classes}" type="button" data-line="${index}" ${phase !== 'predict' ? 'disabled' : ''}>
        <span class="line-no">${String(index + 1).padStart(2, '0')}</span>
        <span>${line}</span>
        <span class="line-mark" aria-label="${mark ? (bugVisible ? t('bugMark') : t('predicted')) : ''}">${mark}</span>
      </button>`;
    }).join('');
  }

  function renderMonitor() {
    const item = currentCase();
    const trace = traceIndex >= 0 ? item.trace[traceIndex] : null;
    const vars = phase === 'healthy' ? item.healthyVars : (trace?.vars || Object.fromEntries(item.watch.map((key) => [key, '—'])));
    els.watchList.innerHTML = item.watch.map((key) => `
      <div class="watch-row ${traceIndex >= 0 ? 'flash' : ''}">
        <span>${key}</span><b>${vars[key]}</b>
      </div>
    `).join('');
    const output = phase === 'healthy' ? item.healthyOutput : (trace?.output ?? '…');
    els.outputValue.textContent = output === '…' ? output : t(item.output, output);
    els.monitor.classList.toggle('alarm', phase === 'operate');
  }

  function renderPatches() {
    const item = currentCase();
    els.surgery.hidden = phase !== 'operate';
    els.surgeryTitle.textContent = t('surgeryTitle');
    els.patches.innerHTML = item.patches[lang].map((patch, index) => `
      <button class="patch ${wrongPatch === index ? 'is-wrong' : ''}" type="button" data-patch="${index}">${patch}</button>
    `).join('');
  }

  function renderControls() {
    els.stepBtn.hidden = phase === 'operate' || phase === 'healthy';
    els.nextBtn.hidden = phase !== 'healthy';
    if (phase === 'predict') {
      els.stepBtn.disabled = prediction === null;
      els.stepBtn.innerHTML = `🩺 <span>${t(prediction === null ? 'chooseLine' : 'startTrace')}</span>`;
    } else if (phase === 'trace') {
      els.stepBtn.disabled = false;
      els.stepBtn.innerHTML = `👆 <span>${t('nextStep')}</span>`;
    }
  }

  function renderPatient() {
    const item = currentCase();
    els.patient.textContent = item.emoji;
    els.patient.classList.toggle('is-healed', phase === 'healthy');
    els.statusDot.classList.toggle('healthy', phase === 'healthy');
    const statusKey = phase === 'healthy' ? 'statusHealthy'
      : phase === 'operate' ? 'statusAlarm'
        : phase === 'trace' ? 'statusChecking' : 'statusSick';
    els.statusText.textContent = t(statusKey);
    els.symptom.textContent = phase === 'healthy' ? t(item.healed) : t(item.symptom);
  }

  function render() {
    const item = currentCase();
    els.caseNumber.textContent = String(caseIndex + 1).padStart(2, '0');
    els.caseName.textContent = t(item.name);
    els.caseGoal.textContent = t(item.goal);
    els.programName.textContent = t(item.program);
    els.phaseBadge.textContent = t(phaseKey());
    els.tip.textContent = t(tipKey());
    renderProgress();
    renderCode();
    renderMonitor();
    renderPatches();
    renderControls();
    renderPatient();
  }

  function resetCase() {
    phase = 'predict';
    prediction = null;
    traceIndex = -1;
    wrongPatch = null;
    render();
    window.cool?.stage(`bug-hospital-case-${caseIndex + 1}`);
  }

  function pickLine(index) {
    if (phase !== 'predict') return;
    prediction = index;
    render();
    window.cool?.track('predict-bug-line', { case: caseIndex + 1, line: index + 1 });
  }

  function startTrace() {
    if (prediction === null) return;
    if (prediction === currentCase().bugLine) predictionHits.add(caseIndex);
    phase = 'trace';
    traceIndex = -1;
    render();
    window.cool?.track('start-step-through', { case: caseIndex + 1 });
  }

  function stepTrace() {
    const item = currentCase();
    if (traceIndex >= item.trace.length - 1) return;
    traceIndex += 1;
    els.patient.classList.remove('is-checking');
    void els.patient.offsetWidth;
    els.patient.classList.add('is-checking');
    if (item.trace[traceIndex].bug) {
      phase = 'operate';
      window.cool?.track('observe-bug', { case: caseIndex + 1, line: item.bugLine + 1 });
    }
    render();
  }

  function applyPatch(index) {
    const item = currentCase();
    if (phase !== 'operate') return;
    if (index !== item.correctPatch) {
      wrongPatch = index;
      render();
      window.cool?.track('try-wrong-fix', { case: caseIndex + 1 });
      return;
    }
    phase = 'healthy';
    wrongPatch = null;
    solved.add(caseIndex);
    render();
    window.cool?.track('heal-program', { case: caseIndex + 1 });
  }

  function nextCase() {
    if (caseIndex < CASES.length - 1) {
      caseIndex += 1;
      resetCase();
      return;
    }
    els.report.innerHTML = CASES.map((_, index) => `<span>${t('reportCase', index + 1)}</span>`).join('');
    const score = document.createElement('span');
    score.textContent = t('predictionScore', predictionHits.size);
    els.report.append(score);
    els.win.hidden = false;
    window.cool?.stage('bug-hospital-complete');
  }

  function replay() {
    caseIndex = 0;
    solved = new Set();
    predictionHits = new Set();
    els.win.hidden = true;
    resetCase();
  }

  els.langBtn.addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    store.set(LS.lang, lang);
    applyLang();
  });
  els.themeBtn.addEventListener('click', () => {
    theme = theme === 'light' ? 'dark' : 'light';
    store.set(LS.theme, theme);
    applyTheme();
  });
  els.codeList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-line]');
    if (button) pickLine(Number(button.dataset.line));
  });
  els.patches.addEventListener('click', (event) => {
    const button = event.target.closest('[data-patch]');
    if (button) applyPatch(Number(button.dataset.patch));
  });
  els.stepBtn.addEventListener('click', () => {
    if (phase === 'predict') startTrace();
    else if (phase === 'trace') stepTrace();
  });
  els.resetBtn.addEventListener('click', resetCase);
  els.nextBtn.addEventListener('click', nextCase);
  els.replayBtn.addEventListener('click', replay);

  applyTheme();
  applyLang();
  resetCase();
})();
