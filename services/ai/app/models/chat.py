from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class MessageRole(str, Enum):
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"
    PROFESSIONAL = "professional"

class MessageType(str, Enum):
    TEXT = "text"
    IMAGE = "image"
    FILE = "file"
    AUDIO = "audio"

class Message(BaseModel):
    id: str
    role: MessageRole
    type: MessageType = MessageType.TEXT
    content: str
    timestamp: datetime
    metadata: Optional[Dict[str, Any]] = None

class ChatAnalysisRequest(BaseModel):
    consultation_id: str
    messages: List[Message]
    context: Optional[Dict[str, Any]] = None

class SentimentScore(BaseModel):
    positive: float = Field(ge=0.0, le=1.0)
    neutral: float = Field(ge=0.0, le=1.0)
    negative: float = Field(ge=0.0, le=1.0)

class KeyPhrase(BaseModel):
    text: str
    relevance_score: float = Field(ge=0.0, le=1.0)
    category: Optional[str] = None

class Entity(BaseModel):
    text: str
    type: str
    confidence_score: float = Field(ge=0.0, le=1.0)
    metadata: Optional[Dict[str, Any]] = None

class ChatAnalysisResponse(BaseModel):
    analysis_id: str
    consultation_id: str
    timestamp: datetime
    sentiment: SentimentScore
    key_phrases: List[KeyPhrase]
    entities: List[Entity]
    summary: str
    recommendations: List[str]

class ChatSummaryRequest(BaseModel):
    consultation_id: str
    messages: List[Message]
    include_sentiment: bool = False

class ChatSummaryResponse(BaseModel):
    summary_id: str
    consultation_id: str
    timestamp: datetime
    content: str
    highlights: List[str]
    sentiment: Optional[SentimentScore] = None 