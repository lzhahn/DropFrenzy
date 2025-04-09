/**
 * Represents a single particle in a particle effect
 */
export class Particle {
  private element: HTMLElement;
  private x: number;
  private y: number;
  private velocityX: number;
  private velocityY: number;
  private size: number;
  private opacity: number;
  private lifespan: number;
  private age: number;
  private container: HTMLElement;

  /**
   * Create a new particle
   * @param x Initial X position
   * @param y Initial Y position
   * @param velocityX Initial X velocity
   * @param velocityY Initial Y velocity
   * @param size Particle size in pixels
   * @param color Particle color (CSS color string)
   * @param lifespan Lifespan in seconds
   * @param container Parent element to append the particle to
   * @param value Optional value to display on the particle
   */
  constructor(
    x: number,
    y: number,
    velocityX: number,
    velocityY: number,
    size: number,
    color: string,
    lifespan: number,
    container: HTMLElement,
    value: number | null = null
  ) {
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.size = size;
    this.opacity = 1;
    this.lifespan = lifespan;
    this.age = 0;
    this.container = container;

    // Create the particle element
    this.element = document.createElement('div');
    this.element.className = 'particle';
    this.element.style.width = `${size}px`;
    this.element.style.height = `${size}px`;
    this.element.style.backgroundColor = color;
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
    this.element.style.opacity = '1';

    // If a value is provided, create a floating text element
    if (value !== null) {
      const textElement = document.createElement('div');
      textElement.className = 'floating-text';
      textElement.textContent = `+${value}`;
      textElement.style.left = `${x}px`;
      textElement.style.top = `${y - 20}px`;
      container.appendChild(textElement);

      // Remove the text element after animation completes
      setTimeout(() => {
        if (textElement.parentNode === container) {
          container.removeChild(textElement);
        }
      }, 1500);
    }

    // Add to container
    container.appendChild(this.element);
  }

  /**
   * Update the particle's position and properties
   * @param deltaTime Time elapsed since last update in seconds
   * @returns Whether the particle is still alive
   */
  update(deltaTime: number): boolean {
    // Update age
    this.age += deltaTime;

    // Check if the particle has expired
    if (this.age >= this.lifespan) {
      this.remove();
      return false;
    }

    // Calculate life progress (0 to 1)
    const lifeProgress = this.age / this.lifespan;

    // Update position
    this.x += this.velocityX * deltaTime;
    this.y += this.velocityY * deltaTime;

    // Apply gravity and drag
    this.velocityY += 50 * deltaTime; // Gravity
    this.velocityX *= 0.99; // Horizontal drag
    this.velocityY *= 0.99; // Vertical drag

    // Update opacity based on life progress
    this.opacity = 1 - lifeProgress;

    // Update size (optional: shrink as it ages)
    const newSize = this.size * (1 - lifeProgress * 0.5);

    // Update the element's style
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    this.element.style.opacity = this.opacity.toString();
    this.element.style.width = `${newSize}px`;
    this.element.style.height = `${newSize}px`;

    return true;
  }

  /**
   * Remove the particle from the DOM
   */
  remove(): void {
    if (this.element.parentNode === this.container) {
      this.container.removeChild(this.element);
    }
  }
}
