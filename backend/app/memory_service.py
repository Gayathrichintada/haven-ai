from datetime import datetime
from uuid import uuid4
from app.database import conversations_collection


def save_conversation(
    profile_id,
    chat_id,
    user_message,
    ai_reply,
    mood,
):
    conversations_collection.insert_one(
        {
            "profile_id": profile_id,
            "chat_id": chat_id,
            "user_message": user_message,
            "ai_reply": ai_reply,
            "mood": mood,
            "timestamp": datetime.utcnow(),
        }
    )


def get_recent_memories(
    profile_id,
    limit=10,
):
    memories = list(
        conversations_collection.find(
            {
                "profile_id": profile_id
            },
            {
                "_id": 0,
                "user_message": 1,
                "ai_reply": 1,
            },
        )
        .sort("timestamp", -1)
        .limit(int(limit))
    )

    return memories[::-1]


def get_recent_moods(
    profile_id,
    limit=10,
):
    moods = list(
        conversations_collection.find(
            {
                "profile_id": profile_id,
                "mood": {"$exists": True},
            },
            {
                "_id": 0,
                "mood": 1,
            },
        )
        .sort("timestamp", -1)
        .limit(limit)
    )

    return [m["mood"] for m in moods]


def get_conversation_history(
    profile_id,
    chat_id,
):
    return list(
        conversations_collection.find(
            {
                "profile_id": profile_id,
                "chat_id": chat_id,
            },
            {"_id": 0},
        ).sort("timestamp", 1)
    )
def get_chat_sessions(profile_id):
    pipeline = [
        {
            "$match": {
                "profile_id": profile_id
            }
        },
        {
            "$sort": {
                "timestamp": -1
            }
        },
        {
            "$group": {
                "_id": "$chat_id",
                "title": {
                    "$first": "$user_message"
                },
                "timestamp": {
                    "$first": "$timestamp"
                }
            }
        },
        {
            "$sort": {
                "timestamp": -1
            }
        }
    ]

    return list(
        conversations_collection.aggregate(
            pipeline
        )
    )