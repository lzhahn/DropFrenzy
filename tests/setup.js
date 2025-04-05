// Mock browser globals for Jest tests

// Mock window.innerWidth and window.innerHeight
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768
});

// Mock performance.now()
if (typeof window.performance === 'undefined') {
  window.performance = {
    now: jest.fn(() => Date.now())
  };
}

// Mock requestAnimationFrame
window.requestAnimationFrame = jest.fn(callback => {
  return setTimeout(() => callback(performance.now()), 0);
});

// Mock cancelAnimationFrame
window.cancelAnimationFrame = jest.fn(id => {
  clearTimeout(id);
});
