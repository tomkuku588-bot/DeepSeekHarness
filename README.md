# DSHarness 个人版合规页面

本仓库用于发布 DSHarness 个人版的公开合规文档，内容依据 HarmonyOS 应用的实际离线功能整理。

## 页面

- `index.html`：合规文档入口
- `privacy-policy.html`：隐私政策
- `user-agreement.html`：用户协议
- `style.css`：共享样式
- `script.js`：中英文切换、偏好记忆及链接语言参数保持
- `tests/verify-static-site.mjs`：静态页面验证

所有页面均支持右上角切换语言，也可使用 `?lang=zh` 或 `?lang=en` 直接指定语言。

## 联系方式

- 联系邮箱：`tomkuku588@gmail.com`
- 开发者/运营者：以应用市场公示的实名认证主体为准

## GitHub Pages

仓库地址：

```text
git@github.com:tomkuku588-bot/DeepSeekHarness.git
```

发布后地址：

- 合规入口：`https://tomkuku588-bot.github.io/DeepSeekHarness/`
- 隐私政策：`https://tomkuku588-bot.github.io/DeepSeekHarness/privacy-policy.html`
- 用户协议：`https://tomkuku588-bot.github.io/DeepSeekHarness/user-agreement.html`

`main` 分支更新后，GitHub Actions 会把静态文件同步到 `gh-pages` 分支。GitHub Pages 的发布来源应设置为 `gh-pages` 分支根目录。

## 本地验证

```bash
node tests/verify-static-site.mjs
```
