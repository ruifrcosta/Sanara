import { renderHook, act } from '@testing-library/react';
import { useAnalysis } from '../useAnalysis';

type MockResponse = {
  suggestions: string[];
  score: number;
  details: Record<string, unknown>;
};

describe('useAnalysis', () => {
  const mockResponse: MockResponse = {
    suggestions: ['Test suggestion'],
    score: 0.85,
    details: { key: 'value' }
  };

  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useAnalysis());
    expect(result.current.result).toBeNull();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeNull();
  });

  it('handles successful analysis', async () => {
    const { result } = renderHook(() => useAnalysis());

    await act(async () => {
      await result.current.analyze('layout', 'Test content');
    });

    expect(result.current.result).toEqual(mockResponse);
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeNull();
    expect(global.fetch).toHaveBeenCalledWith('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'layout',
        content: 'Test content'
      })
    });
  });

  it('handles analysis error', async () => {
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Failed to analyze content'
      } as Response)
    );

    const { result } = renderHook(() => useAnalysis());

    await act(async () => {
      await result.current.analyze('layout', 'Test content');
    });

    expect(result.current.result).toBeNull();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBe('Failed to analyze content');
  });

  it('handles network error', async () => {
    (global.fetch as jest.Mock) = jest.fn(() => 
      Promise.reject(new Error('Network error'))
    );

    const { result } = renderHook(() => useAnalysis());

    await act(async () => {
      await result.current.analyze('layout', 'Test content');
    });

    expect(result.current.result).toBeNull();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBe('Network error');
  });

  it('updates loading state during analysis', async () => {
    const { result } = renderHook(() => useAnalysis());

    let promise: Promise<void>;
    await act(() => {
      promise = result.current.analyze('layout', 'Test content');
      expect(result.current.loading).toBeTruthy();
      return promise;
    });

    expect(result.current.loading).toBeFalsy();
  });

  it('clears previous error when starting new analysis', async () => {
    (global.fetch as jest.Mock) = jest.fn()
      .mockImplementationOnce(() => Promise.reject(new Error('First error')))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      } as Response));

    const { result } = renderHook(() => useAnalysis());

    await act(async () => {
      await result.current.analyze('layout', 'Test content');
    });

    expect(result.current.error).toBe('First error');

    await act(async () => {
      await result.current.analyze('layout', 'Test content');
    });

    expect(result.current.error).toBeNull();
    expect(result.current.result).toEqual(mockResponse);
  });
}); 