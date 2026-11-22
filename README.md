# SkillSync – AI-Powered Student Skill Exchange Platform

SkillSync is a full-stack, startup-quality web platform designed for university students to mutually teach and learn skills without monetary friction. It features an intelligent recommendation engine powered by Python and scikit-learn, real-time messaging powered by Socket.IO, interactive learning roadmaps, verified peer reviews, and administrative oversight.

---

## 🚀 Key Highlights & Features

- **Modern Linear/Notion-Style UI/UX**: Minimalist aesthetic with subtle dark/light themes, typography, glassmorphism, responsive cards, and loading skeletons.
- **AI Reciprocal Matching Engine (Python + scikit-learn)**: Generates explainable 0–100 compatibility scores evaluating bidirectional skill complementarity (User A teaches what User B wants AND User B teaches what User A wants), TF-IDF semantic vector similarity, proficiency balance, and schedule overlap.
- **Full-Stack Student Profiles**: Manage skills taught (1–5 proficiency levels), learning goals, academic year, department, college, bio, interests, and availability.
- **Bilateral Exchange Requests**: Send, accept, decline, complete, and cancel exchange requests with duplicate prevention.
- **Real-Time Peer Chat (Socket.IO)**: Low-latency one-to-one messaging restricted strictly to accepted exchange partners, with typing indicators and online status.
- **Interactive Learning Roadmaps**: Track active exchanges, check off learning milestones, and record collaborative study notes.
- **Verified Reviews & Ratings**: 1–5 star peer rating system enabled upon completed exchanges, automatically updating student reputation metrics.
- **Platform Administration**: Role-based access control, system metrics, user account moderation (suspend/reactivate), and incident management.
- **Academic Rigor & Testing**: Meets SRS and SPMP standards; validated through White-Box (6 CFG branches) and Black-Box boundary testing suites.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, shadcn/ui design conventions |
| **Backend API** | Node.js, Express.js, Socket.IO, Mongoose, JWT, bcryptjs |
| **Database** | MongoDB Atlas (with seamless in-memory fallback for immediate zero-config dev) |
| **AI / ML Microservice** | Python 3, FastAPI, scikit-learn, NumPy, Pandas, Uvicorn |
| **Testing** | Jest, Supertest, PyTest, MongoMemoryServer |
| **Deployment** | Vercel (Frontend), Render (Backend & AI Microservice), Docker |

---

## 📂 Project Architecture

```text
skillsync/
├── frontend/                     # React 18 + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/           # UI, common, layout, modals
│   │   ├── context/              # Auth, Socket, Theme, Notification contexts
│   │   ├── pages/                # Landing, Login, Register, Dashboard, Explore, Recommendations, Profile, Requests, Chat, Progress, Admin
│   │   ├── services/             # Axios API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vercel.json
│   └── tailwind.config.js
├── backend/                      # Node.js + Express + Socket.IO API
│   ├── src/
│   │   ├── config/               # db.js, socket.js
│   │   ├── controllers/          # auth, profile, request, chat, review, progress, admin, recommendation
│   │   ├── middleware/           # auth.js, role.js, validate.js, errorHandler.js
│   │   ├── models/               # User, StudentProfile, Skill, ExchangeRequest, Conversation, Message, Notification, Review, LearningProgress, Report
│   │   ├── routes/               # Modular Express API routers
│   │   ├── services/             # aiService.js (Python bridge + native fallback)
│   │   ├── seeds/                # seedData.js (Realistic benchmark student profiles)
│   │   └── server.js             # HTTP & Socket.IO server entrypoint
│   ├── tests/                    # Jest CFG White-Box & Black-Box test suites
│   ├── package.json
│   └── Dockerfile
├── ai-engine/                    # Python FastAPI AI Recommendation Engine
│   ├── app/
│   │   ├── main.py               # FastAPI endpoints
│   │   ├── matcher.py            # TF-IDF, Cosine Similarity, and Reciprocal Scorer
│   │   └── models.py             # Pydantic schemas
│   ├── tests/                    # PyTest AI matching test suite
│   ├── requirements.txt
│   └── Dockerfile
├── docs/                         # Specifications & manuals
│   ├── API_DOCUMENTATION.md
│   ├── AI_MATCHING_SPECIFICATION.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── USER_MANUAL.md
├── render.yaml                   # Infrastructure-as-code for Render deployment
├── docker-compose.yml            # Multi-container orchestration
└── README.md
```

---

## 🔑 Test Credentials (Pre-Seeded)

The database seed script initializes ready-to-test accounts representing benchmark scenarios from the SRS:

| Persona | Email | Password | Role / Focus |
|---|---|---|---|
| **Aisha Jawed** | `aisha@skillsync.edu` | `Password@123` | Student: Teaches Python (5/5) ⇄ Wants UI/UX |
| **Sonali Kumari** | `sonali@skillsync.edu` | `Password@123` | Student: Teaches UI/UX (5/5) ⇄ Wants Python |
| **Rahul Sharma** | `rahul@skillsync.edu` | `Password@123` | Student: Teaches DSA (5/5) ⇄ Wants AWS Cloud |
| **Priya Patel** | `priya@skillsync.edu` | `Password@123` | Student: Teaches AWS Cloud (5/5) ⇄ Wants DSA |
| **Administrator** | `admin@skillsync.edu` | `AdminPassword@123` | Platform Admin: Full moderation & metrics |

*(Note: On the login page, you can click any of the 4 demo pills to autofill credentials with a single click!)*

---

## ⚙️ Environment Variables

### 1. Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
# Provide MongoDB Atlas connection string below, or leave empty to use automatic in-memory MongoDB
MONGODB_URI=
JWT_SECRET=skillsync_jwt_super_secret_production_ready_key_2026
JWT_EXPIRE=30d
AI_SERVICE_URL=http://127.0.0.1:8000
CLIENT_URL=http://localhost:5173
```

### 2. Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. AI Engine (`ai-engine/.env`)
```env
PORT=8000
HOST=0.0.0.0
```

---

## 💻 Local Execution Guide

### Prerequisites
- Node.js v18+ and npm
- Python 3.10+ and pip

### Step 1: Clone & Setup Backend
```bash
cd backend
npm install
npm run seed     # Seeds realistic students, skills, and sample chats
npm run dev      # Runs Express + Socket.IO server on port 5000
```

### Step 2: Setup AI Recommendation Engine
```bash
cd ../ai-engine
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Step 3: Setup Frontend
```bash
cd ../frontend
npm install
npm run dev      # Runs Vite dev server at http://localhost:5173
```

Visit **http://localhost:5173** in your browser to start using SkillSync!

---

## 🧪 Automated Testing

### Backend Unit & Integration Tests (Jest)
Tests all 6 Control Flow Graph (CFG) branches in `authController.login()` and boundary input values (0, 3, 6 proficiency ratings):
```bash
cd backend
npm test
```

### AI Recommendation Engine Tests (PyTest)
Tests reciprocal matching, semantic similarity, and candidate ranking:
```bash
cd ai-engine
python -m pytest
```

---

## 🚢 Deployment

Detailed step-by-step instructions for deploying to **Vercel** (Frontend), **Render** (Backend & AI Microservice), and **MongoDB Atlas** (Database) are provided in [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md).

For Docker Compose deployment:
```bash
docker compose up --build
```
