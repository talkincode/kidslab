# 交互行为分析（Analytics）

回答一个问题：**哪个交互本身好玩**——哪些课件孩子主动回来玩第二次、玩十几分钟不腻、在哪一步退出、有没有把一个动作重复玩 50 次的"循环行为"。

原则：**语义事件 + 计数，不是录屏**。不采热力图/鼠标轨迹（25/34 课件是 canvas，坐标毫无意义），不采任何个人信息，尊重 DNT/GPC 与本地退出开关（`localStorage: kidslab.track = 'off'`）。

## 架构

```
课件页面 ──sendBeacon(text/plain JSON)──▶ Cloudflare Worker ──writeDataPoint──▶ Analytics Engine
   ▲                                        cloudflare/analytics/                （SQL API 查询）
   └── scripts/track.js 构建时内联注入（scripts/build.mjs）
```

- **埋点脚本** `scripts/track.js`：约 2KB，构建时压缩内联进每个课件的 `index.html`。endpoint 优先取 env `KIDSLAB_ANALYTICS_ENDPOINT`（Pages 构建会读同名仓库变量），否则取 `package.json` 的 `kidslab.analyticsEndpoint`，**均未配置则完全不注入**，构建产物与从前一致。
- **接收端** `cloudflare/analytics/`：约 60 行 Worker，push main 时由 `.github/workflows/deploy-analytics.yml` 自动部署（需一次性配置 `CLOUDFLARE_API_TOKEN` secret），也可本地 wrangler 部署，见其 [README](../cloudflare/analytics/README.md)。免费档 10 万写/天、SQL 1 万查/天、留存 3 个月。

## 事件字典

自动事件（课件零改动即有）：

| 事件 | 触发 | 携带 |
|---|---|---|
| `enter` | 进入课件 | 该设备第几次玩（`visits`）、是否首次（`first`） |
| `beat` | 可见状态每 30s（60 分钟封顶） | 累计活跃秒数、区间点击数 |
| `leave` | 切后台/关页（`sendBeacon` 保送达） | 累计活跃秒数、当前阶段 → **退出点** |

课件可选 API（埋点由构建注入，**务必用可选链调用**，未注入时自然空操作）：

```js
window.cool?.stage('level2');            // 阶段切换 → 哪一步退出/哪一步开始探索
window.cool?.track('flip');              // 语义动作 → 重复次数/循环行为
window.cool?.track('score', {value: 3}); // 可带数值；{stage: 'x'} 可覆盖当前阶段
```

给动作起名的口诀：**给"孩子做了什么"起名，不给"点了哪个按钮"起名**（`flip`、`drop-block`、`mix-color`，而不是 `btn3-click`）。每个课件挑 5~10 个核心动作即可。

防刷设计：同名动作连发在客户端合并成一行（`k`=次数，`streak`=最长连击），孩子连点 50 次 = 1 行 `k=50`；自定义事件每会话 ≤500 条。

## Analytics Engine 列映射

dataset：`kidslab_events`；`index1` = 课件 id（采样键）。

| 列 | 含义 | | 列 | 含义 |
|---|---|---|---|---|
| `blob1` | 事件名（`enter`/`beat`/`leave`/`stage`/`act:*`） | | `double1` | 距进入毫秒数 |
| `blob2` | 课件 id | | `double2` | 合并重复计数 k |
| `blob3` | 会话 id | | `double3` | 连续同动作 streak |
| `blob4` | 匿名设备 id | | `double4` | 自定义数值 value |
| `blob5` | 阶段 stage | | `double5` | 该设备第几次玩 |
| `blob6` | 语言 zh/en | | `double6` | 是否首次 1/0 |
| `blob7` | touch/mouse | | `double7` | 累计活跃秒数 |
| `blob8` | 国家（粗粒度） | | `double8` | 区间点击数 |

## 查询手册（SQL API）

最省事的方式——仓库自带终端报表（复玩率/沉浸度/退出点/探索路径/循环行为/触屏对比一次出全）：

```bash
npm run report            # 最近 7 天
npm run report -- 30      # 最近 30 天
```

凭据取 env `CLOUDFLARE_API_TOKEN`（需 `Account Analytics: Read`），未设置时回退读 macOS 钥匙串条目 `CLOUDFLARE_KIDSLAB_TOKEN`。

要自己写查询时，直接调 SQL API：

```bash
curl "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/analytics_engine/sql" \
  -H "Authorization: Bearer <API_TOKEN>" -d "<SQL>"
```

API Token 需要 `Account Analytics: Read` 权限。计数类聚合一律乘 `_sample_interval`（量小时恒为 1，量大触发采样后仍准确）。注意 AE 的 SQL 方言限制：`ORDER BY` 的列必须出现在 `SELECT` 中；子查询最多嵌套一层。

**① 哪些课件孩子主动回来玩第二次（复玩率）**

```sql
SELECT blob2 AS courseware,
       SUM(_sample_interval) AS opens,
       SUM(IF(double5 >= 2, _sample_interval, 0)) AS repeat_opens
FROM kidslab_events
WHERE blob1 = 'enter' AND timestamp > NOW() - INTERVAL '7' DAY
GROUP BY courseware ORDER BY repeat_opens DESC
```

**② 哪些课件玩了 10 分钟还不腻**

```sql
SELECT blob2 AS courseware, COUNT(DISTINCT blob3) AS sessions_over_10min
FROM kidslab_events
WHERE double7 >= 600 AND timestamp > NOW() - INTERVAL '7' DAY
GROUP BY courseware ORDER BY sessions_over_10min DESC
```

**③ 平均停留时长**

```sql
SELECT blob2 AS courseware, AVG(double7) AS avg_active_s, MAX(double7) AS max_active_s
FROM kidslab_events
WHERE blob1 = 'leave' AND timestamp > NOW() - INTERVAL '7' DAY
GROUP BY courseware ORDER BY avg_active_s DESC
```

（`leave` 在每次切后台都会发，均值略偏低；求精确值时按 `blob3` 取每会话 `MAX(double7)`。）

**④ 哪一步退出**

```sql
SELECT blob2 AS courseware, blob5 AS stage, SUM(_sample_interval) AS leaves
FROM kidslab_events
WHERE blob1 = 'leave' AND timestamp > NOW() - INTERVAL '7' DAY
GROUP BY courseware, stage ORDER BY leaves DESC
```

**⑤ 哪一步开始探索（各阶段到达率与到达耗时）**

```sql
SELECT blob2 AS courseware, blob5 AS stage,
       COUNT(DISTINCT blob3) AS sessions_reached,
       AVG(double1) / 1000 AS avg_seconds_to_reach
FROM kidslab_events
WHERE blob1 = 'stage' AND timestamp > NOW() - INTERVAL '7' DAY
GROUP BY courseware, stage ORDER BY courseware, avg_seconds_to_reach
```

**⑥ 循环行为——被孩子重复玩最多的动作**

```sql
SELECT blob2 AS courseware, blob1 AS action,
       MAX(double3) AS longest_streak,
       SUM(double2 * _sample_interval) AS total_times
FROM kidslab_events
WHERE blob1 LIKE 'act:%' AND timestamp > NOW() - INTERVAL '7' DAY
GROUP BY courseware, action ORDER BY longest_streak DESC LIMIT 20
```

`longest_streak >= 50` 的动作就是你要找的"这个动作本身就很好玩"——考虑把它做成一个正式玩法。

**⑦ 触屏 vs 鼠标的活跃度差异（拖拽体验回归）**

```sql
SELECT blob2 AS courseware, blob7 AS pointer, AVG(double7) AS avg_active_s
FROM kidslab_events
WHERE blob1 = 'leave' AND timestamp > NOW() - INTERVAL '7' DAY
GROUP BY courseware, pointer
```

## 隐私边界（面向儿童，从严）

- 设备 id 是浏览器本地生成的随机串，无法关联真实身份；不采 IP（Worker 只落国家码）、不采 UA、不采坐标、不录屏。
- 尊重 `DNT: 1` 与 Global Privacy Control；家长/学校可设 `localStorage.setItem('kidslab.track', 'off')` 一键退出。
- 数据仅 3 个月留存，用于课件迭代，不用于画像。
