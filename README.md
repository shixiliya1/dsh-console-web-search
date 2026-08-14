# DSH Console Web Search

为 DeepSeek Harness（DSH）提供一个 Console Go 可接受的网页搜索工具名。

Console Go 会拒绝名为 `web_search` 的自定义函数，并返回：

```text
invalid tools in request: custom function name "web_search" is reserved
```

本插件禁用原工具，并把同一套 DSH 搜索能力注册为 `console_web_search`。它还附带“Console Go 安全”智能体预设，避免标准预设再次加入原来的 `web_search`。

## 工作方式

```text
Console Go 模型
  → console_web_search
  → DSH ctx.web
  → 已配置的 DSH 搜索提供方
  → 网页来源
```

插件不会代理模型请求，不会读取或保存 API Key，也不会安装新的搜索引擎。

## 兼容性

- DSH `0.1.0-rc.6`
- Node.js 20 或更高版本
- pnpm 11（开发和打包时需要）

DSH 仍处于预览阶段。“Console Go 安全”预设基于 `0.1.0-rc.6` 的标准预设；升级 DSH 后应重新核对预设内容。

## 搜索凭据

模型聊天和网页搜索是两条不同的链路。Console Go 提供模型调用；本插件的搜索仍通过 DSH `ctx.web` 完成。

DSH 默认的 DeepSeek 搜索提供方需要有效的 `DEEPSEEK_API_KEY`。可以通过 DSH 的模型/凭据设置页面保存，或在启动 DSH 的环境中设置。不要把密钥写进本仓库。

## 从源码安装

```powershell
git clone <你的仓库地址>
cd dsh-console-web-search

pnpm install --frozen-lockfile
pnpm pack
```

安装生成的压缩包：

```powershell
$packageDirectory = Join-Path $env:USERPROFILE '.dsh\packages'
New-Item -ItemType Directory -Path $packageDirectory -Force | Out-Null
Copy-Item '.\dsh-console-web-search-0.1.0.tgz' $packageDirectory

npx @deepseek-ai/dsh plugin --profile web add `
  (Join-Path $packageDirectory 'dsh-console-web-search-0.1.0.tgz')
```

安装安全预设：

```powershell
$presetTarget = Join-Path $env:USERPROFILE '.dsh\.agent-presets\console-safe'
if (Test-Path -LiteralPath $presetTarget) {
  throw "预设已存在，未覆盖：$presetTarget"
}

Copy-Item '.\preset\console-safe' $presetTarget -Recurse
```

重启 DSH，然后新建会话。会话顶部应显示“Console Go 安全”。

> DSH `0.1.0-rc.6` 在 Windows 上可能错误拆分包含空格的本地安装包路径。遇到这种情况，请先把 `.tgz` 放到不含空格的路径再执行安装。

## 从 GitHub Release 安装

从仓库的 Releases 页面下载 `dsh-console-web-search-0.1.0.tgz`，然后执行上面的“安装生成的压缩包”步骤。安装完成后，可以直接从已安装的插件中复制安全预设：

```powershell
$presetSource = Join-Path $env:USERPROFILE '.dsh\profiles\web\node_modules\dsh-console-web-search\preset\console-safe'
$presetTarget = Join-Path $env:USERPROFILE '.dsh\.agent-presets\console-safe'

if (Test-Path -LiteralPath $presetTarget) {
  throw "预设已存在，未覆盖：$presetTarget"
}

Copy-Item $presetSource $presetTarget -Recurse
```

## 使用

1. 在 DSH 中新建会话。
2. 选择“Console Go 安全”预设。
3. 选择 Console Go 模型。
4. 例如输入：`调用 console_web_search 搜索 DeepSeek Harness，并给出来源链接。`

发给模型的工具目录中应出现 `console_web_search`，不应出现 `web_search`。

## 开发

```powershell
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run build
pnpm pack
```

插件入口是 `src/index.ts`，配置补丁是 `cordis.patch.yml`，安全预设位于 `preset/console-safe`。

## 发布

完整的 GitHub 首次发布和 Release 命令见 [PUBLISHING.md](./PUBLISHING.md)。

## 许可证

[MIT](./LICENSE)
