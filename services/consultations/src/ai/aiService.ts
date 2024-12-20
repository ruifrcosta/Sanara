import { Configuration, OpenAIApi } from 'openai';
import { ChatMessage } from '@prisma/client';
import { config } from '../config';
import { logger } from '../utils/logger';

export class AIService {
  private openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: config.openai.apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async generateTranscript(messages: ChatMessage[]): Promise<string> {
    try {
      const formattedMessages = messages.map(msg => 
        `${msg.senderType}: ${msg.content}`
      ).join('\n');

      const response = await this.openai.createCompletion({
        model: config.openai.model,
        prompt: `Please create a well-formatted transcript of the following medical consultation:\n\n${formattedMessages}\n\nTranscript:`,
        max_tokens: 1000,
        temperature: 0.3,
      });

      const transcript = response.data.choices[0].text?.trim() || '';
      logger.info('Transcript generated successfully');
      return transcript;
    } catch (error) {
      logger.error('Failed to generate transcript:', error);
      throw error;
    }
  }

  async generateSummary(transcript: string): Promise<string> {
    try {
      const response = await this.openai.createCompletion({
        model: config.openai.model,
        prompt: `Please provide a concise medical summary of the following consultation transcript:\n\n${transcript}\n\nSummary:`,
        max_tokens: 500,
        temperature: 0.3,
      });

      const summary = response.data.choices[0].text?.trim() || '';
      logger.info('Summary generated successfully');
      return summary;
    } catch (error) {
      logger.error('Failed to generate summary:', error);
      throw error;
    }
  }

  async analyzeSymptoms(description: string): Promise<string> {
    try {
      const response = await this.openai.createCompletion({
        model: config.openai.model,
        prompt: `${config.consultation.aiAssistantPrompt}\n\nPlease analyze the following symptoms and provide potential conditions and recommendations:\n\n${description}\n\nAnalysis:`,
        max_tokens: 500,
        temperature: 0.3,
      });

      const analysis = response.data.choices[0].text?.trim() || '';
      logger.info('Symptom analysis generated successfully');
      return analysis;
    } catch (error) {
      logger.error('Failed to analyze symptoms:', error);
      throw error;
    }
  }

  async generateMedicalReport(consultation: any): Promise<string> {
    try {
      const prompt = `Please generate a detailed medical report based on the following consultation information:

Patient Information:
- ID: ${consultation.userId}
- Consultation Type: ${consultation.type}
- Date: ${consultation.startTime}

Consultation Summary:
${consultation.summary}

Transcript:
${consultation.transcript}

Please include:
1. Patient's presenting symptoms
2. Observations and findings
3. Assessment
4. Treatment plan or recommendations
5. Follow-up instructions

Medical Report:`;

      const response = await this.openai.createCompletion({
        model: config.openai.model,
        prompt,
        max_tokens: 1000,
        temperature: 0.3,
      });

      const report = response.data.choices[0].text?.trim() || '';
      logger.info('Medical report generated successfully');
      return report;
    } catch (error) {
      logger.error('Failed to generate medical report:', error);
      throw error;
    }
  }

  async suggestPrescription(symptoms: string, diagnosis: string): Promise<string> {
    try {
      const prompt = `As a medical AI assistant, please suggest a prescription based on the following information:

Symptoms:
${symptoms}

Diagnosis:
${diagnosis}

Please provide:
1. Recommended medications
2. Dosage and duration
3. Special instructions
4. Precautions and contraindications

Prescription Suggestion:`;

      const response = await this.openai.createCompletion({
        model: config.openai.model,
        prompt,
        max_tokens: 500,
        temperature: 0.3,
      });

      const prescription = response.data.choices[0].text?.trim() || '';
      logger.info('Prescription suggestion generated successfully');
      return prescription;
    } catch (error) {
      logger.error('Failed to suggest prescription:', error);
      throw error;
    }
  }
} 