import traceback
from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from datetime import datetime, timezone
from database import get_db
from models import AnalysisRequest, AnalysisDocument, PivotRequest, PivotResponse
from services.gemini_service import analyze_idea, generate_pivot_strategies
from routers.auth import get_current_user

router = APIRouter(prefix="/api", tags=["analyses"])


def doc_to_dict(doc: dict) -> dict:
    """Convert MongoDB document to JSON-serializable dict."""
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    if isinstance(doc.get("timestamp"), datetime):
        doc["timestamp"] = doc["timestamp"].isoformat()
    return doc


@router.post("/analyze")
async def create_analysis(request: AnalysisRequest, user_id: str = Depends(get_current_user)):
    """Submit a startup idea for AI analysis and save result to MongoDB under current user."""
    print(f"\n--- [POST /api/analyze] Incoming Request ---")
    print(f"User ID: {user_id}")
    print(f"Idea Concept: {request.idea}")
    print(f"Description: {request.description}")

    if not request.idea.strip():
        print("Error: Request idea is empty")
        raise HTTPException(status_code=400, detail="Idea cannot be empty")

    try:
        print("Calling Gemini service for analysis...")
        result = await analyze_idea(request.idea, request.description or "")
        print("Gemini analysis completed successfully")
    except Exception as e:
        tb = traceback.format_exc()
        print(f"CRITICAL: Gemini analysis failed. Exception:\n{tb}")
        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {str(e)}"
        )

    doc = {
        "user_id": user_id,
        "idea_text": request.idea,
        "description": request.description or "",
        "analysis_results": result.model_dump(),
        "viability_score": result.viability_score,
        "timestamp": datetime.now(timezone.utc).replace(tzinfo=None),
    }

    try:
        print("Inserting analysis document into MongoDB...")
        db = get_db()
        inserted = await db.analyses.insert_one(doc)
        doc["id"] = str(inserted.inserted_id)
        doc["timestamp"] = doc["timestamp"].isoformat()
        del doc["_id"]
        print(f"Successfully saved analysis record. ID: {doc['id']}")
        return doc
    except Exception as e:
        tb = traceback.format_exc()
        print(f"CRITICAL: MongoDB insertion failed. Exception:\n{tb}")
        raise HTTPException(
            status_code=500,
            detail=f"Database save failed: {str(e)}"
        )


@router.post("/pivot", response_model=PivotResponse)
async def create_pivot(request: PivotRequest, user_id: str = Depends(get_current_user)):
    """Generate pivot strategies for a given startup idea."""
    print(f"\n--- [POST /api/pivot] Incoming Request ---")
    print(f"User ID: {user_id}")
    print(f"Idea: {request.idea}, Viability Score: {request.viability_score}")

    if not request.idea.strip():
        print("Error: Request idea is empty")
        raise HTTPException(status_code=400, detail="Idea cannot be empty")

    try:
        print("Calling Gemini service for pivot generation...")
        result = await generate_pivot_strategies(request.idea, request.viability_score)
        print("Gemini pivot generation completed successfully")
        return result
    except Exception as e:
        tb = traceback.format_exc()
        print(f"CRITICAL: Gemini pivot failed. Exception:\n{tb}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate pivot strategies: {str(e)}"
        )


@router.get("/history")
async def get_history(user_id: str = Depends(get_current_user)):
    """Return all saved analyses for the current user, newest first."""
    db = get_db()
    cursor = db.analyses.find({"user_id": user_id}).sort("timestamp", -1)
    results = []
    async for doc in cursor:
        results.append(doc_to_dict(doc))
    return results


@router.get("/history/{analysis_id}")
async def get_analysis(analysis_id: str, user_id: str = Depends(get_current_user)):
    """Return a single analysis by ID, ensuring it belongs to the user."""
    if not ObjectId.is_valid(analysis_id):
        raise HTTPException(status_code=400, detail="Invalid analysis ID")

    db = get_db()
    doc = await db.analyses.find_one({"_id": ObjectId(analysis_id), "user_id": user_id})

    if not doc:
        raise HTTPException(status_code=404, detail="Analysis not found or unauthorized")

    return doc_to_dict(doc)


@router.delete("/history/{analysis_id}")
async def delete_analysis(analysis_id: str, user_id: str = Depends(get_current_user)):
    """Delete a single analysis by ID, ensuring it belongs to the user."""
    if not ObjectId.is_valid(analysis_id):
        raise HTTPException(status_code=400, detail="Invalid analysis ID")

    db = get_db()
    result = await db.analyses.delete_one({"_id": ObjectId(analysis_id), "user_id": user_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Analysis not found or unauthorized")

    return {"message": "Analysis deleted successfully"}
