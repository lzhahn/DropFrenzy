/**
 * Upgrade types available in the game
 */
export enum UpgradeType {
  AUTOCLICKER = 'autoclicker',
  MULTIPLIER = 'multiplier',
  DROP_RATE = 'drop_rate',
  GRAVITY = 'gravity',
  CRITICAL_CHANCE = 'critical_chance',
  RISING_BALLS = 'rising_balls'
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
    // Significantly reduced cost formula for faster progression
    const baseCostScaling = this.baseCost * Math.pow(this.costMultiplier, this.level);
    
    // Apply a discount for higher levels to prevent excessive cost scaling
    const levelDiscount = Math.min(0.25, this.level * 0.01); // Max 25% discount
    
    return Math.floor(baseCostScaling * (1 - levelDiscount));
  }
  
  /**
   * Calculate the current effect value of the upgrade based on its level
   */
  getCurrentEffect(): number {
    if (this.level === 0) return 0;
    
    // Enhanced effect formula with better scaling for higher levels
    const baseScaling = this.baseEffect * Math.pow(this.effectMultiplier, this.level - 1);
    
    // Add a bonus for higher levels to create a more exponential growth curve
    const levelBonus = this.level > 5 ? (this.level - 5) * 0.05 * baseScaling : 0;
    
    // For critical chance, cap at 100%
    if (this.type === UpgradeType.CRITICAL_CHANCE) {
      return Math.min(1, baseScaling + levelBonus);
    }
    
    return baseScaling + levelBonus;
  }
  
  /**
   * Calculate the next level effect value
   */
  getNextLevelEffect(): number {
    // Use the same enhanced formula for next level preview
    const nextLevel = this.level + 1;
    const baseScaling = this.baseEffect * Math.pow(this.effectMultiplier, nextLevel - 1);
    const levelBonus = nextLevel > 5 ? (nextLevel - 5) * 0.05 * baseScaling : 0;
    
    // For critical chance, cap at 100%
    if (this.type === UpgradeType.CRITICAL_CHANCE) {
      return Math.min(1, baseScaling + levelBonus);
    }
    
    return baseScaling + levelBonus;
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
