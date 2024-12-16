# User interface Flow Markup Language (UFML) Generator

UFMLジェネレーターは、シンプルなテキストベースの画面遷移定義から、美しくインタラクティブな可視化を実現するオープンソースのアプリケーションです。

![UFML Example](/docs/images/ufml-image.png)

## ✨ 主な機能

- **シンプルなマークアップ言語**: 直感的なUFML構文による画面遷移の定義
- **PSAU対応**: 非機能要件の標準化された記述
- **リアルタイムプレビュー**: 入力と同時に視覚化を更新
- **カスタム要素タイプ**:
  - `T`: テキスト要素
  - `E`: 編集可能フィールド
  - `B: ボタン要素
  - `A`: アクション
  - `O`: その他のシステム要素
- **スマートな接続**: 自動的な接続経路とラベル付き遷移
- **PDF出力**: 図の書き出し機能

## 🚀 はじめ方

### 必要条件

- Node.js 14.x 以降
- npm または yarn
- Git

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/ufml.git

# プロジェクトディレクトリへ移動
cd ufml

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## 📝 UFML構文

UFML は直感的な構文で画面遷移を定義します：

```
[画面名]              # 画面の定義
//P: パフォーマンス    # パフォーマンス要件
//S: セキュリティ     # セキュリティ要件
//A: 可用性          # 可用性要件
//U: ユーザビリティ   # ユーザビリティ要件
T テキスト要素        # テキスト要素
E 編集フィールド      # 編集可能フィールド
B ボタン名           # ボタン
A アクション名        # アクション
--                   # 区切り線
=>                  # 遷移
={条件}=>            # 条件付き遷移
(ユースケース)        # ユースケース記述
```

### 例

```
[商品一覧]
//P: 一覧表示1秒以内
//S: 参照権限必須
//A: 99.9%稼働
//U: ソート機能必須
--
O 商品テーブル
B 検索ボタン
A 商品選択 ={在庫あり}=> 商品詳細
```

## 🛠️ 技術スタック

- [Next.js](https://nextjs.org/) - Reactフレームワーク
- [React Flow](https://reactflow.dev/) - フロー視覚化
- [TailwindCSS](https://tailwindcss.com/) - スタイリング
- [html2canvas](https://html2canvas.hertzen.com/) & [jsPDF](https://parall.ax/products/jspdf) - PDF出力

## 🤝 コントリビューション

コントリビューションを歓迎します！プルリクエストを自由に提出してください。大きな変更の場合は、まずissueを開いて変更内容について議論させていただけると幸いです。

1. プロジェクトをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/新機能`)
3. 変更をコミット (`git commit -m '新機能を追加'`)
4. ブランチにプッシュ (`git push origin feature/新機能`)
5. プルリクエストを開く

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルをご覧ください。

## 💡 想定ユースケース

1. PRDレビュー時
- 画面構成の確認
- 非機能要件の定義
- 遷移パターンの検証

2. デザインフェーズ
- UI要素の洗い出し
- 画面遷移の可視化
- 要件の具体化

3. 開発フェーズ
- 実装仕様の確認
- テスト要件の抽出
- ドキュメントの生成

## 💡 UFMLについて

UFMLは、効率的な画面遷移設計を実現するために開発された専用のマークアップ言語です。
その設計思想や詳細については、以下のドキュメントをご覧ください：

- [UFMLの設計思想](./docs/CONCEPT.md)
