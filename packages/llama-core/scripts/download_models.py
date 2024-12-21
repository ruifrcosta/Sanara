import os
import requests
from pathlib import Path
import hashlib
import sys

MODELS = {
    "7B": {
        "url": "https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q4_K_M.gguf",
        "md5": "84242a55fc51d0fe82fc9fd13dab4a84"
    },
    "13B": {
        "url": "https://huggingface.co/TheBloke/Llama-2-13B-Chat-GGUF/resolve/main/llama-2-13b-chat.Q4_K_M.gguf",
        "md5": "a650d43d39e7ad2d1447d0ca666aa609"
    },
    "70B": {
        "url": "https://huggingface.co/TheBloke/Llama-2-70B-Chat-GGUF/resolve/main/llama-2-70b-chat.Q4_K_M.gguf",
        "md5": "e2a9b69b0e2eb8c29f6d55d9f2e0c174"
    }
}

def download_file(url: str, destination: Path, chunk_size: int = 8192):
    """Download um arquivo grande em chunks"""
    response = requests.get(url, stream=True)
    total_size = int(response.headers.get('content-length', 0))
    
    with open(destination, 'wb') as f:
        for chunk in response.iter_content(chunk_size=chunk_size):
            if chunk:
                f.write(chunk)
                f.flush()
                # Calcular e mostrar progresso
                progress = (f.tell() / total_size) * 100
                sys.stdout.write(f"\rBaixando... {progress:.1f}%")
                sys.stdout.flush()
    print("\nDownload completo!")

def verify_md5(file_path: Path, expected_md5: str) -> bool:
    """Verifica o MD5 do arquivo baixado"""
    md5_hash = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            md5_hash.update(chunk)
    return md5_hash.hexdigest() == expected_md5

def main():
    models_dir = Path("models")
    models_dir.mkdir(exist_ok=True)
    
    for model_size, info in MODELS.items():
        model_path = models_dir / f"llama-2-{model_size.lower()}-chat.gguf"
        
        if model_path.exists():
            print(f"Modelo {model_size} já existe. Verificando MD5...")
            if verify_md5(model_path, info["md5"]):
                print("MD5 verificado com sucesso!")
                continue
            else:
                print("MD5 inválido. Baixando novamente...")
                model_path.unlink()
        
        print(f"Baixando modelo {model_size}...")
        download_file(info["url"], model_path)
        
        if verify_md5(model_path, info["md5"]):
            print("Download concluído e verificado!")
        else:
            print("Erro na verificação do MD5. Por favor, tente novamente.")
            model_path.unlink()

if __name__ == "__main__":
    main() 