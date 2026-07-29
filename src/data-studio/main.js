(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '数据演播室 · KidsLab',
      back: '返回平台',
      title: '数据演播室',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      themeLabel: '切换主题',
      missionsLabel: '直播任务',
      chartLabel: '台歌投票图表',
      lockedMission: '先完成前一场',
      missionLabel: (n, title) => `第 ${n} 场：${title}`,
      hint: '轻提示',
      next: '进入下一场',
      barChart: '条形图',
      lineChart: '折线图',
      pieChart: '扇形图',
      finalKicker: '数据直播圆满收官',
      finalTitle: '你把数据讲明白了！',
      finalText: '你准确计票、为问题选对图表，还算出了每首台歌平均得到 5 票。',
      playAgain: '再做一期节目',
      act1Kicker: '第一场 · 收票',
      act1Title: '用“正”字接住 20 张选票',
      act1Text: '看清每位小观众的选择，再把一笔记到对应台歌。',
      act1Console: '点击观众选择的台歌',
      act1Lesson: '每五票凑成一个“正”字，计票又快又不容易漏。',
      act1Ready: '第一位观众来了。点击卡片上写的台歌。',
      act1Progress: (done, total) => `记下第 ${done} 票！还有 ${total - done} 位观众等着入场。`,
      act1Wrong: '这位观众选的不是这首。看看直播卡片上的歌名，再试一次。',
      act1Done: '20 张票一张不少！火箭舞 8 票，泡泡歌 6 票，月亮谣 4 票，爪爪拍 2 票。',
      act1Hint: '看左上角观众卡片，再点击同名台歌。每点一次就是一笔。',
      act2Kicker: '第二场 · 选图',
      act2Title: '让问题找到最会说话的图表',
      act2Text: '比较多少、追踪变化、查看占比，需要三种不同的图表。',
      act2Console: '替导播挑选图表',
      act2Lesson: '条形比多少，折线看变化，扇形看各部分占比。',
      act2Ready: '导播要比较四首歌的票数。哪种图表最直观？',
      act2Wrong: '这张图不够贴合导播的问题。先想他要比较、看变化，还是看整体占比。',
      act2Correct: '选得准！下一道导播题已经送到。',
      act2Done: '三种图表都找到了擅长的问题。现在准备直播播报。',
      act2Hint: '条形比长短，折线看时间走势，扇形看一整个圆怎样分开。',
      act3Kicker: '第三场 · 播报',
      act3Title: '读懂图表，完成三句直播',
      act3Text: '从图表中找最大值、总数和平均数，把结论讲给观众听。',
      act3Console: '选择正确的播报数据',
      act3Lesson: '平均数就是平均分总数：20 ÷ 4 = 5。',
      act3Ready: '第一句直播：哪首台歌得票最多？',
      act3Wrong: '这句数据播错了。回到图表找最高、合计，或用总数除以组数。',
      act3Correct: '播报准确！下一句数据已经提词。',
      act3Done: '三句播报全部准确，收视灯亮了！',
      act3Hint: '最高看最长柱；总数把四组相加；平均数用总票数除以 4 首歌。',
      audience: (n, total) => `观众 ${n} / ${total}`,
      directorCount: (n) => `导播题 ${n} / 3`,
      reportCount: (n) => `播报题 ${n} / 3`,
      rocket: '火箭舞',
      bubble: '泡泡歌',
      moon: '月亮谣',
      paws: '爪爪拍',
      compareQuestion: '哪种图最适合比较四首台歌谁多谁少？',
      trendQuestion: '哪种图最适合看收视人数随直播时间怎样变化？',
      shareQuestion: '哪种图最适合看每首歌占 20 张选票的比例？',
      reportHighest: '哪首台歌得票最多？',
      reportTotal: '四首台歌一共得到多少票？',
      reportMean: '平均每首台歌得到多少票？',
      votes: (n) => `${n} 票`,
      averageChoice: (n) => `${n} 票`,
    },
    en: {
      doc: 'Data Studio · KidsLab',
      back: 'Back to platform',
      title: 'Data Studio',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      themeLabel: 'Switch theme',
      missionsLabel: 'Live missions',
      chartLabel: 'Theme-song voting chart',
      lockedMission: 'Finish the previous show first',
      missionLabel: (n, title) => `Show ${n}: ${title}`,
      hint: 'Small hint',
      next: 'Enter next show',
      barChart: 'Bar chart',
      lineChart: 'Line graph',
      pieChart: 'Pie chart',
      finalKicker: 'DATA BROADCAST COMPLETE',
      finalTitle: 'You Made the Data Clear!',
      finalText: 'You tallied every vote, matched questions to charts, and found the mean of 5 votes per song.',
      playAgain: 'Make another show',
      act1Kicker: 'SHOW ONE · COLLECT',
      act1Title: 'Catch 20 Votes with Tally Marks',
      act1Text: 'Read each young viewer’s choice, then add one mark to the matching theme song.',
      act1Console: 'Tap the viewer’s chosen song',
      act1Lesson: 'Bundle tally marks in fives to count quickly.',
      act1Ready: 'First viewer: tap the song shown on the card.',
      act1Progress: (done, total) => `Vote ${done} recorded! ${total - done} viewers are still in line.`,
      act1Wrong: 'That is not this viewer’s song. Read the song on the live card and try again.',
      act1Done: 'All 20 votes are safe: Rocket Dance 8, Bubble Song 6, Moon Tune 4, and Paw Clap 2.',
      act1Hint: 'Read the viewer card at top left, then tap the song with the same name.',
      act2Kicker: 'SHOW TWO · CHOOSE',
      act2Title: 'Match Each Question to Its Best Chart',
      act2Text: 'Comparing amounts, tracking change, and seeing shares call for different charts.',
      act2Console: 'Choose a chart for the director',
      act2Lesson: 'Bars compare, lines show change, and pie slices show shares.',
      act2Ready: 'The director wants to compare four song totals. Which chart says it best?',
      act2Wrong: 'That chart does not fit the question. Is the director comparing, tracking time, or seeing shares?',
      act2Correct: 'Great match! The next director question is ready.',
      act2Done: 'Each chart found the job it does best. Get ready to report live.',
      act2Hint: 'Bars compare lengths, lines show a timeline, and pie slices divide one whole.',
      act3Kicker: 'SHOW THREE · REPORT',
      act3Title: 'Read the Chart and Deliver Three Lines',
      act3Text: 'Find the maximum, total, and mean, then tell the audience what the data says.',
      act3Console: 'Choose the correct data line',
      act3Lesson: 'Mean = total shared equally: 20 ÷ 4 = 5.',
      act3Ready: 'First live line: which theme song received the most votes?',
      act3Wrong: 'That data line is off. Find the tallest bar, add all groups, or divide total by groups.',
      act3Correct: 'Accurate report! The next line is on the teleprompter.',
      act3Done: 'All three data lines are correct. The ratings light is glowing!',
      act3Hint: 'Use the longest bar for the maximum; add four groups for total; divide total by 4 for mean.',
      audience: (n, total) => `Viewer ${n} / ${total}`,
      directorCount: (n) => `Director ${n} / 3`,
      reportCount: (n) => `Report ${n} / 3`,
      rocket: 'Rocket Dance',
      bubble: 'Bubble Song',
      moon: 'Moon Tune',
      paws: 'Paw Clap',
      compareQuestion: 'Which chart best compares the totals for four theme songs?',
      trendQuestion: 'Which chart best shows viewers changing over broadcast time?',
      shareQuestion: 'Which chart best shows each song’s share of all 20 votes?',
      reportHighest: 'Which theme song received the most votes?',
      reportTotal: 'How many votes did all four songs receive in total?',
      reportMean: 'What was the mean number of votes per song?',
      votes: (n) => `${n} votes`,
      averageChoice: (n) => `${n} votes`,
    },
  };

  const SONGS = [
    { id: 'rocket', icon: '🚀', color: '--red', target: 8 },
    { id: 'bubble', icon: '🫧', color: '--cyan', target: 6 },
    { id: 'moon', icon: '🌙', color: '--yellow', target: 4 },
    { id: 'paws', icon: '🐾', color: '--blue', target: 2 },
  ];
  const VOTES = [
    'rocket', 'bubble', 'moon', 'rocket', 'paws',
    'bubble', 'rocket', 'moon', 'bubble', 'rocket',
    'rocket', 'paws', 'bubble', 'moon', 'rocket',
    'bubble', 'rocket', 'moon', 'bubble', 'rocket',
  ];
  const VIEWERS = ['🐰', '🦊', '🐼', '🐸', '🐨', '🐯', '🐧', '🐵'];
  const CHART_QUESTIONS = [
    { text: 'compareQuestion', answer: 'bar', preview: 'bar' },
    { text: 'trendQuestion', answer: 'line', preview: 'line' },
    { text: 'shareQuestion', answer: 'pie', preview: 'pie' },
  ];
  const REPORT_QUESTIONS = [
    { text: 'reportHighest', answer: 'rocket', options: ['bubble', 'rocket', 'moon', 'paws'] },
    { text: 'reportTotal', answer: '20', options: ['18', '20', '22', '24'] },
    { text: 'reportMean', answer: '5', options: ['4', '5', '6', '8'] },
  ];
  const MISSIONS = [
    { kicker: 'act1Kicker', title: 'act1Title', text: 'act1Text', console: 'act1Console', lesson: 'act1Lesson', hint: 'act1Hint', icon: '正' },
    { kicker: 'act2Kicker', title: 'act2Title', text: 'act2Text', console: 'act2Console', lesson: 'act2Lesson', hint: 'act2Hint', icon: '▥' },
    { kicker: 'act3Kicker', title: 'act3Title', text: 'act3Text', console: 'act3Console', lesson: 'act3Lesson', hint: 'act3Hint', icon: '÷' },
  ];

  const SAVE_KEY = 'kidslab.data-studio';
  const SOUND_KEY = 'kidslab.sound.muted';
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const $ = (selector) => document.querySelector(selector);
  const el = {
    course: $('.course'),
    missionNumber: $('#missionNumber'),
    missionKicker: $('#missionKicker'),
    missionTitle: $('#missionTitle'),
    missionText: $('#missionText'),
    missionNav: $('#missionNav'),
    status: $('#status'),
    chart: $('#chart'),
    voter: $('#voterCard'),
    voterEmoji: $('#voterEmoji'),
    voterLabel: $('#voterLabel'),
    voterChoice: $('#voterChoice'),
    consoleKicker: $('#consoleKicker'),
    consoleTitle: $('#consoleTitle'),
    tallyPanel: $('#tallyPanel'),
    tallyGrid: $('#tallyGrid'),
    chartPanel: $('#chartPanel'),
    chartChoices: [...document.querySelectorAll('[data-chart]')],
    questionCount: $('#questionCount'),
    directorQuestion: $('#directorQuestion'),
    reportPanel: $('#reportPanel'),
    reportCount: $('#reportCount'),
    reportQuestion: $('#reportQuestion'),
    answerGrid: $('#answerGrid'),
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
  let voteIndex = 0;
  let counts = Object.fromEntries(SONGS.map(({ id }) => [id, 0]));
  let chartQuestion = 0;
  let reportQuestion = 0;
  let statusMessage = { key: 'act1Ready', tone: '', args: [] };

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

  class SoundEngine {
    constructor() {
      try { this.muted = ['true', '1'].includes(localStorage.getItem(SOUND_KEY)); }
      catch { this.muted = false; }
      this.context = null;
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
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    }

    tap(index = 0) { this.tone([300, 380, 460, 540][index % 4], 0.08, 0.024, 'triangle'); }
    correct() {
      [440, 554, 659].forEach((frequency, index) =>
        this.tone(frequency, 0.2, 0.028, 'sine', index * 0.06));
    }
    error() {
      this.tone(170, 0.16, 0.034, 'sawtooth');
      this.tone(125, 0.2, 0.026, 'sawtooth', 0.07);
    }
    finale() {
      [392, 494, 587, 784].forEach((frequency, index) =>
        this.tone(frequency, 0.34, 0.03, 'sine', index * 0.08));
    }
    setMuted(value) {
      this.muted = value;
      try { localStorage.setItem(SOUND_KEY, value ? '1' : '0'); } catch {}
      if (value && this.context) this.context.suspend().catch(() => {});
    }
  }

  const sound = new SoundEngine();

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ unlocked, completed: [...completed] }));
    } catch {}
  }

  function setStatus(key, tone = '', ...args) {
    statusMessage = { key, tone, args };
    el.status.textContent = t(key, ...args);
    el.status.className = `status${tone ? ` ${tone}` : ''}`;
  }

  function resetMissionState() {
    voteIndex = 0;
    counts = Object.fromEntries(SONGS.map(({ id }) => [id, 0]));
    chartQuestion = 0;
    reportQuestion = 0;
  }

  function switchMission(index) {
    if (index > unlocked) return;
    missionIndex = index;
    resetMissionState();
    statusMessage = { key: `act${index + 1}Ready`, tone: '', args: [] };
    window.cool?.stage?.(`show-${index + 1}`);
    sound.tap(index);
    render();
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

  function tallyMarks(value) {
    const full = Math.floor(value / 5);
    const rest = value % 5;
    return `${'正'.repeat(full)}${'一'.repeat(rest)}` || '·';
  }

  function renderTally() {
    el.tallyGrid.replaceChildren();
    SONGS.forEach((song, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'tally-btn';
      button.dataset.song = song.id;
      button.innerHTML = `<span class="song-icon" aria-hidden="true">${song.icon}</span><span><b>${t(song.id)}</b><em>${tallyMarks(counts[song.id])}</em></span>`;
      button.addEventListener('click', () => recordVote(song.id, index));
      el.tallyGrid.append(button);
    });
    const active = voteIndex < VOTES.length;
    el.voter.hidden = !active || missionIndex !== 0;
    if (active && missionIndex === 0) {
      const vote = VOTES[voteIndex];
      el.voter.dataset.vote = vote;
      el.voterEmoji.textContent = VIEWERS[voteIndex % VIEWERS.length];
      el.voterLabel.textContent = t('audience', voteIndex + 1, VOTES.length);
      el.voterChoice.textContent = t(vote);
    }
  }

  function svgElement(name, attributes = {}) {
    const node = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  }

  function addText(x, y, value, className, anchor = 'middle') {
    const text = svgElement('text', { x, y, class: className, 'text-anchor': anchor });
    text.textContent = value;
    el.chart.append(text);
  }

  function chartSize() {
    const rect = el.chart.getBoundingClientRect();
    const width = Math.max(320, Math.round(rect.width));
    const height = Math.max(150, Math.round(rect.height));
    el.chart.setAttribute('viewBox', `0 0 ${width} ${height}`);
    return { width, height };
  }

  function drawBar(values = SONGS.map(({ id }) => counts[id])) {
    el.chart.replaceChildren();
    const { width, height } = chartSize();
    const baseline = height - 38;
    const side = Math.max(24, width * 0.06);
    const slot = (width - side * 2) / SONGS.length;
    const barWidth = Math.min(88, slot * 0.58);
    el.chart.append(svgElement('line', {
      x1: side, y1: baseline, x2: width - side, y2: baseline, class: 'chart-axis',
    }));
    const max = Math.max(8, ...values);
    SONGS.forEach((song, index) => {
      const value = values[index];
      const barHeight = value / max * Math.max(52, height - 105);
      const x = side + slot * index + (slot - barWidth) / 2;
      el.chart.append(svgElement('rect', {
        x, y: baseline - barHeight, width: barWidth, height: barHeight,
        rx: 12, fill: cssVar(song.color), class: 'chart-bar',
      }));
      const label = width < 500 ? song.icon : `${song.icon} ${t(song.id)}`;
      addText(x + barWidth / 2, height - 14, label, 'chart-label');
      addText(x + barWidth / 2, baseline - barHeight - 8, String(value), 'chart-value');
    });
  }

  function drawLine() {
    el.chart.replaceChildren();
    const { width, height } = chartSize();
    const values = [2, 5, 7, 11, 15, 20];
    const left = Math.max(32, width * 0.08);
    const right = width - left;
    const baseline = height - 38;
    const top = 34;
    const points = values.map((value, index) => ({
      x: left + index * (right - left) / (values.length - 1),
      y: baseline - value / 20 * (baseline - top),
      value,
    }));
    el.chart.append(svgElement('line', {
      x1: left - 12, y1: baseline, x2: right + 12, y2: baseline, class: 'chart-axis',
    }));
    el.chart.append(svgElement('polyline', {
      points: points.map(({ x, y }) => `${x},${y}`).join(' '),
      fill: 'none', stroke: cssVar('--cyan'), 'stroke-width': 9,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    }));
    points.forEach(({ x, y, value }, index) => {
      el.chart.append(svgElement('circle', {
        cx: x, cy: y, r: 10, fill: cssVar('--yellow'),
        stroke: cssVar('--screen-2'), 'stroke-width': 4,
      }));
      addText(x, y - 20, String(value), 'chart-value');
      addText(x, height - 14, `${index + 1}m`, 'chart-label');
    });
  }

  function drawPie() {
    el.chart.replaceChildren();
    const { width, height } = chartSize();
    const total = SONGS.reduce((sum, song) => sum + song.target, 0);
    const centerX = width < 500 ? width * 0.36 : width * 0.4;
    const centerY = height * 0.52;
    const radius = Math.min(height * 0.35, width * 0.24);
    let angle = -Math.PI / 2;
    SONGS.forEach((song, index) => {
      const slice = song.target / total * Math.PI * 2;
      const end = angle + slice;
      const large = slice > Math.PI ? 1 : 0;
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(end) * radius;
      const y2 = centerY + Math.sin(end) * radius;
      const path = svgElement('path', {
        d: `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`,
        fill: cssVar(song.color), stroke: cssVar('--screen-2'), 'stroke-width': 5,
      });
      el.chart.append(path);
      const labelAngle = angle + slice / 2;
      addText(
        centerX + Math.cos(labelAngle) * radius * 0.62,
        centerY + Math.sin(labelAngle) * radius * 0.62 + 6,
        width < 500 ? `${song.target / total * 100}%` : `${song.icon} ${song.target / total * 100}%`,
        'chart-value',
      );
      addText(
        width * 0.68,
        height * 0.27 + index * Math.min(58, height * 0.15),
        width < 500 ? `${song.icon} ${song.target}` : `${song.icon} ${t(song.id)} · ${song.target}`,
        'chart-label',
        'start',
      );
      angle = end;
    });
  }

  function renderChart() {
    if (missionIndex === 0) drawBar();
    else if (missionIndex === 1) {
      const type = CHART_QUESTIONS[Math.min(chartQuestion, 2)].preview;
      if (type === 'line') drawLine();
      else if (type === 'pie') drawPie();
      else drawBar(SONGS.map(({ target }) => target));
    } else drawBar(SONGS.map(({ target }) => target));
  }

  function renderQuestionPanels() {
    if (missionIndex === 1) {
      const question = CHART_QUESTIONS[Math.min(chartQuestion, 2)];
      el.questionCount.textContent = t('directorCount', Math.min(chartQuestion + 1, 3));
      el.directorQuestion.textContent = t(question.text);
    }
    if (missionIndex === 2) {
      const question = REPORT_QUESTIONS[Math.min(reportQuestion, 2)];
      el.reportCount.textContent = t('reportCount', Math.min(reportQuestion + 1, 3));
      el.reportQuestion.textContent = t(question.text);
      el.answerGrid.replaceChildren();
      question.options.forEach((option) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'answer-btn';
        button.dataset.answer = option;
        if (reportQuestion === 0) button.textContent = t(option);
        else if (reportQuestion === 1) button.textContent = t('votes', Number(option));
        else button.textContent = t('averageChoice', Number(option));
        button.addEventListener('click', () => answerReport(option));
        el.answerGrid.append(button);
      });
    }
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
    el.chart.setAttribute('aria-label', t('chartLabel'));
  }

  function render() {
    const mission = MISSIONS[missionIndex];
    el.missionNumber.textContent = String(missionIndex + 1).padStart(2, '0');
    el.missionKicker.textContent = t(mission.kicker);
    el.missionTitle.textContent = t(mission.title);
    el.missionText.textContent = t(mission.text);
    el.consoleKicker.textContent = missionIndex === 0
      ? (language === 'zh' ? 'TALLY DESK / 计票台' : 'TALLY DESK')
      : missionIndex === 1
        ? (language === 'zh' ? 'VISION MIXER / 导播台' : 'VISION MIXER')
        : (language === 'zh' ? 'ANCHOR DESK / 主播台' : 'ANCHOR DESK');
    el.consoleTitle.textContent = t(mission.console);
    el.lessonIcon.textContent = mission.icon;
    el.lessonText.textContent = t(mission.lesson);
    el.tallyPanel.hidden = missionIndex !== 0;
    el.chartPanel.hidden = missionIndex !== 1;
    el.reportPanel.hidden = missionIndex !== 2;
    el.next.hidden = !completed.has(missionIndex) || missionIndex === 2;
    setStatus(statusMessage.key, statusMessage.tone, ...statusMessage.args);
    renderNav();
    renderControls();
    renderTally();
    renderQuestionPanels();
    renderChart();
  }

  function completeMission() {
    completed.add(missionIndex);
    unlocked = Math.max(unlocked, Math.min(2, missionIndex + 1));
    save();
    if (missionIndex === 2) {
      sound.finale();
      window.cool?.complete?.();
      setTimeout(() => {
        el.course.inert = true;
        el.modal.hidden = false;
        el.playAgain.focus();
      }, 280);
    } else {
      sound.correct();
    }
    render();
  }

  function recordVote(songId, songIndex) {
    if (missionIndex !== 0 || voteIndex >= VOTES.length || completed.has(0)) return;
    if (songId !== VOTES[voteIndex]) {
      sound.error();
      setStatus('act1Wrong', 'bad');
      return;
    }
    counts[songId] += 1;
    voteIndex += 1;
    sound.tap(songIndex);
    window.cool?.track?.('record-theme-vote', { song: songId, vote: voteIndex });
    if (voteIndex === VOTES.length) {
      setStatus('act1Done', 'good');
      completeMission();
    } else {
      setStatus('act1Progress', '', voteIndex, VOTES.length);
      renderTally();
      renderChart();
    }
  }

  function chooseChart(type) {
    if (missionIndex !== 1 || completed.has(1)) return;
    const question = CHART_QUESTIONS[chartQuestion];
    if (type !== question.answer) {
      sound.error();
      setStatus('act2Wrong', 'bad');
      return;
    }
    sound.correct();
    chartQuestion += 1;
    window.cool?.track?.('match-data-chart', { question: chartQuestion, chart: type });
    if (chartQuestion === CHART_QUESTIONS.length) {
      setStatus('act2Done', 'good');
      completeMission();
    } else {
      setStatus('act2Correct', 'good');
      renderQuestionPanels();
      renderChart();
    }
  }

  function answerReport(answer) {
    if (missionIndex !== 2 || completed.has(2)) return;
    const question = REPORT_QUESTIONS[reportQuestion];
    if (answer !== question.answer) {
      sound.error();
      setStatus('act3Wrong', 'bad');
      return;
    }
    sound.correct();
    reportQuestion += 1;
    window.cool?.track?.('deliver-data-report', { line: reportQuestion, answer });
    if (reportQuestion === REPORT_QUESTIONS.length) {
      setStatus('act3Done', 'good');
      completeMission();
    } else {
      setStatus('act3Correct', 'good');
      renderQuestionPanels();
    }
  }

  el.chartChoices.forEach((button) =>
    button.addEventListener('click', () => chooseChart(button.dataset.chart)));
  el.hint.addEventListener('click', () => {
    sound.tap();
    setStatus(MISSIONS[missionIndex].hint);
  });
  el.next.addEventListener('click', () => switchMission(Math.min(2, missionIndex + 1)));
  el.sound.addEventListener('click', () => {
    sound.setMuted(!sound.muted);
    renderControls();
    if (!sound.muted) sound.tap();
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
    statusMessage = { key: 'act1Ready', tone: '', args: [] };
    window.cool?.stage?.('show-1');
    render();
    el.tallyGrid.querySelector('button')?.focus();
  });

  window.addEventListener('resize', renderChart);
  window.addEventListener('themechange', renderChart);
  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang }) {
      t = translate;
      language = lang;
      render();
    },
  });
})();
