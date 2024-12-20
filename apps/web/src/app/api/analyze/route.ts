import { NextResponse } from 'next/server';
import {
  analyzeLayout,
  analyzeSEO,
  analyzeContent,
  analyzeImage
} from '@/utils/llama/analyzeService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, content } = body;

    let result;
    switch (type) {
      case 'layout':
        result = await analyzeLayout(content);
        break;
      case 'seo':
        result = await analyzeSEO(content);
        break;
      case 'content':
        result = await analyzeContent(content);
        break;
      case 'image':
        result = await analyzeImage(content);
        break;
      default:
        return new NextResponse('Invalid analysis type', { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in analysis:', error);
    return new NextResponse('Error processing analysis', { status: 500 });
  }
} 