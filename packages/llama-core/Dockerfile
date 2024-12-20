FROM pytorch/pytorch:2.1.0-cuda11.8-cudnn8-runtime

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    software-properties-common \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copiar arquivos de requisitos
COPY requirements.txt .

# Instalar dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# Criar diretório para modelos
RUN mkdir -p models

# Copiar código fonte
COPY src/ src/

# Expor porta
EXPOSE 8000

# Comando para iniciar a aplicação
CMD ["python", "src/main.py"] 