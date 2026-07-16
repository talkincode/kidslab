# 课件双语/主题模板 · Bilingual & Theme Courseware Template

新课件的标准起步模板。复制本目录四个文件到 `src/<courseware-id>/`，改 `course.json`，在标注了
`✏️` 的位置填入你的玩法即可。模板解决了每个课件都必须做对的三件事：

1. **中英双语**：`I18N` 字典 + `data-t` 属性，读写 `localStorage: kidslab.lang`，与主站即时同步；
2. **深浅主题**：两套 CSS token（对齐主站 `assets/css/app.css`），读写 `localStorage: kidslab.theme`，
   跟随系统偏好，Canvas 通过 `cssVar()` 取色、监听 `themechange` 事件重绘；
3. **平台外壳**：返回主站的顶栏、语言/主题切换按钮、移动端 viewport 与触屏事件基线。

## 使用方法

```bash
cp docs/courseware-template/{index.html,style.css,main.js,course.json} src/my-course/
# 1. 改 course.json：id 必须等于目录名，title/description 填 zh/en 双语
# 2. index.html：改标题 emoji 与 <main> 里的舞台结构
# 3. main.js：往 I18N 里加文案 key，在“游戏区”写玩法
# 4. style.css：只用 var(--token) 上色，新增颜色先加进两套主题 token
npm run build   # 必须通过（退出码 0）
```

## 约定速查（硬要求）

| 事项 | 约定 |
|---|---|
| 文案 | 一律进 `I18N.zh` / `I18N.en`，静态节点挂 `data-t="key"`，动态文案用 `t('key')` 或函数 key |
| 语言切换 | `#langBtn`，按钮文字显示「对方语言」（当前中文则显示 `EN`） |
| 主题切换 | `#themeBtn`，light 显示 `🌙`、dark 显示 `☀️`；`<html data-theme="light|dark">` |
| 颜色 | CSS 永远 `var(--*)`；JS/Canvas 用 `cssVar('--ink')` 实时读取，禁止硬编码双主题色值 |
| 亮色底上的文字 | 压在 `--accent` / `--accent-2` 等固定亮色上的文字一律用 `var(--ink-on-accent)`（两套主题都是深色），不要用 `--ink`/`--card`，否则暗色主题下白字压亮黄底看不清 |
| Canvas | 监听 `resize` 与 `themechange`（模板派发的自定义事件）重设尺寸/配色 |
| 触屏 | 交互用 Pointer Events（`pointerdown/move/up`），画布加 `touch-action: none` |
| 独立性 | 只用相对路径；第三方库放本课件 `vendor/`（three.js 参考 `src/welcome/vendor/`），禁止 CDN |
| 音频 | WebAudio 必须在首次用户手势里 `resume()`；提供静音开关是加分项 |
| 埋点（可选） | 关键阶段调 `window.cool?.stage('level2')`、核心动作调 `window.cool?.track('flip')`（埋点由构建注入，务必用可选链，未注入时自然空操作）；详见 `docs/analytics.md` |

## three.js 课件补充

```bash
mkdir src/my-course/vendor
cp src/welcome/vendor/three.module.min.js src/my-course/vendor/
```

```html
<script type="module" src="main.js"></script>
```

```js
import * as THREE from './vendor/three.module.min.js';
// 主题切换时同步 scene.background / 材质颜色：
addEventListener('themechange', () => scene.background.set(cssVar('--paper')));
```

WebGL 不可用时要给出降级文案（参考 `src/welcome/main.js` 的 `nogl`）。

## course.json 字段

见 `AGENT.md`。本目录的 `course.json` 是可直接改用的样例；`id` 必须与目录名一致，
`category` ∈ `math|programming|logic|science|physics|chemistry|featured`，`levels` 含 `primary`。
