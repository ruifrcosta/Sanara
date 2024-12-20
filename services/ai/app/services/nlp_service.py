import spacy
from transformers import pipeline
from typing import List, Dict, Any, Tuple
from app.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)

class NLPService:
    def __init__(self):
        try:
            # Load spaCy model
            self.nlp = spacy.load(settings.SPACY_MODEL)
            
            # Load transformers pipelines
            self.sentiment_analyzer = pipeline("sentiment-analysis", model="neuralmind/bert-base-portuguese-cased")
            self.ner = pipeline("ner", model="neuralmind/bert-base-portuguese-cased")
            self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
            
            logger.info("NLP models loaded successfully")
        except Exception as e:
            logger.error("Failed to load NLP models", error=e)
            raise

    def analyze_text(self, text: str) -> Dict[str, Any]:
        """
        Perform comprehensive text analysis using spaCy and transformers.
        """
        try:
            # Process text with spaCy
            doc = self.nlp(text)
            
            # Extract entities
            entities = [
                {
                    "text": ent.text,
                    "label": ent.label_,
                    "start": ent.start_char,
                    "end": ent.end_char
                }
                for ent in doc.ents
            ]
            
            # Extract key phrases (noun chunks)
            key_phrases = [
                {
                    "text": chunk.text,
                    "root": chunk.root.text,
                    "dependency": chunk.root.dep_
                }
                for chunk in doc.noun_chunks
            ]
            
            # Analyze sentiment
            sentiment = self.analyze_sentiment(text)
            
            return {
                "entities": entities,
                "key_phrases": key_phrases,
                "sentiment": sentiment,
                "summary": self.summarize_text(text)
            }
        except Exception as e:
            logger.error("Failed to analyze text", error=e)
            raise

    def analyze_sentiment(self, text: str) -> Dict[str, float]:
        """
        Analyze sentiment of the text using transformers.
        """
        try:
            result = self.sentiment_analyzer(text)[0]
            
            # Convert to positive/neutral/negative scores
            scores = {
                "positive": result["score"] if result["label"] == "POSITIVE" else 0.0,
                "neutral": result["score"] if result["label"] == "NEUTRAL" else 0.0,
                "negative": result["score"] if result["label"] == "NEGATIVE" else 0.0
            }
            
            return scores
        except Exception as e:
            logger.error("Failed to analyze sentiment", error=e)
            raise

    def extract_entities(self, text: str) -> List[Dict[str, Any]]:
        """
        Extract named entities using transformers NER.
        """
        try:
            entities = self.ner(text)
            
            # Process and format entities
            formatted_entities = []
            for entity in entities:
                formatted_entities.append({
                    "text": entity["word"],
                    "type": entity["entity"],
                    "confidence_score": entity["score"],
                    "start": entity["start"],
                    "end": entity["end"]
                })
            
            return formatted_entities
        except Exception as e:
            logger.error("Failed to extract entities", error=e)
            raise

    def summarize_text(self, text: str, max_length: int = 130, min_length: int = 30) -> str:
        """
        Generate a summary of the text using transformers.
        """
        try:
            summary = self.summarizer(
                text,
                max_length=max_length,
                min_length=min_length,
                do_sample=False
            )[0]["summary_text"]
            
            return summary
        except Exception as e:
            logger.error("Failed to summarize text", error=e)
            raise

    def extract_medical_entities(self, text: str) -> Tuple[List[str], List[str], List[str]]:
        """
        Extract medical-specific entities (symptoms, conditions, medications).
        """
        try:
            doc = self.nlp(text)
            
            symptoms = []
            conditions = []
            medications = []
            
            for ent in doc.ents:
                if ent.label_ == "SYMPTOM":
                    symptoms.append(ent.text)
                elif ent.label_ == "CONDITION":
                    conditions.append(ent.text)
                elif ent.label_ == "MEDICATION":
                    medications.append(ent.text)
            
            return symptoms, conditions, medications
        except Exception as e:
            logger.error("Failed to extract medical entities", error=e)
            raise

    def analyze_medical_text(self, text: str) -> Dict[str, Any]:
        """
        Perform medical-specific text analysis.
        """
        try:
            # Extract medical entities
            symptoms, conditions, medications = self.extract_medical_entities(text)
            
            # Analyze sentiment (useful for patient mood/state analysis)
            sentiment = self.analyze_sentiment(text)
            
            # Generate summary
            summary = self.summarize_text(text)
            
            return {
                "symptoms": symptoms,
                "conditions": conditions,
                "medications": medications,
                "sentiment": sentiment,
                "summary": summary
            }
        except Exception as e:
            logger.error("Failed to analyze medical text", error=e)
            raise 