(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '维恩太空港 · KidsLab', back: '返回平台', title: '维恩太空港',
      eyebrow: '塔台任务', parkHere: '停这里', both: '两个都要', neither: '两个都不是',
      incoming: '新飞船请求降落', hint: '💡 给点提示', reset: '↻ 重开本关',
      missionDone: '任务完成', next: '下一关 →',
      intro: '拖动飞船，或点一下停机坪。', right: '降落成功！规则完全符合。',
      wrong: '这座停机坪不合规则，再看看飞船特征。', intersection: '两个条件都有！重叠区同时亮灯！',
      outside: '两边都不符合，它要停在圆圈外。',
      hintLeft: (a) => `先问：它有「${a}」吗？`,
      hintRight: (b) => `再问：它有「${b}」吗？`,
      hintBoth: '两个答案都是“有”，就去中间重叠区。',
      levelNames: ['双重身份', '形状扫描', '星际货运', '空港总考验'],
      missions: [
        '按「有触角」和「三只眼」安排停机坪。',
        '按「圆形船身」和「有条纹」安排停机坪。',
        '按「带水晶」和「有翅膀」安排停机坪。',
        '规则会轮换，仔细看两块塔台牌。',
      ],
      rules: {
        antenna: '有触角', threeEyes: '三只眼', round: '圆形船身', striped: '有条纹',
        crystal: '带水晶', wings: '有翅膀', blue: '蓝色船身', star: '有星星标志',
      },
      noFeature: '没有特别标记',
      completeTitles: ['交集停机坪点亮了！', '分类雷达升级！', '星际货物全部签收！', '金牌塔台指挥官！'],
      completeTexts: [
        '你找到了同时满足两个条件的飞船，这块重叠的地方叫“交集”。',
        '同一艘飞船可以属于两个集合，也可以只属于其中一个。',
        '哪边都不符合时，飞船仍有位置：停在两个圆圈外。',
        '你会用两个条件分类了。每艘飞船都有最合适的位置！',
      ],
      allDone: '再玩一次 ↻',
    },
    en: {
      doc: 'Venn Spaceport · KidsLab', back: 'Back to platform', title: 'Venn Spaceport',
      eyebrow: 'Control mission', parkHere: 'Park here', both: 'both rules', neither: 'neither rule',
      incoming: 'New ship requests landing', hint: '💡 Give me a hint', reset: '↻ Restart round',
      missionDone: 'Mission complete', next: 'Next round →',
      intro: 'Drag the ship, or tap a landing zone.', right: 'Landed! Every rule checks out.',
      wrong: 'That bay does not fit. Check the ship features again.', intersection: 'It has both! Both circles light up together!',
      outside: 'It matches neither rule, so it parks outside both circles.',
      hintLeft: (a) => `First ask: does it have “${a}”?`,
      hintRight: (b) => `Then ask: does it have “${b}”?`,
      hintBoth: 'Two yes answers mean the middle overlap.',
      levelNames: ['Double identity', 'Shape scanner', 'Star cargo', 'Spaceport finale'],
      missions: [
        'Sort by “has antennae” and “three eyes”.',
        'Sort by “round body” and “has stripes”.',
        'Sort by “carries crystal” and “has wings”.',
        'Rules will rotate. Read both control signs.',
      ],
      rules: {
        antenna: 'has antennae', threeEyes: 'three eyes', round: 'round body', striped: 'has stripes',
        crystal: 'carries crystal', wings: 'has wings', blue: 'blue body', star: 'star badge',
      },
      noFeature: 'no special marks',
      completeTitles: ['The overlap is glowing!', 'Sorting radar upgraded!', 'All cargo checked in!', 'Gold control-tower captain!'],
      completeTexts: [
        'You found ships that match both rules. This overlapping place is called the intersection.',
        'One ship can belong to both sets, or to just one of them.',
        'When neither rule fits, there is still a place: outside both circles.',
        'You can sort with two rules. Every ship has one best place!',
      ],
      allDone: 'Play again ↻',
    },
  };

  const LEVELS = [
    {
      rules: ['antenna', 'threeEyes'],
      ships: [
        { antenna: true, threeEyes: false, icon: '☄' },
        { antenna: true, threeEyes: true, icon: '✦' },
        { antenna: false, threeEyes: true, icon: '☾' },
        { antenna: false, threeEyes: false, icon: '●' },
        { antenna: true, threeEyes: true, icon: '★' },
      ],
    },
    {
      rules: ['round', 'striped'],
      ships: [
        { round: true, striped: false, icon: '●' },
        { round: false, striped: true, icon: '▰' },
        { round: true, striped: true, icon: '◉' },
        { round: false, striped: false, icon: '◆' },
        { round: true, striped: true, icon: '⊚' },
      ],
    },
    {
      rules: ['crystal', 'wings'],
      ships: [
        { crystal: false, wings: true, icon: '➤' },
        { crystal: true, wings: true, icon: '♦' },
        { crystal: true, wings: false, icon: '◆' },
        { crystal: false, wings: false, icon: '●' },
        { crystal: true, wings: true, icon: '✧' },
      ],
    },
    {
      rules: ['blue', 'star'],
      ships: [
        { blue: true, star: true, icon: '★' },
        { blue: false, star: true, icon: '★' },
        { blue: true, star: false, icon: '●' },
        { blue: false, star: false, icon: '◆' },
        { blue: true, star: true, icon: '★' },
      ],
    },
  ];

  const LS = { lang: 'kidslab.lang', theme: 'kidslab.theme' };
  const store = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* Browser privacy mode. */ } },
  };
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  let lang = store.get(LS.lang) || (navigator.language?.startsWith('zh') ? 'zh' : 'en');
  if (!I18N[lang]) lang = 'zh';
  let theme = store.get(LS.theme) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (!['light', 'dark'].includes(theme)) theme = 'light';
  let levelIndex = 0;
  let shipIndex = 0;
  let hintStep = 0;
  let locked = false;
  let dragging = null;

  const t = (key) => I18N[lang][key] ?? I18N.zh[key] ?? key;
  const level = () => LEVELS[levelIndex];
  const ship = () => level().ships[shipIndex];
  const ruleName = (key) => t('rules')[key];

  function expectedZone(item = ship()) {
    const [left, right] = level().rules;
    if (item[left] && item[right]) return 'both';
    if (item[left]) return 'left';
    if (item[right]) return 'right';
    return 'neither';
  }

  function applyLang() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = t('doc');
    $$('[data-t]').forEach((node) => {
      const text = I18N[lang][node.dataset.t];
      if (typeof text === 'string') node.textContent = text;
    });
    $('#langBtn').textContent = lang === 'zh' ? 'EN' : '中';
    render();
  }

  function applyTheme() {
    document.documentElement.dataset.theme = theme;
    $('#themeBtn').textContent = theme === 'light' ? '🌙' : '☀️';
  }

  function render() {
    const [left, right] = level().rules;
    $('#leftRule').textContent = ruleName(left);
    $('#rightRule').textContent = ruleName(right);
    $('#missionText').textContent = t('missions')[levelIndex];
    $('#levelName').textContent = `${levelIndex + 1} · ${t('levelNames')[levelIndex]}`;
    $('#score').textContent = `${shipIndex}/${level().ships.length}`;
    $('#progressBar').style.transform = `scaleX(${shipIndex / level().ships.length})`;
    $('#levelDots').innerHTML = LEVELS.map((_, index) => {
      const state = index === levelIndex ? 'active' : index < levelIndex ? 'done' : '';
      return `<button class="level-dot ${state}" type="button" data-level="${index}" aria-label="${index + 1}">${state === 'done' ? '' : index + 1}</button>`;
    }).join('');
    renderShip();
    if (!locked) say(t('intro'), '👋');
  }

  function renderShip() {
    const item = ship();
    if (!item) return;
    const [left, right] = level().rules;
    const eyeCount = item.threeEyes ? 3 : 2;
    const shipEl = $('#ship');
    shipEl.className = 'ship';
    shipEl.style.transform = '';
    shipEl.style.position = '';
    shipEl.style.left = '';
    shipEl.style.top = '';
    shipEl.querySelector('.ship__eyes').innerHTML = '<i></i>'.repeat(eyeCount);
    shipEl.querySelector('.ship__antennae').hidden = !item.antenna;
    $('#shipIcon').textContent = item.icon;
    shipEl.querySelector('.ship__body').classList.toggle('is-round', Boolean(item.round));
    shipEl.querySelector('.ship__body').classList.toggle('is-striped', Boolean(item.striped));
    shipEl.querySelector('.ship__body').classList.toggle('is-blue', Boolean(item.blue));
    shipEl.querySelector('.ship__body').classList.toggle('has-wings', Boolean(item.wings));
    const active = [left, right].filter((key) => item[key]);
    $('#featureTags').innerHTML = (active.length ? active : ['none'])
      .map((key) => `<span class="feature-tag">${key === 'none' ? t('noFeature') : `✓ ${ruleName(key)}`}</span>`).join('');
  }

  function say(text, face = '🛰️') {
    $('#messageText').textContent = text;
    $('.message__face').textContent = face;
    const message = $('#message');
    message.classList.remove('pop');
    void message.offsetWidth;
    message.classList.add('pop');
  }

  function chooseZone(zone) {
    if (locked) return;
    const expected = expectedZone();
    if (zone !== expected) {
      hintStep = Math.min(2, hintStep + 1);
      $('#ship').classList.remove('wrong');
      void $('#ship').offsetWidth;
      $('#ship').classList.add('wrong');
      say(t('wrong'), '👽');
      window.cool?.track('wrong_bay', { level: levelIndex + 1, zone });
      return;
    }
    locked = true;
    hintStep = 0;
    const zoneEl = $(`[data-zone="${zone}"]`);
    zoneEl.classList.add('correct');
    const feedback = zone === 'both' ? t('intersection') : zone === 'neither' ? t('outside') : t('right');
    say(feedback, zone === 'both' ? '✨' : '✅');
    $('#ship').classList.add('fly');
    window.cool?.track('ship_landed', { level: levelIndex + 1, zone });
    setTimeout(() => {
      zoneEl.classList.remove('correct');
      shipIndex += 1;
      if (shipIndex >= level().ships.length) finishLevel();
      else {
        locked = false;
        render();
      }
    }, 620);
  }

  function showHint() {
    const [left, right] = level().rules;
    const item = ship();
    const messages = [
      t('hintLeft')(ruleName(left)),
      t('hintRight')(ruleName(right)),
      item[left] && item[right] ? t('hintBoth') : expectedZone(item) === 'neither' ? t('outside') : expectedZone(item) === 'left' ? t('hintLeft')(ruleName(left)) : t('hintRight')(ruleName(right)),
    ];
    say(messages[hintStep % messages.length], '💡');
    hintStep += 1;
    window.cool?.track('hint_used', { level: levelIndex + 1 });
  }

  function finishLevel() {
    $('#progressBar').style.transform = 'scaleX(1)';
    $('#score').textContent = `${level().ships.length}/${level().ships.length}`;
    $('#modalTitle').textContent = t('completeTitles')[levelIndex];
    $('#modalText').textContent = t('completeTexts')[levelIndex];
    $('#nextBtn').textContent = levelIndex === LEVELS.length - 1 ? t('allDone') : t('next');
    $('#modal').hidden = false;
    confetti();
    window.cool?.stage(`venn_level_${levelIndex + 1}`);
  }

  function startLevel(index) {
    levelIndex = index;
    shipIndex = 0;
    hintStep = 0;
    locked = false;
    $('#modal').hidden = true;
    render();
  }

  function nextLevel() {
    startLevel((levelIndex + 1) % LEVELS.length);
  }

  function confetti() {
    const colors = ['#47d7e8', '#ff6f7f', '#ffcc57', '#4fd09b', '#a993ff'];
    for (let i = 0; i < 36; i += 1) {
      const piece = document.createElement('i');
      piece.className = 'confetti';
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.background = colors[i % colors.length];
      piece.style.animationDuration = `${1.8 + Math.random() * 1.5}s`;
      piece.style.animationDelay = `${Math.random() * .35}s`;
      document.body.append(piece);
      setTimeout(() => piece.remove(), 3500);
    }
  }

  function resetDrag() {
    dragging = null;
    const shipEl = $('#ship');
    shipEl.classList.remove('dragging');
    shipEl.style.transform = '';
    $$('.zone').forEach((zone) => zone.classList.remove('hover'));
  }

  function dragStart(event) {
    if (locked) return;
    const rect = $('#ship').getBoundingClientRect();
    dragging = { id: event.pointerId, x: event.clientX, y: event.clientY, rect };
    $('#ship').setPointerCapture(event.pointerId);
    $('#ship').classList.add('dragging');
  }

  function dragMove(event) {
    if (!dragging || dragging.id !== event.pointerId) return;
    const dx = event.clientX - dragging.x;
    const dy = event.clientY - dragging.y;
    $('#ship').style.transform = `translate(${dx}px, ${dy}px) scale(1.05)`;
    $$('.zone').forEach((zone) => {
      const rect = zone.getBoundingClientRect();
      zone.classList.toggle('hover', event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom);
    });
  }

  function dragEnd(event) {
    if (!dragging || dragging.id !== event.pointerId) return;
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-zone]');
    resetDrag();
    if (target) chooseZone(target.dataset.zone);
  }

  $('#langBtn').addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    store.set(LS.lang, lang);
    applyLang();
  });
  $('#themeBtn').addEventListener('click', () => {
    theme = theme === 'light' ? 'dark' : 'light';
    store.set(LS.theme, theme);
    applyTheme();
  });
  $('#hintBtn').addEventListener('click', showHint);
  $('#resetBtn').addEventListener('click', () => startLevel(levelIndex));
  $('#nextBtn').addEventListener('click', nextLevel);
  $('#levelDots').addEventListener('click', (event) => {
    const button = event.target.closest('[data-level]');
    if (button) startLevel(Number(button.dataset.level));
  });
  $('.venn').addEventListener('click', (event) => {
    const zone = event.target.closest('[data-zone]');
    if (zone) chooseZone(zone.dataset.zone);
  });
  $('#ship').addEventListener('pointerdown', dragStart);
  $('#ship').addEventListener('pointermove', dragMove);
  $('#ship').addEventListener('pointerup', dragEnd);
  $('#ship').addEventListener('pointercancel', resetDrag);
  $('#ship').addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      showHint();
    }
  });

  applyTheme();
  applyLang();
})();
