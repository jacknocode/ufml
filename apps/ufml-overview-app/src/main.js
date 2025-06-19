// ドキュメントデータ（実際のファイル内容をここに埋め込み）
const documents = {
  'README.md': `# User interface Flow Markup Language (UFML) Editor

UFMLエディターは、AI/LLM連携を前提とした軽量マークアップ言語UFMLから、インタラクティブな画面遷移図を生成するオープンソースのアプリケーションです。

## 🎯 UFMLとは

UFML (User interface Flow Markup Language) は、アプリケーションの画面遷移やUI要求、さらには関連する非機能要求を、一貫性のあるテキストベースで記述するために設計された軽量マークアップ言語です。

AI/LLMとの連携を前提に、UI開発プロセスを変革することを目指して設計されました。UI開発プロセスの中では中間言語としての役割を果たします。

### 主な目的

- **UI要件と非機能要件の統合管理**: 機能と非機能が一体となった要求管理を実現
- **チーム内コラボレーションの強化**: デザイナー、エンジニア、PdM、QA間の認識統一
- **AI/LLMによるDX・UX最大化**: テキストベース構造によるAI連携の最適化

## ✨ 主な機能

- **シンプルなマークアップ言語**: 直感的なUFML構文による画面遷移の定義
- **PSAU対応**: 非機能要件（パフォーマンス、セキュリティ、可用性、ユーザビリティ）の標準化された記述
- **リアルタイムプレビュー**: 入力と同時に視覚化を更新
- **AI/LLM最適化**: LLMが理解しやすい構造化テキスト形式
- **カスタム要素タイプ**:
  - \`T\`: テキスト要素（静的なテキスト、ラベル、見出し）
  - \`E\`: 編集可能フィールド（入力フィールド、チェックボックス等）
  - \`B\`: ボタン要素（クリック操作可能な要素）
  - \`O\`: その他のシステム要素（テーブル、リスト、画像等）
- **インタラクション定義**: 条件付き遷移とユースケース呼び出し
- **スマートな接続**: 自動的な接続経路とラベル付き遷移

## 🚀 はじめ方

### 必要条件

- Node.js 20.x 以降
- npm または yarn
- Git

### インストール

\`\`\`bash
# リポジトリのクローン
git clone https://github.com/yourusername/ufml.git

# プロジェクトディレクトリへ移動
cd ufml/apps/ufml-editor-app

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
\`\`\`

## 📝 UFML構文

UFML は直感的な構文で画面遷移を定義します：

### ブロック定義

\`\`\`
[画面名]                    # 画面ブロック
(ユースケース名)            # ユースケースブロック
\`\`\`

### UI要素

\`\`\`
T テキスト要素              # テキスト要素
E 編集フィールド            # 編集可能フィールド
B ボタン名                 # ボタン
O その他の要素              # その他のUIコンポーネント
\`\`\`

### PSAUコメント（非機能要件）

\`\`\`
//P: パフォーマンス要件      # パフォーマンス要件
//S: セキュリティ要件       # セキュリティ要件
//A: 可用性要件            # 可用性要件
//U: ユーザビリティ要件     # ユーザビリティ要件
\`\`\`

### インタラクション

\`\`\`
--                         # 区切り線
A インタラクション説明 => 遷移先           # 基本遷移
A インタラクション説明 ={条件}=> 遷移先    # 条件付き遷移
\`\`\`

### 基本例

\`\`\`
[ユーザー一覧]
//P: 一覧表示1秒以内
//S: 参照権限必須
//A: 99.9%稼働
//U: ソート機能必須

T ユーザーテーブル
O フィルター
B 新規追加
--
A ユーザー作成 => ユーザー作成画面

[ユーザー作成画面]
//P: レスポンス0.5秒以内
//S: 入力値検証必須

E ユーザー名
E メールアドレス
B 保存
B キャンセル
--
A 登録 => ユーザー一覧
A キャンセル => ユーザー一覧
\`\`\`

### 条件付きアクション + ユースケース例

\`\`\`
[管理ダッシュボード]
//P: 1秒以内
//S: role=admin

T 管理メニュー一覧
O フィルター
B 在庫管理
B 注文管理
--
A 在庫操作 ={在庫>=1}=> 在庫引き当て
A 受注処理 => 注文一覧

(在庫引き当て)
//P: 処理時間3秒以内
//S: トランザクション保証
\`\`\`

## 🛠️ 技術スタック

- [Next.js](https://nextjs.org/) - Reactフレームワーク
- [React Flow](https://reactflow.dev/) - フロー視覚化
- [TailwindCSS](https://tailwindcss.com/) - スタイリング

## 💡 想定ユースケース

### 基本的な活用シーン

1. **画面設計の厳密な要件定義**
   - UI構成・遷移フローの文書化
   - 条件付き遷移の明示
   - PSAU等の非機能要件の記録と管理

2. **PRDレビュー時**
   - 画面構成の確認
   - 非機能要件の定義
   - 遷移パターンの検証

3. **デザインフェーズ**
   - UI要素の洗い出し
   - 画面遷移の可視化
   - 要件の具体化

4. **開発フェーズ**
   - 実装仕様の確認
   - テスト要件の抽出
   - ドキュメントの生成

### AI/LLM活用ユースケース

1. **要求仕様書やPRDからUFMLを自動生成**
   - 自然言語の要件からUFML形式への変換
   - 構造化された仕様書の自動作成

2. **UFMLから適合したUIコンポーネントの自動選定**
   - UI要素タイプに基づくコンポーネント推奨
   - デザインシステムとの自動マッピング

3. **UFMLからUIコードを自動生成**
   - React、Vue、Angular等のフレームワーク対応
   - 非機能要件を考慮したコード生成

4. **既存コードのUFML化による軽量保管**
   - 既存のReact、Vue、Angular等のフロントエンドコードからUFMLへの自動変換
   - 複雑なコードベースから画面構成、遷移ロジック、UI要素を抽出してUFML形式で軽量保管
   - レガシーシステムの画面仕様をUFMLとして再構築し、保守性を向上

5. **仕様レビューの自動化**
   - 矛盾検出、複雑度評価
   - UXアンチパターンの指摘

6. **UFMLエディターによる多ロールコラボレーション**
   - 共同編集による複数ステークホルダーの同時作業
   - 変更履歴管理

7. **テストケース・テストデータの自動生成**
   - インタラクションベースのテストシナリオ作成
   - 条件分岐を考慮したテストケース生成

## 🎯 UFMLのメリット

### 1. 開発チームとAI間の認識統一
UI構造、インタラクションロジック、非機能要求(PSAU)を単一のテキストファイルに集約し、デザイナー、エンジニア、PM、QA、そしてAI(LLM)にとっても共通言語として機能します。

### 2. 非機能要求(PSAU)の設計早期組み込みと管理
パフォーマンス、セキュリティ、可用性、ユーザビリティといった非機能要求を、機能仕様と同時に定義・管理できます。

### 3. AI/LLM連携による開発体験(DX)と品質(UX)の向上
LLMが理解しやすい構造化テキスト形式により、AIによる高精度な分析・生成支援を実現します。

### 4. 仕様変更への追従性と保守性の向上
仕様定義(UFML)と実装(コード)を分離し、UFMLの修正を起点としたLLMによるコード再生成や影響範囲分析を活用できます。

## ⚠️ 課題と考慮事項

### 1. 大規模プロジェクトでのスケーラビリティ
画面数や機能が多い場合のファイル分割、モジュール化の方法について事前の運用ルール整備が必要です。

### 2. 導入・学習コスト
チームメンバー全員の習熟と、構文チェッカー、エディタ支援、LLM連携ツールなどの支援ツール整備が望ましいです。

### 3. 記述の明確性と一貫性の維持
命名規則、記述スタイルの統一により、人間とLLM双方の理解精度を向上させる必要があります。

### 4. 自動化への過信の回避
LLMによる生成結果は必ず人間の専門家によるレビューと妥当性判断が不可欠です。

## 🤝 コントリビューション

コントリビューションを歓迎します！プルリクエストを自由に提出してください。大きな変更の場合は、まずissueを開いて変更内容について議論させていただけると幸いです。

1. プロジェクトをフォーク
2. フィーチャーブランチを作成 (\`git checkout -b feature/新機能\`)
3. 変更をコミット (\`git commit -m '新機能を追加'\`)
4. ブランチにプッシュ (\`git push origin feature/新機能\`)
5. プルリクエストを開く

## 📄 ライセンス

このプロジェクトは **デュアルライセンス構造** を採用しています：

## 🔓 UFML仕様 = MIT License（完全オープン）
- **対象**: UFML記法・構文・概念
- **ライセンス**: MIT License（商用利用も自由）
- **著作権**: Copyright (c) 2025 UFML Project
- **詳細**: [LICENSE](./LICENSE) ← **メインライセンス**
- **用途**: UFML仕様に基づく独自エディター・パーサー・ツールの開発

## 🔒 UFML Editor = カスタムライセンス（商用制限付き）
- **対象**: このエディターの実装コード・Webアプリ
- **ライセンス**: 商用利用制限付きカスタムライセンス
- **著作権**: Copyright (c) 2024 Kazuki Ikeda
- **詳細**: [LICENSE_EDITOR.md](./LICENSE_EDITOR.md)
- **制限**: 製品化・再販は要ライセンス（内部利用は可）

## 📋 利用シーン別ガイド

| やりたいこと | 参照するライセンス | 制限 |
|------------|------------------|------|
| **UFML仕様で独自ツール開発** | \`LICENSE\` | なし（MIT） |
| **エディターを企業内で利用** | \`LICENSE_EDITOR.md\` | なし |
| **エディターコードで商用製品開発** | \`LICENSE_EDITOR.md\` | 要商用ライセンス |

**重要**: UFML仕様（LICENSE）は完全オープン、エディター実装（LICENSE_EDITOR.md）は商用制限付き

## 📚 詳細ドキュメント

UFMLの設計思想や詳細な記述ルールについては、以下のドキュメントをご覧ください：

- [UFMLの設計思想と背景](./docs/CONCEPT.md)`,

  'docs/CONCEPT.md': `# UFMLの設計思想と背景

## UFMLとは

UFML (User interface Flow Markup Language) は、アプリケーションの画面遷移やUI要求、さらには関連する非機能要求を、一貫性のあるテキストベースで記述するために設計された軽量マークアップ言語です。

AI/LLMとの連携を前提に、UI開発プロセスを変革することを目指して設計されました。UI開発プロセスの中では中間言語としての役割を果たします。

## なぜUFMLが必要か

PRDからUI設計に移行する際、以下のような課題が発生しています：

### 従来の課題

1. **PDMごとの記述の差異**
   - 画面遷移の定義が曖昧
   - 非機能要件の記述にばらつき
   - 要件の詳細度の違い

2. **手戻りの発生**
   - 画面数の見積もり誤り
   - 遷移パターンの認識違い
   - 非機能要件の後付け

3. **ステークホルダー間の認識齟齬**
   - デザイナー、エンジニア、PdM、QA間での仕様理解の違い
   - AI/LLMとの連携における解釈の不一致

## UFMLの目的

### 1. UI要件と非機能要件の統合管理

個々の画面（node）が持つべきUI要素、表示テキスト、インタラクションだけでなく、セキュリティ要件、パフォーマンス目標といった非機能要件も、UFMLの構造内で関連付けて記述できます。これにより、機能と非機能が一体となった要求管理を実現します。

### 2. チーム内コラボレーションの強化と認識統一

デザイナー、エンジニア、PdM、QAなど、多様なステークホルダーがUFMLという共通言語を用いることで、仕様に関する認識の齟齬を最小限に抑え、円滑なコミュニケーションを促進します。

### 3. AI/LLMによる開発体験(DX)とユーザー体験(UX)の最大化

UFMLの核心的な価値は、そのテキストベースの構造がAI、特にLLMと極めて高い親和性を持つ点にあります。LLMが理解しやすい形式でUI仕様を記述することで、以下のようなAIを活用した開発体験 (AI-Driven Developer Experience) の革新と、その先にある高品質なユーザー体験 (User Experience) の実現を強力に支援します。

## UFML記述構造

### ブロック定義

UFMLドキュメントは、主に2種類のブロックで構成されます：

#### 画面ブロック \`[画面名]\`
- アプリケーションの特定の画面やUIの状態を定義
- 角括弧 \`[]\` で一意の画面名を囲んで表現
- 内部には「UI要素」と「アクション」が含まれる
- 例: \`[ログイン画面]\`, \`[商品詳細ページ]\`

#### ユースケースブロック \`(ユースケース名)\`
- 画面とは直接紐付かない、特定のビジネスロジック、バックエンド処理、再利用可能なプロセスなどを定義
- 丸括弧 \`()\` で一意のユースケース名を囲んで表現
- 画面ブロックのアクションから呼び出すことが可能
- 例: \`(ユーザー認証)\`, \`(在庫引き当て処理)\`

### UI要素（画面ブロック内）

画面ブロック内には、その画面を構成するUI要素を記述します。各要素は行頭の記号で種類を示します：

- **T (Text)**: 画面に表示される静的なテキスト、ラベル、見出しなど
  - 例: \`T ようこそ、ゲストさん\`, \`T 商品名\`
- **E (Editable)**: ユーザーが入力や編集を行うフィールド（テキスト入力、チェックボックス、ラジオボタン、ドロップダウンなど）
  - 例: \`E メールアドレス\`, \`E 利用規約に同意する\`
- **B (Button)**: ユーザーがクリックなどの操作を行うボタン要素。アクションの起点となることが多い
  - 例: \`B ログイン\`, \`B 検索実行\`
- **O (Other)**: 上記（T, E, B）以外の、より複雑なUIコンポーネントや要素（テーブル、リスト、画像、カスタムコンポーネントなど）
  - 例: \`O 商品一覧テーブル\`, \`O ユーザーアバター画像\`

### インタラクションと遷移

画面ブロック内で、ユーザーの操作やイベントによって引き起こされる主要な動作を「インタラクション」として定義します：

- **区切り**: UI要素の記述パートの後、\`--\` (ハイフン2つ) の行で区切ってインタラクションパートを開始
- **基本構文**: \`A [インタラクション説明] => 遷移先\`
- **条件付き構文**: \`A [インタラクション説明] ={条件}=> 遷移先\`

#### 構文の詳細
- \`A\`: インタラクション定義の開始を示す
- \`[インタラクション説明]\`: そのインタラクションが何を行うかの簡潔な説明
- \`=>\`: 遷移または呼び出しを示す
- \`={条件}=>\`: 特定の条件が満たされた場合のみ遷移・呼び出しが発生することを示す

### PSAUコメント（非機能要件）

パフォーマンス(P)、セキュリティ(S)、可用性(A)、ユーザビリティ(U) に関する非機能要件や注釈を記述するためのコメントです。

- **記法**: 行頭に \`//\` をつけ、続けて \`P:\`, \`S:\`, \`A:\`, \`U:\` のいずれかと要件内容を記述
- **記述場所**: ブロックレベル（画面ブロック \`[...]\` やユースケースブロック \`(...)\` の定義直後）でのみ記述可能

#### 例
\`\`\`
[管理者ダッシュボード]
//P: load_time <= 2s
//S: role=admin
//U: accessibility=AAA

T ユーザーリスト
O 操作ログテーブル
B 設定変更
--
A 設定変更 => 設定画面
\`\`\`

## UFMLのメリット

### 1. 開発チームとAI間の認識統一
UI構造、インタラクションロジック、非機能要求(PSAU)を単一のテキストファイルに集約します。これにより、UFMLはデザイナー、エンジニア、PM、QA、そしてAI(LLM)にとっても共通言語となり、信頼できる唯一の情報源 (Single Source of Truth - SSOT)として機能します。

### 2. 非機能要求(PSAU)の設計早期組み込みと管理
パフォーマンス(P)、セキュリティ(S)、可用性(A)、ユーザビリティ(U)といった非機能要求を、画面ブロックやユースケースブロックレベルで、機能仕様と同時に定義・管理できます。

### 3. AI/LLM連携による開発体験(DX)と品質(UX)の向上
LLMが理解しやすい構造化テキスト形式は、AIによる高精度な分析・生成支援を可能にします。仕様レビューの自動化、テストケース・テストデータの自動生成、ドキュメント骨子作成、UIフレームワークに応じたコード雛形生成などを実現します。

### 4. 仕様変更への追従性と保守性の向上
仕様定義(UFML)と実装(コード)を分離することで、関心事を分離します。UFMLの修正を起点として、LLMによるコードの再生成や影響範囲の分析を活用することで、仕様変更への対応コストを削減し、仕様と実装間の乖離リスクを低減します。

## 想定ユースケース

### 基本的な活用シーン
- 画面設計（UI構成・遷移フロー）の厳密な要件定義と文書化
- 条件付き遷移（バリデーション／セキュリティ条件／表示制御）の明示
- PSAU（パフォーマンス、セキュリティ、可用性、ユーザビリティ）等の非機能要件の記録と管理

### AI/LLM活用ユースケース
- 要求仕様書やPRDからUFMLを自動生成
- UFMLから適合したUIコンポーネントの自動選定
- UFMLからUIコードを自動生成

### プロジェクトフェーズ別活用

#### PRDレビュー時
\`\`\`
[ログイン画面]
//P: レスポンス0.5秒以内
//S: 多要素認証必須
//A: 24/365稼働
//U: エラー表示は日本語

E ユーザーID
E パスワード
B ログイン
--
A ログイン認証 ={認証成功}=> メインメニュー
A ログイン認証 ={認証失敗}=> ログイン画面
\`\`\`

#### デザインレビュー時
- 非機能要件の確認
- 画面要素の過不足チェック
- 遷移パターンの検証

## UFMLの課題と考慮事項

### 1. 大規模プロジェクトでのスケーラビリティ
画面数や機能が非常に多い場合、単一または少数のUFMLファイルが長大化し、可読性や管理性が低下する懸念があります。

**対策**: プロジェクト開始前に、ファイル分割の基準、モジュール化の方法、共通定義の参照・インクルード方法といった運用ルールや規約を整備することが推奨されます。

### 2. 導入・学習コストとツールエコシステム
チームメンバー全員がUFMLの記法、ベストプラクティス、そしてその背景にある設計思想に習熟するには一定の時間が必要です。

### 3. 記述の明確性と一貫性の維持
インタラクション説明の命名規則、条件式の記述スタイル、ブロックや要素名の付け方などに一貫性がない場合、人間にとってもLLMにとっても解釈が困難になり、可読性や保守性が低下します。

### 4. 自動化への過信と人間によるレビューの重要性
LLMによるコード生成や分析は開発を加速させる強力な手段ですが、万能ではありません。生成されたコード、テストケース、ドキュメント、分析結果等は、必ず人間の専門家がレビューし、その妥当性を判断・修正するプロセスが不可欠です。

## 期待される効果

### 1. コミュニケーションの改善
- PDMとデザイナー間の認識統一
- 開発チームとの要件共有
- AI/LLMとの効果的な連携
- レビューの効率化

### 2. 品質の向上
- 非機能要件の見落とし防止
- 一貫性のある実装
- テスト要件の明確化
- AI支援による品質向上

### 3. 工数の削減
- 手戻りの減少
- レビュー時間の短縮
- ドキュメント作成の効率化
- AI活用による開発速度向上

## UFMLの未来図

### AI駆動開発の実現

UFMLは、AI/LLMとの連携により以下のような開発体験の変革を目指しています：

#### 1. 要求からのUFMLの自動生成
- **自然言語要求の構造化**: PRDや要求仕様書から自動的にUFML形式への変換
- **要件の網羅性チェック**: AIによる要件の抜け漏れ検出と補完提案
- **非機能要件の自動推論**: 機能要件からPSAU要件の自動生成と提案

#### 2. UFMLから適用可能なデザインシステムの自動選定
- **コンポーネントマッピング**: UI要素タイプ（T/E/B/O）から最適なデザインシステムコンポーネントの自動選定
- **デザインパターン推奨**: 画面構成とインタラクションパターンに基づく最適なUIパターンの提案
- **アクセシビリティ対応**: PSAU要件に基づく自動的なアクセシビリティ対応コンポーネントの選定

#### 3. 既存コードのUFML化による軽量保管
- **リバースエンジニアリング**: 既存のReact、Vue、Angular等のフロントエンドコードからUFMLへの自動変換
- **仕様の抽出と保管**: 複雑なコードベースから画面構成、遷移ロジック、UI要素を抽出してUFML形式で軽量保管
- **レガシーシステムの文書化**: 古いシステムの画面仕様をUFMLとして再構築し、保守性を向上

#### 4. UFMLエディターによる多ロールコラボレーション
- **リアルタイム共同編集**: 複数のステークホルダーが同時にUFMLを編集・レビュー可能
- **ロール別ビュー**:
  - **PdM視点**: 要件の網羅性、ビジネスロジックの整合性確認
  - **デザイナー視点**: UI要素の配置、遷移フローの可視化、デザインシステムとの整合性
  - **エンジニア視点**: 実装可能性、技術的制約、非機能要件の妥当性
  - **QA視点**: テストケース抽出、エッジケース特定、品質要件の確認
- **コメント・レビュー機能**: UFML要素単位でのコメント、承認フロー、変更履歴管理
- **自動通知システム**: 変更時の関係者への通知、レビュー依頼の自動化

#### 5. 統合開発環境の構築
- **リアルタイム検証**: UFML記述時のリアルタイムな構文チェックと整合性検証
- **プロトタイプ自動生成**: UFMLから動作するプロトタイプの即座な生成
- **テスト自動化**: インタラクション定義からE2Eテストシナリオの自動生成

### 開発プロセスの変革

\`\`\`
従来: 要求 → 設計 → 実装 → テスト
      ↓     ↓     ↓     ↓
     PdM → Designer → Engineer → QA
     (順次引き継ぎ、認識齟齬のリスク)

未来: 要求 → UFML → AI支援による並行開発
      ↓
      UFMLエディター上での同時コラボレーション
      ↓
      PdM + Designer + Engineer + QA
      (リアルタイム共同作業、認識統一)
      ↓
      設計・実装・テストの同時進行
\`\`\`

#### コラボレーションの具体例

**要件定義フェーズ**:
- PdMがUFMLで要件を記述
- デザイナーがUI要素の妥当性をリアルタイムでレビュー
- エンジニアが技術的制約をコメント
- QAがテスト観点での懸念を指摘

**設計フェーズ**:
- デザイナーがUFML要素をデザインシステムにマッピング
- エンジニアが実装方針をUFMLコメントで共有
- PdMがビジネス要件との整合性を確認
- 全員がリアルタイムで変更を確認・承認

## なぜAIが可読しやすいのか

### UFMLの構造化された記法の優位性

#### 従来のMarkdown記述との比較

**従来のMarkdown記述例:**
\`\`\`markdown
## ログイン画面
ユーザーはメールアドレスとパスワードを入力します。
ログインボタンを押すと認証が行われ、成功した場合はメインメニューに遷移します。
失敗した場合はエラーメッセージを表示します。

### 非機能要件
- レスポンス時間は1秒以内
- セキュリティ要件として多要素認証が必要
\`\`\`

**UFML記述例:**
\`\`\`
[ログイン画面]
//P: response_time <= 1s
//S: multi_factor_auth=required

E メールアドレス
E パスワード
B ログイン
--
A ログイン認証 ={認証成功}=> メインメニュー
A ログイン認証 ={認証失敗}=> ログイン画面
\`\`\`

#### AIにとっての可読性の違い

##### 1. **構造の明確性**
- **Markdown**: 自然言語による曖昧な表現、構造の推測が必要
- **UFML**: 明確な記号体系（T/E/B/O、//P/S/A/U、A =>）による構造化

##### 2. **要素の識別精度**
- **Markdown**: 「ボタン」「入力フィールド」などの自然言語から要素タイプを推測
- **UFML**: \`B ログイン\`、\`E メールアドレス\` など、記号による明確な要素タイプ定義

##### 3. **条件分岐の表現**
- **Markdown**: 「成功した場合は...、失敗した場合は...」という自然言語による条件表現
- **UFML**: \`={認証成功}=>\`、\`={認証失敗}=>\` による構造化された条件表現

##### 4. **非機能要件の関連付け**
- **Markdown**: 別セクションでの記述、画面との関連性が曖昧
- **UFML**: \`//P:\`、\`//S:\` による画面ブロック内での直接的な関連付け

##### 5. **パースの容易性**
- **Markdown**: 自然言語処理が必要、文脈理解が困難
- **UFML**: 正規表現やシンプルなパーサーで確実に解析可能

#### LLMによる処理精度の向上

UFMLの構造化された記法により、LLMは以下の処理を高精度で実行できます：

1. **要素抽出**: \`T\`/\`E\`/\`B\`/\`O\` による確実な要素タイプ識別
2. **遷移解析**: \`A [説明] => [遷移先]\` による明確な遷移関係の把握
3. **条件分析**: \`={条件}=>\` による条件分岐の正確な理解
4. **要件マッピング**: \`//P:\`/\`//S:\`/\`//A:\`/\`//U:\` による非機能要件の確実な抽出

この構造化により、LLMは推測や解釈に頼ることなく、確実で一貫性のある分析・生成を実現できます。`,

  'llms.txt': `# UFML (User interface Flow Markup Language) - LLM Learning Guide

## Overview

UFML is a lightweight markup language designed for describing application screen transitions, UI requirements, and non-functional requirements in a structured, text-based format optimized for AI/LLM collaboration.

### Key Characteristics
- Text-based structured format for UI flow definition
- Integration of functional and non-functional requirements
- Optimized for LLM parsing and generation
- Serves as an intermediate language in UI development processes

## Core Syntax Rules

### 1. Block Definitions

#### Screen Block: \`[Screen Name]\`
- Defines a specific screen or UI state
- Enclosed in square brackets \`[]\`
- Contains UI elements and interactions
- Example: \`[Login Screen]\`, \`[Product Detail Page]\`

#### Use Case Block: \`(Use Case Name)\`
- Defines business logic or backend processes
- Enclosed in parentheses \`()\`
- Can be called from screen block actions
- Example: \`(User Authentication)\`, \`(Inventory Allocation)\`

### 2. UI Elements (Screen Blocks Only)

UI elements are defined with single-letter prefixes:

#### T - Text Elements
- Static text, labels, headings
- Example: \`T Welcome Message\`, \`T Product Name\`

#### E - Editable Fields
- Input fields, checkboxes, dropdowns, radio buttons
- Example: \`E Email Address\`, \`E Password\`, \`E Terms Agreement\`

#### B - Buttons
- Clickable elements that trigger actions
- Example: \`B Login\`, \`B Search\`, \`B Submit\`

#### O - Other Elements
- Complex UI components (tables, lists, images, custom components)
- Example: \`O Product List Table\`, \`O User Avatar Image\`

### 3. PSAU Comments (Non-functional Requirements)

PSAU comments define non-functional requirements and must be placed immediately after block definitions:

#### //P: Performance Requirements
- Response time, load time, throughput specifications
- Example: \`//P: response_time <= 1s\`, \`//P: load_time <= 2s\`

#### //S: Security Requirements
- Authentication, authorization, data protection
- Example: \`//S: multi_factor_auth=required\`, \`//S: role=admin\`

#### //A: Availability Requirements
- Uptime, reliability, fault tolerance
- Example: \`//A: uptime >= 99.9%\`, \`//A: auto_backup=enabled\`

#### //U: Usability Requirements
- User experience, accessibility, interface standards
- Example: \`//U: accessibility=AAA\`, \`//U: mobile_responsive=true\`

### 4. Interactions and Transitions

#### Separator: \`--\`
- Separates UI elements from interaction definitions
- Must be placed between UI elements and actions

#### Basic Transition: \`A [Description] => [Target]\`
- \`A\`: Action indicator
- \`[Description]\`: Brief explanation of the interaction
- \`=>\`: Transition operator
- \`[Target]\`: Destination screen or use case

#### Conditional Transition: \`A [Description] ={condition}=> [Target]\`
- \`={condition}=>\`: Conditional transition operator
- Only executes when the specified condition is met
- Example: \`A Login ={authentication_success}=> Main Menu\`

## Complete Examples

### Basic Example: Simple Login Flow
\`\`\`
[Login Screen]
//P: response_time <= 0.5s
//S: multi_factor_auth=required
//A: uptime >= 99.9%
//U: error_messages_in_japanese=true

E User ID
E Password
B Login
B Forgot Password
--
A Login Authentication ={authentication_success}=> Main Menu
A Login Authentication ={authentication_failure}=> Login Screen
A Forgot Password => Password Reset

[Main Menu]
//P: load_time <= 1s
//U: navigation_intuitive=true

T Welcome Message
O Navigation Menu
B Logout
--
A Logout => Login Screen
\`\`\`

### Advanced Example: E-commerce Product Management
\`\`\`
[Product List]
//P: list_display <= 1s
//S: view_permission_required=true
//A: cache_enabled=true
//U: sort_and_filter_available=true

E Search Keywords
B Search
O Product Table
O Pagination
B Add New Product
--
A Search => Product List
A Add Product => Product Creation
A Select Product => Product Detail

[Product Creation]
//P: form_validation <= 0.3s
//S: input_sanitization=required
//A: auto_save_draft=enabled

E Product Name
E Description
E Price
E Category
O Image Upload
B Cancel
B Save
--
A Cancel => Product List
A Save ={validation_success}=> Product List
A Save ={validation_failure}=> Product Creation

[Product Detail]
//A: change_history_tracking=enabled
//U: inline_editing=available

T Product Information
O Review History
E New Review
B Add Review
B Edit Product
B Delete Product
--
A Edit Product => Product Edit
A Delete Product ={confirmation}=> Product List
A Add Review ={review_saved}=> Product Detail

(Inventory Check)
//P: processing_time <= 3s
//S: transaction_guarantee=required
//A: rollback_on_failure=enabled
\`\`\`

### Complex Conditional Example: Admin Dashboard
\`\`\`
[Admin Dashboard]
//P: dashboard_load <= 2s
//S: role=admin
//U: real_time_updates=enabled

T Admin Menu List
O System Status Panel
O User Activity Log
B User Management
B System Settings
B Reports
--
A User Management ={admin_permission}=> User List
A System Settings ={super_admin_permission}=> Settings Panel
A Generate Report => Report Generation

(User Permission Check)
//P: permission_check <= 0.1s
//S: role_based_access_control=strict
//A: session_validation=required

(Report Generation)
//P: report_generation <= 30s
//S: data_anonymization=required
//A: background_processing=enabled
\`\`\`

## Best Practices for LLM Integration

### 1. Consistent Naming Conventions
- Use descriptive, unambiguous names for screens and use cases
- Maintain consistent terminology across the entire UFML document
- Avoid abbreviations that could be misinterpreted

### 2. Appropriate Granularity
- Each screen block should represent a distinct UI state
- Break down complex screens into smaller, manageable blocks
- Use use case blocks for reusable business logic

### 3. Effective PSAU Usage
- Include relevant non-functional requirements for each screen
- Use measurable criteria when possible (e.g., \`<= 1s\`, \`>= 99.9%\`)
- Consider all four aspects (P, S, A, U) for comprehensive coverage

### 4. Clear Interaction Definitions
- Use descriptive action names that clearly indicate the user's intent
- Specify conditions explicitly for conditional transitions
- Ensure all possible user paths are covered

### 5. Structured Organization
- Group related screens logically
- Use consistent indentation and formatting
- Include comments for complex business rules when necessary

## LLM Processing Guidelines

When processing UFML, LLMs should:

1. **Parse Structure**: Identify blocks using \`[]\` and \`()\` patterns
2. **Extract Elements**: Recognize UI elements by their prefixes (T, E, B, O)
3. **Analyze Requirements**: Parse PSAU comments for non-functional requirements
4. **Map Transitions**: Build flow diagrams from \`A ... => ...\` patterns
5. **Validate Consistency**: Check for missing transitions or undefined targets
6. **Generate Code**: Create appropriate UI components based on element types
7. **Maintain Traceability**: Link generated code back to UFML specifications

## Common Patterns and Templates

### Authentication Flow Template
\`\`\`
[Login Screen]
//S: secure_authentication=required
E Username/Email
E Password
B Login
B Register
--
A Login ={success}=> Dashboard
A Login ={failure}=> Login Screen
A Register => Registration Screen
\`\`\`

### CRUD Operations Template
\`\`\`
[Entity List]
//P: list_load <= 1s
O Entity Table
B Create New
--
A Create => Entity Creation
A Select Item => Entity Detail

[Entity Creation]
//S: input_validation=required
E Required Fields...
B Save
B Cancel
--
A Save ={valid}=> Entity List
A Cancel => Entity List

[Entity Detail]
//A: change_tracking=enabled
T Entity Information
B Edit
B Delete
--
A Edit => Entity Edit
A Delete ={confirmed}=> Entity List
\`\`\`

This guide provides comprehensive coverage of UFML syntax and best practices for LLM integration, enabling accurate parsing, generation, and manipulation of UFML documents.`,

  'LICENSE': `# UFML (User interface Flow Markup Language) ライセンス

## MIT License

Copyright (c) 2025 UFML Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## UFML仕様について

### 対象範囲

本ライセンスは以下に適用されます：

- UFML記法の仕様
- UFML構文の定義
- UFMLパーサーの実装
- UFML関連のドキュメント
- UFMLサンプルコード

### 利用許可

以下の利用を無制限で許可します：

- **個人利用**: 学習、研究、開発での自由な利用
- **商用利用**: 商用製品への組み込み、販売
- **派生作品**: UFML仕様を基にした新しい仕様の作成
- **実装**: UFML仕様に基づくエディター、パーサー、コンバーターの開発
- **配布**: UFML仕様の再配布、改変版の配布
- **教育**: 教育機関での利用、教材としての利用

### 推奨事項

以下は義務ではありませんが、推奨します：

- UFML仕様を使用した製品やサービスでの出典明記
- UFML仕様の改善提案やフィードバックの共有
- UFMLコミュニティへの貢献

---

## 注意事項

**重要**: 本ライセンスはUFML仕様自体に適用されます。UFML Editor Webアプリケーションには別途利用規約が適用されます。詳細は \`TERMS_OF_SERVICE.md\` を参照してください。

### ライセンスの分離

- **UFML仕様**: MIT License（本ライセンス）
- **UFML Editor Webアプリ**: 制限付き利用規約
- **オープンソース実装**: 各実装のライセンスに従う

この分離により、UFML仕様の自由な利用と、特定の実装における適切な制限を両立しています。

---

**UFML Project**  
https://github.com/jacknocode/ufml

最終更新日: 2025年6月19日`,

  'docs/PRIVACY_POLICY.md': `# プライバシーポリシー

最終更新日: 2025年6月19日

## 1. はじめに

UFML Editor（以下「本サービス」）は、ユーザーフロー図を作成するためのWebアプリケーションです。本プライバシーポリシーは、本サービスにおける個人情報の取り扱いについて説明します。

## 2. データの収集と利用

### 2.1 オンライン版（Webアプリケーション）

**収集するデータ:**
- アクセスログ（IPアドレス、アクセス時刻、ブラウザ情報）
- エラーログ（技術的な問題の解決のため）

**収集しないデータ:**
- 個人を特定できる情報
- ユーザーが入力したUFMLコードやフロー図の内容
- 会員登録情報（会員登録機能はありません）

### 2.2 ローカル版（ダウンロード利用）

ローカル環境で利用する場合、一切のデータ収集は行いません。すべての処理はユーザーのデバイス内で完結します。

## 3. データの保存と送信

- **入力データ**: ユーザーが入力したUFMLコードやフロー図は、ユーザーのブラウザ内（ローカルストレージ）にのみ保存され、外部サーバーには送信されません
- **自動保存**: ブラウザのローカルストレージを使用して作業内容を自動保存します
- **データの削除**: ブラウザのデータを削除することで、保存された作業内容も削除されます

## 4. 第三者サービス

本サービスは以下の第三者サービスを利用する場合があります：

- **Cloudflare Pages**: ホスティングサービス
- **Google Analytics**: アクセス解析（実装時のみ）

これらのサービスには独自のプライバシーポリシーが適用されます。

## 5. Cookie

本サービスは、必要最小限のCookieのみを使用します：
- セッション管理用Cookie
- 設定保存用Cookie

## 6. データの安全性

- すべての通信はHTTPS暗号化により保護されます
- 入力データは外部に送信されないため、高いプライバシー保護を実現しています


## 7. プライバシーポリシーの変更

本プライバシーポリシーは予告なく変更される場合があります。重要な変更がある場合は、本サービス上で通知します。

## 8. お問い合わせ

プライバシーに関するご質問は、GitHubのIssueまたはDiscussionsでお問い合わせください。

---

**UFML Editor**  
オープンソースプロジェクト`,

  'docs/TERMS_OF_SERVICE.md': `# 利用規約

最終更新日: 2025年6月19日

## 1. はじめに

本利用規約（以下「本規約」）は、UFML Editor Webアプリケーション（以下「本サービス」）の利用条件を定めるものです。本サービスを利用することで、本規約に同意したものとみなされます。

## 2. サービスの概要

本サービスは、UFML（User interface Flow Markup Language）を使用してユーザーフロー図を作成・編集するためのWebアプリケーションです。

## 3. 利用許可

### 3.1 個人利用
- 個人的な学習、研究、開発目的での利用は無制限で許可されます
- 個人のポートフォリオやブログでの利用も許可されます

### 3.2 教育・研究利用
- 教育機関での授業や研究での利用は無制限で許可されます
- 学術論文や研究発表での利用も許可されます

### 3.3 非営利団体
- 非営利団体での利用は許可されます

### 3.4 商用利用について
基本的に商用利用は許可されますが、以下の利用には制限があります：

**制限される商用利用:**
- 本サービスを組み込んだ商用製品の販売
- 本サービスを使用したコンサルティングサービス（有償）
- 本サービスの再販売

**商用ライセンスについて:**
制限される商用利用を希望する場合は、別途商用ライセンスの取得が必要です。詳細はお問い合わせください。

**許可される商用利用:**
- 企業の内部利用（規模問わず）
- フリーランサーの業務での利用
- 社内ツールとしての利用
- 顧客向けプレゼンテーション資料の作成

## 4. 禁止事項

以下の行為を禁止します：

- 本サービスの逆アセンブル、逆コンパイル、リバースエンジニアリング
- 本サービスの複製、改変、再配布（オープンソース部分を除く）
- 違法な目的での利用
- 他者の権利を侵害する利用
- サーバーに過度な負荷をかける行為
- セキュリティを脅かす行為

## 5. 知的財産権

### 5.1 本サービス
- 本サービスの著作権は開発者に帰属します
- ユーザーは本規約に従って利用する権利のみを有します

### 5.2 ユーザーコンテンツ
- ユーザーが作成したUFMLコードやフロー図の著作権はユーザーに帰属します
- 本サービスはユーザーコンテンツを外部に送信・保存しません

### 5.3 UFML仕様
- UFML仕様自体は別途オープンソースライセンスで提供されます
- 詳細は \`LICENSE\` を参照してください

## 6. 免責事項

- 本サービスは「現状有姿」で提供されます
- 本サービスの利用により生じた損害について、開発者は一切の責任を負いません
- 本サービスの継続性、正確性、完全性を保証しません
- データの損失や破損について責任を負いません

## 7. サービスの変更・終了

- 本サービスは予告なく変更・終了される場合があります
- 重要な変更については可能な限り事前に通知します

## 8. 規約の変更

本規約は予告なく変更される場合があります。変更後の規約は本サービス上で公開された時点で効力を生じます。

## 9. 準拠法・管轄裁判所

本規約は日本法に準拠し、東京地方裁判所を専属的合意管轄裁判所とします。

## 10. お問い合わせ

本規約に関するご質問や商用ライセンスについては、GitHubのIssueまたはDiscussionsでお問い合わせください。

---

**UFML Editor**  
オープンソースプロジェクト

**注意:** 本利用規約はWebアプリケーション版に適用されます。UFML仕様自体のライセンスについては \`LICENSE\` を参照してください。`
};

// ナビゲーション管理
class Navigation {
  constructor() {
    this.currentDoc = 'README.md';
    this.init();
  }

  init() {
    // ナビゲーションリンクのイベントリスナー設定
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const docName = link.getAttribute('data-doc');
        this.loadDocument(docName);
        this.setActiveLink(link);
      });
    });

    // 初期ドキュメントの読み込み
    this.loadDocument(this.currentDoc);
  }

  setActiveLink(activeLink) {
    // すべてのリンクからactiveクラスを削除
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    // クリックされたリンクにactiveクラスを追加
    activeLink.classList.add('active');
  }

  loadDocument(docName) {
    const content = documents[docName];
    if (content) {
      this.renderMarkdown(content);
      this.currentDoc = docName;
    } else {
      this.showError(`ドキュメント "${docName}" が見つかりません。`);
    }
  }

  renderMarkdown(content) {
    const contentElement = document.getElementById('content');
    
    // Markedを使用してMarkdownをHTMLに変換
    const html = marked.parse(content);
    contentElement.innerHTML = html;

    // コードブロックのシンタックスハイライト
    if (window.Prism) {
      Prism.highlightAllUnder(contentElement);
    }

    // ページトップにスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showError(message) {
    const contentElement = document.getElementById('content');
    contentElement.innerHTML = `
      <div style="text-align: center; padding: 60px 0; color: #e53e3e;">
        <h2>エラー</h2>
        <p>${message}</p>
      </div>
    `;
  }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
  new Navigation();
});

// スムーズスクロール（古いブラウザ対応）
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});