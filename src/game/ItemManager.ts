import { Item } from './Item';

/**
 * Manages the creation, updating, and removal of game items
 */
export class ItemManager {
  private container: HTMLElement;
  private items: Map<string, Item> = new Map();
  private nextItemId: number = 0;
  
  // Item spawn settings
  private spawnInterval: number = 1.5; // seconds between spawns
  private timeSinceLastSpawn: number = 0;
  private baseSpeed: number = 250; // pixels per second
  private baseValue: number = 1;
  
  // Item spawn rate modifiers (will be affected by upgrades)
  private spawnRateMultiplier: number = 1.1;
  private speedMultiplier: number = 1;
  
  constructor(container: HTMLElement) {
    this.container = container;
  }
  
  /**
   * Update all items and spawn new ones based on elapsed time
   * @param deltaTime Time elapsed since last update in seconds
   * @param risingChance Chance of spawning a rising item (default 0)
   * @returns Array of items that went off-screen without being collected
   */
  update(deltaTime: number, risingChance: number = 0): Item[] {
    // Update spawn timer
    this.timeSinceLastSpawn += deltaTime;
    
    // Check if it's time to spawn a new item
    if (this.timeSinceLastSpawn >= this.spawnInterval / this.spawnRateMultiplier) {
      // Determine if we should spawn a rising ball
      if (risingChance > 0 && Math.random() < risingChance) {
        this.spawnRisingItem();
      } else {
        this.spawnItem();
      }
      this.timeSinceLastSpawn = 0;
    }
    
    // Update all existing items
    const missedItems: Item[] = [];
    
    this.items.forEach(item => {
      // Update the item's position
      item.update(deltaTime);
      
      // Check if the item has gone off-screen
      if ((!item.isRising && item.y > window.innerHeight + item.height) || 
          (item.isRising && item.y < -item.height)) {
        if (!item.isCollected) {
          missedItems.push(item);
        }
        this.removeItem(item.id);
      }
    });
    
    return missedItems;
  }
  
  /**
   * Spawn a new item at a random X position at the top of the window
   */
  private spawnItem(): void {
    // Generate a random X position within the window
    const randomX = Math.random() * window.innerWidth;
    
    // Create a new item
    const item = new Item(
      this.nextItemId.toString(),
      randomX,
      -20, // Start slightly above the window
      this.baseSpeed * this.speedMultiplier,
      this.baseValue, // Use base value only, multiplier will be applied when collected
      this.container
    );
    
    // Add to the items map
    this.items.set(item.id, item);
    
    // Increment the ID counter
    this.nextItemId++;
  }
  
  /**
   * Spawn a new item at a random X position at the bottom of the window
   * that will rise upward
   */
  private spawnRisingItem(): void {
    // Generate a random X position within the window
    const randomX = Math.random() * window.innerWidth;
    
    // Create a new item
    const item = new Item(
      this.nextItemId.toString(),
      randomX,
      window.innerHeight + 20, // Start slightly below the window
      this.baseSpeed * this.speedMultiplier * 0.8, // Slightly slower than falling items
      this.baseValue, // Base value will be multiplied by rising value multiplier when collected
      this.container
    );
    
    // Set this item to rise
    item.isRising = true;
    
    // Add special visual class for rising items
    item.element.classList.add('rising-item');
    
    // Add to the items map
    this.items.set(item.id, item);
    
    // Increment the ID counter
    this.nextItemId++;
  }
  
  /**
   * Collect an item at the specified coordinates
   * @param x X coordinate
   * @param y Y coordinate
   * @param risingValueMultiplier Value multiplier for rising items (default 1.0)
   * @returns The value of the collected item, or 0 if no item was collected
   */
  collectItemAt(x: number, y: number, risingValueMultiplier: number = 1.0): number {
    // Check each item to see if it contains the point
    let collectedValue = 0;
    let collectedItem = null;
    
    // First, find the item that contains the point
    for (const item of this.items.values()) {
      if (!item.isCollected && item.containsPoint(x, y)) {
        collectedItem = item;
        break;
      }
    }
    
    // If we found an item, collect it
    if (collectedItem) {
      // Mark the item as collected
      collectedItem.collect();
      
      // Apply value multiplier for rising items
      const valueMultiplier = collectedItem.isRising ? risingValueMultiplier : 1.0;
      
      // Return the base value of the item (will be multiplied by the game's value multiplier)
      collectedValue = collectedItem.getValue() * valueMultiplier;
    }
    
    return collectedValue;
  }
  
  /**
   * Remove an item from the manager and the DOM
   * @param id ID of the item to remove
   */
  private removeItem(id: string): void {
    const item = this.items.get(id);
    
    if (item) {
      item.remove();
      this.items.delete(id);
    }
  }
  
  /**
   * Remove all items from the manager and the DOM
   */
  clear(): void {
    this.items.forEach(item => item.remove());
    this.items.clear();
  }
  
  /**
   * Set the spawn rate multiplier (affected by upgrades)
   * @param multiplier New spawn rate multiplier
   */
  setSpawnRateMultiplier(multiplier: number): void {
    this.spawnRateMultiplier = Math.max(1, multiplier);
  }
  
  /**
   * Set the speed multiplier (affected by upgrades)
   * @param multiplier New speed multiplier
   */
  setSpeedMultiplier(multiplier: number): void {
    this.speedMultiplier = Math.max(1, multiplier);
  }
  
  /**
   * Get the current number of active items
   */
  getItemCount(): number {
    return this.items.size;
  }
}
