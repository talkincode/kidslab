import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  validateFactsCoverage,
  validateFactsDocument,
} from '../../scripts/facts.mjs';

const validDocument = `# sample-course 知识断言

## 适用范围

- 仅覆盖 0 到 1 的分数。

## 知识断言

- [F1] 一个整体平均分成 2 份，取 1 份表示 1/2。[S1]

## 来源

- [S1] 教育部：《义务教育数学课程标准（2022年版）》。
`;

test('a complete knowledge assertion document passes validation', () => {
  assert.deepEqual(validateFactsDocument('sample-course', validDocument), []);
});

test('the course template starts with a valid knowledge assertion document', async () => {
  const document = await readFile(
    new URL('../../docs/courseware-template/facts.md', import.meta.url),
    'utf8',
  );

  assert.deepEqual(validateFactsDocument('my-course', document), []);
});

test('every knowledge assertion must cite a declared source', () => {
  const document = validDocument.replace('[S1]\n\n## 来源', '[S2]\n\n## 来源');

  assert.match(validateFactsDocument('sample-course', document).join('\n'), /未定义来源 S2/);
});

test('every course must be documented or explicitly registered as legacy debt', () => {
  const errors = validateFactsCoverage(
    ['documented', 'legacy', 'new-course'],
    new Set(['documented']),
    new Set(['legacy']),
  );

  assert.match(errors.join('\n'), /new-course.*缺少 facts\.md/);
});

test('legacy debt cannot retain documented or unknown courses', () => {
  const errors = validateFactsCoverage(
    ['documented'],
    new Set(['documented']),
    new Set(['documented', 'removed-course']),
  );

  assert.match(errors.join('\n'), /documented.*已有 facts\.md/);
  assert.match(errors.join('\n'), /removed-course.*不存在/);
});
