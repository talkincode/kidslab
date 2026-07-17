const REQUIRED_SECTIONS = ['适用范围', '知识断言', '来源'];

function collectSections(document) {
  const sections = new Map();
  let current = null;
  for (const line of document.split(/\r?\n/)) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      current = heading[1];
      if (!sections.has(current)) sections.set(current, []);
    } else if (current) {
      sections.get(current).push(line);
    }
  }
  return sections;
}

function collectEntries(lines, prefix, errors) {
  const entries = new Map();
  const entryPattern = new RegExp(`^- \\[${prefix}(\\d+)\\]\\s+(.+)$`);
  for (const line of lines) {
    if (!line.trim()) continue;
    const match = line.match(entryPattern);
    if (!match) {
      errors.push(`"${line}" 必须使用 - [${prefix}编号] 内容 格式`);
      continue;
    }
    const id = `${prefix}${match[1]}`;
    if (entries.has(id)) errors.push(`${id} 重复`);
    entries.set(id, match[2]);
  }
  return entries;
}

export function validateFactsDocument(id, document) {
  const errors = [];
  if (!document.startsWith(`# ${id} 知识断言\n`)) {
    errors.push(`标题必须是 "# ${id} 知识断言"`);
  }

  const sections = collectSections(document);
  for (const section of REQUIRED_SECTIONS) {
    if (!sections.has(section)) errors.push(`缺少 "## ${section}"`);
  }
  if (errors.length) return errors;

  const scope = sections.get('适用范围').filter((line) => line.trim());
  if (!scope.length || scope.some((line) => !line.startsWith('- '))) {
    errors.push('适用范围至少需要一条 "- " 列表项');
  }

  const facts = collectEntries(sections.get('知识断言'), 'F', errors);
  const sources = collectEntries(sections.get('来源'), 'S', errors);
  if (!facts.size) errors.push('至少需要一条知识断言');
  if (!sources.size) errors.push('至少需要一个来源');

  for (const [factId, fact] of facts) {
    const references = [...fact.matchAll(/\[S(\d+)\]/g)].map((match) => `S${match[1]}`);
    if (!references.length) {
      errors.push(`${factId} 未引用来源`);
      continue;
    }
    for (const sourceId of references) {
      if (!sources.has(sourceId)) errors.push(`${factId} 引用了未定义来源 ${sourceId}`);
    }
  }

  return errors;
}

export function validateFactsCoverage(courseIds, documentedIds, legacyIds) {
  const errors = [];
  const courses = new Set(courseIds);

  for (const id of courses) {
    if (!documentedIds.has(id) && !legacyIds.has(id)) {
      errors.push(`${id}: 缺少 facts.md，且未登记为存量知识断言债务`);
    }
  }
  for (const id of legacyIds) {
    if (!courses.has(id)) errors.push(`${id}: 存量知识断言债务登记的课件不存在`);
    else if (documentedIds.has(id)) errors.push(`${id}: 已有 facts.md，必须从存量债务登记中移除`);
  }

  return errors;
}
