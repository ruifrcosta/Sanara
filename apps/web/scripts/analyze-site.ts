import { analyzeLayout, analyzeSEO, analyzeContent, analyzeImage } from '../src/utils/llama/analyzeService';
import fs from 'fs';
import path from 'path';

interface AnalysisConfig {
  url: string;
  outputDir: string;
  types: string[];
}

async function analyzeSite(config: AnalysisConfig) {
  const { url, outputDir, types } = config;

  // Criar diretório de saída se não existir
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Starting analysis for ${url}...`);

  try {
    // Analisar layout
    if (types.includes('layout')) {
      console.log('Analyzing layout...');
      const layoutResult = await analyzeLayout(await fetchHtml(url));
      writeResults('layout', layoutResult);
    }

    // Analisar SEO
    if (types.includes('seo')) {
      console.log('Analyzing SEO...');
      const seoResult = await analyzeSEO(url);
      writeResults('seo', seoResult);
    }

    // Analisar conteúdo
    if (types.includes('content')) {
      console.log('Analyzing content...');
      const contentResult = await analyzeContent(await fetchHtml(url));
      writeResults('content', contentResult);
    }

    // Analisar imagens
    if (types.includes('image')) {
      console.log('Analyzing images...');
      const images = await extractImages(url);
      for (const image of images) {
        const imageResult = await analyzeImage(image);
        writeResults(`image-${path.basename(image)}`, imageResult);
      }
    }

    console.log('Analysis completed successfully!');
  } catch (error) {
    console.error('Error during analysis:', error);
    process.exit(1);
  }

  function writeResults(type: string, results: any) {
    const filePath = path.join(outputDir, `${type}-analysis.json`);
    fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
    console.log(`Results written to ${filePath}`);
  }
}

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url);
  return await response.text();
}

async function extractImages(url: string): Promise<string[]> {
  const html = await fetchHtml(url);
  const imageRegex = /<img[^>]+src="([^">]+)"/g;
  const images: string[] = [];
  let match;

  while ((match = imageRegex.exec(html)) !== null) {
    const src = match[1];
    if (src.startsWith('http')) {
      images.push(src);
    } else {
      images.push(new URL(src, url).toString());
    }
  }

  return images;
}

// Configuração padrão
const config: AnalysisConfig = {
  url: process.env.SITE_URL || 'https://sanara.com',
  outputDir: path.join(process.cwd(), 'analysis'),
  types: ['layout', 'seo', 'content', 'image']
};

// Executar análise
analyzeSite(config); 