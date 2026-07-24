# PramaanAI - Unified AI-Powered Fraud Detection SaaS

PramaanAI is a production-ready, investor-grade Unified Cybersecurity Fraud Detection Platform. It consolidates threat monitoring across **Emails, SMS messages, Voice Call Transcripts, and Visual Documents** under a single, cohesive Risk Fusion AI engine.

Designed with a premium dark-mode glassmorphic aesthetic (inspired by Linear, Vercel, and Stripe), PramaanAI demonstrates how modern enterprises can mitigate multi-channel social engineering vectors before they compromise critical business transactions.

---

## 🚀 Key Platform Features

*   **✉️ Email Integrity Portal**: Screens SPF, DKIM, and DMARC alignments, inspects domain age registries, extracts malicious links, and cross-references email bodies against phishing corpus profiles.
*   **💬 SMS Security Gate**: Captures OTP harvesting templates, suspicious UPI payment request vectors, shortened redirects, and urgent stress vocabularies.
*   **📞 Voice Call Verification**: Parses transcription dialogues for compliance pressure tactics, authority impersonation scams, and wire transfer escrow warnings, rendering a VoIP signal trust dial.
*   **📄 Document Visual Forensics**: Evaluates document uploads, extracts layout texts via OCR, checks visual compression levels, inspects EXIF metadata logs for image manipulation software signatures (e.g., Photoshop, Canva, GIMP), and validates registration QR codes.
*   **⚡ Risk Fusion AI Engine**: Integrates text vector similarity metrics, pressure heuristics, and channel metadata parameters into a single, explainable Threat Index (Safe, Warning, Critical).
*   **🔍 Interactive Command Palette**: Instant navigation and settings toggles via `Ctrl + K` or `Cmd + K`.

---

## 🛠️ Technology Stack

### Ingress & Frontend
*   **Core**: React 19, Next.js 15 (App Router), TypeScript
*   **Styling & Micro-animations**: Tailwind CSS v4, Framer Motion, Radix UI Primitives
*   **Analytics**: Recharts, Zustand (State persistence)
*   **Utilities**: React Dropzone, React Hot Toast, Next Themes

### AI Engine & Backend
*   **API Framework**: FastAPI, Pydantic, Python 3
*   **Scam Classification**: Scikit-Learn (TF-IDF Vectorizers + Cosine Similarity)
*   **Forensics**: Pillow (PIL EXIF Metadata inspections)
*   **Orchestration**: Docker Compose, PostgreSQL

---

## 📁 Repository Directory Structure

```text
/ (workspace root)
  ├── package.json          # Root script manager
  ├── docker-compose.yml    # Database, Backend & Frontend containers
  ├── README.md             # Platform documentation
  ├── .gitignore            # Version exclusions
  ├── frontend/             # Next.js App Router codebase
  │     ├── src/app/        # Dashboard, Live Demo, Architecture, History
  │     ├── src/components/ # Shared components, custom Radix Dialogs/Tabs
  │     └── src/store/      # Zustand state store
  └── backend/              # FastAPI python codebase
        ├── app/services/   # AI similarity & risk weight engine
        ├── app/routers/    # Email, SMS, Call, and Document endpoints
        └── main.py         # App entry point
```

---

## ⚙️ Ingestion & Local Run Guide

PramaanAI supports a **dual-mode engine**. The frontend will automatically route requests to the FastAPI Python server if running locally, and fall back to local offline heuristic scripts when deployed statically.

### Option A: Running with npm (Recommended)

Make sure you have Node (v22+) and Python (v3+) installed.

#### 1. Ingestion & Dependencies Setup
Installs packages for both modules:
```bash
# Install frontend node modules
npm run install:frontend

# Install python packages
npm run install:backend
```

#### 2. Start the Frontend Dev Server
Runs the Next.js portal on [http://localhost:3000](http://localhost:3000):
```bash
npm run dev
```

#### 3. Start the FastAPI backend
Runs the Python Uvicorn engine on [http://localhost:8000](http://localhost:8000):
```bash
npm run backend
```

---

### Option B: Running with Docker Compose

If you have Docker Desktop running:
```bash
docker compose up --build
```
This boots up:
*   Frontend: `http://localhost:3000`
*   Backend: `http://localhost:8000`
*   Database: PostgreSQL (port `5432`)
