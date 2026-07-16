/**
 * KidsLab analytics ingest worker
 *
 * 接收课件埋点 beacon（POST text/plain JSON），逐条写入 Workers Analytics Engine。
 * 数据点 schema 与查询手册见仓库 docs/analytics.md。
 *
 * 部署：npx wrangler deploy   （详见本目录 README.md）
 */

const MAX_EVENTS = 100;        // 单请求最多事件数（AE 每次调用上限 250）
const MAX_BODY = 64 * 1024;    // 请求体上限

const str = (v, max) => (typeof v === 'string' ? v.slice(0, max) : '');
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

function respond(body, status, request, env) {
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  const origin = request.headers.get('origin') || '';
  const headers = {
    'access-control-allow-origin': allowed.length ? (allowed.includes(origin) ? origin : allowed[0]) : '*',
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
  };
  if (allowed.length) headers.vary = 'origin';
  return new Response(body, { status, headers });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return respond(null, 204, request, env);
    if (request.method !== 'POST') return respond('kidslab analytics: ok', 200, request, env);

    // 可选来源白名单（wrangler.toml ALLOWED_ORIGINS，逗号分隔；留空则不校验）
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
    const origin = request.headers.get('origin') || '';
    if (allowed.length && !allowed.includes(origin)) return respond('forbidden', 403, request, env);

    const text = await request.text();
    if (text.length > MAX_BODY) return respond('too large', 413, request, env);

    let batch;
    try { batch = JSON.parse(text); } catch { return respond('bad json', 400, request, env); }

    const course = str(batch?.c, 64);
    const events = Array.isArray(batch?.e) ? batch.e.slice(0, MAX_EVENTS) : [];
    if (!course || !events.length) return respond('bad payload', 400, request, env);

    const session = str(batch?.s, 32);
    const device = str(batch?.d, 32);
    const lang = str(batch?.l, 8);
    const pointer = str(batch?.p, 8);
    const country = str(request.cf?.country, 8);   // 国家级粗粒度，不落 IP

    for (const ev of events) {
      const name = str(ev?.n, 64);
      if (!name) continue;
      env.EVENTS.writeDataPoint({
        indexes: [course],
        blobs: [name, course, session, device, str(ev?.g, 64), lang, pointer, country],
        doubles: [
          num(ev?.t),           // double1 距进入课件毫秒数
          num(ev?.k) || 1,      // double2 合并重复计数
          num(ev?.streak),      // double3 连续同动作次数
          num(ev?.val),         // double4 自定义数值
          num(ev?.visits),      // double5 该设备第几次玩
          num(ev?.first),       // double6 是否首次（1/0）
          num(ev?.a),           // double7 累计活跃秒数
          num(ev?.taps),        // double8 区间 pointerdown 数
        ],
      });
    }
    return respond(null, 204, request, env);
  },
};
