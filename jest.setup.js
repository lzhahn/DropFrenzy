import '@testing-library/jest-dom';

// Mock the Howler library
jest.mock('howler', () => ({
  Howl: jest.fn().mockImplementation(() => ({
    play: jest.fn(),
    stop: jest.fn(),
  })),
})); 