from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

client: AsyncIOMotorClient = None
db = None


async def connect_db():
    global client, db
    try:
        # Add server selection timeout of 5 seconds to avoid infinite hangs
        client = AsyncIOMotorClient(settings.mongodb_uri, serverSelectionTimeoutMS=5000)
        db = client[settings.database_name]
        
        # Verify connection by pinging the database
        await client.admin.command('ping')
        print(f"Successfully connected to MongoDB database: {settings.database_name}")
        
        # Create compound index for history queries (sort by timestamp desc for specific user)
        await db.analyses.create_index([("user_id", 1), ("timestamp", -1)])
        
        # Create TTL index on otps to automatically delete expired entries after 5 mins
        await db.otps.create_index("expire_at", expireAfterSeconds=0)
        print("MongoDB indexes created/verified successfully")
    except Exception as e:
        print(f"CRITICAL ERROR: Failed to connect to MongoDB: {e}")
        # Raise exception to halt lifespan startup if database is down
        raise e


async def close_db():
    global client
    if client:
        client.close()
        print("MongoDB connection closed")


def get_db():
    return db
