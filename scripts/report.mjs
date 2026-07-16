#!/usr/bin/env node
/**
 * KidsLab 行为分析报表 —— 查询 Cloudflare Analytics Engine 并打印终端报表
 *
 *   npm run report            # 最近 7 天
 *   npm run report -- 30      # 最近 30 天
 *
 * 凭据：env CLOUDFLARE_API_TOKEN（需 Account Analytics: Read），
 * 未设置时回退读 macOS 钥匙串条目 CLOUDFLARE_KIDSLAB_TOKEN。
 * 事件字典与列映射见 docs/analytics.md。
 */
import { execFileSync } from 'node:child_process';

const ACCOUNT = process.env.CLOUDFLARE_ACCOUNT_ID || '83b40c9065a6f4631f4ab6cda824a21a';
const DAYS = Math.max(1, parseInt(process.argv[2], 10) || 7);

function token() {
  if (process.env.CLOUDFLARE_API_TOKEN) return process.env.CLOUDFLARE_API_TOKEN;
  try {
    return execFileSync('security', ['find-generic-password', '-s', 'CLOUDFLARE_KIDSLAB_TOKEN', '-w'],
      { encoding: 'utf8' }).trim();
  } catch {
    console.error('✗ 未找到凭据：请设置 CLOUDFLARE_API_TOKEN，或在钥匙串保存 CLOUDFLARE_KIDSLAB_TOKEN');
    process.exit(1);
  }
}
const TOKEN = token();

async function sql(query) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/analytics_engine/sql`, {
    method: 'POST',
    headers: { authorization: `Bearer ${TOKEN}` },
    body: `${query} FORMAT JSON`,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`SQL API ${res.status}: ${text.slice(0, 200)}`);
  return JSON.parse(text).data || [];
}

function table(title, rows, note) {
  console.log(`\n\x1b[1m▌ ${title}\x1b[0m${note ? `\x1b[2m  —— ${note}\x1b[0m` : ''}`);
  if (!rows.length) { console.log('  (暂无数据)'); return; }
  const cols = Object.keys(rows[0]);
  const width = cols.map((c) => Math.max(c.length, ...rows.map((r) => String(r[c] ?? '').length)));
  const line = (vals) => '  ' + vals.map((v, i) => String(v ?? '').padEnd(width[i] + 2)).join('');
  console.log('\x1b[2m' + line(cols) + '\x1b[0m');
  rows.forEach((r) => console.log(line(cols.map((c) => r[c]))));
}

const W = `timestamp > NOW() - INTERVAL '${DAYS}' DAY`;
const num = (v) => Math.round(Number(v) * 10) / 10;

console.log(`\x1b[1mKidsLab · 交互行为报表（最近 ${DAYS} 天）\x1b[0m`);

table('复玩率 —— 哪些课件孩子回来玩第二次', (await sql(`
  SELECT blob2 AS courseware,
         COUNT(DISTINCT blob4) AS devices,
         SUM(_sample_interval) AS opens,
         SUM(IF(double5 >= 2, _sample_interval, 0)) AS repeat_opens
  FROM kidslab_events WHERE blob1 = 'enter' AND ${W}
  GROUP BY courseware ORDER BY repeat_opens DESC, opens DESC LIMIT 15`)
).map((r) => ({ ...r, 复玩比: r.opens > 0 ? `${num(100 * r.repeat_opens / r.opens)}%` : '-' })));

table('沉浸度 —— 每会话活跃时长', await sql(`
  SELECT blob2 AS courseware, COUNT() AS sessions,
         ROUND(AVG(m), 1) AS avg_min, ROUND(MAX(m), 1) AS max_min,
         SUM(IF(m >= 10, 1, 0)) AS over_10min
  FROM (SELECT blob2, blob3, MAX(double7) / 60 AS m FROM kidslab_events WHERE ${W} GROUP BY blob2, blob3)
  GROUP BY courseware ORDER BY avg_min DESC LIMIT 15`),
  '按会话取峰值活跃分钟数；over_10min = 玩了 10 分钟还没走的会话数');

table('退出点 —— 孩子在哪一步离开', await sql(`
  SELECT blob2 AS courseware, IF(blob5 = '', '(未标注阶段)', blob5) AS stage,
         SUM(_sample_interval) AS leaves
  FROM kidslab_events WHERE blob1 = 'leave' AND ${W}
  GROUP BY courseware, stage ORDER BY leaves DESC LIMIT 15`));

table('探索路径 —— 各阶段到达情况', await sql(`
  SELECT blob2 AS courseware, blob5 AS stage,
         COUNT(DISTINCT blob3) AS sessions_reached,
         ROUND(AVG(double1) / 1000) AS avg_sec_to_reach
  FROM kidslab_events WHERE blob1 = 'stage' AND ${W}
  GROUP BY courseware, stage ORDER BY courseware, avg_sec_to_reach LIMIT 30`),
  '需要课件调用 cool.stage()');

table('循环行为 —— 被重复玩最多的动作 ⭐', await sql(`
  SELECT blob2 AS courseware, substring(blob1, 5) AS action,
         MAX(double3) AS longest_streak,
         SUM(double2 * _sample_interval) AS total_times,
         COUNT(DISTINCT blob3) AS sessions
  FROM kidslab_events WHERE blob1 LIKE 'act:%' AND ${W}
  GROUP BY courseware, action ORDER BY longest_streak DESC LIMIT 20`),
  'longest_streak ≥ 50 ⇒ 这个动作本身就好玩，考虑做成正式玩法');

table('触屏 vs 鼠标', await sql(`
  SELECT blob7 AS pointer, COUNT(DISTINCT blob3) AS sessions,
         ROUND(AVG(double7) / 60, 1) AS avg_active_min
  FROM kidslab_events WHERE blob1 = 'leave' AND ${W}
  GROUP BY pointer ORDER BY sessions DESC`));

console.log('\n\x1b[2m更多查询与列映射：docs/analytics.md\x1b[0m');
