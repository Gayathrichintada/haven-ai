from datetime import datetime

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from app.database import users_collection
from app.security import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter()


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/register")
async def register(request: RegisterRequest):

    existing_user = users_collection.find_one(
        {"email": request.email}
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user = {
        "name": request.name,
        "email": request.email,
        "password": hash_password(
            request.password
        ),
        "created_at": datetime.utcnow()
    }

    result = users_collection.insert_one(user)

    token = create_access_token(
        {"user_id": str(result.inserted_id)}
    )

    return {
        "access_token": token,
        "user_id": str(result.inserted_id)
    }


@router.post("/login")
async def login(request: LoginRequest):

    user = users_collection.find_one(
        {"email": request.email}
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not verify_password(
        request.password,
        user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_access_token(
        {"user_id": str(user["_id"])}
    )

    return {
        "access_token": token,
        "user_id": str(user["_id"])
    }