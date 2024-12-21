import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SiteAnalyzer from '../SiteAnalyzer';
import { useAnalysis } from '@/hooks/useAnalysis';

// Mock do hook useAnalysis
jest.mock('@/hooks/useAnalysis');
const mockUseAnalysis = useAnalysis as jest.MockedFunction<typeof useAnalysis>;

describe('SiteAnalyzer', () => {
  const mockAnalyze = jest.fn();
  const mockResult = {
    suggestions: ['Suggestion 1', 'Suggestion 2'],
    score: 0.85,
    details: { key: 'value' }
  };

  beforeEach(() => {
    mockUseAnalysis.mockReturnValue({
      analyze: mockAnalyze,
      result: null,
      loading: false,
      error: null
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<SiteAnalyzer />);
    expect(screen.getByText('Análise Automática do Site')).toBeInTheDocument();
  });

  it('displays analysis types', () => {
    render(<SiteAnalyzer />);
    expect(screen.getByText('Layout')).toBeInTheDocument();
    expect(screen.getByText('SEO')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
    expect(screen.getByText('Imagens')).toBeInTheDocument();
  });

  it('allows selecting analysis type', () => {
    render(<SiteAnalyzer />);
    const seoButton = screen.getByText('SEO').closest('button');
    fireEvent.click(seoButton!);
    expect(seoButton).toHaveClass('border-blue-500');
  });

  it('handles content input', () => {
    render(<SiteAnalyzer />);
    const textarea = screen.getByPlaceholderText(/Digite ou cole o conteúdo/i);
    fireEvent.change(textarea, { target: { value: 'Test content' } });
    expect(textarea).toHaveValue('Test content');
  });

  it('disables analyze button when content is empty', () => {
    render(<SiteAnalyzer />);
    const button = screen.getByText('Analisar');
    expect(button).toBeDisabled();
  });

  it('enables analyze button when content is provided', () => {
    render(<SiteAnalyzer />);
    const textarea = screen.getByPlaceholderText(/Digite ou cole o conteúdo/i);
    fireEvent.change(textarea, { target: { value: 'Test content' } });
    const button = screen.getByText('Analisar');
    expect(button).not.toBeDisabled();
  });

  it('calls analyze function when button is clicked', async () => {
    render(<SiteAnalyzer />);
    const textarea = screen.getByPlaceholderText(/Digite ou cole o conteúdo/i);
    fireEvent.change(textarea, { target: { value: 'Test content' } });
    const button = screen.getByText('Analisar');
    fireEvent.click(button);
    await waitFor(() => {
      expect(mockAnalyze).toHaveBeenCalledWith('layout', 'Test content');
    });
  });

  it('displays loading state', () => {
    mockUseAnalysis.mockReturnValue({
      analyze: mockAnalyze,
      result: null,
      loading: true,
      error: null
    });
    render(<SiteAnalyzer />);
    expect(screen.getByText('Analisando...')).toBeInTheDocument();
  });

  it('displays analysis results', () => {
    mockUseAnalysis.mockReturnValue({
      analyze: mockAnalyze,
      result: mockResult,
      loading: false,
      error: null
    });
    render(<SiteAnalyzer />);
    expect(screen.getByText('Suggestion 1')).toBeInTheDocument();
    expect(screen.getByText('Suggestion 2')).toBeInTheDocument();
  });

  it('displays error message', () => {
    mockUseAnalysis.mockReturnValue({
      analyze: mockAnalyze,
      result: null,
      loading: false,
      error: 'Test error'
    });
    render(<SiteAnalyzer />);
    expect(screen.getByText('Error: Test error')).toBeInTheDocument();
  });
}); 