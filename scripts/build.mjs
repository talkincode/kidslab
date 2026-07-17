#!/usr/bin/env node
/**
 * KidsLab build — 编译 src/ 下的课件到 courseware/ 并生成清单
 *
 *   src/<id>/{course.json,index.html,*.css,*.js,...}
 *     └─ minify ─▶ courseware/<id>/...  +  courseware/index.json
 *
 * 埋点注入：配置了 analytics endpoint 时（env KIDSLAB_ANALYTICS_ENDPOINT
 * 或 package.json 的 kidslab.analyticsEndpoint），把 scripts/track.js 压缩后
 * 内联进每个课件的 index.html（详见 docs/analytics.md）；未配置则跳过。
 */
import { transform } from 'esbuild';
import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateFactsCoverage, validateFactsDocument } from './facts.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'courseware');

const CATEGORIES = ['featured', 'math', 'physics', 'chemistry', 'programming', 'science', 'logic'];
const LEVELS = ['primary', 'junior', 'senior'];
const GRADE_RE = /^g([1-9]|1[0-2])$/;

const fail = (msg) => { console.error(`\x1b[31m✗ ${msg}\x1b[0m`); process.exitCode = 1; };
const ok = (msg) => console.log(`\x1b[32m✓\x1b[0m ${msg}`);

async function loadTaxonomy() {
  const { tags } = JSON.parse(await readFile(path.join(SRC, 'taxonomy.json'), 'utf8'));
  const seen = new Map();
  for (const [canonical, def] of Object.entries(tags)) {
    for (const a of [canonical, ...(def.aliases || [])]) {
      const key = a.toLowerCase();
      if (seen.has(key) && seen.get(key) !== canonical)
        fail(`taxonomy: 别名 "${a}" 同时属于 "${seen.get(key)}" 和 "${canonical}"`);
      seen.set(key, canonical);
    }
  }
  return tags;
}

async function validateKnowledgeAssertions(courses) {
  const documented = new Set();
  for (const { id } of courses) {
    try {
      const document = await readFile(path.join(SRC, id, 'facts.md'), 'utf8');
      documented.add(id);
      for (const error of validateFactsDocument(id, document)) {
        fail(`src/${id}/facts.md: ${error}`);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }

  const legacyEntries = JSON.parse(
    await readFile(path.join(ROOT, 'scripts', 'facts-legacy.json'), 'utf8'),
  );
  if (!Array.isArray(legacyEntries) || legacyEntries.some((id) => typeof id !== 'string' || !id)) {
    throw new TypeError('scripts/facts-legacy.json 必须是非空课件 id 的数组');
  }
  const legacy = new Set(legacyEntries);
  if (legacy.size !== legacyEntries.length) fail('scripts/facts-legacy.json 存在重复课件 id');
  for (const error of validateFactsCoverage(
    courses.map(({ id }) => id),
    documented,
    legacy,
  )) {
    fail(`knowledge assertions: ${error}`);
  }
  if (!process.exitCode) ok(`知识断言 ${documented.size} 个已审计，${legacy.size} 个存量待补`);
}

function validate(id, meta, taxonomy) {
  const errs = [];
  const isPair = (v) => v && typeof v.zh === 'string' && v.zh && typeof v.en === 'string' && v.en;
  if (meta.id !== id) errs.push(`id "${meta.id}" 与目录名 "${id}" 不一致`);
  if (!isPair(meta.title)) errs.push('title 需要 {zh, en}');
  if (!isPair(meta.description)) errs.push('description 需要 {zh, en}');
  if (!CATEGORIES.includes(meta.category)) errs.push(`category 必须是 ${CATEGORIES.join('|')}`);
  if (!Array.isArray(meta.levels) || !meta.levels.length || meta.levels.some((l) => !LEVELS.includes(l)))
    errs.push(`levels 必须是 ${LEVELS.join('|')} 的非空子集`);
  if (!Array.isArray(meta.tags)) errs.push('tags 必须是数组');
  else meta.tags.forEach((t) => { if (!taxonomy[t]) errs.push(`标签 "${t}" 不在 src/taxonomy.json 词表中`); });
  if (meta.grades !== undefined && (!Array.isArray(meta.grades) || meta.grades.some((g) => !GRADE_RE.test(g))))
    errs.push('grades 必须是 g1–g12 的数组');
  if (typeof meta.icon !== 'string' || !meta.icon) errs.push('icon 必填 (emoji)');
  return errs;
}

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

async function loadSdk() {
  const src = await readFile(path.join(ROOT, 'scripts', 'sdk', 'core.js'), 'utf8');
  const { code } = await transform(src, { loader: 'js', minify: true, charset: 'utf8' });
  return code;
}

async function loadTracker() {
  const endpoint = process.env.KIDSLAB_ANALYTICS_ENDPOINT ||
    JSON.parse(await readFile(path.join(ROOT, 'package.json'), 'utf8')).kidslab?.analyticsEndpoint || '';
  if (!endpoint) return '';
  const src = await readFile(path.join(ROOT, 'scripts', 'track.js'), 'utf8');
  const { code } = await transform(src, { loader: 'js', minify: true, charset: 'utf8' });
  return code.replaceAll('__ANALYTICS_ENDPOINT__', () => endpoint);
}

/* 注入到每个课件页 <head>：favicon + 「返回星图」悬浮按钮（仅从星图进入时显示） */
const FAVICON_TAG = '<link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg">';
const SDK_SOURCE_TAG_RE = /<script\b(?=[^>]*\bdata-kidslab-sdk\b)[^>]*><\/script>\s*/gi;
const STARMAP_BACK_TAG = `<script>(function(){try{var s=JSON.parse(sessionStorage.getItem('kidslab.starmap')||'null');if(!s||!s.open)return;var zh=(document.documentElement.lang||'zh').indexOf('zh')===0;var a=document.createElement('a');a.href='../../index.html#starmap';a.className='kidslab-starmap-back';a.title=zh?'\\u8fd4\\u56de\\u661f\\u56fe':'Back to Star Map';a.setAttribute('aria-label',a.title);a.textContent='\\u2726';a.style.cssText='position:fixed;right:14px;bottom:14px;z-index:2147483000;width:42px;height:42px;display:flex;align-items:center;justify-content:center;font-size:20px;line-height:1;border-radius:50%;color:#7ce7ff;background:rgba(16,18,48,.82);border:1px solid rgba(124,231,255,.45);box-shadow:0 4px 14px rgba(0,0,0,.35);text-decoration:none;backdrop-filter:blur(6px)';function add(){document.body.appendChild(a)}if(document.body)add();else document.addEventListener('DOMContentLoaded',add)}catch(e){}})()</script>`;

function injectHead(html, tags) {
  const block = tags.join('\n');
  if (html.includes('</head>')) return html.replace('</head>', () => `${block}\n</head>`);
  if (html.includes('</body>')) return html.replace('</body>', () => `${block}\n</body>`);
  return html + block;
}

async function buildCourse(id, sdk, tracker) {
  const srcDir = path.join(SRC, id);
  const outDir = path.join(OUT, id);
  let saved = 0, total = 0;
  for await (const file of walk(srcDir)) {
    const rel = path.relative(srcDir, file);
    if (rel === '.DS_Store' || rel.endsWith('.DS_Store')) continue;
    if (rel === 'facts.md') continue;
    const dest = path.join(outDir, rel);
    await mkdir(path.dirname(dest), { recursive: true });
    const ext = path.extname(file);
    const minifiable = (ext === '.js' || ext === '.mjs' || ext === '.css') && !file.endsWith('.min.js') && !file.endsWith('.min.css');
    if (rel === 'index.html') {
      const html = (await readFile(file, 'utf8')).replace(SDK_SOURCE_TAG_RE, '');
      if (html.includes('data-kidslab-sdk')) throw new Error(`src/${id}: SDK 源码标签未能内联替换`);
      const tags = [];
      if (!/<link[^>]+rel=["'][^"']*icon/i.test(html)) tags.push(FAVICON_TAG);
      tags.push(`<script>${sdk.replaceAll('__COURSE_ID__', () => id)}</script>`);
      tags.push(STARMAP_BACK_TAG);
      if (tracker) tags.push(`<script>${tracker.replaceAll('__COURSE_ID__', () => id)}</script>`);
      const out = injectHead(html, tags);
      await writeFile(dest, out);
      total += Buffer.byteLength(out);
    } else if (minifiable) {
      const code = await readFile(file, 'utf8');
      const { code: min } = await transform(code, {
        loader: ext === '.css' ? 'css' : 'js',
        minify: true,
        charset: 'utf8',
      });
      await writeFile(dest, min);
      saved += code.length - min.length;
      total += min.length;
    } else {
      await cp(file, dest);
      total += (await stat(file)).size;
    }
  }
  return { total, saved };
}

async function main() {
  const taxonomy = await loadTaxonomy();
  const dirs = (await readdir(SRC, { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  const courses = [];
  const seen = new Set();
  for (const id of dirs) {
    let meta;
    try {
      meta = JSON.parse(await readFile(path.join(SRC, id, 'course.json'), 'utf8'));
    } catch {
      console.log(`\x1b[33m∅ src/${id}: 无 course.json，跳过\x1b[0m`);
      continue;
    }
    const errs = validate(id, meta, taxonomy);
    if (seen.has(meta.id)) errs.push(`id "${meta.id}" 重复`);
    if (errs.length) { errs.forEach((e) => fail(`src/${id}: ${e}`)); continue; }
    seen.add(meta.id);
    courses.push(meta);
  }
  await validateKnowledgeAssertions(courses);
  if (process.exitCode) throw new Error('构建前校验未通过');
  if (courses.filter((c) => c.pinned).length > 1) throw new Error('pinned 课件只能有一个');

  courses.sort((a, b) =>
    (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) ||
    (a.order ?? 999) - (b.order ?? 999) ||
    a.id.localeCompare(b.id));

  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const [sdk, tracker] = await Promise.all([loadSdk(), loadTracker()]);
  ok(`platform SDK 已启用（${(sdk.length / 1024).toFixed(1)} KB 内联注入）`);
  console.log(tracker
    ? `\x1b[32m✓\x1b[0m analytics 埋点已启用（${(tracker.length / 1024).toFixed(1)} KB 内联注入）`
    : '\x1b[33m∅ analytics 未配置 endpoint，跳过埋点注入\x1b[0m');

  for (const c of courses) {
    const { total, saved } = await buildCourse(c.id, sdk, tracker);
    ok(`courseware/${c.id}  ${(total / 1024).toFixed(1)} KB（压缩节省 ${(saved / 1024).toFixed(1)} KB）`);
  }

  const usedTags = [...new Set(courses.flatMap((c) => c.tags))].sort();
  const manifest = {
    generatedAt: new Date().toISOString(),
    /* 使用中的受控标签元数据（英文名 + 类型），供界面与星图使用 */
    tags: Object.fromEntries(usedTags.map((t) => [t, { en: taxonomy[t].en, kind: taxonomy[t].kind }])),
    courses: courses.map((c) => ({
      ...c,
      /* 词表别名展开为搜索关键词，让 "fraction"、"等值分数" 等仍可搜到 */
      keywords: [...new Set(c.tags.flatMap((t) => [taxonomy[t].en, ...(taxonomy[t].aliases || [])]))],
      path: `courseware/${c.id}/index.html`,
    })),
  };
  await writeFile(path.join(OUT, 'index.json'), JSON.stringify(manifest, null, 2) + '\n');
  ok(`courseware/index.json  共 ${courses.length} 个课件`);

  const assetVersions = await bustAssets();
  await emitServiceWorker(assetVersions);
}

/**
 * Cache-busting：按内容 hash 重写根 index.html 的资源引用（?v=xxxxxxxx）。
 * CDN/浏览器可能缓存旧 CSS/JS 数小时，改版后 HTML 与资源版本撕裂会导致布局错乱；
 * 内容指纹保证引用变则必然拉新文件。幂等：重复构建产出一致。
 */
async function bustAssets() {
  const page = path.join(ROOT, 'index.html');
  let html = await readFile(page, 'utf8');
  const before = html;
  const versions = {};
  for (const asset of ['assets/css/app.css', 'assets/js/app.js', 'assets/js/starmap.js']) {
    const v = createHash('md5').update(await readFile(path.join(ROOT, asset))).digest('hex').slice(0, 8);
    versions[asset] = v;
    html = html.replaceAll(new RegExp(`${asset.replaceAll('/', '\\/')}(\\?v=[0-9a-f]+)?`, 'g'), () => `${asset}?v=${v}`);
    if (!html.includes(`${asset}?v=${v}`)) fail(`index.html 未找到对 ${asset} 的引用，cache-busting 失效`);
  }
  if (html !== before) await writeFile(page, html);
  ok('index.html 资源引用已注入内容指纹（cache-busting）');
  return versions;
}

/**
 * 生成根目录 sw.js（入库构建产物）：以 scripts/sw.js 为模板，注入
 * 预缓存清单与版本号（预缓存内容整体 hash）。幂等：内容不变则产物一致。
 * courseware/index.json 参与预缓存但不参与版本计算——它在运行时走
 * network-first 持续刷新，若纳入版本会因 generatedAt 时间戳导致每次构建
 * 都产生无意义的缓存换代。
 */
async function emitServiceWorker(assetVersions) {
  const shellFiles = [
    'index.html',
    'assets/fonts/baloo2-latin.woff2',
    'assets/logo.svg',
    'assets/favicon.svg',
    'manifest.webmanifest',
    'assets/icons/icon-192.png',
    'assets/icons/icon-512.png',
    'assets/icons/icon-maskable-512.png',
    'assets/icons/apple-touch-icon.png',
  ];
  const precache = [
    './',
    ...Object.entries(assetVersions).map(([asset, v]) => `${asset}?v=${v}`),
    ...shellFiles.slice(1),
    'courseware/index.json',
  ];

  const hash = createHash('md5');
  hash.update(precache.join('\n'));
  for (const rel of [...shellFiles, ...Object.keys(assetVersions)]) {
    const file = path.join(ROOT, rel);
    try {
      hash.update(await readFile(file));
    } catch {
      throw new Error(`sw.js 预缓存文件缺失: ${rel}`);
    }
  }
  await stat(path.join(OUT, 'index.json')); // 预缓存引用，仅校验存在
  const version = hash.digest('hex').slice(0, 12);

  const template = await readFile(path.join(ROOT, 'scripts', 'sw.js'), 'utf8');
  const source = template
    .replaceAll('__CACHE_VERSION__', () => version)
    .replaceAll('__PRECACHE__', () => JSON.stringify(precache));
  const { code } = await transform(source, {
    loader: 'js',
    minify: true,
    charset: 'utf8',
    banner: `/* KidsLab SW ${version} — 构建产物，源码见 scripts/sw.js，勿手改 */`,
  });
  await writeFile(path.join(ROOT, 'sw.js'), code + '\n');
  ok(`sw.js 已生成（版本 ${version}，预缓存 ${precache.length} 项）`);
}

main().catch((e) => { fail(e.message); process.exit(1); });
