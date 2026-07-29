from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import connect_to_mongo, close_mongo_connection, get_recent_scans
from app.routers import email, sms, call, document, ml

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: connect to MongoDB Atlas
    await connect_to_mongo()
    yield
    # Shutdown: close connection
    await close_mongo_connection()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="PramaanAI - Unified Threat Fusion engine for cybersecurity validation.",
    lifespan=lifespan
)

# Set CORS origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register specific threat routers
app.include_router(email.router)
app.include_router(sms.router)
app.include_router(call.router)
app.include_router(document.router)
app.include_router(ml.router)
app.include_router(phone.router)

@app.get("/")
async def root():
    return {
        "status": "healthy",
        "service": "PramaanAI AI Verification Core",
        "version": settings.VERSION,
        "database": "MongoDB Atlas Connected",
        "engine": "TF-IDF Transformer + Ridge Classifier + Risk Fusion"
    }

@app.get("/history")
async def get_scan_history(limit: int = 20):
    scans = await get_recent_scans(limit=limit)
    return {
        "total_returned": len(scans),
        "history": scans
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
