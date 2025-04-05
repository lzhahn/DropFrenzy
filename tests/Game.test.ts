import { Game } from '../src/game/Game';
import { ItemManager } from '../src/game/ItemManager';

// Create a mock implementation of ItemManager
const mockUpdate = jest.fn();
const mockCollectItemAt = jest.fn();
const mockClear = jest.fn();

// Mock the ItemManager class
jest.mock('../src/game/ItemManager', () => {
  return {
    ItemManager: jest.fn().mockImplementation(() => {
      return {
        update: mockUpdate,
        collectItemAt: mockCollectItemAt,
        clear: mockClear
      };
    })
  };
});

// Create a test-specific subclass of Game that exposes private methods for testing
class TestableGame extends Game {
  public testHandleClick(x: number, y: number): void {
    // Directly call the private method with a mock event
    const mockEvent = { clientX: x, clientY: y } as MouseEvent;
    // @ts-ignore - Accessing private method for testing
    this.handleClick(mockEvent);
  }
  
  public getCurrency(): number {
    // @ts-ignore - Accessing private property for testing
    return this.currency;
  }
}

describe('Game', () => {
  let container: HTMLElement;
  let currencyDisplay: HTMLElement;
  let game: TestableGame;
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup DOM elements
    document.body.innerHTML = '';
    
    // Create currency display element first so it's available when Game is instantiated
    currencyDisplay = document.createElement('div');
    currencyDisplay.id = 'currency-value';
    document.body.appendChild(currencyDisplay);
    
    // Create container
    container = document.createElement('div');
    container.id = 'game-container';
    document.body.appendChild(container);
    
    // Create game instance
    game = new TestableGame(container);
  });
  
  afterEach(() => {
    // Stop the game to prevent animation frame callbacks
    game.stop();
    
    // Clean up DOM
    document.body.innerHTML = '';
  });
  
  test('should initialize with correct default values', () => {
    // Check if ItemManager was created
    expect(ItemManager).toHaveBeenCalledWith(container);
    
    // Check if currency display is initialized to 0
    expect(currencyDisplay.textContent).toBe('0');
    
    // Check if click event listener is added to document
    const eventListenerSpy = jest.spyOn(document, 'addEventListener');
    
    // Create a new game to trigger the event listener setup
    new TestableGame(container);
    
    expect(eventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
    eventListenerSpy.mockRestore();
  });
  
  test('should handle click events and collect items', () => {
    // Mock the ItemManager's collectItemAt to return a value
    mockCollectItemAt.mockReturnValueOnce(10);
    
    // Directly call the test method that simulates a click
    game.testHandleClick(100, 100);
    
    // Check if collectItemAt was called with correct coordinates
    expect(mockCollectItemAt).toHaveBeenCalledWith(100, 100);
    
    // Check if currency was updated
    expect(game.getCurrency()).toBe(10);
    expect(currencyDisplay.textContent).toBe('10');
  });
  
  test('should handle click events that miss items', () => {
    // Mock the ItemManager's collectItemAt to return 0 (no item collected)
    mockCollectItemAt.mockReturnValueOnce(0);
    
    // Spy on appendChild to check if click feedback is created
    const appendChildSpy = jest.spyOn(container, 'appendChild');
    
    // Directly call the test method that simulates a click
    game.testHandleClick(100, 100);
    
    // Check if collectItemAt was called
    expect(mockCollectItemAt).toHaveBeenCalledWith(100, 100);
    
    // Check if click feedback was created
    expect(appendChildSpy).toHaveBeenCalledWith(expect.any(HTMLElement));
    
    // Currency should remain at 0
    expect(game.getCurrency()).toBe(0);
    expect(currencyDisplay.textContent).toBe('0');
    
    appendChildSpy.mockRestore();
  });
  
  test('should add currency and update display', () => {
    // Add currency
    game.addCurrency(5);
    expect(game.getCurrency()).toBe(5);
    expect(currencyDisplay.textContent).toBe('5');
    
    // Add more currency
    game.addCurrency(10);
    expect(game.getCurrency()).toBe(15);
    expect(currencyDisplay.textContent).toBe('15');
  });
});
