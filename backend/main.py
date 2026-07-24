from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import email, sms, call, document

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="PramaanAI - Unified Threat Fusion engine for cybersecurity validation."
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

@app.get("/")
async def root():
    return {
        "status": "healthy",
        "service": "PramaanAI AI Verification Core",
        "version": settings.VERSION,
        "engine": "TF-IDF Similarities + Risk Fusion Core"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
