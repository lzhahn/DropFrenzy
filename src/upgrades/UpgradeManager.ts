import { Upgrade, UpgradeType } from './Upgrade';
import { 
  AutoClickerUpgrade, 
  MultiplierUpgrade, 
  DropRateUpgrade, 
  GravityUpgrade, 
  CriticalChanceUpgrade 
} from './UpgradeTypes';

/**
 * Manages all upgrades in the game
 */
export class UpgradeManager {
  private upgrades: Map<string, Upgrade>;
  private currency: number = 0;
  private onCurrencyChange: (currency: number) => void;
  
  constructor(initialCurrency: number = 0, onCurrencyChange?: (currency: number) => void) {
    this.currency = initialCurrency;
    this.onCurrencyChange = onCurrencyChange || (() => {});
    this.upgrades = new Map();
    
    // Initialize all upgrade types
    this.initializeUpgrades();
  }
  
  /**
   * Initialize all available upgrades
   */
  private initializeUpgrades(): void {
    const upgradesList: Upgrade[] = [
      new AutoClickerUpgrade(),
      new MultiplierUpgrade(),
      new DropRateUpgrade(),
      new GravityUpgrade(),
      new CriticalChanceUpgrade()
    ];
    
    // Add all upgrades to the map
    upgradesList.forEach(upgrade => {
      this.upgrades.set(upgrade.id, upgrade);
    });
  }
  
  /**
   * Get all available upgrades
   */
  getAllUpgrades(): Upgrade[] {
    return Array.from(this.upgrades.values());
  }
  
  /**
   * Get a specific upgrade by ID
   */
  getUpgrade(id: string): Upgrade | undefined {
    return this.upgrades.get(id);
  }
  
  /**
   * Get a specific upgrade by type
   */
  getUpgradeByType(type: UpgradeType): Upgrade | undefined {
    return Array.from(this.upgrades.values()).find(upgrade => upgrade.type === type);
  }
  
  /**
   * Purchase an upgrade if enough currency is available
   * @returns true if purchase was successful, false otherwise
   */
  purchaseUpgrade(id: string): boolean {
    const upgrade = this.upgrades.get(id);
    
    if (!upgrade) {
      console.error(`Upgrade with ID ${id} not found`);
      return false;
    }
    
    if (!upgrade.canUpgrade()) {
      console.log(`Upgrade ${upgrade.name} is already at max level`);
      return false;
    }
    
    const cost = upgrade.getCurrentCost();
    
    if (this.currency < cost) {
      console.log(`Not enough currency to purchase ${upgrade.name}`);
      return false;
    }
    
    // Deduct currency and upgrade
    this.currency -= cost;
    upgrade.upgrade();
    
    // Notify of currency change
    this.onCurrencyChange(this.currency);
    
    console.log(`Purchased ${upgrade.name} (Level ${upgrade.level})`);
    return true;
  }
  
  /**
   * Set the current currency amount
   */
  setCurrency(amount: number): void {
    this.currency = amount;
    this.onCurrencyChange(this.currency);
  }
  
  /**
   * Add currency to the player's total
   * @param amount Amount to add
   */
  addCurrency(amount: number): void {
    // Always round currency to ensure integer values
    this.currency += Math.round(amount);
    this.onCurrencyChange(this.currency);
  }
  
  /**
   * Get the current currency amount
   */
  getCurrency(): number {
    return this.currency;
  }
  
  /**
   * Check if an upgrade can be purchased
   */
  canPurchaseUpgrade(id: string): boolean {
    const upgrade = this.upgrades.get(id);
    
    if (!upgrade || !upgrade.canUpgrade()) {
      return false;
    }
    
    return this.currency >= upgrade.getCurrentCost();
  }
  
  /**
   * Get the current value multiplier from upgrades
   */
  getValueMultiplier(): number {
    const multiplierUpgrade = this.getUpgradeByType(UpgradeType.MULTIPLIER) as MultiplierUpgrade;
    // Simply return the base multiplier without any bonus from total upgrades
    return multiplierUpgrade ? Math.max(1, multiplierUpgrade.getValueMultiplier()) : 1;
  }
  
  /**
   * Get the current drop rate multiplier from upgrades
   */
  getDropRateMultiplier(): number {
    const dropRateUpgrade = this.getUpgradeByType(UpgradeType.DROP_RATE) as DropRateUpgrade;
    const baseMultiplier = dropRateUpgrade ? Math.max(1, dropRateUpgrade.getSpawnRateMultiplier()) : 1;
    
    // Apply a smaller bonus based on total upgrade levels
    const totalLevels = this.getTotalUpgradeLevels();
    const bonusMultiplier = 1 + (totalLevels * 0.005); // 0.5% bonus per total level
    
    return baseMultiplier * bonusMultiplier;
  }
  
  /**
   * Get the current gravity multiplier from upgrades
   * Lower values mean slower falling speed
   */
  getGravityMultiplier(): number {
    const gravityUpgrade = this.getUpgradeByType(UpgradeType.GRAVITY) as GravityUpgrade;
    // If gravity upgrade exists, apply the reduction factor, otherwise return 1 (no reduction)
    return gravityUpgrade ? Math.max(0.2, gravityUpgrade.getSpeedReductionFactor()) : 1;
  }
  
  /**
   * Get the current critical chance from upgrades (0-1)
   */
  getCriticalChance(): number {
    const criticalUpgrade = this.getUpgradeByType(UpgradeType.CRITICAL_CHANCE) as CriticalChanceUpgrade;
    const baseCritChance = criticalUpgrade ? criticalUpgrade.getCriticalChance() : 0;
    
    // Apply a small bonus based on total upgrade levels
    const totalLevels = this.getTotalUpgradeLevels();
    const bonusCritChance = totalLevels * 0.002; // 0.2% bonus per total level
    
    return Math.min(1, baseCritChance + bonusCritChance); // Cap at 100%
  }
  
  /**
   * Get the current auto-click rate in clicks per second
   */
  getAutoClickRate(): number {
    const autoClickerUpgrade = this.getUpgradeByType(UpgradeType.AUTOCLICKER) as AutoClickerUpgrade;
    // Simply return the base click rate without any bonus from total upgrades
    return autoClickerUpgrade ? autoClickerUpgrade.getClicksPerSecond() : 0;
  }
  
  /**
   * Get the critical hit multiplier
   */
  getCriticalMultiplier(): number {
    const criticalUpgrade = this.getUpgradeByType(UpgradeType.CRITICAL_CHANCE) as CriticalChanceUpgrade;
    return criticalUpgrade ? criticalUpgrade.getCriticalMultiplier() : 3.0;
  }
  
  /**
   * Calculate the total levels across all upgrades
   * Used for bonus scaling effects
   */
  private getTotalUpgradeLevels(): number {
    return Array.from(this.upgrades.values())
      .reduce((total, upgrade) => total + upgrade.level, 0);
  }
}
