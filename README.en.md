# DSH Console Web Search

[中文](README.md) · [English](README.en.md) · [日本語](README.ja.md)

Provides a web-search tool name that Console Go accepts in DeepSeek Harness (DSH).

Console Go rejects a custom function named `web_search` with:

```text
invalid tools in request: custom function name "web_search" is reserved
```

This plugin disables the original tool and registers the same DSH search capability as `console_web_search`. It also includes a **Console Go Safe** agent preset so the standard preset does not add the reserved `web_search` tool again.

## How it works

```text
Console Go model
  → console_web_search
  → DSH ctx.web
  → configured DSH search provider
  → web sources
```

The plugin does not proxy model requests, read or save API keys, or install another search engine.

## Compatibility

- DSH `0.1.0-rc.6`
- Node.js `^22.19.0 || >=24.0.0`
- pnpm 11 for development and packaging

DSH is still in preview. The **Console Go Safe** preset is based on the standard preset in `0.1.0-rc.6`; inspect it again after upgrading DSH.

## Search credentials

Model chat and web search are separate paths. Console Go provides model inference, while this plugin still searches through DSH `ctx.web`.

DSH's default DeepSeek search provider requires a valid `DEEPSEEK_API_KEY`. Save it through DSH's model and credential settings, or set it in the environment that starts DSH. Never put the key in this repository.

## Installation

The release package is prebuilt and requires no build allowlist:

```powershell
npx @deepseek-ai/dsh@0.1.0-rc.6 plugin --profile web add https://github.com/shixiliya1/dsh-console-web-search/releases/download/v0.1.1/dsh-console-web-search-0.1.1.tgz
```

You can also install the pinned source version from GitHub:

```powershell
npx @deepseek-ai/dsh@0.1.0-rc.6 plugin --profile web add github:shixiliya1/dsh-console-web-search#v0.1.1
```

A source installation runs this package's `prepare` build. pnpm 10 and later block this by default. When the first command fails, add the exact package key printed by DSH/pnpm to `allowBuilds` in that profile's `pnpm-workspace.yaml`, then rerun the same command.

Replace `web` with `headless` to install into a one-shot agent profile. To upgrade, run `plugin add` again with the newer release URL. To uninstall:

```powershell
npx @deepseek-ai/dsh@0.1.0-rc.6 plugin --profile web remove dsh-console-web-search
```

If DSH is installed globally, `npx @deepseek-ai/dsh@0.1.0-rc.6` can be shortened to `dsh`.

### Install the Console Go Safe preset

After installing the plugin, copy the included safe preset from the package:

```powershell
$presetSource = Join-Path $env:USERPROFILE '.dsh\profiles\web\node_modules\dsh-console-web-search\preset\console-safe'
$presetTarget = Join-Path $env:USERPROFILE '.dsh\.agent-presets\console-safe'

if (Test-Path -LiteralPath $presetTarget) {
  throw "Preset already exists and was not overwritten: $presetTarget"
}

Copy-Item $presetSource $presetTarget -Recurse
```

Restart DSH and start a new conversation. The conversation header should show **Console Go Safe**.

## Usage

1. Start a new conversation in DSH.
2. Select the **Console Go Safe** preset.
3. Select a Console Go model.
4. For example, enter: `Use console_web_search to search for DeepSeek Harness and provide source links.`

The model's tool directory should contain `console_web_search` and should not contain `web_search`.

## Development

```powershell
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run build
pnpm pack
```

The plugin entry point is `src/index.ts`, the configuration patch is `cordis.patch.yml`, and the safe preset is in `preset/console-safe`.

## Publishing

See [PUBLISHING.md](./PUBLISHING.md) for the complete initial GitHub release flow and commands.

## License

[MIT](./LICENSE)
