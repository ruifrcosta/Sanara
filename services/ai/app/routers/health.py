from fastapi import APIRouter, HTTPException, Depends
from app.models.health import (
    HealthAnalysisRequest,
    HealthAnalysisResponse,
    MedicalReportRequest,
    MedicalReportResponse
)
from app.services.health_analysis import HealthAnalysisService
from app.utils.logger import get_logger

router = APIRouter(prefix="/health", tags=["health"])
logger = get_logger(__name__)

async def get_health_service() -> HealthAnalysisService:
    return HealthAnalysisService()

@router.post("/analyze", response_model=HealthAnalysisResponse)
async def analyze_symptoms(
    request: HealthAnalysisRequest,
    service: HealthAnalysisService = Depends(get_health_service)
):
    """
    Analyze symptoms and provide health insights.
    """
    try:
        return await service.analyze_symptoms(request)
    except Exception as e:
        logger.error("Failed to analyze symptoms", error=e)
        raise HTTPException(
            status_code=500,
            detail="Failed to analyze symptoms"
        )

@router.post("/report", response_model=MedicalReportResponse)
async def generate_medical_report(
    request: MedicalReportRequest,
    service: HealthAnalysisService = Depends(get_health_service)
):
    """
    Generate a medical report based on consultation data.
    """
    try:
        return await service.generate_medical_report(request)
    except Exception as e:
        logger.error("Failed to generate medical report", error=e)
        raise HTTPException(
            status_code=500,
            detail="Failed to generate medical report"
        ) 