/**
 * Represents a falling item in the game
 */
export class Item {
  // Unique identifier for the item
  id: string;
  
  // Position properties
  x: number;
  y: number;
  
  // Movement properties
  speed: number;
  velocityX: number; // Horizontal velocity
  maxHorizontalSpeed: number; // Maximum horizontal speed
  acceleration: number; // Vertical acceleration
  maxSpeed: number; // Maximum falling speed
  
  // Value properties
  baseValue: number;
  
  // Visual properties
  element: HTMLElement;
  width: number;
  height: number;
  
  // State
  isCollected: boolean;
  isRising: boolean; // Whether the item is rising from the bottom
  
  /**
   * Create a new falling item
   * @param id Unique identifier
   * @param x X position (horizontal)
   * @param y Y position (vertical)
   * @param speed Falling speed in pixels per second
   * @param baseValue Base currency value of the item
   * @param container Parent element to append the item to
   */
  constructor(
    id: string,
    x: number,
    y: number,
    speed: number,
    baseValue: number,
    container: HTMLElement
  ) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.baseValue = baseValue;
    this.isCollected = false;
    this.isRising = false;
    
    // Initialize momentum properties
    this.velocityX = (Math.random() - 0.5) * 20; // Random initial horizontal velocity
    this.maxHorizontalSpeed = 30; // Maximum horizontal speed
    this.acceleration = 0.5; // Vertical acceleration
    this.maxSpeed = 800; // Maximum falling speed
    
    // Create the visual element
    this.element = document.createElement('div');
    this.element.className = 'game-item';
    this.element.id = `item-${id}`;
    
    // Set initial size (can be adjusted based on item type/value)
    this.width = 40;
    this.height = 40;
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    
    // Position the element
    this.updatePosition();
    
    // Add to container
    container.appendChild(this.element);
  }
  
  /**
   * Update the item's position based on its current x and y coordinates
   */
  updatePosition(): void {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }
  
  /**
   * Move the item down based on its speed and the time elapsed
   * @param deltaTime Time elapsed since last update in seconds
   * @returns Whether the item is still within the container bounds
   */
  update(deltaTime: number): boolean {
    if (this.isCollected) return false;
    
    if (this.isRising) {
      // For rising balls, we move upward and slow down as they rise
      const screenHeight = window.innerHeight;
      const progressUpScreen = Math.min(1, Math.max(0, 1 - (this.y / screenHeight)));
      const decelerationFactor = 1 + (progressUpScreen * 2); // Increases from 1 to 3 as item rises
      
      // Apply deceleration with the dynamic factor
      this.speed -= this.acceleration * deltaTime * 50 * decelerationFactor;
      
      // Ensure minimum speed
      if (this.speed < 50) {
        this.speed = 50;
      }
      
      // Move up based on speed and time elapsed
      this.y -= this.speed * deltaTime;
    } else {
      // Apply vertical acceleration based on screen position
      // Items accelerate more as they fall further down the screen
      const screenHeight = window.innerHeight;
      const progressDownScreen = Math.min(1, Math.max(0, this.y / screenHeight));
      const accelerationFactor = 1 + (progressDownScreen * 2); // Increases from 1 to 3 as item falls
      
      // Apply acceleration with the dynamic factor
      this.speed += this.acceleration * deltaTime * 100 * accelerationFactor;
      
      // Limit falling speed
      if (this.speed > this.maxSpeed) {
        this.speed = this.maxSpeed;
      }
      
      // Move down based on speed and time elapsed
      this.y += this.speed * deltaTime;
    }
    
    // Apply horizontal movement with bouncing off edges
    this.x += this.velocityX * deltaTime;
    
    // Bounce off left edge
    if (this.x < 0) {
      this.x = 0;
      this.velocityX = -this.velocityX * 0.8; // Dampen the bounce
    }
    
    // Bounce off right edge
    if (this.x > window.innerWidth - this.width) {
      this.x = window.innerWidth - this.width;
      this.velocityX = -this.velocityX * 0.8; // Dampen the bounce
    }
    
    // Apply horizontal drag
    this.velocityX *= 0.99;
    
    // Limit horizontal speed
    if (Math.abs(this.velocityX) > this.maxHorizontalSpeed) {
      this.velocityX = this.maxHorizontalSpeed * Math.sign(this.velocityX);
    }
    
    // Update the visual position
    this.updatePosition();
    
    return true;
  }
  
  /**
   * Check if a point (e.g., from a click event) is within this item
   * @param pointX X coordinate of the point
   * @param pointY Y coordinate of the point
   * @returns Whether the point is within the item's bounds
   */
  containsPoint(pointX: number, pointY: number): boolean {
    // The item's position (this.x, this.y) is the center of the item
    // We need to calculate the bounds based on the center
    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;
    
    return (
      pointX >= this.x - halfWidth &&
      pointX <= this.x + halfWidth &&
      pointY >= this.y - halfHeight &&
      pointY <= this.y + halfHeight
    );
  }
  
  /**
   * Mark the item as collected and return its value
   * @returns The base value of the item
   */
  collect(): number {
    if (!this.isCollected) {
      this.isCollected = true;
      this.element.classList.add('collected');
      
      // Remove the element after the collection animation
      setTimeout(() => {
        if (this.element.parentNode) {
          this.element.parentNode.removeChild(this.element);
        }
      }, 500);
    }
    
    return this.baseValue;
  }
  
  /**
   * Get the base value of the item
   * @returns The base value of the item
   */
  getValue(): number {
    return this.baseValue;
  }
  
  /**
   * Remove the item from the DOM without collecting it
   */
  remove(): void {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
