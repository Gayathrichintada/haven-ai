from fastapi import APIRouter
from app.database import db

router = APIRouter()

conversations_collection = db["conversations"]


@router.get("/conversations/{profile_id}")
async def get_conversations(profile_id: str):
    conversations = list(
        conversations_collection.find(
            {"profile_id": profile_id},
            {"_id": 0}
        ).sort("timestamp", -1)
    )

    return conversations