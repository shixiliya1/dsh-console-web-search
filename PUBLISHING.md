# 发布到 GitHub

本项目推荐使用 GitHub CLI 发布。发布前需要安装并登录 `gh`，并为仓库设置提交身份。

## 1. 登录 GitHub

```powershell
gh auth login
```

按提示选择 `GitHub.com`、`HTTPS` 和浏览器登录。不要把访问令牌写进项目文件。

## 2. 初始化并提交

```powershell
cd "C:\Users\xili\Documents\New project 11\dsh-console-web-search"

git branch -M main
git config user.name "你的 GitHub 显示名称"
git config user.email "你的 GitHub 提交邮箱"

pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run build

git add .
git commit -m "feat: initial release"
```

本地仓库已经初始化。这里使用仓库级 Git 身份，不会改动全局 Git 配置。GitHub 提供的 noreply 邮箱也可以作为提交邮箱。

## 3. 创建公开仓库并推送

```powershell
gh repo create dsh-console-web-search `
  --public `
  --source=. `
  --remote=origin `
  --push `
  --description "DSH web search tool with a Console Go-safe function name"
```

如果暂时不想公开，把 `--public` 改为 `--private`。

## 4. 发布 v0.1.1 安装包

```powershell
pnpm pack
git tag -a v0.1.1 -m "v0.1.1"
git push origin v0.1.1

gh release create v0.1.1 `
  .\dsh-console-web-search-0.1.1.tgz `
  --verify-tag `
  --title "dsh-console-web-search v0.1.1" `
  --generate-notes
```

GitHub Release 会附带可供别人安装的 `dsh-console-web-search-0.1.1.tgz`。构建目录、依赖目录和本地压缩包已被 `.gitignore` 排除，不会进入源码提交。

## 后续版本

先修改 `package.json` 中的版本号并重新构建，然后提交代码、创建同版本 Git 标签，再执行 `gh release create`。版本号、标签和压缩包文件名应保持一致。
