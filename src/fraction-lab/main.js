/* Fraction Pizzeria */
(() => {
  'use strict';

  const I18N = {
    zh: {
      back: '返回平台',
      title: '分数披萨店',
      brandKicker: 'KIDSLAB · MATH KITCHEN',
      langBtn: 'EN',
      doc: '分数披萨店 · KidsLab',
      themeToDark: '切换到深色主题',
      themeToLight: '切换到浅色主题',
      introKicker: '今日数学菜单',
      introTitle: '把分数烤成看得见的美味',
      introLede: '调一调切法和吃掉的份数，让披萨、小数、百分数一起变。',
      chefQuote: '“先切好，再慢慢尝。”',
      chefSignature: '披萨师傅的小提示',
      ticketKicker: 'ORDER · 01',
      ticketTitle: '你的披萨订单',
      ticketPrompt: '设置已经吃掉几块，以及披萨一共切成几块。',
      numerator: '分子 · 已经吃掉几块',
      denominator: '分母 · 一共切成几块',
      decimal: '小数',
      percentage: '百分数',
      randomize: '随机来一份',
      pizzaKicker: 'FRESH FROM THE OVEN',
      pizzaTitle: '披萨图',
      pizzaHint: '点一块披萨，标记为已经吃掉',
      eatenLegend: '已吃掉',
      leftLegend: '还剩下',
      sideKicker: 'TASTE TEST',
      sideTitle: '换个角度看看',
      barTitle: '巧克力条',
      barHint: '浅色碎屑格已经吃掉，深色巧克力还剩下。',
      lineTitle: '数轴上的位置',
      lineHint: '同一个分数，也能在 0 和 1 之间找到家。',
      cap: (n, d) => `一共切成 ${d} 块，已经吃掉 ${n} 块，还剩 ${d - n} 块`,
      slice: (i, d, eaten) => `第 ${i} 块，共 ${d} 块；${eaten ? '已经吃掉，盘上只剩碎屑' : '还没吃，是完整披萨'}。按 Enter 可以切换。`,
      simplest: (f) => `✔ ${f} 已经是最简分数啦`,
      simplify: (f, s, g) => `✂ 约分：${f} 的分子和分母同时 ÷${g}，得到 ${s}`,
      equiv: (list) => `✦ 等值分数：${list.join(' = ')}`,
      zero: '🍽 一块都还没吃，分数是 0',
      full: '✦ 整个披萨都吃完了，正好是 1！',
    },
    en: {
      back: 'Back to platform',
      title: 'Fraction Pizzeria',
      brandKicker: 'KIDSLAB · MATH KITCHEN',
      langBtn: '中',
      doc: 'Fraction Pizzeria · KidsLab',
      themeToDark: 'Switch to dark theme',
      themeToLight: 'Switch to light theme',
      introKicker: "TODAY'S MATH MENU",
      introTitle: 'Bake fractions you can really see',
      introLede: 'Change the cuts and the slices eaten. Pizza, decimals, and percentages move together.',
      chefQuote: '"Slice first. Savor slowly."',
      chefSignature: 'A note from the pizzaiolo',
      ticketKicker: 'ORDER · 01',
      ticketTitle: 'Your pizza order',
      ticketPrompt: 'Choose how many slices have already been eaten, and how many slices make the whole pizza.',
      numerator: 'Numerator · slices already eaten',
      denominator: 'Denominator · total slices',
      decimal: 'Decimal',
      percentage: 'Percent',
      randomize: 'Surprise me',
      pizzaKicker: 'FRESH FROM THE OVEN',
      pizzaTitle: 'Pizza chart',
      pizzaHint: 'Tap a slice to mark it as eaten',
      eatenLegend: 'Eaten',
      leftLegend: 'Left to eat',
      sideKicker: 'TASTE TEST',
      sideTitle: 'See it another way',
      barTitle: 'Chocolate bar',
      barHint: 'The pale crumb squares are eaten; the dark chocolate is left.',
      lineTitle: 'On the number line',
      lineHint: 'The same fraction lives somewhere between 0 and 1.',
      cap: (n, d) => `${n} of ${d} slices have been eaten; ${d - n} are left`,
      slice: (i, d, eaten) => `Slice ${i} of ${d}; ${eaten ? 'eaten, with only crumbs left' : 'not eaten, still a whole slice'}. Press Enter to toggle.`,
      simplest: (f) => `✔ ${f} is already in simplest form`,
      simplify: (f, s, g) => `✂ Simplify: divide top and bottom of ${f} by ${g} → ${s}`,
      equiv: (list) => `✦ Equivalent fractions: ${list.join(' = ')}`,
      zero: '🍽 No slice eaten yet — the fraction is 0',
      full: '✦ The whole pizza is gone — exactly 1!',
    },
  };

  const LS = { lang: 'kidslab.lang', theme: 'kidslab.theme' };
  const $ = (selector) => document.querySelector(selector);
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const readStore = (key) => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const writeStore = (key, value) => {
    try { localStorage.setItem(key, value); } catch {}
  };

  let lang = readStore(LS.lang) || 'zh';
  if (!I18N[lang]) lang = 'zh';
  let num = 3;
  let den = 8;

  function svgEl(name, attrs = {}) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', name);
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    return el;
  }

  function slicePath(a0, a1, r = 92) {
    const x0 = Math.cos(a0) * r;
    const y0 = Math.sin(a0) * r;
    const x1 = Math.cos(a1) * r;
    const y1 = Math.sin(a1) * r;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M0,0 L${x0},${y0} A${r},${r} 0 ${large} 1 ${x1},${y1} Z`;
  }

  function addPizzaDefs(svg) {
    const defs = svgEl('defs');
    const sauce = svgEl('radialGradient', { id: 'pizza-sauce', cx: '34%', cy: '24%', r: '76%' });
    sauce.append(
      svgEl('stop', { offset: '0%', class: 'sauce-stop sauce-stop--light' }),
      svgEl('stop', { offset: '78%', class: 'sauce-stop sauce-stop--mid' }),
      svgEl('stop', { offset: '100%', class: 'sauce-stop sauce-stop--deep' }),
    );
    const cheese = svgEl('radialGradient', { id: 'pizza-cheese', cx: '32%', cy: '24%', r: '77%' });
    cheese.append(
      svgEl('stop', { offset: '0%', class: 'cheese-stop cheese-stop--light' }),
      svgEl('stop', { offset: '68%', class: 'cheese-stop cheese-stop--mid' }),
      svgEl('stop', { offset: '100%', class: 'cheese-stop cheese-stop--deep' }),
    );
    const crust = svgEl('linearGradient', { id: 'pizza-crust', x1: '0%', y1: '0%', x2: '0%', y2: '100%' });
    crust.append(
      svgEl('stop', { offset: '0%', class: 'crust-stop crust-stop--light' }),
      svgEl('stop', { offset: '55%', class: 'crust-stop crust-stop--mid' }),
      svgEl('stop', { offset: '100%', class: 'crust-stop crust-stop--deep' }),
    );
    defs.append(sauce, cheese, crust);
    svg.appendChild(defs);
  }

  function changeFromSlice(index) {
    num = index + 1 === num ? index : index + 1;
    update({ animate: true });
  }

  function drawPizza() {
    const svg = $('#pizza');
    const t = I18N[lang];
    svg.innerHTML = '';
    addPizzaDefs(svg);
    svg.append(
      svgEl('ellipse', { class: 'pizza-shadow', cx: '0', cy: '10', rx: '91', ry: '82' }),
      svgEl('circle', { class: 'pizza-base', r: '92' }),
    );

    for (let i = 0; i < den; i += 1) {
      const a0 = (i / den) * Math.PI * 2 - Math.PI / 2;
      const a1 = ((i + 1) / den) * Math.PI * 2 - Math.PI / 2;
      const eaten = i < num;
      const slice = den === 1
        ? svgEl('circle', { r: '92' })
        : svgEl('path', { d: slicePath(a0, a1) });
      slice.setAttribute('class', `slice ${eaten ? 'eaten' : 'left'}`);
      slice.style.setProperty('--slice-index', i);
      slice.setAttribute('tabindex', '0');
      slice.setAttribute('role', 'button');
      slice.setAttribute('aria-label', t.slice(i + 1, den, eaten));
      slice.addEventListener('click', () => changeFromSlice(i));
      slice.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          changeFromSlice(i);
        }
      });
      svg.appendChild(slice);

      const mid = (a0 + a1) / 2;
      const radius = den === 1 ? 40 : Math.min(57, 38 + den * 2);
      if (eaten) {
        [-0.17, 0.12].forEach((offset, crumbIndex) => {
          const crumbRadius = Math.max(27, radius - 20 + crumbIndex * 9);
          svg.appendChild(svgEl('circle', {
            class: 'crumb',
            cx: (Math.cos(mid + offset) * crumbRadius).toFixed(1),
            cy: (Math.sin(mid + offset) * crumbRadius).toFixed(1),
            r: crumbIndex === 0 ? 3.3 : 2.3,
          }));
        });
      } else {
        svg.appendChild(svgEl('circle', {
          class: 'pepper pepper--left',
          cx: (Math.cos(mid) * radius).toFixed(1),
          cy: (Math.sin(mid) * radius).toFixed(1),
          r: Math.max(4, 11.6 - den * 0.42),
        }));
      }

      if (!eaten && i % 2 === 0 && den < 11) {
        const basilRadius = Math.max(28, radius - 23);
        const basil = svgEl('ellipse', {
          class: 'basil',
          cx: (Math.cos(mid + 0.15) * basilRadius).toFixed(1),
          cy: (Math.sin(mid + 0.15) * basilRadius).toFixed(1),
          rx: Math.max(2.5, 5.5 - den * 0.18),
          ry: Math.max(4, 8 - den * 0.24),
          transform: `rotate(${(mid * 180) / Math.PI + 45} ${(Math.cos(mid + 0.15) * basilRadius).toFixed(1)} ${(Math.sin(mid + 0.15) * basilRadius).toFixed(1)})`,
        });
        svg.appendChild(basil);
      }
    }

    svg.append(
      svgEl('circle', { class: 'crust-ring', r: '92' }),
      svgEl('circle', { class: 'crust-highlight', r: '87' }),
    );
  }

  function drawBar() {
    const chart = $('#barChart');
    chart.innerHTML = '';
    for (let i = 0; i < den; i += 1) {
      const piece = document.createElement('span');
      piece.setAttribute('aria-hidden', 'true');
      if (i < num) piece.className = 'on';
      chart.appendChild(piece);
    }
  }

  function facts() {
    const t = I18N[lang];
    const fraction = `${num}/${den}`;
    if (num === 0) {
      $('#simpleFact').textContent = t.zero;
    } else if (num === den) {
      $('#simpleFact').textContent = t.full;
    } else {
      const divisor = gcd(num, den);
      $('#simpleFact').textContent = divisor === 1
        ? t.simplest(fraction)
        : t.simplify(fraction, `${num / divisor}/${den / divisor}`, divisor);
    }
    const equivalents = [1, 2, 3].map((factor) => `${num * factor}/${den * factor}`);
    $('#equivFact').textContent = num === 0 ? '' : t.equiv(equivalents);
  }

  function animatePizza() {
    const pizza = $('#pizza');
    pizza.classList.remove('is-changing');
    void pizza.offsetWidth;
    pizza.classList.add('is-changing');
  }

  function update({ animate = false } = {}) {
    num = Math.max(0, Math.min(num, den));
    const t = I18N[lang];
    const value = num / den;
    $('#numShow').textContent = num;
    $('#numOut').textContent = num;
    $('#denShow').textContent = den;
    $('#denOut').textContent = den;
    $('#decShow').textContent = (+value.toFixed(4)).toString();
    $('#pctShow').textContent = `${+(value * 100).toFixed(2)}%`;
    $('#pizzaCap').textContent = t.cap(num, den);
    $('#barCount').textContent = `${num} / ${den}`;
    $('#lineFill').style.width = `${value * 100}%`;
    const marker = $('#lineMarker');
    marker.style.left = `${value * 100}%`;
    marker.classList.toggle('is-start', value === 0);
    marker.classList.toggle('is-end', value === 1);
    $('#lineLabel').textContent = `${num}/${den}`;
    drawPizza();
    drawBar();
    facts();
    if (animate) animatePizza();
  }

  function currentTheme() {
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  }

  function applyTheme() {
    const t = I18N[lang];
    const dark = currentTheme() === 'dark';
    $('#themeBtn').textContent = dark ? '☀️' : '🌙';
    $('#themeBtn').setAttribute('aria-label', dark ? t.themeToLight : t.themeToDark);
  }

  function applyLang() {
    const t = I18N[lang];
    document.querySelectorAll('[data-t]').forEach((node) => {
      node.textContent = t[node.dataset.t];
    });
    $('#langBtn').textContent = t.langBtn;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = t.doc;
    applyTheme();
  }

  document.querySelectorAll('[data-step]').forEach((button) => {
    button.addEventListener('click', () => {
      const delta = Number(button.dataset.d);
      if (button.dataset.step === 'num') {
        num = Math.max(0, Math.min(den, num + delta));
      } else {
        den = Math.max(1, Math.min(12, den + delta));
        num = Math.min(num, den);
      }
      update({ animate: true });
    });
  });

  $('#diceBtn').addEventListener('click', () => {
    den = 2 + Math.floor(Math.random() * 11);
    num = 1 + Math.floor(Math.random() * den);
    update({ animate: true });
  });

  $('#langBtn').addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    writeStore(LS.lang, lang);
    applyLang();
    update();
  });

  $('#themeBtn').addEventListener('click', () => {
    document.documentElement.dataset.theme = currentTheme() === 'dark' ? 'light' : 'dark';
    writeStore(LS.theme, currentTheme());
    applyTheme();
  });

  applyLang();
  update();
})();
