#!/bin/bash

# Verifica se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "Docker não encontrado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verifica se o Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose não encontrado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Verifica se o NVIDIA Container Toolkit está instalado (para GPU)
if ! command -v nvidia-smi &> /dev/null; then
    echo "AVISO: NVIDIA Container Toolkit não encontrado. O suporte a GPU pode não estar disponível."
fi

# Baixa os modelos Llama se necessário
echo "Verificando modelos Llama..."
cd packages/llama-core
python scripts/download_models.py
cd ../..

# Para todos os containers existentes
echo "Parando containers existentes..."
docker-compose down

# Remove volumes antigos se necessário
echo "Removendo volumes antigos..."
docker-compose down -v

# Constrói e inicia os containers
echo "Construindo e iniciando containers..."
docker-compose up --build -d

# Verifica o status dos containers
echo "Verificando status dos containers..."
docker-compose ps

# Mostra os logs
echo "Mostrando logs dos containers..."
docker-compose logs -f 