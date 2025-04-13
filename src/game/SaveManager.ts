import { UpgradeManager } from '../upgrades/UpgradeManager';

/**
 * Interface for the saved game state
 */
export interface GameSaveState {
  version: number;
  timestamp: number;
  currency: number;
  upgrades: UpgradeSaveState[];
}

/**
 * Interface for saved upgrade state
 */
export interface UpgradeSaveState {
  id: string;
  level: number;
}

/**
 * Manages saving and loading game state
 */
export class SaveManager {
  private static readonly SAVE_KEY = 'dropFrenzySave';
  private static readonly CURRENT_VERSION = 1;
  private static readonly AUTO_SAVE_INTERVAL = 30000; // 30 seconds
  
  private upgradeManager: UpgradeManager;
  private autoSaveIntervalId: number | null = null;
  private lastSaveTimestamp: number = 0;
  
  constructor(upgradeManager: UpgradeManager) {
    this.upgradeManager = upgradeManager;
    console.log('SaveManager initialized');
  }
  
  /**
   * Start auto-saving the game state
   */
  startAutoSave(): void {
    // Clear any existing interval
    this.stopAutoSave();
    
    // Set up a new auto-save interval
    this.autoSaveIntervalId = window.setInterval(() => {
      this.saveGame();
    }, SaveManager.AUTO_SAVE_INTERVAL);
    
    console.log('Auto-save started');
  }
  
  /**
   * Stop auto-saving the game state
   */
  stopAutoSave(): void {
    if (this.autoSaveIntervalId !== null) {
      window.clearInterval(this.autoSaveIntervalId);
      this.autoSaveIntervalId = null;
      console.log('Auto-save stopped');
    }
  }
  
  /**
   * Save the current game state to localStorage
   */
  saveGame(): void {
    try {
      // Create the save state object
      const saveState: GameSaveState = {
        version: SaveManager.CURRENT_VERSION,
        timestamp: Date.now(),
        currency: this.upgradeManager.getCurrency(),
        upgrades: this.upgradeManager.getAllUpgrades().map(upgrade => ({
          id: upgrade.id,
          level: upgrade.level
        }))
      };
      
      // Save to localStorage
      localStorage.setItem(SaveManager.SAVE_KEY, JSON.stringify(saveState));
      
      this.lastSaveTimestamp = saveState.timestamp;
      console.log(`Game saved at ${new Date(this.lastSaveTimestamp).toLocaleTimeString()}`);
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  }
  
  /**
   * Load the game state from localStorage
   * @returns true if the game was loaded successfully, false otherwise
   */
  loadGame(): boolean {
    try {
      // Get the save data from localStorage
      const saveData = localStorage.getItem(SaveManager.SAVE_KEY);
      
      if (!saveData) {
        console.log('No save data found');
        return false;
      }
      
      // Parse the save data
      const saveState: GameSaveState = JSON.parse(saveData);
      
      // Validate the save data
      if (!this.validateSaveState(saveState)) {
        console.error('Invalid save data');
        return false;
      }
      
      // Load currency
      this.upgradeManager.setCurrency(saveState.currency);
      
      // Load upgrades
      saveState.upgrades.forEach(upgradeSave => {
        const upgrade = this.upgradeManager.getUpgrade(upgradeSave.id);
        
        if (upgrade) {
          // Reset the upgrade to level 0
          upgrade.level = 0;
          
          // Apply the saved level by calling upgrade() the appropriate number of times
          for (let i = 0; i < upgradeSave.level; i++) {
            upgrade.upgrade();
          }
        }
      });
      
      console.log(`Game loaded from save (${new Date(saveState.timestamp).toLocaleString()})`);
      return true;
    } catch (error) {
      console.error('Failed to load game:', error);
      return false;
    }
  }
  
  /**
   * Delete the saved game state
   */
  deleteSave(): boolean {
    console.log('Attempting to delete save data...');
    
    try {
      // Check if save exists before attempting to delete
      const saveExists = localStorage.getItem(SaveManager.SAVE_KEY) !== null;
      console.log(`Save exists: ${saveExists}`);
      
      // Remove the main save key
      localStorage.removeItem(SaveManager.SAVE_KEY);
      console.log(`Removed main save key: ${SaveManager.SAVE_KEY}`);
      
      // Reset the last save timestamp
      this.lastSaveTimestamp = 0;
      
      // Clear all localStorage for this domain to ensure complete removal
      console.log('Clearing all localStorage...');
      localStorage.clear();
      console.log('localStorage cleared');
      
      // Verify deletion
      const saveStillExists = localStorage.getItem(SaveManager.SAVE_KEY) !== null;
      console.log(`Save still exists after deletion: ${saveStillExists}`);
      
      // Reset the current game state
      this.resetGameState();
      
      return true;
    } catch (error) {
      console.error('Failed to delete save:', error);
      return false;
    }
  }
  
  /**
   * Reset the current game state to initial values
   */
  private resetGameState(): void {
    console.log('Resetting current game state...');
    
    try {
      // Reset currency to 0
      this.upgradeManager.setCurrency(0);
      
      // Reset all upgrades to level 0
      const upgrades = this.upgradeManager.getAllUpgrades();
      upgrades.forEach(upgrade => {
        upgrade.level = 0;
      });
      
      console.log('Game state reset successfully');
    } catch (error) {
      console.error('Error resetting game state:', error);
    }
  }
  
  /**
   * Check if a save exists
   */
  hasSave(): boolean {
    return localStorage.getItem(SaveManager.SAVE_KEY) !== null;
  }
  
  /**
   * Get the timestamp of the last save
   */
  getLastSaveTimestamp(): number {
    if (this.lastSaveTimestamp === 0 && this.hasSave()) {
      try {
        const saveData = localStorage.getItem(SaveManager.SAVE_KEY);
        if (saveData) {
          const saveState: GameSaveState = JSON.parse(saveData);
          this.lastSaveTimestamp = saveState.timestamp;
        }
      } catch (error) {
        console.error('Error getting last save timestamp:', error);
      }
    }
    
    return this.lastSaveTimestamp;
  }
  
  /**
   * Validate the save state
   */
  private validateSaveState(saveState: GameSaveState): boolean {
    // Check if the save state has the required properties
    if (
      typeof saveState !== 'object' ||
      typeof saveState.version !== 'number' ||
      typeof saveState.timestamp !== 'number' ||
      typeof saveState.currency !== 'number' ||
      !Array.isArray(saveState.upgrades)
    ) {
      return false;
    }
    
    // Check if the version is compatible
    if (saveState.version > SaveManager.CURRENT_VERSION) {
      console.warn('Save data is from a newer version of the game');
      return false;
    }
    
    // Validate each upgrade in the save state
    for (const upgradeSave of saveState.upgrades) {
      if (
        typeof upgradeSave !== 'object' ||
        typeof upgradeSave.id !== 'string' ||
        typeof upgradeSave.level !== 'number' ||
        upgradeSave.level < 0
      ) {
        return false;
      }
      
      // Check if the upgrade exists
      const upgrade = this.upgradeManager.getUpgrade(upgradeSave.id);
      if (!upgrade) {
        console.warn(`Unknown upgrade ID in save data: ${upgradeSave.id}`);
        // Continue validation, don't fail just because one upgrade is unknown
      }
    }
    
    return true;
  }
}
