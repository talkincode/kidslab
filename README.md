<p align="center">
  <img src="assets/logo.svg" width="96" alt="KidsLab logo" />
</p>

<h1 align="center">KidsLab</h1>

<p align="center">
  为小学到高中学生打造的互动课件学习乐园<br/>
  An interactive courseware playground for K12 students
</p>

<p align="center">
  <a href="https://talkincode.github.io/kidslab/"><b>🚀 在线访问 Live Site</b></a>
</p>

---

## ✨ 特性

- **纯静态网站** — 无后端、无框架运行时,GitHub Pages 直接托管
- **左右分栏主界面** — 学段选择(小学 / 初中 / 高中)+ 年级过滤 + 学科分类(数学 / 物理 / 化学 / 编程 / 科学 / 逻辑,小学自动隐藏物理化学)
- **课件完全独立** — 每个课件一个目录,自带 HTML/CSS/JS,互不依赖
- **中英双语** — 主站与全部课件共享语言偏好(`localStorage: kidslab.lang`)
- **深浅主题 + 4 种强调色** — 跟随系统,可手动切换
- **搜索过滤** — 标题 / 描述 / 标签双语实时搜索(按 `/` 聚焦)
- **侧栏收拢** — 桌面端窄轨模式,移动端抽屉
- **置顶课件** — Three.js 3D 欢迎页锁定第一位

## 📁 项目结构

```
kidslab/
├── index.html              # 主站入口
├── assets/                 # 主站样式/脚本/字体/logo
├── src/                    # 课件源码(开发目录)
│   └── <courseware-id>/
│       ├── course.json     # 课件元数据(必需)
│       ├── index.html      # 课件入口(必需)
│       └── *.css / *.js    # 课件资源
├── courseware/             # 构建产物(minify 后) + index.json 清单
├── scripts/
│   ├── build.mjs           # 构建:校验 + 压缩 + 生成清单
│   └── serve.mjs           # 本地预览服务器
└── .github/workflows/deploy.yml   # 推送 main 自动发布 Pages
```

## 🧩 添加一个新课件

1. 在 `src/` 下新建目录,如 `src/my-lesson/`
2. 编写 `index.html` + 样式脚本(**只用相对路径**,不依赖其他课件)
3. 添加 `course.json`:

```json
{
  "id": "my-lesson",
  "title":       { "zh": "我的课件", "en": "My Lesson" },
  "description": { "zh": "一句话介绍", "en": "One-line intro" },
  "category": "math",
  "levels": ["primary", "junior"],
  "grades": ["g4", "g5"],
  "tags": ["分数", "小数"],
  "icon": "🎓",
  "order": 80
}
```

| 字段 | 说明 |
|---|---|
| `id` | 与目录名一致 |
| `category` | `math` `physics` `chemistry` `programming` `science` `logic` `featured` 之一 |
| `levels` | `primary` `junior` `senior` 的子集 |
| `grades` | `g1`–`g12` 的数组(可选,年级筛选用) |
| `tags` | 必须使用 `src/taxonomy.json` 词表中的 canonical 标签 |
| `icon` | 卡片封面 emoji |
| `order` | 排序权重(小的在前,可选) |
| `pinned` | `true` 置顶(全站唯一,已被 welcome 使用,可选) |
| `badge` | `"new"` 显示新品角标(可选) |

4. 构建并预览:

```bash
npm ci
npm run build     # src/ → courseware/(js/css 压缩 + 校验 + 生成 index.json)
npm run preview   # http://localhost:8080
```

5. 提交推送,workflow 自动重新构建并发布。

## 🚀 部署

推送到 `main` 即触发 `.github/workflows/deploy.yml`:`npm ci` → `npm run build` → 组装 `_site/` → 发布 GitHub Pages。

> 首次启用:仓库 **Settings → Pages → Source** 选择 **GitHub Actions**。

## 📚 内置课件

| 课件 | 分类 | 学段 |
|---|---|---|
| 🚀 欢迎来到KidsLab · 从一盏灯到宇宙(Three.js) | 精选·置顶 | 全部 |
| 🍕 分数披萨店 | 数学 | 小学 |
| ✨ 数字萤火虫 | 数学 | 小学 |
| 🚇 百数地铁 | 数学 | 小学 |
| 🕰️ 时钟小镇 | 数学 | 小学 |
| ⚙️ 进位工厂 | 数学 | 小学 |
| 🍎 果园订单 | 数学 | 小学 |
| 🐹 仓鼠围栏 | 数学 | 小学 |
| 🔭 数字宇宙(Three.js) | 数学 | 小学·初中 |
| 🎡 滚轮乐园 | 数学 | 小学·初中 |
| 🔦 立体影子剧场(Three.js) | 数学 | 小学 |
| 📷 方块摄影棚(Three.js) | 数学 | 小学 |
| 🐠 体积水族馆(Three.js) | 数学 | 小学·初中 |
| 🍦 冰淇淋几何(Three.js) | 数学 | 小学·初中 |
| 📈 函数变形记 | 数学 | 初高中 |
| 🟢 单摆实验室 | 物理 | 初高中 |
| 🧪 酸碱魔法水 | 化学 | 初高中 |
| 🐢 海龟画室 | 编程 | 小学·初中 |
| 🍳 机器人早餐 | 编程 | 小学 |
| 🥁 循环乐队 | 编程 | 小学 |
| 🦁 如果动物园 | 编程 | 小学 |
| 🏥 虫虫医院 | 编程 | 小学 |
| 🐧 排序运动会 | 编程 | 小学·初中 |
| 📦 神秘盒子 | 科学 | 小学 |
| 🪐 太阳系漫游 | 科学 | 小学·初中 |
| ☁️ 云朵工厂 | 科学 | 小学 |
| 🪩 分子迪斯科 | 科学 | 小学 |
| 🐭 电工鼠小镇 | 科学 | 小学·初中 |
| 🌍 地球调度员(Three.js) | 科学 | 小学·初中 |
| 🌕 月相狼历(Three.js) | 科学 | 小学 |
| ⭐ 星海水手(Three.js) | 科学 | 小学·初中 |
| 🚣 消化道漂流记(Three.js) | 科学 | 小学 |
| 🏒 磁力冰球 | 科学 | 小学 |
| 🗼 汉诺塔挑战 | 逻辑 | 全部 |
| 🧩 数独动物园 | 逻辑 | 小学·初中 |
| 🐛 规律毛毛虫 | 逻辑 | 小学 |
| 🛸 维恩太空港 | 逻辑 | 小学 |
| 🕵️ 侦探线索板 | 逻辑 | 小学·初中 |
| 🦊 狐狸的石子 | 逻辑 | 小学·初中 |

> 新课件请从 [`docs/courseware-template/`](docs/courseware-template/) 双语/主题模板起步;课件规划清单见 [`docs/courseware-plan/`](docs/courseware-plan/)。

## 🧭 计划状态与验收

- 小学课件计划的已完成/未实现状态集中维护在 [`docs/courseware-plan/status.md`](docs/courseware-plan/status.md)。
- 每次完成规划课件后,必须同步更新状态清单、必要的学科规划文档和本 README 的内置课件列表;Agent 规约见 [`AGENT.md`](AGENT.md)。
- 当前最低自动校验是 `npm run build`;更完整的交互验收缺口记录在状态清单的验收矩阵中。

## License

双许可结构：

- **代码**（构建脚本、主站框架、课件程序逻辑）：[MIT](LICENSE)
- **课件内容**（教学设计、文案、图形等创作素材）：[CC BY 4.0](LICENSE-CONTENT.md) — 自由使用与传播，惟须署名

> Code is [MIT](LICENSE) licensed. Courseware content (lesson designs, copy, artwork) is licensed under [CC BY 4.0](LICENSE-CONTENT.md) — free to use and share with attribution.
