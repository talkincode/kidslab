# AGENT.md — KidsLab

AI 编码代理工作指南。本项目是纯静态的 K12 互动课件平台，无后端、无框架运行时，由 GitHub Pages 托管。

## 常用命令

```bash
npm ci            # 安装依赖(esbuild、three)
npm run build     # 构建:校验 course.json + 压缩 js/css → courseware/ + 生成 index.json
npm run preview   # 本地预览 http://localhost:8080
npm run test:e2e  # Playwright smoke:主站交互 + 全课件桌面/手机加载验收
npm run vendor    # 更新 three.js 到 src/welcome/vendor/
```

没有 lint;改动后必须运行 `npm run build` 与 `npm run test:e2e` 并确保通过(退出码 0)。课件改动提交前,还必须逐项过一遍下方「提交前自检清单」。

## 目录结构与所有权

```
index.html          # 主站入口
assets/             # 主站 css/js/字体/logo(手写,非构建产物)
src/<id>/           # ✏️ 课件源码 —— 在这里开发
  course.json       #    元数据(必需,构建时校验)
  index.html        #    课件入口(必需)
  *.css / *.js      #    课件资源
courseware/         # ⛔ 构建产物(minify) + index.json —— 不要手改,由 build 生成
docs/courseware-plan/status.md # 计划状态清单:已完成/未实现/待对齐
scripts/build.mjs   # 构建/校验逻辑(分类、学段白名单在此)
scripts/serve.mjs   # 预览服务器
scripts/sdk/core.js # 平台 SDK:偏好、声明式 i18n、analytics 兼容入口
scripts/track.js    # 埋点脚本源码,构建时内联注入课件(见 docs/analytics.md)
scripts/report.mjs  # 行为分析终端报表: npm run report
tests/e2e/          # Playwright smoke:主站筛选与全部清单课件
playwright.config.js # 桌面 1280×800 + 手机 375×667 两档配置
cloudflare/analytics/  # 埋点接收 Worker(push 时经 deploy-analytics.yml 自动部署)
.github/workflows/deploy.yml  # push main → 自动构建发布 Pages
.github/workflows/deploy-analytics.yml  # cloudflare/analytics 变更 → 自动部署 Worker
```

**关键规则:改课件只改 `src/`,然后 `npm run build` 重新生成 `courseware/`,两者一起提交。**

## 添加新课件

1. 从模板起步:复制 `docs/courseware-template/` 四个文件到 `src/<courseware-id>/`(目录名即 `id`),模板通过平台 SDK 复用双语与深浅主题机制,用法见 `docs/courseware-template/README.md`
2. 编写 `index.html` + 样式脚本
3. 添加 `course.json`(schema 见下),运行 `npm run build` 校验

`course.json` 字段(由 `scripts/build.mjs` 强校验):

| 字段 | 要求 |
|---|---|
| `id` | 必须与目录名一致 |
| `title` / `description` | 必须是 `{ "zh": "...", "en": "..." }` 双语对 |
| `category` | `featured` `math` `physics` `chemistry` `programming` `science` `logic` 之一 |
| `levels` | `primary` `junior` `senior` 的非空子集 |
| `grades` | 可选,`g1`–`g12` 的数组,年级筛选与搜索用 |
| `tags` | 数组,必须使用 `src/taxonomy.json` 里的 canonical 标签(中文键);英文与同义词通过词表 aliases 自动展开为搜索关键词 |
| `icon` | 必填,emoji |
| `order` | 可选,数字小的在前 |
| `pinned` | 可选,全站唯一,已被 `welcome` 占用 |
| `badge` | 可选,`"new"` 显示新品角标 |

## 计划清单维护规约

`docs/courseware-plan/status.md` 是当前计划进度的单一入口,负责区分已完成、未实现和已上线但未对齐规划 ID 的课件。

开始开发前:

- 先阅读 `docs/courseware-plan/status.md` 和对应学科清单 `docs/courseware-plan/<subject>.md`
- 选择未实现项时,以 `status.md` 的未勾选条目为准
- 如果发现源码已存在但规划 ID 不一致,不要直接勾选;先放入或更新 `status.md` 的"待对齐"说明

完成一个计划项后,同一轮必须同步:

- 将 `status.md` 中对应条目从未实现移动到已完成,并更新汇总计数
- 如新增或下线课件,同步更新 `README.md` 的内置课件列表
- 如课程 ID、玩法、优先级或替代关系变了,同步更新对应 `docs/courseware-plan/<subject>.md`
- 运行 `npm run build`,并提交 `src/` 与重新生成的 `courseware/`

验收矩阵硬性规定:

1. 每个一级功能至少有一条 Happy Path E2E
2. 每个高风险功能至少覆盖一条失败路径
3. 每个涉及权限的功能至少验证两种角色
4. 每个会修改系统状态的操作至少验证一次失败后的恢复或回滚
5. 每次新增一级业务功能,必须同步新增对应 E2E 并更新 `docs/courseware-plan/status.md` 的验收矩阵

当前 smoke 层覆盖主站搜索/分类筛选，以及清单中全部课件在桌面与手机视口下的零报错加载、资源失败、可见横向溢出和语言/主题偏好重载。玩法逻辑、知识正确性、拖拽手感、视觉质量与纵向首屏布局仍需人工验收，不能写成已由 E2E 验证。

## 课件编写约定

- **完全独立**:每个课件自带全部资源,只用相对路径,不引用其他课件或主站 assets
- **无构建依赖**:源码即浏览器可运行的原生 HTML/CSS/JS(ES Module 可用);第三方库以本地 vendor 文件引入(参考 `src/welcome/vendor/`),不用 CDN
- **中英双语**:界面文案提供 zh/en,使用 `window.cool.bindI18n()` 与 `window.cool.preferences` 同步语言偏好
- **主题适配**:使用 `window.cool.preferences` 切换深浅主题;主站配色变量见 `assets/css/app.css`
- **面向 K12**:交互直观、文案友好,适合小学到高中学生;质量底线见下方「质量规约」
- **行为埋点(可选)**:埋点脚本由构建注入,课件可用可选链调用 `window.cool?.stage('level2')` 汇报阶段、`window.cool?.track('flip')` 汇报核心动作(未注入埋点时自然空操作);给"孩子做了什么"起名而非"点了哪个按钮",每课件 5~10 个即可,详见 `docs/analytics.md`

## 质量规约(每个课件必须达标)

用户是孩子。验收标准只有一条:孩子打开就想玩、30 秒内上手,玩的过程中不被粗糙的细节劝退。

1. **场景要有真实感,拒绝粗糙**
   - 场景/模型不能停留在"能看出是什么",要让孩子觉得可信、想伸手摸。动手前先想想真实物体长什么样:披萨要像披萨,桥要像桥
   - three.js 场景标配:环境光+方向光、阴影、`antialias: true`、`MeshStandardMaterial`(不用 Basic 材质糊弄);比例、圆角、细节装饰都要打磨
   - 2D/Canvas 场景:用渐变、投影、动效点缀,禁止"默认灰盒子+黑描边"的程序员美术

2. **文案说人话**
   - 按目标学段写:小学低年级用短句+图标+演示动画,零阅读门槛;不堆术语,不写"请配置参数以初始化仿真"这类话
   - 术语必须出现时,先用孩子的语言解释一遍(如"pH 就是水的'脾气值'"),术语最后才轻轻出现
   - zh/en 两套文案都要用"这个年龄的孩子能看懂吗"过一遍

3. **零逻辑错误**
   - 知识本身必须正确:公式、单位、方向、比例、因果关系,拿不准就查证,宁可删功能不可教错
   - 游戏逻辑自洽:计分、胜负判定、状态流转逐一走查;边界值(0、负数、最大值、连点、中途重开)都要试
   - 任何操作序列都不能把课件玩"死"(卡住、NaN、无法继续),控制台零报错

4. **文字清晰可读（儿童优先，不可妥协）**
   - **默认正文、题干、线索、操作提示、表单标签 ≥ 16px**；紧凑的辅助说明 ≥ 14px。12–13px 仅可用于纯装饰性微标签，绝不能承载玩法说明、答案、按钮文案或关键信息
   - 按钮、关键数值、可点击文字 ≥ 16px，交互命中区 ≥ 44×44px；不要靠缩小字号、`transform: scale()` 或 `zoom` 去塞进布局
   - 375px 手机下空间不够时，优先换行、分步、折叠或横向滚动；**不得把核心文字降到 14px 以下**
   - 正文行高建议 ≥ 1.45，短提示也要有足够的上下留白；以孩子正常坐姿、非放大浏览为基准检查，不让孩子眯眼找字
   - 文字与背景对比度 ≥ 4.5:1,深浅两套主题分别检查;文字别压在花哨背景上,必要时加底衬
   - 关键信息不能只靠颜色区分(照顾色弱),配合图标/文字/形状

5. **布局合理,少滚动**
   - 核心玩法区+控制区一屏放下,不出现纵向滚动条;桌面 1280×800 和手机竖屏 375×667 两档都要验证
   - 用 flex/grid 自适应,不写死高度;信息多时用标签页/折叠/分步,不靠滚动堆叠
   - 说明文字放侧边或收进提示按钮,别把玩法区挤出首屏

6. **拖拽必须平滑友好**
   - 用 Pointer Events + `setPointerCapture`,拖拽全程跟手:不跳变、不丢失、快速甩动不脱手
   - 可拖元素命中区 ≥ 40×40px;拖起有抬起/阴影/高亮反馈,松手有吸附或回弹动画,不生硬瞬移
   - 拖到有效落点时高亮提示"可以放这里";放错可撤销或自动归位,不惩罚手滑

7. **提示恰到好处**
   - 首次进入给一句话玩法提示或 2~3 步引导,不弹长篇教程;引导可跳过、随进度自动消失、不遮挡玩法区
   - 每步关键操作有即时反馈(动画/音效/文案);原地卡住约 30 秒给一条轻提示
   - 提示是"递台阶"不是"报答案":先提醒看哪里,再给方向,最后才演示

## 提交前自检清单

改完课件,逐项确认后再提交;有一项不过就回去修,不要跳过。

- [ ] `npm run build` 通过(退出码 0),`src/` 与 `courseware/` 一起提交
- [ ] `npm run test:e2e` 通过(退出码 0),新增课件已自动纳入桌面/手机 smoke
- [ ] 以目标学段孩子的身份完整玩一遍:30 秒内上手,全程无需说明书
- [ ] 场景经得起看:光影/材质/比例不粗糙,无默认灰盒、无穿模、无明显违和
- [ ] 文案全部说人话,zh/en 双语齐全,切换语言即时生效且无漏翻
- [ ] 知识点、公式、单位、方向零错误
- [ ] 边界情况玩不死:0/负数/最大值/连点/中途重开都正常,控制台零报错
- [ ] 儿童字号达标：正文/题干/线索/操作提示 ≥16px，辅助说明 ≥14px，按钮与关键数值 ≥16px；375px 下核心文字不缩小
- [ ] 1280×800 与 375×667 下核心区域一屏放下,无纵向滚动条
- [ ] 拖拽跟手平滑:指针捕获、有反馈、有吸附/归位,触屏可用(`touch-action: none`)
- [ ] 首次引导 + 操作反馈 + 卡住轻提示齐备,不遮挡玩法区
- [ ] 深浅主题切换即时生效(含 Canvas/three.js 重绘),无硬编码颜色
- [ ] 若完成或新增计划项,已同步更新 `docs/courseware-plan/status.md`、必要的学科规划文档和 README

## 部署

push 到 `main` 自动触发 workflow:`npm ci` → 无 analytics 构建 → 安装 Chromium 并运行 `npm run test:e2e` → 按仓库变量重新生成发布产物 → 组装 `_site/`(index.html + assets + courseware)→ 发布 GitHub Pages。无需手动操作。

## 注意事项

- `.min.js` / `.min.css` 文件构建时跳过压缩,直接复制
- `.DS_Store` 会被构建忽略,但不要提交(已在 `.gitignore`)
- 提交信息用中文或英文均可,保持简洁
