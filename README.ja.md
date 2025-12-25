## ⚙️ ストレージバックエンド

[English](./README.md) | [日本語](./README.ja.md)

---

### 🔍 概要

**storage-be** はストレージシステムの **アプリケーション層** です。

`storage-domain`（ドメイン層）と **インフラ（データベース、認証、バックグラウンドワーカー）** をつなぎ、クライアント向けの **API** を提供します。

このレイヤーでは以下を担当します：

- リクエストのバリデーション & 認証
- アプリケーションワークフローのオーケストレーション
- ストレージやコンテンツ処理ワーカーとの連携

> **補足:** ファイルは **クライアントから直接 Cloudflare R2 にアップロード** されるため、バックエンドの負荷は最小化されます。

---

### 🎯 責務

バックエンド層の責務は以下の通りです：

- ⚡ **メタデータ管理、検索クエリ、認証用の API** を提供
- 🧩 ドメインロジックとインフラのオーケストレーション
- 🔒 **認証 & 認可** の処理（Google OAuth, JWT）
- 💾 ファイルの **メタデータを Postgres に保存**（Drizzle ORM）
- 🐇 **OCR / インデックス作成用ジョブ** を RabbitMQ でディスパッチ
- ✅ **Jest / Supertest / Jest Cucumber** によるテスト

> バックエンドは **ファイル自体のアップロードは扱わない**。クライアントが直接 R2 にアップロードします。

---

### 🧱 アーキテクチャ

```
Client → Cloudflare R2
       ↘ API → Controller → Application Service → Domain → Repository → Worker Queue
```

主要レイヤー：

| レイヤー            | 役割                                                           |
| ------------------- | -------------------------------------------------------------- |
| Controller          | メタデータ、検索、認証の API リクエスト/レスポンスを処理       |
| Application Service | ドメインロジックとバックグラウンドジョブをオーケストレーション |
| Domain              | コアビジネスルール (`storage-domain`)                          |
| Repository          | メタデータを Postgres に保存                                   |
| Worker Queue        | OCR / インデックス作成ジョブをディスパッチ                     |

---

### ⚙️ 技術スタック

- **言語:** TypeScript
- **フレームワーク:** NestJS
- **データベース:** PostgreSQL (Drizzle ORM)
- **ストレージ:** Cloudflare R2（S3互換、クライアント直接アップロード）
- **メッセージキュー:** RabbitMQ
- **認証:** JWT + Google OAuth
- **テスト:** Jest, Supertest, Jest Cucumber

---

### 🔄 高レベルフロー

1. 📤 クライアントが **直接 Cloudflare R2 にファイルをアップロード**
2. 🔒 バックエンドで **メタデータと認証を検証**
3. ⚙️ アプリケーションサービスが **Postgres にメタデータを保存**
4. 🐇 **コンテンツ処理ワーカー** に OCR ジョブをディスパッチ
5. 📄 抽出されたテキストを検索用にインデックス化
6. 🔍 ユーザーは API を通じて検索可能

---

### 🧪 テスト戦略

- **ユニットテスト:** ビジネス振る舞い & アプリケーションサービス (Jest)
- **統合テスト:** エンドツーエンド API フロー (Supertest)
- **BDDテスト:** 重要ワークフロー (Jest Cucumber)

---

### 🎯 目的

- **安定・安全・テスト可能な API** を提供
- ドメインロジックとバックグラウンドジョブをオーケストレーション
- **スケーラビリティと保守性** を確保
- **クライアント直接アップロード** に対応

---

### 📚 関連リポジトリ

- [`storage-system`](https://github.com/wiwiewei18/storage-system/blob/main/README.ja.md)
- [`storage-domain`](https://github.com/wiwiewei18/storage-domain/blob/main/README.ja.md)
- [`storage-content-processor`](https://github.com/wiwiewei18/storage-content-processor/blob/main/README.ja.md)
- [`storage-fe`](https://github.com/wiwiewei18/storage-fe/blob/main/README.ja.md)

---

### 🌍 言語

- 🇬🇧 English → [README.md](./README.md)
- 🇯🇵 日本語（本ドキュメント）
