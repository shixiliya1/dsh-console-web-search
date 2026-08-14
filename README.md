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
- Node.js `^22.19.0 || >=24.0.0`
- pnpm 11（开发和打包时需要）

DSH 仍处于预览阶段。“Console Go 安全”预设基于 `0.1.0-rc.6` 的标准预设；升级 DSH 后应重新核对预设内容。

## 搜索凭据

模型聊天和网页搜索是两条不同的链路。Console Go 提供模型调用；本插件的搜索仍通过 DSH `ctx.web` 完成。

DSH 默认的 DeepSeek 搜索提供方需要有效的 `DEEPSEEK_API_KEY`。可以通过 DSH 的模型/凭据设置页面保存，或在启动 DSH 的环境中设置。不要把密钥写进本仓库。

## 安装

发布包已经预先构建，不需要放行构建脚本：

```powershell
npx @deepseek-ai/dsh@0.1.0-rc.6 plugin --profile web add https://github.com/shixiliya1/dsh-console-web-search/releases/download/v0.1.1/dsh-console-web-search-0.1.1.tgz
```

也可以固定到同一版本，从 GitHub 源码安装：

```powershell
npx @deepseek-ai/dsh@0.1.0-rc.6 plugin --profile web add github:shixiliya1/dsh-console-web-search#v0.1.1
```

源码安装会运行本包的 `prepare` 构建。pnpm 10 及更高版本默认阻止这一步；首次命令失败时，按照 DSH/pnpm 输出的提示，把它打印的精确包键加入该 profile 的 `pnpm-workspace.yaml` 中的 `allowBuilds`，然后重新运行同一条安装命令。

把 `web` 换成 `headless`，可以安装到一次性智能体 profile。升级时，使用新版本的 Release URL 重新运行 `plugin add`。卸载命令：

```powershell
npx @deepseek-ai/dsh@0.1.0-rc.6 plugin --profile web remove dsh-console-web-search
```

如果已全局安装 DSH，上述命令开头的 `npx @deepseek-ai/dsh@0.1.0-rc.6` 可以缩写为 `dsh`。

### 安装 Console Go 安全预设

插件安装完成后，从插件包中复制附带的安全预设：

```powershell
$presetSource = Join-Path $env:USERPROFILE '.dsh\profiles\web\node_modules\dsh-console-web-search\preset\console-safe'
$presetTarget = Join-Path $env:USERPROFILE '.dsh\.agent-presets\console-safe'

if (Test-Path -LiteralPath $presetTarget) {
  throw "预设已存在，未覆盖：$presetTarget"
}

Copy-Item $presetSource $presetTarget -Recurse
```

重启 DSH，然后新建会话。会话顶部应显示“Console Go 安全”。

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
