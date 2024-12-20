const winston = require('winston');

// Configuração do logger para testes
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: './reports/test-error.log', level: 'error' }),
    new winston.transports.File({ filename: './reports/test-combined.log' })
  ]
});

// Configurações globais para testes
global.logger = logger;

// Aumenta o timeout para testes assíncronos
jest.setTimeout(30000);

// Limpa todos os mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
});

// Fecha o logger após todos os testes
afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Aguarda logs pendentes
}); 