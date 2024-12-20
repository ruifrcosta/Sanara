from fastapi import FastAPI
from llama_cpp import Llama
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(title="Sanara Llama Core")

class LlamaRequest(BaseModel):
    prompt: str
    max_tokens: Optional[int] = 100
    temperature: Optional[float] = 0.7
    model_size: Optional[str] = "7B"

class LlamaResponse(BaseModel):
    text: str
    tokens_used: int

# Inicialização dos modelos
models = {}
model_paths = {
    "7B": "./models/llama-2-7b-chat.gguf",
    "13B": "./models/llama-2-13b-chat.gguf",
    "70B": "./models/llama-2-70b-chat.gguf"
}

@app.on_event("startup")
async def startup_event():
    """Carrega os modelos Llama na inicialização"""
    try:
        for size, path in model_paths.items():
            models[size] = Llama(
                model_path=path,
                n_ctx=2048,
                n_batch=512
            )
    except Exception as e:
        print(f"Erro ao carregar modelos: {e}")

@app.post("/generate", response_model=LlamaResponse)
async def generate_text(request: LlamaRequest):
    """Gera texto usando o modelo Llama especificado"""
    try:
        model = models.get(request.model_size)
        if not model:
            raise ValueError(f"Modelo {request.model_size} não encontrado")
        
        output = model(
            request.prompt,
            max_tokens=request.max_tokens,
            temperature=request.temperature
        )
        
        return LlamaResponse(
            text=output["choices"][0]["text"],
            tokens_used=output["usage"]["total_tokens"]
        )
    except Exception as e:
        return {"error": str(e)}

@app.get("/health")
async def health_check():
    """Endpoint de verificação de saúde"""
    return {
        "status": "healthy",
        "models_loaded": list(models.keys())
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 