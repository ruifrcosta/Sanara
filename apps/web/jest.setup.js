import '@testing-library/jest-dom';

// Mock do fetch global
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
    clone: () => Promise.resolve({}),
    blob: () => Promise.resolve(new Blob()),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    formData: () => Promise.resolve(new FormData())
  })
) as jest.Mock;

// Mock do window.gtag
global.gtag = jest.fn();

// Mock do ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
};

// Mock do IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
  private callback: IntersectionObserverCallback;
};

// Mock do matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
}); 