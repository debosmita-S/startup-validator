from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta, timezone
import jwt
import random
import bcrypt
from bson import ObjectId
from config import settings
from database import get_db
from models import OTPRequest, OTPVerify, User, Token

router = APIRouter(prefix="/api/auth", tags=["auth"])

security = HTTPBearer()

# JWT Settings
SECRET_KEY = settings.jwt_secret
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc).replace(tzinfo=None) + expires_delta
    else:
        expire = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")


@router.post("/request-otp")
async def request_otp(req: OTPRequest):
    """Generate a 6-digit OTP, store it uniquely for the identifier, and print to console."""
    if not req.identifier.strip():
        raise HTTPException(status_code=400, detail="Identifier cannot be empty")

    otp = str(random.randint(100000, 999999))
    
    # Hash OTP directly with bcrypt
    otp_bytes = otp.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_otpBytes = bcrypt.hashpw(otp_bytes, salt)
    hashed_otp = hashed_otpBytes.decode('utf-8')
    
    expire_at = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(minutes=5)

    db = get_db()
    # Upsert the OTP document
    await db.otps.update_one(
        {"identifier": req.identifier},
        {"$set": {"hashed_otp": hashed_otp, "expire_at": expire_at}},
        upsert=True
    )

    import os
    try:
        debug_dir = os.path.dirname(os.path.dirname(__file__))
        with open(os.path.join(debug_dir, "otp_debug.txt"), "w") as f:
            f.write(otp)
    except Exception as e:
        print(f"Failed to write debug OTP file: {e}")

    # SIMULATION: Send OTP via SMS or Email
    print("\n" + "="*50)
    print("SIMULATED OTP DELIVERY")
    print(f"To: {req.identifier}")
    print(f"Your Startup Idea Validator code is: {otp}")
    print("="*50 + "\n")

    return {"message": "OTP sent successfully"}


@router.post("/verify-otp", response_model=Token)
async def verify_otp(req: OTPVerify):
    """Verify the 6-digit OTP and return a JWT access token. Create user if needed."""
    if not req.identifier.strip() or not req.otp.strip():
        raise HTTPException(status_code=400, detail="Identifier and OTP are required")

    db = get_db()
    otp_doc = await db.otps.find_one({"identifier": req.identifier})

    if not otp_doc:
        raise HTTPException(status_code=400, detail="No OTP requested for this identifier")

    if datetime.now(timezone.utc).replace(tzinfo=None) > otp_doc["expire_at"]:
        await db.otps.delete_one({"_id": otp_doc["_id"]})
        raise HTTPException(status_code=400, detail="OTP expired")

    # Verify OTP directly with bcrypt
    otp_bytes = req.otp.encode('utf-8')
    hashed_otpBytes = otp_doc["hashed_otp"].encode('utf-8')
    
    is_valid = bcrypt.checkpw(otp_bytes, hashed_otpBytes)

    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    # OTP is valid, delete it
    await db.otps.delete_one({"_id": otp_doc["_id"]})

    # Find or create user
    user_doc = await db.users.find_one({"identifier": req.identifier})
    
    if not user_doc:
        user = User(identifier=req.identifier)
        user_dict = user.model_dump()
        inserted = await db.users.insert_one(user_dict)
        user_id = str(inserted.inserted_id)
    else:
        user_id = str(user_doc["_id"])

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_id, "identifier": req.identifier}, 
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}
