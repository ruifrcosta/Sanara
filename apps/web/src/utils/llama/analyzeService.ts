import { getModelPath } from './modelManager';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

interface AnalysisResult {
  suggestions: string[];
  score: number;
  details: Record<string, any>;
}

export const analyzeLayout = async (htmlContent: string): Promise<AnalysisResult> => {
  const modelId = 'llama-3.3-70b-instruct';
  const modelPath = getModelPath(modelId);
  
  // Criar arquivo temporário com o conteúdo HTML
  const tempFile = path.join(process.cwd(), 'temp', `layout-${Date.now()}.html`);
  await writeFileAsync(tempFile, htmlContent);

  try {
    const prompt = `
      Analise o layout HTML fornecido e sugira melhorias considerando:
      1. Acessibilidade (WCAG)
      2. SEO
      3. Performance
      4. Usabilidade
      5. Responsividade
      6. Boas práticas de design
      
      Forneça sugestões específicas e práticas que possam ser implementadas.
    `;

    const { stdout } = await execAsync(`llama analyze --model ${modelPath} --input ${tempFile} --prompt "${prompt}"`);
    
    // Processar a saída do modelo
    const analysis = JSON.parse(stdout);
    
    return {
      suggestions: analysis.suggestions || [],
      score: analysis.score || 0,
      details: analysis.details || {}
    };
  } catch (error) {
    console.error('Error analyzing layout:', error);
    throw error;
  } finally {
    // Limpar arquivo temporário
    fs.unlinkSync(tempFile);
  }
};

export const analyzeSEO = async (url: string): Promise<AnalysisResult> => {
  const modelId = 'llama-3.1-8b-instruct';
  const modelPath = getModelPath(modelId);

  try {
    const prompt = `
      Analise a URL fornecida e sugira melhorias de SEO considerando:
      1. Meta tags
      2. Estrutura de conteúdo
      3. Palavras-chave
      4. Links internos e externos
      5. Performance
      6. Mobile-friendliness
      
      Forneça sugestões específicas e práticas que possam ser implementadas.
    `;

    const { stdout } = await execAsync(`llama analyze --model ${modelPath} --input "${url}" --prompt "${prompt}"`);
    
    const analysis = JSON.parse(stdout);
    
    return {
      suggestions: analysis.suggestions || [],
      score: analysis.score || 0,
      details: analysis.details || {}
    };
  } catch (error) {
    console.error('Error analyzing SEO:', error);
    throw error;
  }
};

export const analyzeContent = async (content: string): Promise<AnalysisResult> => {
  const modelId = 'llama-3.1-405b-instruct';
  const modelPath = getModelPath(modelId);

  try {
    const prompt = `
      Analise o conteúdo fornecido e sugira melhorias considerando:
      1. Clareza e coesão
      2. Relevância para o público-alvo
      3. Otimização para SEO
      4. Tom de voz e linguagem
      5. Chamadas para ação
      6. Estrutura e formatação
      
      Forneça sugestões específicas e práticas que possam ser implementadas.
    `;

    const { stdout } = await execAsync(`llama analyze --model ${modelPath} --input "${content}" --prompt "${prompt}"`);
    
    const analysis = JSON.parse(stdout);
    
    return {
      suggestions: analysis.suggestions || [],
      score: analysis.score || 0,
      details: analysis.details || {}
    };
  } catch (error) {
    console.error('Error analyzing content:', error);
    throw error;
  }
};

export const analyzeImage = async (imagePath: string): Promise<AnalysisResult> => {
  const modelId = 'llama-3.2-11b-vision';
  const modelPath = getModelPath(modelId);

  try {
    const prompt = `
      Analise a imagem fornecida e sugira melhorias considerando:
      1. Qualidade visual
      2. Otimização para web
      3. Acessibilidade
      4. SEO de imagem
      5. Responsividade
      6. Contexto e relevância
      
      Forneça sugestões específicas e práticas que possam ser implementadas.
    `;

    const { stdout } = await execAsync(`llama analyze --model ${modelPath} --input "${imagePath}" --prompt "${prompt}"`);
    
    const analysis = JSON.parse(stdout);
    
    return {
      suggestions: analysis.suggestions || [],
      score: analysis.score || 0,
      details: analysis.details || {}
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}; 