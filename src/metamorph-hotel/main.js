(() => {
  'use strict';

  const I18N = {
    zh: {
      doc: '变形旅馆 · KidsLab',
      back: '返回平台',
      title: '变形旅馆',
      theme: '切换主题',
      eyebrow: '今日值班任务',
      tip: '看清客人现在的样子，安排合适房间。住对一晚，它就会进入下一个生命阶段！',
      records: '变形档案',
      guestCard: '入住登记卡',
      currentStage: '当前阶段',
      roomService: '房间服务台',
      chooseRoom: '为这一阶段选房',
      hint: '💡 看一眼提示',
      night: '旅程',
      filed: '档案已收录',
      reset: '重新接待',
      locked: '先完成前一位客人的变形档案。',
      guests: ['蝴蝶客人', '青蛙客人', '蝗虫客人'],
      stages: [
        ['卵', '幼虫', '蛹', '成虫'],
        ['卵', '蝌蚪', '幼蛙', '成蛙'],
        ['卵', '若虫', '成虫'],
      ],
      prompts: [
        [
          '蝴蝶从一枚小小的卵开始。哪间房能保护它？',
          '毛毛虫醒来就要吃东西、长身体。把它送去哪里？',
          '毛毛虫变成蛹了。这个阶段不用送餐，安静等待就好。',
          '翅膀展开了！成年蝴蝶要去哪里补充能量并退房？',
        ],
        [
          '青蛙卵需要待在水里。哪间育婴房最合适？',
          '蝌蚪有尾巴、用鳃在水中呼吸。它该住哪里？',
          '腿和肺长出来，尾巴正在变短。幼蛙需要怎样的房间？',
          '成蛙能用肺呼吸，也离不开湿润环境。安排它退房吧！',
        ],
        [
          '蝗虫把卵产在土里。哪间育婴房能保护卵？',
          '若虫像迷你蝗虫，没有完整翅膀，要一边吃草一边蜕皮长大。',
          '最后一次蜕皮后，成年蝗虫有了完整翅膀。送它去哪里？',
        ],
      ],
      missions: [
        ['选一间适合蝴蝶卵的房间。', '给毛毛虫准备成长餐。', '给蛹安排安静房间。', '为成年蝴蝶安排花蜜。'],
        ['把青蛙卵送进水中。', '让蝌蚪继续住在水下。', '给幼蛙水陆相连的空间。', '把成蛙送到湿地。'],
        ['把蝗虫卵安置在土里。', '给若虫安排草地。', '让成年蝗虫回到高草间。'],
      ],
      hints: [
        ['蝴蝶妈妈通常把卵留在植物上。', '这个阶段最重要的工作是吃和长大。', '蛹不会出来吃饭，别把它叫醒。', '成年蝴蝶常从花朵吸食花蜜。'],
        ['青蛙的生命通常从水中的卵开始。', '有鳃和尾巴，说明它现在完全生活在水里。', '腿长出来了，但还需要水边的湿润环境。', '成蛙能上岸，也常在池塘和湿地附近活动。'],
        ['蝗虫卵通常藏在土中。', '若虫会吃植物，并通过一次次蜕皮长大。', '有了完整翅膀，可以回到高草间生活和繁殖。'],
      ],
      wrong: [
        ['这里太干，卵需要待在安全的叶片上。换一把房间钥匙！', '这不是毛毛虫的成长餐。它现在需要吃叶子。', '蛹期不从外界吃东西。给它一间安静房吧！', '成年蝴蝶不再像毛毛虫那样大口吃叶子，找找花朵。'],
        ['青蛙卵不能住进干燥房间，快送回水里。', '蝌蚪现在用鳃呼吸，不能离开水下。', '幼蛙正在从水生转向水陆生活，需要浅水岸边。', '成蛙不是蛹，也不会住进枝头蛹房。'],
        ['蝗虫卵需要土壤保护，不住池塘或枝头。', '若虫不结蛹，它要在草地上进食和蜕皮。', '成年蝗虫有完整翅膀，适合生活在高草间。'],
      ],
      correct: [
        ['叶片育婴室开门！卵安全孵化成了毛毛虫。', '嫩叶吃饱啦！毛毛虫长大，准备进入蛹期。', '安静等待后，蛹裂开了——翅膀正在展开！', '花蜜补充完毕，成年蝴蝶可以飞出旅馆啦！'],
        ['静水育婴池准备好，卵孵化成了蝌蚪。', '蝌蚪在水下长大，后腿和前腿陆续出现。', '浅水岸边让幼蛙练习用肺呼吸，尾巴也越来越短。', '成蛙跳进湿地，准备开始新的生命周期！'],
        ['土壤育婴房保护着卵，若虫钻出来了。', '若虫在草地进食，多次蜕皮，身体越来越像成虫。', '没有蛹期！最后一次蜕皮后，完整翅膀展开了。'],
      ],
      completeTitles: ['蝴蝶展翅退房啦！', '青蛙跳进湿地啦！', '蝗虫张开翅膀啦！'],
      lessons: [
        '蝴蝶经历卵、幼虫、蛹、成虫四个差别很大的阶段，这叫完全变态。',
        '青蛙从水中的卵和蝌蚪开始，长出腿和肺，尾巴逐渐被身体吸收。',
        '蝗虫只有卵、若虫、成虫三个主要阶段，没有蛹期，这叫不完全变态。',
      ],
      next: '接待下一位客人',
      replay: '重新开张',
      grandTitle: '三本变形档案收齐！',
      grandText: '你发现了关键区别：蝴蝶有蛹期，蝗虫没有；青蛙则从水生蝌蚪慢慢变成能上岸的成蛙。',
      choices: {
        leafNursery: ['叶片育婴室', '柔软叶面托住小小的卵', '🍃'],
        pondNursery: ['静水育婴池', '水中育婴区，保持湿润', '💧'],
        soilNursery: ['土壤育婴房', '松软土层保护卵', '🪹'],
        leafBuffet: ['嫩叶自助餐', '新鲜叶片，适合大口进食', '🥬'],
        flowerCafe: ['花蜜咖啡厅', '花朵为成年访客提供花蜜', '🌸'],
        quietBranch: ['安静枝头房（不送餐）', '悬挂休息，不打扰、不投喂', '🌿'],
        underwater: ['水下成长房', '可以摆尾游动的水下空间', '🫧'],
        shallowShore: ['浅水岸边房', '水与陆地相连，方便练习上岸', '🏝️'],
        wetland: ['湿地虫虫餐厅', '湿润岸边，也有小昆虫', '🪰'],
        sunnyMeadow: ['阳光嫩草房', '嫩草充足，方便蜕皮长大', '🌱'],
        tallGrass: ['高草飞行套房', '适合有翅成虫活动', '🌾'],
      },
    },
    en: {
      doc: 'Metamorphosis Hotel · KidsLab',
      back: 'Back to platform',
      title: 'Metamorphosis Hotel',
      theme: 'Switch theme',
      eyebrow: "Today's hotel duty",
      tip: 'Study the guest, then choose the right room. A correct stay moves it into its next life stage!',
      records: 'Guest files',
      guestCard: 'Check-in card',
      currentStage: 'Current stage',
      roomService: 'Room service desk',
      chooseRoom: 'Choose a room for this stage',
      hint: '💡 Show a hint',
      night: 'Journey',
      filed: 'File collected',
      reset: 'Restart guest',
      locked: 'Complete the previous guest file first.',
      guests: ['Butterfly guest', 'Frog guest', 'Grasshopper guest'],
      stages: [
        ['Egg', 'Larva', 'Pupa', 'Adult'],
        ['Egg', 'Tadpole', 'Froglet', 'Adult'],
        ['Egg', 'Nymph', 'Adult'],
      ],
      prompts: [
        [
          'A butterfly starts as a tiny egg. Which room will protect it?',
          'The caterpillar wakes up ready to eat and grow. Where should it go?',
          'The caterpillar is now a pupa. It does not need food, only quiet time.',
          'The wings are open! Where can the adult butterfly refuel before checkout?',
        ],
        [
          'Frog eggs need to stay in water. Which nursery fits?',
          'The tadpole has a tail and breathes with gills underwater. Where should it stay?',
          'Legs and lungs are growing while the tail shrinks. What room fits a froglet?',
          'An adult frog breathes with lungs but still needs a damp home. Check it out!',
        ],
        [
          'Grasshoppers lay eggs in soil. Which nursery protects them?',
          'A nymph is like a tiny wingless grasshopper. It eats plants and molts to grow.',
          'After the final molt, the adult has full wings. Where should it go?',
        ],
      ],
      missions: [
        ['Choose a safe room for a butterfly egg.', 'Serve the caterpillar a growth meal.', 'Give the pupa a quiet room.', 'Find nectar for the adult butterfly.'],
        ['Place frog eggs in water.', 'Keep the tadpole underwater.', 'Give the froglet both water and land.', 'Send the adult frog to a wetland.'],
        ['Protect grasshopper eggs in soil.', 'Give the nymph a meadow.', 'Send the adult into tall grass.'],
      ],
      hints: [
        ['Butterfly mothers usually leave eggs on plants.', 'Eating and growing are the main jobs at this stage.', 'A pupa does not come out to eat. Let it rest.', 'Adult butterflies often sip nectar from flowers.'],
        ['A frog usually begins life as eggs in water.', 'Gills and a tail mean it still lives fully underwater.', 'Legs are here, but a damp shoreline still helps.', 'Adult frogs go on land and often stay near ponds and wetlands.'],
        ['Grasshopper eggs are usually hidden in soil.', 'Nymphs eat plants and grow through repeated molts.', 'With full wings, the adult belongs among tall grasses.'],
      ],
      wrong: [
        ['Too dry! The egg needs a safe leaf. Try another key.', 'That is not a caterpillar growth meal. It needs leaves now.', 'A pupa does not feed from outside. Find a quiet room.', 'An adult butterfly no longer eats leaves like a caterpillar. Look for flowers.'],
        ['Frog eggs cannot stay in a dry room. Put them in water.', 'A tadpole breathes with gills, so it must stay underwater.', 'A froglet is changing from water life to land life. It needs a shallow shore.', 'An adult frog is not a pupa and does not belong in the branch room.'],
        ['Grasshopper eggs need protective soil, not a pond or branch.', 'A nymph does not become a pupa. It eats and molts in a meadow.', 'An adult grasshopper has full wings and belongs in tall grass.'],
      ],
      correct: [
        ['Leaf nursery ready! The egg hatches into a caterpillar.', 'Leaf buffet finished! The caterpillar grows and prepares to pupate.', 'After a quiet wait, the pupa opens and wings unfold!', 'Nectar refuel complete. The adult butterfly flies out of the hotel!'],
        ['Still-water nursery ready. The eggs hatch into tadpoles.', 'The tadpole grows underwater as back and front legs appear.', 'The shallow shore lets the froglet practice breathing air as its tail shrinks.', 'The adult frog jumps into the wetland to begin the cycle again!'],
        ['The soil nursery protects the eggs until nymphs hatch.', 'The nymph eats plants and molts, looking more adult each time.', 'No pupa stage! Full wings open after the final molt.'],
      ],
      completeTitles: ['The butterfly checks out with wings!', 'The frog leaps into the wetland!', 'The grasshopper opens its wings!'],
      lessons: [
        'Butterflies pass through egg, larva, pupa, and adult stages that look very different. This is complete metamorphosis.',
        'Frogs begin as eggs and tadpoles in water, then grow legs and lungs while the tail is absorbed.',
        'Grasshoppers have three main stages: egg, nymph, and adult. With no pupa stage, this is incomplete metamorphosis.',
      ],
      next: 'Welcome the next guest',
      replay: 'Reopen the hotel',
      grandTitle: 'All three transformation files collected!',
      grandText: 'You found the key difference: butterflies have a pupa stage, grasshoppers do not, and frogs change from aquatic tadpoles into adults that can live on land.',
      choices: {
        leafNursery: ['Leaf Nursery', 'A soft leaf supports tiny eggs', '🍃'],
        pondNursery: ['Still-Water Nursery', 'A watery nursery that stays damp', '💧'],
        soilNursery: ['Soil Nursery', 'Loose soil protects the eggs', '🪹'],
        leafBuffet: ['Tender Leaf Buffet', 'Fresh leaves for a growing eater', '🥬'],
        flowerCafe: ['Nectar Flower Cafe', 'Flowers offer nectar to adult guests', '🌸'],
        quietBranch: ['Quiet Branch Room — No Meals', 'Rest undisturbed without feeding', '🌿'],
        underwater: ['Underwater Growth Room', 'Space to swim with a tail', '🫧'],
        shallowShore: ['Shallow Shore Room', 'Water meets land for first steps', '🏝️'],
        wetland: ['Wetland Bug Cafe', 'A damp shore with small insects', '🪰'],
        sunnyMeadow: ['Sunny Meadow Room', 'Tender plants and room to molt', '🌱'],
        tallGrass: ['Tall-Grass Flight Suite', 'Space for winged adults', '🌾'],
      },
    },
  };

  const GUESTS = [
    {
      id: 'butterfly',
      icons: ['🥚', '🐛', '🟤', '🦋'],
      options: [
        ['leafNursery', 'pondNursery', 'soilNursery'],
        ['leafBuffet', 'flowerCafe', 'quietBranch'],
        ['quietBranch', 'leafBuffet', 'underwater'],
        ['flowerCafe', 'leafBuffet', 'soilNursery'],
      ],
      answers: ['leafNursery', 'leafBuffet', 'quietBranch', 'flowerCafe'],
      finale: '🦋✨',
    },
    {
      id: 'frog',
      icons: ['🫧', '〰️', '🐸', '🐸'],
      options: [
        ['pondNursery', 'leafNursery', 'soilNursery'],
        ['underwater', 'flowerCafe', 'sunnyMeadow'],
        ['shallowShore', 'underwater', 'quietBranch'],
        ['wetland', 'leafBuffet', 'quietBranch'],
      ],
      answers: ['pondNursery', 'underwater', 'shallowShore', 'wetland'],
      finale: '🐸💦',
    },
    {
      id: 'grasshopper',
      icons: ['🥚', '🦗', '🦗'],
      options: [
        ['soilNursery', 'pondNursery', 'leafNursery'],
        ['sunnyMeadow', 'quietBranch', 'flowerCafe'],
        ['tallGrass', 'underwater', 'quietBranch'],
      ],
      answers: ['soilNursery', 'sunnyMeadow', 'tallGrass'],
      finale: '🦗✨',
    },
  ];

  const SAVE_KEY = 'kidslab.metamorph-hotel';
  const $ = (selector) => document.querySelector(selector);
  const els = {
    lang: $('#langBtn'),
    theme: $('#themeBtn'),
    records: $('#recordCount'),
    tabs: $('#guestTabs'),
    guestTitle: $('#guestTitle'),
    trail: $('#stageTrail'),
    guestWrap: $('#guestWrap'),
    guestIcon: $('#guestIcon'),
    stageName: $('#stageName'),
    narrator: $('#narrator'),
    mission: $('#mission'),
    choices: $('#choiceGrid'),
    hint: $('#hintBtn'),
    night: $('#nightCount'),
    reset: $('#resetBtn'),
    modal: $('#modal'),
    modalArt: $('#modalArt'),
    modalTitle: $('#modalTitle'),
    modalText: $('#modalText'),
    summary: $('#cycleSummary'),
    next: $('#nextBtn'),
  };

  const saved = (() => {
    try {
      const value = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch {
      return {};
    }
  })();

  let t = (key) => key;
  let lang = window.cool.preferences.lang;
  let guestIndex = Math.min(2, Math.max(0, Number(saved.guest) || 0));
  let unlocked = Math.min(2, Math.max(guestIndex, Number(saved.unlocked) || 0));
  let completed = Math.min(3, Math.max(0, Number(saved.completed) || 0));
  let stageIndex = 0;
  let busy = false;
  let feedbackKey = 'prompt';
  let hintTimer = 0;
  let markedChoice = '';
  let markedKind = '';

  function guest() {
    return GUESTS[guestIndex];
  }

  function persist() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ guest: guestIndex, unlocked, completed }));
    } catch {
      // The game remains fully playable when persistence is unavailable.
    }
  }

  function setNarrator(text) {
    els.narrator.textContent = text;
  }

  function currentText(collection) {
    return collection[guestIndex][stageIndex];
  }

  function scheduleHint() {
    clearTimeout(hintTimer);
    hintTimer = window.setTimeout(() => {
      if (!busy && els.modal.hidden) {
        feedbackKey = 'hint';
        setNarrator(currentText(t('hints')));
      }
    }, 30000);
  }

  function renderTabs() {
    els.tabs.innerHTML = t('guests').map((name, index) => {
      const disabled = index > unlocked;
      const done = index < completed;
      return `<button class="guest-tab ${index === guestIndex ? 'is-active' : ''} ${done ? 'is-done' : ''}" type="button" data-guest="${index}" ${disabled ? 'disabled' : ''}>${GUESTS[index].icons.at(-1)} ${name}</button>`;
    }).join('');
    els.tabs.querySelectorAll('[data-guest]').forEach((button) => {
      button.addEventListener('click', () => setGuest(Number(button.dataset.guest)));
    });
  }

  function renderTrail() {
    els.trail.style.setProperty('--stage-count', guest().icons.length);
    els.trail.innerHTML = guest().icons.map((icon, index) => {
      const status = index < stageIndex ? 'is-done' : (index === stageIndex ? 'is-current' : '');
      return `<div class="stage-node ${status}">
        <span class="stage-node__icon">${icon}</span>
        <strong>${t('stages')[guestIndex][index]}</strong>
      </div>`;
    }).join('');
  }

  function renderChoices() {
    els.choices.innerHTML = guest().options[stageIndex].map((id, index) => {
      const [name, detail, icon] = t('choices')[id];
      const stateClass = id === markedChoice ? `is-${markedKind}` : '';
      return `<button class="choice-card ${stateClass}" type="button" data-choice="${id}" aria-label="${name}" ${busy ? 'disabled' : ''}>
        <span class="choice-card__icon">${icon}</span>
        <span><b>${name}</b><small>${detail}</small></span>
        <span class="choice-card__key">${index + 1}</span>
      </button>`;
    }).join('');
    els.choices.querySelectorAll('[data-choice]').forEach((button) => {
      button.addEventListener('click', () => chooseRoom(button.dataset.choice));
    });
  }

  function render() {
    els.records.textContent = `${completed}/3`;
    els.guestTitle.textContent = t('guests')[guestIndex];
    els.guestIcon.textContent = guest().icons[stageIndex];
    els.stageName.textContent = t('stages')[guestIndex][stageIndex];
    els.mission.textContent = currentText(t('missions'));
    els.night.textContent = `${stageIndex + 1}/${guest().icons.length}`;
    els.reset.setAttribute('aria-label', t('reset'));
    els.theme.setAttribute('aria-label', t('theme'));
    if (feedbackKey === 'prompt') setNarrator(currentText(t('prompts')));
    if (feedbackKey === 'hint') setNarrator(currentText(t('hints')));
    renderTabs();
    renderTrail();
    renderChoices();
  }

  function chooseRoom(choice) {
    if (busy) return;
    clearTimeout(hintTimer);
    markedChoice = choice;

    if (choice !== guest().answers[stageIndex]) {
      markedKind = 'wrong';
      feedbackKey = 'wrong';
      setNarrator(currentText(t('wrong')));
      window.cool.track('retry_hotel_room');
      renderChoices();
      window.setTimeout(() => {
        markedChoice = '';
        markedKind = '';
        renderChoices();
      }, 420);
      scheduleHint();
      return;
    }

    busy = true;
    markedKind = 'correct';
    feedbackKey = 'correct';
    setNarrator(currentText(t('correct')));
    els.guestIcon.classList.add('is-changing');
    window.cool.track('match_life_stage_room');
    renderChoices();

    window.setTimeout(() => {
      els.guestIcon.classList.remove('is-changing');
      stageIndex += 1;
      markedChoice = '';
      markedKind = '';
      busy = false;

      if (stageIndex >= guest().icons.length) {
        completeGuest();
        return;
      }

      feedbackKey = 'prompt';
      window.cool.stage(`${guest().id}-stage-${stageIndex + 1}`);
      render();
      scheduleHint();
    }, 540);
  }

  function cycleSummary(index) {
    return GUESTS[index].icons.map((icon, stage) =>
      `<span>${icon} ${t('stages')[index][stage]}</span>${stage < GUESTS[index].icons.length - 1 ? '<i>→</i>' : ''}`).join('');
  }

  function completeGuest() {
    const finishedIndex = guestIndex;
    completed = Math.max(completed, finishedIndex + 1);
    if (finishedIndex < GUESTS.length - 1) unlocked = Math.max(unlocked, finishedIndex + 1);
    persist();
    window.cool.stage(`${guest().id}-complete`);
    if (finishedIndex === GUESTS.length - 1) window.cool.complete?.();

    els.modalArt.textContent = guest().finale;
    els.modalTitle.textContent = finishedIndex === GUESTS.length - 1 ? t('grandTitle') : t('completeTitles')[finishedIndex];
    els.modalText.textContent = finishedIndex === GUESTS.length - 1 ? t('grandText') : t('lessons')[finishedIndex];
    els.summary.innerHTML = cycleSummary(finishedIndex);
    els.next.textContent = finishedIndex === GUESTS.length - 1 ? t('replay') : t('next');
    els.modal.hidden = false;
    renderTabs();
  }

  function resetGuest() {
    clearTimeout(hintTimer);
    stageIndex = 0;
    busy = false;
    feedbackKey = 'prompt';
    markedChoice = '';
    markedKind = '';
    els.modal.hidden = true;
    window.cool.stage(`${guest().id}-stage-1`);
    render();
    scheduleHint();
  }

  function setGuest(index) {
    if (index > unlocked) {
      setNarrator(t('locked'));
      return;
    }
    guestIndex = index;
    persist();
    resetGuest();
  }

  function nextGuest() {
    els.modal.hidden = true;
    setGuest(guestIndex === GUESTS.length - 1 ? 0 : guestIndex + 1);
  }

  function showHint() {
    feedbackKey = 'hint';
    setNarrator(currentText(t('hints')));
    window.cool.track('open_life_stage_hint');
    scheduleHint();
  }

  els.lang.addEventListener('click', () => window.cool.preferences.toggleLang());
  els.theme.addEventListener('click', () => window.cool.preferences.toggleTheme());
  els.hint.addEventListener('click', showHint);
  els.reset.addEventListener('click', resetGuest);
  els.next.addEventListener('click', nextGuest);

  window.addEventListener('keydown', (event) => {
    if (busy || !els.modal.hidden) return;
    const number = Number(event.key);
    if (number >= 1 && number <= 3) {
      const choice = guest().options[stageIndex][number - 1];
      if (choice) chooseRoom(choice);
    }
  });

  window.cool.bindI18n(I18N, {
    onChange(context) {
      t = context.t;
      lang = context.lang;
      document.title = t('doc');
      els.lang.textContent = lang === 'zh' ? 'EN' : '中';
      els.theme.textContent = context.theme === 'light' ? '🌙' : '☀️';
      feedbackKey = 'prompt';
      if (!els.modal.hidden) {
        const final = guestIndex === GUESTS.length - 1;
        els.modalTitle.textContent = final ? t('grandTitle') : t('completeTitles')[guestIndex];
        els.modalText.textContent = final ? t('grandText') : t('lessons')[guestIndex];
        els.summary.innerHTML = cycleSummary(guestIndex);
        els.next.textContent = final ? t('replay') : t('next');
        renderTabs();
        return;
      }
      render();
    },
  });

  resetGuest();
})();
