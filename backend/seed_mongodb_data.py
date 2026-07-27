import asyncio
import os
from datetime import datetime
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".env"))
load_dotenv(dotenv_path=env_path)

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb+srv://anshiag7206_db_user:KVR52VnMvveiqf0s@pramaan.mmeciht.mongodb.net/pramaan_db?retryWrites=true&w=majority&appName=Pramaan")
DATABASE_NAME = os.getenv("DATABASE_NAME", "pramaan_db")

async def seed_data():
    print(f"Connecting to MongoDB Atlas: {MONGODB_URL[:45]}...")
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    
    # 1. Insert sample scan log
    scan_col = db["scan_logs"]
    sample_scan = {
        "channel": "sms",
        "request_payload": {
            "sender": "KOTAK-ALERT",
            "body": "WINNER!! As a valued network customer you have been selected to receive a £900 prize reward! Claim code KL341."
        },
        "result": {
            "score": 89,
            "verdict": "Critical",
            "confidence": 97,
            "aiExplanation": "High-risk SMS fraud detected matching bank impersonation and prize reward scam patterns."
        },
        "timestamp": datetime.utcnow().isoformat()
    }
    scan_res = await scan_col.insert_one(sample_scan)
    print(f"[SUCCESS] Inserted sample scan log into 'scan_logs' collection (ID: {scan_res.inserted_id})")

    # 2. Insert sample ML prediction log
    ml_col = db["ml_predictions"]
    sample_ml = {
        "text": "WINNER!! Claim your free £900 prize now!",
        "result": {
            "spamProbability": 99.98,
            "prediction": "spam",
            "confidence": 99.98,
            "ridsRiskScore": 89,
            "ridsVerdict": "Critical",
            "modelType": "TF-IDF Transformer + Ridge Classifier (Calibrated)"
        },
        "timestamp": datetime.utcnow().isoformat()
    }
    ml_res = await ml_col.insert_one(sample_ml)
    print(f"[SUCCESS] Inserted sample ML prediction into 'ml_predictions' collection (ID: {ml_res.inserted_id})")

    print("\n[SUCCESS] Seeding complete! Database 'pramaan_db' and collections 'scan_logs' & 'ml_predictions' are now populated in MongoDB Atlas!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_data())
