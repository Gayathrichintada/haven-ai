import os
import io
import json
from pathlib import Path

from dotenv import load_dotenv

from fastapi import (
    APIRouter,
    HTTPException,
    Form,
    File,
    UploadFile,
)

from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
)

from PIL import Image

import google.genai as genai

from app.database import (
    conversations_collection,
    chat_sessions_collection,
)

from app.prompt_builder import build_prompt

from app.memory_service import (
    save_conversation,
    get_recent_memories,
    get_conversation_history,
    get_chat_sessions,
)

from app.mood_service import detect_mood


env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found.")

client = genai.Client(api_key=api_key)

router = APIRouter()


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(
        multiplier=1,
        min=2,
        max=10,
    ),
    reraise=True,
)
def generate_response(contents):
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=contents,
        )

        return response.text

    except Exception as e:
        print(f"Primary model failed: {str(e)}")

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=contents,
        )

        return response.text


@router.post("/chat")
async def chat(
    message: str = Form(...),
    profile_id: str = Form(...),
    chat_id: str = Form(...),
    profile: str = Form(...),
    image: UploadFile | None = File(None),
):
    try:
        profile_data = json.loads(profile)

        memories = get_recent_memories(profile_id)

        prompt = build_prompt(
            message=message,
            profile=profile_data,
            memories=memories,
        )

        contents = [prompt]

        if image:
            image_bytes = await image.read()

            pil_image = Image.open(
                io.BytesIO(image_bytes)
            )

            contents.append(pil_image)

        reply = generate_response(contents)

        if not reply:
            reply = (
                "I'm here for you. "
                "Could you tell me a little more?"
            )

        mood = detect_mood(message)

        save_conversation(
            profile_id=profile_id,
            chat_id=chat_id,
            user_message=message,
            ai_reply=reply,
            mood=mood,
        )

        return {"reply": reply}

    except Exception as e:
        error = str(e)

        print(f"Chat Error: {error}")

        if (
            "429" in error
            or "RESOURCE_EXHAUSTED" in error
        ):
            raise HTTPException(
                status_code=429,
                detail=(
                    "Haven has reached its Gemini usage limit. "
                    "Please try again shortly."
                ),
            )

        if (
            "503" in error
            or "UNAVAILABLE" in error
        ):
            raise HTTPException(
                status_code=503,
                detail=(
                    "Haven is experiencing high demand right now. "
                    "Please try again in a minute."
                ),
            )

        raise HTTPException(
            status_code=500,
            detail="Something went wrong while talking to Haven.",
        )


@router.get("/chat-sessions/{profile_id}")
async def chat_sessions(profile_id: str):
    sessions = get_chat_sessions(profile_id)

    return {"sessions": sessions}


@router.get("/conversations/{profile_id}/{chat_id}")
async def get_conversations(
    profile_id: str,
    chat_id: str,
):
    history = get_conversation_history(
        profile_id,
        chat_id,
    )

    return {"messages": history}


@router.delete("/chat-session/{chat_id}")
async def delete_chat(chat_id: str):
    conversations_collection.delete_many(
        {"chat_id": chat_id}
    )

    chat_sessions_collection.delete_one(
        {"_id": chat_id}
    )

    return {"success": True}
