from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_engine import ai_engine
import re

router = APIRouter(prefix="/sms", tags=["SMS Analyzer"])

class SmsScanRequest(BaseModel):
    sender: str
    body: str

class SmsScanResponse(BaseModel):
    score: int
    confidence: int
    verdict: str
    details: dict
    aiExplanation: str
    suggestedAction: str

@router.post("/analyze", response_model=SmsScanResponse)
async def analyze_sms(req: SmsScanRequest):
    if not req.sender or not req.body:
        raise HTTPException(status_code=400, detail="Sender ID and Body contents are required.")

    # 1. SMS Header/Mask heuristics
    sender_clean = req.sender.upper().strip()
    is_numeric = sender_clean.replace("+", "").replace(" ", "").isdigit()
    
    metadata_risk = 0.0
    otp_detected = False
    upi_details = None
    
    # If the sender is an unknown numeric number instead of a bank registered mask
    if is_numeric:
        metadata_risk += 20.0
        
    # Check bank mask structures
    bank_impersonation = False
    bank_keywords = ["KOTAK", "SBI", "ICICI", "HDFC", "AXIS", "PNB", "PAYTM"]
    if any(k in sender_clean for k in bank_keywords):
        # Impersonating a bank mask
        bank_impersonation = True
        
    # 2. Text heuristics (OTP / UPI)
    body_lower = req.body.lower()
    
    if "otp" in body_lower or "one time password" in body_lower:
        otp_detected = True
        metadata_risk += 30.0
        
    if "upi" in body_lower or "transfer" in body_lower or "request" in body_lower:
        upi_details = "Requesting money authorization via message context"
        metadata_risk += 20.0

    # Short links checks
    urls = re.findall(r'https?://[^\s<>"]+|www\.[^\s<>"]+', req.body)
    short_links = []
    short_domains = ["in", "xyz", "cc", "top", "online", "bit.ly", "tinyurl"]
    for url in urls:
        if any(f".{d}" in url.lower() or f"/{d}" in url.lower() for d in short_domains):
            short_links.append(url)
            metadata_risk += 15.0

    # 3. AI Semantic Classifier
    semantic_score, match_category = ai_engine.calculate_semantic_threat(req.body)
    
    # 4. Urgency count
    urgency_words = ai_engine.scan_for_urgency_keywords(req.body)
    
    # 5. Risk Fusion Synthesis
    final_score, verdict = ai_engine.resolve_risk_fusion(
        channel_type="sms",
        semantic_score=semantic_score,
        urgency_count=len(urgency_words),
        metadata_risk_weight=metadata_risk
    )
    
    confidence = int(92 + (final_score / 15)) if verdict != "Safe" else 96

    # 6. Explanation compilations
    if verdict == "Critical":
        explanation = f"High-risk SMS fraud detected matching '{match_category}' signatures. The sender uses bank impersonation techniques with urgency cues and directs targets to unverified OTP/UPI short links."
        action = "Block sender ID immediately. Do NOT authorize any OTP or click the link. Report this instance to cybersecurity regulators."
    elif verdict == "Warning":
        explanation = "Alert: Message features phishing keywords and OTP verification markers. Urgency metrics are moderate."
        action = "Confirm with the official bank service helpline. Avoid sharing numeric codes."
    else:
        explanation = "Standard SMS configuration. No transaction scam patterns triggered."
        action = "Clear transaction log."

    return SmsScanResponse(
        score=final_score,
        confidence=min(confidence, 99),
        verdict=verdict,
        details={
            "urgencyLevel": "High" if len(urgency_words) > 1 else "Medium" if urgency_words else "Low",
            "otpDetected": otp_detected,
            "upiDetails": upi_details,
            "suspiciousLinks": short_links,
            "suspiciousPhrases": urgency_words
        },
        aiExplanation=explanation,
        suggestedAction=action
    )
