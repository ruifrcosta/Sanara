from typing import List, Dict, Any
import openai
from datetime import datetime
import uuid
from app.config import settings
from app.utils.logger import get_logger
from app.models.health import (
    Symptom,
    HealthCondition,
    HealthAnalysisRequest,
    HealthAnalysisResponse,
    MedicalReportRequest,
    MedicalReportResponse,
    Severity
)
from .nlp_service import NLPService

logger = get_logger(__name__)

class HealthAnalysisService:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY
        self.nlp_service = NLPService()

    async def analyze_symptoms(self, request: HealthAnalysisRequest) -> HealthAnalysisResponse:
        """
        Analyze symptoms using GPT and NLP services.
        """
        try:
            # Extract medical entities from the description
            medical_analysis = self.nlp_service.analyze_medical_text(request.symptoms_description)
            
            # Prepare prompt for GPT
            prompt = self._prepare_analysis_prompt(request, medical_analysis)
            
            # Get GPT analysis
            response = await openai.ChatCompletion.acreate(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "Você é um assistente médico especializado em análise de sintomas."},
                    {"role": "user", "content": prompt}
                ],
                temperature=settings.TEMPERATURE,
                max_tokens=settings.MAX_TOKENS
            )
            
            # Parse GPT response
            analysis = self._parse_gpt_response(response.choices[0].message.content)
            
            # Create response
            return HealthAnalysisResponse(
                analysis_id=str(uuid.uuid4()),
                timestamp=datetime.utcnow(),
                symptoms=self._create_symptoms(medical_analysis["symptoms"], analysis),
                possible_conditions=self._create_conditions(analysis),
                recommendations=analysis.get("recommendations", [])
            )
        except Exception as e:
            logger.error("Failed to analyze symptoms", error=e)
            raise

    async def generate_medical_report(self, request: MedicalReportRequest) -> MedicalReportResponse:
        """
        Generate a medical report using GPT.
        """
        try:
            # Prepare prompt for GPT
            prompt = self._prepare_report_prompt(request)
            
            # Get GPT response
            response = await openai.ChatCompletion.acreate(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "Você é um médico especializado em elaborar relatórios médicos detalhados."},
                    {"role": "user", "content": prompt}
                ],
                temperature=settings.TEMPERATURE,
                max_tokens=settings.MAX_TOKENS
            )
            
            # Parse GPT response
            report_content = response.choices[0].message.content
            
            # Generate summary
            summary = self.nlp_service.summarize_text(report_content)
            
            # Extract recommendations
            recommendations = self._extract_recommendations(report_content)
            
            return MedicalReportResponse(
                report_id=str(uuid.uuid4()),
                consultation_id=request.consultation_id,
                timestamp=datetime.utcnow(),
                content=report_content,
                summary=summary,
                recommendations=recommendations
            )
        except Exception as e:
            logger.error("Failed to generate medical report", error=e)
            raise

    def _prepare_analysis_prompt(self, request: HealthAnalysisRequest, medical_analysis: Dict[str, Any]) -> str:
        """
        Prepare the prompt for symptom analysis.
        """
        prompt = f"""Por favor, analise os seguintes sintomas e informações do paciente:

Descrição dos Sintomas:
{request.symptoms_description}

Sintomas Identificados:
{', '.join(medical_analysis['symptoms'])}

"""
        if request.patient_age:
            prompt += f"\nIdade do Paciente: {request.patient_age} anos"
        
        if request.patient_gender:
            prompt += f"\nGênero do Paciente: {request.patient_gender}"
        
        if request.medical_history:
            prompt += f"\nHistórico Médico:\n" + "\n".join(f"- {item}" for item in request.medical_history)
        
        prompt += """

Por favor, forneça uma análise detalhada incluindo:
1. Avaliação de cada sintoma (gravidade e possíveis causas)
2. Possíveis condições médicas
3. Nível de urgência
4. Recomendações gerais
5. Próximos passos sugeridos

Formate a resposta em JSON com as seguintes chaves:
{
    "symptom_analysis": [...],
    "possible_conditions": [...],
    "urgency_level": "...",
    "recommendations": [...]
}"""
        
        return prompt

    def _prepare_report_prompt(self, request: MedicalReportRequest) -> str:
        """
        Prepare the prompt for medical report generation.
        """
        prompt = f"""Por favor, gere um relatório médico detalhado com base nas seguintes informações:

ID da Consulta: {request.consultation_id}
ID do Paciente: {request.patient_id}

Sintomas Apresentados:
{', '.join(request.symptoms)}

Observações:
{request.observations}

"""
        if request.diagnosis:
            prompt += f"\nDiagnóstico:\n{request.diagnosis}"
        
        if request.treatment_plan:
            prompt += f"\nPlano de Tratamento:\n{request.treatment_plan}"
        
        prompt += """

Por favor, elabore um relatório médico completo incluindo:
1. Resumo da Consulta
2. Avaliação Detalhada
3. Diagnóstico (se aplicável)
4. Plano de Tratamento
5. Recomendações
6. Próximos Passos

O relatório deve ser claro, profissional e detalhado."""
        
        return prompt

    def _parse_gpt_response(self, response: str) -> Dict[str, Any]:
        """
        Parse GPT response into structured data.
        """
        try:
            # Extract JSON from response
            import json
            start_idx = response.find('{')
            end_idx = response.rfind('}') + 1
            json_str = response[start_idx:end_idx]
            
            return json.loads(json_str)
        except Exception as e:
            logger.error("Failed to parse GPT response", error=e)
            # Return a basic structure if parsing fails
            return {
                "symptom_analysis": [],
                "possible_conditions": [],
                "urgency_level": "MODERATE",
                "recommendations": []
            }

    def _create_symptoms(self, extracted_symptoms: List[str], analysis: Dict[str, Any]) -> List[Symptom]:
        """
        Create Symptom objects from extracted symptoms and analysis.
        """
        symptoms = []
        symptom_analysis = analysis.get("symptom_analysis", [])
        
        for symptom_name in extracted_symptoms:
            # Find matching analysis
            symptom_info = next(
                (s for s in symptom_analysis if s["name"].lower() == symptom_name.lower()),
                None
            )
            
            if symptom_info:
                symptoms.append(
                    Symptom(
                        name=symptom_name,
                        description=symptom_info.get("description", ""),
                        severity=Severity(symptom_info.get("severity", "moderate").lower()),
                        duration=symptom_info.get("duration"),
                        frequency=symptom_info.get("frequency")
                    )
                )
            else:
                # Create basic symptom if no detailed analysis found
                symptoms.append(
                    Symptom(
                        name=symptom_name,
                        description="",
                        severity=Severity.MODERATE
                    )
                )
        
        return symptoms

    def _create_conditions(self, analysis: Dict[str, Any]) -> List[HealthCondition]:
        """
        Create HealthCondition objects from analysis.
        """
        conditions = []
        for condition in analysis.get("possible_conditions", []):
            conditions.append(
                HealthCondition(
                    name=condition["name"],
                    description=condition.get("description", ""),
                    confidence_score=condition.get("confidence", 0.5),
                    severity=Severity(condition.get("severity", "moderate").lower()),
                    symptoms=condition.get("related_symptoms", []),
                    recommendations=condition.get("specific_recommendations", [])
                )
            )
        return conditions

    def _extract_recommendations(self, report_content: str) -> List[str]:
        """
        Extract recommendations from report content.
        """
        try:
            # Use NLP to identify recommendation sentences
            doc = self.nlp_service.nlp(report_content)
            recommendations = []
            
            for sent in doc.sents:
                # Look for recommendation patterns
                if any(keyword in sent.text.lower() for keyword in ["recomend", "suger", "aconselh", "indic"]):
                    recommendations.append(sent.text.strip())
            
            return recommendations if recommendations else ["Consulte um profissional de saúde para recomendações específicas."]
        except Exception as e:
            logger.error("Failed to extract recommendations", error=e)
            return ["Consulte um profissional de saúde para recomendações específicas."] 