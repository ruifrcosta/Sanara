from typing import List, Dict, Any
import openai
from datetime import datetime
import uuid
from app.config import settings
from app.utils.logger import get_logger
from app.models.chat import (
    Message,
    ChatAnalysisRequest,
    ChatAnalysisResponse,
    ChatSummaryRequest,
    ChatSummaryResponse,
    SentimentScore,
    KeyPhrase,
    Entity
)
from .nlp_service import NLPService

logger = get_logger(__name__)

class ChatAnalysisService:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY
        self.nlp_service = NLPService()

    async def analyze_chat(self, request: ChatAnalysisRequest) -> ChatAnalysisResponse:
        """
        Analyze chat messages using GPT and NLP services.
        """
        try:
            # Prepare chat content for analysis
            chat_text = self._prepare_chat_text(request.messages)
            
            # Perform NLP analysis
            nlp_analysis = self.nlp_service.analyze_text(chat_text)
            
            # Get GPT insights
            insights = await self._get_chat_insights(request)
            
            # Create response
            return ChatAnalysisResponse(
                analysis_id=str(uuid.uuid4()),
                consultation_id=request.consultation_id,
                timestamp=datetime.utcnow(),
                sentiment=self._create_sentiment_score(nlp_analysis["sentiment"]),
                key_phrases=self._create_key_phrases(nlp_analysis["key_phrases"]),
                entities=self._create_entities(nlp_analysis["entities"]),
                summary=insights["summary"],
                recommendations=insights["recommendations"]
            )
        except Exception as e:
            logger.error("Failed to analyze chat", error=e)
            raise

    async def generate_summary(self, request: ChatSummaryRequest) -> ChatSummaryResponse:
        """
        Generate a summary of the chat conversation.
        """
        try:
            # Prepare chat content
            chat_text = self._prepare_chat_text(request.messages)
            
            # Get GPT summary
            summary = await self._generate_chat_summary(chat_text)
            
            # Extract highlights
            highlights = self._extract_highlights(summary)
            
            # Analyze sentiment if requested
            sentiment = None
            if request.include_sentiment:
                sentiment_analysis = self.nlp_service.analyze_sentiment(chat_text)
                sentiment = self._create_sentiment_score(sentiment_analysis)
            
            return ChatSummaryResponse(
                summary_id=str(uuid.uuid4()),
                consultation_id=request.consultation_id,
                timestamp=datetime.utcnow(),
                content=summary,
                highlights=highlights,
                sentiment=sentiment
            )
        except Exception as e:
            logger.error("Failed to generate chat summary", error=e)
            raise

    def _prepare_chat_text(self, messages: List[Message]) -> str:
        """
        Prepare chat messages for analysis.
        """
        return "\n".join([
            f"{msg.role}: {msg.content}"
            for msg in messages
            if msg.type == "text"  # Only process text messages
        ])

    async def _get_chat_insights(self, request: ChatAnalysisRequest) -> Dict[str, Any]:
        """
        Get insights from chat using GPT.
        """
        try:
            # Prepare prompt
            prompt = self._prepare_insights_prompt(request)
            
            # Get GPT response
            response = await openai.ChatCompletion.acreate(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "Você é um assistente especializado em análise de conversas médicas."},
                    {"role": "user", "content": prompt}
                ],
                temperature=settings.TEMPERATURE,
                max_tokens=settings.MAX_TOKENS
            )
            
            # Parse response
            return self._parse_insights_response(response.choices[0].message.content)
        except Exception as e:
            logger.error("Failed to get chat insights", error=e)
            raise

    async def _generate_chat_summary(self, chat_text: str) -> str:
        """
        Generate a summary of the chat using GPT.
        """
        try:
            response = await openai.ChatCompletion.acreate(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "Você é um assistente especializado em resumir conversas médicas."},
                    {"role": "user", "content": f"Por favor, resuma a seguinte conversa médica de forma clara e concisa:\n\n{chat_text}"}
                ],
                temperature=settings.TEMPERATURE,
                max_tokens=settings.MAX_TOKENS
            )
            
            return response.choices[0].message.content
        except Exception as e:
            logger.error("Failed to generate chat summary", error=e)
            raise

    def _prepare_insights_prompt(self, request: ChatAnalysisRequest) -> str:
        """
        Prepare prompt for getting chat insights.
        """
        chat_text = self._prepare_chat_text(request.messages)
        
        prompt = f"""Por favor, analise a seguinte conversa médica:

{chat_text}

"""
        if request.context:
            prompt += f"\nContexto Adicional:\n{request.context}\n"
        
        prompt += """
Por favor, forneça:
1. Um resumo conciso da conversa
2. Principais pontos discutidos
3. Recomendações baseadas na conversa
4. Quaisquer sinais de alerta ou preocupações

Formate a resposta em JSON com as seguintes chaves:
{
    "summary": "...",
    "key_points": [...],
    "recommendations": [...],
    "concerns": [...]
}"""
        
        return prompt

    def _parse_insights_response(self, response: str) -> Dict[str, Any]:
        """
        Parse GPT insights response.
        """
        try:
            # Extract JSON from response
            import json
            start_idx = response.find('{')
            end_idx = response.rfind('}') + 1
            json_str = response[start_idx:end_idx]
            
            insights = json.loads(json_str)
            
            return {
                "summary": insights.get("summary", ""),
                "recommendations": insights.get("recommendations", [])
            }
        except Exception as e:
            logger.error("Failed to parse insights response", error=e)
            return {
                "summary": "Não foi possível gerar um resumo da conversa.",
                "recommendations": ["Consulte um profissional de saúde para orientações específicas."]
            }

    def _create_sentiment_score(self, sentiment: Dict[str, float]) -> SentimentScore:
        """
        Create SentimentScore from sentiment analysis.
        """
        return SentimentScore(
            positive=sentiment.get("positive", 0.0),
            neutral=sentiment.get("neutral", 0.0),
            negative=sentiment.get("negative", 0.0)
        )

    def _create_key_phrases(self, phrases: List[Dict[str, Any]]) -> List[KeyPhrase]:
        """
        Create KeyPhrase objects from extracted phrases.
        """
        return [
            KeyPhrase(
                text=phrase["text"],
                relevance_score=0.8,  # Default score for noun chunks
                category=self._categorize_phrase(phrase["text"])
            )
            for phrase in phrases
        ]

    def _create_entities(self, entities: List[Dict[str, Any]]) -> List[Entity]:
        """
        Create Entity objects from extracted entities.
        """
        return [
            Entity(
                text=entity["text"],
                type=entity["label"],
                confidence_score=0.9,  # Default score for spaCy entities
                metadata={
                    "start": entity["start"],
                    "end": entity["end"]
                }
            )
            for entity in entities
        ]

    def _extract_highlights(self, summary: str) -> List[str]:
        """
        Extract key highlights from the summary.
        """
        try:
            # Use NLP to split summary into sentences
            doc = self.nlp_service.nlp(summary)
            
            # Select important sentences based on keywords
            highlights = []
            important_keywords = ["importante", "crucial", "essencial", "principal", "fundamental"]
            
            for sent in doc.sents:
                # Check if sentence contains important keywords or is a key statement
                if (
                    any(keyword in sent.text.lower() for keyword in important_keywords) or
                    sent.text.strip().endswith((".", "!")) and len(sent.text.split()) > 5
                ):
                    highlights.append(sent.text.strip())
            
            # Limit to top 5 highlights
            return highlights[:5]
        except Exception as e:
            logger.error("Failed to extract highlights", error=e)
            return []

    def _categorize_phrase(self, phrase: str) -> str:
        """
        Categorize a key phrase based on its content.
        """
        # Simple rule-based categorization
        phrase_lower = phrase.lower()
        
        if any(word in phrase_lower for word in ["dor", "febre", "tosse", "sintoma"]):
            return "symptom"
        elif any(word in phrase_lower for word in ["remédio", "medicamento", "medicação"]):
            return "medication"
        elif any(word in phrase_lower for word in ["exame", "teste", "análise"]):
            return "exam"
        elif any(word in phrase_lower for word in ["diagnóstico", "condição", "doença"]):
            return "condition"
        else:
            return "other" 