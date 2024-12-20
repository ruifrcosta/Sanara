import { useState } from 'react';

interface AnalysisResult {
  suggestions: string[];
  score: number;
  details: Record<string, any>;
}

interface UseAnalysisResult {
  analyze: (type: string, content: string) => Promise<void>;
  result: AnalysisResult | null;
  loading: boolean;
  error: string | null;
}

export const useAnalysis = (): UseAnalysisResult => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (type: string, content: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type, content })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze content');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    analyze,
    result,
    loading,
    error
  };
}; 