export const config = {
  port: process.env.PORT || 3004,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL || 'postgresql://sanara:sanara_dev@localhost:5432/sanara_dev',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  logLevel: process.env.LOG_LEVEL || 'info',
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    apiKey: process.env.TWILIO_API_KEY || '',
    apiSecret: process.env.TWILIO_API_SECRET || '',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4',
  },
  consultation: {
    maxDuration: 60, // minutes
    transcriptionLanguage: 'pt-BR',
    aiAssistantPrompt: 'You are a medical AI assistant. Help analyze the consultation and provide insights.',
  }
}; 