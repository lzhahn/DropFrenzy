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
  collisionCooldown: number = 0; // Cooldown to prevent multiple collisions in quick succession
  
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
      // For rising balls, we move upward and accelerate as they rise
      const screenHeight = window.innerHeight;
      const progressUpScreen = Math.min(1, Math.max(0, 1 - (this.y / screenHeight)));
      
      // Accelerate as the ball rises (starts at base speed, increases up to 3x at top)
      const speedFactor = 1 + (progressUpScreen * 2);
      
      // Move upward with the calculated speed
      this.y -= this.speed * speedFactor * deltaTime;
      
      // Apply horizontal movement with bouncing off edges
      this.x += this.velocityX * deltaTime;
      
      // Check if the item has gone off the top of the screen
      if (this.y < -this.height) {
        return false; // Remove the item
      }
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
    
    // Update collision cooldown
    if (this.collisionCooldown > 0) {
      this.collisionCooldown -= deltaTime;
    }
    
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
    // Add a larger clickable area (20px extra in all directions)
    const clickableAreaExtension = 20;
    const halfWidth = (this.width / 2) + clickableAreaExtension;
    const halfHeight = (this.height / 2) + clickableAreaExtension;
    
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
  
  /**
   * Check for collision with another item
   * @param other The other item to check collision with
   * @returns Whether a collision occurred
   */
  checkCollision(other: Item): boolean {
    // Skip if either item is collected or if we're in cooldown
    if (this.isCollected || other.isCollected || this.collisionCooldown > 0) {
      return false;
    }
    
    // Simple AABB collision detection
    const collision = (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    );
    
    if (collision) {
      this.handleCollision(other);
      return true;
    }
    
    return false;
  }
  
  /**
   * Handle collision response between this item and another
   * @param other The other item involved in the collision
   */
  handleCollision(other: Item): void {
    // Set collision cooldown to prevent multiple collisions in quick succession
    this.collisionCooldown = 0.1; // 100ms cooldown
    
    // Calculate collision vector (direction from other to this)
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Avoid division by zero
    if (distance === 0) return;
    
    // Normalize the collision vector
    const nx = dx / distance;
    const ny = dy / distance;
    
    // Calculate relative velocity
    const vx = this.velocityX - other.velocityX;
    const vy = this.speed * (this.isRising ? -1 : 1) - other.speed * (other.isRising ? -1 : 1);
    
    // Calculate velocity along the normal
    const velocityAlongNormal = vx * nx + vy * ny;
    
    // Don't resolve if velocities are separating
    if (velocityAlongNormal > 0) return;
    
    // Calculate impulse scalar (how bouncy the collision is)
    const restitution = 0.6; // Bounciness factor (0 = no bounce, 1 = perfect bounce)
    const impulseScalar = -(1 + restitution) * velocityAlongNormal;
    
    // Apply impulse to velocities
    this.velocityX += nx * impulseScalar * 0.5;
    other.velocityX -= nx * impulseScalar * 0.5;
    
    // Adjust vertical speeds (convert to velocityY for calculation)
    const thisVelocityY = this.speed * (this.isRising ? -1 : 1);
    const otherVelocityY = other.speed * (other.isRising ? -1 : 1);
    
    const newThisVelocityY = thisVelocityY + ny * impulseScalar * 0.5;
    const newOtherVelocityY = otherVelocityY - ny * impulseScalar * 0.5;
    
    // Update speeds based on new velocity directions
    this.speed = Math.abs(newThisVelocityY) * 0.8; // Reduce speed slightly after collision
    other.speed = Math.abs(newOtherVelocityY) * 0.8;
    
    // Prevent items from getting stuck together by moving them apart slightly
    const overlap = (this.width + other.width) / 2 - distance;
    if (overlap > 0) {
      this.x += nx * overlap * 0.5;
      this.y += ny * overlap * 0.5;
      other.x -= nx * overlap * 0.5;
      other.y -= ny * overlap * 0.5;
    }
    
    // Update positions after collision
    this.updatePosition();
    other.updatePosition();
  }
}
