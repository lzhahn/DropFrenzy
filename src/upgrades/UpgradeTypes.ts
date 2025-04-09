import { BaseUpgrade, UpgradeType } from './Upgrade';

/**
 * AutoClicker upgrade - automatically collects items at a certain rate
 */
export class AutoClickerUpgrade extends BaseUpgrade {
  constructor() {
    super(
      'autoclicker',
      UpgradeType.AUTOCLICKER,
      'Auto Collector',
      'Automatically collects multiple items per second',
      5, // Base cost
      1.2, // Cost multiplier
      0.5, // Base effect (items per second)
      1.25, // Effect multiplier
      50  // Max level
    );
  }
  
  /**
   * Get the current items collected per second
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
      15, // Base cost
      1.25, // Cost multiplier
      2.0, // Base effect (multiplier value)
      1.15, // Effect multiplier (reduced from 1.25 for more gradual scaling)
      30  // Max level
    );
  }
  
  /**
   * Get the current value multiplier
   */
  getValueMultiplier(): number {
    // Return the effect directly without any additional multipliers
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
      8, // Base cost
      1.2, // Cost multiplier
      1.5, // Base effect (spawn rate multiplier)
      1.2, // Effect multiplier
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
      'Slows down the falling speed of items',
      12, // Base cost
      1.25, // Cost multiplier
      0.9, // Base effect (speed reduction factor, < 1 means slower)
      0.9, // Effect multiplier (lower values = more slowing with each level)
      25  // Max level
    );
  }
  
  /**
   * Get the current speed reduction factor
   */
  getSpeedReductionFactor(): number {
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
      20, // Base cost
      1.3, // Cost multiplier
      0.1, // Base effect (10% chance)
      1.4, // Effect multiplier
      20  // Max level
    );
  }
  
  /**
   * Get the current critical chance (0-1)
   */
  getCriticalChance(): number {
    return Math.min(0.8, this.getCurrentEffect()); // Cap at 80%
  }
  
  /**
   * Get the critical multiplier value
   */
  getCriticalMultiplier(): number {
    return 3.0; // Fixed 3x multiplier for critical hits
  }
}

/**
 * RisingBalls upgrade - chance for balls to rise from the bottom of the screen
 */
export class RisingBallsUpgrade extends BaseUpgrade {
  constructor() {
    super(
      'rising_balls',
      UpgradeType.RISING_BALLS,
      'Rising Balls',
      'Chance for balls to rise from the bottom of the screen',
      25, // Base cost
      1.3, // Cost multiplier
      0.1, // Base effect (10% chance of rising balls)
      1.3, // Effect multiplier
      15  // Max level
    );
  }
  
  /**
   * Get the current chance for balls to rise from the bottom (0-1)
   */
  getRisingChance(): number {
    return Math.min(0.5, this.getCurrentEffect()); // Cap at 50%
  }
  
  /**
   * Get the value multiplier for rising balls
   */
  getRisingValueMultiplier(): number {
    return 1.5; // Rising balls are worth 50% more
  }
}
