# KidsLab 计划状态清单

最后核验：2026-07-20

事实来源：`src/*/course.json`、`docs/courseware-plan/*.md`、`README.md`、`AGENT.md`。本文件负责回答“哪些已完成、哪些未实现、后续 Agent 完成计划后要更新哪里”。

## 项目概述

KidsLab 是纯静态 K12 互动课件平台。主站从 `courseware/index.json` 读取课件清单，提供学段、年级、分类、搜索、双语、主题和强调色过滤；每个课件在 `src/<id>/` 下独立开发，再由 `npm run build` 生成 `courseware/<id>/`。

```text
src/<id>/course.json + html/css/js
          |
          v
scripts/build.mjs 校验、压缩、生成 manifest
          |
          v
courseware/<id>/ + courseware/index.json
          |
          v
index.html + assets/js/app.js 静态展示
```

## 项目画像（目标状态）

KidsLab 应该是一组孩子打开就想玩的交互课件，而不是题库或文档站。每个课件都要把知识点做进玩法机制里，30 秒内能上手，并在移动端、桌面端、深浅主题和中英双语下保持可用。

当“快速上新”和“儿童可玩质量”冲突时，优先保证知识正确、交互不卡死、文字可读和核心玩法闭环；宁可少做一个功能，也不要上线一个会教错或无法完成的课件。

## 当前能力清单

- 主站课程浏览：`index.html`、`assets/js/app.js` 支持学段、年级、分类、搜索、双语、主题、强调色与置顶课件。
- 静态构建发布：`scripts/build.mjs` 校验 `course.json`、压缩资源、生成 `courseware/index.json`；GitHub Pages workflow 在 `main` 推送后构建发布。
- 课件源码库：当前 `src/` 下有 45 个课件目录，其中小学规划内按 ID 直接完成 39 个。
- 小学课件规划：`docs/courseware-plan/` 覆盖数学、编程、逻辑、科学 84 个小学目标课件。
- 课件模板：`docs/courseware-template/` 提供双语、主题、静态独立课件起点。
- 行为分析：`docs/analytics.md`、`scripts/track.js`、`cloudflare/analytics/` 提供可选埋点链路。

## 非目标（铁律）

- 不把 KidsLab 改成需要后端登录、数据库或服务端渲染的系统。
- 不让课件依赖其他课件目录、主站运行时或 CDN；课件必须能作为独立静态目录工作。
- 不手工修改 `courseware/` 作为源码；任何课件变更都应先改 `src/`，再运行构建生成产物。
- 不用“已经写了代码”替代完成判定；只有源码、构建产物、构建校验和本清单同步完成，才可勾选。
- 不因为实现了相似主题就自动勾选规划项；如果 `id` 或目标玩法不一致，先放入“待对齐”。

## 状态维护规约

状态含义：

- `[x]` 已完成：`src/<id>/course.json` 存在且通过构建校验，`courseware/<id>/` 已重新生成，必要时 README 内置课件列表已同步。
- `[ ]` 未实现：规划中有该 `id`，但 `src/<id>/course.json` 不存在。
- `待对齐`：已有可运行课件，但它不在当前小学规划 ID 中，或可能对应某个规划项但命名/目标不一致。

Agent 每次完成计划项后必须同步更新：

1. 勾选本文件对应条目，并更新“汇总”计数。
2. 如新增或下线课程，同步更新 `README.md` 的内置课件列表。
3. 如规划 ID、玩法或优先级发生变化，同步更新对应 `docs/courseware-plan/<subject>.md`。
4. 运行 `npm run build`，将 `src/` 与重新生成的 `courseware/` 一起提交。
5. 如果完成项没有自动化或人工验收证据，在“验收矩阵”里保持 `缺口`，不要把它写成已验证。

## 汇总

小学规划口径：数学 31 个规划项 + 1 个既有课件，编程 14 个规划项 + 1 个既有课件，逻辑 13 个规划项 + 2 个既有课件，科学 21 个规划项 + 1 个既有课件，共 84 个目标课件。

| 学科 | 目标数 | 已完成（按规划 ID） | 未实现 | 备注 |
| --- | ---: | ---: | ---: | --- |
| 数学 | 32 | 15 | 17 | P0 已完成 |
| 编程 | 15 | 7 | 8 | P0 已完成 |
| 逻辑 | 15 | 7 | 8 | P0 已完成；`magic-cube` 为规划外补充 |
| 科学 | 22 | 11 | 11 | `plant-lab` 可能对应 `plant-xray`，但 ID/标题未对齐 |
| 合计 | 84 | 40 | 44 | 另有 6 个规划外已上线课件 |

## 已完成（规划内）

### 数学

- [x] 分数披萨店 `fraction-lab`
- [x] 数字萤火虫 `number-fireflies`
- [x] 百数地铁 `hundred-metro`
- [x] 时钟小镇 `clock-town`
- [x] 进位工厂 `carry-factory`
- [x] 立体影子剧场 `shadow-theater`
- [x] 果园订单 `orchard-orders`
- [x] 搭配衣橱 `combo-closet`
- [x] 方块摄影棚 `voxel-studio`
- [x] 仓鼠围栏 `hamster-fence`
- [x] 数字宇宙 `zoom-ten`
- [x] 体积水族馆 `volume-aquarium`
- [x] 滚轮乐园 `rolling-park`
- [x] 冰淇淋几何 `icecream-geometry`
- [x] 格子大厦 `grid-tower`

### 编程

- [x] 海龟画室 `turtle-studio`
- [x] 机器人早餐 `robot-breakfast`
- [x] 循环乐队 `loop-band`
- [x] 如果动物园 `iffy-zoo`
- [x] 排序运动会 `sort-olympics`
- [x] 虫虫医院 `bug-hospital`
- [x] 巫师的罐子 `wizard-jars`

### 逻辑

- [x] 汉诺塔挑战 `hanoi-tower`
- [x] 数独动物园 `sudoku-zoo`
- [x] 规律毛毛虫 `pattern-caterpillar`
- [x] 维恩太空港 `venn-port`
- [x] 侦探线索板 `detective-board`
- [x] 狐狸的石子 `fox-stones`
- [x] 七巧板皮影戏 `tangram-theater`

### 科学

- [x] 神秘盒子 `mystery-box`
- [x] 变形旅馆 `metamorph-hotel`
- [x] 太阳系漫游 `solar-explorer`
- [x] 磁力冰球 `magnet-hockey`
- [x] 云朵工厂 `cloud-factory`
- [x] 分子迪斯科 `molecule-disco`
- [x] 消化道漂流记 `body-rafting`
- [x] 月相狼历 `wolf-calendar`
- [x] 电工鼠小镇 `electric-mouse`
- [x] 地球调度员 `earth-dj`
- [x] 星海水手 `star-sailor`

## 未实现（规划内）

### 数学

- [ ] 找零售货机 `change-vending`
- [ ] 角度高尔夫 `angle-golf`
- [ ] 墨迹怪物 `inkblot-monsters`
- [ ] 分数节拍屋 `fraction-beats`
- [ ] 煎饼老板 `pancake-boss`
- [ ] 数据演播室 `data-studio`
- [ ] 三角形实验室 `triangle-lab`
- [ ] 外星农场 `alien-farm`
- [ ] 平衡马戏团 `balance-circus`
- [ ] 因数水晶洞 `crystal-cave`
- [ ] 魔药比例坊 `potion-ratio`
- [ ] 上下世界 `updown-world`
- [ ] 折扣侦探 `sale-detective`
- [ ] 无人机邮局 `drone-post`
- [ ] 游园会真相 `carnival-truth`
- [ ] 灯笼街 `lantern-lane`
- [ ] 图形裁缝铺 `shape-tailor`

### 编程

- [ ] 惊喜鬼屋 `haunted-events`
- [ ] 函数厨房 `function-kitchen`
- [ ] 二进制灯塔 `binary-lighthouse`
- [ ] 像素邮局 `pixel-post`
- [ ] 扫地机器人研究所 `vacuum-lab`
- [ ] 密码社 `cipher-club`
- [ ] 机器宠物学校 `robo-pet-school`
- [ ] 数据包骑士 `packet-knights`

### 逻辑

- [ ] 摆渡奇遇 `ferry-tales`
- [ ] 真话岛 `truth-island`
- [ ] 折纸打孔妙妙屋 `punch-origami`
- [ ] 激光镜屋 `laser-mirrors`
- [ ] 七桥滑冰 `ice-bridges`
- [ ] 海盗验金室 `pirate-scales`
- [ ] 打赌派对 `bet-party`
- [ ] 四色王国 `four-color-kingdom`

### 科学

- [ ] 植物透视园 `plant-xray`
- [ ] 小小港湾 `tiny-harbor`
- [ ] 造兽工坊 `creature-workshop`
- [ ] 垃圾变形记 `trash-transform`
- [ ] 声波乐团 `wave-band`
- [ ] 彩虹舞台 `rainbow-stage`
- [ ] 地层挖掘队 `strata-dig`
- [ ] 荒岛净水师 `island-water`
- [ ] 空气车库 `air-garage`
- [ ] 生态小岛 `eco-island`
- [ ] 小小金字塔 `mini-pyramid`

## 已上线但不在小学规划 ID 内

这些课件已在 `src/` 存在，但不是当前小学规划清单的直接 ID。不要用它们自动勾掉规划内条目，除非同步修改规划 ID 或明确记录替代关系。

| 课件 | 分类 | 学段 | 处理建议 |
| --- | --- | --- | --- |
| `welcome` 欢迎来到KidsLab · 从一盏灯到宇宙 | featured | primary/junior/senior | 保持置顶，不计入小学学科规划 |
| `plant-lab` 植物生长实验室 | science | primary/junior | 核验是否替代 `plant-xray`；确认后统一 ID/规划文案 |
| `magic-cube` 魔方小达人 | logic | primary/junior/senior | 作为逻辑扩展课件，若纳入规划需补条目 |
| `function-grapher` 函数变形记 | math | junior/senior | 初高中扩展，不计入小学规划 |
| `pendulum-lab` 单摆实验室 | physics | junior/senior | 初高中物理扩展 |
| `ph-lab` 酸碱魔法水 | chemistry | junior/senior | 初高中化学扩展 |

## 方向与意图

- 优先从未实现清单中选择 P1 或知识覆盖缺口明显的课件，保持数学、编程、逻辑、科学轮流上新。
- 对 `plant-lab` 与 `plant-xray` 做一次命名和目标对齐，避免科学清单长期出现“已做但未勾”的歧义。
- 为主站过滤、课件核心交互和构建发布补充可重复验收证据；当前主要依赖 `npm run build` 与人工走查。
- 初高中扩展课件应单独建立规划清单，不要混入小学 84 项状态。

## 完成的样子

一个规划课件只有同时满足这些可观察结果，才算完成：

- `src/<id>/` 下有独立的 `course.json`、入口 HTML 和必要资源，且 `course.json.id` 与目录名一致。
- 课件能完成核心玩法闭环，不只是静态展示或半成品交互。
- zh/en 双语、深浅主题、移动端触屏、桌面端布局都按 `AGENT.md` 的质量规约检查过。
- `npm run build` 通过，`courseware/<id>/` 和 `courseware/index.json` 已更新。
- 本文件已从未实现移动到已完成，汇总计数同步更新。
- README 内置课件列表、学科规划文档、验收矩阵在需要时同步更新。

## 验收矩阵（业务能力覆盖矩阵）

覆盖底线（硬性规定）：

1. 每个一级功能至少有一条 Happy Path E2E。
2. 每个高风险功能至少覆盖一条失败路径。
3. 每个涉及权限的功能至少验证两种角色。
4. 每个会修改系统状态的操作至少验证一次失败后的恢复或回滚。
5. 每次新增一级业务功能，必须同步新增对应的 E2E 并更新本矩阵。

当前 smoke 层已覆盖主站搜索/分类筛选与全部清单课件的加载验收（`tests/e2e/smoke.spec.js`），新增一级业务功能时应继续补齐对应 E2E；无法补齐时必须在本矩阵和提交说明中明确保留缺口，缺口不得被解释为“已验证”。

| 一级功能 | 风险级别 | Happy Path E2E | 失败路径 | 权限角色覆盖 | 失败恢复/回滚 | 证据（测试路径/用例） |
| --- | --- | --- | --- | --- | --- | --- |
| 主站浏览与筛选 | 中 | 缺口 | 缺口 | 不适用：纯静态无角色 | 不适用：只读 UI | `assets/js/app.js`；需补 E2E 覆盖学段/年级/分类/搜索 |
| 课件构建与 manifest 生成 | 中 | 部分：`npm run build` | 部分：`scripts/build.mjs` 校验非法 `course.json` | 不适用：本地构建无角色 | 部分：构建失败不应写入错误 manifest，需补回归验证 | `scripts/build.mjs`、`.github/workflows/deploy.yml` |
| PWA 壳与课件离线缓存 | 高 | 已覆盖：manifest 合法性 + SW 激活预缓存 + cache-on-visit 角标 | 已覆盖：杀死服务器后离线回放已玩课件与主站壳 | 不适用：纯静态无角色 | 已覆盖：断网时 SW 缓存兜底，联网 network-first 自动恢复最新内容 | `tests/e2e/pwa.spec.js` |
| 单个课件核心玩法 | 中 | 部分：搭配衣橱、格子大厦、巫师的罐子、变形旅馆与七巧板皮影戏完整闭环 | 部分：五课件均覆盖错误选择、重复搭配或错误放置后原地重试 | 不适用：纯静态无角色 | 部分：五课件支持重开与错误恢复，其余课件需逐项确认 | `tests/e2e/combo-closet.spec.js`、`tests/e2e/grid-tower.spec.js`、`tests/e2e/wizard-jars.spec.js`、`tests/e2e/metamorph-hotel.spec.js`、`tests/e2e/tangram-theater.spec.js`；`AGENT.md` 提交前自检；其余课件需补 E2E 或交互烟测 |
| 双语、主题、移动端适配 | 中 | 缺口 | 缺口 | 不适用：纯静态无角色 | 不适用：偏好写入 localStorage，无远端状态 | `AGENT.md` 质量规约；需补 1280x800 与 375x667 验收证据 |
| 行为分析埋点 | 中 | 缺口 | 缺口 | 不适用：无用户身份 | 缺口：endpoint 缺失时应空操作 | `docs/analytics.md`、`scripts/track.js`、`cloudflare/analytics/` |
| GitHub Pages 发布 | 中 | 部分：workflow 运行 `npm run build` | 缺口 | 不适用：GitHub Actions 权限由仓库配置控制 | 缺口：发布失败回滚依赖 Pages 历史版本 | `.github/workflows/deploy.yml` |
