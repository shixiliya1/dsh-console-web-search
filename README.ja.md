# DSH Console Web Search

[中文](README.md) · [English](README.en.md) · [日本語](README.ja.md)

DeepSeek Harness（DSH）で Console Go が受け入れられる Web 検索ツール名を提供します。

Console Go は `web_search` というカスタム関数を拒否し、次のエラーを返します。

```text
invalid tools in request: custom function name "web_search" is reserved
```

このプラグインは元のツールを無効化し、同じ DSH 検索機能を `console_web_search` として登録します。また、標準プリセットが予約済みの `web_search` を再度追加しないように、**Console Go Safe** agent preset を同梱します。

## 動作の仕組み

```text
Console Go モデル
  → console_web_search
  → DSH ctx.web
  → 設定済みの DSH 検索プロバイダー
  → Web ソース
```

このプラグインはモデルリクエストのプロキシ、API キーの読み取り・保存、別の検索エンジンのインストールを行いません。

## 互換性

- 公式 source tag からビルドした DSH `dsh-v0.1.3-alpha.1`
- Node.js `^22.19.0 || >=24.0.0`
- 開発とパッケージングには pnpm 11

**Console Go Safe** preset は `dsh-v0.1.3-alpha.1` の標準 preset に同期済みで、モデル向けの `web_search` だけを `console_web_search` に置き換えます。

## 検索認証情報

モデルとのチャットと Web 検索は別の経路です。Console Go はモデル推論を提供し、このプラグインの検索は引き続き DSH `ctx.web` を通ります。

DSH の既定 DeepSeek 検索プロバイダーには有効な `DEEPSEEK_API_KEY` が必要です。DSH のモデル・認証情報設定で保存するか、DSH を起動する環境で設定してください。キーをこのリポジトリに書き込まないでください。

## インストール

`dsh-v0.1.3-alpha.1` は npm に公開されていません。公式 source tag の checkout で `pnpm install` を完了してから実行してください。Release パッケージは事前ビルド済みです。

```powershell
pnpm dsh plugin --profile web add https://github.com/shixiliya1/dsh-console-web-search/releases/download/v0.2.0/dsh-console-web-search-0.2.0.tgz
```

GitHub からタグに固定したソース版もインストールできます。

```powershell
pnpm dsh plugin --profile web add github:shixiliya1/dsh-console-web-search#v0.2.0
```

ソースインストールではこのパッケージの `prepare` ビルドが実行されます。pnpm 10 以降では既定でブロックされます。最初のコマンドが失敗した場合、DSH/pnpm が表示した正確なパッケージキーを、その profile の `pnpm-workspace.yaml` の `allowBuilds` に追加してから、同じコマンドを再実行してください。

一回限りの agent profile に入れる場合は `web` を `headless` に置き換えます。更新時は新しい Release URL で `plugin add` を再実行します。アンインストール:

```powershell
pnpm dsh plugin --profile web remove dsh-console-web-search
```

`pnpm dsh` は公式 `dsh-v0.1.3-alpha.1` source checkout から実行してください。

### Console Go Safe preset のインストール

プラグインのインストール後、パッケージに含まれる安全 preset をコピーします。

```powershell
$presetSource = Join-Path $env:USERPROFILE '.dsh\profiles\web\node_modules\dsh-console-web-search\preset\console-safe'
$presetTarget = Join-Path $env:USERPROFILE '.dsh\.agent-presets\console-safe'

if (Test-Path -LiteralPath $presetTarget) {
  throw "Preset already exists and was not overwritten: $presetTarget"
}

Copy-Item $presetSource $presetTarget -Recurse
```

DSH を再起動して新しい会話を開始します。会話ヘッダーに **Console Go Safe** と表示されるはずです。

## 使い方

1. DSH で新しい会話を開始します。
2. **Console Go Safe** preset を選択します。
3. Console Go モデルを選択します。
4. 例: `console_web_search を使って DeepSeek Harness を検索し、出典リンクを提示してください。`

モデルに渡されるツール一覧には `console_web_search` があり、`web_search` はないはずです。

## 開発

```powershell
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run build
pnpm pack
```

プラグインのエントリーポイントは `src/index.ts`、設定パッチは `cordis.patch.yml`、安全 preset は `preset/console-safe` にあります。

## 公開

最初の GitHub Release の完全な手順とコマンドは [PUBLISHING.md](./PUBLISHING.md) を参照してください。

## ライセンス

[MIT](./LICENSE)
