from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import PyMongoError
from app.config import settings
from datetime import datetime
import logging

logger = logging.getLogger("PramaanAI.Database")

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

db_manager = MongoDB()

async def connect_to_mongo():
    """
    Establishes connection pool to MongoDB Atlas cluster.
    """
    try:
        print(f"[MongoDB Atlas] Connecting to cluster...")
        db_manager.client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=5000)
        db_manager.db = db_manager.client[settings.DATABASE_NAME]
        
        # Test ping to cluster
        await db_manager.client.admin.command('ping')
        print(f"[MongoDB Atlas] Successfully connected to MongoDB Atlas! Database: '{settings.DATABASE_NAME}'")
        return True
    except Exception as e:
        print(f"[MongoDB Atlas] Warning: Connection to Atlas failed ({e}). Engine will fallback gracefully.")
        return False

async def close_mongo_connection():
    if db_manager.client:
        db_manager.client.close()
        print("[MongoDB Atlas] Connection closed.")

async def log_scan_event(channel: str, req_data: dict, result_data: dict):
    """
    Stores threat scan analysis events in 'scan_logs' collection.
    """
    if db_manager.db is None:
        return None
    try:
        document = {
            "channel": channel,
            "request_payload": req_data,
            "result": result_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        res = await db_manager.db["scan_logs"].insert_one(document)
        return str(res.inserted_id)
    except PyMongoError as e:
        logger.error(f"Failed to log scan event to MongoDB: {e}")
        return None

async def log_ml_prediction(text: str, result_data: dict):
    """
    Stores ML prediction queries in 'ml_predictions' collection.
    """
    if db_manager.db is None:
        return None
    try:
        document = {
            "text": text,
            "result": result_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        res = await db_manager.db["ml_predictions"].insert_one(document)
        return str(res.inserted_id)
    except PyMongoError as e:
        logger.error(f"Failed to log ML prediction to MongoDB: {e}")
        return None

async def get_recent_scans(limit: int = 20):
    """
    Retrieves the most recent threat scan logs from MongoDB Atlas.
    """
    if db_manager.db is None:
        return []
    try:
        cursor = db_manager.db["scan_logs"].find({}, {"_id": 0}).sort("timestamp", -1).limit(limit)
        return await cursor.to_list(length=limit)
    except PyMongoError as e:
        logger.error(f"Failed to fetch recent scans from MongoDB: {e}")
        return []
