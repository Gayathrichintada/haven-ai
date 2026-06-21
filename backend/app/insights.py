from fastapi import APIRouter
from collections import Counter

from app.database import conversations_collection

router = APIRouter()


@router.get("/insights/{profile_id}")
async def get_insights(profile_id: str):
    conversations = list(
        conversations_collection.find(
            {"profile_id": profile_id}
        ).sort("timestamp", -1)
    )

    moods = [
        item.get("mood", "neutral")
        for item in conversations
        if item.get("mood")
    ]

    if not moods:
        return {
            "dominant_mood": "neutral",
            "mood_history": []
        }

    dominant_mood = Counter(moods).most_common(1)[0][0]

    mood_history = [
        {
            "mood": item.get("mood", "neutral"),
            "timestamp": item["timestamp"]
        }
        for item in conversations[:10]
    ]

    mood_history.reverse()

    return {
        "dominant_mood": dominant_mood,
        "mood_history": mood_history
    }