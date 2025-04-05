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
    // Apply value multiplier
    this.itemManager.setValueMultiplier(this.upgradeManager.getValueMultiplier());

    // Apply drop rate multiplier
    this.itemManager.setSpawnRateMultiplier(this.upgradeManager.getDropRateMultiplier());

    // Apply gravity/speed multiplier
    this.itemManager.setSpeedMultiplier(this.upgradeManager.getGravityMultiplier());
  }

  /**
   * Handle auto-clicker functionality
   */
  private handleAutoClicker(deltaTime: number): void {
    const clicksPerSecond = this.upgradeManager.getAutoClickRate();

    if (clicksPerSecond <= 0) return;

    // Accumulate time for auto-clicks
    this.autoClickTimer += deltaTime;

    // Calculate how many clicks should happen this frame
    const clickInterval = 1 / clicksPerSecond;
    const clicksToPerform = Math.floor(this.autoClickTimer / clickInterval);

    if (clicksToPerform > 0) {
      // Reduce the timer by the time used for clicks
      this.autoClickTimer -= clicksToPerform * clickInterval;

      // Perform the auto-clicks
      for (let i = 0; i < clicksToPerform; i++) {
        this.performAutoClick();
      }
    }
  }

  /**
   * Perform an auto-click at a random position with an active item
   */
  private performAutoClick(): void {
    // Get a random item to click on
    const items = Array.from(this.itemManager['items'].values());

    if (items.length === 0) return;

    // Select a random item
    const randomItem = items[Math.floor(Math.random() * items.length)];

    // Collect the item
    const value = this.itemManager.collectItemAt(
      randomItem.x + randomItem.width / 2,
      randomItem.y + randomItem.height / 2
    );

    if (value > 0) {
      // If an item was collected, add its value to currency
      this.addCurrency(value);

      // Create visual feedback at the item's position
      this.createClickFeedback(
        randomItem.x + randomItem.width / 2,
        randomItem.y + randomItem.height / 2
      );
    }
  }

  /**
   * Handle click events on the game container
   */
  private handleClick(event: MouseEvent): void {
    // Try to collect an item at the click position
    const value = this.itemManager.collectItemAt(event.clientX, event.clientY);

    if (value > 0) {
      // Check for critical hit based on upgrade
      const criticalChance = this.upgradeManager.getCriticalChance();
      let finalValue = value;

      if (Math.random() < criticalChance) {
        // Critical hit! Triple the value
        finalValue = value * 3;

        // Show critical hit feedback
        this.createCriticalHitFeedback(event.clientX, event.clientY);
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
      this.currencyDisplay.textContent = this.upgradeManager.getCurrency().toString();
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
}
