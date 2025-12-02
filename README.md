# 英検学習支援アプリ 📚

英検合格を強力にサポートする総合学習アプリケーションです。単語学習、問題演習、学習記録の可視化、ゲーミフィケーション要素を備えた、楽しく効果的な学習体験を提供します。

**完全静的サイト** - サーバー不要で、GitHub Pages、Netlify、Vercelなどに簡単にデプロイできます。

## 🌟 主な機能

### 学習機能
- ✅ **過去問データベースと問題演習**
  - 英検5級〜1級の問題を収録
  - 多肢選択、穴埋め、長文読解、ライティング問題に対応
  - タイマー機能付き
  - 間違えた問題の復習機能

- ✅ **単語学習機能 (級別)**
  - 3つの学習モード: フラッシュカード、クイズ、タイピング
  - 発音記号、例文、日本語訳付き
  - 音声再生機能
  - 学習進捗の自動記録

### 進捗管理・ゲーミフィケーション
- ✅ **進捗管理**
  - 学習履歴の記録（localStorage使用）
  - スコアの保存
  - 級別の成績管理

- ✅ **ゲーミフィケーション要素**
  - ポイントシステム
  - バッジ獲得システム
  - 連続学習記録 (ストリーク)
  - 17種類の達成バッジ

- ✅ **学習記録の可視化**
  - ダッシュボード機能
  - 学習回数のグラフ表示
  - 正答率の統計
  - 苦手単語の分析

### 収益化
- ✅ **Google AdSense統合**
  - トップとボトムにバナー広告配置
  - レスポンシブ広告ユニット対応

- ✅ **Google Analytics統合**
  - ユーザー行動分析
  - トラフィック計測

## 🚀 デプロイ方法

### GitHub Pagesへのデプロイ

1. GitHubリポジトリを作成
2. コードをプッシュ
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/eiken-app.git
git push -u origin main
```
3. リポジトリの Settings > Pages で、Source を "main" ブランチに設定
4. 数分後、`https://yourusername.github.io/eiken-app/` でアクセス可能

### Netlifyへのデプロイ

1. [Netlify](https://www.netlify.com/)にログイン
2. "Add new site" > "Import an existing project"
3. GitHubリポジトリを選択
4. Build settings は空欄のまま（静的サイトのため）
5. "Deploy site" をクリック
6. 自動的にデプロイ完了！

**または、ドラッグ&ドロップでデプロイ:**
1. プロジェクトフォルダをZIPに圧縮
2. [Netlify Drop](https://app.netlify.com/drop)にドラッグ&ドロップ

### Vercelへのデプロイ

1. [Vercel](https://vercel.com/)にログイン
2. "Add New Project"
3. GitHubリポジトリを選択
4. "Deploy" をクリック
5. 自動的にデプロイ完了！

## 📝 デプロイ後の設定

### Google Analytics設定

1. [Google Analytics](https://analytics.google.com/)でプロパティを作成
2. 測定IDをコピー（例: G-XXXXXXXXXX）
3. [index.html](index.html) の `GA_MEASUREMENT_ID` を実際のIDに置き換え:
```javascript
gtag('config', 'GA_MEASUREMENT_ID'); // ← ここを変更
```

### Google AdSense設定

1. [Google AdSense](https://www.google.com/adsense/)にサインアップ
2. サイトを追加して審査を通過
3. 広告ユニットを作成
4. [index.html](index.html) の以下を置き換え:
   - `ca-pub-XXXXXXXXXXXXXXXX` → 実際のパブリッシャーID
   - `data-ad-slot="XXXXXXXXXX"` → 実際の広告スロットID

### SEO設定

[index.html](index.html) のメタタグを更新:
- `canonical` URL をあなたの実際のドメインに変更
- OG画像とTwitter画像を作成して配置（推奨サイズ: 1200x630px）

## 📁 プロジェクト構造

```
eiken/
├── index.html              # メインHTMLファイル（SEO最適化済み）
├── style.css               # CSSスタイル
├── netlify.toml            # Netlify設定
├── vercel.json             # Vercel設定
├── js/                     # JavaScriptモジュール
│   ├── app.js              # メインアプリ（localStorage使用）
│   ├── quiz.js             # 問題演習モジュール
│   ├── vocabulary.js       # 単語学習モジュール
│   ├── dashboard.js        # ダッシュボードモジュール
│   └── badges.js           # バッジシステムモジュール
└── data/                   # データファイル
    ├── questions.json      # 問題データ
    └── vocabulary.json     # 単語データ
```

## 🎮 使い方

### 1. 問題演習
1. ホーム画面で学習したい級を選択
2. 「学習開始」ボタンをクリック
3. 問題に回答
4. 結果を確認し、間違えた問題を復習可能

### 2. 単語学習
1. 上部ナビゲーションの「単語学習」をクリック
2. 級を選択し、「学習開始」をクリック
3. 学習モードを選択:
   - **フラッシュカード**: カードをめくって単語を暗記
   - **クイズ**: 4択クイズ形式で単語を学習
   - **タイピング**: 意味を入力して単語を覚える

### 3. 学習記録の確認
1. 上部ナビゲーションの「学習記録」をクリック
2. ダッシュボードで以下を確認:
   - 総学習時間
   - 問題正答率
   - 今週の学習回数
   - 学習進捗グラフ
   - 苦手分野

### 4. バッジの獲得
1. 上部ナビゲーションの「バッジ」をクリック
2. 獲得済み・未獲得のバッジを確認
3. 学習を続けて新しいバッジを獲得

## 🏆 バッジ一覧

- 🎉 **初ログイン** - アプリに初めてログイン
- 🔥 **3日連続** - 3日間連続で学習
- ⭐ **1週間連続** - 7日間連続で学習
- 🏆 **1ヶ月連続** - 30日間連続で学習
- 💯 **100ポイント達成** - 合計100ポイントを獲得
- 🌟 **500ポイント達成** - 合計500ポイントを獲得
- 👑 **1000ポイント達成** - 合計1000ポイントを獲得
- 🥉 **Perfect 英検5級/4級** - 満点獲得
- 🥈 **Perfect 英検3級** - 満点獲得
- 🥇 **Perfect 英検2級** - 満点獲得
- 💎 **Perfect 英検1級** - 満点獲得
- 📚 **単語マスター50** - 50個の単語を正解
- 📖 **単語マスター100** - 100個の単語を正解
- 🎓 **単語マスター500** - 500個の単語を正解

## 📊 ポイントシステム

- 単語学習 (フラッシュカード「覚えた」): **5ポイント**
- 単語学習 (クイズ正解): **10ポイント**
- 単語学習 (タイピング正解): **15ポイント**
- 問題演習 (1問正解): **20ポイント**

## 🔧 コンテンツの追加・変更

### 問題の追加
[data/questions.json](data/questions.json) を編集して問題を追加できます:
```json
{
  "英検3級": {
    "vocabulary": [
      {
        "type": "multiple-choice",
        "question": "次の単語の意味として最も適切なものを選びなさい: happy",
        "choices": ["悲しい", "嬉しい", "怒った", "怖い"],
        "answer": "嬉しい"
      }
    ]
  }
}
```

### 単語の追加
[data/vocabulary.json](data/vocabulary.json) を編集して単語を追加できます:
```json
{
  "英検5級": [
    {
      "word": "apple",
      "meaning": "りんご",
      "pronunciation": "ˈæp.əl",
      "partOfSpeech": "名詞",
      "example": "I ate an apple.",
      "exampleJP": "私はりんごを食べました。"
    }
  ]
}
```

### デプロイ方法
1. ファイルを編集
2. Gitにコミット＆プッシュ
```bash
git add .
git commit -m "Add new questions"
git push
```
3. Netlify/Vercel/GitHub Pagesが自動的に更新（約1分）

## 🛠 技術スタック

### フロントエンド
- HTML5
- CSS3 (レスポンシブデザイン)
- Vanilla JavaScript (ES6+)
- Canvas API (グラフ描画)
- localStorage (データ永続化)

### ホスティング
- 静的サイト（サーバーレス）
- GitHub Pages / Netlify / Vercel対応

### 分析・収益化
- Google Analytics
- Google AdSense

### 特徴
- 完全静的サイト（サーバー不要）
- モジュール式アーキテクチャ
- レスポンシブデザイン
- SEO最適化済み
- 高速ロード（CDN配信）

## 📈 収益化戦略

1. **Phase 1: トラフィック獲得** ← 現在
   - Google AdSenseで広告収益
   - SEO最適化でオーガニックトラフィック獲得
   - Google Analyticsでユーザー行動分析

2. **Phase 2: アプリ化**
   - 十分なトラフィック獲得後
   - iOS/Androidアプリ化
   - アプリ内課金・プレミアム機能追加

3. **Phase 3: スケール**
   - 他の英語試験対応（TOEIC、TOEFL等）
   - 他言語展開
   - 企業向けサービス

## 📝 ライセンス

このプロジェクトはデモ・教育目的で作成されています。

## 🤝 貢献

バグ報告や機能リクエストはIssueでお知らせください。

---

**楽しく効果的な英検学習を！頑張ってください！🎯📚✨**
