const request = require('supertest');
const express = require('express');
const app = express();

describe('Testes de Integração da API', () => {
  let server;

  beforeAll(async () => {
    server = app.listen(4000);
  });

  afterAll(async () => {
    await server.close();
  });

  describe('Testes de Endpoints', () => {
    describe('Saúde da API', () => {
      it('GET /health deve retornar status 200', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'healthy');
      });

      it('deve incluir métricas básicas', async () => {
        const response = await request(app).get('/health');
        expect(response.body).toHaveProperty('uptime');
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body).toHaveProperty('memory');
      });
    });

    describe('Autenticação', () => {
      it('deve rejeitar requisições sem token', async () => {
        const response = await request(app).get('/api/protected');
        expect(response.status).toBe(401);
      });

      it('deve aceitar token válido', async () => {
        const token = 'valid-test-token';
        const response = await request(app)
          .get('/api/protected')
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
      });
    });

    describe('Rate Limiting', () => {
      it('deve limitar requisições excessivas', async () => {
        const requests = Array(100).fill().map(() => 
          request(app).get('/'));
        
        const responses = await Promise.all(requests);
        const tooManyRequests = responses.some(r => r.status === 429);
        expect(tooManyRequests).toBe(true);
      });
    });

    describe('Validação de Dados', () => {
      it('deve validar campos obrigatórios', async () => {
        const response = await request(app)
          .post('/api/users')
          .send({});
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      it('deve sanitizar dados de entrada', async () => {
        const response = await request(app)
          .post('/api/users')
          .send({
            name: '<script>alert("xss")</script>John',
            email: 'john@example.com'
          });
        
        expect(response.body.name).not.toContain('<script>');
      });
    });
  });

  describe('Testes de Performance', () => {
    it('deve responder em menos de 200ms', async () => {
      const start = Date.now();
      await request(app).get('/');
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(200);
    });
  });

  describe('Testes de Carga', () => {
    it('deve suportar múltiplas requisições simultâneas', async () => {
      const concurrentRequests = 50;
      const requests = Array(concurrentRequests).fill().map(() => 
        request(app).get('/'));
      
      const responses = await Promise.all(requests);
      const successfulResponses = responses.filter(r => r.status === 200);
      expect(successfulResponses.length).toBe(concurrentRequests);
    });
  });
}); 