## ⚙️ Storage Backend

[English](./README.md) | [日本語](./README.ja.md)

---

### 🔍 Overview

**storage-be** is the **application layer** of the Storage System.

It connects the **domain layer** (`storage-domain`) to the **infrastructure** (databases, authentication, background workers) and provides **APIs for clients**.

This layer handles:

- Request validation & authentication
- Application workflows and orchestration
- Communication with storage and content-processing workers

> **Note:** Files are uploaded **directly from the client to Cloudflare R2**, reducing load on the backend.

---

### 🎯 Responsibilities

The backend layer is responsible for:

- ⚡ Exposing APIs for **metadata management**, search queries, and authentication
- 🧩 Orchestrating **domain logic** and infrastructure
- 🔒 Handling **authentication & authorization** (Google OAuth, JWT)
- 💾 Storing **file metadata** in Postgres (via Drizzle ORM)
- 🐇 Dispatching **content-processing jobs** via **RabbitMQ**
- ✅ Testing application flows with **Jest, Supertest, Jest Cucumber**

> Backend **does not handle file uploads directly**; clients upload files straight to R2.

---

### 🧱 Architecture

```
Client → Cloudflare R2
       ↘ API → Controller → Application Service → Domain → Repositories → Worker Queue
```

Key layers:

| Layer               | Responsibility                                           |
| ------------------- | -------------------------------------------------------- |
| Controller          | Handle API requests/responses for metadata, search, auth |
| Application Service | Orchestrate domain logic & background jobs               |
| Domain              | Core business rules (`storage-domain`)                   |
| Repository          | Persist metadata in Postgres                             |
| Worker Queue        | Dispatch background jobs for OCR / indexing              |

---

### ⚙️ Tech Stack

- **Language:** TypeScript
- **Framework:** NestJS
- **Database:** PostgreSQL (via Drizzle ORM)
- **Storage:** Cloudflare R2 (S3-compatible, direct client upload)
- **Message Queue:** RabbitMQ
- **Auth:** JWT + Google OAuth
- **Testing:** Jest, Supertest, Jest Cucumber

---

### 🔄 High-Level Flow

1. 📤 Client uploads file **directly to Cloudflare R2**
2. 🔒 Backend verifies **metadata & authentication**
3. ⚙️ Application service saves metadata in **Postgres**
4. 🐇 Job dispatched to **content-processing worker** for OCR
5. 📄 Text content indexed for search
6. 🔍 User queries can fetch results via API

---

### 🧪 Testing Strategy

- **Unit tests**: Business behavior & application services (Jest)
- **Integration tests**: End-to-end API flows (Supertest)
- **BDD tests**: Critical workflows with Jest Cucumber

---

### 🎯 Goals

- Provide **stable, secure, and testable APIs**
- Orchestrate **domain logic and background jobs**
- Ensure **scalability & maintainability**
- Support **direct client uploads** to R2 efficiently

---

### 📚 Related Repositories

- [`storage-system`](https://github.com/wiwiewei18/storage-system)
- [`storage-domain`](https://github.com/wiwiewei18/storage-domain)
- [`storage-content-processor`](https://github.com/wiwiewei18/storage-content-processor)
- [`storage-fe`](https://github.com/wiwiewei18/storage-fe)

---

### 🌍 Language

- 🇬🇧 English (current)
- 🇯🇵 Japanese → [README.ja.md](./README.ja.md)
