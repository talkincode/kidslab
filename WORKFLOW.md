# WORKFLOW.md — KidsLab 每日课件开发循环机制

本文沉淀"每天 20:00（北京时间）自动开发新课件"这一循环的可复用机制，供 Mira 的周期调度器或人类以一句话触发（如「开发今天的课件」）发起每次周期。周期内的执行体（Agent / 人类）据此读取状态、自主选型、开发交付并回写进度。

> 机制目标：**结果可追踪、交付可复核、进度单一事实源**。任何一次周期都不应凭空偏离规划，也不应留下"无法解释为什么做这个"或"仓库进度落后于代码"的状态。

---

## 1. 触发方式（三者任选其一）

当前 Mira 已登记 `KidsLab 每日晚间课件开发与发布` 周期；循环由周期调度器或人类一句话触发。

| 方式 | 触发信号 | 说明 |
| --- | --- | --- |
| A. Mira 周期调度 | `0 12 * * *`（UTC 12:00 = 北京时间 20:00），绑定 `kidslab` 项目与 `general-developer` 执行体，`skipIfActive` 防止重入 | 每次从未实现清单选一个课件，提交推送后由 `deploy.yml` 发布 |
| B. 人类一句话 | 对 Agent 说「开发今天的课件」 | 最灵活的入口，适用于人工把关的周期 |
| C. 手动 | 直接运行本机制描述的步骤 | 便于调试与回放 |

> 当前仓库已有 `.github/workflows/deploy.yml`（push → build → E2E → 发布）。每日循环的第一步是读取状态、选型并提交 `src/`，提交本身即触发发布；**任何周期触发的自动提交都必须跑完 `npm run test:unit` 与 `npm run build`，不得仅推源码。**

---

## 2. 每周期闭环（核心循环）

每个周期固定执行以下五步，顺序不可跳越：

```
1. 读取状态  →  2. 自主选型  →  3. 开发交付  →  4. 回写状态  →  5. 复核兜底
     ↑                 │              │              │
     └─────────────────┴──────────────┴──────────────┘  （下一周期从步骤 1 重新开始）
```

### 步骤 1：读取状态（选型必须基于唯一事实源）

先读以下文件，理解内容类型、主题范围、验收标准与下一项待办：

- `docs/courseware-plan/status.md` — **进度唯一事实源**：`已完成（规划内）` 与 `未实现（规划内）` 清单、分科汇总计数、"总结"待办建议。
- `docs/courseware-plan/<subject>.md`（如 `science.md`、`math.md`）— 该学科路线图：每条课件的 `G 学段 / P 优先级 / 玩法 / 魔法时刻 / 进阶`。
- `AGENT.md` — 工程规范：目录所有权、`courseware/` 不得手改、构建与自检要求、提交前清单。
- `README.md` — 内置课件列表（新增后需同步）。
- `docs/courseware-template/` — 新课件应遵循的模板模式。

### 步骤 2：自主选型（由规范的优先级驱动）

- 优先从 `status.md` 的 `未实现（规划内）` 清单中，按 `G 学段` 与 `P` 优先级选下一项；P1 且知识覆盖缺口明显的优先。
- 说明选型依据：记录"选了哪一个 `id`、为何（数学/编程/逻辑/科学轮流上新 + 知识缺口 + 优先级）+ 交付位置（`src/<id>/`、README 行、status 清单）"。
- 除非规划明确要求，**不得修改规范/路线图本身**，也不得凭空新增规划外课件充当本轮交付。

### 步骤 3：开发交付

在 `src/<id>/` 下开发，严格遵循 `AGENT.md`：

- 必需文件：`course.json`（构建校验）、`index.html`（课件入口）、`*.css/*.js`、`facts.md`（知识断言，`test:unit` 门禁）。
- 只改 `src/`；改完必须 `npm run build` 重新生成 `courseware/<id>/` 与 `index.json`，**源码与产物一起提交**。
- 知识断言单测：为关键逻辑新增 `tests/unit/<id>.test.mjs`，跑 `npm run test:unit` 保持全绿。
- E2E：新增 `tests/e2e/<id>.spec.js`（smoke 已随清单自动覆盖加载）。**若当前环境无法运行真实浏览器 Playwright（缺 GUI 系统库），必须如实标注缺口**，不得谎称"已验证"；由 CI（GitHub Actions `e2e` job，`npm run test:e2e`）承担最终验证。

### 步骤 4：回写状态（版本化，必须 commit）

按 `AGENT.md` 与 `status.md`「状态维护规约」，同步更新并**提交**：

1. `status.md`：把课件从 `未实现` 移动到对应学科 `已完成`；更新"汇总"表格的分科计数与合计；在「验收矩阵」补充该课件覆盖证据（unit/smoke/E2E，明确缺口）。
2. `README.md`：为新增课件补一行内置课程列表。
3. `docs/courseware-plan/<subject>.md`：规划条目如需对齐玩法/优先级则同步（不改规划本身）。
4. 提交信息携带 `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`（如需）。

### 步骤 5：复核兜底

- 重新运行 `npm run test:unit` 与 `npm run build`，确认退出码 0。
- 自检 `status.md` 汇总计数与实际清单一致、README 内置列表与 `courseware/index.json` 一致。
- 对无法在本环境执行的验证（真实浏览器 E2E 等），在提交说明与本文件缺口记录中明确写出，不等同于"已验证"。

---

## 3. 状态回写规约（硬性）

- `status.md` 是**唯一事实源**；代码先于状态不算完成，状态先于代码也不算完成，两者必须同一次提交对齐。
- 回写必须**版本化**：以 commit 落到 kidslab 仓库（不能用未提交的本地改动或数据库代偿）。
- 勾选"已完成"的前置条件（`status.md` 规则）：`src/<id>/course.json` 存在且通过构建校验、`courseware/<id>/` 已重新生成、必要时 README 列表已同步。
- 未实现清单清空后，本轮无 `id` 可交付时，只做状态读取与规划对齐，不强行造课；在周期记录中说明"无待办，暂不新增"。

---

## 4. 本环境的已知限制与验证兜底

当前开发容器（`mira`，uid 999，无 sudo/apt 网络）无法运行真实浏览器 Playwright：缺少 `libatk-1.0`、`libgbm`、`libasound`、`libcairo`、`libpango`、`libXcomposite` 等系统 GUI 库。

- **替代验证**：用 happy-dom + canvas 2D stub + Path2D stub 的 DOM 烟测，直接导入真实的 `scripts/sdk/core.js` 与课件 `main.js`，验证初始化、通关流程、`kidslab.progress.<id>` 写入。
- **权威验证**：真实浏览器 E2E 由 GitHub Actions `deploy.yml` 的 `e2e` job 承担（`npm run test:e2e`，desktop + mobile 两档），推送到 `main` 即自动执行。
- **原则**：缺口必须记录，不允许把"逻辑单测/DOM 烟测通过"表述为"真实浏览器 E2E 已验证"。

---

## 5. 首次落地的本轮记录（demo：eco-island）

| 字段 | 值 |
| --- | --- |
| 周期触发 | 机制首次落地的切入点（人类以任务形式发起） |
| 交付课件 | 🌿 生态小岛 `eco-island`（G3-5，P1，科学：食物链与食物网、生产者/消费者/分解者、生态平衡） |
| 选型依据 | `status.md` 科学 `未实现` 清单取 P1 + 生命科学知识覆盖缺口明显 |
| 交付位置 | `src/eco-island/`（`course.json`/`index.html`/`style.css`/`eco-model.js`/`main.js`/`facts.md`）+ `courseware/eco-island/`（构建产物）+ README 行 + status.md 勾选与计数 |
| 验证 | `npm run test:unit`（含 6 条生态小岛模型单测）、`npm run build` 均通过；happy-dom+canvas-stub 烟测完成 M1/M2 通关并写入 `kidslab.progress.eco-island` |
| 待补缺口 | 真实浏览器 Playwright E2E 在本环境不可运行，已由 CI `tests/e2e/eco-island.spec.js` 兜底验证 |

---

## 附：维护本文件

- 本次循环机制若有调整（触发方式、步骤、回写规约），更新本节/本文件并在同一次提交中说明改动。
- `status.md` 的"总结"段与本文件共同构成下一周期的指引。