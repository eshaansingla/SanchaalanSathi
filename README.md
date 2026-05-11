<div align="center">

<img src="apps/web/public/logo/logo-full.png" alt="Sanchaalan Saathi" height="160" />

<br/>

# Sanchaalan Saathi

### AI-Powered NGO Volunteer & Resource Coordination Platform

<p align="center">
  <a href="https://sanchaalan-saathi.vercel.app"><strong>🌐 Live Demo</strong></a> &nbsp;·&nbsp;
  <a href="#-getting-started"><strong>Quick Start</strong></a> &nbsp;·&nbsp;
  <a href="#-features"><strong>Features</strong></a> &nbsp;·&nbsp;
  <a href="#-architecture"><strong>Architecture</strong></a>
</p>

<br/>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/Django-4.2-092E20?style=flat-square&logo=django" />
  <img src="https://img.shields.io/badge/Daphne-ASGI-44b78b?style=flat-square" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Neo4j-008CC1?style=flat-square&logo=neo4j&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini_Flash-4285F4?style=flat-square&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Vercel-Deploy-000000?style=flat-square&logo=vercel" />
  <img src="https://img.shields.io/badge/Railway-Deploy-0B0D0E?style=flat-square&logo=railway" />
  <img src="https://img.shields.io/badge/License-MIT-22c55e?style=flat-square" />
</p>

<br/>

> **Sanchaalan Saathi** *(Sanskrit: Coordination Companion)* is a production-grade, AI-native coordination platform for NGOs. It replaces fragmented WhatsApp groups and spreadsheets with a single intelligent system — matching volunteers to tasks in milliseconds, tracking field operations in real-time, and verifying outcomes through AI vision.

</div>

---

## The Problem

NGOs managing disaster relief and community operations lose up to **40% of their operational efficiency** to coordination overhead. Three compounding failures drive this:

<table>
<tr>
<th width="25%">Problem</th>
<th width="35%">Today</th>
<th width="40%">With Sanchaalan Saathi</th>
</tr>
<tr>
<td><b>Unstructured data</b></td>
<td>Field reports via WhatsApp photos, voice calls, and handwritten notes — all unusable by a system</td>
<td>Gemini AI extracts structured entities (need type, urgency, location, affected count) from any media format</td>
</tr>
<tr>
<td><b>Manual matching</b></td>
<td>Hours spent manually assigning volunteers to tasks using spreadsheets and local knowledge</td>
<td>Hungarian Algorithm computes the globally optimal assignment across all volunteers and tasks in milliseconds</td>
</tr>
<tr>
<td><b>Zero accountability</b></td>
<td>Task "completion" is a self-reported checkbox — no verification, no audit trail</td>
<td>AI vision inspects photo proof against the original task requirements before marking done</td>
</tr>
<tr>
<td><b>Symptom-only thinking</b></td>
<td>Each incident treated in isolation — no understanding of upstream causes</td>
<td>Neo4j causal graph links events (road blockage → supply delay → food shortage) for root-cause resolution</td>
</tr>
</table>

---

## Solution

Sanchaalan Saathi is a **two-portal platform** sharing a single intelligent backend:

| Portal | Who | What they can do |
|--------|-----|-----------------|
| **NGO Admin** | NGO coordinators | Create tasks, manage volunteers, auto-assign via AI, track live map, run analytics |
| **Volunteer** | Field workers | Browse skill-matched tasks, accept assignments, share GPS, send SOS, log completion |

A streaming AI chatbot (**Saathi**) is available on every page for natural-language queries over the platform data.

---

## Architecture

```
╔══════════════════════════════════════════════════════════════╗
║              VERCEL  ·  Next.js 15  ·  App Router            ║
║  ┌──────────────┐  ┌────────────────┐  ┌───────────────┐    ║
║  │  NGO Portal  │  │  Vol. Portal   │  │  Landing Page │    ║
║  └──────────────┘  └────────────────┘  └───────────────┘    ║
╚═══════════════════════════╤══════════════════════════════════╝
                            │  HTTPS  ·  WSS
╔═══════════════════════════╧══════════════════════════════════╗
║           RAILWAY  ·  Django 4.2  ·  Daphne ASGI             ║
║  ┌───────────────┐  ┌──────────────┐  ┌──────────────────┐  ║
║  │  DRF REST API │  │  Channels WS │  │  Services Layer  │  ║
║  │  (JWT + RBAC) │  │  (real-time) │  │  AI · Optimizer  │  ║
║  └───────────────┘  └──────────────┘  └──────────────────┘  ║
╚═══════════════════════════╤══════════════════════════════════╝
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
    ┌──────────────┐  ┌──────────┐  ┌──────────┐
    │  PostgreSQL  │  │  Neo4j   │  │ Firebase │
    │  (Supabase)  │  │  Graph   │  │  + Auth  │
    └──────────────┘  └──────────┘  └──────────┘
```

### Data Flow

```
User uploads field photo
        │
        ▼
Gemini Flash extracts → Need · Urgency · Location · Count
        │
        ▼
Neo4j Node created → linked to Location · Causal chain updated
        │
        ▼
Hungarian Algorithm → optimal volunteer selected (skill · distance · workload)
        │
        ▼
Volunteer notified → accepts → completes → uploads proof photo
        │
        ▼
AI Vision verifies proof → task marked RESOLVED → leaderboard updated
```

---

## Tech Stack

### Frontend

| Library | Version | Role |
|---------|---------|------|
| Next.js | 15.x | React framework, App Router, SSR |
| TypeScript | 5.x | Full type safety |
| Tailwind CSS | 3.x | Utility-first styling |
| Framer Motion | 12.x | Page animations and transitions |
| Firebase JS SDK | 12.x | Google OAuth popup flow |
| Lucide React | 0.447 | Icon system |

### Backend

| Library | Version | Role |
|---------|---------|------|
| Django | 4.2.16 | ORM, URL routing, app framework |
| Django REST Framework | 3.15.2 | REST API, serializers, permissions |
| Django Channels | 4.1.0 | WebSocket consumers |
| Daphne | 4.1.2 | ASGI server (HTTP + WS) |
| djangorestframework-simplejwt | 5.3.1 | JWT issuance and verification |
| django-cors-headers | 4.4.0 | Cross-origin request handling |
| psycopg | 3.1+ | Async PostgreSQL driver |
| bcrypt | 4.2 | Password hashing |

### AI & Intelligence

| Technology | Role |
|-----------|------|
| Google Gemini Flash | Entity extraction, chatbot responses, task verification |
| LangChain + langchain-google-genai | Natural language → Cypher query translation |
| Neo4j | Knowledge graph: need nodes, causal chains, volunteer graph |
| scipy | Hungarian Algorithm for global optimal assignment |
| scikit-learn | Skill matching scores and clustering |
| Mesa | Multi-agent simulation for scenario modelling |

### Infrastructure

| Service | Role |
|--------|------|
| **Vercel** | Frontend hosting, edge CDN, auto-deploy on push |
| **Railway** | Backend hosting, Dockerfile-based, pre-deploy migrations |
| **Supabase** | Managed PostgreSQL with connection pooling |
| **Neo4j AuraDB** | Managed graph database |
| **Firebase** | Google OAuth, Firestore activity sync |
| **Twilio** | Voice/SMS field report ingest |
| **Geoapify** | Distance matrix API for routing optimization |

---

## Features

### NGO Admin Portal

| Feature | Description |
|---------|-------------|
| 📋 Task Management | Create tasks with skills, priority, deadline, and geo-coordinates |
| 🤖 AI Volunteer Matching | One-click bulk assignment via Hungarian Algorithm |
| 🎯 Task-level AI Match | Rank all volunteers for a specific task by score |
| 📍 Live Volunteer Map | Real-time GPS positions of location-sharing volunteers |
| 🗺 Route Preview | Optimal path from volunteer location to task site |
| 📊 Analytics Dashboard | Completion rates, skill gaps, assignment timing, leaderboard |
| 🔔 Real-time Notifications | Task events pushed via WebSocket |
| 📅 Event Management | Create relief drives, camps, training — track attendance |
| 📦 Resource Allocation | Manage physical resources, allocate to tasks |
| 👥 Enrollment Management | Review and approve volunteer task-join requests |

### Volunteer Portal

| Feature | Description |
|---------|-------------|
| 🗂 Skill-matched Feed | Tasks filtered to your skills and availability |
| 💡 AI Recommendations | Top 5 tasks ranked by skill match score |
| ✅ Accept / Complete | One-tap assignment actions with hours logging |
| 📬 Enrollment Requests | Express interest in open tasks with a justification |
| 🆘 SOS Alert | Broadcasts location + message to all NGO admins instantly |
| 📱 Location Sharing | Toggle live GPS for dynamic task reassignment |
| 📈 Personal Analytics | Completed tasks, hours contributed, acceptance rate |

### Platform-wide

| Feature | Description |
|---------|-------------|
| 💬 Saathi Chatbot | Streaming AI assistant with memory, semantic cache, and guardrails |
| ⚡ WebSocket Events | Real-time task updates, SOS alerts, location changes |
| 🔐 Invite-only Onboarding | Volunteers need a unique NGO-issued code to register |
| 👥 Guest Demo Mode | Instant access with pre-seeded data — no signup needed |
| 🌙 Dark / Light Mode | System-aware theme with manual toggle |
| 🔍 Graph Intelligence | Natural language queries over the Neo4j knowledge graph |
| 🔒 Role Segregation | Same email cannot be used for both NGO Admin and Volunteer |

---

## Project Structure

```
SynapseAI/
├── apps/
│   └── web/                           # Next.js 15 frontend
│       ├── app/
│       │   ├── page.tsx               # Landing page (auth + marketing)
│       │   ├── layout.tsx             # Root layout (theme, auth providers)
│       │   ├── login-ngo/             # NGO/Volunteer sign-in page
│       │   ├── ngo/                   # NGO Admin portal (JWT-protected)
│       │   │   ├── dashboard/
│       │   │   ├── tasks/
│       │   │   ├── volunteers/
│       │   │   ├── map/
│       │   │   ├── analytics/
│       │   │   ├── events/
│       │   │   ├── resources/
│       │   │   ├── notifications/
│       │   │   └── setup/
│       │   ├── vol/                   # Volunteer portal (JWT-protected)
│       │   │   ├── dashboard/
│       │   │   ├── tasks/
│       │   │   ├── all-tasks/
│       │   │   ├── profile/
│       │   │   ├── analytics/
│       │   │   └── notifications/
│       │   ├── register/
│       │   │   ├── ngo/               # NGO Admin registration
│       │   │   └── volunteer/         # Volunteer registration (invite code)
│       │   └── api/                   # Next.js server-side API routes
│       │       ├── verify/            # Task verification webhook
│       │       ├── tasks/             # Task generation + claim
│       │       └── graph-sync/        # Neo4j sync endpoint
│       ├── lib/
│       │   ├── ngo-api.ts             # Complete backend API client
│       │   ├── ngo-auth.tsx           # JWT auth context + Google OAuth
│       │   ├── token-manager.ts       # Centralised token storage
│       │   ├── guest-mode.ts          # Demo mode (fake JWT)
│       │   └── guest-api-interceptor.ts  # Mock responses for demo
│       ├── components/
│       │   ├── ui/                    # ChatbotWidget, ThemeProvider, Toast
│       │   ├── dashboard/             # Reusable dashboard panels
│       │   └── map/                   # Leaflet/map visualisation
│       ├── hooks/
│       │   ├── useRealtimeSocket.ts   # WebSocket with reconnect + heartbeat
│       │   └── useGeolocation.ts      # Browser GPS hook
│       └── middleware.ts              # Next.js edge middleware (route guards)
│
└── services/
    └── backend/                       # Django 4.2 backend
        ├── apps/
        │   ├── accounts/              # Auth: signup, login, Google OAuth
        │   ├── ngo/                   # NGO tasks, resources, events, analytics
        │   ├── volunteer/             # Volunteer dashboard, assignments, SOS
        │   ├── chatbot/               # Saathi streaming SSE endpoint
        │   ├── graph/                 # Neo4j queries + analytics views
        │   ├── ingest/                # Text / document / voice ingestion
        │   ├── realtime/              # Django Channels WebSocket consumer
        │   ├── guest/                 # Guest session tracking
        │   └── core/                  # JWT auth, RBAC permissions, middleware
        ├── services/
        │   ├── ai_matching.py         # Volunteer ranking (skill + availability + workload)
        │   ├── assignment_dispatcher.py  # Orchestrates bulk AI assignment
        │   ├── live_location_cache.py # In-memory GPS buffer → PostgreSQL flush
        │   ├── realtime_events.py     # WebSocket event bus (NGO-scoped channels)
        │   ├── neo4j_service.py       # Graph node upserts and Cypher queries
        │   ├── gemini_service.py      # Entity extraction from text/images
        │   ├── geo_routing_service.py # Geoapify distance matrix
        │   ├── firebase_service.py    # Firestore sync + FCM notifications
        │   ├── langchain_cypher.py    # NL → Cypher via LangChain
        │   ├── chatbot/
        │   │   ├── llm.py             # Gemini orchestration with fallback
        │   │   ├── memory.py          # Per-session conversation memory
        │   │   ├── cache.py           # Semantic embedding-based response cache
        │   │   ├── cost_control.py    # Per-user token budgets (DB-backed)
        │   │   ├── guardrails.py      # Injection detection + safety filter
        │   │   ├── queue.py           # Request backpressure manager
        │   │   ├── sessionCache.py    # In-memory LRU session cache
        │   │   └── observability.py   # Latency and token tracing
        │   └── optimization/
        │       ├── cost_matrix_builder.py    # Build m×n score matrix
        │       ├── hungarian_solver.py       # scipy-backed optimal solver
        │       ├── greedy_solver.py          # O(n log n) fallback
        │       ├── route_optimizer.py        # Solver selection heuristic
        │       ├── reoptimization_engine.py  # Re-match on state changes
        │       ├── cost_function.py          # Scoring weights definition
        │       ├── clustering.py             # Geo-based volunteer clustering
        │       └── types.py                  # Shared dataclass types
        ├── simulation/                # Mesa multi-agent simulation
        ├── engine/                    # Simulation runner (run_simulation_scenario)
        ├── config/
        │   ├── settings/
        │   │   ├── base.py            # Shared settings (CORS, JWT, Channels)
        │   │   ├── development.py
        │   │   └── production.py
        │   ├── urls.py                # Root URL routing + /health endpoint
        │   └── asgi.py                # ASGI app (HTTP + WebSocket routing)
        ├── manage.py
        ├── requirements.txt
        ├── Dockerfile
        └── railway.toml               # Railway deployment config
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- A Supabase project (free tier works)
- A Neo4j AuraDB instance (free tier works)
- A Firebase project with Google Auth enabled
- A Google Gemini API key

### 1. Clone

```bash
git clone https://github.com/your-username/SynapseAI.git
cd SynapseAI
```

### 2. Frontend

```bash
cd apps/web
npm install
cp .env.example .env.local
# Edit .env.local with your values
npm run dev
# http://localhost:3000
```

### 3. Backend

```bash
cd services/backend
python -m venv .venv
source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your values
python manage.py migrate --fake-initial
daphne -b 0.0.0.0 -p 8000 config.asgi:application
# http://localhost:8000
```

> **`--fake-initial`** is required on first run. Database tables already exist in your Supabase instance; this flag tells Django to record the migrations as applied without re-running them.

---

## Environment Variables

### Frontend — `apps/web/.env.local`

```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend.up.railway.app

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Backend — `services/backend/.env`

```env
# Core
DEPLOYMENT_ENV=development
JWT_SECRET_KEY=replace-with-a-strong-32-char-secret
DEBUG=True
FRONTEND_URL=http://localhost:3000

# PostgreSQL (Supabase)
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-db-password
DB_HOST=db.xxxx.supabase.co
DB_PORT=5432

# AI
GEMINI_API_KEY=your-gemini-key
GEM_KEY=your-gemini-key          # takes precedence if both set

# Neo4j
NEO4J_URI=neo4j+s://xxxx.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=your-neo4j-password

# Firebase — paste the full service account JSON as a single line
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}

# Optional
GEOAPIFY_API_KEY=                 # route previews (haversine fallback if unset)
ENABLE_GUEST_MODE=true
ENABLE_DYNAMIC_REASSIGNMENT=true
LOCATION_CACHE_TTL_SECONDS=120
```

---

## Deployment

### Frontend → Vercel

| Step | Action |
|------|--------|
| 1 | Import repo in [vercel.com/new](https://vercel.com/new) |
| 2 | Set **Root Directory** to `apps/web` |
| 3 | Add all `NEXT_PUBLIC_*` environment variables |
| 4 | Deploy — auto-redeploys on every push to `main` |

### Backend → Railway

| Step | Action |
|------|--------|
| 1 | Create new project at [railway.app](https://railway.app) |
| 2 | Connect repo, set **Root Directory** to `services/backend` |
| 3 | Railway auto-detects the `Dockerfile` |
| 4 | Add environment variables (see above, use `production` values) |
| 5 | Deploy — Railway runs `migrate --noinput` before each deployment |

**Minimum required Railway variables:**

```
DEPLOYMENT_ENV=production
JWT_SECRET_KEY=<strong-random-secret-min-32-chars>
DB_NAME  DB_USER  DB_PASSWORD  DB_HOST  DB_PORT
GEMINI_API_KEY
FIREBASE_SERVICE_ACCOUNT_JSON
NEO4J_URI  NEO4J_USER  NEO4J_PASSWORD
FRONTEND_URL=https://sanchaalan-saathi.vercel.app
```

---

## API Reference

Base URL: `https://your-backend.railway.app`  
Auth header: `Authorization: Bearer <jwt_token>`

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | Public | Email/password registration |
| POST | `/api/auth/login` | Public | Email/password sign-in |
| POST | `/api/auth/google` | Public | Google OAuth token exchange |
| GET | `/api/auth/check-email?email=` | Public | Check if email is registered (returns role) |
| GET | `/api/auth/ngo/lookup/<code>` | Public | Resolve invite code to NGO name |
| POST | `/api/auth/ngo/create` | NGO Admin | Create NGO and get new token |
| POST | `/api/auth/guest` | Public | Instant NGO Admin demo session |
| POST | `/api/auth/guest-volunteer` | Public | Instant Volunteer demo session |

### NGO Admin (`/api/ngo/`)

| Endpoint | Description |
|----------|-------------|
| `GET /dashboard` | Counts, recent tasks, invite code |
| `GET/POST /tasks` | List or create tasks |
| `GET/PUT/DELETE /tasks/<id>` | Task detail CRUD |
| `POST /tasks/<id>/assign` | Manually assign a volunteer |
| `POST /tasks/<id>/ai-match` | AI-rank all volunteers for task |
| `POST /tasks/<id>/complete` | Mark task as complete (admin action) |
| `POST /assign-tasks` | Bulk AI assignment (Hungarian Algorithm) |
| `GET /volunteers` | List volunteers with stats |
| `GET /volunteer-locations` | GPS positions (location-sharing volunteers) |
| `POST /routes/preview` | Route from volunteer to task |
| `GET /assignments` | All NGO assignments |
| `GET/POST /resources` | Resource management |
| `POST /resources/<id>/allocate` | Allocate resource to task |
| `GET/POST /events` | Event management |
| `GET/POST /events/<id>/attendance` | Attendance tracking |
| `GET /analytics` | Full analytics dashboard |
| `GET /alerts` | Active high-priority alerts |

### Volunteer (`/api/volunteer/`)

| Endpoint | Description |
|----------|-------------|
| `GET /dashboard` | Assignments, notifications, deadlines |
| `GET /open-tasks` | Skill-matched available tasks |
| `GET /recommendations` | AI-ranked top 5 task suggestions |
| `POST /tasks/<id>/enroll` | Request to join a task |
| `POST /assignments/<id>/accept` | Accept an assignment |
| `POST /assignments/<id>/complete` | Mark assignment done |
| `POST /assignments/<id>/reject` | Reject an assignment |
| `GET/PUT /profile` | View and update volunteer profile |
| `POST /location` | Update GPS position |
| `DELETE /location` | Stop sharing location |
| `POST /sos` | Emergency SOS broadcast |
| `GET /notifications` | Notification feed |

### Other

| Endpoint | Description |
|----------|-------------|
| `POST /api/chatbot/` | Saathi AI chatbot (SSE streaming) |
| `GET /api/graph/stats` | Neo4j knowledge graph statistics |
| `GET /api/graph/needs` | Active needs with filters |
| `POST /api/graph/ask` | Natural language graph query |
| `GET /api/analytics/ngo-overview` | PostgreSQL-backed NGO metrics |
| `GET /api/analytics/skill-gaps` | Supply/demand skill analysis |
| `GET /api/analytics/leaderboard` | Volunteer leaderboard |
| `POST /api/ingest/text` | Ingest a text field report |
| `POST /api/ingest/document` | Ingest an uploaded document |
| `POST /api/sim/run` | Run coordination simulation |
| `WS /api/realtime/ws?token=` | WebSocket for live events |
| `GET /health` | Server health (always 200, public) |

---

## User Roles

| Role | How to Access | What They Can Do |
|------|--------------|-----------------|
| **NGO Admin** | Register with email/Google | Full NGO management — create tasks, manage volunteers, analytics |
| **Volunteer** | Invite code from an NGO Admin | Task feed, assignments, location sharing, SOS |
| **Guest (Admin)** | Click "Try Demo as Admin" | Full demo dashboard with pre-seeded data — no signup |
| **Guest (Volunteer)** | Click "Try Demo as Volunteer" | Demo volunteer workflow — no signup |

> **One email = one role.** An NGO Admin email cannot sign in via the Volunteer portal and vice versa. The platform checks your role at every sign-in attempt.

---

## Security

- **JWT (HS256)** — 24-hour tokens, issued by backend, stored in `localStorage` + secure cookie
- **RBAC** — Every endpoint enforces `IsNGOAdminWithNGO` or `IsVolunteerWithNGO` permissions
- **Invite-only volunteers** — Cannot self-register without an NGO-issued code
- **Role segregation** — Same email enforced to one role across all auth paths (signup, Google, registration)
- **CORS** — Locked to known origins; wildcard only on the public `/health` endpoint
- **Security headers** — `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, HSTS (configurable)
- **Cookie hardening** — `SameSite=Strict`, `Secure` (HTTPS), consistent across all auth flows via `token-manager.ts`

---

## Try It Live

No installation needed — the platform is deployed and ready:

1. Visit **[sanchaalan-saathi.vercel.app](https://sanchaalan-saathi.vercel.app)**
2. Click **"Try Demo as Admin"** — get a full NGO dashboard with volunteers, tasks, events, and resources pre-loaded
3. Click **"Try Demo as Volunteer"** — experience the volunteer workflow end-to-end
4. Or register your own NGO with Google OAuth — free, no credit card

---

<div align="center">

---

Built with purpose by **[Aishwary Srivastava](https://github.com/aishwarysrivastava)**

*Helping NGOs spend less time on logistics and more time on the mission.*

</div>
