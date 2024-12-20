const request = require('supertest');
const express = require('express');
const app = express();

// Importa as configurações da aplicação
require('../../index.js');

describe('Testes da Aplicação Principal', () => {
  describe('GET /', () => {
    it('deve retornar mensagem de boas-vindas', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Bem-vindo à API Sanara!');
    });
  });

  describe('Middleware de Erro', () => {
    it('deve retornar 500 quando ocorrer um erro', async () => {
      // Cria uma rota que gera erro propositalmente
      app.get('/erro', (req, res, next) => {
        throw new Error('Erro de teste');
      });

      const response = await request(app).get('/erro');
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Algo deu errado!');
    });
  });

  describe('Validações de Segurança', () => {
    it('deve ter headers de segurança apropriados', async () => {
      const response = await request(app).get('/');
      expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
      expect(response.headers).toHaveProperty('x-frame-options', 'DENY');
      expect(response.headers).toHaveProperty('x-xss-protection', '1; mode=block');
    });
  });

  describe('Validações de CORS', () => {
    it('deve permitir requisições CORS', async () => {
      const response = await request(app)
        .get('/')
        .set('Origin', 'http://localhost:3000');
      
      expect(response.headers['access-control-allow-origin']).toBe('*');
    });
  });

  describe('Validações de Conteúdo', () => {
    it('deve aceitar JSON no body', async () => {
      const testData = { test: 'data' };
      const response = await request(app)
        .post('/test-json')
        .send(testData)
        .set('Content-Type', 'application/json');
      
      expect(response.status).not.toBe(415); // Unsupported Media Type
    });
  });
}); 