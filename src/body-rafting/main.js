import * as THREE from './vendor/three.module.min.js';

(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '消化道漂流记 · KidsLab',
      back: '返回星图',
      series: '人体微缩探险 · 06',
      title: '消化道漂流记',
      codex: '航行图鉴',
      steady: '平稳镜头',
      unsteady: '恢复浪感',
      soundOn: '声音开启',
      soundOff: '声音关闭',
      nowAt: '当前河段',
      nutrients: '营养',
      stars: '任务星',
      mission: '本段任务',
      missionActive: '进行中',
      missionComplete: '已完成',
      entering: '正在进入',
      steerLeft: '向左划',
      steerRight: '向右划',
      mapMouth: '口腔',
      mapEsophagus: '食道',
      mapStomach: '胃',
      mapSmall: '小肠',
      mapLarge: '大肠',
      mapExit: '终点',
      launchKicker: 'MICRO VOYAGE · 人体航线',
      heroTitle: '缩小到一粒芝麻大，跟着一口饭出发。',
      heroCopy: '你会穿过六段消化道。完成器官任务，看看食物怎样变成身体能用的营养。',
      stepChoose: '选择同行食物',
      stepAct: '完成器官任务',
      stepSteer: '左右划艇收营养',
      chooseFood: '选择同行食物',
      chooseHint: '每一种都会触发不同知识彩蛋',
      foodRice: '米饭号',
      foodRiceTag: '淀粉先在口腔开工',
      foodCandy: '糖果号',
      foodCandyTag: '糖主要在小肠吸收',
      foodFat: '脂肪号',
      foodFatTag: '小肠入口遇见胆汁',
      foodInsightRice: '米饭里的淀粉，会先在口腔遇见唾液淀粉酶。',
      foodInsightCandy: '糖果会在嘴里溶解变甜，但糖主要到小肠才被吸收。',
      foodInsightFat: '脂肪主要在小肠消化；胆汁会把大油滴分散成小油滴。',
      start: '登艇，开始漂流',
      logComplete: '航行日志已完成',
      openCodex: '查看完整图鉴',
      restart: '换种食物再来',
      fieldNotes: 'FIELD NOTES · 航行记录',
      codexTitle: '消化道图鉴',
      codexHint: '每完成一段任务，就点亮一张器官记录。',
      locked: '完成这段航行后解锁',
      noglTitle: '这艘艇暂时下不了水',
      nogl: '浏览器没有开启 WebGL，你仍可以打开航行图鉴学习。',
      closeCodex: '关闭图鉴',
      themeAria: '切换明暗主题',
      langAria: 'Switch to English',
      codexAria: '打开消化道图鉴',
      soundMuteAria: '关闭声音',
      soundPlayAria: '开启声音',
      steadyAria: '开启平稳镜头',
      unsteadyAria: '恢复漂流镜头',

      organMouth: '口腔',
      organEsophagus: '食道',
      organStomach: '胃',
      organSmall: '小肠',
      organLarge: '大肠',
      organExit: '直肠和肛门',

      missionTitleMouth: '把食物嚼成小块',
      missionBodyMouth: '点击“咀嚼”，让牙齿和唾液一起开工。',
      missionTitleEsophagus: '跟上蠕动的节拍',
      missionBodyEsophagus: '肌肉波会自动把食物推向胃，重力不是必需的。',
      missionTitleStomach: '穿过三道胃酸浪',
      missionBodyStomach: '左右划艇避开浪头；碰到也不会结束航行。',
      missionTitleSmall: '收集十二份营养',
      missionBodySmall: '靠近营养光点，看它们穿过绒毛进入血液或淋巴。',
      missionTitleLarge: '帮助回收一部分水',
      missionBodyLarge: '点击三次，让大肠继续吸收水和一些盐分。',
      missionTitleExit: '完成最后一段航线',
      missionBodyExit: '未被吸收的残余物形成粪便，最后排出身体。',
      termMouth: '牙齿 + 唾液',
      termEsophagus: '蠕动波',
      termStomach: '胃酸 + 酶',
      termSmall: '绒毛吸收',
      termLarge: '水分回收',
      termExit: '排泄',
      clueMouth: '牙齿切碎，唾液接力',
      clueEsophagus: '肌肉收缩，把食团向前推',
      clueStomach: '搅拌、酸化，开始消化蛋白质',
      clueSmall: '营养穿过绒毛进入血液或淋巴',
      clueLarge: '回收水和盐，让残余物变浓',
      clueExit: '直肠暂存，最后排出身体',

      chewBtn: '咀嚼！',
      tapBtn: '跟拍！',
      absorbBtn: '回收水分',
      finishBtn: '冲向终点',

      toastStart: '舱门关闭，人体航线开放。抓稳船桨！',
      toastChewRice: '唾液把食物润湿，唾液淀粉酶开始分解淀粉。',
      toastChewOther: '牙齿把食物变成小块，唾液让它更容易吞咽。',
      toastRhythm: '咚——一圈肌肉收缩，把小艇向胃推进。',
      toastStomach: '进入胃！胃酸和酶开始消化蛋白质，黏液屏障帮助保护胃壁。',
      toastHit: '酸浪擦过船边！没关系，继续掌舵。',
      toastDodge: '漂亮的转向，安全穿过一道酸浪。',
      toastSmallRice: '大部分营养会在小肠被吸收，绒毛让吸收面积变得更大。',
      toastSmallCandy: '糖果在嘴里尝起来甜，但糖主要在小肠被吸收。',
      toastSmallFat: '胆汁在小肠入口把大油滴分散，消化酶更容易工作了。',
      toastCoin: '营养穿过小肠壁：多数进入血液，许多脂肪先进入淋巴。',
      toastWater: '大肠继续吸收了一部分水和盐分。',
      toastExit: '直肠暂存粪便，排便时再从肛门离开身体。',
      toastUnlocked: (organ) => `图鉴已记录：${organ}`,

      finishTitle: '全程漂流完成！',
      finishDesc: (coins, stars, food) => `你驾驶${food}穿过六段消化道，收集 ${coins} 份营养，获得 ${stars}/18 颗任务星。`,

      mouthDo: '牙齿把食物嚼成小块。唾液润湿食物，其中的唾液淀粉酶开始分解淀粉。',
      mouthFun: '看到或闻到食物时，大脑就会提醒唾液腺准备唾液。',
      esoDo: '吞咽后，食道肌肉一波波收缩。这种蠕动把食物推向胃。',
      esoFun: '站立时重力可以帮忙，但蠕动才是主要推动力。',
      stomachDo: '胃的肌肉搅拌食物；胃酸和酶在这里开始消化蛋白质。',
      stomachFun: '黏液屏障帮助胃壁抵挡胃酸和酶的伤害。',
      smallDo: '大部分营养在小肠完成消化和吸收。绒毛让吸收面积更大。',
      smallFun: '多数营养进入血液，许多脂肪消化产物会先进入淋巴。',
      largeDo: '大肠继续吸收水和一些盐分，液体残余逐渐形成粪便。',
      largeFun: '肠道细菌会处理部分剩余物质，还能制造维生素 K。',
      exitDo: '直肠暂时储存粪便，排便时由肛门排出体外。',
      exitFun: '排出的是未被消化或吸收的物质和其他废物。',
      badgeMouth: '淀粉酶',
      badgeEsophagus: '蠕动',
      badgeStomach: '胃酸＋酶',
      badgeSmall: '绒毛',
      badgeLarge: '水＋细菌',
      badgeExit: '排泄',
    },
    en: {
      doc: 'Digestive Rafting · KidsLab',
      back: 'Back to map',
      series: 'Micro Body Expedition · 06',
      title: 'Digestive Rafting',
      codex: 'Field notes',
      steady: 'Steady camera',
      unsteady: 'Bring back waves',
      soundOn: 'Sound on',
      soundOff: 'Sound off',
      nowAt: 'Current section',
      nutrients: 'Nutrients',
      stars: 'Task stars',
      mission: 'Section mission',
      missionActive: 'In progress',
      missionComplete: 'Complete',
      entering: 'Now entering',
      steerLeft: 'Paddle left',
      steerRight: 'Paddle right',
      mapMouth: 'Mouth',
      mapEsophagus: 'Esophagus',
      mapStomach: 'Stomach',
      mapSmall: 'Small intestine',
      mapLarge: 'Large intestine',
      mapExit: 'Finish',
      launchKicker: 'MICRO VOYAGE · BODY ROUTE',
      heroTitle: 'Shrink to sesame-seed size and follow one bite of food.',
      heroCopy: 'Cross six digestive sections, finish each organ mission, and discover how food becomes nutrients your body can use.',
      stepChoose: 'Choose a food',
      stepAct: 'Finish organ missions',
      stepSteer: 'Paddle for nutrients',
      chooseFood: 'Choose your travel food',
      chooseHint: 'Each one unlocks a different science moment',
      foodRice: 'Rice raft',
      foodRiceTag: 'Starch starts in the mouth',
      foodCandy: 'Candy raft',
      foodCandyTag: 'Sugar absorbs in the small intestine',
      foodFat: 'Fat raft',
      foodFatTag: 'Bile arrives in the small intestine',
      foodInsightRice: 'Salivary amylase starts working on the starch in rice inside your mouth.',
      foodInsightCandy: 'Candy dissolves and tastes sweet in your mouth, but sugar is absorbed mainly in the small intestine.',
      foodInsightFat: 'Fat is digested mainly in the small intestine, where bile separates large drops into smaller ones.',
      start: 'Board the raft',
      logComplete: 'Voyage log complete',
      openCodex: 'Open all field notes',
      restart: 'Try another food',
      fieldNotes: 'FIELD NOTES · VOYAGE LOG',
      codexTitle: 'Digestive Field Notes',
      codexHint: 'Complete each mission to reveal an organ card.',
      locked: 'Complete this section to unlock',
      noglTitle: 'This raft cannot launch yet',
      nogl: 'WebGL is unavailable, but you can still open the field notes and learn.',
      closeCodex: 'Close field notes',
      themeAria: 'Toggle color theme',
      langAria: '切换到中文',
      codexAria: 'Open digestive field notes',
      soundMuteAria: 'Turn sound off',
      soundPlayAria: 'Turn sound on',
      steadyAria: 'Turn steady camera on',
      unsteadyAria: 'Restore rafting camera',

      organMouth: 'Mouth',
      organEsophagus: 'Esophagus',
      organStomach: 'Stomach',
      organSmall: 'Small intestine',
      organLarge: 'Large intestine',
      organExit: 'Rectum & anus',

      missionTitleMouth: 'Chew the food into small pieces',
      missionBodyMouth: 'Tap “Chew” so teeth and saliva can get to work.',
      missionTitleEsophagus: 'Follow the peristalsis beat',
      missionBodyEsophagus: 'Muscle waves push food toward the stomach; gravity is not required.',
      missionTitleStomach: 'Cross three acid waves',
      missionBodyStomach: 'Paddle left and right. A splash will not end the voyage.',
      missionTitleSmall: 'Collect twelve nutrients',
      missionBodySmall: 'Meet each glow and watch nutrients cross the villi into blood or lymph.',
      missionTitleLarge: 'Help recover some water',
      missionBodyLarge: 'Tap three times as the large intestine continues absorbing water and salts.',
      missionTitleExit: 'Finish the final section',
      missionBodyExit: 'Unabsorbed leftovers become stool and eventually leave the body.',
      termMouth: 'Teeth + saliva',
      termEsophagus: 'Peristalsis',
      termStomach: 'Acid + enzymes',
      termSmall: 'Villi absorption',
      termLarge: 'Water recovery',
      termExit: 'Elimination',
      clueMouth: 'Teeth break it down; saliva joins in',
      clueEsophagus: 'Muscle waves push the food onward',
      clueStomach: 'Mix, acidify, and begin protein digestion',
      clueSmall: 'Nutrients cross villi into blood or lymph',
      clueLarge: 'Recover water and salts from the leftovers',
      clueExit: 'The rectum stores stool before it leaves',

      chewBtn: 'Chew!',
      tapBtn: 'Tap the beat!',
      absorbBtn: 'Recover water',
      finishBtn: 'Finish the route',

      toastStart: 'Hatch closed. The body route is open—hold your paddle!',
      toastChewRice: 'Saliva moistens the food, and salivary amylase starts breaking down starch.',
      toastChewOther: 'Teeth make smaller pieces, and saliva makes the food easier to swallow.',
      toastRhythm: 'Thump—a ring of muscle contracts and pushes the raft toward the stomach.',
      toastStomach: 'Inside the stomach! Acid and enzymes begin digesting protein while a mucus barrier helps protect the lining.',
      toastHit: 'An acid wave brushed the raft. Keep steering!',
      toastDodge: 'Great turn—one acid wave safely crossed.',
      toastSmallRice: 'Most nutrients are absorbed in the small intestine, where villi create more surface area.',
      toastSmallCandy: 'Candy tastes sweet in your mouth, but its sugar is absorbed mainly in the small intestine.',
      toastSmallFat: 'Bile separates large fat drops here, making it easier for digestive enzymes to work.',
      toastCoin: 'Nutrients cross the small-intestine wall: most enter blood, while many digested fats enter lymph first.',
      toastWater: 'The large intestine continued absorbing some water and salts.',
      toastExit: 'The rectum stores stool until it leaves the body through the anus.',
      toastUnlocked: (organ) => `Field note recorded: ${organ}`,

      finishTitle: 'Digestive voyage complete!',
      finishDesc: (coins, stars, food) => `Your ${food} crossed all six sections, collected ${coins} nutrients, and earned ${stars}/18 task stars.`,

      mouthDo: 'Teeth break food into small pieces. Saliva moistens it, and salivary amylase starts breaking down starch.',
      mouthFun: 'Seeing or smelling food can signal your salivary glands to get saliva ready.',
      esoDo: 'After swallowing, waves of muscle contraction called peristalsis push food toward the stomach.',
      esoFun: 'Gravity can help while you stand, but peristalsis is the main pushing force.',
      stomachDo: 'Stomach muscles mix food while acid and enzymes begin digesting protein.',
      stomachFun: 'A mucus barrier helps protect the stomach lining from acid and enzymes.',
      smallDo: 'Most nutrient digestion and absorption happens in the small intestine. Villi add surface area.',
      smallFun: 'Most nutrients enter blood, while many digested fats enter lymph first.',
      largeDo: 'The large intestine continues absorbing water and some salts as liquid waste becomes stool.',
      largeFun: 'Gut bacteria process some leftovers and can make vitamin K.',
      exitDo: 'The rectum stores stool until it leaves through the anus during a bowel movement.',
      exitFun: 'Stool contains unabsorbed material and other waste.',
      badgeMouth: 'Amylase',
      badgeEsophagus: 'Peristalsis',
      badgeStomach: 'Acid + enzymes',
      badgeSmall: 'Villi',
      badgeLarge: 'Water + bacteria',
      badgeExit: 'Elimination',
    },
  };

  const FOOD = {
    rice: {
      icon: '🍚',
      name: 'foodRice',
      insight: 'foodInsightRice',
      color: 0xffe9b0,
      accent: 0xffc35c,
      scale: [1, 0.82, 1],
    },
    candy: {
      icon: '🍬',
      name: 'foodCandy',
      insight: 'foodInsightCandy',
      color: 0xff5aa9,
      accent: 0x63e6dd,
      scale: [0.82, 0.82, 0.82],
    },
    fat: {
      icon: '🥑',
      name: 'foodFat',
      insight: 'foodInsightFat',
      color: 0x9acb55,
      accent: 0xe9d247,
      scale: [1.05, 0.82, 0.86],
    },
  };

  const SECTIONS = [
    {
      id: 'mouth',
      icon: '🦷',
      start: 0,
      end: 0.155,
      organ: 'organMouth',
      title: 'missionTitleMouth',
      body: 'missionBodyMouth',
      action: 'chewBtn',
      actionIcon: '🦷',
      term: 'termMouth',
      clue: 'clueMouth',
      target: 10,
      color: '--gut-mouth',
    },
    {
      id: 'esophagus',
      icon: '〰',
      start: 0.155,
      end: 0.315,
      organ: 'organEsophagus',
      title: 'missionTitleEsophagus',
      body: 'missionBodyEsophagus',
      action: 'tapBtn',
      actionIcon: '●',
      term: 'termEsophagus',
      clue: 'clueEsophagus',
      target: 4,
      color: '--gut-esophagus',
    },
    {
      id: 'stomach',
      icon: '◉',
      start: 0.315,
      end: 0.5,
      organ: 'organStomach',
      title: 'missionTitleStomach',
      body: 'missionBodyStomach',
      term: 'termStomach',
      clue: 'clueStomach',
      target: 3,
      canSteer: true,
      color: '--gut-stomach',
    },
    {
      id: 'small',
      icon: '✣',
      start: 0.5,
      end: 0.785,
      organ: 'organSmall',
      title: 'missionTitleSmall',
      body: 'missionBodySmall',
      term: 'termSmall',
      clue: 'clueSmall',
      target: 12,
      canSteer: true,
      color: '--gut-small',
    },
    {
      id: 'large',
      icon: '◌',
      start: 0.785,
      end: 0.93,
      organ: 'organLarge',
      title: 'missionTitleLarge',
      body: 'missionBodyLarge',
      action: 'absorbBtn',
      actionIcon: '💧',
      term: 'termLarge',
      clue: 'clueLarge',
      target: 3,
      color: '--gut-large',
    },
    {
      id: 'exit',
      icon: '✓',
      start: 0.93,
      end: 1,
      organ: 'organExit',
      title: 'missionTitleExit',
      body: 'missionBodyExit',
      action: 'finishBtn',
      actionIcon: '→',
      term: 'termExit',
      clue: 'clueExit',
      target: 1,
      color: '--gut-exit',
    },
  ];

  const CODEX = [
    { id: 'mouth', icon: '🦷', title: 'organMouth', do: 'mouthDo', fun: 'mouthFun', badge: 'badgeMouth' },
    { id: 'esophagus', icon: '〰', title: 'organEsophagus', do: 'esoDo', fun: 'esoFun', badge: 'badgeEsophagus' },
    { id: 'stomach', icon: '◉', title: 'organStomach', do: 'stomachDo', fun: 'stomachFun', badge: 'badgeStomach' },
    { id: 'small', icon: '✣', title: 'organSmall', do: 'smallDo', fun: 'smallFun', badge: 'badgeSmall' },
    { id: 'large', icon: '◌', title: 'organLarge', do: 'largeDo', fun: 'largeFun', badge: 'badgeLarge' },
    { id: 'exit', icon: '✓', title: 'organExit', do: 'exitDo', fun: 'exitFun', badge: 'badgeExit' },
  ];

  const $ = (selector) => document.querySelector(selector);
  const byId = (id) => document.getElementById(id);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (start, end, amount) => start + (end - start) * amount;
  const cssColor = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  const canvas = byId('scene');
  const playCard = byId('playCard');
  const launch = byId('launch');
  const startBtn = byId('startBtn');
  const actionBtn = byId('actionBtn');
  const actionIcon = byId('actionIcon');
  const actionLabel = actionBtn.querySelector('span:last-child');
  const restartBtn = byId('restartBtn');
  const steadyBtn = byId('steadyBtn');
  const soundBtn = byId('soundBtn');
  const soundIcon = byId('soundIcon');
  const soundLabel = byId('soundLabel');
  const themeBtn = byId('themeBtn');
  const langBtn = byId('langBtn');
  const organName = byId('organName');
  const sectionIndex = byId('sectionIndex');
  const missionTitle = byId('missionTitle');
  const missionText = byId('missionText');
  const missionValue = byId('missionValue');
  const missionFill = byId('missionFill');
  const missionBadge = byId('missionBadge');
  const missionStatus = byId('missionStatus');
  const missionPanel = byId('missionPanel');
  const coinCount = byId('coinCount');
  const starCount = byId('starCount');
  const routeFill = byId('routeFill');
  const routeStops = [...document.querySelectorAll('.route-map__stop')];
  const foodButtons = [...document.querySelectorAll('.food')];
  const foodInsight = byId('foodInsight');
  const toastEl = byId('toast');
  const chapterReveal = byId('chapterReveal');
  const chapterCount = byId('chapterCount');
  const chapterIcon = byId('chapterIcon');
  const chapterName = byId('chapterName');
  const chapterClue = byId('chapterClue');
  const labelsEl = byId('labels');
  const finish = byId('finish');
  const finishTitle = byId('finishTitle');
  const finishDesc = byId('finishDesc');
  const codexBtn = byId('codexBtn');
  const codexCount = byId('codexCount');
  const codexCards = byId('codexCards');
  const drawerLayer = byId('drawerLayer');
  const drawerScrim = byId('drawerScrim');
  const codexClose = byId('codexClose');
  const finishCodexBtn = byId('finishCodexBtn');
  const steerLeft = byId('steerLeft');
  const steerRight = byId('steerRight');
  const noGl = byId('nogl');

  const cool = window.cool;
  let lang = cool?.preferences?.lang || (document.documentElement.lang.startsWith('zh') ? 'zh' : 'en');
  let theme = cool?.preferences?.theme || document.documentElement.dataset.theme || 'dark';
  let world = null;
  let randomSeed = 0x5f3759df;
  let codexReturnFocus = codexBtn;
  let chapterStartTimer = 0;
  let chapterHideTimer = 0;
  let sectionToastTimer = 0;

  const savedSound = (() => {
    try {
      return localStorage.getItem('kidslab.bodyRafting.sound');
    } catch {
      return null;
    }
  })();

  const state = {
    started: false,
    done: false,
    food: 'rice',
    t: 0,
    displayT: 0,
    speed: 0,
    lateral: 0,
    targetLateral: 0,
    dragging: false,
    pointerId: null,
    steady: false,
    soundOn: savedSound !== 'off',
    chew: 0,
    rhythm: 0,
    wavesPassed: 0,
    dodged: 0,
    hits: 0,
    absorbed: 0,
    coins: 0,
    stars: 0,
    activeSection: 0,
    waterLevel: 1,
    pulse: 0,
    lastTime: 0,
    magicShown: false,
    unlocked: new Set(),
    sectionScores: new Map(),
  };

  const t = (key, ...args) => {
    const value = I18N[lang]?.[key] ?? I18N.zh[key] ?? key;
    return typeof value === 'function' ? value(...args) : value;
  };

  function seededRandom() {
    randomSeed = (Math.imul(randomSeed, 1664525) + 1013904223) >>> 0;
    return randomSeed / 4294967296;
  }

  function sectionAt(value) {
    return SECTIONS.find((section) => value >= section.start && value < section.end)
      || SECTIONS[SECTIONS.length - 1];
  }

  function sectionIndexAt(value) {
    const index = SECTIONS.findIndex((section) => value >= section.start && value < section.end);
    return index < 0 ? SECTIONS.length - 1 : index;
  }

  function sectionProgress(section) {
    return clamp((state.t - section.start) / (section.end - section.start), 0, 1);
  }

  function missionProgress(section) {
    if (section.id === 'mouth') return state.chew / section.target;
    if (section.id === 'esophagus') return state.rhythm / section.target;
    if (section.id === 'stomach') return state.wavesPassed / section.target;
    if (section.id === 'small') return state.coins / section.target;
    if (section.id === 'large') return state.absorbed / section.target;
    return state.done ? 1 : sectionProgress(section);
  }

  function missionCounter(section) {
    if (section.id === 'mouth') return `${state.chew}/${section.target}`;
    if (section.id === 'esophagus') return `${state.rhythm}/${section.target}`;
    if (section.id === 'stomach') return `${state.wavesPassed}/${section.target}`;
    if (section.id === 'small') return `${Math.min(state.coins, section.target)}/${section.target}`;
    if (section.id === 'large') return `${state.absorbed}/${section.target}`;
    return state.done ? '1/1' : '0/1';
  }

  function applyLanguage() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = t('doc');
    document.querySelectorAll('[data-t]').forEach((element) => {
      const value = I18N[lang]?.[element.dataset.t];
      if (typeof value === 'string') element.textContent = value;
    });
    langBtn.textContent = lang === 'zh' ? 'EN' : '中';
    langBtn.setAttribute('aria-label', t('langAria'));
    themeBtn.setAttribute('aria-label', t('themeAria'));
    codexBtn.setAttribute('aria-label', t('codexAria'));
    codexClose.setAttribute('aria-label', t('closeCodex'));
    drawerScrim.setAttribute('aria-label', t('closeCodex'));
    steerLeft.setAttribute('aria-label', t('steerLeft'));
    steerRight.setAttribute('aria-label', t('steerRight'));
    world?.labels?.forEach((label) => {
      label.element.textContent = t(label.section.organ);
    });
    const currentSection = SECTIONS[state.activeSection] || SECTIONS[0];
    chapterName.textContent = t(currentSection.organ);
    chapterClue.textContent = t(currentSection.clue);
    renderUI();
    renderCodex();
  }

  function applyTheme() {
    document.documentElement.dataset.theme = theme;
    themeBtn.textContent = theme === 'dark' ? '☀' : '☾';
    if (world) {
      updateSceneTheme();
      updateOrganicColors();
    }
  }

  function setPreference(kind, value) {
    if (cool?.preferences) {
      if (kind === 'lang') cool.preferences.setLang(value);
      else cool.preferences.setTheme(value);
      return;
    }
    try {
      localStorage.setItem(`kidslab.${kind}`, value);
    } catch {}
    if (kind === 'lang') {
      lang = value;
      applyLanguage();
    } else {
      theme = value;
      applyTheme();
    }
  }

  const stopPreferences = cool?.preferences?.subscribe(({ kind, value }) => {
    if (kind === 'lang') {
      lang = value;
      applyLanguage();
    } else if (kind === 'theme') {
      theme = value;
      applyTheme();
    }
  });

  themeBtn.addEventListener('click', () => setPreference('theme', theme === 'dark' ? 'light' : 'dark'));
  langBtn.addEventListener('click', () => setPreference('lang', lang === 'zh' ? 'en' : 'zh'));
  window.addEventListener('beforeunload', () => stopPreferences?.(), { once: true });

  function openCodex(event) {
    if (event?.currentTarget instanceof HTMLElement) codexReturnFocus = event.currentTarget;
    drawerLayer.hidden = false;
    codexBtn.setAttribute('aria-expanded', 'true');
    renderCodex();
    codexClose.focus();
    cool?.track?.('open-field-notes');
  }

  function closeCodex() {
    if (drawerLayer.hidden) return;
    drawerLayer.hidden = true;
    codexBtn.setAttribute('aria-expanded', 'false');
    codexReturnFocus?.focus();
  }

  function dismissChapter(immediate = false) {
    window.clearTimeout(chapterStartTimer);
    window.clearTimeout(chapterHideTimer);
    chapterReveal.classList.remove('is-visible');
    if (immediate) {
      chapterReveal.hidden = true;
      return;
    }
    chapterHideTimer = window.setTimeout(() => {
      chapterReveal.hidden = true;
    }, 320);
  }

  function showChapter(section, delay = 0) {
    dismissChapter(true);
    chapterStartTimer = window.setTimeout(() => {
      const index = SECTIONS.indexOf(section);
      chapterCount.textContent = `${String(index + 1).padStart(2, '0')} / ${String(SECTIONS.length).padStart(2, '0')}`;
      chapterIcon.textContent = section.icon;
      chapterName.textContent = t(section.organ);
      chapterClue.textContent = t(section.clue);
      chapterReveal.hidden = false;
      requestAnimationFrame(() => chapterReveal.classList.add('is-visible'));
      chapterHideTimer = window.setTimeout(() => dismissChapter(), 1450);
    }, delay);
  }

  function pulseActionFeedback() {
    actionBtn.classList.remove('is-reacting');
    missionPanel.classList.remove('is-reacting');
    void actionBtn.offsetWidth;
    actionBtn.classList.add('is-reacting');
    missionPanel.classList.add('is-reacting');
    window.setTimeout(() => {
      actionBtn.classList.remove('is-reacting');
      missionPanel.classList.remove('is-reacting');
    }, 260);
  }

  codexBtn.addEventListener('click', openCodex);
  finishCodexBtn.addEventListener('click', openCodex);
  codexClose.addEventListener('click', closeCodex);
  drawerScrim.addEventListener('click', closeCodex);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !drawerLayer.hidden) closeCodex();
  });

  foodButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (state.started) return;
      state.food = button.dataset.food;
      foodButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      updateFoodLook();
      renderUI();
      ensureAudio();
      sfx.select();
      cool?.track?.(`choose-${state.food}`);
    });
  });

  startBtn.addEventListener('click', beginRun);
  restartBtn.addEventListener('click', showLaunch);
  actionBtn.addEventListener('click', handleAction);

  steadyBtn.addEventListener('click', () => {
    state.steady = !state.steady;
    renderUI();
    cool?.track?.(state.steady ? 'steady-camera' : 'wave-camera');
  });

  soundBtn.addEventListener('click', () => {
    state.soundOn = !state.soundOn;
    try {
      localStorage.setItem('kidslab.bodyRafting.sound', state.soundOn ? 'on' : 'off');
    } catch {}
    if (state.soundOn) ensureAudio();
    updateAmbientSound();
    renderUI();
  });

  function bindSteerButton(button, direction) {
    button.addEventListener('pointerdown', (event) => {
      if (!state.started) return;
      ensureAudio();
      button.setPointerCapture(event.pointerId);
      state.targetLateral = direction;
      button.classList.add('is-active');
    });
    const release = () => {
      state.targetLateral = 0;
      button.classList.remove('is-active');
    };
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('lostpointercapture', release);
  }

  bindSteerButton(steerLeft, -1);
  bindSteerButton(steerRight, 1);

  canvas.addEventListener('pointerdown', (event) => {
    if (!state.started || !SECTIONS[state.activeSection].canSteer) return;
    ensureAudio();
    canvas.setPointerCapture(event.pointerId);
    state.pointerId = event.pointerId;
    state.dragging = true;
    setControlFromPointer(event, true);
  });

  canvas.addEventListener('pointermove', (event) => {
    if (!state.dragging || event.pointerId !== state.pointerId) return;
    setControlFromPointer(event, false);
  });

  const stopCanvasSteer = (event) => {
    if (event?.pointerId != null && event.pointerId !== state.pointerId) return;
    state.dragging = false;
    state.pointerId = null;
    state.targetLateral = 0;
  };
  canvas.addEventListener('pointerup', stopCanvasSteer);
  canvas.addEventListener('pointercancel', stopCanvasSteer);
  canvas.addEventListener('lostpointercapture', stopCanvasSteer);

  window.addEventListener('keydown', (event) => {
    if (!state.started || event.repeat) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      state.targetLateral = event.key === 'ArrowLeft' ? -1 : 1;
    }
    if ((event.key === ' ' || event.key === 'Enter') && !actionBtn.hidden && !actionBtn.disabled) {
      event.preventDefault();
      actionBtn.click();
    }
  });

  window.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') state.targetLateral = 0;
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (waterGain && audioContext) waterGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.04);
    } else {
      state.lastTime = performance.now();
      updateAmbientSound();
    }
  });

  let audioContext = null;
  let waterGain = null;
  let waterSource = null;

  function ensureAudio() {
    if (!state.soundOn) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      audioContext ||= new AudioContextClass();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
      if (!waterSource) {
        const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
        const samples = buffer.getChannelData(0);
        for (let index = 0; index < samples.length; index += 1) {
          samples[index] = (Math.random() * 2 - 1) * 0.2;
        }
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 820;
        waterGain = audioContext.createGain();
        waterGain.gain.value = 0;
        waterSource = audioContext.createBufferSource();
        waterSource.buffer = buffer;
        waterSource.loop = true;
        waterSource.connect(filter).connect(waterGain).connect(audioContext.destination);
        waterSource.start();
      }
      updateAmbientSound();
    } catch {}
  }

  function updateAmbientSound() {
    if (!waterGain || !audioContext) return;
    const target = state.soundOn && state.started && !document.hidden ? 0.018 + state.speed * 0.45 : 0;
    waterGain.gain.cancelScheduledValues(audioContext.currentTime);
    waterGain.gain.setTargetAtTime(target, audioContext.currentTime, 0.06);
  }

  function tone(frequency, duration = 0.12, type = 'sine', gain = 0.08, delay = 0) {
    if (!state.soundOn) return;
    ensureAudio();
    if (!audioContext) return;
    const at = audioContext.currentTime + delay;
    const oscillator = audioContext.createOscillator();
    const envelope = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, at);
    envelope.gain.setValueAtTime(Math.max(0.001, gain), at);
    envelope.gain.exponentialRampToValueAtTime(0.001, at + duration);
    oscillator.connect(envelope).connect(audioContext.destination);
    oscillator.start(at);
    oscillator.stop(at + duration + 0.04);
  }

  const sfx = {
    select: () => {
      tone(420, 0.07, 'sine', 0.05);
      tone(630, 0.09, 'triangle', 0.04, 0.045);
    },
    chew: () => {
      tone(150, 0.05, 'square', 0.045);
      tone(310, 0.08, 'triangle', 0.04, 0.035);
    },
    beat: () => tone(118, 0.15, 'sine', 0.11),
    dodge: () => {
      tone(420, 0.08, 'triangle', 0.05);
      tone(650, 0.1, 'triangle', 0.06, 0.05);
    },
    hit: () => tone(84, 0.32, 'sawtooth', 0.055),
    coin: () => [690, 920, 1240].forEach((frequency, index) => tone(frequency, 0.075, 'triangle', 0.055, index * 0.035)),
    water: () => [380, 560, 730].forEach((frequency, index) => tone(frequency, 0.11, 'sine', 0.055, index * 0.045)),
    unlock: () => [520, 660, 880].forEach((frequency, index) => tone(frequency, 0.12, 'triangle', 0.06, index * 0.06)),
    finish: () => [523, 659, 784, 1047, 1318].forEach((frequency, index) => tone(frequency, 0.18, 'triangle', 0.075, index * 0.085)),
  };

  function beginRun() {
    if (!world) return;
    ensureAudio();
    resetRun();
    state.started = true;
    playCard.classList.remove('is-idle');
    playCard.classList.add('is-running');
    launch.classList.add('is-leaving');
    window.setTimeout(() => {
      if (state.started) launch.hidden = true;
    }, 430);
    cool?.stage?.('mouth');
    cool?.track?.('launch-voyage');
    showChapter(SECTIONS[0], 360);
    renderUI();
  }

  function showLaunch() {
    window.clearTimeout(sectionToastTimer);
    dismissChapter(true);
    toastEl.hidden = true;
    finish.hidden = true;
    resetRun();
    playCard.classList.add('is-idle');
    playCard.classList.remove('is-running', 'can-steer');
    launch.hidden = false;
    launch.classList.remove('is-leaving');
    renderUI();
  }

  function resetRun() {
    window.clearTimeout(sectionToastTimer);
    dismissChapter(true);
    Object.assign(state, {
      started: false,
      done: false,
      t: 0,
      displayT: 0,
      speed: 0,
      lateral: 0,
      targetLateral: 0,
      dragging: false,
      pointerId: null,
      chew: 0,
      rhythm: 0,
      wavesPassed: 0,
      dodged: 0,
      hits: 0,
      absorbed: 0,
      coins: 0,
      stars: 0,
      activeSection: 0,
      waterLevel: 1,
      pulse: 0,
      magicShown: false,
    });
    state.unlocked = new Set();
    state.sectionScores = new Map();
    if (world) {
      world.waves.items.forEach((wave) => {
        wave.done = false;
        wave.hit = false;
        wave.mesh.visible = true;
      });
      world.coins.items.forEach((coin) => {
        coin.collected = false;
        coin.flying = 0;
        coin.mesh.visible = true;
        coin.mesh.scale.setScalar(1);
      });
      world.bursts.reset();
      world.saliva.points.visible = false;
      world.foodCargo.scale.set(1, 1, 1);
      updateFoodLook();
    }
    updateAmbientSound();
    renderUI();
  }

  function handleAction() {
    if (!state.started || state.done) return;
    ensureAudio();
    pulseActionFeedback();
    const section = SECTIONS[state.activeSection];
    if (section.id === 'mouth') chew();
    else if (section.id === 'esophagus') rhythmTap();
    else if (section.id === 'large') absorbWater();
    else if (section.id === 'exit') finishRun();
  }

  function chew() {
    const target = SECTIONS[0].target;
    if (state.chew >= target) return;
    state.chew += 1;
    state.pulse = 1;
    sfx.chew();
    if (world) {
      const scale = lerp(1, 0.54, state.chew / target);
      world.foodCargo.scale.setScalar(scale);
    }
    if (state.chew === target) {
      awardSection('mouth', 3);
      world.saliva.points.visible = true;
      toast(t(state.food === 'rice' ? 'toastChewRice' : 'toastChewOther'), 2200);
      cool?.track?.('finish-chewing');
    }
    renderUI();
  }

  function rhythmTap() {
    const target = SECTIONS[1].target;
    if (state.rhythm >= target) return;
    state.rhythm += 1;
    state.speed += 0.006;
    state.pulse = 1;
    sfx.beat();
    if (state.rhythm < target) toast(t('toastRhythm'), 650);
    if (state.rhythm === target) {
      awardSection('esophagus', 3);
      cool?.track?.('finish-peristalsis');
    }
    renderUI();
  }

  function absorbWater() {
    const target = SECTIONS[4].target;
    if (state.absorbed >= target) return;
    state.absorbed += 1;
    state.waterLevel = 1 - state.absorbed * 0.16;
    sfx.water();
    toast(t('toastWater'), 950);
    if (state.absorbed === target) {
      awardSection('large', 3);
      cool?.track?.('finish-water-recovery');
    }
    renderUI();
  }

  function awardSection(id, score) {
    if (state.unlocked.has(id)) return;
    const section = SECTIONS.find((item) => item.id === id);
    state.unlocked.add(id);
    state.sectionScores.set(id, score);
    state.stars = [...state.sectionScores.values()].reduce((sum, value) => sum + value, 0);
    playCard.classList.remove('is-awarded');
    void playCard.offsetWidth;
    playCard.classList.add('is-awarded');
    window.setTimeout(() => playCard.classList.remove('is-awarded'), 720);
    sfx.unlock();
    if (id !== 'exit') toast(t('toastUnlocked', t(section.organ)), 950);
    renderCodex();
    renderUI();
  }

  function fallbackScore(section) {
    if (section.id === 'stomach') return state.hits === 0 && state.wavesPassed === section.target ? 3 : 2;
    if (section.id === 'small') return state.coins >= 8 ? 2 : 1;
    return 1;
  }

  function checkSectionTransitions() {
    const nextIndex = sectionIndexAt(state.t);
    if (nextIndex === state.activeSection) return;
    const previous = SECTIONS[state.activeSection];
    if (previous && !state.unlocked.has(previous.id)) awardSection(previous.id, fallbackScore(previous));
    state.activeSection = nextIndex;
    const current = SECTIONS[nextIndex];
    cool?.stage?.(current.id);
    cool?.track?.(`reach-${current.id}`);
    showChapter(current);
    window.clearTimeout(sectionToastTimer);
    sectionToastTimer = window.setTimeout(() => {
      if (state.activeSection !== nextIndex) return;
      if (current.id === 'stomach') toast(t('toastStomach'), 2500);
      if (current.id === 'small') {
        const moment = state.food === 'rice'
          ? 'toastSmallRice'
          : state.food === 'candy' ? 'toastSmallCandy' : 'toastSmallFat';
        toast(t(moment), 2600);
        state.magicShown = true;
      }
      if (current.id === 'exit') toast(t('toastExit'), 2200);
    }, 1550);
    renderUI();
  }

  function finishRun() {
    if (state.done) return;
    window.clearTimeout(sectionToastTimer);
    dismissChapter(true);
    toastEl.hidden = true;
    const previous = SECTIONS[state.activeSection];
    if (previous.id !== 'exit' && !state.unlocked.has(previous.id)) {
      awardSection(previous.id, fallbackScore(previous));
    }
    state.done = true;
    state.started = false;
    state.t = 1;
    awardSection('exit', 3);
    updateAmbientSound();
    sfx.finish();
    cool?.complete?.();
    cool?.track?.('complete-voyage');
    window.setTimeout(() => {
      finishTitle.textContent = t('finishTitle');
      finishDesc.textContent = t(
        'finishDesc',
        state.coins,
        state.stars,
        `${FOOD[state.food].icon} ${t(FOOD[state.food].name)}`,
      );
      finish.hidden = false;
      restartBtn.focus();
    }, 500);
    renderUI();
  }

  function baseSpeed() {
    const section = SECTIONS[state.activeSection];
    if (section.id === 'mouth') {
      return state.chew >= section.target ? 0.028 : 0.0018 + state.chew / section.target * 0.008;
    }
    if (section.id === 'esophagus') {
      return state.rhythm >= section.target
        ? 0.028
        : 0.0035 + state.rhythm / section.target * 0.008;
    }
    if (section.id === 'stomach') return 0.026;
    if (section.id === 'small') return 0.034;
    if (section.id === 'large') {
      return state.absorbed >= section.target ? 0.026 : 0.0035 + state.absorbed * 0.003;
    }
    return 0.018;
  }

  function updateTasks() {
    for (const wave of world.waves.items) {
      if (wave.done || state.t < wave.t) continue;
      wave.done = true;
      wave.mesh.visible = false;
      state.wavesPassed += 1;
      if (Math.abs(state.lateral - wave.lane) < 0.48) {
        wave.hit = true;
        state.hits += 1;
        sfx.hit();
        world.bursts.spawn(world.raft.position, 0xaaff62, 18);
        toast(t('toastHit'), 800);
      } else {
        state.dodged += 1;
        sfx.dodge();
        toast(t('toastDodge'), 700);
      }
      if (state.wavesPassed === SECTIONS[2].target) {
        awardSection('stomach', state.hits === 0 ? 3 : 2);
      }
      renderUI();
    }

    for (const coin of world.coins.items) {
      if (coin.collected) continue;
      const closeAlongRoute = Math.abs(state.t - coin.t) < 0.012;
      const closeAcrossRiver = Math.abs(state.lateral - coin.lane) < 0.28;
      if (!closeAlongRoute || !closeAcrossRiver) continue;
      coin.collected = true;
      coin.flying = 1;
      state.coins += 1;
      sfx.coin();
      world.bursts.spawn(coin.mesh.position, state.food === 'fat' ? 0xf4e34f : 0xff80bd, 14);
      if (state.coins === 1) toast(t('toastCoin'), 2200);
      if (state.coins >= SECTIONS[3].target) {
        awardSection('small', 3);
        cool?.track?.('collect-nutrients');
      }
      renderUI();
    }
  }

  function renderUI() {
    const section = SECTIONS[state.activeSection] || SECTIONS[0];
    const progress = clamp(missionProgress(section), 0, 1);
    organName.textContent = t(section.organ);
    sectionIndex.textContent = `${state.activeSection + 1} / ${SECTIONS.length}`;
    missionTitle.textContent = t(section.title);
    missionText.textContent = t(section.body);
    missionBadge.textContent = t(section.term);
    missionValue.textContent = missionCounter(section);
    missionFill.style.transform = `scaleX(${progress})`;
    missionStatus.textContent = t(progress >= 1 ? 'missionComplete' : 'missionActive');
    routeFill.style.transform = `scaleX(${clamp(state.t, 0, 1)})`;
    coinCount.textContent = state.coins;
    starCount.textContent = state.stars;
    codexCount.textContent = `${state.unlocked.size}/6`;
    foodInsight.textContent = t(FOOD[state.food].insight);

    const directAction = Boolean(section.action) && state.started;
    actionBtn.hidden = !directAction;
    actionBtn.disabled = directAction && progress >= 1 && section.id !== 'exit';
    actionBtn.classList.toggle('is-complete', progress >= 1);
    actionBtn.style.setProperty('--mission-progress', progress);
    actionIcon.textContent = section.actionIcon || '→';
    if (section.action) actionLabel.textContent = t(section.action);

    playCard.classList.toggle('can-steer', Boolean(section.canSteer && state.started));
    playCard.dataset.section = section.id;
    playCard.dataset.started = String(state.started);
    playCard.dataset.food = state.food;
    playCard.dataset.mission = progress >= 1 ? 'complete' : 'active';
    playCard.style.setProperty('--stage-accent', cssColor(section.color));

    routeStops.forEach((stop, index) => {
      stop.classList.toggle('is-active', index === state.activeSection);
      stop.classList.toggle('is-done', state.unlocked.has(SECTIONS[index].id));
      if (index === state.activeSection) stop.setAttribute('aria-current', 'step');
      else stop.removeAttribute('aria-current');
    });

    steadyBtn.setAttribute('aria-pressed', String(state.steady));
    steadyBtn.setAttribute('aria-label', t(state.steady ? 'unsteadyAria' : 'steadyAria'));
    steadyBtn.querySelector('span:last-child').textContent = t(state.steady ? 'unsteady' : 'steady');

    const muted = !state.soundOn;
    soundBtn.setAttribute('aria-pressed', String(muted));
    soundBtn.setAttribute('aria-label', t(muted ? 'soundPlayAria' : 'soundMuteAria'));
    soundIcon.textContent = muted ? '×' : '♪';
    soundLabel.textContent = t(muted ? 'soundOff' : 'soundOn');
  }

  function renderCodex() {
    codexCards.replaceChildren();
    for (const card of CODEX) {
      const unlocked = state.unlocked.has(card.id);
      const article = document.createElement('article');
      article.className = `codex-card ${unlocked ? 'is-unlocked' : 'is-locked'}`;

      const top = document.createElement('div');
      top.className = 'codex-card__top';
      const icon = document.createElement('span');
      icon.className = 'codex-card__icon';
      icon.textContent = card.icon;
      const badge = document.createElement('span');
      badge.className = 'codex-card__badge';
      badge.textContent = unlocked ? t(card.badge) : '•••';
      top.append(icon, badge);

      const heading = document.createElement('h3');
      heading.textContent = unlocked ? t(card.title) : '???';
      const first = document.createElement('p');
      first.textContent = unlocked ? t(card.do) : t('locked');
      article.append(top, heading, first);

      if (unlocked) {
        const second = document.createElement('p');
        second.textContent = t(card.fun);
        article.append(second);
      }
      codexCards.append(article);
    }
    codexCount.textContent = `${state.unlocked.size}/6`;
  }

  function toast(message, duration = 1200) {
    toastEl.textContent = message;
    toastEl.hidden = false;
    window.clearTimeout(toastEl._timer);
    toastEl._timer = window.setTimeout(() => {
      toastEl.hidden = true;
    }, duration);
  }

  function setControlFromPointer(event, initial) {
    const bounds = canvas.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    state.targetLateral = initial
      ? (x < 0.5 ? -1 : 1)
      : clamp((x - 0.5) * 2.35, -1, 1);
  }

  function updateFoodLook() {
    if (!world) return;
    const food = FOOD[state.food];
    world.foodCargo.material.color.setHex(food.color);
    world.foodCargo.material.emissive.setHex(food.accent);
    world.foodCargo.scale.set(...food.scale);
    world.kayakAccent.material.color.setHex(food.accent);
  }

  function initWorld() {
    const mobile = matchMedia('(max-width: 700px)').matches;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const compactGraphics = mobile || (navigator.hardwareConcurrency || 8) <= 4;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = !compactGraphics;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(mobile ? 68 : 62, 1, 0.06, 260);
    const root = new THREE.Group();
    scene.add(root);

    const points = [
      [-7, 2, 0], [-4, 1.2, -7], [1, 0.3, -12], [5, -2.5, -16],
      [2, -7, -21], [-5, -9, -27], [-10, -6.5, -32], [-6, -2, -38],
      [1, -4, -43], [8, -6, -49], [11, -2, -57], [3, 1.5, -64],
      [-6, 0, -72], [-8, -3.2, -81], [0, -5, -90], [9, -2, -99],
      [5, 3.5, -110], [-5, 2, -120], [-12, -2.5, -131], [-7, -7, -142],
      [3, -6, -153], [9, -1, -164], [2, 3, -174], [-4, 1.5, -184],
    ].map((point) => new THREE.Vector3(...point));
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.52);

    const ambient = new THREE.HemisphereLight(0xffd9ca, 0x2a0a1b, 1.5);
    const headLamp = new THREE.PointLight(0xffe9c5, 3.2, 25, 1.45);
    const rimLight = new THREE.DirectionalLight(0xff7f9c, 0.85);
    rimLight.position.set(-4, 7, 3);
    const magicLight = new THREE.PointLight(0xff74c5, 0, 34, 1.35);
    scene.add(ambient, headLamp, rimLight, magicLight);

    world = {
      renderer,
      scene,
      camera,
      root,
      curve,
      ambient,
      headLamp,
      rimLight,
      magicLight,
      mobile,
      reducedMotion,
      compactGraphics,
      frame: 0,
      stageColor: new THREE.Color(),
      tubeRadius: 3.7,
      tubeSegments: mobile ? 250 : 320,
      radialSegments: mobile ? 22 : 28,
    };

    world.tube = createDigestiveTube();
    world.river = createRiver();
    world.folds = createWallFolds();
    world.cells = createWallCells();
    world.beacons = createSectionBeacons();

    const raftParts = createRaft();
    Object.assign(world, raftParts);
    world.raft.scale.setScalar(mobile ? 0.64 : 0.72);
    world.rimLight.target = world.raft;
    root.add(world.raft);

    world.mouth = createMouth();
    world.contractions = createContractions();
    world.stomach = createStomach();
    world.villi = createVilliForest();
    world.large = createLargeIntestine();
    world.exitGate = createExitGate();
    world.coins = createCoins();
    world.waves = createAcidWaves();
    world.saliva = createSaliva();
    world.spray = createRiverSpray();
    world.bursts = createBurstSystem(mobile ? 70 : 90);

    root.add(
      world.mouth.group,
      world.contractions.group,
      world.stomach.group,
      world.villi.group,
      world.large.group,
      world.exitGate,
      world.beacons.group,
      world.coins.group,
      world.waves.group,
      world.saliva.points,
      world.spray.points,
      world.bursts.points,
    );

    world.labels = SECTIONS.map((section, index) => {
      const element = document.createElement('div');
      element.className = 'label';
      element.textContent = t(section.organ);
      labelsEl.append(element);
      return {
        element,
        section,
        t: (section.start + section.end) / 2 + (index === 2 ? 0.015 : 0),
      };
    });

    updateSceneTheme();
    updateOrganicColors();
    resize();
    new ResizeObserver(resize).observe(playCard);
    return world;
  }

  function frameAt(value) {
    const u = clamp(value, 0, 1);
    const point = world.curve.getPointAt(u);
    const tangent = world.curve.getTangentAt(u).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    if (Math.abs(tangent.dot(up)) > 0.92) up.set(1, 0, 0);
    const right = new THREE.Vector3().crossVectors(tangent, up).normalize();
    const normal = new THREE.Vector3().crossVectors(right, tangent).normalize();
    return { point, tangent, right, normal };
  }

  function placeOnPath(object, value, lane = 0, lift = 0) {
    const frame = frameAt(value);
    object.position.copy(frame.point)
      .add(frame.right.clone().multiplyScalar(lane))
      .add(frame.normal.clone().multiplyScalar(lift));
    object.quaternion.setFromRotationMatrix(
      new THREE.Matrix4().lookAt(
        object.position,
        frame.point.clone().add(frame.tangent),
        frame.normal,
      ),
    );
    return object;
  }

  function orientToward(object, position, target, up) {
    object.position.copy(position);
    object.quaternion.setFromRotationMatrix(new THREE.Matrix4().lookAt(position, target, up));
  }

  function createDigestiveTube() {
    const geometry = new THREE.TubeGeometry(
      world.curve,
      world.tubeSegments,
      world.tubeRadius,
      world.radialSegments,
      false,
    );
    const positions = geometry.attributes.position;
    const stride = world.radialSegments + 1;
    const center = new THREE.Vector3();
    const position = new THREE.Vector3();
    for (let index = 0; index < positions.count; index += 1) {
      const ring = Math.floor(index / stride);
      const radial = (index % stride) / world.radialSegments;
      const u = ring / world.tubeSegments;
      world.curve.getPointAt(u, center);
      position.fromBufferAttribute(positions, index).sub(center);
      const stomachWidening = Math.exp(-Math.pow((u - 0.405) / 0.105, 2)) * 0.12;
      const largeWidening = Math.exp(-Math.pow((u - 0.855) / 0.09, 2)) * 0.055;
      const esophagusNarrowing = Math.exp(-Math.pow((u - 0.235) / 0.09, 2)) * 0.045;
      const tissueRipple =
        Math.sin(u * 108 + radial * Math.PI * 8) * 0.012
        + Math.sin(u * 37 - radial * Math.PI * 5) * 0.008;
      const scale = 1 + stomachWidening + largeWidening - esophagusNarrowing + tissueRipple;
      position.multiplyScalar(scale).add(center);
      positions.setXYZ(index, position.x, position.y, position.z);
    }
    positions.needsUpdate = true;
    geometry.computeVertexNormals();
    geometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(new Float32Array(geometry.attributes.position.count * 3), 3),
    );
    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      side: THREE.BackSide,
      roughness: 0.84,
      metalness: 0,
      emissive: 0x250713,
      emissiveIntensity: 0.12,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    world.root.add(mesh);
    return { geometry, material, mesh };
  }

  function createFlowTexture() {
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 96;
    textureCanvas.height = 256;
    const context = textureCanvas.getContext('2d');
    const wash = context.createLinearGradient(0, 0, textureCanvas.width, 0);
    wash.addColorStop(0, '#779da1');
    wash.addColorStop(0.5, '#d7f5f3');
    wash.addColorStop(1, '#779da1');
    context.fillStyle = wash;
    context.fillRect(0, 0, textureCanvas.width, textureCanvas.height);
    context.lineCap = 'round';
    for (let index = 0; index < 28; index += 1) {
      const x = 8 + seededRandom() * 80;
      const y = seededRandom() * 256;
      const length = 12 + seededRandom() * 38;
      context.strokeStyle = `rgba(255,255,255,${0.12 + seededRandom() * 0.25})`;
      context.lineWidth = 0.8 + seededRandom() * 2.3;
      context.beginPath();
      context.moveTo(x, y);
      context.bezierCurveTo(x + 4, y + length * 0.25, x - 5, y + length * 0.72, x, y + length);
      context.stroke();
    }
    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.MirroredRepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1.35, 20);
    texture.anisotropy = Math.min(world.renderer.capabilities.getMaxAnisotropy(), 4);
    return texture;
  }

  function createRiver() {
    const segments = world.mobile ? 240 : 320;
    const positions = [];
    const colors = [];
    const uvs = [];
    const indices = [];
    const leftEdge = [];
    const rightEdge = [];
    const color = new THREE.Color();

    for (let index = 0; index <= segments; index += 1) {
      const u = index / segments;
      const frame = frameAt(u);
      const width = 1.75 + Math.sin(u * Math.PI * 13) * 0.18;
      const center = frame.point.clone().add(frame.normal.clone().multiplyScalar(-1.13));
      const left = center.clone().add(frame.right.clone().multiplyScalar(-width));
      const right = center.clone().add(frame.right.clone().multiplyScalar(width));
      positions.push(left.x, left.y, left.z, right.x, right.y, right.z);
      uvs.push(0, u, 1, u);
      leftEdge.push(left);
      rightEdge.push(right);
      color.setHSL(0.52 + Math.sin(u * 18) * 0.012, 0.74, 0.52 + Math.sin(u * 35) * 0.035);
      colors.push(color.r, color.g, color.b, color.r * 0.9, color.g * 0.98, color.b);
      if (index < segments) {
        const offset = index * 2;
        indices.push(offset, offset + 1, offset + 2, offset + 1, offset + 3, offset + 2);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const texture = createFlowTexture();
    const material = new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      map: texture,
      transparent: true,
      opacity: 0.8,
      roughness: 0.2,
      metalness: 0,
      clearcoat: 0.72,
      clearcoatRoughness: 0.18,
      emissive: 0x0b6074,
      emissiveIntensity: 0.22,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;

    const foamMaterial = new THREE.MeshStandardMaterial({
      color: 0xd9fbff,
      emissive: 0x86eefa,
      emissiveIntensity: 0.45,
      transparent: true,
      opacity: 0.78,
      roughness: 0.32,
    });
    const leftFoam = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(leftEdge), segments, 0.045, 7, false),
      foamMaterial,
    );
    const rightFoam = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rightEdge), segments, 0.045, 7, false),
      foamMaterial,
    );
    const group = new THREE.Group();
    group.add(mesh, leftFoam, rightFoam);
    world.root.add(group);
    return { group, mesh, material, texture, leftFoam, rightFoam };
  }

  function createWallFolds() {
    const count = world.mobile ? 20 : 28;
    const geometry = new THREE.TorusGeometry(world.tubeRadius - 0.18, 0.11, 7, 52);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x210913,
      emissiveIntensity: 0.11,
      transparent: true,
      opacity: 0.26,
      roughness: 0.88,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const data = [];
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    for (let index = 0; index < count; index += 1) {
      const u = 0.012 + index / (count + 1);
      const section = sectionAt(u);
      const frame = frameAt(u);
      const quaternion = new THREE.Quaternion().setFromRotationMatrix(
        new THREE.Matrix4().lookAt(
          frame.point,
          frame.point.clone().add(frame.tangent),
          frame.normal,
        ),
      );
      const scaleX = 0.965 + seededRandom() * 0.045;
      const scaleY = 0.94 + seededRandom() * 0.08;
      const entry = {
        position: frame.point.clone(),
        quaternion,
        scaleX,
        scaleY,
        phase: seededRandom() * Math.PI * 2,
        sectionId: section.id,
      };
      data.push(entry);
      dummy.position.copy(entry.position);
      dummy.quaternion.copy(entry.quaternion);
      dummy.scale.set(scaleX, scaleY, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      color.set(cssColor(section.color));
      if (theme === 'dark') color.multiplyScalar(0.72);
      mesh.setColorAt(index, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    world.root.add(mesh);
    return { mesh, data, material };
  }

  function createWallCells() {
    const count = world.mobile ? 120 : 220;
    const geometry = new THREE.SphereGeometry(0.16, 8, 6);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.96,
      metalness: 0,
      transparent: true,
      opacity: 0.24,
    });
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    const dummy = new THREE.Object3D();
    const look = new THREE.Matrix4();
    const color = new THREE.Color();
    const data = [];

    for (let index = 0; index < count; index += 1) {
      const u = seededRandom();
      const angle = seededRandom() * Math.PI * 2;
      const frame = frameAt(u);
      const radius = world.tubeRadius - 0.07;
      const position = frame.point.clone()
        .add(frame.right.clone().multiplyScalar(Math.cos(angle) * radius))
        .add(frame.normal.clone().multiplyScalar(Math.sin(angle) * radius));
      dummy.position.copy(position);
      dummy.quaternion.setFromRotationMatrix(look.lookAt(position, frame.point, frame.tangent));
      const size = 0.55 + seededRandom() * 1.25;
      dummy.scale.set(size * 1.4, size * 0.45, size);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      color.set(cssColor(sectionAt(u).color)).offsetHSL(0, -0.05, seededRandom() * 0.1);
      mesh.setColorAt(index, color);
      data.push({ u });
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    world.root.add(mesh);
    return { mesh, data };
  }

  function createSectionBeacons() {
    const group = new THREE.Group();
    const items = SECTIONS.slice(1).map((section) => {
      const color = new THREE.Color(cssColor(section.color));
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(world.tubeRadius - 0.62, 0.055, 7, 54),
        material,
      );
      placeOnPath(ring, section.start);
      group.add(ring);
      return { ring, material, section };
    });
    return { group, items };
  }

  function createRaft() {
    const raft = new THREE.Group();
    const hullMaterial = new THREE.MeshStandardMaterial({
      color: 0xff5d72,
      roughness: 0.38,
      metalness: 0.03,
    });
    const hull = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 1.22, 8, 16), hullMaterial);
    hull.rotation.x = Math.PI / 2;
    hull.scale.x = 1.12;
    hull.castShadow = true;

    const cockpit = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.3, 0.94, 7, 14),
      new THREE.MeshStandardMaterial({ color: 0x321126, roughness: 0.66 }),
    );
    cockpit.rotation.x = Math.PI / 2;
    cockpit.position.y = 0.12;
    cockpit.scale.set(0.92, 0.88, 0.92);

    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(0.38, 0.055, 8, 30),
      new THREE.MeshStandardMaterial({ color: 0xffcf60, roughness: 0.32 }),
    );
    rim.rotation.x = Math.PI / 2;
    rim.scale.z = 1.7;
    rim.position.y = 0.22;
    rim.castShadow = true;

    const rider = new THREE.Group();
    rider.position.set(0, 0.38, 0.12);
    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.16, 0.26, 6, 12),
      new THREE.MeshStandardMaterial({ color: 0x5ed6d1, roughness: 0.55 }),
    );
    body.castShadow = true;
    const vest = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.19, 0.18, 6, 12),
      new THREE.MeshStandardMaterial({ color: 0xffd15c, roughness: 0.48 }),
    );
    vest.position.y = 0.03;
    vest.scale.z = 0.8;
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 18, 14),
      new THREE.MeshStandardMaterial({ color: 0xf3b38c, roughness: 0.62 }),
    );
    head.position.y = 0.44;
    head.castShadow = true;
    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.184, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.56),
      new THREE.MeshStandardMaterial({
        color: 0x183e4c,
        emissive: 0x09212b,
        emissiveIntensity: 0.12,
        roughness: 0.62,
      }),
    );
    hair.position.y = 0.47;
    const helmetStripe = new THREE.Mesh(
      new THREE.TorusGeometry(0.188, 0.018, 7, 24),
      new THREE.MeshStandardMaterial({
        color: 0xffd15c,
        emissive: 0x8a4d0b,
        emissiveIntensity: 0.1,
        roughness: 0.42,
      }),
    );
    helmetStripe.rotation.x = Math.PI / 2;
    helmetStripe.position.y = 0.49;
    const paddle = new THREE.Group();
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 1.45, 10),
      new THREE.MeshStandardMaterial({ color: 0xf7eee7, roughness: 0.42 }),
    );
    shaft.rotation.z = Math.PI / 2;
    const bladeGeometry = new THREE.CapsuleGeometry(0.09, 0.22, 5, 10);
    const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0x63dbea, roughness: 0.35 });
    const leftBlade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    const rightBlade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    leftBlade.rotation.z = Math.PI / 2;
    rightBlade.rotation.z = Math.PI / 2;
    leftBlade.position.x = -0.78;
    rightBlade.position.x = 0.78;
    paddle.position.y = 0.2;
    paddle.add(shaft, leftBlade, rightBlade);
    rider.add(body, vest, head, hair, helmetStripe, paddle);

    const foodCargo = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.25, 1),
      new THREE.MeshStandardMaterial({
        color: FOOD.rice.color,
        emissive: FOOD.rice.accent,
        emissiveIntensity: 0.12,
        roughness: 0.72,
      }),
    );
    foodCargo.position.set(0, 0.36, -0.58);
    foodCargo.castShadow = true;

    const kayakAccent = new THREE.Mesh(
      new THREE.TorusGeometry(0.22, 0.035, 7, 24),
      new THREE.MeshStandardMaterial({ color: FOOD.rice.accent, roughness: 0.38 }),
    );
    kayakAccent.rotation.x = Math.PI / 2;
    kayakAccent.position.set(0, 0.33, -0.58);

    const raftLight = new THREE.Object3D();
    raftLight.intensity = 0;
    raft.add(hull, cockpit, rim, rider, foodCargo, kayakAccent, raftLight);
    return { raft, paddle, foodCargo, kayakAccent, raftLight };
  }

  function createMouth() {
    const group = new THREE.Group();
    const teeth = [];
    const toothGeometry = new THREE.CapsuleGeometry(0.25, 0.42, 7, 13);
    toothGeometry.rotateX(Math.PI / 2);
    const toothMaterial = new THREE.MeshStandardMaterial({
      color: 0xfffbeb,
      roughness: 0.36,
      metalness: 0,
    });
    const gumMaterial = new THREE.MeshStandardMaterial({
      color: 0xd94f72,
      roughness: 0.8,
      transparent: true,
      opacity: 0.86,
    });

    for (let row = 0; row < 2; row += 1) {
      const sign = row === 0 ? 1 : -1;
      for (let index = 0; index < 7; index += 1) {
        const u = 0.035 + index * 0.008;
        const frame = frameAt(u);
        const lane = (index - 3) * 0.68;
        const position = frame.point.clone()
          .add(frame.right.clone().multiplyScalar(lane))
          .add(frame.normal.clone().multiplyScalar(sign * 2.05));
        const tooth = new THREE.Mesh(toothGeometry, toothMaterial);
        orientToward(tooth, position, frame.point, frame.tangent);
        tooth.scale.set(0.88 + seededRandom() * 0.15, 0.88, 1.18 + seededRandom() * 0.25);
        tooth.castShadow = true;
        tooth.userData.base = position.clone();
        tooth.userData.inward = frame.normal.clone().multiplyScalar(-sign);
        tooth.userData.phase = index * 0.47 + row;
        group.add(tooth);
        teeth.push(tooth);
      }
    }

    for (const u of [0.035, 0.105]) {
      const gum = new THREE.Mesh(new THREE.TorusGeometry(3.15, 0.22, 9, 52), gumMaterial);
      placeOnPath(gum, u);
      group.add(gum);
    }
    return { group, teeth };
  }

  function createContractions() {
    const group = new THREE.Group();
    const rings = [];
    for (let index = 0; index < 12; index += 1) {
      const material = new THREE.MeshStandardMaterial({
        color: 0xffafac,
        emissive: 0x7f243d,
        emissiveIntensity: 0.16,
        transparent: true,
        opacity: 0.24,
        roughness: 0.7,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(3.24, 0.1, 8, 48), material);
      placeOnPath(ring, 0.165 + index * 0.012);
      ring.userData.phase = index * 0.72;
      group.add(ring);
      rings.push(ring);
    }
    return { group, rings };
  }

  function createStomach() {
    const group = new THREE.Group();
    const acidMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x92d74a,
      emissive: 0x3b8b28,
      emissiveIntensity: 0.58,
      transparent: true,
      opacity: 0.76,
      roughness: 0.25,
      clearcoat: 0.55,
      side: THREE.DoubleSide,
    });
    const pool = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.25, 12, 80), acidMaterial);
    placeOnPath(pool, 0.405, 0, -1.18);
    group.add(pool);

    const bubbles = [];
    const bubbleMaterial = new THREE.MeshStandardMaterial({
      color: 0xb9ff73,
      emissive: 0x4f9c2f,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.67,
      roughness: 0.2,
    });
    for (let index = 0; index < 14; index += 1) {
      const bubble = new THREE.Mesh(
        new THREE.SphereGeometry(0.08 + seededRandom() * 0.13, 10, 8),
        bubbleMaterial,
      );
      const u = 0.335 + seededRandom() * 0.15;
      const frame = frameAt(u);
      bubble.position.copy(frame.point)
        .add(frame.right.clone().multiplyScalar((seededRandom() - 0.5) * 4.1))
        .add(frame.normal.clone().multiplyScalar(-1.25 + seededRandom() * 1.2));
      bubble.userData.baseY = bubble.position.y;
      bubble.userData.phase = seededRandom() * Math.PI * 2;
      group.add(bubble);
      bubbles.push(bubble);
    }

    const mucus = [];
    const mucusMaterial = new THREE.MeshStandardMaterial({
      color: 0x93ffd5,
      emissive: 0x1a7d60,
      emissiveIntensity: 0.22,
      transparent: true,
      opacity: 0.24,
      roughness: 0.5,
    });
    for (let index = 0; index < 10; index += 1) {
      const strip = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.75, 5, 9), mucusMaterial);
      const u = 0.33 + seededRandom() * 0.155;
      const angle = seededRandom() * Math.PI * 2;
      const frame = frameAt(u);
      const position = frame.point.clone()
        .add(frame.right.clone().multiplyScalar(Math.cos(angle) * 3.35))
        .add(frame.normal.clone().multiplyScalar(Math.sin(angle) * 3.35));
      orientToward(strip, position, frame.point, frame.tangent);
      strip.scale.y = 0.8 + seededRandom() * 1.6;
      strip.userData.phase = seededRandom() * Math.PI * 2;
      group.add(strip);
      mucus.push(strip);
    }
    return { group, pool, bubbles, mucus };
  }

  function createVilliForest() {
    const count = world.mobile ? 300 : 520;
    const geometry = new THREE.CapsuleGeometry(0.045, 0.42, 5, 8);
    geometry.rotateX(Math.PI / 2);
    geometry.translate(0, 0, 0.25);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff8fbe,
      roughness: 0.72,
      emissive: 0x5d183e,
      emissiveIntensity: 0.18,
    });
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const group = new THREE.Group();
    group.add(mesh);
    const data = [];
    const dummy = new THREE.Object3D();
    const look = new THREE.Matrix4();
    const color = new THREE.Color();

    for (let index = 0; index < count; index += 1) {
      const u = 0.512 + seededRandom() * 0.258;
      const angle = seededRandom() * Math.PI * 2;
      const frame = frameAt(u);
      const base = frame.point.clone()
        .add(frame.right.clone().multiplyScalar(Math.cos(angle) * (world.tubeRadius - 0.22)))
        .add(frame.normal.clone().multiplyScalar(Math.sin(angle) * (world.tubeRadius - 0.22)));
      const quaternion = new THREE.Quaternion().setFromRotationMatrix(look.lookAt(base, frame.point, frame.tangent));
      const size = 0.65 + seededRandom() * 0.8;
      const length = 0.75 + seededRandom() * 1.2;
      data.push({
        base,
        quaternion,
        size,
        length,
        phase: seededRandom() * Math.PI * 2,
      });
      dummy.position.copy(base);
      dummy.quaternion.copy(quaternion);
      dummy.scale.set(size, size, length);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      color.setHSL(0.91 + seededRandom() * 0.03, 0.72, 0.62 + seededRandom() * 0.08);
      mesh.setColorAt(index, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    const bile = new THREE.Group();
    const bileBody = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 16, 12),
      new THREE.MeshStandardMaterial({
        color: 0xc6ee48,
        emissive: 0x527f16,
        emissiveIntensity: 0.34,
        roughness: 0.52,
      }),
    );
    const bileRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.38, 0.045, 7, 24),
      new THREE.MeshStandardMaterial({ color: 0xf2e75f, emissive: 0x8b7f15, emissiveIntensity: 0.25 }),
    );
    bileRing.rotation.x = Math.PI / 2;
    bile.add(bileBody, bileRing);
    placeOnPath(bile, 0.535, 1.5, -0.28);
    bile.visible = false;
    group.add(bile);
    return { group, mesh, data, bile };
  }

  function createLargeIntestine() {
    const group = new THREE.Group();
    const rings = [];
    for (let index = 0; index < 10; index += 1) {
      const material = new THREE.MeshStandardMaterial({
        color: 0xe4a170,
        emissive: 0x6f2c23,
        emissiveIntensity: 0.12,
        transparent: true,
        opacity: 0.28,
        roughness: 0.86,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(3.05, 0.13, 8, 48), material);
      placeOnPath(ring, 0.79 + index * 0.013);
      ring.userData.phase = index * 0.55;
      group.add(ring);
      rings.push(ring);
    }

    const droplets = [];
    const dropletMaterial = new THREE.MeshStandardMaterial({
      color: 0x85e4f4,
      emissive: 0x197d96,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.8,
      roughness: 0.2,
    });
    for (let index = 0; index < 16; index += 1) {
      const drop = new THREE.Mesh(new THREE.SphereGeometry(0.075, 9, 7), dropletMaterial);
      const u = 0.79 + seededRandom() * 0.13;
      const frame = frameAt(u);
      const angle = seededRandom() * Math.PI * 2;
      drop.position.copy(frame.point)
        .add(frame.right.clone().multiplyScalar(Math.cos(angle) * 3))
        .add(frame.normal.clone().multiplyScalar(Math.sin(angle) * 3));
      drop.userData.base = drop.position.clone();
      drop.userData.phase = seededRandom() * Math.PI * 2;
      group.add(drop);
      droplets.push(drop);
    }
    return { group, rings, droplets };
  }

  function createExitGate() {
    const group = new THREE.Group();
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(3.08, 0.2, 9, 54),
      new THREE.MeshStandardMaterial({
        color: 0x4c1e3f,
        emissive: 0x1d0717,
        emissiveIntensity: 0.25,
        roughness: 0.8,
      }),
    );
    const disk = new THREE.Mesh(
      new THREE.CircleGeometry(3.1, 56),
      new THREE.MeshBasicMaterial({ color: 0x070307, transparent: true, opacity: 0.9, side: THREE.DoubleSide }),
    );
    placeOnPath(halo, 0.987);
    placeOnPath(disk, 0.989);
    group.add(halo, disk);
    return group;
  }

  function createAcidWaves() {
    const group = new THREE.Group();
    const items = [
      { t: 0.36, lane: -0.78 },
      { t: 0.414, lane: 0.78 },
      { t: 0.472, lane: -0.1 },
    ];
    const material = new THREE.MeshStandardMaterial({
      color: 0x9ce94f,
      emissive: 0x388d24,
      emissiveIntensity: 0.54,
      transparent: true,
      opacity: 0.86,
      roughness: 0.32,
    });
    items.forEach((wave, index) => {
      const mesh = new THREE.Mesh(new THREE.ConeGeometry(0.62, 1.25, 22), material);
      placeOnPath(mesh, wave.t, wave.lane * 1.5, -0.72);
      mesh.scale.x = 1.35;
      mesh.userData.phase = index * 1.6;
      group.add(mesh);
      Object.assign(wave, { mesh, done: false, hit: false });
    });
    return { group, items };
  }

  function createCoins() {
    const group = new THREE.Group();
    const items = [];
    const faceMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd35f,
      emissive: 0xff8d28,
      emissiveIntensity: 0.62,
      roughness: 0.25,
      transparent: true,
    });
    for (let index = 0; index < 34; index += 1) {
      const mesh = new THREE.Group();
      const face = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.065, 20), faceMaterial);
      face.rotation.z = Math.PI / 2;
      mesh.add(face);
      const coin = {
        t: 0.515 + index * 0.0076 + Math.sin(index * 3) * 0.0035,
        lane: [-0.88, -0.5, 0.5, 0.88][index % 4],
        phase: index * 0.72,
        mesh,
        collected: false,
        flying: 0,
      };
      placeOnPath(mesh, coin.t, coin.lane * 1.45, -0.72);
      group.add(mesh);
      items.push(coin);
    }
    return { group, items };
  }

  function softCircleTexture(size = 80) {
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = size;
    textureCanvas.height = size;
    const context = textureCanvas.getContext('2d');
    const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.35, 'rgba(255,255,255,.82)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(textureCanvas);
  }

  const particleTexture = softCircleTexture();

  function createSaliva() {
    const count = world.mobile ? 54 : 72;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xbdf7ff,
      size: 0.19,
      map: particleTexture,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geometry, material);
    points.visible = false;
    const data = Array.from({ length: count }, () => {
      const u = 0.025 + seededRandom() * 0.12;
      const frame = frameAt(u);
      return {
        point: frame.point,
        right: frame.right,
        normal: frame.normal,
        lane: (seededRandom() - 0.5) * 4.6,
        phase: seededRandom() * Math.PI * 2,
      };
    });
    return { points, geometry, material, data };
  }

  function createRiverSpray() {
    const count = world.mobile ? 42 : 64;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xd8fbff,
      size: 0.15,
      map: particleTexture,
      transparent: true,
      opacity: 0.56,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geometry, material);
    const data = Array.from({ length: count }, () => ({
      offset: seededRandom() * 0.085,
      lane: (seededRandom() - 0.5) * 3.8,
      phase: seededRandom() * Math.PI * 2,
    }));
    return { points, geometry, material, data };
  }

  function createBurstSystem(count) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    positions.fill(-999);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 0.22,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geometry, material);
    const velocity = Array.from({ length: count }, () => new THREE.Vector3());
    const life = new Float32Array(count);
    let cursor = 0;

    return {
      points,
      spawn(origin, hex, amount) {
        const color = new THREE.Color(hex);
        for (let index = 0; index < amount; index += 1) {
          const slot = cursor++ % count;
          positions.set([
            origin.x + (seededRandom() - 0.5) * 0.2,
            origin.y + (seededRandom() - 0.5) * 0.2,
            origin.z + (seededRandom() - 0.5) * 0.2,
          ], slot * 3);
          colors.set([color.r, color.g, color.b], slot * 3);
          velocity[slot].set(
            (seededRandom() - 0.5) * 1.8,
            seededRandom() * 1.4,
            (seededRandom() - 0.5) * 1.8,
          );
          life[slot] = 0.7 + seededRandom() * 0.45;
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
      },
      update(delta) {
        let changed = false;
        for (let index = 0; index < count; index += 1) {
          if (life[index] <= 0) continue;
          life[index] -= delta;
          const offset = index * 3;
          if (life[index] <= 0) {
            positions[offset] = -999;
            positions[offset + 1] = -999;
            positions[offset + 2] = -999;
          } else {
            positions[offset] += velocity[index].x * delta;
            positions[offset + 1] += velocity[index].y * delta;
            positions[offset + 2] += velocity[index].z * delta;
            velocity[index].multiplyScalar(0.97);
          }
          changed = true;
        }
        if (changed) geometry.attributes.position.needsUpdate = true;
      },
      reset() {
        life.fill(0);
        positions.fill(-999);
        geometry.attributes.position.needsUpdate = true;
      },
    };
  }

  function animateWorld(time, delta) {
    const u = state.displayT;
    const raftFrame = frameAt(Math.min(0.996, u + 0.008));
    const cameraFrame = frameAt(Math.max(0, u - (world.mobile ? 0.03 : 0.024)));
    const lookFrame = frameAt(Math.min(1, u + (world.mobile ? 0.052 : 0.044)));
    const wobble = world.reducedMotion ? 0 : (state.steady ? 0.09 : 0.28);
    const bob = Math.sin(time * 4.2 + u * 60) * wobble;

    const raftOffset = raftFrame.right.clone().multiplyScalar(state.lateral * 1.42)
      .add(raftFrame.normal.clone().multiplyScalar(-0.78 + bob * 0.16));
    world.raft.position.copy(raftFrame.point).add(raftOffset);
    world.raft.quaternion.setFromRotationMatrix(
      new THREE.Matrix4().lookAt(
        world.raft.position,
        raftFrame.point.clone().add(raftFrame.tangent),
        raftFrame.normal,
      ),
    );
    world.raft.rotateZ(-state.lateral * 0.17 + Math.sin(time * 4.5) * wobble * 0.045);
    world.paddle.rotation.z = Math.sin(time * 6.4) * (world.reducedMotion ? 0 : (state.started ? 0.42 : 0.12));
    world.foodCargo.rotation.y = time * 0.8;

    const cameraOffset = cameraFrame.normal.clone().multiplyScalar(world.mobile ? 1.24 : 0.94)
      .add(cameraFrame.right.clone().multiplyScalar(state.lateral * 0.18));
    world.camera.position.copy(cameraFrame.point).add(cameraOffset);
    const lookTarget = lookFrame.point.clone()
      .add(lookFrame.normal.clone().multiplyScalar(-0.34))
      .add(lookFrame.right.clone().multiplyScalar(state.lateral * 0.55));
    world.camera.lookAt(lookTarget);
    world.camera.rotation.z += Math.sin(time * 2.2 + u * 24) * (state.steady ? 0.004 : 0.012);

    world.headLamp.position.copy(world.camera.position).add(cameraFrame.tangent.clone().multiplyScalar(2.2));
    world.rimLight.position.copy(world.raft.position).add(raftFrame.right.clone().multiplyScalar(-2.5));
    world.raftLight.intensity = 1.15 + Math.sin(time * 3.5) * 0.18;
    world.river.material.opacity = lerp(world.river.material.opacity, 0.8 * state.waterLevel, 0.035);
    world.river.material.emissiveIntensity = 0.2 + Math.sin(time * 2.7) * 0.035;
    world.river.texture.offset.y = -time * 0.16;
    world.river.texture.offset.x = Math.sin(time * 0.3) * 0.035;
    world.stageColor.set(cssColor(sectionAt(u).color));
    world.headLamp.color.lerp(world.stageColor, 0.024);
    world.rimLight.color.lerp(world.stageColor, 0.018);

    if (world.frame % 2 === 0) animateFolds(time);
    animateMouth(time);
    animateContractions(time);
    animateBeacons(time);
    animateStomach(time);
    if (world.frame % 2 === 0) {
      animateVilli(time);
      animateLargeIntestine(time);
    }
    animateCoins(time, delta);
    animateParticles(time);
    world.bursts.update(delta);
    if (world.frame % 2 === 0) updateLabels();
  }

  const foldDummy = new THREE.Object3D();

  function animateFolds(time) {
    world.folds.data.forEach((fold, index) => {
      const pulse = 1 + Math.sin(time * 1.8 + fold.phase + index * 0.08) * 0.018;
      foldDummy.position.copy(fold.position);
      foldDummy.quaternion.copy(fold.quaternion);
      foldDummy.scale.set(fold.scaleX * pulse, fold.scaleY * pulse, 1);
      foldDummy.updateMatrix();
      world.folds.mesh.setMatrixAt(index, foldDummy.matrix);
    });
    world.folds.mesh.instanceMatrix.needsUpdate = true;
  }

  function animateMouth(time) {
    const visible = state.t < 0.19;
    world.mouth.group.visible = visible;
    if (!visible) return;
    world.mouth.teeth.forEach((tooth) => {
      const naturalBite = Math.max(0, Math.sin(time * 4.8 + tooth.userData.phase)) * 0.1;
      const actionBite = state.pulse * 0.34;
      tooth.position.copy(tooth.userData.base)
        .add(tooth.userData.inward.clone().multiplyScalar(naturalBite + actionBite));
    });
  }

  function animateContractions(time) {
    const active = state.t > 0.125 && state.t < 0.35;
    world.contractions.group.visible = active;
    if (!active) return;
    world.contractions.rings.forEach((ring, index) => {
      const wave = Math.max(0, Math.sin(time * 4.2 - index * 0.72));
      const scale = 1 - wave * 0.12;
      ring.scale.set(scale, scale, 1);
      ring.material.opacity = 0.18 + wave * 0.34;
    });
  }

  function animateBeacons(time) {
    world.beacons.items.forEach(({ ring, material, section }, index) => {
      const proximity = Math.max(0, 1 - Math.abs(state.displayT - section.start) * 12);
      const pulse = 0.5 + Math.sin(time * 2.4 + index * 0.8) * 0.5;
      material.opacity = 0.1 + proximity * 0.34 + pulse * 0.035;
      const scale = 1 + proximity * 0.045 + pulse * 0.008;
      ring.scale.set(scale, scale, 1);
    });
  }

  function animateStomach(time) {
    const active = state.t > 0.285 && state.t < 0.535;
    world.stomach.group.visible = active;
    world.waves.group.visible = active;
    if (!active) return;
    world.stomach.pool.rotation.z = time * 0.52;
    world.stomach.pool.material.emissiveIntensity = 0.48 + Math.sin(time * 3.8) * 0.12;
    world.stomach.bubbles.forEach((bubble) => {
      bubble.position.y = bubble.userData.baseY + Math.sin(time * 1.6 + bubble.userData.phase) * 0.22;
      const scale = 0.8 + Math.sin(time * 2.7 + bubble.userData.phase) * 0.16;
      bubble.scale.setScalar(scale);
    });
    world.stomach.mucus.forEach((strip) => {
      strip.material.opacity = 0.2 + Math.sin(time * 2.2 + strip.userData.phase) * 0.06;
    });
    world.waves.items.forEach((wave) => {
      if (!wave.done) wave.mesh.position.y += Math.sin(time * 4 + wave.mesh.userData.phase) * 0.0015;
    });
  }

  const villiDummy = new THREE.Object3D();

  function animateVilli(time) {
    const active = state.t > 0.47 && state.t < 0.82;
    world.villi.group.visible = active;
    world.magicLight.intensity = active ? 3.3 + Math.sin(time * 2) * 0.65 : 0;
    world.magicLight.position.copy(frameAt(0.65).point);
    world.villi.bile.visible = active && state.food === 'fat';
    if (world.villi.bile.visible) {
      world.villi.bile.rotation.z = Math.sin(time * 3) * 0.16;
      world.villi.bile.rotation.y = time * 1.8;
    }
    if (!active) return;
    for (let index = 0; index < world.villi.data.length; index += 1) {
      const data = world.villi.data[index];
      villiDummy.position.copy(data.base);
      villiDummy.quaternion.copy(data.quaternion);
      villiDummy.rotateX(Math.sin(time * 2.2 + data.phase) * 0.13);
      villiDummy.scale.set(
        data.size,
        data.size,
        data.length * (1 + Math.sin(time * 1.4 + data.phase) * 0.045),
      );
      villiDummy.updateMatrix();
      world.villi.mesh.setMatrixAt(index, villiDummy.matrix);
    }
    world.villi.mesh.instanceMatrix.needsUpdate = true;
    if (state.food === 'candy' && Math.floor(time * 3) % 5 === 0 && seededRandom() > 0.93) {
      world.bursts.spawn(world.raft.position, 0xff73bd, 2);
    }
  }

  function animateLargeIntestine(time) {
    const active = state.t > 0.755 && state.t < 0.96;
    world.large.group.visible = active;
    if (!active) return;
    world.large.rings.forEach((ring, index) => {
      const shrink = 1 - state.absorbed * 0.045 + Math.sin(time * 1.8 + index) * 0.02;
      ring.scale.set(shrink, shrink, 1);
      ring.material.opacity = 0.25 + state.absorbed * 0.08;
    });
    world.large.droplets.forEach((drop) => {
      drop.position.copy(drop.userData.base);
      drop.scale.setScalar(1 - state.absorbed * 0.12 + Math.sin(time * 2 + drop.userData.phase) * 0.08);
      drop.material.opacity = 0.8 - state.absorbed * 0.15;
    });
  }

  function animateCoins(time, delta) {
    const active = state.t > 0.475 && state.t < 0.83;
    world.coins.group.visible = active;
    if (!active) return;
    for (const coin of world.coins.items) {
      if (coin.collected && coin.flying <= 0) continue;
      const frame = frameAt(coin.t);
      const bob = Math.sin(time * 4 + coin.phase) * 0.14;
      let position = frame.point.clone()
        .add(frame.right.clone().multiplyScalar(coin.lane * 1.45))
        .add(frame.normal.clone().multiplyScalar(-0.72 + bob));
      if (coin.collected) {
        coin.flying = Math.max(0, coin.flying - delta * 1.7);
        const wall = frame.point.clone()
          .add(frame.right.clone().multiplyScalar(Math.sign(coin.lane || 1) * 3.1))
          .add(frame.normal.clone().multiplyScalar(0.5));
        position = position.lerp(wall, 1 - coin.flying);
        coin.mesh.scale.setScalar(0.6 + coin.flying * 0.4);
        if (coin.flying <= 0) coin.mesh.visible = false;
      }
      coin.mesh.position.copy(position);
      coin.mesh.rotation.y = time * 3.6 + coin.phase;
    }
  }

  const particlePosition = new THREE.Vector3();

  function animateParticles(time) {
    if (world.frame % 2 !== 0) return;
    const salivaPositions = world.saliva.geometry.attributes.position;
    world.saliva.data.forEach((drop, index) => {
      const fall = ((time * 0.5 + drop.phase) % 1) * 2.3;
      particlePosition.copy(drop.point)
        .addScaledVector(drop.right, drop.lane)
        .addScaledVector(drop.normal, 2.4 - fall);
      salivaPositions.setXYZ(index, particlePosition.x, particlePosition.y, particlePosition.z);
    });
    salivaPositions.needsUpdate = true;

    const sprayPositions = world.spray.geometry.attributes.position;
    world.spray.data.forEach((particle, index) => {
      const u = clamp(state.displayT + 0.004 + particle.offset, 0, 1);
      const frame = frameAt(u);
      const bounce = Math.abs(Math.sin(time * 3.6 + particle.phase)) * 0.2;
      particlePosition.copy(frame.point)
        .addScaledVector(frame.right, particle.lane)
        .addScaledVector(frame.normal, -0.92 + bounce);
      sprayPositions.setXYZ(index, particlePosition.x, particlePosition.y, particlePosition.z);
    });
    sprayPositions.needsUpdate = true;
  }

  function updateLabels() {
    const bounds = canvas.getBoundingClientRect();
    world.labels.forEach((label) => {
      const point = world.curve.getPointAt(label.t);
      const projected = point.clone().project(world.camera);
      const visible = projected.z < 1
        && Math.abs(projected.x) < 1.2
        && Math.abs(projected.y) < 1.15
        && Math.abs(state.t - label.t) < 0.1;
      label.element.classList.toggle('is-visible', visible);
      label.element.style.left = `${(projected.x * 0.5 + 0.5) * bounds.width}px`;
      label.element.style.top = `${(-projected.y * 0.5 + 0.5) * bounds.height}px`;
    });
  }

  function updateSceneTheme() {
    if (!world) return;
    world.scene.background = new THREE.Color(cssColor('--scene-bg'));
    world.scene.fog = new THREE.FogExp2(
      new THREE.Color(cssColor('--scene-fog')),
      theme === 'dark' ? 0.025 : 0.018,
    );
    world.ambient.intensity = theme === 'dark' ? 1.35 : 1.8;
    world.headLamp.intensity = theme === 'dark' ? 3.35 : 2.75;
    world.renderer.toneMappingExposure = theme === 'dark' ? 1.08 : 1.02;
  }

  function updateOrganicColors() {
    if (!world?.tube) return;
    const attribute = world.tube.geometry.attributes.color;
    const stride = world.radialSegments + 1;
    const color = new THREE.Color();
    for (let index = 0; index < attribute.count; index += 1) {
      const ring = Math.floor(index / stride);
      const u = ring / world.tubeSegments;
      const section = sectionAt(u);
      color.set(cssColor(section.color));
      const radial = (index % stride) / world.radialSegments;
      color.offsetHSL(
        Math.sin(u * 20) * 0.006,
        0.02,
        Math.sin(radial * Math.PI * 2 + u * 18) * 0.035,
      );
      if (theme === 'dark') color.multiplyScalar(section.id === 'small' ? 0.76 : 0.62);
      attribute.setXYZ(index, color.r, color.g, color.b);
    }
    attribute.needsUpdate = true;
    if (world.folds) {
      world.folds.data.forEach((fold, index) => {
        const section = SECTIONS.find((item) => item.id === fold.sectionId);
        color.set(cssColor(section.color));
        if (theme === 'dark') color.multiplyScalar(0.72);
        world.folds.mesh.setColorAt(index, color);
      });
      if (world.folds.mesh.instanceColor) world.folds.mesh.instanceColor.needsUpdate = true;
    }
  }

  function resize() {
    if (!world) return;
    const bounds = playCard.getBoundingClientRect();
    const width = Math.max(2, Math.floor(bounds.width));
    const height = Math.max(2, Math.floor(bounds.height));
    world.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, world.mobile ? 1.25 : 1.55));
    world.renderer.setSize(width, height, false);
    world.camera.aspect = width / height;
    world.camera.updateProjectionMatrix();
  }

  function updateFrame(now) {
    const delta = Math.min(0.25, (now - state.lastTime) / 1000 || 0.016);
    state.lastTime = now;
    if (document.hidden) {
      requestAnimationFrame(updateFrame);
      return;
    }
    world.frame += 1;
    if (state.started && !state.done) {
      state.speed = lerp(state.speed, baseSpeed(), 0.045);
      state.t = clamp(state.t + state.speed * delta, 0, 1);
      checkSectionTransitions();
      updateTasks();
      if (state.t > 0.998) finishRun();
    }
    state.displayT = lerp(state.displayT, state.t, 0.075);
    state.lateral = lerp(state.lateral, state.targetLateral, 0.13);
    state.pulse = Math.max(0, state.pulse - delta * 3.2);
    routeFill.style.transform = `scaleX(${clamp(state.t, 0, 1)})`;
    animateWorld(now / 1000, delta);
    updateAmbientSound();
    world.renderer.render(world.scene, world.camera);
    requestAnimationFrame(updateFrame);
  }

  applyLanguage();
  applyTheme();
  renderCodex();

  try {
    initWorld();
    resetRun();
    startBtn.disabled = false;
    startBtn.removeAttribute('aria-busy');
    requestAnimationFrame((now) => {
      state.lastTime = now;
      requestAnimationFrame(updateFrame);
    });
  } catch (error) {
    console.error('Body rafting WebGL initialization failed.', error);
    world = null;
    noGl.hidden = false;
    startBtn.disabled = true;
    state.unlocked = new Set(SECTIONS.map((section) => section.id));
    renderCodex();
    renderUI();
  }
})();
