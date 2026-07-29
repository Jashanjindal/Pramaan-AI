from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_engine import ai_engine

router = APIRouter(prefix="/call", tags=["Call Analyzer"])

class CallScanRequest(BaseModel):
    caller: str
    transcript: str

class CallScanResponse(BaseModel):
    score: int
    confidence: int
    verdict: str
    details: dict
    aiExplanation: str
    suggestedAction: str

@router.post("/analyze", response_model=CallScanResponse)
async def analyze_call(req: CallScanRequest):
    if not req.caller or not req.transcript:
        raise HTTPException(status_code=400, detail="Caller details and transcript dialog are required.")

    # Heuristics for Call Metadata / VoIP trust
    caller_lower = req.caller.lower()
    metadata_risk = 0.0
    trust_score = 85
    
    if "voip" in caller_lower or "unknown" in caller_lower or "spoofed" in caller_lower:
        metadata_risk += 25.0
        trust_score -= 40
    elif len(req.caller) < 8:
        metadata_risk += 15.0
        trust_score -= 20

    # Parse for manipulation techniques
    manipulations = []
    
    body_lower = req.transcript.lower()
    
    if "warrant" in body_lower or "arrest" in body_lower or "jail" in body_lower or "police" in body_lower:
        manipulations.append("Authority Impersonation & Extortion")
        metadata_risk += 20.0
        
    if "compliance" in body_lower or "audit" in body_lower or "legal penalty" in body_lower:
        manipulations.append("Compliance Pressure")
        metadata_risk += 15.0
        
    if "wire transfer" in body_lower or "escrow" in body_lower or "reserve account" in body_lower:
        manipulations.append("Escrow Transfer Mandates")
        metadata_risk += 20.0

    if not manipulations:
        manipulations.append("Standard conversational parameters")
        trust_score = max(trust_score, 90)
    else:
        trust_score = max(trust_score - (len(manipulations) * 15), 10)

    # 3. AI Semantic Classifier
    semantic_score, match_category = ai_engine.calculate_semantic_threat(req.transcript)
    
    # 4. Urgency count
    urgency_words = ai_engine.scan_for_urgency_keywords(req.transcript)
    
    # 5. Risk Fusion Synthesis
    final_score, verdict = ai_engine.resolve_risk_fusion(
        channel_type="call",
        semantic_score=semantic_score,
        urgency_count=len(urgency_words),
        metadata_risk_weight=metadata_risk
    )
    
    confidence = int(88 + (final_score / 12)) if verdict != "Safe" else 92

    # 6. Explanations
    llm_expl = ai_engine.generate_llm_explanation("call", req.transcript, verdict, final_score)
    if llm_expl:
        explanation = llm_expl
        action = "Hang up immediately. Terminate communications and report to legal compliance/fraud hotlines."
    elif verdict == "Critical":
        explanation = f"VoIP Social Engineering scam detected matching '{match_category}' vectors. The speaker uses high pressure legal compliance threats to force the target into wire transfer escrow conversion."
        action = "Hang up the phone call immediately. Do NOT authorize bank transfers or share identity logs. Report number to local fraud hotlines."
    elif verdict == "Warning":
        explanation = "Alert: Script contains warning patterns regarding legal penalties or escrow deposits. VoIP metrics indicate unverified Caller ID."
        action = "Terminate connection. Verify identity through registered support channels."
    else:
        explanation = "Conversational metrics within normal safe baseline. No extortion markers found."
        action = "Safe clearance."

    return CallScanResponse(
        score=final_score,
        confidence=min(confidence, 99),
        verdict=verdict,
        details={
            "callerName": req.caller,
            "trustScore": trust_score,
            "manipulationTechniques": manipulations,
            "suspiciousPhrases": urgency_words
        },
        aiExplanation=explanation,
        suggestedAction=action
    )
