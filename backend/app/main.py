from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth import router as auth_router
from app.profile_routes import router as profile_router
from app.insights import router as insights_router
from app.memory_routes import router as memory_router
from app.chat import router as chat_router

# Create FastAPI app FIRST
app = FastAPI()

# THEN add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://haven-ai-ten.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(profile_router)
app.include_router(insights_router)
app.include_router(memory_router)