/* 酸碱魔法水 Acid-Base Magic Water */
(() => {
  'use strict';

  const I18N = {
    zh: {
      back: '返回平台', title: '酸碱魔法水', langBtn: 'EN', doc: '酸碱魔法水 · KidsLab',
      secSub: '选择一杯样品（不会混合）', secPh: '或者直接调节 pH', secInd: '换一种指示剂',
      acid: '← 酸性', base: '碱性 →',
      tagAcid: '酸性', tagNeutral: '中性', tagBase: '碱性',
      tagStrongAcid: '酸性较强', tagStrongBase: '碱性较强',
      scopeNote: '约 25 °C 的常见稀水溶液教学模型；样品 pH 与颜色均为示意。',
      safety: '仅为虚拟模拟。现实中切勿混合漂白水与氨水、食醋、柠檬汁或其他清洁剂。',
      hIon: (value) => `估算 [H₃O⁺] ≈ ${value} mol/L`,
      inds: { universal: '通用指示剂', litmus: '石蕊', phenol: '酚酞' },
      indNotes: {
        universal: '这是一种示意色卡；通用指示剂的实际颜色会随配方和产品而变。',
        litmus: '石蕊约在 pH 5 以下偏红、pH 8 以上偏蓝，中间呈过渡色。',
        phenol: '酚酞通常在约 pH 8–10 由无色逐渐变粉；强碱中还可能随时间褪色。',
      },
      subs: {
        lemon: '柠檬汁', cola: '可乐', vinegar: '食醋', coffee: '咖啡', milk: '牛奶',
        water: '纯水', seawater: '海水', soda: '小苏打水', soap: '肥皂水', ammonia: '氨水', bleach: '漂白水',
      },
    },
    en: {
      back: 'Back to platform', title: 'Acid-Base Magic Water', langBtn: '中', doc: 'Acid-Base Magic Water · KidsLab',
      secSub: 'Choose a fresh sample (no mixing)', secPh: 'Or tune the pH directly', secInd: 'Switch the indicator',
      acid: '← Acidic', base: 'Basic →',
      tagAcid: 'Acidic', tagNeutral: 'Neutral', tagBase: 'Basic',
      tagStrongAcid: 'More acidic', tagStrongBase: 'More basic',
      scopeNote: 'A teaching model for common dilute aqueous solutions near 25 °C; sample pH and colours are illustrative.',
      safety: 'Virtual simulation only. Never mix bleach with ammonia, vinegar, lemon juice, or other cleaners.',
      hIon: (value) => `Estimated [H₃O⁺] ≈ ${value} mol/L`,
      inds: { universal: 'Universal', litmus: 'Litmus', phenol: 'Phenolphthalein' },
      indNotes: {
        universal: 'This is an illustrative colour chart; real universal-indicator colours vary by formula and product.',
        litmus: 'Litmus is reddish below about pH 5 and blue above about pH 8, with transition colours in between.',
        phenol: 'Phenolphthalein usually changes gradually from colourless to pink around pH 8–10 and may fade in strong base.',
      },
      subs: {
        lemon: 'Lemon juice', cola: 'Cola', vinegar: 'Vinegar', coffee: 'Coffee', milk: 'Milk',
        water: 'Pure water', seawater: 'Sea water', soda: 'Baking soda', soap: 'Soapy water', ammonia: 'Ammonia', bleach: 'Bleach',
      },
    },
  };
  let lang = window.cool.preferences.lang;

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
    litmus: [[0, '#e5484d'], [5, '#e5484d'], [6.5, '#9a6bd0'], [8, '#3b6fd4'], [14, '#3b6fd4']],
    phenol: [[0, '#dff3f8'], [8, '#dff3f8'], [9, '#ff8fc0'], [10, '#f0409a'], [14, '#e01e86']],
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
    if (Math.abs(ph - 7) < 0.05) return [t.tagNeutral, '#06d6a0'];
    if (ph < 3) return [t.tagStrongAcid, '#e5243b'];
    if (ph < 7) return [t.tagAcid, '#f46d1b'];
    if (ph <= 11) return [t.tagBase, '#2196f3'];
    return [t.tagStrongBase, '#6a1b9a'];
  }

  function hIonText() {
    const exp = -ph;
    const mant = Math.pow(10, exp - Math.floor(exp));
    const e = Math.floor(exp);
    const sup = (n) => String(n).replace(/-/g, '⁻').replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
    return I18N[lang].hIon(`${mant.toFixed(1)}×10${sup(e)}`);
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
      b.innerHTML = `<span>${s.icon}</span>${t.subs[s.id]}<small>≈ pH ${s.ph}</small>`;
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

  $('#langBtn').addEventListener('click', () => window.cool.preferences.toggleLang());
  $('#themeBtn').addEventListener('click', () => window.cool.preferences.toggleTheme());
  window.cool.bindI18n(I18N, {
    onChange({ kind, lang: nextLang, theme, t }) {
      $('#themeBtn').textContent = theme === 'light' ? '🌙' : '☀️';
      if (kind === 'theme') return;
      lang = nextLang;
      $('#langBtn').textContent = t('langBtn');
      document.title = t('doc');
      renderSubs();
      renderInds();
      update();
    },
  });
})();
