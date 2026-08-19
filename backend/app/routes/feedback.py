from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.feedback import CreateFeedbackRequest, FeedbackResponse
from app.dependencies.auth import get_current_user
from app.services.feedback_service import feedback_service

router = APIRouter(prefix="/api/feedback", tags=["Customer Feedback"])

@router.post("", response_model=FeedbackResponse)
async def submit_feedback(body: CreateFeedbackRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    try:
        return feedback_service.create_feedback(user_id, body.order_id, body.rating, body.comment)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/my", response_model=List[FeedbackResponse])
async def get_my_feedback(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("id")
    return feedback_service.get_user_feedback(user_id)
