import { ItemManager } from './ItemManager';
import { UpgradeManager } from '../upgrades/UpgradeManager';
import { ParticleManager } from '../effects/ParticleManager';
import { SaveManager } from './SaveManager';

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
  private particleManager: ParticleManager;
  private saveManager: SaveManager;
  private autoClickTimer: number = 0;
  private risingAutoClickTimer: number = 0; // Timer for rising auto-clicker
  
  // Visual cue properties
  private backgroundIntensity: number = 0;
  private shakeIntensity: number = 0;
  private originalBackgroundColor: string = '';

  constructor(container: HTMLElement) {
    this.container = container;
    this.currencyDisplay = document.getElementById('currency-value');
    this.itemManager = new ItemManager(container);
    this.particleManager = new ParticleManager(container);

    // Initialize the upgrade manager with currency update callback
    this.upgradeManager = new UpgradeManager(0, () => {
      this.updateCurrencyDisplay();
    });
    
    // Initialize the save manager
    this.saveManager = new SaveManager(this.upgradeManager);
    
    // Store the original background color
    this.originalBackgroundColor = window.getComputedStyle(document.body).backgroundColor;

    this.init();
  }

  /**
   * Initialize game event listeners and setup
   */
  private init(): void {
    // Set up click event listener on the entire document
    document.addEventListener('click', this.handleClick.bind(this));
    
    // Try to load saved game state
    this.loadSavedGame();
    
    // Initialize currency display
    this.updateCurrencyDisplay();
    
    // Set up beforeunload event to save the game when the user leaves
    window.addEventListener('beforeunload', () => {
      this.saveManager.saveGame();
    });
  }

  /**
   * Load the saved game state if it exists
   */
  private loadSavedGame(): void {
    if (this.saveManager.hasSave()) {
      const loaded = this.saveManager.loadGame();
      if (loaded) {
        this.showSaveLoadNotification('Game progress loaded!');
      }
    }
  }
  
  /**
   * Show a notification about save/load status
   */
  private showSaveLoadNotification(message: string): void {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'game-notification';
    notification.textContent = message;
    
    // Add to container
    document.body.appendChild(notification);
    
    // Remove after a delay
    setTimeout(() => {
      if (notification.parentNode === document.body) {
        document.body.removeChild(notification);
      }
    }, 3000);
  }

  /**
   * Get the upgrade manager instance
   */
  getUpgradeManager(): UpgradeManager {
    return this.upgradeManager;
  }
  
  /**
   * Get the save manager instance
   */
  getSaveManager(): SaveManager {
    return this.saveManager;
  }

  /**
   * Start the game loop
   */
  public start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastTimestamp = performance.now();
    requestAnimationFrame(this.gameLoop.bind(this));
    
    // Start auto-saving
    this.saveManager.startAutoSave();

    console.log('Game started');
  }

  /**
   * Stop the game loop
   */
  public stop(): void {
    this.isRunning = false;
    
    // Stop auto-saving
    this.saveManager.stopAutoSave();
    
    // Save the game state before stopping
    this.saveManager.saveGame();
    
    // Reset visual effects
    this.backgroundIntensity = 0;
    this.shakeIntensity = 0;
    document.body.style.backgroundColor = this.originalBackgroundColor;
    this.container.style.transform = 'translate(0px, 0px)';
    
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
    
    // Update items and get missed items
    this.itemManager.update(deltaTime, this.upgradeManager.getRisingChance());
    
    // Handle regular auto-clicker
    this.handleAutoClicker(deltaTime);
    
    // Handle rising auto-clicker
    this.handleRisingAutoClicker(deltaTime);
    
    // Update visual cues based on active item count
    this.updateVisualCues();
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
   * Handle rising auto-clicker functionality
   */
  private handleRisingAutoClicker(deltaTime: number): void {
    const itemsPerSecond = this.upgradeManager.getRisingAutoClickRate();

    if (itemsPerSecond <= 0) return;

    // Accumulate time for auto-clicks
    this.risingAutoClickTimer += deltaTime;

    // Calculate how many items should be collected this frame
    // Use a more precise calculation that accounts for fractional items
    const itemsToCollect = Math.floor(itemsPerSecond * this.risingAutoClickTimer);

    if (itemsToCollect > 0) {
      // Reduce the timer by the time used for collection
      // This ensures we don't lose fractional time
      this.risingAutoClickTimer -= itemsToCollect / itemsPerSecond;

      // Collect multiple items at once
      this.collectMultipleRisingItems(itemsToCollect);
    }
  }

  /**
   * Collect multiple items at once using the auto-clicker
   */
  private collectMultipleItems(count: number): void {
    // Get all available items that haven't been collected yet
    const items = Array.from(this.itemManager['items'].values())
      .filter(item => !item.isRising && !item.isCollected);

    if (items.length === 0) return;

    // Determine how many items to actually collect (limited by available items)
    const itemsToCollect = Math.min(count, items.length);
    
    // Sort items by how close they are to the bottom of the screen
    // This makes the auto-clicker prioritize items that are about to be missed
    items.sort((a, b) => b.y - a.y);

    // Collect the items
    let totalValue = 0;
    const valueMultiplier = this.upgradeManager.getValueMultiplier();
    
    for (let i = 0; i < itemsToCollect; i++) {
      const item = items[i];
      
      // Mark the item as collected
      item.collect();
      
      // Apply the value multiplier
      totalValue += Math.round(item.getValue() * valueMultiplier);
      
      // Create a collection effect at the item's position
      this.createCollectionFeedback(item.x + item.width / 2, item.y + item.height / 2, Math.round(item.getValue() * valueMultiplier));
      
      // Remove the item from the items map after a delay to match the animation
      setTimeout(() => {
        this.itemManager['items'].delete(item.id);
      }, 500);
    }

    // Add the total value to currency
    if (totalValue > 0) {
      this.addCurrency(totalValue);
    }
  }

  /**
   * Collect multiple rising items at once using the auto-clicker
   */
  private collectMultipleRisingItems(count: number): void {
    // Get all available rising items that haven't been collected yet
    const items = Array.from(this.itemManager['items'].values())
      .filter(item => item.isRising && !item.isCollected);

    if (items.length === 0) return;

    // Determine how many items to actually collect (limited by available items)
    const itemsToCollect = Math.min(count, items.length);
    
    // Sort items by how close they are to the top of the screen
    // This makes the auto-clicker prioritize items that are about to be missed
    items.sort((a, b) => a.y - b.y);

    // Collect the items
    let totalValue = 0;
    const risingValueMultiplier = this.upgradeManager.getRisingValueMultiplier();
    const valueMultiplier = this.upgradeManager.getValueMultiplier();
    
    for (let i = 0; i < itemsToCollect; i++) {
      const item = items[i];
      
      // Mark the item as collected
      item.collect();
      
      // Apply value multiplier for rising items
      let itemValue = item.getValue();
      itemValue *= risingValueMultiplier;
      
      // Apply the regular value multiplier
      totalValue += Math.round(itemValue * valueMultiplier);
      
      // Create a collection effect at the item's position
      this.createCollectionFeedback(item.x + item.width / 2, item.y + item.height / 2, Math.round(itemValue * valueMultiplier));
      
      // Remove the item from the items map after a delay to match the animation
      setTimeout(() => {
        this.itemManager['items'].delete(item.id);
      }, 500);
    }

    // Add the total value to currency
    if (totalValue > 0) {
      this.addCurrency(totalValue);
    }
  }

  /**
   * Handle click events on the game container
   */
  private handleClick(event: MouseEvent): void {
    // Try to collect an item at the click position
    const value = this.itemManager.collectItemAt(
      event.clientX, 
      event.clientY,
      this.upgradeManager.getRisingValueMultiplier()
    );

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
    // Create a small particle burst for regular clicks
    this.particleManager.createParticleBurst(x, y, 5, '#ffffff');
    
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
    // Create a larger, golden particle burst for critical hits
    this.particleManager.createParticleBurst(x, y, 20, '#ffcc00');
    
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
    // Create particle burst with the value displayed
    this.particleManager.createParticleBurst(x, y, 10, '#4a6bff', value);
    
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

  /**
   * Update visual cues based on active item count
   */
  private updateVisualCues(): void {
    const activeItemCount = this.itemManager.getActiveItemCount();
    
    // Debug: log active item count
    console.log(`Active items: ${activeItemCount}`);
    
    // Calculate intensity based on active item count
    // Start changing at 10 items, max intensity at 50 items
    const baseIntensity = Math.min(1, Math.max(0, (activeItemCount - 10) / 40));
    
    // Smoothly transition the intensity
    this.backgroundIntensity = this.backgroundIntensity * 0.9 + baseIntensity * 0.1;
    this.shakeIntensity = this.shakeIntensity * 0.8 + baseIntensity * 0.2;
    
    // Apply background color change
    this.applyBackgroundEffect();
    
    // Apply screen shake effect
    this.applyScreenShake();
  }
  
  /**
   * Apply background color effect based on intensity
   */
  private applyBackgroundEffect(): void {
    if (this.backgroundIntensity < 0.05) {
      // Reset to original color if intensity is very low
      document.body.style.backgroundColor = this.originalBackgroundColor;
      return;
    }
    
    // Change from normal to a reddish hue as intensity increases
    const r = 255;
    const g = Math.floor(255 * (1 - this.backgroundIntensity * 0.7));
    const b = Math.floor(255 * (1 - this.backgroundIntensity * 0.9));
    
    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  }
  
  /**
   * Apply screen shake effect based on intensity
   */
  private applyScreenShake(): void {
    if (this.shakeIntensity < 0.1) {
      // Reset position if intensity is low
      this.container.style.transform = 'translate(0px, 0px)';
      return;
    }
    
    // Calculate random offset based on intensity
    const maxOffset = this.shakeIntensity * 5; // Max 5px offset at full intensity
    const xOffset = (Math.random() * 2 - 1) * maxOffset;
    const yOffset = (Math.random() * 2 - 1) * maxOffset;
    
    // Apply the shake effect
    this.container.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
  }
}
