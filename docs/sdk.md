# KidsLab 平台 SDK

`scripts/sdk/core.js` 在构建时内联到每个课件，不依赖 CDN 或运行时服务器。源码页通过下面的标记加载同一文件，`npm run build` 会移除该外链并替换为内联代码：

```html
<script src="../../scripts/sdk/core.js" data-kidslab-sdk></script>
```

## API

```js
window.cool.preferences.lang;
window.cool.preferences.theme;
window.cool.preferences.toggleLang();
window.cool.preferences.toggleTheme();
window.cool.preferences.subscribe(({ kind, value }) => {});

const i18n = window.cool.bindI18n(I18N, {
  onChange({ kind, lang, theme, t }) {
    document.title = t('doc');
    render();
  },
});

window.cool?.stage('level2');
window.cool?.track('flip', { value: 3 });
```

- `preferences` 负责校验、保存并应用 `kidslab.lang` / `kidslab.theme`。
- `bindI18n()` 自动更新 `[data-t]` 静态文案；动态文案通过返回的 `t()` 读取。
- 主题变化继续派发 `themechange`，Canvas 与 three.js 可沿用现有监听方式。
- `track()` / `stage()` 始终存在；未配置 analytics 时为空操作，配置后由 `scripts/track.js` 扩展实现。

## 存量迁移

1. 在源码 `index.html` 的 `<head>` 加入带 `data-kidslab-sdk` 的脚本标记。
2. 用 `window.cool.preferences.lang` 替换直接读取 localStorage。
3. 用 `bindI18n()` 替换手写的 `[data-t]` 遍历与文档语言更新。
4. 语言/主题按钮调用 `toggleLang()` / `toggleTheme()`。
5. 保留课件自己的 `I18N` 字典、动态渲染和 CSS token；SDK 不接管玩法状态。
6. 运行 `npm run build` 与 `npm run test:e2e`，确认源码页和独立构建产物都可运行。
