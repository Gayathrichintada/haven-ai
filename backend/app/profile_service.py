from bson import ObjectId

from app.database import db

profiles_collection = db["profiles"]


def save_profile(profile_data):
    result = profiles_collection.insert_one(
        profile_data
    )

    return str(result.inserted_id)


def profile_exists(user_id: str):
    profile = profiles_collection.find_one(
        {"user_id": user_id}
    )

    return profile is not None
def get_profile(user_id: str):
    profile = profiles_collection.find_one(
        {"user_id": user_id}
    )

    if profile:
        profile["_id"] = str(profile["_id"])

    return profile


def update_profile(
    user_id: str,
    profile_data: dict
):
    profiles_collection.update_one(
        {"user_id": user_id},
        {"$set": profile_data}
    )