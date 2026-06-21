from typing import List, Optional

from fastapi import APIRouter
from pydantic import BaseModel

from app.database import db
from app.profile_service import save_profile
from fastapi import HTTPException

from app.profile_service import (
    get_profile,
    update_profile,
)

router = APIRouter()

profiles_collection = db["profiles"]


class ProfileRequest(BaseModel):
    user_id: str
    name: str
    role: str

    field: Optional[str] = ""
    year: Optional[str] = ""

    goals: List[str]

    support_style: str


@router.post("/profile")
def create_profile(data: ProfileRequest):
    profile_id = save_profile(data.dict())

    return {
        "success": True,
        "_id": profile_id,
        "profile_id": profile_id
    }

@router.get("/profile/{user_id}/exists")
def profile_exists(user_id: str):
    profile = profiles_collection.find_one(
        {"user_id": user_id}
    )

    return {
        "exists": profile is not None
    }
@router.get("/profile/{user_id}")
async def fetch_profile(user_id: str):
    profile = get_profile(user_id)

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    return profile
@router.put("/profile/{user_id}")
async def edit_profile(
    user_id: str,
    data: dict
):
    update_profile(user_id, data)

    return {
        "success": True
    }