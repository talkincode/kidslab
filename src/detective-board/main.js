/* ============================================================
   侦探线索板 · KidsLab 双语/主题模板
   —— 「语言 & 主题」段落是平台约定，整段复制、按需加 key，勿改机制
   ============================================================ */
(() => {
  'use strict';

  /* ================= 语言 & 主题 · Language & Theme ================= */
  const I18N = {
    zh: {
      doc: '侦探线索板 · KidsLab',
      back: '返回平台',
      title: '侦探线索板',
      tip0: '先点右侧亮起的线索卡，再照中间提示在棋盘上钉图钉。',
      eyebrow: '软木板侦探社', progressLabel: '线索进度', cluesTitle: '线索卡', cluesLead: '先点一张线索，再照中间的「下一步」操作。',
      nextMove: '下一步', markLabel: '选择图钉', pinNo: '排除', pinYes: '确定',
      hintBtn: '给我一步提示 ×3', resetBtn: '重开本案', closedStamp: '结案', restoreTitle: '案情还原', nextCase: '下一案 →',
      intuition: (n) => `侦探直觉 ×${n}`, noHints: '本案直觉用完啦。相信排除法！',
      hintTip: '已为你点亮下一条线索，跟着中间的「下一步」做。', solvedTip: '红线织好了！真相浮出软木板。',
      progressTip: (done, total) => `已经记录 ${done}/${total} 条线索。`,
      stepsLeft: (a, b) => `还有 ${a} 条线索待完成${b ? ` · ${b} 个图钉需要改正` : ''}`,
      guideStart: '先点右侧一张线索卡。系统会告诉你该钉哪个格子。',
      guidePin: (clueText, targets, pin) => `根据「${clueText}」，在 ${targets} 钉下 ${pin}。`,
      guideLink: (clueText) => `「${clueText}」会在相关人物被确定后自动连线。先完成有明确人名的线索。`,
      guideDone: '这条线索已经记录。点下一张还没完成的线索。',
      guideLiar: '所有真线索都记录好了。现在在右侧指出那一条假证词。',
      chooseClueFirst: '先从右侧亮起的线索卡开始。',
      wrongCell: (targets) => `这条线索对应的是 ${targets}，先找这些格子。`,
      wrongPin: (pin) => `这一步应该钉下 ${pin}。`,
      clueActive: '正在推理', clueDone: '已记录', clueLink: '等待连线', falseReady: '可以指认',
      falseAsk: '这条是假线索', falsePicked: '已指出假线索', liarTip: '这案有一条证词是假的：先排除，再指出那个捣乱的证人。',
      wrongFalse: '这张卡看起来还能成立，别急着说它假。',
    },
    en: {
      doc: 'Detective Clue Board · KidsLab',
      back: 'Back to platform',
      title: 'Detective Clue Board',
      tip0: 'Start with the glowing clue card, then follow the center prompt to pin the board.',
      eyebrow: 'Corkboard Detective Club', progressLabel: 'Clue progress', cluesTitle: 'Clue cards', cluesLead: 'Pick one clue, then follow the center “Next move” prompt.',
      nextMove: 'Next move', markLabel: 'Choose a pin', pinNo: 'Rule out', pinYes: 'Confirm',
      hintBtn: 'Show my next move ×3', resetBtn: 'Restart case', closedStamp: 'Closed', restoreTitle: 'Case replay', nextCase: 'Next case →',
      intuition: (n) => `Detective hunch ×${n}`, noHints: 'No hunches left for this case. Trust elimination!',
      hintTip: 'The next clue is highlighted. Follow the center “Next move” prompt.', solvedTip: 'The red strings are complete — truth pops off the corkboard.',
      progressTip: (done, total) => `${done}/${total} clues recorded.`,
      stepsLeft: (a, b) => `${a} clues still need work${b ? ` · ${b} pins need fixing` : ''}`,
      guideStart: 'Pick a clue card on the right. We will show exactly which square to pin.',
      guidePin: (clueText, targets, pin) => `From “${clueText}”, pin ${pin} on ${targets}.`,
      guideLink: (clueText) => `“${clueText}” will connect automatically once its person is confirmed. Finish the clues with named people first.`,
      guideDone: 'This clue is recorded. Pick the next unfinished clue.',
      guideLiar: 'Every true clue is recorded. Now identify the false testimony on the right.',
      chooseClueFirst: 'Start with the glowing clue card on the right.',
      wrongCell: (targets) => `This clue belongs on ${targets}. Find that square first.`,
      wrongPin: (pin) => `This step needs the ${pin} pin.`,
      clueActive: 'Working on this', clueDone: 'Recorded', clueLink: 'Waiting for a link', falseReady: 'Ready to accuse',
      falseAsk: 'This clue is false', falsePicked: 'False clue marked', liarTip: 'One testimony is false: try deductions, then name the troublemaker.',
      wrongFalse: 'This card can still be true. Do not accuse it yet.',
    },
  };

  const LS = { lang: 'kidslab.lang', theme: 'kidslab.theme' };
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* 忽略 */ } },
  };

  let lang = store.get(LS.lang) || (navigator.language?.startsWith('zh') ? 'zh' : 'en');
  if (!I18N[lang]) lang = 'zh';
  let theme = store.get(LS.theme)
    || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (theme !== 'light' && theme !== 'dark') theme = 'light';

  /** 取当前语言文案；函数型 key 直接返回函数供调用方传参 */
  const t = (key) => I18N[lang][key] ?? I18N.zh[key] ?? key;
  /** 读取 CSS 主题变量（Canvas/three.js 取色必须走这里，勿硬编码） */
  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  const langBtn = document.getElementById('langBtn');
  const themeBtn = document.getElementById('themeBtn');

  function applyLang() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = t('doc');
    document.querySelectorAll('[data-t]').forEach((n) => {
      const v = I18N[lang][n.dataset.t];
      if (typeof v === 'string') n.textContent = v;
    });
    if (langBtn) langBtn.textContent = lang === 'zh' ? 'EN' : '中';
    render(); // 语言切换后重绘动态文案
  }

  function applyTheme() {
    document.documentElement.dataset.theme = theme;
    if (themeBtn) themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
    /* Canvas / three.js 课件监听该事件重取 cssVar 配色 */
    dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    render();
  }

  langBtn?.addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    store.set(LS.lang, lang);
    applyLang();
  });
  themeBtn?.addEventListener('click', () => {
    theme = theme === 'light' ? 'dark' : 'light';
    store.set(LS.theme, theme);
    applyTheme();
  });

  /* ======================= 游戏区 · Game ======================= */
  const $ = (s) => document.querySelector(s);
  const byId = (id) => document.getElementById(id);
  const L = (zh, en) => ({ zh, en });
  const text = (obj) => obj?.[lang] || obj?.zh || '';

  const CASES = [
    {
      icon: '🍰', size: 3,
      title: L('偷吃蛋糕案', 'Cake Crumb Mystery'),
      brief: L('厨房只剩奶油脚印。谁喝了什么？', 'Only creamy footprints remain. Who drank what?'),
      people: [p('milo', '🐻', '小熊', 'Milo'), p('nina', '🐰', '妮娜', 'Nina'), p('toto', '🐸', '托托', 'Toto')],
      dims: [dim('drink', '🥤', '饮料', 'Drink', [v('milk', '🥛', '牛奶', 'Milk'), v('juice', '🧃', '橙汁', 'Juice'), v('tea', '🍵', '热茶', 'Tea')])],
      solution: { milo: { drink: 'tea' }, nina: { drink: 'milk' }, toto: { drink: 'juice' } },
      clues: [
        clue(L('小熊没有喝橙汁。', 'Milo did not drink juice.'), not('milo', 'drink', 'juice')),
        clue(L('妮娜喝的是白白的饮料。', 'Nina drank the white drink.'), is('nina', 'drink', 'milk')),
        clue(L('托托的杯子不是热茶杯。', "Toto's cup was not tea."), not('toto', 'drink', 'tea')),
      ],
      story: [L('妮娜举起牛奶胡子：我只喝了一口！', 'Nina shows a milk moustache: I only had one sip!'), L('托托拿着橙汁路过冰箱。', 'Toto walked by the fridge with juice.'), L('小熊端着热茶，承认蛋糕是他“检查”过的。', 'Milo held tea and admitted he “inspected” the cake.')],
    },
    {
      icon: '📦', size: 3,
      title: L('错寄包裹案', 'Mixed-up Parcel Case'), brief: L('三只包裹被送错门牌。宠物和房色能对上吗？', 'Three parcels reached odd doors. Match pets and house colors.'),
      people: [p('ada', '🦊', '艾达', 'Ada'), p('ben', '🐼', '本本', 'Ben'), p('coco', '🐱', '可可', 'Coco')],
      dims: [
        dim('pet', '🐾', '宠物', 'Pet', [v('cat', '🐱', '猫', 'Cat'), v('dog', '🐶', '狗', 'Dog'), v('bird', '🐦', '鸟', 'Bird')]),
        dim('house', '🏠', '房色', 'House', [v('red', '🔴', '红房子', 'Red'), v('blue', '🔵', '蓝房子', 'Blue'), v('green', '🟢', '绿房子', 'Green')]),
      ],
      solution: { ada: { pet: 'bird', house: 'blue' }, ben: { pet: 'dog', house: 'green' }, coco: { pet: 'cat', house: 'red' } },
      clues: [
        clue(L('可可养猫。', 'Coco owns the cat.'), is('coco', 'pet', 'cat')),
        clue(L('艾达不住红房子，也不养狗。', 'Ada lives in neither the red house nor with the dog.'), not('ada', 'house', 'red'), not('ada', 'pet', 'dog')),
        clue(L('养狗的人住绿房子。', 'The dog owner lives in the green house.'), link('pet', 'dog', 'house', 'green')),
        clue(L('蓝房子的主人养鸟。', 'The blue-house owner keeps the bird.'), link('house', 'blue', 'pet', 'bird')),
      ],
      story: [L('红房子门口，可可的猫咪坐在包裹上。', "At the red house, Coco's cat sat on the parcel."), L('绿房子的本本牵着小狗来签收。', 'Ben at the green house signed with a dog leash.'), L('蓝房子的艾达打开鸟粮包裹：终于寄对啦！', 'Ada in the blue house opened bird food: delivered at last!')],
    },
    {
      icon: '👻', size: 3,
      title: L('图书馆幽灵案', 'Library Ghost Case'), brief: L('书架夜里哗啦响，其实是三位同学的书签。', 'Shelves rattled at night — actually three bookmarks.'),
      people: [p('lulu', '🦉', '露露', 'Lulu'), p('max', '🦁', '马克', 'Max'), p('ivy', '🐨', '艾薇', 'Ivy')],
      dims: [
        dim('book', '📚', '书', 'Book', [v('stars', '🌟', '星星书', 'Stars'), v('robot', '🤖', '机器人书', 'Robot'), v('ocean', '🌊', '海洋书', 'Ocean')]),
        dim('mark', '🔖', '书签', 'Bookmark', [v('moon', '🌙', '月亮', 'Moon'), v('leaf', '🍃', '叶子', 'Leaf'), v('bolt', '⚡', '闪电', 'Bolt')]),
      ],
      solution: { lulu: { book: 'stars', mark: 'moon' }, max: { book: 'ocean', mark: 'bolt' }, ivy: { book: 'robot', mark: 'leaf' } },
      clues: [clue(L('露露借了星星书。', 'Lulu borrowed the stars book.'), is('lulu', 'book', 'stars')), clue(L('机器人书里夹着叶子书签。', 'The robot book had the leaf bookmark.'), link('book', 'robot', 'mark', 'leaf')), clue(L('马克没有月亮书签，也没借机器人书。', 'Max had neither the moon bookmark nor the robot book.'), not('max', 'mark', 'moon'), not('max', 'book', 'robot')), clue(L('海洋书配闪电书签。', 'The ocean book used the bolt bookmark.'), link('book', 'ocean', 'mark', 'bolt'))],
      story: [L('露露的星星书闪着月亮书签。', "Lulu's stars book held the moon bookmark."), L('艾薇找到机器人书里的叶子。', 'Ivy found the leaf in the robot book.'), L('马克的海洋书和闪电书签哗啦一响，幽灵破案！', "Max's ocean book and bolt bookmark made the ghostly rattle.")],
    },
    {
      icon: '🏃', size: 4,
      title: L('运动会号码案', 'Sports Day Numbers'), brief: L('四位选手、四个项目、四个号码牌。', 'Four players, four events, four bib numbers.'),
      people: [p('ann', '🐯', '安安', 'Ann'), p('bo', '🐵', '波波', 'Bo'), p('kim', '🐶', '奇奇', 'Kim'), p('ray', '🐧', '瑞瑞', 'Ray')],
      dims: [dim('event', '🏅', '项目', 'Event', [v('run', '🏃', '短跑', 'Run'), v('jump', '🦘', '跳远', 'Jump'), v('swim', '🏊', '游泳', 'Swim'), v('throw', '🥏', '投掷', 'Throw')]), dim('num', '#', '号码', 'Number', [v('11', '①', '11号', 'No.11'), v('22', '②', '22号', 'No.22'), v('33', '③', '33号', 'No.33'), v('44', '④', '44号', 'No.44')])],
      solution: { ann: { event: 'jump', num: '22' }, bo: { event: 'run', num: '11' }, kim: { event: 'throw', num: '44' }, ray: { event: 'swim', num: '33' } },
      clues: [clue(L('波波是11号。', 'Bo wears No.11.'), is('bo', 'num', '11')), clue(L('安安参加跳远。', 'Ann enters jump.'), is('ann', 'event', 'jump')), clue(L('游泳选手是33号。', 'The swimmer is No.33.'), link('event', 'swim', 'num', '33')), clue(L('奇奇不短跑，也不是22号。', 'Kim neither runs nor wears No.22.'), not('kim', 'event', 'run'), not('kim', 'num', '22')), clue(L('投掷选手是44号。', 'The thrower is No.44.'), link('event', 'throw', 'num', '44'))],
      story: [L('波波戴着11号冲过终点。', 'Bo crossed the line with No.11.'), L('安安在22号牌下跳出远远一跃。', 'Ann jumped far under No.22.'), L('瑞瑞33号去游泳，奇奇44号投出飞盘。', 'Ray swam as No.33; Kim threw as No.44.')],
    },
    {
      icon: '🎨', size: 4,
      title: L('美术室颜料案', 'Art Room Paint Case'), brief: L('谁拿走了哪种颜色和工具？', 'Who took which color and tool?'),
      people: [p('mia', '🐭', '米娅', 'Mia'), p('noah', '🐮', '诺亚', 'Noah'), p('oli', '🦔', '奥利', 'Oli'), p('pia', '🐥', '皮娅', 'Pia')],
      dims: [dim('color', '🎨', '颜色', 'Color', [v('red', '🔴', '红色', 'Red'), v('blue', '🔵', '蓝色', 'Blue'), v('yellow', '🟡', '黄色', 'Yellow'), v('purple', '🟣', '紫色', 'Purple')]), dim('tool', '🧰', '工具', 'Tool', [v('brush', '🖌️', '画笔', 'Brush'), v('sponge', '🧽', '海绵', 'Sponge'), v('roller', '🧻', '滚筒', 'Roller'), v('stamp', '🔶', '印章', 'Stamp')])],
      solution: { mia: { color: 'purple', tool: 'stamp' }, noah: { color: 'red', tool: 'brush' }, oli: { color: 'yellow', tool: 'roller' }, pia: { color: 'blue', tool: 'sponge' } },
      clues: [clue(L('诺亚拿了红色。', 'Noah took red.'), is('noah', 'color', 'red')), clue(L('蓝色颜料配海绵。', 'Blue paint goes with the sponge.'), link('color', 'blue', 'tool', 'sponge')), clue(L('米娅没有画笔，也没有黄色。', 'Mia had neither brush nor yellow.'), not('mia', 'tool', 'brush'), not('mia', 'color', 'yellow')), clue(L('奥利用滚筒。', 'Oli used the roller.'), is('oli', 'tool', 'roller')), clue(L('印章不是红色颜料。', 'The stamp was not with red paint.'), notlink('tool', 'stamp', 'color', 'red'))],
      story: [L('诺亚用画笔刷红色，桌子像小火车。', 'Noah brushed red like a tiny train.'), L('皮娅的蓝色海绵印出云朵。', "Pia's blue sponge made clouds."), L('奥利用黄色滚筒，米娅用紫色印章收尾。', 'Oli rolled yellow; Mia stamped purple to finish.')],
    },
    {
      icon: '🗣️', size: 4, liar: true, falseClue: 2,
      title: L('说谎的证人', 'The Lying Witness'), brief: L('四张证词中有一张是假的。找出安排，还要指出假话。', 'One of four testimonies is false. Solve the board and name the lie.'),
      people: [p('rex', '🦖', '雷克斯', 'Rex'), p('sue', '🦄', '苏苏', 'Sue'), p('tim', '🐢', '提姆', 'Tim'), p('uma', '🐝', '优玛', 'Uma')],
      dims: [dim('snack', '🍪', '点心', 'Snack', [v('cake', '🍰', '蛋糕', 'Cake'), v('apple', '🍎', '苹果', 'Apple'), v('cookie', '🍪', '饼干', 'Cookie'), v('corn', '🌽', '玉米', 'Corn')])],
      solution: { rex: { snack: 'apple' }, sue: { snack: 'cake' }, tim: { snack: 'corn' }, uma: { snack: 'cookie' } },
      clues: [clue(L('苏苏拿了蛋糕。', 'Sue took the cake.'), is('sue', 'snack', 'cake')), clue(L('雷克斯没有拿饼干。', 'Rex did not take cookies.'), not('rex', 'snack', 'cookie')), clue(L('提姆拿了苹果。', 'Tim took the apple.'), is('tim', 'snack', 'apple'), true), clue(L('优玛没有拿玉米。', 'Uma did not take corn.'), not('uma', 'snack', 'corn'))],
      story: [L('假证词是“提姆拿了苹果”——提姆其实抱着玉米。', 'The lie was “Tim took the apple” — he held corn.'), L('雷克斯拿苹果，优玛拿饼干。', 'Rex took apple; Uma took cookies.'), L('苏苏的蛋糕没有冤枉别人，侦探团胜利！', "Sue's cake blamed nobody. Detective team wins!")],
    },
  ];

  function p(id, emoji, zh, en) { return { id, emoji, name: L(zh, en) }; }
  function dim(id, emoji, zh, en, values) { return { id, emoji, name: L(zh, en), values }; }
  function v(id, emoji, zh, en) { return { id, emoji, name: L(zh, en) }; }
  function is(person, dimId, val) { return { kind: 'is', person, dimId, val }; }
  function not(person, dimId, val) { return { kind: 'not', person, dimId, val }; }
  function link(dimA, valA, dimB, valB) { return { kind: 'link', dimA, valA, dimB, valB, neg: false }; }
  function notlink(dimA, valA, dimB, valB) { return { kind: 'link', dimA, valA, dimB, valB, neg: true }; }
  function clue(label, ...rules) {
    const falseRule = rules[rules.length - 1] === true;
    if (falseRule) rules.pop();
    return { label, rules, falseRule };
  }

  let caseIndex = 0;
  let marks = {};
  let hintsLeft = 3;
  let hintClue = -1;
  let markMode = 'no';
  let falsePick = null;
  let lastLines = [];
  let won = false;

  const el = {
    title: byId('caseTitle'), tip: byId('tip'), ring: byId('ring'), progressText: byId('progressText'),
    tabs: byId('caseTabs'), suspects: byId('suspects'), grids: byId('grids'), clueList: byId('clueList'), strings: byId('strings'),
    hint: byId('hintBtn'), reset: byId('resetBtn'), modal: byId('winModal'), story: byId('story'), next: byId('nextBtn'), board: byId('boardWrap'),
    guide: byId('boardGuide'), guideText: byId('guideText'), guideStep: byId('guideStep'),
    markTools: Array.from(document.querySelectorAll('[data-mark-mode]')),
  };

  function cur() { return CASES[caseIndex]; }
  function key(person, dimId, val) { return `${person}|${dimId}|${val}`; }
  function getMark(person, dimId, val) { return marks[key(person, dimId, val)] || ''; }
  function setMark(person, dimId, val, mark, auto = false) {
    const k = key(person, dimId, val);
    if (mark) marks[k] = mark; else delete marks[k];
    const cell = document.querySelector(`[data-key="${CSS.escape(k)}"]`);
    if (cell) {
      cell.textContent = mark === 'yes' ? '✅' : mark === 'no' ? '❌' : '';
      cell.className = `cell ${mark || ''}${auto ? ' auto' : ''}`;
      if (auto) setTimeout(() => cell.classList.remove('auto'), 900);
    }
  }

  function newCase(i = caseIndex) {
    caseIndex = (i + CASES.length) % CASES.length;
    marks = {};
    hintsLeft = 3;
    hintClue = nextPendingClue();
    markMode = modeForClue(hintClue);
    falsePick = null;
    lastLines = [];
    won = false;
    el.modal.hidden = true;
    buildStatic();
    render();
  }

  function buildStatic() {
    const c = cur();
    el.title.textContent = `${c.icon} ${text(c.title)}`;
    el.suspects.innerHTML = c.people.map((person) => `<div class="suspect"><div class="face">${person.emoji}</div><div><div class="name">${text(person.name)}</div><div class="role">${text(c.brief)}</div></div></div>`).join('');
    el.tabs.innerHTML = CASES.map((ca, i) => `<button class="caseTab ${i === caseIndex ? 'on' : ''}" type="button" data-case="${i}" aria-label="case ${i + 1}">${ca.icon}</button>`).join('');
    el.tabs.querySelectorAll('.caseTab').forEach((b) => b.addEventListener('click', () => newCase(Number(b.dataset.case))));
    el.grids.innerHTML = c.dims.map((d) => gridHTML(c, d)).join('');
    el.grids.querySelectorAll('.cell').forEach((cell) => cell.addEventListener('click', () => markCell(cell)));
    el.clueList.innerHTML = c.clues.map((cl, i) => `<article class="clue" data-clue="${i}"><button class="clue__select" type="button" data-select-clue="${i}"><span class="clue__copy">${text(cl.label)}</span><span class="clue__state"></span></button>${c.liar ? `<button class="falseBtn" type="button" data-false="${i}" hidden>${t(falsePick === i ? 'falsePicked' : 'falseAsk')}</button>` : ''}</article>`).join('');
    el.clueList.querySelectorAll('.clue__select').forEach((button) => button.addEventListener('click', () => selectClue(Number(button.dataset.selectClue))));
    el.clueList.querySelectorAll('.falseBtn').forEach((btn) => btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const i = Number(btn.dataset.false);
      falsePick = i;
      if (i !== c.falseClue) flashTip(t('wrongFalse'));
      render(); checkWin();
    }));
    clearLines();
  }

  function gridHTML(c, d) {
    const cols = d.values.length + 1;
    const heads = `<div></div>${d.values.map((val) => `<div class="gHead">${val.emoji}<br>${text(val.name)}</div>`).join('')}`;
    const rows = c.people.map((person) => `<div class="rowHead"><span>${person.emoji}</span><span>${text(person.name)}</span></div>${d.values.map((val) => `<button class="cell" type="button" data-key="${key(person.id, d.id, val.id)}" data-person="${person.id}" data-dim="${d.id}" data-val="${val.id}" aria-label="${text(person.name)} ${text(d.name)} ${text(val.name)}"></button>`).join('')}`).join('');
    return `<section class="gridCard"><p class="gridTitle"><span>${d.emoji} ${text(d.name)}</span><small>${d.values.length}×${d.values.length}</small></p><div class="logicGrid" style="grid-template-columns: 1.15fr repeat(${cols - 1}, minmax(42px,1fr))">${heads}${rows}</div></section>`;
  }

  function directTargets(clue) {
    return clue.rules
      .filter((rule) => rule.kind === 'is' || rule.kind === 'not')
      .map((rule) => ({ ...rule, mark: rule.kind === 'is' ? 'yes' : 'no' }));
  }

  function pendingDirectTargets(clue) {
    return directTargets(clue).filter((target) => getMark(target.person, target.dimId, target.val) !== target.mark);
  }

  function targetLabel(target) {
    const c = cur();
    const person = c.people.find((item) => item.id === target.person);
    const dimension = c.dims.find((item) => item.id === target.dimId);
    const value = dimension?.values.find((item) => item.id === target.val);
    return `「${person?.emoji || ''}${text(person?.name)} × ${value?.emoji || ''}${text(value?.name)}」`;
  }

  function targetLabels(targets) {
    return targets.map(targetLabel).join(lang === 'zh' ? '、' : ' or ');
  }

  function pinLabel(mark) {
    return mark === 'yes' ? `✅ ${t('pinYes')}` : `❌ ${t('pinNo')}`;
  }

  function nextPendingClue() {
    const c = cur();
    return c.clues.findIndex((clue, index) => index !== c.falseClue && !clue.rules.every(ruleUsed));
  }

  function modeForClue(index) {
    if (index < 0) return 'no';
    return pendingDirectTargets(cur().clues[index])[0]?.mark || 'no';
  }

  function selectClue(index) {
    if (won) return;
    hintClue = index;
    const target = pendingDirectTargets(cur().clues[index])[0];
    if (target) markMode = target.mark;
    render();
  }

  function advanceClue() {
    hintClue = nextPendingClue();
    if (hintClue >= 0) markMode = modeForClue(hintClue);
  }

  function guideState() {
    const c = cur();
    const pr = progress();
    if (c.liar && pr.nonFalseDone === pr.nonFalseTotal && falsePick !== c.falseClue) {
      return { step: '③', message: t('guideLiar'), canMark: false };
    }
    if (hintClue < 0) return { step: '①', message: t('guideStart'), canMark: false };
    const clue = c.clues[hintClue];
    if (clue.falseRule) return { step: '③', message: t('guideLiar'), canMark: false };
    if (clue.rules.every(ruleUsed)) return { step: '①', message: t('guideDone'), canMark: false };
    const targets = pendingDirectTargets(clue);
    if (!targets.length) return { step: '②', message: t('guideLink')(text(clue.label)), canMark: false };
    return {
      step: '②',
      message: t('guidePin')(text(clue.label), targetLabels(targets), pinLabel(targets[0].mark)),
      canMark: true,
    };
  }

  function markCell(cell) {
    if (won) return;
    const guide = guideState();
    if (!guide.canMark) {
      flashTip(hintClue < 0 ? t('chooseClueFirst') : guide.message);
      return;
    }
    const { person, dim, val } = cell.dataset;
    const clue = cur().clues[hintClue];
    const targets = pendingDirectTargets(clue);
    const target = targets.find((item) => item.person === person && item.dimId === dim && item.val === val);
    if (!target) {
      cell.classList.remove('wiggle');
      void cell.offsetWidth;
      cell.classList.add('wiggle');
      flashTip(t('wrongCell')(targetLabels(targets)));
      return;
    }
    if (target.mark !== markMode) {
      flashTip(t('wrongPin')(pinLabel(target.mark)));
      return;
    }
    setMark(person, dim, val, markMode);
    if (markMode === 'yes') propagateYes(person, dim, val);
    runCascade();
    const completed = clue.rules.every(ruleUsed);
    if (completed) advanceClue();
    render();
    if (completed) flashTip(t('guideDone'));
    checkWin();
  }

  function propagateYes(person, dimId, val) {
    const c = cur();
    const d = c.dims.find((x) => x.id === dimId);
    d.values.forEach((v0) => { if (v0.id !== val && getMark(person, dimId, v0.id) !== 'yes') setMark(person, dimId, v0.id, 'no'); });
    c.people.forEach((p0) => { if (p0.id !== person && getMark(p0.id, dimId, val) !== 'yes') setMark(p0.id, dimId, val, 'no'); });
  }

  function runCascade() {
    const c = cur();
    let changed = true;
    let safety = 0;
    while (changed && safety < 40) {
      changed = false; safety += 1;
      c.dims.forEach((d) => {
        c.people.forEach((p0) => {
          if (d.values.some((v0) => getMark(p0.id, d.id, v0.id) === 'yes')) return;
          const open = d.values.filter((v0) => getMark(p0.id, d.id, v0.id) !== 'no');
          if (open.length === 1) { autoYes(p0.id, d.id, open[0].id); changed = true; }
        });
        d.values.forEach((v0) => {
          if (c.people.some((p0) => getMark(p0.id, d.id, v0.id) === 'yes')) return;
          const open = c.people.filter((p0) => getMark(p0.id, d.id, v0.id) !== 'no');
          if (open.length === 1) { autoYes(open[0].id, d.id, v0.id); changed = true; }
        });
      });
      c.clues.forEach((clue) => {
        if (clue.falseRule) return;
        clue.rules.forEach((rule) => {
          if (rule.kind === 'link' && applyLinkRule(rule)) changed = true;
        });
      });
    }
  }

  function applyLinkRule(rule) {
    let changed = false;
    cur().people.forEach((person) => {
      const markA = getMark(person.id, rule.dimA, rule.valA);
      const markB = getMark(person.id, rule.dimB, rule.valB);
      if (rule.neg) {
        if (markA === 'yes' && markB === '') {
          setMark(person.id, rule.dimB, rule.valB, 'no', true);
          changed = true;
        }
        if (markB === 'yes' && markA === '') {
          setMark(person.id, rule.dimA, rule.valA, 'no', true);
          changed = true;
        }
      } else {
        if (markA === 'yes' && markB !== 'yes') {
          autoYes(person.id, rule.dimB, rule.valB);
          changed = true;
        }
        if (markB === 'yes' && markA !== 'yes') {
          autoYes(person.id, rule.dimA, rule.valA);
          changed = true;
        }
      }
    });
    return changed;
  }

  function autoYes(person, dimId, val) {
    setMark(person, dimId, val, 'yes', true);
    propagateYes(person, dimId, val);
    const cell = document.querySelector(`[data-key="${CSS.escape(key(person, dimId, val))}"]`);
    const clue = firstRelatedClue(person, dimId, val);
    if (cell && clue >= 0) drawLine(cell, document.querySelector(`[data-clue="${clue}"]`));
  }

  function firstRelatedClue(person, dimId, val) {
    return cur().clues.findIndex((cl, idx) => idx !== cur().falseClue && cl.rules.some((r) => ruleTouches(r, person, dimId, val)));
  }

  function ruleTouches(r, person, dimId, val) {
    if ((r.kind === 'is' || r.kind === 'not') && r.person === person && r.dimId === dimId && r.val === val) return true;
    if (r.kind === 'link') return (r.dimA === dimId && r.valA === val) || (r.dimB === dimId && r.valB === val);
    return false;
  }

  function drawLine(a, b) {
    if (!a || !b) return;
    const br = el.board.getBoundingClientRect();
    const ar = a.getBoundingClientRect();
    const cr = b.getBoundingClientRect();
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', String(ar.left + ar.width / 2 - br.left));
    line.setAttribute('y1', String(ar.top + ar.height / 2 - br.top));
    line.setAttribute('x2', String(Math.max(0, Math.min(br.width, cr.left + 16 - br.left))));
    line.setAttribute('y2', String(Math.max(0, Math.min(br.height, cr.top + 20 - br.top))));
    el.strings.appendChild(line);
    lastLines.push(line);
    if (lastLines.length > 9) lastLines.shift().remove();
  }

  function clearLines() { el.strings.innerHTML = ''; lastLines = []; }

  function solutionYes(person, dimId) { return cur().solution[person][dimId]; }
  function isCorrectMark(person, dimId, val, mark) {
    const yes = solutionYes(person, dimId) === val;
    return mark === 'yes' ? yes : mark === 'no' ? !yes : true;
  }

  function progress() {
    const c = cur();
    let assignmentsTotal = 0; let correctYes = 0; let wrong = 0;
    c.people.forEach((p0) => c.dims.forEach((d) => {
      assignmentsTotal += 1;
      const sol = solutionYes(p0.id, d.id);
      if (getMark(p0.id, d.id, sol) === 'yes') correctYes += 1;
      d.values.forEach((v0) => { const m = getMark(p0.id, d.id, v0.id); if (m && !isCorrectMark(p0.id, d.id, v0.id, m)) wrong += 1; });
    }));
    const nonFalseTotal = c.clues.filter((clue, index) => index !== c.falseClue).length;
    const nonFalseDone = c.clues.filter((clue, index) => index !== c.falseClue && clue.rules.every(ruleUsed)).length;
    const cluesDone = nonFalseDone + (c.liar && falsePick === c.falseClue ? 1 : 0);
    return {
      assignmentsTotal,
      correctYes,
      wrong,
      cluesDone,
      cluesTotal: c.clues.length,
      nonFalseDone,
      nonFalseTotal,
    };
  }

  function ruleUsed(rule) {
    const c = cur();
    if (rule.kind === 'is') return getMark(rule.person, rule.dimId, rule.val) === 'yes';
    if (rule.kind === 'not') return getMark(rule.person, rule.dimId, rule.val) === 'no';
    const peopleA = c.people.filter((p0) => getMark(p0.id, rule.dimA, rule.valA) === 'yes');
    if (!peopleA.length) return false;
    return peopleA.every((p0) => getMark(p0.id, rule.dimB, rule.valB) === (rule.neg ? 'no' : 'yes'));
  }

  function render() {
    if (!el.title) return;
    const c = cur();
    el.title.textContent = `${c.icon} ${text(c.title)}`;
    const pr = progress();
    const pct = pr.cluesTotal ? Math.round((pr.cluesDone / pr.cluesTotal) * 100) : 0;
    el.ring.style.setProperty('--p', String(pct));
    el.progressText.textContent = `${pr.cluesDone}/${pr.cluesTotal}`;
    el.hint.textContent = t('intuition')(hintsLeft);
    const left = Math.max(0, pr.cluesTotal - pr.cluesDone);
    el.tip.textContent = pr.wrong ? t('stepsLeft')(left, pr.wrong) : t('progressTip')(pr.cluesDone, pr.cluesTotal);
    const guide = guideState();
    el.guideStep.textContent = guide.step;
    el.guideText.textContent = guide.message;
    el.guide.classList.toggle('is-ready', guide.canMark);
    el.markTools.forEach((button) => {
      const active = button.dataset.markMode === markMode;
      button.classList.toggle('on', active);
      button.disabled = !guide.canMark || won;
      button.setAttribute('aria-pressed', String(active));
    });
    const canAccuse = c.liar && pr.nonFalseDone === pr.nonFalseTotal;
    el.clueList.querySelectorAll('.clue').forEach((card) => {
      const i = Number(card.dataset.clue);
      const clue = c.clues[i];
      const used = i !== c.falseClue && clue.rules.every(ruleUsed);
      card.classList.toggle('active', i === hintClue);
      card.classList.toggle('hint', i === hintClue && !used);
      card.classList.toggle('falsePick', i === falsePick);
      card.classList.toggle('used', used && i !== c.falseClue);
      const select = card.querySelector('.clue__select');
      select.setAttribute('aria-pressed', String(i === hintClue));
      const copy = card.querySelector('.clue__copy');
      copy.textContent = text(clue.label);
      const state = card.querySelector('.clue__state');
      if (used) state.textContent = t('clueDone');
      else if (c.liar && i === c.falseClue && canAccuse) state.textContent = t('falseReady');
      else if (i === hintClue && clue.rules.some((rule) => rule.kind === 'link') && !pendingDirectTargets(clue).length) state.textContent = t('clueLink');
      else if (i === hintClue) state.textContent = t('clueActive');
      else state.textContent = '';
      const btn = card.querySelector('.falseBtn');
      if (btn) {
        btn.hidden = !canAccuse || won;
        btn.textContent = t(falsePick === i ? 'falsePicked' : 'falseAsk');
      }
    });
    el.tabs.querySelectorAll('.caseTab').forEach((b) => b.classList.toggle('on', Number(b.dataset.case) === caseIndex));
  }

  function useHint() {
    if (hintsLeft <= 0) { flashTip(t('noHints')); return; }
    const idx = nextPendingClue();
    if (idx < 0) {
      flashTip(cur().liar ? t('guideLiar') : t('solvedTip'));
      return;
    }
    selectClue(idx);
    hintsLeft -= 1;
    flashTip(t('hintTip'));
  }

  function flashTip(msg) {
    el.tip.textContent = msg;
    el.tip.classList.remove('wiggle');
    void el.tip.offsetWidth;
    el.tip.classList.add('wiggle');
    setTimeout(render, 1600);
  }

  function checkWin() {
    const c = cur();
    const pr = progress();
    if (pr.correctYes !== pr.assignmentsTotal || pr.wrong > 0) return;
    if (c.liar && falsePick !== c.falseClue) return;
    won = true;
    clearLines();
    document.querySelectorAll('.cell.yes').forEach((cell, i) => setTimeout(() => {
      const clueCard = document.querySelector(`[data-clue="${i % c.clues.length}"]`);
      drawLine(cell, clueCard);
    }, i * 90));
    setTimeout(showWin, 850);
  }

  function showWin() {
    el.story.innerHTML = cur().story.map((s, i) => `<p style="animation-delay:${i * 0.18}s">${text(s)}</p>`).join('');
    el.modal.hidden = false;
    flashTip(t('solvedTip'));
  }

  el.markTools.forEach((button) => button.addEventListener('click', () => {
    if (!button.disabled) {
      markMode = button.dataset.markMode;
      render();
    }
  }));
  el.hint.addEventListener('click', useHint);
  el.reset.addEventListener('click', () => newCase(caseIndex));
  el.next.addEventListener('click', () => newCase(caseIndex + 1));
  addEventListener('resize', () => { clearLines(); });
  addEventListener('themechange', () => { cssVar('--ink'); clearLines(); });

  /* ============================ 启动 ============================ */
  hintClue = nextPendingClue();
  markMode = modeForClue(hintClue);
  buildStatic();
  applyTheme();
  applyLang();
})();
