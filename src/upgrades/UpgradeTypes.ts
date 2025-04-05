import { BaseUpgrade, UpgradeType } from './Upgrade';

/**
 * AutoClicker upgrade - automatically collects items at a certain rate
 */
export class AutoClickerUpgrade extends BaseUpgrade {
  constructor() {
    super(
      'autoclicker',
      UpgradeType.AUTOCLICKER,
      'Auto Clicker',
      'Automatically collects items at a certain rate per second',
      10, // Base cost
      1.5, // Cost multiplier
      0.5, // Base effect (clicks per second)
      1.2, // Effect multiplier
      50  // Max level
    );
  }
  
  /**
   * Get the current clicks per second
   */
  getClicksPerSecond(): number {
    return this.getCurrentEffect();
  }
}

/**
 * Multiplier upgrade - increases the value of collected items
 */
export class MultiplierUpgrade extends BaseUpgrade {
  constructor() {
    super(
      'multiplier',
      UpgradeType.MULTIPLIER,
      'Value Multiplier',
      'Increases the value of collected items',
      25, // Base cost
      1.8, // Cost multiplier
      1.5, // Base effect (multiplier value)
      1.15, // Effect multiplier
      30  // Max level
    );
  }
  
  /**
   * Get the current value multiplier
   */
  getValueMultiplier(): number {
    return this.getCurrentEffect();
  }
}

/**
 * DropRate upgrade - increases the frequency of item spawns
 */
export class DropRateUpgrade extends BaseUpgrade {
  constructor() {
    super(
      'drop_rate',
      UpgradeType.DROP_RATE,
      'Drop Rate',
      'Increases the frequency of item spawns',
      15, // Base cost
      1.6, // Cost multiplier
      1.2, // Base effect (spawn rate multiplier)
      1.1, // Effect multiplier
      40  // Max level
    );
  }
  
  /**
   * Get the current spawn rate multiplier
   */
  getSpawnRateMultiplier(): number {
    return this.getCurrentEffect();
  }
}

/**
 * Gravity upgrade - controls the speed at which items fall
 */
export class GravityUpgrade extends BaseUpgrade {
  constructor() {
    super(
      'gravity',
      UpgradeType.GRAVITY,
      'Gravity Control',
      'Controls the speed at which items fall',
      30, // Base cost
      1.7, // Cost multiplier
      0.9, // Base effect (speed multiplier, < 1 means slower)
      1.05, // Effect multiplier
      25  // Max level
    );
  }
  
  /**
   * Get the current speed multiplier
   */
  getSpeedMultiplier(): number {
    return this.getCurrentEffect();
  }
}

/**
 * CriticalChance upgrade - chance for items to have increased value
 */
export class CriticalChanceUpgrade extends BaseUpgrade {
  constructor() {
    super(
      'critical_chance',
      UpgradeType.CRITICAL_CHANCE,
      'Critical Chance',
      'Chance for items to have 3x value when collected',
      40, // Base cost
      2.0, // Cost multiplier
      0.05, // Base effect (5% chance)
      1.25, // Effect multiplier
      20  // Max level
    );
  }
  
  /**
   * Get the current critical chance (0-1)
   */
  getCriticalChance(): number {
    // Cap at 100%
    return Math.min(1, this.getCurrentEffect());
  }
}
