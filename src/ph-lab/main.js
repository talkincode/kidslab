/* 酸碱魔法水 Acid-Base Magic Water */
(() => {
  'use strict';

  const I18N = {
    zh: {
      back: '返回平台', title: '酸碱魔法水', langBtn: 'EN', doc: '酸碱魔法水 · KidsLab',
      secSub: '往烧杯里加点什么？', secPh: '或者直接调节 pH', secInd: '换一种指示剂',
      acid: '← 酸性', base: '碱性 →',
      tagAcid: '酸性', tagNeutral: '中性', tagBase: '碱性',
      tagStrongAcid: '强酸性', tagStrongBase: '强碱性',
      inds: { universal: '通用指示剂', litmus: '石蕊', phenol: '酚酞' },
      indNotes: {
        universal: '通用指示剂像彩虹一样：红色代表强酸，绿色代表中性，紫色代表强碱。',
        litmus: '石蕊遇酸变红，遇碱变蓝，中性时呈紫色 —— 化学课上的老朋友！',
        phenol: '酚酞在酸性和中性溶液里是无色的，遇到碱（pH > 8.2）才会变成粉红色。',
      },
      subs: {
        lemon: '柠檬汁', cola: '可乐', vinegar: '食醋', coffee: '咖啡', milk: '牛奶',
        water: '纯水', seawater: '海水', soda: '小苏打水', soap: '肥皂水', ammonia: '氨水', bleach: '漂白水',
      },
    },
    en: {
      back: 'Back to platform', title: 'Acid-Base Magic Water', langBtn: '中', doc: 'Acid-Base Magic Water · KidsLab',
      secSub: 'Pour something into the beaker', secPh: 'Or tune the pH directly', secInd: 'Switch the indicator',
      acid: '← Acidic', base: 'Basic →',
      tagAcid: 'Acidic', tagNeutral: 'Neutral', tagBase: 'Basic',
      tagStrongAcid: 'Strongly acidic', tagStrongBase: 'Strongly basic',
      inds: { universal: 'Universal', litmus: 'Litmus', phenol: 'Phenolphthalein' },
      indNotes: {
        universal: 'Universal indicator is a rainbow: red means strong acid, green neutral, purple strong base.',
        litmus: 'Litmus turns red in acid and blue in base — purple when neutral. A classic!',
        phenol: 'Phenolphthalein stays colourless in acid and neutral water, and blushes pink above pH 8.2.',
      },
      subs: {
        lemon: 'Lemon juice', cola: 'Cola', vinegar: 'Vinegar', coffee: 'Coffee', milk: 'Milk',
        water: 'Pure water', seawater: 'Sea water', soda: 'Baking soda', soap: 'Soapy water', ammonia: 'Ammonia', bleach: 'Bleach',
      },
    },
  };
  let lang = localStorage.getItem('kidslab.lang') || 'zh';
  if (!I18N[lang]) lang = 'zh';

  const SUBS = [
    { id: 'lemon', icon: '🍋', ph: 2.0 },
    { id: 'cola', icon: '🥤', ph: 2.5 },
    { id: 'vinegar', icon: '🫙', ph: 2.9 },
    { id: 'coffee', icon: '☕', ph: 5.0 },
    { id: 'milk', icon: '🥛', ph: 6.6 },
    { id: 'water', icon: '💧', ph: 7.0 },
    { id: 'seawater', icon: '🌊', ph: 8.1 },
    { id: 'soda', icon: '🧁', ph: 9.0 },
    { id: 'soap', icon: '🧼', ph: 10.0 },
    { id: 'ammonia', icon: '🧴', ph: 11.5 },
    { id: 'bleach', icon: '🫧', ph: 12.6 },
  ];

  /* 指示剂 → 颜色 stops [ph, color] 线性插值 */
  const INDICATORS = {
    universal: [
      [0, '#e5243b'], [2, '#f04a1e'], [4, '#f9a825'], [6, '#c0ca33'],
      [7, '#4caf50'], [8, '#26a69a'], [10, '#2196f3'], [12, '#3f51b5'], [14, '#6a1b9a'],
    ],
    litmus: [[0, '#e5484d'], [4.9, '#e5484d'], [6.6, '#9a6bd0'], [8.2, '#9a6bd0'], [9.5, '#3b6fd4'], [14, '#3b6fd4']],
    phenol: [[0, '#dff3f8'], [8.1, '#dff3f8'], [9.2, '#ff8fc0'], [10.5, '#f0409a'], [14, '#e01e86']],
  };

  let ph = 7;
  let ind = 'universal';
  let activeSub = 'water';

  const $ = (s) => document.querySelector(s);

  /* ---------- 颜色插值 ---------- */
  const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (c1, c2, k) => {
    const a = hex2rgb(c1), b = hex2rgb(c2);
    return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`;
  };
  function liquidColor() {
    const stops = INDICATORS[ind];
    if (ph <= stops[0][0]) return stops[0][1];
    for (let i = 1; i < stops.length; i++) {
      if (ph <= stops[i][0]) {
        const [p0, c0] = stops[i - 1], [p1, c1] = stops[i];
        return mix(c0, c1, (ph - p0) / (p1 - p0));
      }
    }
    return stops[stops.length - 1][1];
  }

  /* ---------- 渲染 ---------- */
  function tag() {
    const t = I18N[lang];
    if (ph < 3) return [t.tagStrongAcid, '#e5243b'];
    if (ph < 6.5) return [t.tagAcid, '#f46d1b'];
    if (ph <= 7.5) return [t.tagNeutral, '#06d6a0'];
    if (ph <= 11) return [t.tagBase, '#2196f3'];
    return [t.tagStrongBase, '#6a1b9a'];
  }

  function hIonText() {
    const exp = -ph;
    const mant = Math.pow(10, exp - Math.floor(exp));
    const e = Math.floor(exp);
    const sup = (n) => String(n).replace(/-/g, '⁻').replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
    return `[H⁺] = ${mant.toFixed(1)}×10${sup(e)} mol/L`;
  }

  function update() {
    $('#liquid').setAttribute('fill', liquidColor());
    $('#phVal').textContent = ph.toFixed(1);
    const [txt, color] = tag();
    const tagEl = $('#phTag');
    tagEl.textContent = txt;
    tagEl.style.background = color;
    $('#hIon').textContent = hIonText();
    $('#phRange').value = ph;
    document.querySelectorAll('.subs button').forEach((b) => b.classList.toggle('on', b.dataset.id === activeSub));
  }

  function renderSubs() {
    const t = I18N[lang];
    const box = $('#subs');
    box.innerHTML = '';
    for (const s of SUBS) {
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.id = s.id;
      b.innerHTML = `<span>${s.icon}</span>${t.subs[s.id]}<small>pH ${s.ph}</small>`;
      b.addEventListener('click', () => { ph = s.ph; activeSub = s.id; update(); });
      box.appendChild(b);
    }
  }

  function renderInds() {
    const t = I18N[lang];
    const box = $('#inds');
    box.innerHTML = '';
    for (const key of Object.keys(INDICATORS)) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = t.inds[key];
      b.classList.toggle('on', ind === key);
      b.addEventListener('click', () => { ind = key; renderInds(); update(); });
      box.appendChild(b);
    }
    $('#indNote').textContent = t.indNotes[ind];
  }

  $('#phRange').addEventListener('input', (e) => {
    ph = +e.target.value;
    activeSub = '';
    update();
  });

  function applyLang() {
    const t = I18N[lang];
    document.querySelectorAll('[data-t]').forEach((n) => { n.textContent = t[n.dataset.t]; });
    $('#langBtn').textContent = t.langBtn;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = t.doc;
    renderSubs();
    renderInds();
    update();
  }
  $('#langBtn').addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    localStorage.setItem('kidslab.lang', lang);
    applyLang();
  });

  applyLang();
})();
