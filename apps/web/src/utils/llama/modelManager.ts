import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

interface LlamaModel {
  id: string;
  name: string;
  description: string;
  size: string;
  url: string;
}

const MODELS: LlamaModel[] = [
  {
    id: 'llama-3.3-70b-instruct',
    name: 'Llama 3.3 70B Instruct',
    description: 'Para análise de texto e sugestão de melhorias',
    size: '70B',
    url: 'https://llama3-3.llamameta.net/models/llama-3.3-70b-instruct'
  },
  {
    id: 'llama-3.2-1b',
    name: 'Llama 3.2 1B',
    description: 'Para tarefas básicas de processamento de linguagem',
    size: '1B',
    url: 'https://llama3-3.llamameta.net/models/llama-3.2-1b'
  },
  {
    id: 'llama-3.2-3b',
    name: 'Llama 3.2 3B',
    description: 'Para tarefas intermediárias de processamento de linguagem',
    size: '3B',
    url: 'https://llama3-3.llamameta.net/models/llama-3.2-3b'
  },
  {
    id: 'llama-3.2-11b-vision',
    name: 'Llama 3.2 11B Vision',
    description: 'Para análise de imagens e visão computacional',
    size: '11B',
    url: 'https://llama3-3.llamameta.net/models/llama-3.2-11b-vision'
  },
  {
    id: 'llama-3.2-90b-vision',
    name: 'Llama 3.2 90B Vision',
    description: 'Para análise avançada de imagens e visão computacional',
    size: '90B',
    url: 'https://llama3-3.llamameta.net/models/llama-3.2-90b-vision'
  },
  {
    id: 'llama-3.1-8b-instruct',
    name: 'Llama 3.1 8B Instruct',
    description: 'Para tarefas de instrução e geração de texto',
    size: '8B',
    url: 'https://llama3-3.llamameta.net/models/llama-3.1-8b-instruct'
  },
  {
    id: 'llama-3.1-405b-instruct',
    name: 'Llama 3.1 405B Instruct',
    description: 'Para tarefas complexas que necessitem de mais poder de computação',
    size: '405B',
    url: 'https://llama3-3.llamameta.net/models/llama-3.1-405b-instruct'
  }
];

const MODELS_DIR = path.join(process.cwd(), 'models');

export const initializeModelsDirectory = async () => {
  if (!fs.existsSync(MODELS_DIR)) {
    fs.mkdirSync(MODELS_DIR, { recursive: true });
  }
};

export const downloadModel = async (modelId: string) => {
  const model = MODELS.find((m) => m.id === modelId);
  if (!model) {
    throw new Error(`Model ${modelId} not found`);
  }

  const modelPath = path.join(MODELS_DIR, modelId);
  if (fs.existsSync(modelPath)) {
    console.log(`Model ${modelId} already exists`);
    return;
  }

  console.log(`Downloading model ${modelId}...`);
  try {
    await execAsync(`llama model download --source meta --model-id ${modelId} --output ${modelPath}`);
    console.log(`Model ${modelId} downloaded successfully`);
  } catch (error) {
    console.error(`Error downloading model ${modelId}:`, error);
    throw error;
  }
};

export const downloadAllModels = async () => {
  await initializeModelsDirectory();
  for (const model of MODELS) {
    await downloadModel(model.id);
  }
};

export const getModelPath = (modelId: string) => {
  return path.join(MODELS_DIR, modelId);
};

export const listModels = () => {
  return MODELS;
}; 