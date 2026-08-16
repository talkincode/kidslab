/* ============================================================
   🧊 制冰实验室 · KidsLab
   蒸汽压缩制冷循环教学模型：压缩机→冷凝器→节流→蒸发器
   ============================================================ */
(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '制冰实验室 · KidsLab',
      back: '返回平台',
      title: '制冰实验室',
      muted: '打开声音',
      unmuted: '关闭声音',
      theme: '切换主题',
      powerOff: '待机',
      powerOn: '制冷中',
      doorOpen: '门开着',
      doorClosed: '门关好',
      moldTemp: '模盒温度',
      iceProgress: '结冰进度',
      roomHeat: '房间热量',
      cubes: '收获冰块',
      legendCold: '蓝箭头 = 吸热',
      legendHot: '橙箭头 = 放热',
      legendLoop: '点彩色标签看原理',
      controlDesk: 'ICE LAB / 操作台',
      consoleTitle: '制冰机控制',
      fill: '灌水',
      power: '开压缩机',
      powerStop: '关压缩机',
      speed: '压缩机功率',
      slow: '慢',
      mid: '中',
      fast: '快',
      door: '打开箱门',
      doorClose: '关上箱门',
      harvest: '取冰',
      reset: '重开本关',
      hint: '小提示',
      check: '检查实验',
      next: '下一关',
      loopTitle: '冷媒四步旅行',
      stepComp: '① 压缩机',
      stepCompD: '加压升温',
      stepCond: '② 冷凝器',
      stepCondD: '向房间放热',
      stepExp: '③ 节流阀',
      stepExpD: '降压变冷',
      stepEvap: '④ 蒸发器',
      stepEvapD: '吸走水的热',
      finalKicker: '制冰机原理通关',
      finalTitle: '小小制冷工程师！',
      finalText: '你看懂了：压缩机做功，蒸发器吸热结冰，冷凝器把热甩到房间——热被搬走了，不是消失了。',
      playAgain: '再开一局',
      roomWarm: '微暖',
      roomHot: '变热',
      roomToasty: '热乎乎',
      tip0: '先灌水。',
      filled: '模盒灌满清水啦。关好门，打开压缩机开始搬热。',
      alreadyFilled: '模盒里已经有水了。',
      needWater: '模盒是空的——先灌水再制冷。',
      compressorOn: '压缩机嗡嗡转起来！冷媒开始闭环旅行。',
      compressorOff: '压缩机停下了，冷媒不再搬热。',
      doorOpened: '门开了：暖空气溜进来，结冰会变慢。',
      doorShut: '门关好了，冷气留在里面。',
      harvestReady: '冰块冻实了！按下「取冰」。',
      harvested: (n) => `收获 ${n} 块冰！热已经搬到房间那边了。`,
      harvestEmpty: '还没冻好，不能取冰。',
      noIceYet: '还没有结冰进度，继续开着压缩机。',
      missionOk: '本关完成！冷媒把热从水里搬到了房间。',
      missionFail: '还差一点，看看提示再试。',
      idleHint: '小提示：灌水 → 关好门 → 开压缩机，盯着模盒温度往 0°C 掉。',
      labelComp: '压缩机',
      labelCond: '冷凝器',
      labelExp: '节流阀',
      labelEvap: '蒸发器',
      labelMolds: '冰格',
      labelRoom: '房间空气',
      labelWater: '水',
      labelIce: '冰',
      heatOut: '热出去',
      heatIn: '吸热',
      workIn: '做功',
      m1k: '第一关 · 结出第一块冰',
      m1t: '给模盒灌水，打开压缩机',
      m1d: '看着模盒降温到 0°C，结冰进度满格后取冰。',
      m1lesson: '蒸发器里的冷媒吸热汽化，水的热被搬走，才会结冰。',
      m1hint: '灌水后开压缩机。门尽量关着，功率可调到中或快。',
      m1console: '结冰启动台',
      m2k: '第二关 · 看懂冷媒环',
      m2t: '让回路完整转起来',
      m2d: '压缩机开着运转一会儿，让四个站点依次亮起，并结出冰块。',
      m2lesson: '冷媒闭环：压缩→冷凝放热→节流降温→蒸发吸热，再回到压缩机。',
      m2hint: '保持压缩机开启约几秒，观察右侧「冷媒四步旅行」轮流高亮。',
      m2console: '回路观察台',
      m3k: '第三关 · 热去哪了？',
      m3t: '发现房间变热',
      m3d: '制出冰块，并让房间热量条升到“变热”。开门对照：开门会拖慢结冰。',
      m3lesson: '热没有消失：从水里吸走的热，加上压缩机做的功，都从冷凝器甩进房间。',
      m3hint: '关着门快速制冰；看冷凝器橙箭头和房间热量。也可短时开门对比速度。',
      m3console: '热量追踪台',
      m4k: '第四关 · 冰厂交付',
      m4t: '收获 12 块冰',
      m4d: '多轮灌水—制冷—取冰，凑齐 12 块冰（两盘）交付订单。',
      m4lesson: '制冰机就是一台小热泵：不断把模盒的热搬到外面。',
      m4hint: '取冰后模盒会空，再灌水继续。功率开大可加速，但房间会更热。',
      m4console: '交付操作台',
      checkNeedIce: '先把结冰进度做满并取一次冰。',
      checkNeedLoop: '再让压缩机多转一会儿，四个站点都要亮过。',
      checkNeedRoom: '房间还不够热——继续制冷，看冷凝器放热。',
      checkNeedCubes: (n) => `还差 ${n} 块冰，继续灌水制冰吧。`,
      processIdleBadge: '待机',
      processIdleTitle: '准备开始',
      processIdleText: '灌水并打开压缩机后，这里会跟着冷媒回路讲解每一步原理。',
      processNow: '正在发生',
      tipCompBadge: '① 压缩',
      tipCompTitle: '压缩机在做功',
      tipCompText: '冷媒蒸汽被压紧：压力升高，温度也升高，才能把热“抬”到比房间还热。',
      tipCondBadge: '② 冷凝',
      tipCondTitle: '冷凝器向房间放热',
      tipCondText: '高压热蒸汽在散热管里把热甩给房间空气，自己变成液体——所以机身侧面会变烫。',
      tipExpBadge: '③ 节流',
      tipExpTitle: '节流阀突然降压',
      tipExpText: '液态冷媒穿过细阀，压力骤降，温度跟着掉下来，准备去吸热。',
      tipEvapBadge: '④ 蒸发',
      tipEvapTitle: '蒸发器偷走水的热',
      tipEvapText: '又冷又低压的液态冷媒在冰格下方吸热汽化，水的热量被搬走，模盒才会变冷。',
      tipCoolBadge: '降温中',
      tipCoolTitle: '水在失去热量',
      tipCoolText: '热从水 → 蒸发器 → 冷媒环，再被搬到冷凝器。温度还在 0°C 以上时，主要是在“降温”。',
      tipZeroBadge: '到 0°C',
      tipZeroTitle: '开始结冰了',
      tipZeroText: '大约 0°C 时水开始凝固。结冰还要继续吸走“潜热”，所以进度条不会一下子跳满。',
      tipFreezeBadge: '结冰中',
      tipFreezeTitle: '液态变固态',
      tipFreezeText: '冰格里的水慢慢变成冰晶。冷媒仍在蒸发器吸热，结冰进度会一点点涨。',
      tipDoorBadge: '漏热',
      tipDoorTitle: '箱门开着，结冰变慢',
      tipDoorText: '暖空气跑进来，等于多了一堆要搬走的热。原理没坏，只是负担变重了。',
      tipRoomBadge: '房间变热',
      tipRoomTitle: '热没有消失',
      tipRoomText: '水里被吸走的热 + 压缩机做的功，都从冷凝器进了房间。制冰机是在“搬热”，不是消灭热。',
      tipLoopBadge: '闭环',
      tipLoopTitle: '冷媒又回到起点',
      tipLoopText: '蒸发后的低压蒸汽回到压缩机，四步旅行重新开始：压缩→冷凝→节流→蒸发。',
      tipEmptyBadge: '空模盒',
      tipEmptyTitle: '先灌水再制冷',
      tipEmptyText: '没有水就没有“被搬走的热”的对象。灌满模盒，回路才有用武之地。',
      tipReadyBadge: '可取冰',
      tipReadyTitle: '冰块冻实了',
      tipReadyText: '潜热被吸得差不多了。取冰后热已经在房间侧；空模盒可以再灌水开下一盘。',
      pinHint: '点场景边缘的编号圆点看原理；名字在外侧弹出，不挡住机器。',
      pinClose: '关闭说明',
      pinMolds: '冰格',
      pinEvap: '蒸发器',
      pinComp: '压缩机',
      pinCond: '冷凝器',
      pinExp: '节流阀',
      pinRoom: '房间热',
      pinRoleMolds: '水在这里降温、结冰',
      pinRoleEvap: '回路第④步 · 吸热',
      pinRoleComp: '回路第①步 · 做功加压',
      pinRoleCond: '回路第②步 · 向房间放热',
      pinRoleExp: '回路第③步 · 降压变冷',
      pinRoleRoom: '热最终去的地方',
      pinLiveOff: '现在：机器待机。打开压缩机后，标签会轻轻闪，告诉你冷媒走到哪一步。',
      pinLiveComp: '现在：压缩机正在加压，把冷媒温度抬高。',
      pinLiveCond: '现在：冷凝器正在把热甩进房间，管子发烫。',
      pinLiveExp: '现在：节流阀让高压液体突然变低压、变冷。',
      pinLiveEvap: '现在：蒸发器正在从冰格吸热，水在变冷/结冰。',
      pinLiveMoldsCool: '现在：模盒还在 0°C 以上，主要是降温。',
      pinLiveMoldsFreeze: '现在：大约 0°C，水正在慢慢结成冰（还要吸潜热）。',
      pinLiveMoldsReady: '现在：冰块冻实了，可以取冰。',
      pinLiveMoldsEmpty: '现在：模盒是空的，先灌水。',
      pinLiveRoom: '现在：房间侧正在变热——热被搬走了，不是消失了。',
      pinLiveDoor: '现在：门开着，暖空气漏进来，结冰会变慢。',
      pinLiveWait: '现在：制冷环在转；冷媒还没走到这一站，标签亮起时就是它的回合。',
      canvasDoor: '门',
      canvasFan: '散热',
    },
    en: {
      doc: 'Ice Maker Lab · KidsLab',
      back: 'Back',
      title: 'Ice Maker Lab',
      muted: 'Unmute',
      unmuted: 'Mute',
      theme: 'Toggle theme',
      powerOff: 'Standby',
      powerOn: 'Cooling',
      doorOpen: 'Door open',
      doorClosed: 'Door shut',
      moldTemp: 'Mold temp',
      iceProgress: 'Ice progress',
      roomHeat: 'Room heat',
      cubes: 'Harvested',
      legendCold: 'Blue arrow = heat in',
      legendHot: 'Orange arrow = heat out',
      legendLoop: 'Tap pins to read principles',
      controlDesk: 'ICE LAB / Console',
      consoleTitle: 'Ice maker controls',
      fill: 'Fill water',
      power: 'Start compressor',
      powerStop: 'Stop compressor',
      speed: 'Compressor power',
      slow: 'Slow',
      mid: 'Mid',
      fast: 'Fast',
      door: 'Open door',
      doorClose: 'Close door',
      harvest: 'Harvest',
      reset: 'Restart mission',
      hint: 'Hint',
      check: 'Check lab',
      next: 'Next mission',
      loopTitle: 'Four-stop refrigerant trip',
      stepComp: '① Compressor',
      stepCompD: 'Pressurize & heat',
      stepCond: '② Condenser',
      stepCondD: 'Dump heat to room',
      stepExp: '③ Expansion',
      stepExpD: 'Drop pressure',
      stepEvap: '④ Evaporator',
      stepEvapD: 'Steal heat from water',
      finalKicker: 'Ice-maker principles cleared',
      finalTitle: 'Junior refrigeration engineer!',
      finalText: 'You saw it: compressor work, evaporator freezes water, condenser dumps heat into the room — heat was moved, not deleted.',
      playAgain: 'Play again',
      roomWarm: 'Warmish',
      roomHot: 'Warmer',
      roomToasty: 'Toasty',
      tip0: 'Fill the molds first.',
      filled: 'Molds are full. Shut the door and start the compressor to move heat.',
      alreadyFilled: 'The molds already have water.',
      needWater: 'Molds are empty — fill water first.',
      compressorOn: 'Compressor humming! Refrigerant starts its loop.',
      compressorOff: 'Compressor stopped. Heat moving pauses.',
      doorOpened: 'Door open: warm air sneaks in and freezing slows.',
      doorShut: 'Door closed. Cold stays inside.',
      harvestReady: 'Ice is solid! Press Harvest.',
      harvested: (n) => `Harvested ${n} cubes! That heat is now on the room side.`,
      harvestEmpty: 'Not frozen enough to harvest.',
      noIceYet: 'No ice progress yet — keep the compressor on.',
      missionOk: 'Mission complete! Heat moved from water to the room.',
      missionFail: 'Not quite — check the hint and try again.',
      idleHint: 'Hint: fill → keep door shut → start compressor, watch mold temp fall toward 0°C.',
      labelComp: 'Compressor',
      labelCond: 'Condenser',
      labelExp: 'Expansion',
      labelEvap: 'Evaporator',
      labelMolds: 'Ice tray',
      labelRoom: 'Room air',
      labelWater: 'Water',
      labelIce: 'Ice',
      heatOut: 'heat out',
      heatIn: 'heat in',
      workIn: 'work in',
      m1k: 'Mission 1 · First ice',
      m1t: 'Fill molds and run the compressor',
      m1d: 'Cool the molds to 0°C, fill the ice bar, then harvest.',
      m1lesson: 'Refrigerant evaporates in the evaporator, stealing heat so water can freeze.',
      m1hint: 'Fill water, start the compressor, keep the door closed, power mid or fast.',
      m1console: 'Freeze start desk',
      m2k: 'Mission 2 · Read the loop',
      m2t: 'Keep the full loop spinning',
      m2d: 'Run the compressor until all four stations light up and ice forms.',
      m2lesson: 'Closed loop: compress → condense (heat out) → expand → evaporate (heat in).',
      m2hint: 'Leave the compressor on for a few seconds and watch the four-stop card highlight.',
      m2console: 'Loop watch desk',
      m3k: 'Mission 3 · Where did heat go?',
      m3t: 'Catch the room warming up',
      m3d: 'Make ice and raise room heat to “Warmer”. Try a short open-door contrast.',
      m3lesson: 'Heat is not destroyed: heat from the water plus compressor work leaves through the condenser.',
      m3hint: 'Freeze with the door shut; watch orange condenser arrows and the room-heat meter.',
      m3console: 'Heat tracker desk',
      m4k: 'Mission 4 · Ice plant order',
      m4t: 'Deliver 12 cubes',
      m4d: 'Repeat fill → freeze → harvest until you hold 12 cubes (two trays).',
      m4lesson: 'An ice maker is a tiny heat pump moving tray heat outside again and again.',
      m4hint: 'After harvest the tray empties — fill again. Higher power is faster but toastier.',
      m4console: 'Delivery desk',
      checkNeedIce: 'Fill the ice bar and harvest once first.',
      checkNeedLoop: 'Run the compressor longer so every station lights up.',
      checkNeedRoom: 'Room is not warm enough yet — keep cooling and watch the condenser.',
      checkNeedCubes: (n) => `${n} more cubes to go — fill and freeze again.`,
      processIdleBadge: 'Idle',
      processIdleTitle: 'Ready to start',
      processIdleText: 'After you fill water and start the compressor, tips here follow each step of the loop.',
      processNow: 'Now',
      tipCompBadge: '① Compress',
      tipCompTitle: 'Compressor does work',
      tipCompText: 'Refrigerant vapor is squeezed: pressure and temperature rise so heat can be lifted above room temperature.',
      tipCondBadge: '② Condense',
      tipCondTitle: 'Condenser dumps heat to the room',
      tipCondText: 'Hot high-pressure vapor gives heat to room air and turns into liquid — that is why the side of the machine feels warm.',
      tipExpBadge: '③ Expand',
      tipExpTitle: 'Expansion valve drops pressure',
      tipExpText: 'Liquid refrigerant squeezes through a tiny valve: pressure plunges and temperature falls, ready to absorb heat.',
      tipEvapBadge: '④ Evaporate',
      tipEvapTitle: 'Evaporator steals heat from water',
      tipEvapText: 'Cold low-pressure liquid boils under the tray, taking heat from the water so the molds cool down.',
      tipCoolBadge: 'Cooling',
      tipCoolTitle: 'Water is losing heat',
      tipCoolText: 'Heat flows water → evaporator → loop → condenser. Above 0°C this is mostly sensible cooling.',
      tipZeroBadge: 'At 0°C',
      tipZeroTitle: 'Freezing begins',
      tipZeroText: 'Near 0°C water starts to solidify. Freezing still needs latent heat removal, so the bar fills gradually.',
      tipFreezeBadge: 'Freezing',
      tipFreezeTitle: 'Liquid becomes solid',
      tipFreezeText: 'Water in the molds slowly turns into ice crystals while the evaporator keeps absorbing heat.',
      tipDoorBadge: 'Heat leak',
      tipDoorTitle: 'Open door slows freezing',
      tipDoorText: 'Warm room air rushes in, adding extra heat to remove. The cycle still works — the load just got heavier.',
      tipRoomBadge: 'Room warms',
      tipRoomTitle: 'Heat was moved, not deleted',
      tipRoomText: 'Heat taken from the water plus compressor work both leave through the condenser into the room.',
      tipLoopBadge: 'Loop',
      tipLoopTitle: 'Back to the start',
      tipLoopText: 'Low-pressure vapor returns to the compressor and the four-stop trip restarts: compress → condense → expand → evaporate.',
      tipEmptyBadge: 'Empty',
      tipEmptyTitle: 'Fill water first',
      tipEmptyText: 'Without water there is little heat to move from the tray. Fill the molds so the loop has a job.',
      tipReadyBadge: 'Ready',
      tipReadyTitle: 'Ice is solid',
      tipReadyText: 'Most latent heat is gone. Harvest the cubes — that heat is already on the room side — then refill for another tray.',
      pinHint: 'Tap the numbered dots on the edges — names pop outward so the machine stays visible.',
      pinClose: 'Close',
      pinMolds: 'Ice tray',
      pinEvap: 'Evaporator',
      pinComp: 'Compressor',
      pinCond: 'Condenser',
      pinExp: 'Expansion',
      pinRoom: 'Room heat',
      pinRoleMolds: 'Water cools and freezes here',
      pinRoleEvap: 'Loop step ④ · absorb heat',
      pinRoleComp: 'Loop step ① · work & pressurize',
      pinRoleCond: 'Loop step ② · dump heat to room',
      pinRoleExp: 'Loop step ③ · drop pressure',
      pinRoleRoom: 'Where the heat ends up',
      pinLiveOff: 'Now: standby. Start the compressor and pins will gently glow to show the active stop.',
      pinLiveComp: 'Now: compressor is raising pressure and temperature.',
      pinLiveCond: 'Now: condenser is dumping heat into the room.',
      pinLiveExp: 'Now: expansion valve drops pressure so refrigerant gets cold.',
      pinLiveEvap: 'Now: evaporator is stealing heat from the tray.',
      pinLiveMoldsCool: 'Now: molds are still above 0°C — mostly cooling.',
      pinLiveMoldsFreeze: 'Now: near 0°C, water is slowly turning to ice (latent heat).',
      pinLiveMoldsReady: 'Now: ice is solid — harvest when ready.',
      pinLiveMoldsEmpty: 'Now: tray is empty — fill water first.',
      pinLiveRoom: 'Now: the room side is warming — heat was moved, not deleted.',
      pinLiveDoor: 'Now: door is open; warm air leaks in and freezing slows.',
      pinLiveWait: 'Now: the loop is running; this stop waits its turn — it glows when active.',
      canvasDoor: 'Door',
      canvasFan: 'Fan',
    },
  };

  const MISSIONS = [
    {
      id: 0,
      kicker: 'm1k', title: 'm1t', text: 'm1d', lesson: 'm1lesson', hint: 'm1hint', console: 'm1console', icon: '❄️',
      needHarvest: 1, needLoop: false, needRoom: 0, needCubes: 1,
    },
    {
      id: 1,
      kicker: 'm2k', title: 'm2t', text: 'm2d', lesson: 'm2lesson', hint: 'm2hint', console: 'm2console', icon: '🔁',
      needHarvest: 1, needLoop: true, needRoom: 0, needCubes: 1,
    },
    {
      id: 2,
      kicker: 'm3k', title: 'm3t', text: 'm3d', lesson: 'm3lesson', hint: 'm3hint', console: 'm3console', icon: '🔥',
      needHarvest: 1, needLoop: true, needRoom: 35, needCubes: 1,
    },
    {
      id: 3,
      kicker: 'm4k', title: 'm4t', text: 'm4d', lesson: 'm4lesson', hint: 'm4hint', console: 'm4console', icon: '🏭',
      needHarvest: 0, needLoop: false, needRoom: 0, needCubes: 12,
    },
  ];

  const SAVE_KEY = 'kidslab.ice-maker-lab';
  const SOUND_KEY = 'kidslab.sound.muted';
  const MOLD_COUNT = 6;
  const FREEZE_POINT = 0;
  const AMBIENT = 22;

  const $ = (sel) => document.querySelector(sel);
  const el = {
    missionNumber: $('#missionNumber'),
    missionKicker: $('#missionKicker'),
    missionTitle: $('#missionTitle'),
    missionText: $('#missionText'),
    missionNav: $('#missionNav'),
    status: $('#status'),
    powerBadge: $('#powerBadge'),
    doorBadge: $('#doorBadge'),
    canvas: $('#stage'),
    moldValue: $('#moldValue'),
    iceValue: $('#iceValue'),
    roomValue: $('#roomValue'),
    cubeValue: $('#cubeValue'),
    consoleTitle: $('#consoleTitle'),
    fill: $('#fillBtn'),
    power: $('#powerBtn'),
    speed: $('#speedSlider'),
    speedOut: $('#speedOut'),
    door: $('#doorBtn'),
    harvest: $('#harvestBtn'),
    reset: $('#resetBtn'),
    hint: $('#hintBtn'),
    check: $('#checkBtn'),
    next: $('#nextBtn'),
    lessonCard: $('#lessonCard'),
    lessonIcon: $('#lessonIcon'),
    lessonText: $('#lessonText'),
    loopCard: $('#loopCard'),
    legend: $('#legend'),
    loopSteps: [...document.querySelectorAll('#loopSteps li')],
    sound: $('#soundBtn'),
    theme: $('#themeBtn'),
    lang: $('#langBtn'),
    modal: $('#completeModal'),
    playAgain: $('#playAgainBtn'),
    pinLayer: $('#pinLayer'),
    pinDetail: $('#pinDetail'),
    pinDetailStep: $('#pinDetailStep'),
    pinDetailTitle: $('#pinDetailTitle'),
    pinDetailRole: $('#pinDetailRole'),
    pinDetailBody: $('#pinDetailBody'),
    pinDetailLive: $('#pinDetailLive'),
    pinDetailClose: $('#pinDetailClose'),
    pinHint: $('#pinHint'),
  };

  const ctx = el.canvas.getContext('2d');
  let t = (key) => key;
  let lang = 'zh';
  let missionIndex = 0;
  let unlocked = 0;
  let completed = new Set();
  let missionClear = false;
  let statusTone = '';
  let idleTimer = 0;
  let lastTs = 0;
  let raf = 0;
  let selectedPin = '';
  let lastLoopStage = '';
  let showCoach = false;

  const state = {
    power: false,
    speed: 2, // 1..3
    doorOpen: false,
    water: 0, // 0 empty, 1 full
    moldTemp: AMBIENT,
    ice: 0, // 0..1 freeze fraction
    roomHeat: 0, // 0..100
    cubes: 0,
    loopPhase: 0, // 0..1 around loop
    loopSeen: { comp: false, cond: false, exp: false, evap: false },
    harvestCount: 0,
    particles: [],
    sparks: [],
    shake: 0,
  };

  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    unlocked = Math.min(MISSIONS.length - 1, Math.max(0, Number(saved.unlocked) || 0));
    completed = new Set(Array.isArray(saved.completed)
      ? saved.completed.filter((v) => Number.isInteger(v) && v >= 0 && v < MISSIONS.length)
      : []);
  } catch {
    unlocked = 0;
    completed = new Set();
  }

  /* ---------------- Sound ---------------- */
  class SoundEngine {
    constructor() {
      try {
        this.muted = ['true', '1'].includes(localStorage.getItem(SOUND_KEY));
      } catch {
        this.muted = false;
      }
      this.context = null;
      this.humNodes = null;
    }

    ensure() {
      if (this.muted) return null;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try {
        this.context ||= new AC();
        if (this.context.state === 'suspended') this.context.resume().catch(() => {});
        return this.context;
      } catch {
        return null;
      }
    }

    setMuted(value) {
      this.muted = value;
      try { localStorage.setItem(SOUND_KEY, String(value)); } catch { /* ignore */ }
      if (value) this.stopHum();
      if (value && this.context) this.context.suspend().catch(() => {});
    }

    tone(freq, dur, vol = 0.03, type = 'sine', delay = 0) {
      const c = this.ensure();
      if (!c || vol <= 0) return;
      const start = c.currentTime + delay;
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, start);
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), start + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      o.connect(g).connect(c.destination);
      o.start(start);
      o.stop(start + dur + 0.03);
    }

    click() { this.tone(320, 0.06, 0.02, 'triangle'); }
    fill() {
      this.tone(480, 0.08, 0.02, 'sine');
      this.tone(620, 0.12, 0.018, 'sine', 0.05);
    }
    power(on) {
      if (on) {
        this.tone(90, 0.18, 0.03, 'sawtooth');
        this.tone(180, 0.22, 0.02, 'triangle', 0.05);
        this.startHum();
      } else {
        this.stopHum();
        this.tone(140, 0.12, 0.025, 'triangle');
      }
    }
    success(final = false) {
      [392, 523, 659].forEach((f, i) => this.tone(f, final ? 0.34 : 0.18, 0.032, 'sine', i * 0.08));
    }
    error() {
      this.tone(160, 0.14, 0.035, 'sawtooth');
      this.tone(120, 0.18, 0.028, 'sawtooth', 0.07);
    }
    harvest() {
      this.tone(880, 0.08, 0.025, 'triangle');
      this.tone(1175, 0.14, 0.03, 'sine', 0.05);
      this.tone(1568, 0.18, 0.022, 'sine', 0.12);
    }
    freezeTick() {
      this.tone(1200 + Math.random() * 200, 0.04, 0.008, 'sine');
    }

    startHum() {
      const c = this.ensure();
      if (!c || this.humNodes) return;
      try {
        const o1 = c.createOscillator();
        const o2 = c.createOscillator();
        const g = c.createGain();
        o1.type = 'sine';
        o2.type = 'triangle';
        o1.frequency.value = 58;
        o2.frequency.value = 116;
        g.gain.value = 0.012;
        o1.connect(g);
        o2.connect(g);
        g.connect(c.destination);
        o1.start();
        o2.start();
        this.humNodes = { o1, o2, g };
      } catch {
        this.humNodes = null;
      }
    }

    stopHum() {
      if (!this.humNodes) return;
      try {
        const { o1, o2, g } = this.humNodes;
        const c = this.context;
        if (c && g) {
          g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.08);
        }
        setTimeout(() => {
          try { o1.stop(); o2.stop(); } catch { /* ignore */ }
        }, 100);
      } catch { /* ignore */ }
      this.humNodes = null;
    }

    setHumLevel(speed, on) {
      if (!on) {
        this.stopHum();
        return;
      }
      if (!this.humNodes) this.startHum();
      if (this.humNodes?.g && this.context) {
        const target = 0.008 + speed * 0.006;
        this.humNodes.g.gain.setTargetAtTime(target, this.context.currentTime, 0.08);
        this.humNodes.o1.frequency.setTargetAtTime(48 + speed * 12, this.context.currentTime, 0.1);
        this.humNodes.o2.frequency.setTargetAtTime(96 + speed * 24, this.context.currentTime, 0.1);
      }
    }
  }

  const sound = new SoundEngine();

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        unlocked,
        completed: [...completed],
      }));
    } catch { /* ignore */ }
  }

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, k) { return a + (b - a) * k; }

  function setStatus(msg, tone = '') {
    statusTone = tone;
    el.status.textContent = msg;
    el.status.classList.toggle('is-good', tone === 'good');
    el.status.classList.toggle('is-bad', tone === 'bad');
  }

  const PINS = {
    molds: {
      step: '1', tone: 'cold',
      name: 'pinMolds', role: 'pinRoleMolds',
      title: 'tipCoolTitle', body: 'tipCoolText',
      bodyFreeze: 'tipFreezeText', bodyReady: 'tipReadyText', bodyEmpty: 'tipEmptyText',
    },
    evap: {
      step: '④', tone: 'cold',
      name: 'pinEvap', role: 'pinRoleEvap',
      title: 'tipEvapTitle', body: 'tipEvapText',
    },
    comp: {
      step: '①', tone: 'hot',
      name: 'pinComp', role: 'pinRoleComp',
      title: 'tipCompTitle', body: 'tipCompText',
    },
    cond: {
      step: '②', tone: 'hot',
      name: 'pinCond', role: 'pinRoleCond',
      title: 'tipCondTitle', body: 'tipCondText',
    },
    exp: {
      step: '③', tone: 'cold',
      name: 'pinExp', role: 'pinRoleExp',
      title: 'tipExpTitle', body: 'tipExpText',
    },
    room: {
      step: '热', tone: 'hot',
      name: 'pinRoom', role: 'pinRoleRoom',
      title: 'tipRoomTitle', body: 'tipRoomText',
    },
  };

  function activeLoopStage() {
    if (!state.power) return '';
    const phase = state.loopPhase;
    if (phase < 0.25) return 'comp';
    if (phase < 0.5) return 'cond';
    if (phase < 0.75) return 'exp';
    return 'evap';
  }

  function pinBodyKey(id) {
    const conf = PINS[id];
    if (!conf) return 'tip0';
    if (id === 'molds') {
      if (state.water < 1 && state.ice < 1) return conf.bodyEmpty;
      if (state.ice >= 0.98) return conf.bodyReady;
      if (state.moldTemp <= 0 || state.ice > 0.05) return conf.bodyFreeze;
      return conf.body;
    }
    return conf.body;
  }

  function pinLiveKey(id) {
    if (id === 'room') return state.power ? 'pinLiveRoom' : 'pinLiveOff';
    if (id === 'molds') {
      if (state.doorOpen && state.power) return 'pinLiveDoor';
      if (state.water < 1 && state.ice < 1) return 'pinLiveMoldsEmpty';
      if (state.ice >= 0.98) return 'pinLiveMoldsReady';
      if (state.moldTemp <= 0 || state.ice > 0.05) return 'pinLiveMoldsFreeze';
      if (state.power) return 'pinLiveMoldsCool';
      return 'pinLiveOff';
    }
    if (!state.power) return 'pinLiveOff';
    const stage = activeLoopStage();
    if (id === 'comp') return stage === 'comp' ? 'pinLiveComp' : 'pinLiveWait';
    if (id === 'cond') return stage === 'cond' ? 'pinLiveCond' : 'pinLiveWait';
    if (id === 'exp') return stage === 'exp' ? 'pinLiveExp' : 'pinLiveWait';
    if (id === 'evap') return stage === 'evap' ? 'pinLiveEvap' : 'pinLiveWait';
    return 'pinLiveWait';
  }

  function openPin(id, opts = {}) {
    const conf = PINS[id];
    if (!conf || !el.pinDetail) return;
    selectedPin = id;
    const titleKey = id === 'molds'
      ? (state.ice >= 0.98 ? 'tipReadyTitle' : (state.moldTemp <= 0 || state.ice > 0.05 ? 'tipFreezeTitle' : 'tipCoolTitle'))
      : conf.title;
    el.pinDetail.hidden = false;
    el.pinDetail.classList.toggle('is-hot', conf.tone === 'hot');
    el.pinDetail.classList.toggle('is-cold', conf.tone === 'cold');
    el.pinDetailStep.textContent = conf.step;
    el.pinDetailTitle.textContent = t(titleKey);
    el.pinDetailRole.textContent = t(conf.role);
    el.pinDetailBody.textContent = t(pinBodyKey(id));
    el.pinDetailLive.hidden = false;
    el.pinDetailLive.textContent = t(pinLiveKey(id));
    document.querySelectorAll('.pin').forEach((node) => {
      node.classList.toggle('is-active', node.dataset.pin === id);
    });
    // lesson card follows the pin the kid chose (stable)
    if (el.lessonText) {
      el.lessonIcon.textContent = conf.tone === 'hot' ? '🔥' : (id === 'molds' ? '🧊' : '❄️');
      el.lessonText.textContent = t(pinBodyKey(id));
    }
    // highlight matching loop step card
    el.loopSteps.forEach((node) => {
      const step = node.dataset.step;
      const match = (id === 'comp' && step === 'comp')
        || (id === 'cond' && step === 'cond')
        || (id === 'exp' && step === 'exp')
        || (id === 'evap' && step === 'evap')
        || (id === 'molds' && step === 'evap')
        || (id === 'room' && step === 'cond');
      node.classList.toggle('is-hot', match && (step === 'comp' || step === 'cond'));
      node.classList.toggle('is-cold', match && (step === 'exp' || step === 'evap'));
    });
    if (opts.track !== false) window.cool?.track?.(`pin_${id}`);
    if (opts.sound !== false) sound.click();
    syncCoach();
  }

  function closePin() {
    selectedPin = '';
    if (el.pinDetail) el.pinDetail.hidden = true;
    document.querySelectorAll('.pin').forEach((node) => node.classList.remove('is-active'));
    // restore mission lesson when pins closed
    try {
      const m = mission();
      if (el.lessonIcon) el.lessonIcon.textContent = m.icon;
      if (el.lessonText) el.lessonText.textContent = t(m.lesson);
    } catch { /* boot */ }
    syncCoach();
  }

  function updatePinLiveChrome() {
    const stage = activeLoopStage();
    document.querySelectorAll('.pin').forEach((node) => {
      const id = node.dataset.pin;
      const live = state.power && (
        (id === stage)
        || (id === 'molds' && (stage === 'evap' || state.ice > 0))
        || (id === 'room' && state.power)
      );
      node.classList.toggle('is-live', !!live);
    });
    // If a detail panel is open, only refresh the "now" line — never auto-swap the whole card
    if (selectedPin && el.pinDetail && !el.pinDetail.hidden) {
      el.pinDetailLive.hidden = false;
      el.pinDetailLive.textContent = t(pinLiveKey(selectedPin));
      // molds title/body can gently update when freeze state changes, but only while selected
      if (selectedPin === 'molds') {
        const titleKey = state.ice >= 0.98 ? 'tipReadyTitle'
          : (state.moldTemp <= 0 || state.ice > 0.05 ? 'tipFreezeTitle' : 'tipCoolTitle');
        el.pinDetailTitle.textContent = t(titleKey);
        el.pinDetailBody.textContent = t(pinBodyKey('molds'));
      }
    }
    // loop step highlight follows live stage only when no pin selected
    if (!selectedPin) {
      el.loopSteps.forEach((node) => {
        const step = node.dataset.step;
        node.classList.toggle('is-hot', state.power && (step === 'comp' || step === 'cond') && step === stage);
        node.classList.toggle('is-cold', state.power && (step === 'exp' || step === 'evap') && step === stage);
        if (state.power && step === stage) state.loopSeen[step] = true;
      });
    } else if (state.power) {
      const stageNow = stage;
      if (stageNow) state.loopSeen[stageNow] = true;
    }
  }

  function speedLabel() {
    return state.speed === 1 ? t('slow') : state.speed === 3 ? t('fast') : t('mid');
  }

  function roomLabel() {
    if (state.roomHeat < 20) return t('roomWarm');
    if (state.roomHeat < 55) return t('roomHot');
    return t('roomToasty');
  }

  function mission() { return MISSIONS[missionIndex]; }

  function resetSim(keepCubes = false) {
    state.power = false;
    state.doorOpen = false;
    state.water = 0;
    state.moldTemp = AMBIENT;
    state.ice = 0;
    if (!keepCubes) {
      state.roomHeat = missionIndex >= 2 ? Math.min(state.roomHeat, 12) : 0;
      if (missionIndex < 3) state.cubes = 0;
    }
    if (missionIndex < 3) state.cubes = keepCubes ? state.cubes : 0;
    state.loopPhase = 0;
    state.loopSeen = { comp: false, cond: false, exp: false, evap: false };
    state.harvestCount = keepCubes ? state.harvestCount : 0;
    state.particles = [];
    state.sparks = [];
    state.shake = 0;
    sound.stopHum();
    missionClear = false;
    el.next.hidden = true;
    idleTimer = 0;
    lastLoopStage = '';
    closePin();
  }

  function fillWater() {
    sound.click();
    if (state.water >= 1 && state.ice < 1) {
      setStatus(t('alreadyFilled'), 'bad');
      sound.error();
      return;
    }
    if (state.ice >= 1) {
      setStatus(t('harvestReady'), 'good');
      return;
    }
    state.water = 1;
    state.moldTemp = Math.min(state.moldTemp, AMBIENT);
    state.ice = 0;
    for (let i = 0; i < 14; i++) {
      state.particles.push({
        kind: 'drop',
        x: 0.42 + Math.random() * 0.2,
        y: 0.18,
        vx: (Math.random() - 0.5) * 0.04,
        vy: 0.12 + Math.random() * 0.1,
        life: 0.5 + Math.random() * 0.4,
      });
    }
    sound.fill();
    setStatus(t('filled'), 'good');
    // Suggest opening the molds / evaporator pin, but do not auto-spam
    if (!selectedPin) {
      showCoach = true;
      el.lessonIcon.textContent = '💧';
      el.lessonText.textContent = t('tipEvapText');
      syncCoach();
    }
    window.cool?.track?.('fill_water');
    idleTimer = 0;
  }

  function togglePower() {
    if (!state.power && state.water < 1 && state.ice < 1) {
      setStatus(t('needWater'), 'bad');
      sound.error();
      return;
    }
    state.power = !state.power;
    sound.power(state.power);
    setStatus(state.power ? t('compressorOn') : t('compressorOff'), state.power ? 'good' : '');
    if (state.power) {
      lastLoopStage = '';
      // Keep current detail if open; otherwise just glow live pins
    }
    window.cool?.track?.(state.power ? 'compressor_on' : 'compressor_off');
    idleTimer = 0;
    renderChrome();
  }

  function toggleDoor() {
    state.doorOpen = !state.doorOpen;
    sound.click();
    setStatus(state.doorOpen ? t('doorOpened') : t('doorShut'), state.doorOpen ? 'bad' : 'good');
    if (state.doorOpen && selectedPin === 'molds') updatePinLiveChrome();
    window.cool?.track?.(state.doorOpen ? 'door_open' : 'door_close');
    idleTimer = 0;
    renderChrome();
  }

  function harvest() {
    if (state.ice < 0.98 || state.water < 1) {
      setStatus(t('harvestEmpty'), 'bad');
      sound.error();
      return;
    }
    const gained = MOLD_COUNT;
    state.cubes = Math.min(99, state.cubes + gained);
    state.harvestCount += 1;
    state.water = 0;
    state.ice = 0;
    state.moldTemp = Math.min(AMBIENT, state.moldTemp + 8);
    state.shake = 0.45;
    for (let i = 0; i < 18; i++) {
      state.sparks.push({
        x: 0.45 + Math.random() * 0.18,
        y: 0.48 + Math.random() * 0.1,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.1 - Math.random() * 0.2,
        life: 0.6 + Math.random() * 0.5,
        ice: true,
      });
    }
    sound.harvest();
    setStatus(t('harvested', gained), 'good');
    window.cool?.track?.('harvest_ice');
    window.cool?.stage?.(`mission${missionIndex + 1}`);
    idleTimer = 0;
    maybeAutoClear();
    renderChrome();
  }

  function loopComplete() {
    const s = state.loopSeen;
    return s.comp && s.cond && s.exp && s.evap;
  }

  function missionSatisfied() {
    const m = mission();
    if (m.needCubes && state.cubes < m.needCubes) return false;
    if (m.needHarvest && state.harvestCount < m.needHarvest) return false;
    if (m.needLoop && !loopComplete()) return false;
    if (m.needRoom && state.roomHeat < m.needRoom) return false;
    return true;
  }

  function failReason() {
    const m = mission();
    if (m.needHarvest && state.harvestCount < m.needHarvest) return t('checkNeedIce');
    if (m.needLoop && !loopComplete()) return t('checkNeedLoop');
    if (m.needRoom && state.roomHeat < m.needRoom) return t('checkNeedRoom');
    if (m.needCubes && state.cubes < m.needCubes) return t('checkNeedCubes', m.needCubes - state.cubes);
    return t('missionFail');
  }

  function maybeAutoClear() {
    if (!missionClear && missionSatisfied()) {
      clearMission(true);
    }
  }

  function clearMission(auto = false) {
    if (missionClear) return;
    missionClear = true;
    completed.add(missionIndex);
    unlocked = Math.max(unlocked, Math.min(MISSIONS.length - 1, missionIndex + 1));
    save();
    sound.success(missionIndex === MISSIONS.length - 1);
    setStatus(t('missionOk'), 'good');
    el.next.hidden = missionIndex >= MISSIONS.length - 1;
    window.cool?.stage?.(`clear${missionIndex + 1}`);
    if (missionIndex >= MISSIONS.length - 1) {
      window.cool?.complete?.();
      el.modal.hidden = false;
    }
    renderChrome();
    if (!auto) { /* checked manually */ }
  }

  function checkMission() {
    sound.click();
    if (missionSatisfied()) {
      clearMission(false);
    } else {
      sound.error();
      setStatus(failReason(), 'bad');
    }
  }

  function syncCoach() {
    if (el.lessonCard) el.lessonCard.hidden = !showCoach && !selectedPin;
    if (el.loopCard) el.loopCard.hidden = !showCoach && !state.power;
    if (el.legend) el.legend.hidden = !showCoach && !state.power;
    if (el.pinHint) el.pinHint.hidden = true;
  }

  function goMission(index) {
    if (index > unlocked) return;
    missionIndex = index;
    showCoach = false;
    selectedPin = '';
    if (el.pinDetail) el.pinDetail.hidden = true;
    resetSim(missionIndex === 3 && state.cubes > 0);
    if (missionIndex < 3) {
      state.cubes = 0;
      state.harvestCount = 0;
      state.roomHeat = 0;
    }
    missionClear = completed.has(missionIndex);
    el.next.hidden = !missionClear || missionIndex >= MISSIONS.length - 1;
    setStatus(t('tip0'));
    applyMissionCopy();
    renderChrome();
    syncCoach();
    window.cool?.stage?.(`mission${missionIndex + 1}`);
  }

  function applyMissionCopy() {
    const m = mission();
    el.missionNumber.textContent = String(missionIndex + 1).padStart(2, '0');
    el.missionKicker.textContent = t(m.kicker);
    el.missionTitle.textContent = t(m.title);
    el.missionText.textContent = t(m.text);
    el.consoleTitle.textContent = t(m.console);
    el.lessonIcon.textContent = m.icon;
    el.lessonText.textContent = t(m.lesson);
    // loop cards open matching pin
    el.loopSteps.forEach((node) => {
      node.style.cursor = 'pointer';
      node.onclick = () => {
        const step = node.dataset.step;
        const map = { comp: 'comp', cond: 'cond', exp: 'exp', evap: 'evap' };
        openPin(map[step] || 'evap');
      };
    });

    el.missionNav.innerHTML = '';
    MISSIONS.forEach((item, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = String(i + 1);
      b.disabled = i > unlocked;
      b.classList.toggle('is-active', i === missionIndex);
      b.classList.toggle('is-done', completed.has(i));
      b.setAttribute('aria-label', t(item.kicker));
      b.addEventListener('click', () => {
        sound.click();
        goMission(i);
      });
      el.missionNav.appendChild(b);
    });
  }

  function renderChrome() {
    el.speedOut.textContent = speedLabel();
    el.power.classList.toggle('is-on', state.power);
    el.power.setAttribute('aria-pressed', String(state.power));
    const powerLabel = el.power.querySelector('span:last-of-type');
    if (powerLabel) powerLabel.textContent = state.power ? t('powerStop') : t('power');
    const doorLabel = el.door.querySelector('span:last-of-type');
    if (doorLabel) doorLabel.textContent = state.doorOpen ? t('doorClose') : t('door');
    el.door.setAttribute('aria-pressed', String(state.doorOpen));

    el.powerBadge.classList.toggle('is-on', state.power);
    el.powerBadge.querySelector('span').textContent = state.power ? t('powerOn') : t('powerOff');
    el.doorBadge.hidden = !state.doorOpen;
    el.doorBadge.classList.toggle('is-on', state.doorOpen);

    const ready = state.ice >= 0.98 && state.water >= 1;
    el.harvest.disabled = !ready;
    el.harvest.classList.toggle('is-ready', ready);

    el.moldValue.innerHTML = `${state.moldTemp.toFixed(0)} <small>°C</small>`;
    el.iceValue.innerHTML = `${Math.round(state.ice * 100)} <small>%</small>`;
    el.roomValue.innerHTML = `${roomLabel()} <small>${Math.round(state.roomHeat)}</small>`;
    const cubeGoal = Math.max(6, mission().needCubes || 6);
    el.cubeValue.innerHTML = `${state.cubes} <small>/ ${cubeGoal}</small>`;

    el.sound.textContent = sound.muted ? '🔇' : '🔊';
    el.sound.setAttribute('aria-pressed', String(!sound.muted));
    el.sound.setAttribute('aria-label', sound.muted ? t('muted') : t('unmuted'));

    updatePinLiveChrome();
    if (el.pinDetailClose) el.pinDetailClose.setAttribute('aria-label', t('pinClose'));
    syncCoach();
  }

  /* ---------------- Simulation ---------------- */
  function step(dt) {
    idleTimer += dt;
    if (idleTimer > 28 && !missionClear) {
      setStatus(t('idleHint'));
      idleTimer = 0;
    }

    // particles
    state.particles = state.particles.filter((p) => {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 0.35 * dt;
      return p.life > 0;
    });
    state.sparks = state.sparks.filter((p) => {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 0.4 * dt;
      return p.life > 0;
    });
    if (state.shake > 0) state.shake = Math.max(0, state.shake - dt);

    const powerFactor = state.power ? (0.55 + state.speed * 0.35) : 0;
    const doorLeak = state.doorOpen ? 1 : 0;

    if (state.power) {
      state.loopPhase = (state.loopPhase + dt * (0.22 + state.speed * 0.12)) % 1;
      sound.setHumLevel(state.speed, true);

      // cooling load
      if (state.water > 0) {
        const coolRate = 5.8 * powerFactor * (state.doorOpen ? 0.45 : 1);
        const heatLeak = doorLeak * 5.5;
        state.moldTemp -= (coolRate - heatLeak) * dt;
        state.moldTemp = clamp(state.moldTemp, -18, AMBIENT + 5);

        if (state.moldTemp <= FREEZE_POINT) {
          const freezeRate = 0.085 * powerFactor * (state.doorOpen ? 0.4 : 1) * (1 + (FREEZE_POINT - state.moldTemp) / 20);
          const prev = state.ice;
          state.ice = clamp(state.ice + freezeRate * dt, 0, 1);
          if (state.ice > prev && Math.random() < dt * 3) sound.freezeTick();
          if (prev < 0.98 && state.ice >= 0.98) {
            setStatus(t('harvestReady'), 'good');
            if (selectedPin === 'molds') openPin('molds', { sound: false, track: false });
            sound.success(false);
          }
        } else if (state.ice > 0 && state.doorOpen) {
          state.ice = clamp(state.ice - 0.03 * dt, 0, 1);
        }
      } else {
        // empty molds still cool a bit
        state.moldTemp = lerp(state.moldTemp, state.doorOpen ? AMBIENT : -5, 1 - Math.exp(-1.2 * powerFactor * dt));
      }

      // heat rejected to room ≈ heat from water + compressor work
      const heatOut = (2.8 * powerFactor) + (state.water > 0 ? 1.6 * powerFactor : 0.4);
      state.roomHeat = clamp(state.roomHeat + heatOut * dt, 0, 100);
    } else {
      sound.setHumLevel(state.speed, false);
      // warm back toward ambient
      const warm = (state.doorOpen ? 4.5 : 1.2) * dt;
      state.moldTemp = clamp(state.moldTemp + warm * (AMBIENT + 2 - state.moldTemp) * 0.08, -18, AMBIENT + 4);
      if (state.ice > 0 && state.moldTemp > 0) {
        state.ice = clamp(state.ice - 0.04 * dt * (state.doorOpen ? 1.5 : 0.5), 0, 1);
      }
      state.roomHeat = clamp(state.roomHeat - 1.5 * dt, 0, 100);
    }

    // mark loop stages as seen for mission 2 without auto-narrating
    const stageNow = activeLoopStage();
    if (stageNow && stageNow !== lastLoopStage) {
      lastLoopStage = stageNow;
      state.loopSeen[stageNow] = true;
    }
    updatePinLiveChrome();
    maybeAutoClear();
  }

  /* ---------------- Canvas draw ---------------- */
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = el.canvas.getBoundingClientRect();
    const w = Math.max(320, Math.floor(rect.width));
    const h = Math.max(220, Math.floor(rect.height));
    el.canvas.width = Math.floor(w * dpr);
    el.canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w, h };
  }

  let layout = { w: 960, h: 520 };

  function drawRounded(x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function draw() {
    layout = resizeCanvas();
    const { w, h } = layout;
    const ink = cssVar('--ink');
    const soft = cssVar('--ink-soft');
    const card = cssVar('--card');
    const line = cssVar('--line');
    const ice = cssVar('--ice') || '#5ec8ff';
    const iceDeep = cssVar('--ice-deep') || '#2a8fd4';
    const hot = cssVar('--hot') || '#ff8a4c';
    const paperA = cssVar('--canvas-bg-a');
    const paperB = cssVar('--canvas-bg-b');
    const mint = cssVar('--mint') || '#3dcfb0';

    ctx.clearRect(0, 0, w, h);
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, paperA);
    g.addColorStop(1, paperB);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // subtle grid
    ctx.save();
    ctx.strokeStyle = 'rgba(43,80,120,0.08)';
    ctx.lineWidth = 1;
    for (let x = 20; x < w; x += 28) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 20; y < h; y += 28) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    ctx.restore();

    const shakeX = state.shake ? Math.sin(performance.now() / 30) * state.shake * 6 : 0;
    ctx.save();
    ctx.translate(shakeX, 0);

    // machine body
    const mx = w * 0.08;
    const my = h * 0.1;
    const mw = w * 0.56;
    const mh = h * 0.78;

    // room warmth glow on right
    const heatAlpha = 0.08 + state.roomHeat / 220;
    const hg = ctx.createRadialGradient(w * 0.82, h * 0.45, 10, w * 0.82, h * 0.45, w * 0.28);
    hg.addColorStop(0, `rgba(255,140,70,${heatAlpha})`);
    hg.addColorStop(1, 'rgba(255,140,70,0)');
    ctx.fillStyle = hg;
    ctx.fillRect(w * 0.55, 0, w * 0.45, h);

    // cabinet
    drawRounded(mx, my, mw, mh, 22);
    const bodyGrad = ctx.createLinearGradient(mx, my, mx + mw, my + mh);
    bodyGrad.addColorStop(0, card);
    bodyGrad.addColorStop(1, cssVar('--meter') || paperA);
    ctx.fillStyle = bodyGrad;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = line;
    ctx.stroke();

    // inner freezer bay
    const bayX = mx + mw * 0.1;
    const bayY = my + mh * 0.12;
    const bayW = mw * 0.55;
    const bayH = mh * 0.42;
    drawRounded(bayX, bayY, bayW, bayH, 14);
    const bayGrad = ctx.createLinearGradient(bayX, bayY, bayX, bayY + bayH);
    const coldK = clamp((10 - state.moldTemp) / 25, 0, 1);
    bayGrad.addColorStop(0, `rgba(180, 230, 255, ${0.25 + coldK * 0.35})`);
    bayGrad.addColorStop(1, `rgba(120, 190, 230, ${0.15 + coldK * 0.3})`);
    ctx.fillStyle = bayGrad;
    ctx.fill();
    ctx.strokeStyle = line;
    ctx.lineWidth = 2;
    ctx.stroke();

    // door
    const doorW = state.doorOpen ? bayW * 0.18 : 10;
    ctx.save();
    if (state.doorOpen) {
      ctx.fillStyle = 'rgba(255,160,90,0.18)';
      ctx.fillRect(bayX + bayW - 4, bayY + 6, 36, bayH - 12);
    }
    drawRounded(bayX + bayW - (state.doorOpen ? -8 : 8), bayY + 8, doorW, bayH - 16, 8);
    ctx.fillStyle = state.doorOpen ? hot : iceDeep;
    ctx.globalAlpha = state.doorOpen ? 0.85 : 0.35;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = line;
    ctx.stroke();
    ctx.restore();

    // ice molds
    const moldY = bayY + bayH * 0.38;
    const moldH = bayH * 0.38;
    const gap = 8;
    const moldW = (bayW - 28 - gap * (MOLD_COUNT - 1)) / MOLD_COUNT;
    for (let i = 0; i < MOLD_COUNT; i++) {
      const x = bayX + 14 + i * (moldW + gap);
      drawRounded(x, moldY, moldW, moldH, 6);
      ctx.fillStyle = 'rgba(30,60,90,0.16)';
      ctx.fill();
      ctx.strokeStyle = line;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (state.water > 0) {
        const fillH = moldH * 0.72;
        const iceH = fillH * state.ice;
        const waterH = fillH - iceH;
        // water
        if (waterH > 0.5) {
          const wy = moldY + moldH - 4 - fillH;
          drawRounded(x + 3, wy + iceH, moldW - 6, waterH, 4);
          const wg = ctx.createLinearGradient(0, wy, 0, wy + fillH);
          wg.addColorStop(0, 'rgba(120, 200, 255, 0.55)');
          wg.addColorStop(1, 'rgba(40, 130, 210, 0.7)');
          ctx.fillStyle = wg;
          ctx.fill();
        }
        // ice
        if (iceH > 0.5) {
          const iy = moldY + moldH - 4 - iceH;
          drawRounded(x + 3, iy, moldW - 6, iceH, 4);
          const ig = ctx.createLinearGradient(x, iy, x + moldW, iy + iceH);
          ig.addColorStop(0, '#f5fdff');
          ig.addColorStop(0.45, ice);
          ig.addColorStop(1, iceDeep);
          ctx.fillStyle = ig;
          ctx.fill();
          ctx.fillStyle = 'rgba(255,255,255,0.55)';
          ctx.fillRect(x + 5, iy + 3, moldW * 0.25, Math.max(2, iceH * 0.2));
        }
      }
    }

    // labels
    // 部件名称改由边缘编号圆点承担，画布只保留温度读数
    ctx.fillStyle = soft;
    ctx.font = `800 13px ${cssVar('--font-body') || 'sans-serif'}`;
    ctx.fillText(`${state.moldTemp.toFixed(0)}°C`, bayX + bayW - 48, bayY + 18);

    // evaporator coils under molds
    const evapY = moldY + moldH + 10;
    ctx.strokeStyle = iceDeep;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const y = evapY + i * 7;
      ctx.moveTo(bayX + 16, y);
      ctx.lineTo(bayX + bayW - 16, y);
    }
    ctx.stroke();
    // evaporator name: pin 2

    // compressor bottom left of machine
    const cx = mx + mw * 0.18;
    const cy = my + mh * 0.78;
    ctx.save();
    ctx.translate(cx, cy);
    if (state.power) ctx.rotate((performance.now() / 180) * (0.4 + state.speed * 0.25));
    drawRounded(-28, -22, 56, 44, 12);
    ctx.fillStyle = state.power ? mint : soft;
    ctx.globalAlpha = state.power ? 0.9 : 0.45;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = line;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fillStyle = card;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    if (state.power) {
      ctx.fillStyle = hot;
      ctx.font = `800 11px ${cssVar('--font-body') || 'sans-serif'}`;
      ctx.fillText(t('workIn'), cx - 18, cy - 30);
    }

    // condenser on right side of machine (hot coils)
    const condX = mx + mw * 0.78;
    const condY = my + mh * 0.22;
    const condH = mh * 0.5;
    ctx.strokeStyle = hot;
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let i = 0; i < 7; i++) {
      const y = condY + i * (condH / 7);
      ctx.moveTo(condX, y);
      ctx.bezierCurveTo(condX + 18, y + 8, condX + 18, y + 16, condX, y + 24);
    }
    ctx.stroke();
    // fan
    ctx.save();
    ctx.translate(condX + 36, condY + condH * 0.45);
    if (state.power) ctx.rotate(performance.now() / 120 * state.speed);
    ctx.fillStyle = state.power ? hot : soft;
    for (let i = 0; i < 3; i++) {
      ctx.rotate((Math.PI * 2) / 3);
      drawRounded(-6, -22, 12, 24, 6);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fillStyle = line;
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = hot;
    ctx.font = `800 11px ${cssVar('--font-body') || 'sans-serif'}`;
    ctx.fillText(t('canvasFan'), condX + 24, condY + condH * 0.45 + 36);

    // expansion valve
    const ex = mx + mw * 0.72;
    const ey = my + mh * 0.78;
    ctx.beginPath();
    ctx.moveTo(ex - 14, ey);
    ctx.lineTo(ex + 14, ey - 16);
    ctx.lineTo(ex + 14, ey + 16);
    ctx.closePath();
    ctx.fillStyle = ice;
    ctx.fill();
    ctx.strokeStyle = line;
    ctx.lineWidth = 2;
    ctx.stroke();
    // expansion name: pin 5

    // refrigerant loop path
    const path = new Path2D();
    const pComp = { x: cx, y: cy - 24 };
    const pCondTop = { x: condX + 4, y: condY };
    const pCondBot = { x: condX + 4, y: condY + condH };
    const pExp = { x: ex, y: ey - 18 };
    const pEvapR = { x: bayX + bayW - 20, y: evapY + 14 };
    const pEvapL = { x: bayX + 20, y: evapY + 14 };
    path.moveTo(pComp.x, pComp.y);
    path.bezierCurveTo(cx + 40, cy - 80, condX - 10, condY - 30, pCondTop.x, pCondTop.y);
    path.lineTo(pCondBot.x, pCondBot.y);
    path.bezierCurveTo(condX + 10, ey - 10, ex + 30, ey - 40, pExp.x, pExp.y);
    path.bezierCurveTo(ex - 40, ey - 50, bayX + bayW + 10, evapY + 40, pEvapR.x, pEvapR.y);
    path.lineTo(pEvapL.x, pEvapL.y);
    path.bezierCurveTo(bayX - 10, evapY + 10, cx - 50, cy - 10, pComp.x, pComp.y);

    ctx.lineWidth = 5;
    ctx.strokeStyle = state.power ? iceDeep : 'rgba(80,110,140,0.35)';
    ctx.stroke(path);

    // moving refrigerant dots
    if (state.power) {
      for (let i = 0; i < 10; i++) {
        const u = (state.loopPhase + i / 10) % 1;
        const pt = pointOnLoop(u, { pComp, pCondTop, pCondBot, pExp, pEvapR, pEvapL, cx, cy, condX, condY, condH, ex, ey, bayX, bayW, evapY });
        const hotSide = u < 0.5;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, hotSide ? 5.5 : 4.5, 0, Math.PI * 2);
        ctx.fillStyle = hotSide ? hot : ice;
        ctx.fill();
        ctx.strokeStyle = line;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // heat arrows
    if (state.power) {
      drawArrow(bayX + bayW * 0.5, moldY + moldH + 2, bayX + bayW * 0.5, evapY + 4, iceDeep, t('heatIn'));
      drawArrow(condX + 58, condY + 20, condX + 100, condY + 8, hot, t('heatOut'));
      drawArrow(condX + 58, condY + condH * 0.55, condX + 108, condY + condH * 0.4, hot, '');
    }

    // harvested cubes bin on far right
    const binX = w * 0.72;
    const binY = h * 0.62;
    drawRounded(binX, binY, w * 0.2, h * 0.22, 12);
    ctx.fillStyle = card;
    ctx.fill();
    ctx.strokeStyle = line;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = soft;
    ctx.font = `800 12px ${cssVar('--font-body') || 'sans-serif'}`;
    ctx.fillText(t('cubes'), binX + 10, binY + 18);
    const show = Math.min(state.cubes, 12);
    for (let i = 0; i < show; i++) {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const ix = binX + 14 + col * 28;
      const iy = binY + h * 0.22 - 28 - row * 22;
      drawRounded(ix, iy, 20, 16, 4);
      const ig = ctx.createLinearGradient(ix, iy, ix + 20, iy + 16);
      ig.addColorStop(0, '#fff');
      ig.addColorStop(1, ice);
      ctx.fillStyle = ig;
      ctx.fill();
      ctx.strokeStyle = iceDeep;
      ctx.stroke();
    }

    // room warmth readout only (name is pin 6)
    ctx.fillStyle = soft;
    ctx.font = `750 13px ${cssVar('--font-body') || 'sans-serif'}`;
    ctx.fillText(roomLabel(), w * 0.82, h * 0.12);

    // door tag
    ctx.fillStyle = state.doorOpen ? hot : soft;
    ctx.font = `800 12px ${cssVar('--font-body') || 'sans-serif'}`;
    ctx.fillText(t('canvasDoor') + (state.doorOpen ? ' · open' : ''), bayX + bayW - 4, bayY - 8);

    // particles
    for (const p of state.particles) {
      ctx.globalAlpha = clamp(p.life * 2, 0, 1);
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, 4, 0, Math.PI * 2);
      ctx.fillStyle = iceDeep;
      ctx.fill();
    }
    for (const p of state.sparks) {
      ctx.globalAlpha = clamp(p.life * 1.5, 0, 1);
      drawRounded(p.x * w, p.y * h, 12, 10, 3);
      ctx.fillStyle = ice;
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.restore();
  }

  function pointOnLoop(u, P) {
    // piecewise approximate path positions
    if (u < 0.25) {
      const k = u / 0.25;
      return {
        x: lerp(P.pComp.x, P.pCondTop.x, k),
        y: lerp(P.pComp.y, P.pCondTop.y, k) - Math.sin(k * Math.PI) * 40,
      };
    }
    if (u < 0.5) {
      const k = (u - 0.25) / 0.25;
      return { x: P.pCondTop.x + 2, y: lerp(P.pCondTop.y, P.pCondBot.y, k) };
    }
    if (u < 0.75) {
      const k = (u - 0.5) / 0.25;
      return {
        x: lerp(P.pCondBot.x, P.pExp.x, k),
        y: lerp(P.pCondBot.y, P.pExp.y, k),
      };
    }
    const k = (u - 0.75) / 0.25;
    if (k < 0.5) {
      const k2 = k / 0.5;
      return {
        x: lerp(P.pExp.x, P.pEvapR.x, k2),
        y: lerp(P.pExp.y, P.pEvapR.y, k2),
      };
    }
    const k2 = (k - 0.5) / 0.5;
    if (k2 < 0.5) {
      return {
        x: lerp(P.pEvapR.x, P.pEvapL.x, k2 / 0.5),
        y: P.pEvapL.y,
      };
    }
    return {
      x: lerp(P.pEvapL.x, P.pComp.x, (k2 - 0.5) / 0.5),
      y: lerp(P.pEvapL.y, P.pComp.y, (k2 - 0.5) / 0.5),
    };
  }

  function drawArrow(x1, y1, x2, y2, color, label) {
    const ang = Math.atan2(y2 - y1, x2 - x1);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 10 * Math.cos(ang - 0.4), y2 - 10 * Math.sin(ang - 0.4));
    ctx.lineTo(x2 - 10 * Math.cos(ang + 0.4), y2 - 10 * Math.sin(ang + 0.4));
    ctx.closePath();
    ctx.fill();
    if (label) {
      ctx.font = `800 11px ${cssVar('--font-body') || 'sans-serif'}`;
      ctx.fillText(label, (x1 + x2) / 2 + 6, (y1 + y2) / 2 - 6);
    }
  }

  function frame(ts) {
    const dt = Math.min(0.05, (ts - lastTs) / 1000 || 0.016);
    lastTs = ts;
    step(dt);
    draw();
    renderChrome();
    raf = requestAnimationFrame(frame);
  }

  /* ---------------- UI events ---------------- */

  document.querySelectorAll('.pin').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.pin;
      if (selectedPin === id) closePin();
      else openPin(id);
    });
  });
  el.pinDetailClose?.addEventListener('click', () => {
    sound.click();
    closePin();
  });
  // Click empty canvas area closes detail
  el.canvas?.addEventListener('pointerdown', () => {
    if (selectedPin) closePin();
  });

  el.fill.addEventListener('click', fillWater);
  el.power.addEventListener('click', togglePower);
  el.door.addEventListener('click', toggleDoor);
  el.harvest.addEventListener('click', harvest);
  el.speed.addEventListener('input', () => {
    state.speed = Number(el.speed.value) || 2;
    sound.click();
    renderChrome();
  });
  el.reset.addEventListener('click', () => {
    sound.click();
    const keep = missionIndex === 3;
    const cubes = state.cubes;
    const harvestCount = state.harvestCount;
    const room = state.roomHeat;
    resetSim(keep);
    if (keep) {
      state.cubes = cubes;
      state.harvestCount = harvestCount;
      state.roomHeat = room;
    }
    setStatus(t('tip0'));
    renderChrome();
  });
  el.hint.addEventListener('click', () => {
    sound.click();
    showCoach = true;
    syncCoach();
    setStatus(t(mission().hint));
    // Open the most relevant pin, kid can read at leisure
    if (state.ice >= 0.98) openPin('molds', { sound: false });
    else if (state.power) openPin(activeLoopStage() || 'comp', { sound: false });
    else if (state.water < 1) openPin('molds', { sound: false });
    else openPin('evap', { sound: false });
  });
  el.check.addEventListener('click', checkMission);
  el.next.addEventListener('click', () => {
    sound.click();
    if (missionIndex < MISSIONS.length - 1) goMission(missionIndex + 1);
  });
  el.playAgain.addEventListener('click', () => {
    sound.click();
    el.modal.hidden = true;
    completed = new Set();
    unlocked = 0;
    state.cubes = 0;
    state.harvestCount = 0;
    state.roomHeat = 0;
    save();
    goMission(0);
  });

  el.sound.addEventListener('click', () => {
    sound.setMuted(!sound.muted);
    if (!sound.muted) sound.click();
    if (!sound.muted && state.power) sound.startHum();
    renderChrome();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) sound.stopHum();
    else if (state.power && !sound.muted) sound.startHum();
  });

  window.addEventListener('resize', () => draw());

  /* ---------------- boot ---------------- */
  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang: nextLang, theme }) {
      t = translate;
      lang = nextLang;
      document.title = t('doc');
      if (el.lang) el.lang.textContent = lang === 'zh' ? 'EN' : '中';
      if (el.theme) {
        el.theme.textContent = theme === 'light' ? '🌙' : '☀️';
        el.theme.setAttribute('aria-label', t('theme'));
      }
      // refresh data-t nodes already handled by SDK; dynamic bits:
      applyMissionCopy();
      if (!statusTone) setStatus(el.status.textContent || t('tip0'));
      if (selectedPin) openPin(selectedPin, { sound: false, track: false });
      else if (el.lessonText) {
        const m = mission();
        el.lessonIcon.textContent = m.icon;
        el.lessonText.textContent = t(m.lesson);
      }
      renderChrome();
      draw();
    },
  });

  el.lang?.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme?.addEventListener('click', () => window.cool.preferences.toggleTheme());

  goMission(Math.min(unlocked, MISSIONS.length - 1));
  setStatus(t('tip0'));
  renderChrome();
  lastTs = performance.now();
  raf = requestAnimationFrame(frame);
})();
