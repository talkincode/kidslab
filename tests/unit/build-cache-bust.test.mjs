import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const COURSEWARE = path.join(ROOT, 'courseware');
const fingerprint = (content) => createHash('md5').update(content).digest('hex').slice(0, 8);

async function localAssetVersion(owner, specifier, version) {
  if (!specifier.startsWith('.') && path.isAbsolute(specifier)) return;
  const file = path.resolve(path.dirname(owner), specifier);
  try {
    if (!(await stat(file)).isFile()) return;
  } catch {
    return;
  }
  assert.ok(version, `${path.relative(ROOT, owner)} → ${specifier} 缺少内容指纹`);
  assert.equal(version, fingerprint(await readFile(file)), `${specifier} 的内容指纹已过期`);
}

test('构建产物中的本地 CSS/JS 引用都带当前内容指纹', async () => {
  const courses = (await readdir(COURSEWARE, { withFileTypes: true })).filter((entry) => entry.isDirectory());
  for (const course of courses) {
    const index = path.join(COURSEWARE, course.name, 'index.html');
    const html = await readFile(index, 'utf8');
    for (const match of html.matchAll(/(?:href|src)="([^"?#:]+\.(?:css|js|mjs))(?:\?v=([0-9a-f]+))?"/gi)) {
      await localAssetVersion(index, match[1], match[2]);
    }
  }
});

test('构建产物中的本地 ES module 依赖都带当前内容指纹', async () => {
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(file);
        continue;
      }
      if (!/\.(?:js|mjs)$/i.test(entry.name)) continue;
      const code = await readFile(file, 'utf8');
      const pattern = /(?:\bfrom\s*|\bimport\s*\()\s*['"]([^'"?:]+\.(?:js|mjs))(?:\?v=([0-9a-f]+))?['"]/gi;
      for (const match of code.matchAll(pattern)) await localAssetVersion(file, match[1], match[2]);
    }
  }
  await visit(COURSEWARE);
});
