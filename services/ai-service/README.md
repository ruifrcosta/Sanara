# Serviço de IA para Saúde

Este é um serviço de IA especializado para aplicações de saúde, construído com FastAPI e modelos de última geração para processamento de linguagem natural.

## Funcionalidades

- Análise de sentimentos em múltiplos idiomas
- Classificação de texto
- Análise de condições de saúde baseada em sintomas
- Suporte a GPU para processamento acelerado
- Cache e rate limiting
- Logging completo
- Documentação automática via Swagger/OpenAPI

## Requisitos

- Python 3.8+
- CUDA (opcional, para aceleração GPU)
- Redis (opcional, para cache)

## Instalação

1. Clone o repositório
2. Crie um ambiente virtual:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

## Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
ENVIRONMENT=development
MODEL_CACHE_DIR=./models
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
MAX_REQUESTS_PER_MINUTE=100
```

## Uso

1. Inicie o servidor:
```bash
uvicorn main:app --reload --workers 4
```

2. Acesse a documentação da API:
```
http://localhost:8000/docs
```

## Endpoints

### Análise de Sentimentos
```bash
POST /analyze/sentiment
{
    "text": "O atendimento foi excelente!",
    "language": "pt"
}
```

### Classificação de Texto
```bash
POST /classify/text
{
    "text": "Estou com dor de cabeça e febre",
    "language": "pt"
}
```

### Análise de Condições de Saúde
```bash
POST /analyze/health
{
    "symptoms": ["febre", "dor de cabeça", "fadiga"],
    "patient_history": "Histórico de alergias",
    "age": 35,
    "gender": "F"
}
```

## Testes

Execute os testes com:
```bash
pytest
```

## Performance

- Suporte a GPU via PyTorch
- Processamento em lote
- Cache de resultados com Redis
- Workers múltiplos para melhor throughput

## Segurança

- Rate limiting por IP
- Validação de entrada
- CORS configurável
- Headers de segurança via middleware

## Monitoramento

- Logging detalhado
- Endpoint de health check
- Métricas de performance
- Rastreamento de erros

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença

MIT