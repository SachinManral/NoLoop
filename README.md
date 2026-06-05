# NoLoop

> **One shared record. One fast decision. No loop.**

NoLoop is a full-stack, multi-agent AI platform for healthcare insurance claims adjudication — built to make medical claims faster, more explainable, and more transparent for every stakeholder involved.

## The Problem

Picture this: A patient — let's call him Ramesh — undergoes a successful knee surgery. The doctor clears him to go home. But the billing desk calls: *"Sir, your insurance claim hasn't been approved yet. You'll need to wait."*

One day passes. Then two. Then three. Meanwhile, another patient who needs emergency surgery is waiting for the same bed.

This is not a rare story. It happens thousands of times, every single day, across India.

**The broken loop looks like this:**

Patient gets admitted → Hospital sends documents to TPA (Third Party Administrator) → TPA forwards to insurer → Insurer reviews → Sends a query back → Hospital responds → Insurer reviews again → Another query → and on it goes.

Three things make this loop painful:

- Documents are requested again and again
- There is no shared status — every party maintains their own files, creating three different pictures of the same claim
- The patient ends up paying cash to leave, waiting weeks or months for a refund that sometimes never comes

**The scale of the problem in India:**

- 11–12.5% of insurance claims are denied, and in most cases the patient is never properly told why
- Cashless claims account for more than 58% of all claims — and this is the dominant, growing method
- A single cashless claim takes 2–3 hours if everything goes perfectly, but can drag on for days when something goes wrong
- One human claims processor handles 50–80 claims per day, manually — reading documents, typing queries, sending emails
- 15% of all claims involve some form of fraud, amounting to ₹8,000–10,000 crore in losses annually
- In December 2025, IRDAI penalised Care Health Insurance ₹1 crore specifically for processing delays, lack of transparency, and improper rejection communication

**The regulator is watching. The problem is real. Nobody has properly solved it — yet.**

## The Solution

NoLoop sits in the middle of the entire ecosystem — connecting the patient, the hospital, the TPA, and the insurer — in **one single shared system**.

Think of it as a shared Google Doc that everyone can see, instead of three parties maintaining separate files and emailing each other all day.

NoLoop works in three steps:

1. **Capture** — Hospitals submit structured claims. NoLoop automatically catches missing information before submission, so claims are never sent back for errors.
2. **Decide** — The system auto-checks policy rules (coverage, limits, exclusions). 92% of claims are decided instantly, with zero human review.
3. **Settle** — The insurer pays the hospital directly via UPI. The patient pays only their co-pay and walks out. No cash, no waiting.

**With NoLoop — Ramesh's pre-auth is approved in 8 minutes. He pays only his co-pay and walks out. 40 minutes from ready-to-discharge to actually leaving.**

## Key Features

- Role-based frontend dashboards for patient, hospital, and insurer workflows
- Modern landing page and auth flow for project presentation
- Demo-ready seeded data stored locally for smooth walkthroughs
- Claim queue, claim detail, fraud alerts, letters, reports, and policy views
- OCR upload API for images and PDFs
- Gemini-assisted document classification and structured extraction
- Multi-agent architecture covering intake, policy review, medical/fraud review, and cross-validation
- Real-time WhatsApp notifications for patients at every claim stage
- Documentation set for architecture, workflow, compliance, and data flow

## Three Stakeholders, One Platform

**For the Patient**
Real-time WhatsApp updates at every step — no new app to download, no website to check. Before discharge, patients know exactly how much co-pay they owe. Complete transparency. Zero anxiety.

**For the Hospital**
One single console for all insurance companies. File it once. Watch it clear. Settlements happen automatically. Bed turnover improves because patients aren't stuck waiting for claim approvals.

**For the Insurer / TPA**
Clean, structured claims — not messy unstructured PDFs. AI-assisted doctors handle 150 claims per day instead of 50 — three times the throughput. Every decision is recorded and auditable for compliance.

## The Four AI Agents

**1. Query-Proofing Agent (Hospital-side)**
Cross-checks all documents before submission. If a bill or report doesn't match the policy, it flags the issue instantly — stopping errors before the claim is even sent.

**2. Case Review Agent (Insurer-side)**
Reads dozens of messy medical files and summarises the case in plain English. The AI does the reading; a human doctor makes the final call.

**3. Fraud Detection Agent (Insurer-side)**
Analyses billing patterns and history to produce a clear, explainable fraud risk score. No black-box decisions — just auditable, reasoned outputs.

**4. Communication Agent (Patient-side)**
Powers real-time WhatsApp updates and answers patient questions (like *"Is my knee implant covered?"*) instantly, citing exact policy clauses.

> **Important:** The AI assists — it reads documents, flags issues, writes summaries. A human doctor at the insurance company always makes the final approval decision. Human-in-the-loop, always.

## System Architecture

NoLoop is designed as a glass-box adjudication platform:

1. Documents are uploaded by the hospital or other stakeholder
2. OCR and extraction convert raw files into structured claim data
3. Policy and medical/fraud analysis review the claim against evidence
4. A final recommendation is surfaced with supporting rationale
5. Patients, hospitals, and insurers see the same claim through role-specific dashboards

The repository architecture reflects a larger target system with:

- Next.js frontend for user-facing experiences
- FastAPI backend for APIs
- AI extraction and agent orchestration modules
- Database and repository layers
- Celery and Redis for async workflows
- Prometheus and Grafana folders for observability setup

## Tech Stack

**Frontend**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Zustand

**Backend**
- FastAPI
- Uvicorn
- Python
- EasyOCR
- Tesseract OCR
- OpenCV
- PyMuPDF and pdf2image
- Claude API (Anthropic) — frontier AI model with RAG over policy documents, clinical billing benchmarks, and insurance rules
- Google Gemini API | Groq API
- Celery
- Redis
- SQLAlchemy
- PostgreSQL

**Infrastructure**
- Docker
- CI/CD via GitHub Actions
- Cloud deployment
- WhatsApp Business API (patient communication)

No proprietary lock-in. Scalable. Swappable as we grow.

## Repository Structure

```text
NoLoop/
├── frontend/     Next.js application, dashboards, pages, components
├── backend/      FastAPI app, OCR pipeline, agents, services, DB scaffolding
├── docs/         Architecture, workflow, compliance, and setup notes
├── docker/       Redis, Prometheus, Grafana, and DB-related config
└── README.md
```

## Current Implementation Status

**Implemented:**
- Frontend application with polished multi-role dashboards and demo workflows
- Local mock authentication and seeded demo users
- OCR backend endpoints for upload and local-file processing
- Health endpoint and FastAPI app bootstrap
- Extraction service using OCR plus Gemini-based structuring
- Project documentation and repository scaffolding

**Scaffolded / Partially Implemented:**
- Claims, fraud, letters, policies, and users API routes
- Service-layer modules for claim and policy orchestration
- Agent directories for extractor, policy, investigator, and mediator flows
- Database, queue, monitoring, and Docker-related structure for future expansion

## Main User Roles

| Role | Responsibility |
|---|---|
| Patient | Tracks claim status, reads letters, receives WhatsApp updates |
| Hospital | Uploads documents, manages submissions, monitors workflow progress |
| Insurer | Reviews claim evidence, fraud alerts, decisions, and audit-ready summaries |

## Demo Credentials

The frontend seeds demo users into local storage on first load.

| Role | Email | Password |
|---|---|---|
| Patient | `priya@test.com` | `patient123` |
| Hospital | `apollo@test.com` | `hospital123` |
| Insurer | `star@test.com` | `insurer123` |

## Running The Project

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

### Backend

Create and activate a virtual environment, then install dependencies:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Set your API keys in an environment file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the API:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at `http://localhost:8000`.

## Available Backend Endpoints

- `GET /` — basic API status
- `GET /api/health` — health check
- `POST /api/ocr/upload` — upload image or PDF for OCR processing
- `POST /api/ocr/process-local` — process a local file path on the server

Interactive API docs:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## OCR Notes

The OCR pipeline accepts PDF, JPG/JPEG, and PNG files.

Current limits:
- Maximum upload size: 10 MB
- Tesseract may need to be installed separately on your machine
- EasyOCR downloads its model files on first use

## Documentation

Project documents are in the `docs/` folder:

- `architecture.md`
- `agent-design.md`
- `data-flow.md`
- `documentation.md`
- `hipaa-compliance.md`
- `workflow.md`

## Compliance & Security

- End-to-end encryption
- GDPR-compliant data handling
- Patient consent on file with immutable audit trail
- NHCX-aligned (India's government health claims exchange standard)

## Business Model

SaaS subscription for hospitals and insurers, with a per-claim transaction fee. Both parties save significantly more than they pay — hospitals through faster bed turnover and reduced manual work, insurers through higher throughput and fraud reduction.

## Future Scope

- Complete the claims, fraud, policy, letters, and users APIs
- Replace local mock auth with real authentication and authorization
- Connect frontend dashboards to live backend data
- Add persistent storage and migrations for production-ready claim records
- Integrate async task execution for full claim orchestration
- Expand testing across frontend and backend modules
- Full WhatsApp Business API integration for patient communication
- Multi-insurer onboarding with branded subdomains (e.g. `apollo.noloop.in`)

## Why This Project Matters

India processes hundreds of millions of insurance claims every year. Every delayed claim is a blocked bed, a stressed family, a burned-out doctor, and a penalised insurer. The technology to fix this exists. What hasn't existed is a platform that sits in the middle, talks to all three stakeholders, and makes the loop disappear.

NoLoop demonstrates:
- Full-stack development with modern frameworks
- Applied AI integration with multi-agent architecture
- Domain-focused workflow design for healthcare
- Multi-role product thinking
- Scalable architecture planning with real compliance considerations

## License

This project is released under the license included in the repository.