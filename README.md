# Startup Idea Validator 🚀

An AI-powered full-stack web app that analyzes startup ideas using **Google Gemini**, providing instant market analysis, SWOT, competitor overview, monetization strategies, and a viability score.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS v3 |
| Backend | Python FastAPI + Uvicorn |
| AI | Google Gemini 1.5 Flash |
| Database | MongoDB + Motor (async) |

---

## Project Structure

```
Startup_Idea_Validator/
├── backend/
│   ├── main.py               # FastAPI app entry point
│   ├── config.py             # Settings from .env
│   ├── database.py           # MongoDB Motor client
│   ├── models.py             # Pydantic models
│   ├── routers/
│   │   └── analysis.py       # API endpoints
│   ├── services/
│   │   └── gemini_service.py # Gemini AI integration
│   ├── requirements.txt
│   └── .env                  # ← Add your API key here
└── frontend/
    ├── src/
    │   ├── components/       # Navbar, Forms, Cards, etc.
    │   ├── pages/            # Home, History, Detail
    │   ├── services/         # Axios API layer
    │   ├── App.jsx
    │   └── main.jsx
    └── tailwind.config.js
```

---

## Setup & Running

### 1. Configure Environment

Open `backend/.env` and set your credentials:
```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=startup_validator
```

Get your Gemini API key at: https://aistudio.google.com/app/apikey

### 2. Start the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# API running at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### 3. Start the Frontend

```bash
cd frontend
npm install   # (only needed once)
npm run dev
# App running at http://localhost:5173
```

---

## Features

- 🧠 **AI Analysis** — 7-section structured analysis via Gemini 1.5 Flash  
- 📊 **Viability Score** — Animated circular gauge (0–100)  
- 🔄 **SWOT Grid** — Color-coded Strengths, Weaknesses, Opportunities, Threats  
- 💾 **MongoDB Storage** — Auto-saves every analysis  
- 📋 **History Page** — Browse, view, and delete past analyses  
- 🎨 **Dark Glass UI** — Premium glassmorphism design with animations

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Analyze startup idea |
| GET | `/api/analyses` | List all analyses |
| GET | `/api/analyses/{id}` | Get single analysis |
| DELETE | `/api/analyses/{id}` | Delete analysis |

Interactive API docs: http://localhost:8000/docs
