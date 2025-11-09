# Secure Client Credential Vault – Demo Project

## 🧩 Overview
This project demonstrates a **secure credential submission system** built with **HashiCorp Vault** and a lightweight **Node.js / Express** backend.

The idea originated from a real-world automation challenge:  
while automating tasks for my first clients (family and friends), I needed a safe way to handle **passwords and API tokens** without ever seeing them myself.  

So I thought — *what if clients could submit their credentials once, via a secure HTML login page, and those secrets would go directly into a Vault instance?*  
This would let me generate and use **hash-based access tokens** inside automation workflows (e.g., in **local n8n**) without ever exposing sensitive data.

---

## ⚙️ Architecture
Two isolated services managed with Docker Compose:

| Service | Description | Port |
|----------|-------------|------|
| **Vault** | HashiCorp Vault in `dev` mode with local KV v2 storage. | `8200` |
| **Login App** | Node.js + Express server that serves a simple HTML form and writes submitted credentials to Vault via HTTP API. | `3000` |

---

## 🛠 Tech Stack
- **HashiCorp Vault** (Dev mode)
- **Node.js 20 (Alpine)** with Express
- **Docker Compose**

---

## 🚀 Getting Started

### 1️⃣ Clone the repository
bash
git clone https://github.com/<your-username>/vault-login-demo.git
cd vault-login-demo
2️⃣ Build and Run
bash
Code kopiëren
docker compose build --no-cache
docker compose up
3️⃣ Access the Services
Vault UI → http://localhost:8200

Token: root

Demo Login Page → http://localhost:3000

4️⃣ Test the Flow
Open http://localhost:3000 and submit a test username/password (or API key).

Open the Vault UI → Secrets → secret → logins → select the <timestamp> entry.

You’ll see the submitted data stored in KV v2 at secret/data/logins/<timestamp>.

5️⃣ Stop
bash
Code kopiëren
docker compose down

📂 Folder Structure
pgsql
Code kopiëren
vault-login-demo/
├─ docker-compose.yml
├─ app/
│  ├─ Dockerfile
│  ├─ app.js
│  └─ package.json
└─ vault/
   └─ file/

🔒 Security Notes
Vault runs in dev mode for demo purposes only.
For production:

Initialize and unseal:

bash
Code kopiëren
vault operator init
vault operator unseal
Enable TLS

Use AppRole or JWT authentication

Create scoped policies (least privilege) for write-only access to secret/data/logins/*

No secrets are committed to Git.
Ensure your .gitignore excludes:

bash
Code kopiëren
vault/file/
node_modules/
.env

🌱 Future Improvements
Replace dev token with AppRole for the app

Add HTTPS for the app and Vault

Implement one-time submission tokens that mint reusable hash keys for workflows

Provide n8n examples that read secrets securely by reference (never plaintext)

📊 Architecture Diagram
pgsql
Code kopiëren
   [Client Browser]
          │  submit credentials
          ▼
  ┌──────────────────┐
  │  HTML Login Form │
  └──────────────────┘
          │  POST /submit
          ▼
  ┌──────────────────────────────┐
  │   Node.js Express Backend    │
  │  (no plaintext in logs)      │
  └──────────────────────────────┘
          │  /v1/secret/data/logins/<timestamp>
          ▼
  ┌──────────────────────────────┐
  │   HashiCorp Vault (KV v2)    │
  │   Local, secure secret store │
  └──────────────────────────────┘

💡 Why This Project
Automating for early clients raised a key question: how can I use their credentials without ever seeing them?
This proof of concept shows a practical answer — a one-time HTML login page that ships secrets straight to HashiCorp Vault,
so I can reference a hash/key in workflows (e.g., local n8n) instead of handling raw credentials.


👤 Author
Kevin Mast
Founder — KAI Automation Systems