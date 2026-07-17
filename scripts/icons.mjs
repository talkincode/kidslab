#!/usr/bin/env node
/**
 * PWA 图标生成 — 用 Playwright chromium 把 assets/logo.svg 渲染为 PNG。
 * 一次性工具：logo 变更后运行 `npm run icons` 重新生成并提交 assets/icons/。
 * CI 不运行此脚本；产物直接入库。
 *
 * 产物：
 *   icon-192.png / icon-512.png       — manifest 常规图标（logo 铺满）
 *   icon-maskable-512.png             — maskable：logo 缩至安全区，深色底
 *   apple-touch-icon.png (180×180)    — iOS 主屏图标
 */
import { chromium } from '@playwright/test';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets', 'icons');
/* maskable 底色取 logo 自身的深色渐变端，保证出血区不违和 */
const MASKABLE_BG = '#1c1833';

function page(svg, size, { pad = 0, bg = 'transparent' } = {}) {
  const inner = size - pad * 2;
  return `<!doctype html><html><head><style>
    * { margin: 0; padding: 0; }
    body { width: ${size}px; height: ${size}px; background: ${bg};
           display: flex; align-items: center; justify-content: center; }
    svg { width: ${inner}px; height: ${inner}px; display: block; }
  </style></head><body>${svg}</body></html>`;
}

async function shoot(browser, html, size, file) {
  const ctx = await browser.newContext({
    viewport: { width: size, height: size },
    deviceScaleFactor: 1,
  });
  const p = await ctx.newPage();
  await p.setContent(html, { waitUntil: 'networkidle' });
  await p.screenshot({ path: path.join(OUT, file), omitBackground: true });
  await ctx.close();
  console.log(`\x1b[32m✓\x1b[0m assets/icons/${file} (${size}×${size})`);
}

const svg = await readFile(path.join(ROOT, 'assets', 'logo.svg'), 'utf8');
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
try {
  await shoot(browser, page(svg, 192), 192, 'icon-192.png');
  await shoot(browser, page(svg, 512), 512, 'icon-512.png');
  /* maskable 安全区：中心 80% 圆；logo 留 ~11% 边距即可完整落入 */
  await shoot(browser, page(svg, 512, { pad: 56, bg: MASKABLE_BG }), 512, 'icon-maskable-512.png');
  await shoot(browser, page(svg, 180, { pad: 10, bg: MASKABLE_BG }), 180, 'apple-touch-icon.png');
} finally {
  await browser.close();
}
