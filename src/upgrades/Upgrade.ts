/**
 * Upgrade types available in the game
 */
export enum UpgradeType {
  AUTOCLICKER = 'autoclicker',
  MULTIPLIER = 'multiplier',
  DROP_RATE = 'drop_rate',
  GRAVITY = 'gravity',
  CRITICAL_CHANCE = 'critical_chance'
}

/**
 * Base interface for all upgrades
 */
export interface Upgrade {
  id: string;
  type: UpgradeType;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  baseEffect: number;
  effectMultiplier: number;
  
  /**
   * Calculate the current cost of the upgrade based on its level
   */
  getCurrentCost(): number;
  
  /**
   * Calculate the current effect value of the upgrade based on its level
   */
  getCurrentEffect(): number;
  
  /**
   * Calculate the next level effect value
   */
  getNextLevelEffect(): number;
  
  /**
   * Increase the upgrade level by 1
   */
  upgrade(): void;
  
  /**
   * Check if the upgrade can be leveled up further
   */
  canUpgrade(): boolean;
}

/**
 * Base class implementing common upgrade functionality
 */
export abstract class BaseUpgrade implements Upgrade {
  id: string;
  type: UpgradeType;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  baseEffect: number;
  effectMultiplier: number;
  
  constructor(
    id: string,
    type: UpgradeType,
    name: string,
    description: string,
    baseCost: number,
    costMultiplier: number,
    baseEffect: number,
    effectMultiplier: number,
    maxLevel: number = 100
  ) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.description = description;
    this.level = 0;
    this.maxLevel = maxLevel;
    this.baseCost = baseCost;
    this.costMultiplier = costMultiplier;
    this.baseEffect = baseEffect;
    this.effectMultiplier = effectMultiplier;
  }
  
  /**
   * Calculate the current cost of the upgrade based on its level
   */
  getCurrentCost(): number {
    return Math.floor(this.baseCost * Math.pow(this.costMultiplier, this.level));
  }
  
  /**
   * Calculate the current effect value of the upgrade based on its level
   */
  getCurrentEffect(): number {
    if (this.level === 0) return 0;
    return this.baseEffect * Math.pow(this.effectMultiplier, this.level - 1);
  }
  
  /**
   * Calculate the next level effect value
   */
  getNextLevelEffect(): number {
    return this.baseEffect * Math.pow(this.effectMultiplier, this.level);
  }
  
  /**
   * Increase the upgrade level by 1
   */
  upgrade(): void {
    if (this.canUpgrade()) {
      this.level += 1;
    }
  }
  
  /**
   * Check if the upgrade can be leveled up further
   */
  canUpgrade(): boolean {
    return this.level < this.maxLevel;
  }
}
