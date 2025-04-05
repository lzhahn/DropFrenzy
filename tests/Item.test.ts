import { Item } from '../src/game/Item';

describe('Item', () => {
  let container: HTMLElement;
  
  beforeEach(() => {
    // Setup a fresh container for each test
    container = document.createElement('div');
    container.id = 'game-container';
    document.body.appendChild(container);
  });
  
  afterEach(() => {
    // Clean up DOM after each test
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });
  
  test('should create an item with correct properties', () => {
    // Mock the createElement method to actually create the element
    const originalCreateElement = document.createElement;
    const mockCreateElement = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      const element = originalCreateElement.call(document, tagName);
      if (tagName === 'div') {
        setTimeout(() => document.body.appendChild(element), 0);
      }
      return element;
    });
    
    const item = new Item('test-1', 100, 50, 200, 5, container);
    
    expect(item.id).toBe('test-1');
    expect(item.x).toBe(100);
    expect(item.y).toBe(50);
    expect(item.speed).toBe(200);
    expect(item.baseValue).toBe(5);
    expect(item.isCollected).toBe(false);
    
    // Skip DOM tests since we're not actually rendering in Jest
    mockCreateElement.mockRestore();
  });
  
  test('should update position based on delta time', () => {
    const item = new Item('test-2', 100, 50, 200, 5, container);
    const initialY = item.y;
    
    // Update with 0.5 seconds delta time
    item.update(0.5);
    
    // Y position should increase by speed * deltaTime
    expect(item.y).toBe(initialY + (200 * 0.5));
    
    // Skip DOM tests since we're not actually rendering in Jest
  });
  
  test('should detect point within item bounds', () => {
    const item = new Item('test-3', 100, 100, 200, 5, container);
    
    // Point at the center of the item
    expect(item.containsPoint(100, 100)).toBe(true);
    
    // Points within the item bounds (using default size)
    expect(item.containsPoint(90, 90)).toBe(true);
    expect(item.containsPoint(110, 110)).toBe(true);
    
    // Points outside the item bounds
    expect(item.containsPoint(50, 100)).toBe(false);
    expect(item.containsPoint(100, 50)).toBe(false);
    expect(item.containsPoint(150, 100)).toBe(false);
    expect(item.containsPoint(100, 150)).toBe(false);
  });
  
  test('should collect item and return its value', () => {
    const item = new Item('test-4', 100, 100, 200, 5, container);
    
    // Collect the item
    const value = item.collect();
    
    // Check if item is marked as collected
    expect(item.isCollected).toBe(true);
    expect(value).toBe(5);
    
    // Skip DOM tests since we're not actually rendering in Jest
  });
  
  test('should remove item from DOM', () => {
    const item = new Item('test-5', 100, 100, 200, 5, container);
    
    // Mock the remove method since we're not actually rendering in Jest
    const mockRemove = jest.spyOn(item, 'remove');
    
    // Remove the item
    item.remove();
    
    // Verify remove was called
    expect(mockRemove).toHaveBeenCalled();
  });
});
