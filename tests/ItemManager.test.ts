import { ItemManager } from '../src/game/ItemManager';
import { Item } from '../src/game/Item';

// Mock the Item class
jest.mock('../src/game/Item', () => {
  return {
    Item: jest.fn().mockImplementation((id, x, y, speed, baseValue, container) => {
      return {
        id,
        x,
        y,
        speed,
        baseValue,
        width: 40,
        height: 40,
        isCollected: false,
        update: jest.fn(function(deltaTime) {
          this.y += this.speed * deltaTime;
          return this;
        }),
        containsPoint: jest.fn(function(pointX, pointY) {
          // Simple mock for containsPoint
          const halfWidth = this.width / 2;
          const halfHeight = this.height / 2;
          return (
            pointX >= this.x - halfWidth &&
            pointX <= this.x + halfWidth &&
            pointY >= this.y - halfHeight &&
            pointY <= this.y + halfHeight
          );
        }),
        collect: jest.fn(function() {
          this.isCollected = true;
          return this.baseValue;
        }),
        remove: jest.fn()
      };
    })
  };
});

describe('ItemManager', () => {
  let container: HTMLElement;
  let itemManager: ItemManager;
  
  beforeEach(() => {
    // Setup a fresh container for each test
    container = document.createElement('div');
    container.id = 'game-container';
    document.body.appendChild(container);
    
    // Create item manager
    itemManager = new ItemManager(container);
    
    // Reset the mock implementation counters
    jest.clearAllMocks();
    
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });
  });
  
  afterEach(() => {
    // Clean up DOM after each test
    document.body.innerHTML = '';
  });
  
  test('should spawn items when enough time has passed', () => {
    // Initially there should be no items
    expect(itemManager.getItemCount()).toBe(0);
    
    // Update with not enough time to spawn
    itemManager.update(0.5);
    expect(itemManager.getItemCount()).toBe(0);
    expect(Item).not.toHaveBeenCalled();
    
    // Update with enough time to spawn one item
    itemManager.update(2);
    expect(itemManager.getItemCount()).toBe(1);
    expect(Item).toHaveBeenCalledTimes(1);
    
    // Update with enough time to spawn another item
    itemManager.update(2);
    expect(itemManager.getItemCount()).toBe(2);
    expect(Item).toHaveBeenCalledTimes(2);
  });
  
  test('should remove items that go off-screen', () => {
    // Force spawn an item
    itemManager.update(2);
    expect(itemManager.getItemCount()).toBe(1);
    
    // Get the mock item that was created
    const mockItem = (Item as jest.Mock).mock.results[0].value;
    
    // Position the item below the screen
    mockItem.y = window.innerHeight + mockItem.height + 1;
    
    // Update to trigger removal check
    const missedItems = itemManager.update(0.1);
    
    // Item should be removed
    expect(itemManager.getItemCount()).toBe(0);
    expect(missedItems.length).toBe(1);
    expect(mockItem.remove).toHaveBeenCalled();
  });
  
  test('should collect items at click position', () => {
    // Force spawn an item
    itemManager.update(2);
    
    // Get the mock item that was created
    const mockItem = (Item as jest.Mock).mock.results[0].value;
    mockItem.x = 100;
    mockItem.y = 100;
    
    // Click at the item's position
    const value = itemManager.collectItemAt(100, 100);
    
    // Item should be collected
    expect(value).toBe(mockItem.baseValue);
    expect(mockItem.collect).toHaveBeenCalled();
    
    // Click away from the item
    const missValue = itemManager.collectItemAt(200, 200);
    
    // No item should be collected
    expect(missValue).toBe(0);
  });
  
  test('should clear all items', () => {
    // Force spawn multiple items
    itemManager.update(2);
    itemManager.update(2);
    expect(itemManager.getItemCount()).toBe(2);
    
    // Clear all items
    itemManager.clear();
    
    // All items should be removed
    expect(itemManager.getItemCount()).toBe(0);
    
    // Each item's remove method should have been called
    const mockItems = (Item as jest.Mock).mock.results;
    mockItems.forEach(result => {
      expect(result.value.remove).toHaveBeenCalled();
    });
  });
  
  test('should apply multipliers to spawn rate, speed, and value', () => {
    // Set multipliers
    itemManager.setSpawnRateMultiplier(2);
    itemManager.setSpeedMultiplier(3);
    itemManager.setValueMultiplier(4);
    
    // Force spawn an item
    itemManager.update(1); // With 2x spawn rate, this should be enough time
    
    // Get the mock item that was created
    const mockItem = (Item as jest.Mock).mock.results[0].value;
    
    // Check if multipliers were applied
    expect(mockItem.speed).toBeGreaterThan(100); // Base speed is 100
    expect(mockItem.baseValue).toBeGreaterThan(1); // Base value is 1
  });
});
