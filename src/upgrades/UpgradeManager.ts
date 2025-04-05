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
   * Add currency
   */
  addCurrency(amount: number): void {
    this.currency += amount;
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
    return multiplierUpgrade ? Math.max(1, multiplierUpgrade.getValueMultiplier()) : 1;
  }
  
  /**
   * Get the current drop rate multiplier from upgrades
   */
  getDropRateMultiplier(): number {
    const dropRateUpgrade = this.getUpgradeByType(UpgradeType.DROP_RATE) as DropRateUpgrade;
    return dropRateUpgrade ? Math.max(1, dropRateUpgrade.getSpawnRateMultiplier()) : 1;
  }
  
  /**
   * Get the current gravity/speed multiplier from upgrades
   */
  getGravityMultiplier(): number {
    const gravityUpgrade = this.getUpgradeByType(UpgradeType.GRAVITY) as GravityUpgrade;
    return gravityUpgrade ? Math.max(0.5, gravityUpgrade.getSpeedMultiplier()) : 1;
  }
  
  /**
   * Get the current critical chance from upgrades (0-1)
   */
  getCriticalChance(): number {
    const criticalUpgrade = this.getUpgradeByType(UpgradeType.CRITICAL_CHANCE) as CriticalChanceUpgrade;
    return criticalUpgrade ? criticalUpgrade.getCriticalChance() : 0;
  }
  
  /**
   * Get the current auto-clicker clicks per second
   */
  getAutoClickRate(): number {
    const autoClickerUpgrade = this.getUpgradeByType(UpgradeType.AUTOCLICKER) as AutoClickerUpgrade;
    return autoClickerUpgrade ? autoClickerUpgrade.getClicksPerSecond() : 0;
  }
}
