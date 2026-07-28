from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.services.ai_engine import ai_engine
from app.services.train_model import train_and_save_model

router = APIRouter(prefix="/ml", tags=["ML Model Engine"])

class PredictRequest(BaseModel):
    text: str

class PredictResponse(BaseModel):
    text: str
    spamProbability: float
    prediction: str
    confidence: float
    ridsRiskScore: int
    ridsVerdict: str
    modelType: str

from app.database import log_ml_prediction

@router.post("/predict", response_model=PredictResponse)
async def predict_text(req: PredictRequest):
    if not req.text or not req.text.strip():
        raise HTTPException(status_code=400, detail="Text field cannot be empty.")

    spam_prob, pred_label, confidence = ai_engine.predict_ml_spam_probability(req.text)
    sem_score, _ = ai_engine.calculate_semantic_threat(req.text)
    urgency_list = ai_engine.scan_for_urgency_keywords(req.text)
    
    rids_score, rids_verdict = ai_engine.resolve_risk_fusion(
        channel_type="ml_predict",
        semantic_score=sem_score,
        urgency_count=len(urgency_list),
        metadata_risk_weight=0.0,
        text_content=req.text
    )

    model_type = "TF-IDF Transformer + Ridge Classifier (Calibrated)"
    if ai_engine.ml_metadata and "model_type" in ai_engine.ml_metadata:
        model_type = ai_engine.ml_metadata["model_type"]

    response_obj = PredictResponse(
        text=req.text,
        spamProbability=spam_prob,
        prediction=pred_label,
        confidence=confidence,
        ridsRiskScore=rids_score,
        ridsVerdict=rids_verdict,
        modelType=model_type
    )
    
    # Log prediction to MongoDB Atlas
    await log_ml_prediction(req.text, response_obj.model_dump())

    return response_obj

@router.get("/info")
async def get_model_info():
    if ai_engine.ml_metadata:
        return {
            "status": "loaded",
            "metadata": ai_engine.ml_metadata
        }
    return {
        "status": "not_loaded",
        "message": "Model binary not found. Please trigger training via POST /ml/train"
    }

@router.post("/train")
async def retrain_model():
    try:
        metadata, _ = train_and_save_model()
        ai_engine.load_ml_model()
        return {
            "status": "success",
            "message": "ML Model re-trained successfully on spam.csv",
            "metrics": metadata
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")
