# Visual Instruction Browser Editor (VIBE)

## MVP概要
Visual Instruction Browser Editor (VIBE) は、HTMLソースを解析し、全画面プレビュー上で「視覚的な選択」と「自然言語による指示」を行うことでコードを自動改変するブラウザベースのエディタです。MVPでは「選択（単一/複数） + LLM全体生成（HTML全文置換） + Undo」に集中し、没入型（Immersive）UIで操作できる体験を優先します。

## 主要フロー
1. **HTMLインポート**: 起動時モーダルでHTMLソースを入力し、iframeの `srcdoc` にレンダリングします。
2. **没入型プレビュー**: 管理UIを排除し、ページ全体を全画面表示で確認します。
3. **選択**: クリック/タップでトグル選択し、ホバー時に即座にハイライト表示します。
4. **指示入力**: 画面下部のフローティング・コマンドバーで自然言語指示を入力します。
5. **LLM生成**: LLMへプロンプトを送信し、更新済みHTML全文を受け取ります。
6. **Undo**: LLM適用前のHTMLスナップショットへ戻します。

## 最小構成のソースツリー
```
src/
  app-state.ts           # 状態管理（HTML、選択、履歴）
  iframe-interaction.ts  # iframeとpostMessage連携
  command-bar.tsx        # 指示入力UI
docs/
  index.html             # GitHub Pages用の没入型デモUI
  style.css              # デモUIのグラスモーフィズム調整
  app.js                 # デモの状態管理と簡易LLMシミュレーション
```

## postMessage通信スキーマ
iframe側（プレビュー）と親（VIBEアプリ）は以下のpayloadで通信します。

### 送信例（iframe → 親）
```json
{
  "type": "selected",
  "selectionType": "multi",
  "targets": [
    { "label": "A", "outerHTML": "<div class=\"card\" data-vibeditor-id=\"A\">...</div>", "tagName": "div" },
    { "label": "B", "outerHTML": "<li data-vibeditor-id=\"B\">...</li>", "tagName": "li" }
  ]
}
```

### フィールド
- `type`: 固定値 `"selected"`
- `selectionType`: `"single"` / `"multi"`
- `targets`: 選択中の要素情報（label, outerHTML, tagName）

## data-vibeditor-id 付与ルール
1. 選択された要素に一時的な `data-vibeditor-id` を付与する。
2. ラベルは **A, B, C...** の順で付与し、選択順を保持する。
3. 選択解除で空いたラベルは再利用しない。
4. 選択が0件になった時点で、次の選択は再び **A** から付与する。
5. 26要素を超える場合は **AA, AB, AC...** のようにExcel列風に拡張する。
6. LLMの出力HTMLには `data-vibeditor-id` を含めない（再インポート時に再付与）。
7. 選択中はハイライト枠と一体化した付箋バッジでラベルを表示する。

## LLM入出力仕様
### 入力（VIBE → LLM）
```json
{
  "source_full": "<html>...元のHTML...</html>",
  "target_outerHTMLs": ["<div ...>...", "<section ...>..."] ,
  "user_instruction": "ボタンのテキストを変更して",
  "model": "<llm-model-id>"
}
```

- `source_full`: iframeに表示している全HTML
- `target_outerHTMLs`: 選択された要素のouterHTML配列
- `user_instruction`: ユーザーの自然言語指示
- `model`: 利用するLLMモデル識別子

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
5. **バッジ等の補助要素除去**: ラベル表示用に挿入した要素があれば削除する。

## Undo仕様
- LLM適用前のHTMLスナップショットを履歴に積み、Undo時に1ステップ戻す。
- 連続Undoを許可し、履歴が空の場合は無操作とする。

## GitHub Pagesデプロイ
- GitHub Pagesは `docs/` ディレクトリをそのまま配信します。
- `.github/workflows/pages.yml` を追加済みのため、`main` ブランチにpushすると自動でデプロイされます。
- デモUIでは没入型プレビュー、選択トグル、フローティング・コマンドバー、LLM生成（簡易シミュレーション）、Undoの一連フローを確認できます。
