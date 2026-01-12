# Visual Instruction Browser Editor (VIBE)

## MVP概要
Visual Instruction Browser Editor (VIBE) は、HTMLを読み込み、ユーザーが選択した要素に対して自然言語の指示を入力し、LLMが生成した更新済みHTMLを適用する最小構成のブラウザ編集ツールです。MVPでは「HTMLインポート → 選択 → 指示入力 → LLM生成 → Undo」の最短フローに集中します。

## 主要フロー
1. **HTMLインポート**: ユーザーがHTML文字列を読み込み、iframe内にレンダリングします。
2. **選択**: iframe内の要素をクリックまたはドラッグ選択し、`data-vibeditor-id` で識別します。
3. **指示入力**: コマンドバーに自然言語で編集指示を入力します。
4. **LLM生成**: LLMへプロンプトを送信し、更新済みHTMLを受け取ります。
5. **Undo**: LLM適用前のHTMLスナップショットへ戻します。

## 最小構成のソースツリー
```
src/
  app-state.ts           # 状態管理（HTML、選択、履歴）
  iframe-interaction.ts  # iframeとpostMessage連携
  command-bar.tsx        # 指示入力UI
docs/
  index.html             # GitHub Pages用のデモUI
  style.css              # デモUIのスタイル
  app.js                 # デモの状態管理と簡易LLMシミュレーション
```

## postMessage通信スキーマ
iframe側（プレビュー）と外側（VIBEアプリ）は以下のpayloadで通信します。

### 送信例（iframe → 親）
```json
{
  "type": "vibe-editor",
  "action": "selection-changed",
  "selectedIds": ["A", "B"]
}
```

### フィールド
- `type`: 固定値 `"vibe-editor"`
- `action`: `"selection-changed"` など、イベント種別
- `selectedIds`: 選択中の `data-vibeditor-id`

## data-vibeditor-id 付与ルール
1. インポートHTML内の編集対象要素に `data-vibeditor-id` を付与する。
2. IDは単一アルファベットのラベルから開始し、順序は **A, B, C...** とする。
3. 26要素を超える場合は **AA, AB, AC...** のようにExcel列風に拡張する。
4. IDは**DOMの走査順**（例: depth-first, document order）で採番し、同一セッション内で安定させる。
5. LLMの出力HTMLには `data-vibeditor-id` を含めない（再インポート時に再付与）。

## LLM入出力仕様
### 入力（VIBE → LLM）
```json
{
  "source_full": "<html>...元のHTML...</html>",
  "target_outerHTMLs": ["<div ...>...", "<section ...>..."] ,
  "user_instruction": "ボタンのテキストを変更して"
}
```

- `source_full`: iframeに表示している全HTML
- `target_outerHTMLs`: 選択された要素のouterHTML配列
- `user_instruction`: ユーザーの自然言語指示

### 出力（LLM → VIBE）
```json
{
  "full_html": "<html>...更新後HTML...</html>"
}
```

- `full_html`: 変更後の全HTML

## サニタイズ仕様
LLM出力を適用する前に必ずサニタイズを行います。

1. **`<script>` タグ除去**: すべての `<script>` 要素を削除する。
2. **イベント属性の無害化**: `on*` 属性（`onclick`, `onload` など）を除去する。
3. **危険URLの排除**: `javascript:` や `data:` など、実行可能なスキームを除去する。
4. **`data-vibeditor-id` の除去**: 再付与するため、LLM出力から削除する。

## Undo仕様
- LLM適用前のHTMLスナップショットを履歴に積み、Undo時に1ステップ戻す。
- 連続Undoを許可し、履歴が空の場合は無操作とする。

## GitHub Pagesデプロイ
- GitHub Pagesは `docs/` ディレクトリをそのまま配信します。
- `.github/workflows/pages.yml` を追加済みのため、`main` ブランチにpushすると自動でデプロイされます。
- デモUIではHTMLインポート、選択、指示入力、LLM生成（簡易シミュレーション）、Undoの一連フローを確認できます。
