from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import uvicorn
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import torch
from datetime import datetime
import logging
import json

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Healthcare AI Service API",
    description="API para serviços avançados de Inteligência Artificial em saúde",
    version="1.0.0"
)

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class TextInput(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    language: Optional[str] = Field(default="pt", max_length=2)

class HealthAnalysisInput(BaseModel):
    symptoms: List[str] = Field(..., min_items=1)
    patient_history: Optional[str] = None
    age: Optional[int] = Field(None, ge=0, le=120)
    gender: Optional[str] = Field(None, pattern="^(M|F|O)$")

class SentimentResponse(BaseModel):
    sentiment: str
    score: float
    timestamp: datetime
    language: str

class TextClassificationResponse(BaseModel):
    label: str
    score: float
    timestamp: datetime

class HealthAnalysisResponse(BaseModel):
    possible_conditions: List[Dict[str, float]]
    risk_level: str
    recommendations: List[str]
    confidence_score: float
    timestamp: datetime

# Inicialização dos modelos
class AIModels:
    def __init__(self):
        self.sentiment_analyzer = pipeline(
            "sentiment-analysis",
            model="nlptown/bert-base-multilingual-uncased-sentiment",
            device=0 if torch.cuda.is_available() else -1
        )
        
        self.text_classifier = pipeline(
            "text-classification",
            model="bert-base-multilingual-uncased",
            device=0 if torch.cuda.is_available() else -1
        )
        
        self.health_classifier = pipeline(
            "zero-shot-classification",
            model="facebook/bart-large-mnli",
            device=0 if torch.cuda.is_available() else -1
        )

        logger.info("AI models initialized successfully")

# Instância global dos modelos
ai_models = AIModels()

# Dependency para rate limiting
async def check_rate_limit():
    # Implementar lógica de rate limiting aqui
    pass

@app.get("/")
async def root():
    return {
        "message": "Bem-vindo ao Serviço de IA para Saúde",
        "version": "1.0.0",
        "status": "operational",
        "models_loaded": ["sentiment_analysis", "text_classification", "health_classification"]
    }

@app.post("/analyze/sentiment", response_model=SentimentResponse)
async def analyze_sentiment(
    input_data: TextInput,
    rate_limit: None = Depends(check_rate_limit)
):
    try:
        logger.info(f"Processing sentiment analysis for text in {input_data.language}")
        result = ai_models.sentiment_analyzer(input_data.text)[0]
        
        return SentimentResponse(
            sentiment=result["label"],
            score=float(result["score"]),
            timestamp=datetime.now(),
            language=input_data.language
        )
    except Exception as e:
        logger.error(f"Error in sentiment analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/classify/text", response_model=TextClassificationResponse)
async def classify_text(
    input_data: TextInput,
    rate_limit: None = Depends(check_rate_limit)
):
    try:
        logger.info(f"Processing text classification for text in {input_data.language}")
        result = ai_models.text_classifier(input_data.text)[0]
        
        return TextClassificationResponse(
            label=result["label"],
            score=float(result["score"]),
            timestamp=datetime.now()
        )
    except Exception as e:
        logger.error(f"Error in text classification: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/health", response_model=HealthAnalysisResponse)
async def analyze_health_condition(
    input_data: HealthAnalysisInput,
    rate_limit: None = Depends(check_rate_limit)
):
    try:
        logger.info("Processing health condition analysis")
        
        # Preparar o texto para análise
        symptoms_text = ", ".join(input_data.symptoms)
        full_text = f"Symptoms: {symptoms_text}"
        if input_data.patient_history:
            full_text += f"\nHistory: {input_data.patient_history}"
        
        # Lista de possíveis condições médicas para classificação
        candidate_conditions = [
            "Gripe",
            "Resfriado",
            "COVID-19",
            "Alergia",
            "Sinusite",
            "Bronquite",
            "Ansiedade",
            "Estresse",
            "Depressão",
            "Enxaqueca"
        ]
        
        # Classificar o texto contra as possíveis condições
        result = ai_models.health_classifier(
            full_text,
            candidate_conditions,
            multi_label=True
        )
        
        # Organizar resultados
        conditions = [
            {"condition": label, "probability": score}
            for label, score in zip(result["labels"], result["scores"])
        ]
        conditions.sort(key=lambda x: x["probability"], reverse=True)
        
        # Determinar nível de risco
        max_prob = max(result["scores"])
        risk_level = "alto" if max_prob > 0.8 else "médio" if max_prob > 0.5 else "baixo"
        
        # Gerar recomendações básicas
        recommendations = [
            "Procure um médico para uma avaliação adequada",
            "Mantenha-se hidratado",
            "Descanse adequadamente",
            "Monitore seus sintomas"
        ]
        
        return HealthAnalysisResponse(
            possible_conditions=conditions[:3],  # Top 3 condições mais prováveis
            risk_level=risk_level,
            recommendations=recommendations,
            confidence_score=float(max_prob),
            timestamp=datetime.now()
        )
    except Exception as e:
        logger.error(f"Error in health condition analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(),
        "gpu_available": torch.cuda.is_available(),
        "models_loaded": True
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        workers=4
    ) 