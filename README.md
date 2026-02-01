# remotion-ai-starter 🎬✨

Remotionを使用した、AIスライドと音声を活用した動画自動生成プロジェクトです。
AIによる画像生成や、高品質なTTS（音声合成）との同期など、Remotionの強力な機能を紹介するためのサンプルプロジェクトとして構築されています。

## ✨ 特徴

- **ハイブリッド・スライド生成**: AI（nano-banana Pro）による高品質な画像スライドと、React/CSSによる動的なデザインスライドを切り替え可能。
- **TTS同期ナレーション**: 音声の長さに合わせて、スライドの表示時間を自動的に再計算・同期。
- **マルチ・音声エンジン**: Google Cloud TTS (Gemini-grade) とシステム標準音声の両方に対応。
- **動的レイアウト**: 字幕専用エリアを備えた、汎用的で見やすい構成。

---

## 🚀 準備

### プリインストールが必要なもの
- **Node.js**: `v18` 以上
- **FFmpeg**: 動画の書き出しと音声変換に必要です（`brew install ffmpeg` などでインストールしてください）。

---

## 📦 セットアップ

1. **リポジトリのクローン**
   ```bash
   git clone <your-repo-url>
   cd remotion-app
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   ```

3. **Google Cloud TTSの設定 (推奨)**
   高品質なナレーションを使用するための手順は、後述の「[Google Cloud Platform (GCP) の設定手順](#google-cloud-platform-gcp-の設定手順)」を参照してください。

---

## ⚙️ 設定（video-config.json）

`remotion-app/video-config.json` を編集することで、動画の挙動を瞬時に切り替えられます。

```json
{
  "tts": {
    "provider": "gemini", 
    "gender": "male",
    "useNanoBanana": true,
    "gcpCredentialsPath": "../google-credentials.json"
  }
}
```

- **provider**: 
  - `"gemini"`: Google Cloud TTS を使用（高品質ボイス）
  - `"remotion"`: システム（Mac）の標準ボイスを使用
- **gender**: `"female"` または `"male"`
- **useNanoBanana**: 
  - `true`: AIが生成したスライド画像を表示
  - `false`: React/CSSで動的に生成されたタイトルスライドを表示

---

## 🛠️ 使いかた

### 1. 音声と同期データの生成
設定ファイルを変更したり、動画の内容（`src/news-data.json`）を書き換えた後は、このコマンドを実行してください：
```bash
npm run tts
```

### 2. プレビュー（Remotion Studio）
```bash
npm run dev
```
ブラウザで `http://localhost:3000` を開くと、リアルタイムで動画の編集・確認ができます。

### 3. 動画の書き出し（レンダリング）
```bash
npx remotion render NewsVideo
```
`out/NewsVideo.mp4` が生成されます。

---

## 🔐 Google Cloud Platform (GCP) の設定手順

高品質な音声合成（Google Cloud TTS）を利用するための手順です。

1. **プロジェクトの作成**: [Google Cloud Console](https://console.cloud.google.com/) にログインし、新しいプロジェクトを作成します。
2. **APIの有効化**: 「APIとサービス」から「ライブラリ」を開き、**"Cloud Text-to-Speech API"** を検索して有効化します。
3. **サービスアカウントの作成**:
   - 「IAMと管理」 > 「サービスアカウント」に移動します。
   - 「サービスアカウントを作成」をクリックし、任意の名前を入力して作成します。
   - ロールは特に必要ありませんが、必要に応じて「プロジェクト」 > 「閲覧者」などを付与してください。
4. **鍵（JSON）の発行**:
   - 作成したサービスアカウントの「管理」から「キー（鍵）」タブを開きます。
   - 「鍵を追加」 > 「新しい鍵を作成」を選択し、**JSON** 形式で作成・ダウンロードします。
5. **ファイルの配置**:
   - ダウンロードしたJSONファイルを `google-credentials.json` という名前に変更します。
   - このプロジェクトの**ルートディレクトリ**（`remotion-app/` ではなくその一階層上）に配置してください。

---

## 🔒 セキュリティについて
`google-credentials.json` などの機密情報は `.gitignore` に含まれています。GitHub等に公開する際、これらのファイルがアップロードされないように設定されていますが、鍵の管理には十分ご注意ください。

---

Built with [Remotion](https://www.remotion.dev/) 🚀
