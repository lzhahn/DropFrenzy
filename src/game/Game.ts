import { ItemManager } from './ItemManager';

/**
 * Main Game class that handles the core game loop and state
 */
export class Game {
  private container: HTMLElement;
  private currency: number = 0;
  private isRunning: boolean = false;
  private lastTimestamp: number = 0;
  private currencyDisplay: HTMLElement | null;
  private itemManager: ItemManager;
  
  constructor(container: HTMLElement) {
    this.container = container;
    this.currencyDisplay = document.getElementById('currency-value');
    this.itemManager = new ItemManager(container);
    this.init();
  }
  
  /**
   * Initialize game event listeners and setup
   */
  private init(): void {
    // Set up click event listener on the entire document
    document.addEventListener('click', this.handleClick.bind(this));
    
    // Initialize currency display
    this.updateCurrencyDisplay();
  }
  
  /**
   * Start the game loop
   */
  public start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTimestamp = performance.now();
    requestAnimationFrame(this.gameLoop.bind(this));
    
    console.log('Game started');
  }
  
  /**
   * Stop the game loop
   */
  public stop(): void {
    this.isRunning = false;
    console.log('Game stopped');
  }
  
  /**
   * Main game loop
   */
  private gameLoop(timestamp: number): void {
    if (!this.isRunning) return;
    
    // Calculate delta time (time since last frame in seconds)
    const deltaTime = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;
    
    // Update game state
    this.update(deltaTime);
    
    // Continue the loop
    requestAnimationFrame(this.gameLoop.bind(this));
  }
  
  /**
   * Update game state based on delta time
   */
  private update(deltaTime: number): void {
    // Update items (spawn new ones, move existing ones)
    this.itemManager.update(deltaTime);
    
    // In the future, we might want to penalize missed items
    // For now, we just let them disappear
  }
  
  /**
   * Handle click events on the game container
   */
  private handleClick(event: MouseEvent): void {
    // Try to collect an item at the click position
    const value = this.itemManager.collectItemAt(event.clientX, event.clientY);
    
    if (value > 0) {
      // If an item was collected, add its value to currency
      this.addCurrency(value);
    } else {
      // If no item was collected, just create visual feedback
      this.createClickFeedback(event.clientX, event.clientY);
    }
  }
  
  /**
   * Add currency to the player's total
   */
  public addCurrency(amount: number): void {
    this.currency += amount;
    this.updateCurrencyDisplay();
  }
  
  /**
   * Update the currency display in the UI
   */
  private updateCurrencyDisplay(): void {
    if (this.currencyDisplay) {
      this.currencyDisplay.textContent = this.currency.toString();
    }
  }
  
  /**
   * Create visual feedback at click position
   */
  private createClickFeedback(x: number, y: number): void {
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = 'click-feedback';
    feedback.style.left = `${x}px`;
    feedback.style.top = `${y}px`;
    
    // Add to container
    this.container.appendChild(feedback);
    
    // Remove after animation
    setTimeout(() => {
      if (feedback.parentNode === this.container) {
        this.container.removeChild(feedback);
      }
    }, 500);
  }
}
