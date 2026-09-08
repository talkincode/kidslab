# 3D 观测实验课件模板 · Observation Lab Template

新课件的标准起步模板，界面对齐 **魔方小达人** / **华容道**：全屏 Three.js 场景在左，右侧可展开收拢的参数面板。

以后所有新课件都以 **观测 / 调试 / 实验** 为主，**禁止考试型**（选择题、填空通关、开局预测再评分）。孩子调参数、看 3D 变化、读仪器，把规律玩出来。

模板自带一个可运行的竖直弹跳观测台，用来示范质量线。复制后把 `✏️`、`lab-model.js` 里的定律和 `scene.js` 里的标本换成你的课题。

## 使用方法

```bash
id=my-course
cp -R docs/courseware-template src/$id
rm -f src/$id/README.md
# 1. course.json：id 必须等于目录名；title/description 双语；玩法写成观测/实验，不要写成考试
# 2. facts.md：标题 id 同目录名；只列本课实际教授/依赖的知识
# 3. lab-model.js：纯函数模型（无 DOM / 无 three），先写单测再接线
# 4. scene.js：替换 3D 标本；保留灯光、阴影、MeshStandard/Physical、主题背景
# 5. index.html / main.js：改 I18N 与参数面板控件，不要改成试卷
# 6. audio.js 里的 storageKey 改成 kidslab.<id>
npm run test:unit
npm run build
```

## 约定速查（硬要求）

| 事项 | 约定 |
|---|---|
| 文案 | 一律进 `I18N.zh` / `I18N.en`，静态节点挂 `data-t="key"`，动态文案用 `t('key')` 或函数 key |
| 文字密度 | 首屏只留一句动作邀请；规则卡、公式、知识点默认隐藏，由交互、轻提示或卡住后再出现，开局不报答案 |
| SDK | `index.html` 保留带 `data-kidslab-sdk` 的源码脚本；构建时会替换为内联 SDK，产物不依赖外部目录 |
| 语言切换 | `#langBtn`，按钮文字显示「对方语言」（当前中文则显示 `EN`） |
| 主题切换 | `#themeBtn`，light 显示 `🌙`、dark 显示 `☀️`；`<html data-theme="light|dark">` |
| 颜色 | CSS 永远 `var(--*)`；JS/Canvas 用 `cssVar('--ink')` 实时读取，禁止硬编码双主题色值 |
| 亮色底上的文字 | 压在 `--accent` / `--accent-2` 等固定亮色上的文字一律用 `var(--ink-on-accent)`（两套主题都是深色），不要用 `--ink`/`--card`，否则暗色主题下白字压亮黄底看不清 |
| Canvas | 监听 `resize` 与 `themechange`（模板派发的自定义事件）重设尺寸/配色 |
| 触屏 | 交互用 Pointer Events（`pointerdown/move/up`），画布加 `touch-action: none` |
| 独立性 | 只用相对路径；第三方库放本课件 `vendor/`（three.js 参考 `src/magic-cube/vendor/`），禁止 CDN |
| 知识断言 | `facts.md` 必须写适用范围、带编号断言和权威来源；每条断言至少引用一个 `[S编号]` |
| 形态 | 观测 / 调试 / 实验。禁止选择题、对错打分、开局把答案写进试卷 |
| 布局 | 全屏 3D 舞台；右侧 `#panel` 可展开收拢；手机改为底部抽屉。不要再做「上说明书、下小画布」 |
| 3D | 必须 three.js，本地 `vendor/`，禁止 CDN。环境光+方向光、阴影、`antialias`、`MeshStandardMaterial`/`MeshPhysicalMaterial`。WebGL 失败显示 `#nogl` |
| BGM | 必须有本地可循环 BGM；`#musicBtn` 与 `#soundBtn` 分开；首次手势后才 `unlock()`；隐藏标签页时暂停 |
| 音频 | 核心操作、成功、错误与发现时刻要有不同音效；静音开关可见可访问且能关闭全部声音；禁止在 `pointermove` / rAF 里无节制创建音源；失败时静默降级 |
| 进度/埋点 | 开始观测调 `window.cool?.stage('observe')`；完整观测闭环调 `window.cool?.complete?.()`；详见 `docs/sdk.md` |
| 逻辑验收 | 玩法抽到 `*-model.js`。单测至少覆盖：恒等式、边界、非法输入拒绝且不改状态、失败后可恢复 |

平台 API 与存量迁移步骤见 [`docs/sdk.md`](../sdk.md)。

## 逻辑验收清单

复制后的新课件，在提交前必须用单测锁死模型，而不是只靠「我玩了一遍」：

1. **恒等式**：把课件真正依赖的公式写成可断言的等式（本模板：`t=√(2h/g)`、`v=√(2gh)`、`h′=h e²`、`e=1` 机械能守恒）。
2. **边界**：最小/最大参数、`e=0` 静止、`dt=0` 不变。
3. **非法拒绝**：`NaN`、负数时间、越界参数返回 `{ ok:false, reason }`，并且不改动原状态/历史。
4. **可恢复**：暂停后继续、改参数后 `dropAgain()` 仍能玩，不会卡死。
5. **非考试**：`index.html` / `main.js` 不出现选择题或「正确答案」流程。

参考：`tests/unit/courseware-template.test.mjs`。新课件写 `tests/unit/<id>.test.mjs`。

## 3D 与 BGM

`index.html` 必须带 importmap 与 `<script type="module" src="main.js">`。场景取色走 `cssVar('--scene-a')` 等 token，监听 `themechange`。模板已内置 `vendor/three.module.min.js`、`RoomEnvironment.js`、`RoundedBoxGeometry.js`。

BGM 默认是 `audio/lab-glow.ogg`（曲库 `bgm-hope-01`，循环、中能量）。换课题时换本地音频，不要 CDN，不要在手势前播放。

## course.json 字段

见 `AGENTS.md`。本目录的 `course.json` 是可直接改用的样例；`id` 必须与目录名一致，
`category` ∈ `math|programming|logic|science|physics|chemistry|featured`，`levels` 含 `primary`。
