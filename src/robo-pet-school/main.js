(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '机器宠物学校 · KidsLab',
      back: '返回平台',
      title: '机器宠物学校',
      soundOff: '关闭声音',
      soundOn: '打开声音',
      themeLabel: '切换主题',
      missionsLabel: '训练课程',
      missionLabel: (n, title) => `第 ${n} 课：${title}`,
      lockedMission: '先完成上一课',
      examples: '样本',
      brain: '豆豆的脑内雷达',
      chooseLabel: '这个物品应该贴哪个标签？',
      isBall: '是球',
      notBall: '不是球',
      biasPrompt: '测试新物品，看看窄样本会发生什么。',
      runBiasTest: '让豆豆认绿网球',
      retrainPrompt: '新例子都贴好了，现在重新训练。',
      retrain: '重新训练豆豆',
      letDecide: '让豆豆判断',
      nextObject: '下一个公园物品',
      hint: '轻提示',
      nextLesson: '去下一课',
      finalKicker: '公园测验 6 / 6 全部通过',
      finalTitle: '豆豆毕业啦！',
      finalText: '你没有把答案写成死规则，而是用多样例和反例教它，再拿从没见过的物品检验它是否真的学会。',
      playAgain: '重新开学',
      emptySamples: '还没有样本，先贴一张标签',
      confidenceWaiting: '等待样本',
      confidenceLow: (n) => `犹豫 ${n}%`,
      confidenceHigh: (n) => `确定 ${n}%`,
      predictionBall: '我猜：是球',
      predictionNot: '我猜：不是球',
      featureRound: '圆',
      featureBouncy: '会弹',
      featureRed: '红色',
      featureSoft: '柔软',
      featureCorners: '有角',
      featureFlat: '扁平',
      phase1Kicker: '第一课 · 喂例子',
      phase1Title: '机器狗不会猜，要用例子教',
      phase1Text: '看清物品，再告诉豆豆“是球”还是“不是球”。',
      phase1Trainer: '给当前物品贴标签',
      phase1Lesson: '标签就是例子的正确答案。豆豆会从这些答案里寻找线索。',
      phase1Ready: '先给豆豆看第一个例子：红色橡胶球。',
      phase1Correct: (name) => `收下了！“${name}”成为一条训练样本。`,
      phase1Wrong: (name) => `再观察一下“${name}”。标签错了不会加入样本，可以原地重试。`,
      phase1Done: '四个基础样本收齐了。现在别急着说它学会了——要拿新物品测试。',
      phase1Hint: '球通常是圆的、能滚或会弹；番茄、方块和鞋都不是玩具球。',
      phase2Kicker: '第二课 · 抓偏见',
      phase2Title: '只见过红球，豆豆漏掉了绿球',
      phase2Text: '训练样本太窄，新情况就容易被误判。',
      phase2Trainer: '先测试，再补多样例和反例',
      phase2Lesson: '只教一种颜色，豆豆可能把颜色当成关键。要补不同颜色的球，也补“很圆但不是球”的反例。',
      phase2Ready: '基础样本里唯一的球是红色。让豆豆第一次见见绿网球。',
      phase2Miss: '误判！豆豆只有 42% 把握，还把绿网球当成“不是球”。样本太窄了。',
      phase2Add: '给这条纠正样本贴标签，让豆豆看见更多变化。',
      phase2Correct: (name) => `纠正样本已加入：“${name}”。`,
      phase2Wrong: (name) => `这个标签会把豆豆教糊涂。“${name}”到底是不是玩具球？`,
      phase2ReadyRetrain: '多样例和反例都齐了。重新训练，看看判断有没有改变。',
      phase2Retrained: '成功！绿网球现在有 96% 把握。豆豆学到“颜色不是决定条件”。',
      phase2HintBefore: '点击测试，让错误先现身；训练成绩好不代表遇到新物品也会对。',
      phase2HintLabel: '绿网球是球；西瓜和毛线团虽然圆，却不是玩具球。',
      phase3Kicker: '第三课 · 公园测验',
      phase3Title: '用没见过的新物品检验是否学会',
      phase3Text: '训练样本和测试物品要分开，才能检查泛化。',
      phase3Trainer: '让豆豆独立完成 6 次判断',
      phase3Lesson: '公园里的物品没参加训练。对新物品仍能判断正确，才说明学到的规律能泛化。',
      phase3Ready: '第一位公园访客来了。让豆豆自己判断，不再告诉它答案。',
      phase3Prompt: (current, total) => `公园测验 ${current} / ${total}：让豆豆独立判断。`,
      phase3CorrectBall: (name, confidence) => `判断正确！豆豆以 ${confidence}% 把握叼回“${name}”。`,
      phase3CorrectNot: (name, confidence) => `判断正确！豆豆以 ${confidence}% 把握没有去叼“${name}”。`,
      phase3Hint: '这些都是训练时没见过的新物品。先判断、再看置信度，不需要再贴标签。',
      restored: '已恢复上次训练进度。',
      itemRedBall: '红色橡胶球',
      itemTomato: '番茄',
      itemCube: '积木方块',
      itemShoe: '运动鞋',
      itemGreenBall: '绿网球',
      itemWatermelon: '西瓜',
      itemYarn: '毛线团',
      itemBasketball: '金色篮球',
      itemCherryTomato: '小番茄',
      itemBlueBall: '蓝色弹力球',
      itemFrisbee: '飞盘',
      itemSoftball: '白色垒球',
      itemOrange: '橙子',
    },
    en: {
      doc: 'Robo-Pet School · KidsLab',
      back: 'Back to platform',
      title: 'Robo-Pet School',
      soundOff: 'Turn sound off',
      soundOn: 'Turn sound on',
      themeLabel: 'Switch theme',
      missionsLabel: 'Training lessons',
      missionLabel: (n, title) => `Lesson ${n}: ${title}`,
      lockedMission: 'Finish the previous lesson first',
      examples: 'Examples',
      brain: "Doudou's brain radar",
      chooseLabel: 'Which label belongs on this object?',
      isBall: 'Ball',
      notBall: 'Not a ball',
      biasPrompt: 'Test a new object and see what narrow data can do.',
      runBiasTest: 'Ask Doudou about the green ball',
      retrainPrompt: 'The new examples are labeled. Train again.',
      retrain: 'Retrain Doudou',
      letDecide: 'Let Doudou decide',
      nextObject: 'Next park object',
      hint: 'Small hint',
      nextLesson: 'Next lesson',
      finalKicker: 'PARK TEST 6 / 6 PASSED',
      finalTitle: 'Doudou Graduated!',
      finalText: 'You did not write a rigid answer rule. You taught with varied examples and counterexamples, then checked the learning on objects the model had never seen.',
      playAgain: 'Start school again',
      emptySamples: 'No examples yet—label the first one',
      confidenceWaiting: 'Waiting',
      confidenceLow: (n) => `Unsure ${n}%`,
      confidenceHigh: (n) => `Sure ${n}%`,
      predictionBall: 'My guess: ball',
      predictionNot: 'My guess: not a ball',
      featureRound: 'round',
      featureBouncy: 'bouncy',
      featureRed: 'red',
      featureSoft: 'soft',
      featureCorners: 'corners',
      featureFlat: 'flat',
      phase1Kicker: 'LESSON ONE · FEED EXAMPLES',
      phase1Title: 'A Robo-Dog Needs Examples, Not Guesses',
      phase1Text: 'Inspect each object and label it “ball” or “not a ball.”',
      phase1Trainer: 'Label the current object',
      phase1Lesson: 'A label is the correct answer attached to an example. Doudou looks for clues across those answers.',
      phase1Ready: 'Show Doudou the first example: a red rubber ball.',
      phase1Correct: (name) => `Got it! “${name}” is now a training example.`,
      phase1Wrong: (name) => `Look again at “${name}.” A wrong label is not saved, so you can retry right here.`,
      phase1Done: 'Four basic examples collected. Do not call it learned yet—test it on something new.',
      phase1Hint: 'Balls are usually round and roll or bounce. A tomato, block, and shoe are not toy balls.',
      phase2Kicker: 'LESSON TWO · CATCH BIAS',
      phase2Title: 'Seeing Only Red Balls Made Doudou Miss Green',
      phase2Text: 'Narrow training examples can cause mistakes on new situations.',
      phase2Trainer: 'Test first, then add variety and counterexamples',
      phase2Lesson: 'With only one ball color, Doudou may treat color as the key. Add other balls and round things that are not balls.',
      phase2Ready: 'The only ball in the basic examples is red. Let Doudou meet a green tennis ball.',
      phase2Miss: 'Mistake! Doudou was only 42% sure and called the green ball “not a ball.” The data was too narrow.',
      phase2Add: 'Label this correction example so Doudou sees more variety.',
      phase2Correct: (name) => `Correction example added: “${name}.”`,
      phase2Wrong: (name) => `That label would confuse Doudou. Is “${name}” really a toy ball?`,
      phase2ReadyRetrain: 'The varied examples and counterexamples are ready. Retrain and check the prediction.',
      phase2Retrained: 'Success! The green ball now scores 96%. Doudou learned that color is not the deciding clue.',
      phase2HintBefore: 'Run the test and reveal the mistake first. Good training scores do not prove new examples will work.',
      phase2HintLabel: 'The green tennis ball is a ball. A watermelon and yarn ball are round, but they are not toy balls.',
      phase3Kicker: 'LESSON THREE · PARK TEST',
      phase3Title: 'Use Unseen Objects to Check Real Learning',
      phase3Text: 'Keep training examples apart from test objects to check generalization.',
      phase3Trainer: 'Let Doudou make 6 independent decisions',
      phase3Lesson: 'Park objects were not used for training. Correct answers on these new objects show that the learned pattern can generalize.',
      phase3Ready: 'The first park visitor is here. Let Doudou decide without giving it the answer.',
      phase3Prompt: (current, total) => `Park test ${current} / ${total}: let Doudou decide alone.`,
      phase3CorrectBall: (name, confidence) => `Correct! Doudou fetched “${name}” with ${confidence}% confidence.`,
      phase3CorrectNot: (name, confidence) => `Correct! Doudou left “${name}” alone with ${confidence}% confidence.`,
      phase3Hint: 'These objects were never in training. Decide first, then inspect confidence—no more labels are needed.',
      restored: 'Your previous training progress was restored.',
      itemRedBall: 'red rubber ball',
      itemTomato: 'tomato',
      itemCube: 'building block',
      itemShoe: 'running shoe',
      itemGreenBall: 'green tennis ball',
      itemWatermelon: 'watermelon',
      itemYarn: 'yarn ball',
      itemBasketball: 'gold basketball',
      itemCherryTomato: 'cherry tomato',
      itemBlueBall: 'blue bouncy ball',
      itemFrisbee: 'flying disc',
      itemSoftball: 'white softball',
      itemOrange: 'orange',
    },
  };

  const SAVE_KEY = 'kidslab.robo-pet-school';
  const SOUND_KEY = 'kidslab.sound.muted';
  const FEATURES = {
    round: 'featureRound',
    bouncy: 'featureBouncy',
    red: 'featureRed',
    soft: 'featureSoft',
    corners: 'featureCorners',
    flat: 'featureFlat',
  };
  const BASIC = [
    { id: 'red-ball', name: 'itemRedBall', emoji: '🔴', features: ['round', 'bouncy', 'red'], ball: true },
    { id: 'tomato', name: 'itemTomato', emoji: '🍅', features: ['round', 'red', 'soft'], ball: false },
    { id: 'cube', name: 'itemCube', emoji: '🧊', features: ['corners'], ball: false },
    { id: 'shoe', name: 'itemShoe', emoji: '👟', features: ['soft'], ball: false },
  ];
  const CORRECTIONS = [
    { id: 'green-ball', name: 'itemGreenBall', emoji: '🎾', features: ['round', 'bouncy', 'soft'], ball: true },
    { id: 'watermelon', name: 'itemWatermelon', emoji: '🍉', features: ['round'], ball: false },
    { id: 'yarn', name: 'itemYarn', emoji: '🧶', features: ['round', 'soft'], ball: false },
  ];
  const PARK = [
    { id: 'basketball', name: 'itemBasketball', emoji: '🏀', features: ['round', 'bouncy'], ball: true, confidence: 92 },
    { id: 'cherry-tomato', name: 'itemCherryTomato', emoji: '🍅', features: ['round', 'red', 'soft'], ball: false, confidence: 89 },
    { id: 'blue-ball', name: 'itemBlueBall', emoji: '🔵', features: ['round', 'bouncy'], ball: true, confidence: 95 },
    { id: 'frisbee', name: 'itemFrisbee', emoji: '🥏', features: ['round', 'flat'], ball: false, confidence: 84 },
    { id: 'softball', name: 'itemSoftball', emoji: '⚾', features: ['round', 'bouncy'], ball: true, confidence: 93 },
    { id: 'orange', name: 'itemOrange', emoji: '🍊', features: ['round', 'soft'], ball: false, confidence: 87 },
  ];
  const LESSONS = [
    { kicker: 'phase1Kicker', title: 'phase1Title', text: 'phase1Text', trainer: 'phase1Trainer', lesson: 'phase1Lesson', icon: '🏷️' },
    { kicker: 'phase2Kicker', title: 'phase2Title', text: 'phase2Text', trainer: 'phase2Trainer', lesson: 'phase2Lesson', icon: '⚖️' },
    { kicker: 'phase3Kicker', title: 'phase3Title', text: 'phase3Text', trainer: 'phase3Trainer', lesson: 'phase3Lesson', icon: '🌳' },
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
    exampleCount: $('#exampleCount'),
    dog: $('#dogWrap'),
    thought: $('#thoughtBubble'),
    objectPedestal: $('#objectPedestal'),
    objectEmoji: $('#objectEmoji'),
    objectName: $('#objectName'),
    featureTags: $('#featureTags'),
    confidence: $('#confidenceText'),
    brainCanvas: $('#brainCanvas'),
    brainNote: $('#brainNote'),
    sampleStrip: $('#sampleStrip'),
    trainerTitle: $('#trainerTitle'),
    trainerStamp: $('#trainerStamp'),
    lessonIcon: $('#lessonIcon'),
    lessonText: $('#lessonText'),
    labelControls: $('#labelControls'),
    biasControls: $('#biasControls'),
    retrainControls: $('#retrainControls'),
    parkControls: $('#parkControls'),
    parkPrompt: $('#parkPrompt'),
    ball: $('#ballBtn'),
    notBall: $('#notBallBtn'),
    biasTest: $('#biasTestBtn'),
    retrain: $('#retrainBtn'),
    decide: $('#decideBtn'),
    nextObject: $('#nextObjectBtn'),
    hint: $('#hintBtn'),
    nextLesson: $('#nextLessonBtn'),
    sound: $('#soundBtn'),
    theme: $('#themeBtn'),
    lang: $('#langBtn'),
    modal: $('#completeModal'),
    playAgain: $('#playAgainBtn'),
  };

  let t = (key) => key;
  let language = 'zh';
  let phase = 0;
  let unlocked = 0;
  let basicIndex = 0;
  let correctionIndex = -1;
  let parkIndex = 0;
  let biasTested = false;
  let retrained = false;
  let parkDecided = false;
  let completed = false;
  let statusMessage = { key: 'phase1Ready', tone: '' };

  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    unlocked = Math.min(2, Math.max(0, Number(saved.unlocked) || 0));
    phase = Math.min(unlocked, Math.max(0, Number(saved.phase) || 0));
    basicIndex = Math.min(BASIC.length, Math.max(0, Number(saved.basicIndex) || 0));
    correctionIndex = Math.min(CORRECTIONS.length, Math.max(-1, Number(saved.correctionIndex)));
    if (!Number.isFinite(correctionIndex)) correctionIndex = -1;
    biasTested = Boolean(saved.biasTested);
    retrained = Boolean(saved.retrained);
    parkIndex = Math.min(PARK.length - 1, Math.max(0, Number(saved.parkIndex) || 0));
    parkDecided = Boolean(saved.parkDecided);
    completed = Boolean(saved.completed);
    if (phase > 0 || basicIndex > 0) statusMessage = { key: 'restored', tone: 'good' };
  } catch {
    // Invalid local state falls back to a new school day.
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

    tap() { this.tone(250, .08, .022, 'square'); }
    error() { this.tone(170, .16, .035, 'sawtooth'); this.tone(125, .2, .022, 'square', .08); }
    correct() { [392, 523, 659].forEach((frequency, index) => this.tone(frequency, .18, .026, 'triangle', index * .055)); }
    retrain() { [240, 310, 390, 520].forEach((frequency, index) => this.tone(frequency, .15, .02, 'square', index * .06)); }
    graduate() { [392, 523, 659, 784].forEach((frequency, index) => this.tone(frequency, .28, .028, 'triangle', index * .1)); }
    setMuted(muted) {
      this.muted = muted;
      try { localStorage.setItem(SOUND_KEY, String(muted)); } catch {}
      if (muted) {
        this.sources.forEach((source) => {
          try { source.stop(); } catch {}
        });
        this.sources.clear();
      }
    }
  }

  const sound = new SoundEngine();

  function currentObject() {
    if (phase === 0) return BASIC[Math.min(basicIndex, BASIC.length - 1)];
    if (phase === 1) {
      if (!biasTested || correctionIndex < 0 || correctionIndex >= CORRECTIONS.length) return CORRECTIONS[0];
      return CORRECTIONS[correctionIndex];
    }
    return PARK[parkIndex];
  }

  function learnedSamples() {
    const samples = BASIC.slice(0, basicIndex);
    if (phase > 1 || retrained) return samples.concat(CORRECTIONS);
    if (phase === 1 && correctionIndex > 0) return samples.concat(CORRECTIONS.slice(0, correctionIndex));
    return samples;
  }

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        phase, unlocked, basicIndex, correctionIndex, biasTested, retrained, parkIndex, parkDecided, completed,
      }));
    } catch {}
  }

  function translated(key, args = []) {
    return t(key, ...args);
  }

  function setStatus(key, tone = '', args = []) {
    statusMessage = { key, tone, args };
    el.status.textContent = translated(key, args);
    el.status.className = `status${tone ? ` ${tone}` : ''}`;
  }

  function animateObject() {
    el.objectPedestal.classList.remove('pop');
    requestAnimationFrame(() => el.objectPedestal.classList.add('pop'));
  }

  function renderObject() {
    const object = currentObject();
    el.objectEmoji.textContent = object.emoji;
    el.objectName.textContent = t(object.name);
    el.featureTags.replaceChildren(...object.features.map((feature) => {
      const tag = document.createElement('span');
      tag.textContent = t(FEATURES[feature]);
      return tag;
    }));
  }

  function renderSamples() {
    const samples = learnedSamples();
    el.exampleCount.textContent = String(samples.length);
    el.sampleStrip.setAttribute('aria-label', language === 'zh' ? '已学习的样本' : 'Learned examples');
    if (!samples.length) {
      const empty = document.createElement('span');
      empty.className = 'sample-empty';
      empty.textContent = t('emptySamples');
      el.sampleStrip.replaceChildren(empty);
      return;
    }
    el.sampleStrip.replaceChildren(...samples.map((sample) => {
      const chip = document.createElement('span');
      chip.className = `sample${sample.ball ? '' : ' no'}`;
      chip.title = `${t(sample.name)} · ${t(sample.ball ? 'isBall' : 'notBall')}`;
      chip.innerHTML = `<span aria-hidden="true">${sample.emoji}</span><b aria-hidden="true">${sample.ball ? '✓' : '×'}</b>`;
      chip.setAttribute('aria-label', chip.title);
      return chip;
    }));
  }

  function drawBrain(confidence = 0, predictsBall = null) {
    const canvas = el.brainCanvas;
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * ratio));
    canvas.height = Math.max(1, Math.round(rect.height * ratio));
    const ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);
    const width = rect.width;
    const height = rect.height;
    const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = css('--canvas-grid');
    ctx.lineWidth = 1;
    for (let x = 5; x < width; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    const nodes = [{ x: 14, y: 12 }, { x: 14, y: height / 2 }, { x: 14, y: height - 12 }];
    const target = { x: width - 17, y: height / 2 };
    nodes.forEach((node, index) => {
      ctx.beginPath();
      ctx.moveTo(node.x + 5, node.y);
      ctx.quadraticCurveTo(width * .55, node.y + (index - 1) * 7, target.x - 5, target.y);
      ctx.strokeStyle = confidence ? (predictsBall ? css('--good') : css('--bad')) : css('--ink-soft');
      ctx.globalAlpha = confidence ? .35 + confidence / 180 : .25;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = index === 1 ? css('--sun') : css('--sky');
      ctx.globalAlpha = 1;
      ctx.fill();
      ctx.strokeStyle = css('--line');
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.arc(target.x, target.y, 9, 0, Math.PI * 2);
    ctx.fillStyle = confidence ? (predictsBall ? css('--mint') : css('--pink')) : css('--card-2');
    ctx.fill();
    ctx.strokeStyle = css('--line');
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function setBrain(confidence = 0, predictsBall = null) {
    if (!confidence) {
      el.confidence.textContent = t('confidenceWaiting');
      el.thought.textContent = '?';
      el.brainNote.textContent = t(LESSONS[phase].lesson);
    } else {
      el.confidence.textContent = t(confidence >= 80 ? 'confidenceHigh' : 'confidenceLow', confidence);
      el.thought.textContent = predictsBall ? '✓' : '×';
      el.brainNote.textContent = t(predictsBall ? 'predictionBall' : 'predictionNot');
    }
    drawBrain(confidence, predictsBall);
  }

  function renderNav() {
    el.missionNav.replaceChildren(...LESSONS.map((lesson, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `mission-btn${index === phase ? ' current' : ''}${index < unlocked || completed ? ' done' : ''}`;
      button.textContent = ['Ⅰ', 'Ⅱ', 'Ⅲ'][index];
      button.disabled = index > unlocked;
      button.title = button.disabled ? t('lockedMission') : t('missionLabel', index + 1, t(lesson.title));
      button.setAttribute('aria-label', button.title);
      button.addEventListener('click', () => {
        if (index <= unlocked) {
          phase = index;
          parkDecided = false;
          statusMessage = { key: index === 0 ? (basicIndex >= BASIC.length ? 'phase1Done' : 'phase1Ready') : index === 1 ? (retrained ? 'phase2Retrained' : 'phase2Ready') : 'phase3Ready', tone: retrained && index === 1 ? 'good' : '' };
          render();
          save();
          window.cool?.stage?.(`robo-pet-${index + 1}`);
        }
      });
      return button;
    }));
  }

  function renderControls() {
    const phaseOneDone = basicIndex >= BASIC.length;
    el.labelControls.hidden = phase === 2
      || (phase === 0 && phaseOneDone)
      || (phase === 1 && (!biasTested || correctionIndex < 0 || correctionIndex >= CORRECTIONS.length));
    el.biasControls.hidden = phase !== 1 || biasTested;
    el.retrainControls.hidden = phase !== 1 || correctionIndex < CORRECTIONS.length || retrained;
    el.parkControls.hidden = phase !== 2;
    el.nextLesson.hidden = !((phase === 0 && phaseOneDone) || (phase === 1 && retrained));
    el.nextLesson.querySelector('[data-t="nextLesson"]').textContent = t('nextLesson');
    if (phase === 2) {
      el.parkPrompt.textContent = t('phase3Prompt', parkIndex + 1, PARK.length);
      el.decide.hidden = parkDecided;
      el.nextObject.hidden = !parkDecided;
      if (parkIndex === PARK.length - 1 && parkDecided) {
        el.nextObject.querySelector('[data-t="nextObject"]').textContent = language === 'zh' ? '领取毕业徽章' : 'Collect graduation badge';
      } else {
        el.nextObject.querySelector('[data-t="nextObject"]').textContent = t('nextObject');
      }
    }
  }

  function render() {
    const lesson = LESSONS[phase];
    el.missionNumber.textContent = String(phase + 1).padStart(2, '0');
    el.missionKicker.textContent = t(lesson.kicker);
    el.missionTitle.textContent = t(lesson.title);
    el.missionText.textContent = t(lesson.text);
    el.trainerTitle.textContent = t(lesson.trainer);
    el.trainerStamp.textContent = String(phase + 1).padStart(2, '0');
    el.lessonIcon.textContent = lesson.icon;
    el.lessonText.textContent = t(lesson.lesson);
    el.missionNav.setAttribute('aria-label', t('missionsLabel'));
    el.sound.textContent = sound.muted ? '🔇' : '🔊';
    el.sound.setAttribute('aria-label', t(sound.muted ? 'soundOn' : 'soundOff'));
    el.sound.setAttribute('aria-pressed', String(sound.muted));
    el.theme.setAttribute('aria-label', t('themeLabel'));
    renderNav();
    renderObject();
    renderSamples();
    renderControls();
    setStatus(statusMessage.key, statusMessage.tone, statusMessage.args || []);
    if (phase === 1 && retrained) setBrain(96, true);
    else if (phase === 2 && parkDecided) setBrain(PARK[parkIndex].confidence, PARK[parkIndex].ball);
    else if (phase === 1 && biasTested && correctionIndex < 0) setBrain(42, false);
    else setBrain();
    if (completed) showCompletion(false);
  }

  function labelCurrent(label) {
    const list = phase === 0 ? BASIC : CORRECTIONS;
    const index = phase === 0 ? basicIndex : correctionIndex;
    const object = list[index];
    if (!object || label !== object.ball) {
      setStatus(phase === 0 ? 'phase1Wrong' : 'phase2Wrong', 'bad', [t(object?.name || currentObject().name)]);
      sound.error();
      el.dog.classList.add('leaving');
      setTimeout(() => el.dog.classList.remove('leaving'), 380);
      return;
    }

    sound.correct();
    window.cool?.track?.('label-training-example', { object: object.id, label: label ? 'ball' : 'not-ball', lesson: phase + 1 });
    if (phase === 0) {
      basicIndex += 1;
      if (basicIndex >= BASIC.length) {
        unlocked = Math.max(unlocked, 1);
        setStatus('phase1Done', 'good');
      } else {
        setStatus('phase1Correct', 'good', [t(object.name)]);
      }
    } else {
      correctionIndex += 1;
      if (correctionIndex >= CORRECTIONS.length) setStatus('phase2ReadyRetrain', 'good');
      else setStatus('phase2Correct', 'good', [t(object.name)]);
    }
    animateObject();
    save();
    render();
  }

  function runBiasTest() {
    biasTested = true;
    correctionIndex = -1;
    setStatus('phase2Miss', 'bad');
    setBrain(42, false);
    sound.error();
    el.dog.classList.add('thinking', 'leaving');
    setTimeout(() => el.dog.classList.remove('thinking', 'leaving'), 650);
    window.cool?.track?.('test-biased-model', { object: 'green-ball', confidence: 42, prediction: 'not-ball' });
    setTimeout(() => {
      correctionIndex = 0;
      statusMessage = { key: 'phase2Add', tone: '' };
      save();
      render();
      animateObject();
    }, 720);
    save();
    renderControls();
  }

  function retrainModel() {
    retrained = true;
    unlocked = Math.max(unlocked, 2);
    setStatus('phase2Retrained', 'good');
    setBrain(96, true);
    sound.retrain();
    el.dog.classList.add('thinking');
    setTimeout(() => el.dog.classList.remove('thinking'), 650);
    window.cool?.track?.('retrain-with-varied-examples', { examples: learnedSamples().length });
    save();
    render();
  }

  function decideParkObject() {
    const object = PARK[parkIndex];
    parkDecided = true;
    setBrain(object.confidence, object.ball);
    setStatus(object.ball ? 'phase3CorrectBall' : 'phase3CorrectNot', 'good', [t(object.name), object.confidence]);
    sound.correct();
    el.dog.classList.add(object.ball ? 'fetching' : 'leaving');
    setTimeout(() => el.dog.classList.remove('fetching', 'leaving'), 760);
    window.cool?.track?.('test-unseen-object', { object: object.id, prediction: object.ball ? 'ball' : 'not-ball', confidence: object.confidence });
    save();
    renderControls();
  }

  function advancePark() {
    if (parkIndex >= PARK.length - 1) {
      completed = true;
      save();
      showCompletion(true);
      return;
    }
    parkIndex += 1;
    parkDecided = false;
    statusMessage = { key: 'phase3Ready', tone: '' };
    save();
    render();
    animateObject();
  }

  function goNextLesson() {
    phase = Math.min(2, phase + 1);
    statusMessage = { key: phase === 1 ? 'phase2Ready' : 'phase3Ready', tone: '' };
    window.cool?.stage?.(`robo-pet-${phase + 1}`);
    save();
    render();
    animateObject();
  }

  function showCompletion(withSound) {
    el.modal.hidden = false;
    el.course.inert = true;
    el.playAgain.focus();
    if (withSound) {
      sound.graduate();
      window.cool?.complete?.();
      window.cool?.track?.('graduate-robo-pet', { parkTests: PARK.length });
    }
  }

  function reset() {
    phase = 0;
    unlocked = 0;
    basicIndex = 0;
    correctionIndex = -1;
    parkIndex = 0;
    biasTested = false;
    retrained = false;
    parkDecided = false;
    completed = false;
    statusMessage = { key: 'phase1Ready', tone: '' };
    el.modal.hidden = true;
    el.course.inert = false;
    save();
    render();
    animateObject();
  }

  function showHint() {
    let key = 'phase1Hint';
    if (phase === 1) key = biasTested ? 'phase2HintLabel' : 'phase2HintBefore';
    if (phase === 2) key = 'phase3Hint';
    setStatus(key);
    sound.tap();
    window.cool?.track?.('request-robo-pet-hint', { lesson: phase + 1 });
  }

  el.ball.addEventListener('click', () => labelCurrent(true));
  el.notBall.addEventListener('click', () => labelCurrent(false));
  el.biasTest.addEventListener('click', runBiasTest);
  el.retrain.addEventListener('click', retrainModel);
  el.decide.addEventListener('click', decideParkObject);
  el.nextObject.addEventListener('click', advancePark);
  el.nextLesson.addEventListener('click', goNextLesson);
  el.hint.addEventListener('click', showHint);
  el.playAgain.addEventListener('click', reset);
  el.sound.addEventListener('click', () => {
    sound.setMuted(!sound.muted);
    render();
  });
  el.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  el.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  addEventListener('resize', () => drawBrain());
  addEventListener('themechange', () => requestAnimationFrame(() => drawBrain()));

  window.cool.bindI18n(I18N, {
    onChange({ t: translate, lang, theme }) {
      t = translate;
      language = lang;
      document.title = t('doc');
      el.lang.textContent = lang === 'zh' ? 'EN' : '中';
      el.theme.textContent = theme === 'light' ? '🌙' : '☀️';
      render();
    },
  });
  window.cool?.stage?.(`robo-pet-${phase + 1}`);
})();
