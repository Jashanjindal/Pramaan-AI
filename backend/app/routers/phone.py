from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_engine import ai_engine

router = APIRouter(prefix="/phone", tags=["Phone Number Verifier"])

class PhoneVerifyRequest(BaseModel):
    phone: str

class PhoneVerifyResponse(BaseModel):
    phone: str
    valid: bool
    lineType: str
    carrier: str
    country: str
    isVoip: bool
    trustScore: int
    reputationVerdict: str
    details: dict

@router.post("/verify", response_model=PhoneVerifyResponse)
async def verify_phone_number(req: PhoneVerifyRequest):
    if not req.phone or len(req.phone.strip()) < 3:
        raise HTTPException(status_code=400, detail="Phone number input is required.")

    # Query Phone Intelligence API
    intel = ai_engine.validate_phone_number(req.phone)
    
    is_voip = intel.get("isVoip", False)
    is_valid = intel.get("valid", True)
    
    # Calculate Truecaller-style Trust Score
    trust_score = 95
    if is_voip:
        trust_score -= 45
    if not is_valid:
        trust_score -= 50
    if len(req.phone.strip()) < 8:
        trust_score -= 25

    trust_score = max(min(trust_score, 99), 10)

    if trust_score >= 80:
        verdict = "Real & Authentic Carrier Number"
    elif trust_score >= 50:
        verdict = "Unverified / Virtual Line Warning"
    else:
        verdict = "High-Risk Suspicious / Spoofed Number"

    return PhoneVerifyResponse(
        phone=req.phone,
        valid=is_valid,
        lineType=intel.get("lineType", "MOBILE"),
        carrier=intel.get("carrier", "Verified Telecom Network"),
        country=intel.get("country", "International"),
        isVoip=is_voip,
        trustScore=trust_score,
        reputationVerdict=verdict,
        details={
            "riskWeight": intel.get("riskWeight", 0.0),
            "recommendation": "Safe to communicate." if trust_score >= 80 else "Exercise caution. Do not share sensitive OTP or financial credentials."
        }
    )
