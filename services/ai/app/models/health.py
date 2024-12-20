from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class Severity(str, Enum):
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    CRITICAL = "critical"

class Symptom(BaseModel):
    name: str
    description: str
    severity: Severity
    duration: Optional[str] = None
    frequency: Optional[str] = None

class HealthCondition(BaseModel):
    name: str
    description: str
    confidence_score: float = Field(ge=0.0, le=1.0)
    severity: Severity
    symptoms: List[str]
    recommendations: List[str]

class HealthAnalysisRequest(BaseModel):
    symptoms_description: str
    patient_age: Optional[int] = None
    patient_gender: Optional[str] = None
    medical_history: Optional[List[str]] = None

class HealthAnalysisResponse(BaseModel):
    analysis_id: str
    timestamp: datetime
    symptoms: List[Symptom]
    possible_conditions: List[HealthCondition]
    recommendations: List[str]
    disclaimer: str = "Esta análise é apenas para fins informativos e não substitui uma consulta médica profissional."

class MedicalReportRequest(BaseModel):
    consultation_id: str
    patient_id: str
    symptoms: List[str]
    observations: str
    diagnosis: Optional[str] = None
    treatment_plan: Optional[str] = None

class MedicalReportResponse(BaseModel):
    report_id: str
    consultation_id: str
    timestamp: datetime
    content: str
    summary: str
    recommendations: List[str] 