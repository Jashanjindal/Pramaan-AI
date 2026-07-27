import asyncio
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# Load .env settings
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".env"))
load_dotenv(dotenv_path=env_path)

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb+srv://anshiag7206_db_user:KVR52VnMvveiqf0s@pramaan.mmeciht.mongodb.net/pramaan_db?retryWrites=true&w=majority&appName=Pramaan")
DATABASE_NAME = os.getenv("DATABASE_NAME", "pramaan_db")

async def test_mongodb():
    print("=" * 60)
    print(" [MongoDB Atlas Connection & Integration Test] ")
    print(f"Connecting to URI: {MONGODB_URL[:45]}...")
    
    try:
        client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=10000)
        db = client[DATABASE_NAME]
        
        # Ping cluster admin command
        ping_res = await client.admin.command('ping')
        print(f"[SUCCESS] MongoDB Atlas Cluster Ping Response: {ping_res}")
        
        # Test document insert into test_connection collection
        test_col = db["connection_test"]
        test_doc = {
            "service": "PramaanAI Backend",
            "message": "Testing MongoDB Atlas cluster integration",
            "status": "connected"
        }
        res = await test_col.insert_one(test_doc)
        print(f"[SUCCESS] Inserted test document into '{DATABASE_NAME}.connection_test' (ID: {res.inserted_id})")
        
        # Query inserted document
        retrieved = await test_col.find_one({"_id": res.inserted_id})
        print(f"[SUCCESS] Successfully retrieved inserted document from Atlas: {retrieved['message']}")
        
        # Clean up test doc
        await test_col.delete_one({"_id": res.inserted_id})
        print("[SUCCESS] Cleaned up temporary test document.")
        
        client.close()
        print("=" * 60)
        print("[SUCCESS] MongoDB Atlas cluster is 100% operational and ready!")
        print("=" * 60)
        return True
    except Exception as e:
        print(f"[ERROR] Failed to connect to MongoDB Atlas: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(test_mongodb())
