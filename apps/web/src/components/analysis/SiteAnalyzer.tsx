import React, { useState } from 'react';
import { useAnalysis } from '@/hooks/useAnalysis';
import AnalysisSuggestions from './AnalysisSuggestions';

const analysisTypes = [
  {
    id: 'layout',
    name: 'Layout',
    description: 'Analisa a estrutura e o design do site'
  },
  {
    id: 'seo',
    name: 'SEO',
    description: 'Analisa a otimização para motores de busca'
  },
  {
    id: 'content',
    name: 'Conteúdo',
    description: 'Analisa a qualidade e relevância do conteúdo'
  },
  {
    id: 'image',
    name: 'Imagens',
    description: 'Analisa a otimização e acessibilidade das imagens'
  }
];

const SiteAnalyzer: React.FC = () => {
  const [selectedType, setSelectedType] = useState(analysisTypes[0].id);
  const [content, setContent] = useState('');
  const { analyze, result, loading, error } = useAnalysis();

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    await analyze(selectedType, content);
  };

  const handleApplySuggestion = (suggestion: string) => {
    // Aqui você pode implementar a lógica para aplicar a sugestão
    console.log('Applying suggestion:', suggestion);
  };

  const handleDismissSuggestion = (suggestion: string) => {
    // Aqui você pode implementar a lógica para ignorar a sugestão
    console.log('Dismissing suggestion:', suggestion);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Análise Automática do Site
        </h1>
        <p className="text-gray-600">
          Selecione o tipo de análise e forneça o conteúdo para receber sugestões de melhoria.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Análise
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {analysisTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-4 text-left rounded-lg border transition-colors ${
                  selectedType === type.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'
                }`}
              >
                <h3 className="font-medium text-gray-900">{type.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{type.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Conteúdo para Análise
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Digite ou cole o conteúdo para análise ${
              selectedType === 'image' ? '(URL da imagem)' : ''
            }`}
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <button
            onClick={handleAnalyze}
            disabled={loading || !content.trim()}
            className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
              loading || !content.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Analisando...' : 'Analisar'}
          </button>
        </div>

        <div className="mt-8">
          <AnalysisSuggestions
            result={result}
            loading={loading}
            error={error}
            onApply={handleApplySuggestion}
            onDismiss={handleDismissSuggestion}
          />
        </div>
      </div>
    </div>
  );
};

export default SiteAnalyzer; 