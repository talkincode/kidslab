# KidsLab Analytics Worker

接收课件埋点 beacon、写入 [Workers Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/) 的 Cloudflare Worker。事件字典、SQL 查询手册见 [`docs/analytics.md`](../../docs/analytics.md)。

## 方式一：GitHub Actions 自动部署（推荐）

一次性配置：

```bash
# 1. 建 Cloudflare API token：https://dash.cloudflare.com/profile/api-tokens
#    用「Edit Cloudflare Workers」模板即可
# 2. 存入仓库 secret
gh secret set CLOUDFLARE_API_TOKEN
# 3.（Cloudflare 账号下有多个 account 时才需要）
gh secret set CLOUDFLARE_ACCOUNT_ID
```

之后 push 到 main 且 `cloudflare/analytics/**` 有变更时，`.github/workflows/deploy-analytics.yml` 自动部署；也可在 Actions 页面手动 Run workflow。

当前生产 endpoint：**`https://cl-api.talkincode.net`**（已配置为仓库变量 `KIDSLAB_ANALYTICS_ENDPOINT`，Pages 构建自动注入；本地构建默认不注入，保持提交的 `courseware/` 干净）。

## 自定义域名

`wrangler.toml` 中声明（zone 必须在同一 Cloudflare 账号，DNS 记录与证书自动创建）：

```toml
workers_dev = false
routes = [
  { pattern = "cl-api.talkincode.net", custom_domain = true }
]
```

注意：

- **子域名避开 `analytics`/`track`/`stats` 等词**（当前用 `cl-api`），防止被 uBlock/AdGuard 等广告拦截列表按域名前缀误杀；
- 绑定自定义域名要求 API token 在「Edit Cloudflare Workers」模板基础上，额外具有 **Zone → Workers Routes → Edit**（作用域选对应 zone）；只用 workers.dev 则不需要；
- 换域名后记得同步更新仓库变量：`gh variable set KIDSLAB_ANALYTICS_ENDPOINT --body "https://<新域名>"`。

## 方式二：本地手动部署

```bash
cd cloudflare/analytics
npx wrangler deploy    # 用钥匙串 token：CLOUDFLARE_API_TOKEN=$(security find-generic-password -s CLOUDFLARE_KIDSLAB_TOKEN -w) npx wrangler deploy
```

可选加固：在 `wrangler.toml` 的 `ALLOWED_ORIGINS` 填入站点来源（如 `https://<用户名>.github.io`）后重新部署，可挡掉第三方伪造上报。

## 验证

```bash
# 健康检查
curl https://kidslab-analytics.<子域>.workers.dev
# 手动写一条测试事件
curl -X POST https://kidslab-analytics.<子域>.workers.dev \
  -H 'content-type: text/plain' \
  -d '{"v":1,"c":"hanoi-tower","d":"testdev1","s":"testsess","l":"zh","p":"mouse","e":[{"n":"enter","t":0,"g":"","visits":1,"first":1}]}'
```

写入约 1 分钟后可在 Cloudflare Dashboard → Analytics & Logs → Analytics Engine 查询，或用 SQL API（见 `docs/analytics.md`）。

## 免费额度（Workers Free 计划）

| 项目 | 限额 |
|---|---|
| 写入 | 100,000 数据点/天 |
| SQL 查询 | 10,000 次/天 |
| 留存 | 3 个月 |

客户端已做配额守卫（重复动作合并计数、心跳 60 分钟封顶、自定义事件每会话 ≤500 条），按单会话最多约 600 行估算，免费额度支撑日均 150+ 个深度会话绰绰有余。
