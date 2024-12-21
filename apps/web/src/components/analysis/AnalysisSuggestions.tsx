import React from 'react';

interface AnalysisResult {
  suggestions: string[];
  score: number;
  details: Record<string, any>;
}

interface AnalysisSuggestionsProps {
  result: AnalysisResult | null;
  loading: boolean;
  error: string | null;
  onApply?: (suggestion: string) => void;
  onDismiss?: (suggestion: string) => void;
}

const AnalysisSuggestions: React.FC<AnalysisSuggestionsProps> = ({
  result,
  loading,
  error,
  onApply,
  onDismiss
}) => {
  if (loading) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Sugestões de Melhoria</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Score:</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {result.score.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {result.suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <p className="text-gray-700 mb-4">{suggestion}</p>
            
            <div className="flex justify-end space-x-2">
              {onDismiss && (
                <button
                  onClick={() => onDismiss(suggestion)}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Ignorar
                </button>
              )}
              {onApply && (
                <button
                  onClick={() => onApply(suggestion)}
                  className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Aplicar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {result.details && Object.keys(result.details).length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Detalhes da Análise</h3>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(result.details, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisSuggestions; 