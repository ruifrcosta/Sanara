import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_health_check():
    """Testa o endpoint de health check"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "models_loaded" in data

def test_generate_text():
    """Testa a geração de texto"""
    request_data = {
        "prompt": "Qual é a importância da saúde mental?",
        "max_tokens": 50,
        "temperature": 0.7,
        "model_size": "7B"
    }
    
    response = client.post("/generate", json=request_data)
    assert response.status_code == 200
    data = response.json()
    assert "text" in data
    assert "tokens_used" in data
    assert isinstance(data["text"], str)
    assert isinstance(data["tokens_used"], int)

def test_invalid_model_size():
    """Testa erro com tamanho de modelo inválido"""
    request_data = {
        "prompt": "Teste",
        "model_size": "INVALID"
    }
    
    response = client.post("/generate", json=request_data)
    assert response.status_code == 200  # Retorna 200 com mensagem de erro
    data = response.json()
    assert "error" in data

def test_empty_prompt():
    """Testa erro com prompt vazio"""
    request_data = {
        "prompt": "",
        "model_size": "7B"
    }
    
    response = client.post("/generate", json=request_data)
    assert response.status_code == 422  # Erro de validação do Pydantic 