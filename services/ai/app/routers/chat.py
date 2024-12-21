from fastapi import APIRouter, HTTPException, Depends
from app.models.chat import (
    ChatAnalysisRequest,
    ChatAnalysisResponse,
    ChatSummaryRequest,
    ChatSummaryResponse
)
from app.services.chat_analysis import ChatAnalysisService
from app.utils.logger import get_logger

router = APIRouter(prefix="/chat", tags=["chat"])
logger = get_logger(__name__)

async def get_chat_service() -> ChatAnalysisService:
    return ChatAnalysisService()

@router.post("/analyze", response_model=ChatAnalysisResponse)
async def analyze_chat(
    request: ChatAnalysisRequest,
    service: ChatAnalysisService = Depends(get_chat_service)
):
    """
    Analyze chat messages and provide insights.
    """
    try:
        return await service.analyze_chat(request)
    except Exception as e:
        logger.error("Failed to analyze chat", error=e)
        raise HTTPException(
            status_code=500,
            detail="Failed to analyze chat"
        )

@router.post("/summary", response_model=ChatSummaryResponse)
async def generate_chat_summary(
    request: ChatSummaryRequest,
    service: ChatAnalysisService = Depends(get_chat_service)
):
    """
    Generate a summary of the chat conversation.
    """
    try:
        return await service.generate_summary(request)
    except Exception as e:
        logger.error("Failed to generate chat summary", error=e)
        raise HTTPException(
            status_code=500,
            detail="Failed to generate chat summary"
        ) 