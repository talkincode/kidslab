# KidsLab 计划状态清单

最后核验：2026-08-25

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
- 课件源码库：当前 `src/` 下有 92 个课件目录，其中小学规划内按 ID 直接完成 79 个。
- 小学课件规划：`docs/courseware-plan/` 覆盖数学、编程、逻辑、科学 84 个小学目标课件。
- 课件模板：`docs/courseware-template/` 提供双语、主题、静态独立课件起点。
- 交互音效：当前游戏课件含语义交互音效与静音控制（含新建 `cpu-lab`）；`huarong-dao` 与 `venn-port` 使用 ScoreKit 循环配乐和通关短曲；存量改进优先级见 `docs/courseware-audio-audit.md`。
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
| 数学 | 32 | 32 | 0 | P0 已完成；规划项已全部完成 |
| 编程 | 15 | 15 | 0 | P0 已完成；规划项已全部完成 |
| 逻辑 | 15 | 15 | 0 | P0 已完成；规划项已全部完成；`magic-cube`、`huarong-dao` 为规划外补充 |
| 科学 | 22 | 17 | 5 | `plant-lab` 可能对应 `plant-xray`，但 ID/标题未对齐 |
| 合计 | 84 | 79 | 5 | 另有 11 个规划外已上线课件 |

初高中采用独立规划口径，详见 [`secondary-labs.md`](./secondary-labs.md)：共 26 个目标课件，6 个存量课件纳入统一实验合同并待复核，20 个为新增规划，不计入上方小学汇总。

小学数学另有探究深度口径，详见 [`primary-math-inquiry.md`](./primary-math-inquiry.md)：定义 A/B/C/D 四类探究模型与 M1–M4 分级，并记录 26 个 `g3-g6` 数学课件的实测等级基线（M1 二十个 / M2 六个 / M3 零个）。该文件只评判「孩子是否自己发现规律」，与上表的上线完成计数是两个正交维度，不改变上表数字。

| 初高中实验规划 | 目标数 | 源码已存在 | 新增待实现 | 备注 |
| --- | ---: | ---: | ---: | --- |
| 数学 | 4 | 2 | 2 | 函数、平方根、动态几何、抽样统计 |
| 物理 | 12 | 3 | 9 | `electric-mouse` 当前分类为 `science`，但纳入初中物理学习路径；`density-detective-lab` 已完成 |
| 化学 | 7 | 1 | 6 | `ph-lab` 需从观察型 L1 升级到测量型 L3 |
| 生物/科学 | 3 | 1 | 2 | 暂沿用 `science` 分类，不新增 `biology` |
| 合计 | 26 | 7 | 19 | 存量存在不等于已通过新实验合同复核 |

## 已完成（规划内）

### 数学

勾选表示课件已上线并通过构建校验。后缀 `M1`–`M4` 是探究深度实测等级，`A`/`B`/`C`/`D` 是探究类型，判据与改造批次见 [`primary-math-inquiry.md`](./primary-math-inquiry.md)。**上线完成与探究深度是两个正交维度：勾选不代表探究达标。** `g1-g2` 课件本轮未评级。

- [x] 分数披萨店 `fraction-lab` · M1 · D
- [x] 数字萤火虫 `number-fireflies`
- [x] 百数地铁 `hundred-metro`
- [x] 时钟小镇 `clock-town`
- [x] 进位工厂 `carry-factory` · M1 · D
- [x] 立体影子剧场 `shadow-theater`
- [x] 果园订单 `orchard-orders`
- [x] 搭配衣橱 `combo-closet` · M1 · B
- [x] 找零售货机 `change-vending`
- [x] 方块摄影棚 `voxel-studio` · M1 · B
- [x] 仓鼠围栏 `hamster-fence` · M1 · B
- [x] 数字宇宙 `zoom-ten` · M1 · D
- [x] 体积水族馆 `volume-aquarium` · M1 · A
- [x] 滚轮乐园 `rolling-park` · M2 · A
- [x] 冰淇淋几何 `icecream-geometry` · M1 · B
- [x] 格子大厦 `grid-tower` · M1 · B
- [x] 角度高尔夫 `angle-golf` · M1 · A
- [x] 墨迹怪物 `inkblot-monsters` · M2 · B
- [x] 分数节拍屋 `fraction-beats` · M2 · B
- [x] 煎饼老板 `pancake-boss` · M1 · D
- [x] 数据演播室 `data-studio` · M1 · C
- [x] 三角形实验室 `triangle-lab` · M1 · B
- [x] 外星农场 `alien-farm` · M1 · B
- [x] 平衡马戏团 `balance-circus` · M2 · D
- [x] 因数水晶洞 `crystal-cave` · M2 · B
- [x] 魔药比例坊 `potion-ratio` · M1 · B
- [x] 上下世界 `updown-world` · M1 · D
- [x] 折扣侦探 `sale-detective` · M1 · B
- [x] 无人机邮局 `drone-post` · M1 · D
- [x] 游园会真相 `carnival-truth` · M2 · C
- [x] 灯笼街 `lantern-lane` · M1 · B
- [x] 图形裁缝铺 `shape-tailor` · M1 · B

### 编程

- [x] 海龟画室 `turtle-studio`
- [x] 机器人早餐 `robot-breakfast`
- [x] 循环乐队 `loop-band`
- [x] 如果动物园 `iffy-zoo`
- [x] 排序运动会 `sort-olympics`
- [x] 虫虫医院 `bug-hospital`
- [x] 巫师的罐子 `wizard-jars`
- [x] 惊喜鬼屋 `haunted-events`
- [x] 函数厨房 `function-kitchen`
- [x] 二进制灯塔 `binary-lighthouse`
- [x] 像素邮局 `pixel-post`
- [x] 扫地机器人研究所 `vacuum-lab`
- [x] 密码社 `cipher-club`
- [x] 机器宠物学校 `robo-pet-school`
- [x] 数据包骑士 `packet-knights`

### 逻辑

- [x] 汉诺塔挑战 `hanoi-tower`
- [x] 数独动物园 `sudoku-zoo`
- [x] 规律毛毛虫 `pattern-caterpillar`
- [x] 维恩太空港 `venn-port`
- [x] 侦探线索板 `detective-board`
- [x] 狐狸的石子 `fox-stones`
- [x] 七巧板皮影戏 `tangram-theater`
- [x] 摆渡奇遇 `ferry-tales`
- [x] 真话岛 `truth-island`
- [x] 折纸打孔妙妙屋 `punch-origami`
- [x] 激光镜屋 `laser-mirrors`
- [x] 七桥滑冰 `ice-bridges`
- [x] 四色王国 `four-color-kingdom`
- [x] 海盗验金室 `pirate-scales`
- [x] 打赌派对 `bet-party`

### 科学

- [x] 神秘盒子 `mystery-box`
- [x] 变形旅馆 `metamorph-hotel`
- [x] 太阳系漫游 `solar-explorer`
- [x] 磁力冰球 `magnet-hockey`
- [x] 小小港湾 `tiny-harbor`
- [x] 云朵工厂 `cloud-factory`
- [x] 分子迪斯科 `molecule-disco`
- [x] 消化道漂流记 `body-rafting`
- [x] 月相狼历 `wolf-calendar`
- [x] 电工鼠实验室 `electric-mouse`
- [x] 地球调度员 `earth-dj`
- [x] 星海水手 `star-sailor`
- [x] 声波乐团 `wave-band`
- [x] 彩虹舞台 `rainbow-stage`
- [x] 垃圾变形记 `trash-transform`
- [x] 荒岛净水师 `island-water`
- [x] 地层挖掘队 `strata-dig`

### 初高中实验型

- [x] 密度侦探实验室 `density-detective-lab`（物理 · `g8`；天平、排水测体积、数据表、质量—体积图和材料识别构成 L3 实验闭环）

## 未实现（规划内）

### 数学

- 暂无

### 编程

- 暂无

### 逻辑

- 暂无

### 科学

- [ ] 植物透视园 `plant-xray`
- [ ] 造兽工坊 `creature-workshop`
- [ ] 空气车库 `air-garage`
- [ ] 生态小岛 `eco-island`
- [ ] 小小金字塔 `mini-pyramid`

## 已上线但不在小学规划 ID 内

这些课件已在 `src/` 存在，但不是当前小学规划清单的直接 ID。部分已纳入初高中独立规划；不要用它们自动勾掉小学规划内条目，除非同步修改规划 ID 或明确记录替代关系。

| 课件 | 分类 | 学段 | 处理建议 |
| --- | --- | --- | --- |
| `welcome` 欢迎来到KidsLab · 从一盏灯到宇宙 | featured | primary/junior/senior | 保持置顶，不计入小学学科规划 |
| `plant-lab` 植物生长实验室 | science | primary/junior | 核验是否替代 `plant-xray`；确认后统一 ID/规划文案 |
| `magic-cube` 魔方小达人 | logic | primary/junior/senior | 作为逻辑扩展课件，若纳入规划需补条目 |
| `pyramid-cube` 金属金字塔魔方 | logic | primary/junior/senior | 魔方小达人姊妹篇：三阶 Pyraminx，金属材质，三档难度，一步提示与还原演示 |
| `huarong-dao` 华容道 · 木关智局 | logic | primary/junior/senior | 作为空间规划与滑块算法扩展课件；含经典阵、十二步练习与求解演示 |
| `function-grapher` 函数变形记 | math | junior/senior | 已纳入初高中实验规划；补 `grades` 并按实验合同复核 |
| `square-root-lab` 平方根建筑师 | math | junior/senior | 已纳入初高中实验规划；按实验合同复核 |
| `pendulum-lab` 单摆实验室 | physics | junior/senior | 已纳入初高中实验规划；补 `grades` 与重复测量 |
| `optics-lab` 光学实验室 | physics | junior/senior | 已纳入初高中实验规划；补记录与归纳闭环 |
| `ph-lab` 酸碱魔法水 | chemistry | junior/senior | 已纳入初高中实验规划；从 L1 观察升级到 L3 测量 |
| `ice-maker-lab` 制冰实验室 | physics | primary/junior | 蒸汽压缩制冷/制冰机原理扩展，不计入小学 84 项规划 ID |
| `cpu-lab` 电脑原理实验室 | programming | primary/junior | 计算机组成/冯·诺依曼与取指-译码-执行扩展，不计入小学 84 项规划 ID |

## 方向与意图

- 优先从未实现清单中选择 P1 或知识覆盖缺口明显的课件，保持数学、编程、逻辑、科学轮流上新。
- 对 `plant-lab` 与 `plant-xray` 做一次命名和目标对齐，避免科学清单长期出现“已做但未勾”的歧义。
- 为主站过滤、课件核心交互和构建发布补充可重复验收证据；当前主要依赖 `npm run build` 与人工走查。
- 按 `docs/courseware-audio-audit.md` 的 P0 → P1 → P2 顺序补齐交互音效；先消除高频堆叠音源，再统一静音控制，最后分批覆盖无音频课件。
- 初高中扩展按 `secondary-labs.md` 独立维护，不混入小学 84 项状态；优先完成 P0，并同步扩充 taxonomy 与模型单测。

## 完成的样子

一个规划课件只有同时满足这些可观察结果，才算完成：

- `src/<id>/` 下有独立的 `course.json`、入口 HTML 和必要资源，且 `course.json.id` 与目录名一致。
- 课件能完成核心玩法闭环，不只是静态展示或半成品交互。
- zh/en 双语、深浅主题、移动端触屏、桌面端布局都按 `AGENT.md` 的质量规约检查过。
- 核心交互音效、成功/错误/通关反馈和静音控制已按 `AGENT.md` 检查；纯观察型玩法没有错误状态时不强造失败音。
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
| 电工鼠开放电路实验室 | 高 | 已覆盖：桌面与触屏完成端口接线、合闸点亮、实时电流读数和触屏放置 | 已覆盖：制造短路并显示故障 | 不适用：纯静态无角色 | 已覆盖：撤销短路恢复通路；保存后清空并加载恢复作品 | `tests/e2e/electric-mouse.spec.js`；`tests/unit/electric-lab.test.mjs` |
| 密度侦探实验室 | 高 | 已覆盖：桌面与触屏完成预测、三次天平/排水测量、数据入表、质量—体积图和铝材料识别 | 已覆盖：错误质量读数被拒绝后可原地改正 | 不适用：纯静态无角色 | 已覆盖：静音选择重载后保持；错误读数不写入数据表 | `tests/e2e/density-detective-lab.spec.js`；`tests/unit/density-lab.test.mjs` |
| 三角形实验室 | 中 | 已覆盖：桌面与触屏完成货架稳定性、内角和与三边关系三项实验，并验证拖动顶点后内角和仍为 180° | 已覆盖：无斜撑加载导致货架变形、三边关系误判后保留原题重试，以及两边和等于第三边时不能成三角形 | 不适用：纯静态无角色 | 已覆盖：错误状态可原地修正；实验进度、完成状态可重载恢复并支持重新开始 | `tests/e2e/triangle-lab.spec.js` |
| 外星农场 | 中 | 已覆盖：桌面与触屏完成固定总数试调、假设法一次替换和眼腿双传感器反推三夜任务 | 已覆盖：错误腿数与错误眼腿组合保留原题和当前数量，可原地继续调整 | 不适用：纯静态无角色 | 已覆盖：任务状态、假设步骤和最终完成状态可重载恢复，并支持重新开始 | `tests/e2e/alien-farm.spec.js` |
| 平衡马戏团 | 中 | 已覆盖：桌面与触屏用等式两边同时减常数、减未知数和除以同一非零整数完成三场方程表演 | 已覆盖：只动一边触发倾翻反馈且原方程不变；不可执行的成对操作保持状态 | 不适用：纯静态无角色 | 已覆盖：倾翻后可原地继续；合法步骤、最终完成状态可重载恢复并支持重新开始 | `tests/e2e/balance-circus.spec.js` |
| 因数水晶洞 | 中 | 已覆盖：桌面与触屏把 12、18 沿合法因数裂缝分解为质数原石，并用 3 号音叉找全倍数墙 | 已覆盖：错误乘积不改变当前水晶；错选或漏选倍数会标红且保留选择，可原地调整 | 不适用：纯静态无角色 | 已覆盖：错误后可继续；分解步骤、偏好、通关状态可重载恢复并支持重新勘探 | `tests/e2e/crystal-cave.spec.js` |
| 魔药比例坊 | 中 | 已覆盖：桌面与触屏完成 3:2 配制 15 勺药水、等比放大到 500 勺和按 2:3:5 分配 100 枚金币 | 已覆盖：错误比例、未达目标总量和错误分红均给出副作用反馈且不丢失题目 | 不适用：纯静态无角色 | 已覆盖：错误后可原地换单；关卡、偏好和通关状态可重载恢复，并支持重新开坊 | `tests/e2e/potion-ratio.spec.js` |
| 数据包骑士 | 中 | 已覆盖：桌面与触屏完成拆包分路、最短路线选择和断桥后仅改道未送达数据包三项任务 | 已覆盖：整信过宽、单路拥挤、非最短路线、拥塞路线与重复选择断桥均保留任务状态，可原地修正 | 不适用：纯静态无角色 | 已覆盖：错误后可继续；任务、路线、偏好和通关状态可重载恢复，并支持重新巡逻 | `tests/e2e/packet-knights.spec.js` |
| 上下世界 | 中 | 已覆盖：桌面与触屏驾驶升降艇从 −3 到 +5、比较 −2°C 与 −7°C，并计算 7 + (−12) = −5 | 已覆盖：停错位置、选错较暖温度和选错结账余额均保留当前任务，可原地修正 | 不适用：纯静态无角色 | 已覆盖：错误后可继续；航程、偏好和通关状态可重载恢复，并支持重新航行 | `tests/e2e/updown-world.spec.js` |
| 折扣侦探 | 中 | 已覆盖：桌面与触屏用算式证据完成提价后打折、第二件半价和满减对比三宗促销案件 | 已覆盖：错误算式、错误结论和报告缺项均保留当前案件选择，可原地修正 | 不适用：纯静态无角色 | 已覆盖：错误后可继续；案件选择、偏好和通关状态可重载恢复，并支持重新巡街 | `tests/e2e/sale-detective.spec.js` |
| 无人机邮局 | 中 | 已覆盖：桌面与触屏完成相对方位数对投递、抵消风偏、比例尺换算和六航点正交邮路设计 | 已覆盖：数对次序颠倒、直接发送风偏目标、未选/误选比例尺航线和斜穿楼群均保留任务，可原地修正 | 不适用：纯静态无角色 | 已覆盖：错误后可重置或直接调整；航班、坐标、航线、航点、偏好与通关状态可重载恢复，并支持重新值夜班 | `tests/e2e/drone-post.spec.js` |
| 游园会真相 | 中 | 已覆盖：桌面与触屏完成 1/12 转盘查假、2/10 摸球机验真和 2/12 低中奖率转盘设计 | 已覆盖：未试验提交、错误公平性判断、错误大奖格数量和使用过期试验数据均保留当前调查，可原地修正 | 不适用：纯静态无角色 | 已覆盖：错误后可继续；调查、试验结果、设计、偏好和通关状态可重载恢复，并支持重新巡查 | `tests/e2e/carnival-truth.spec.js` |
| 单个课件核心玩法 | 中 | 部分：搭配衣橱、找零售货机、格子大厦、巫师的罐子、惊喜鬼屋、变形旅馆、七巧板皮影戏、狐狸的石子、摆渡奇遇、真话岛、平方根建筑师、小小港湾、函数厨房、角度高尔夫、二进制灯塔、墨迹怪物、分数节拍屋、像素邮局、光学实验室、华容道、维恩太空港、声波乐团、扫地机器人研究所、折纸打孔妙妙屋、煎饼老板、激光镜屋、彩虹舞台、垃圾变形记、数据演播室、密码社、七桥滑冰、机器宠物学校、因数水晶洞、魔药比例坊与数据包骑士、灯笼街、图形裁缝铺、四色王国与海盗验金室完整闭环、打赌派对完整闭环、电脑原理实验室完整闭环、荒岛净水师完整闭环、地层挖掘队完整闭环 | 部分：前七课件覆盖错误选择、重复搭配、错误找零、错误接线或错误放置后原地重试；狐狸的石子覆盖轮流拿取与必胜闭环；摆渡奇遇覆盖危险搭档违规、自动回退、撤销和重开后的状态恢复；真话岛覆盖错误身份、错误逻辑联结词判断、无效提问与错误道路选择后的原地重试；平方根建筑师覆盖负数输入和错答恢复；小小港湾覆盖超载进水、泥球下沉和错误预测后的原地恢复；函数厨房覆盖错误步骤、复制爆单和参数传错后的原地恢复；角度高尔夫覆盖报角偏差、轨迹反馈和原地重试；二进制灯塔覆盖错误数字、错误解码、错误字母编码和原地修正；墨迹怪物覆盖墨团不足、错误镜像点、错误嫌疑怪和原地重试；分数节拍屋覆盖超出一小节、等值分数不足、错误节拍顺序、未试听交付及撤回/清空后的原地恢复；像素邮局覆盖漏涂/多涂像素、错误数字还原和错误 RLE 编码后的原地修正；光学实验室覆盖实像对焦与虚像无法投屏状态；华容道覆盖无效方向、逐步提示、撤销恢复、十二步练习通关与演示时间线；维恩太空港覆盖错误泊位安全返航、五船完整任务、演示暂停/单步/跳转及退出后的进度恢复；声波乐团覆盖未拨弦检查、错误音高、错误振幅、空气未抽净和真空后未复验的原地恢复；扫地机器人研究所覆盖空芯片启动、三种错误策略及原地换芯重试；折纸打孔妙妙屋覆盖空预测、错误镜像孔位、清空后重试及四关逐层展开；煎饼老板覆盖铁板空位、同饼双面冲突、未启动并行任务和错误跨小时计算后的原地恢复；激光镜屋覆盖空路线、错误镜位、镜子上限、彩色光路不匹配后的原地调整及四关通关；彩虹舞台覆盖空灯光、缺色光、错误颜料组合、未开白光和错误棱镜角度后的原地调整及三幕通关；垃圾变形记覆盖错投材料舱后原地重试、三班分拣通关与图鉴点亮；数据演播室覆盖错记选票、错误图表匹配、错误最大值/总数/平均数播报后的原地重试及三场通关；密码社覆盖错钥匙、错解码、错频率字母和错映射后的原地修正及三关通关；七桥滑冰覆盖未观察度数、错误可行性判断、非相邻滑行与无效双桥施工后的原地恢复，并完成判断、欧拉回路和改桥三关；机器宠物学校覆盖错误标签、窄样本误判、纠正样本重训和重开后的原地恢复，并完成训练、偏差纠正与未见物测试三课；因数水晶洞覆盖错误因数、错选/漏选倍数后的原地修正及三厅通关；魔药比例坊覆盖错误配方、错误批量和错误分红后的原地修正及三张配方通关；数据包骑士覆盖整信过宽、单路拥挤、非最短路线、拥塞路线和断桥重试后的原地改道，并完成拆包重组、最短路与断线容错三关；灯笼街覆盖少领/多领后的原地加减货及五关间隔通关；图形裁缝铺覆盖裁剪拼合后错误报价原地修正及三单通关；四色王国覆盖相邻同色冲突、超预算开桶、领主锁定色与四图通关；海盗验金室覆盖不等重称量、错误指认后原地重试及三分法结案；打赌派对覆盖最坏月份构造、错误稳赢数后原地重算及袜子必然演示；电脑原理实验室覆盖错误零件、取指-译码-执行动画与当 CPU 动作选择通关；荒岛净水师覆盖浑汤误喝、滤瓶缺层、蒸汽逃逸后原地重试及沉淀-过滤-蒸馏三营通关；地层挖掘队覆盖未露出就收取、陶罐硬砸、错骨位、错断层配对和浅层更老误判后原地重试及下挖-拼装-断层三营通关 | 不适用：纯静态无角色 | 部分：三十五课件支持重开、状态恢复或无损调参，其余课件需逐项确认 | `tests/e2e/combo-closet.spec.js`、`tests/e2e/change-vending.spec.js`、`tests/e2e/grid-tower.spec.js`、`tests/e2e/wizard-jars.spec.js`、`tests/e2e/haunted-events.spec.js`、`tests/e2e/metamorph-hotel.spec.js`、`tests/e2e/tangram-theater.spec.js`、`tests/e2e/fox-stones.spec.js`、`tests/e2e/ferry-tales.spec.js`、`tests/e2e/truth-island.spec.js`、`tests/e2e/square-root-lab.spec.js`、`tests/e2e/tiny-harbor.spec.js`、`tests/e2e/function-kitchen.spec.js`、`tests/e2e/angle-golf.spec.js`、`tests/e2e/binary-lighthouse.spec.js`、`tests/e2e/inkblot-monsters.spec.js`、`tests/e2e/fraction-beats.spec.js`、`tests/e2e/pixel-post.spec.js`、`tests/e2e/huarong-dao.spec.js`、`tests/e2e/venn-port.spec.js`、`tests/e2e/wave-band.spec.js`、`tests/e2e/vacuum-lab.spec.js`、`tests/e2e/punch-origami.spec.js`、`tests/e2e/pancake-boss.spec.js`、`tests/e2e/laser-mirrors.spec.js`、`tests/e2e/rainbow-stage.spec.js`、`tests/e2e/trash-transform.spec.js`、`tests/e2e/data-studio.spec.js`、`tests/e2e/cipher-club.spec.js`、`tests/e2e/ice-bridges.spec.js`、`tests/e2e/robo-pet-school.spec.js`、`tests/e2e/crystal-cave.spec.js`、`tests/e2e/potion-ratio.spec.js`、`tests/e2e/packet-knights.spec.js`、`tests/e2e/lantern-lane.spec.js`、`tests/e2e/shape-tailor.spec.js`、`tests/e2e/four-color-kingdom.spec.js`、`tests/e2e/pirate-scales.spec.js`、`tests/e2e/bet-party.spec.js`、`tests/e2e/cpu-lab.spec.js`、`tests/e2e/island-water.spec.js`、`tests/e2e/strata-dig.spec.js`、`tests/e2e/smoke.spec.js`（光学实验室）；`AGENT.md` 提交前自检；其余课件需补 E2E 或交互烟测 |
| 课件交互音效 | 中 | 缺口：静态扫描确认 66/80 个游戏存在音频实现，未验证全部存量课件的语义、响度和完整玩法覆盖 | 缺口：需验证错误/无效操作、AudioContext 失败和快速连续操作 | 不适用：纯静态无角色 | 缺口：需验证静音可关闭一次性与循环声音、页面隐藏后停止环境音 | `docs/courseware-audio-audit.md`；分数节拍屋、声波乐团、扫地机器人研究所、折纸打孔妙妙屋、煎饼老板、激光镜屋、彩虹舞台、垃圾变形记、数据演播室、密码社、七桥滑冰、机器宠物学校、外星农场、平衡马戏团、因数水晶洞、魔药比例坊、数据包骑士、无人机邮局、游园会真相、灯笼街、图形裁缝铺、四色王国、海盗验金室、打赌派对、电脑原理实验室、荒岛净水师与地层挖掘队覆盖交互/正确/错误/通关语义音效与静音状态，华容道与维恩太空港覆盖独立 BGM/音效开关及页面隐藏暂停；静态和 E2E 检查仍不能替代人工听测 |
| 双语、主题、移动端适配 | 中 | 部分：华容道、维恩太空港、分数节拍屋、声波乐团、扫地机器人研究所、折纸打孔妙妙屋、煎饼老板、激光镜屋、彩虹舞台、垃圾变形记、数据演播室、密码社、七桥滑冰、机器宠物学校、外星农场、平衡马戏团、因数水晶洞、魔药比例坊、数据包骑士、无人机邮局、游园会真相、灯笼街、图形裁缝铺、四色王国、海盗验金室、打赌派对、电脑原理实验室、荒岛净水师与地层挖掘队已覆盖中英切换、深浅主题和 1280×800/375×667 布局 | 部分：二十课件验证无横纵向溢出及可见按钮最小触控高度 | 不适用：纯静态无角色 | 部分：华容道与维恩太空港验证偏好写入 localStorage 并经重新加载恢复；分数节拍屋、声波乐团、扫地机器人研究所、折纸打孔妙妙屋、煎饼老板、激光镜屋、彩虹舞台、垃圾变形记、数据演播室、密码社、七桥滑冰、机器宠物学校、外星农场、平衡马戏团、因数水晶洞、魔药比例坊、数据包骑士、无人机邮局、游园会真相与灯笼街验证即时切换，无人机邮局等十七课件另验证进度重载恢复 | `tests/e2e/huarong-dao.spec.js`、`tests/e2e/venn-port.spec.js`、`tests/e2e/fraction-beats.spec.js`、`tests/e2e/wave-band.spec.js`、`tests/e2e/vacuum-lab.spec.js`、`tests/e2e/punch-origami.spec.js`、`tests/e2e/pancake-boss.spec.js`、`tests/e2e/laser-mirrors.spec.js`、`tests/e2e/rainbow-stage.spec.js`、`tests/e2e/trash-transform.spec.js`、`tests/e2e/data-studio.spec.js`、`tests/e2e/cipher-club.spec.js`、`tests/e2e/ice-bridges.spec.js`、`tests/e2e/robo-pet-school.spec.js`、`tests/e2e/alien-farm.spec.js`、`tests/e2e/balance-circus.spec.js`、`tests/e2e/crystal-cave.spec.js`、`tests/e2e/potion-ratio.spec.js`、`tests/e2e/packet-knights.spec.js`、`tests/e2e/drone-post.spec.js`、`tests/e2e/carnival-truth.spec.js`、`tests/e2e/lantern-lane.spec.js`、`tests/e2e/shape-tailor.spec.js`、`tests/e2e/four-color-kingdom.spec.js`、`tests/e2e/pirate-scales.spec.js`、`tests/e2e/bet-party.spec.js`、`tests/e2e/cpu-lab.spec.js`、`tests/e2e/island-water.spec.js`、`tests/e2e/strata-dig.spec.js`；其余课件仍需补同口径证据 |
| 行为分析埋点 | 中 | 缺口 | 缺口 | 不适用：无用户身份 | 缺口：endpoint 缺失时应空操作 | `docs/analytics.md`、`scripts/track.js`、`cloudflare/analytics/` |
| GitHub Pages 发布 | 中 | 部分：workflow 运行 `npm run build` | 缺口 | 不适用：GitHub Actions 权限由仓库配置控制 | 缺口：发布失败回滚依赖 Pages 历史版本 | `.github/workflows/deploy.yml` |
