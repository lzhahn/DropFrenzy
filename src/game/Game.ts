import { ItemManager } from './ItemManager';
import { UpgradeManager } from '../upgrades/UpgradeManager';

/**
 * Main Game class that handles the core game loop and state
 */
export class Game {
  private container: HTMLElement;
  private isRunning: boolean = false;
  private lastTimestamp: number = 0;
  private currencyDisplay: HTMLElement | null;
  private itemManager: ItemManager;
  private upgradeManager: UpgradeManager;
  private autoClickTimer: number = 0;

  constructor(container: HTMLElement) {
    this.container = container;
    this.currencyDisplay = document.getElementById('currency-value');
    this.itemManager = new ItemManager(container);

    // Initialize the upgrade manager with currency update callback
    this.upgradeManager = new UpgradeManager(0, () => {
      this.updateCurrencyDisplay();
    });

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
   * Get the upgrade manager instance
   */
  getUpgradeManager(): UpgradeManager {
    return this.upgradeManager;
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
    // Apply upgrade effects
    this.applyUpgradeEffects();

    // Handle auto-clicking if the upgrade is active
    this.handleAutoClicker(deltaTime);

    // Update items (spawn new ones, move existing ones)
    this.itemManager.update(deltaTime);
  }

  /**
   * Apply effects from upgrades to the game
   */
  private applyUpgradeEffects(): void {
    // Apply drop rate multiplier
    this.itemManager.setSpawnRateMultiplier(this.upgradeManager.getDropRateMultiplier());

    // Apply gravity/speed multiplier
    this.itemManager.setSpeedMultiplier(this.upgradeManager.getGravityMultiplier());
  }

  /**
   * Handle auto-clicker functionality
   */
  private handleAutoClicker(deltaTime: number): void {
    const itemsPerSecond = this.upgradeManager.getAutoClickRate();

    if (itemsPerSecond <= 0) return;

    // Accumulate time for auto-clicks
    this.autoClickTimer += deltaTime;

    // Calculate how many items should be collected this frame
    // Use a more precise calculation that accounts for fractional items
    const itemsToCollect = Math.floor(itemsPerSecond * this.autoClickTimer);

    if (itemsToCollect > 0) {
      // Reduce the timer by the time used for collection
      // This ensures we don't lose fractional time
      this.autoClickTimer -= itemsToCollect / itemsPerSecond;

      // Collect multiple items at once
      this.collectMultipleItems(itemsToCollect);
    }
  }

  /**
   * Collect multiple items at once using the auto-clicker
   */
  private collectMultipleItems(count: number): void {
    // Get all available items that haven't been collected yet
    const items = Array.from(this.itemManager['items'].values())
      .filter(item => !item.isCollected);

    if (items.length === 0) return;

    // Determine how many items to actually collect (limited by available items)
    const itemsToCollect = Math.min(count, items.length);
    
    // Sort items by how close they are to the bottom of the screen
    // This prioritizes items that are about to disappear
    items.sort((a, b) => b.y - a.y);
    
    // Collect the determined number of items
    let collectedCount = 0;
    for (let i = 0; i < items.length && collectedCount < itemsToCollect; i++) {
      const item = items[i];
      
      // Skip if the item has already been collected
      if (item.isCollected) continue;
      
      // Calculate the center point of the item
      const centerX = item.x + item.width / 2;
      const centerY = item.y + item.height / 2;
      
      // Collect the item directly using its center point
      const value = this.itemManager.collectItemAt(centerX, centerY);

      if (value > 0) {
        collectedCount++;
        
        // Apply the value multiplier from upgrade manager
        const valueMultiplier = this.upgradeManager.getValueMultiplier();
        let finalValue = Math.round(value * valueMultiplier);
        
        // Check for critical hit based on upgrade
        const criticalChance = this.upgradeManager.getCriticalChance();

        if (Math.random() < criticalChance) {
          // Critical hit! Use the multiplier from upgrade manager
          const critMultiplier = this.upgradeManager.getCriticalMultiplier();
          finalValue = Math.round(finalValue * critMultiplier);

          // Create visual feedback at the item's position
          this.createCriticalHitFeedback(centerX, centerY);
        } else {
          // Create regular collection feedback
          this.createCollectionFeedback(centerX, centerY, finalValue);
        }

        // If an item was collected, add its value to currency
        this.addCurrency(finalValue);
      }
    }
    
    // Debug logging to help identify issues
    if (collectedCount === 0 && items.length > 0) {
      console.log(`Auto collector failed to collect any items. Available: ${items.length}, Attempted: ${itemsToCollect}`);
    }
  }

  /**
   * Handle click events on the game container
   */
  private handleClick(event: MouseEvent): void {
    // Try to collect an item at the click position
    const value = this.itemManager.collectItemAt(event.clientX, event.clientY);

    if (value > 0) {
      // Apply the value multiplier from upgrade manager
      const valueMultiplier = this.upgradeManager.getValueMultiplier();
      let finalValue = Math.round(value * valueMultiplier);
      
      // Check for critical hit based on upgrade
      const criticalChance = this.upgradeManager.getCriticalChance();

      if (Math.random() < criticalChance) {
        // Critical hit! Use the multiplier from upgrade manager
        const critMultiplier = this.upgradeManager.getCriticalMultiplier();
        finalValue = Math.round(finalValue * critMultiplier);

        // Show critical hit feedback
        this.createCriticalHitFeedback(event.clientX, event.clientY);
      } else {
        // Show regular collection feedback
        this.createCollectionFeedback(event.clientX, event.clientY, finalValue);
      }

      // If an item was collected, add its value to currency
      this.addCurrency(finalValue);
    } else {
      // If no item was collected, just create visual feedback
      this.createClickFeedback(event.clientX, event.clientY);
    }
  }

  /**
   * Add currency to the player's total
   */
  public addCurrency(amount: number): void {
    this.upgradeManager.addCurrency(amount);
    this.updateCurrencyDisplay();
  }

  /**
   * Update the currency display in the UI
   */
  private updateCurrencyDisplay(): void {
    if (this.currencyDisplay) {
      // Ensure currency is always displayed as an integer
      const currency = Math.floor(this.upgradeManager.getCurrency());
      this.currencyDisplay.textContent = currency.toString();
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

  /**
   * Create critical hit feedback at click position
   */
  private createCriticalHitFeedback(x: number, y: number): void {
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = 'critical-feedback';
    feedback.style.left = `${x}px`;
    feedback.style.top = `${y}px`;
    feedback.textContent = 'CRITICAL!';

    // Add to container
    this.container.appendChild(feedback);

    // Remove after animation
    setTimeout(() => {
      if (feedback.parentNode === this.container) {
        this.container.removeChild(feedback);
      }
    }, 800);
  }

  /**
   * Create collection feedback at click position
   */
  private createCollectionFeedback(x: number, y: number, value: number): void {
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = 'collection-feedback';
    feedback.style.left = `${x}px`;
    feedback.style.top = `${y}px`;
    feedback.textContent = `+${value}`;

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
