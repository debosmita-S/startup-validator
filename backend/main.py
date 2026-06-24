from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from database import connect_db, close_db
from routers.analysis import router as analysis_router
from routers.auth import router as auth_router
from services.gemini_service import configure_gemini


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Configure Gemini API on startup
    try:
        configure_gemini()
        print("--- Gemini API configured successfully ---")
    except Exception as e:
        print(f"--- Warning: Failed to configure Gemini API: {e} ---")

    # Disabled loading the 106MB unused ML model to avoid OOM errors in production
    # models_dir = os.path.join(os.path.dirname(__file__), "models")
    # try:
    #     import joblib
    #     app.state.startup_model = joblib.load(os.path.join(models_dir, "startup_success_model.pkl"))
    #     app.state.model_features = joblib.load(os.path.join(models_dir, "model_features.pkl"))
    #     print("--- ML models loaded successfully ---")
    # except Exception as e:
    #     print(f"--- Warning: Failed to load ML models: {e} ---")
    
    app.state.startup_model = None
    app.state.model_features = None

    await connect_db()
    yield
    
    # Cleanup
    app.state.startup_model = None
    app.state.model_features = None
    await close_db()


app = FastAPI(
    title="Startup Idea Validator API",
    description="AI-powered startup idea analysis using Google Gemini",
    version="1.0.0",
    lifespan=lifespan,
)

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(analysis_router)


@app.get("/")
async def root():
    return {"message": "Startup Idea Validator API", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
