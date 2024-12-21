import React from 'react';
import SiteAnalyzer from '@/components/analysis/SiteAnalyzer';
import SEO from '@/components/seo/SEO';

export default function AnalyzePage() {
  return (
    <>
      <SEO
        title="Análise Automática - Sanara"
        description="Analise automaticamente o layout, SEO, conteúdo e imagens do seu site usando inteligência artificial."
        keywords={[
          'análise de site',
          'otimização de site',
          'análise de SEO',
          'análise de layout',
          'análise de conteúdo',
          'análise de imagens',
          'inteligência artificial',
          'automação'
        ]}
      />
      <main className="min-h-screen bg-gray-50 py-12">
        <SiteAnalyzer />
      </main>
    </>
  );
} 