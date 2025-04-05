import { Upgrade } from './Upgrade';
import { UpgradeManager } from './UpgradeManager';

/**
 * Creates and manages the upgrade panel UI
 */
export class UpgradePanel {
  private upgradeManager: UpgradeManager;
  private panelElement!: HTMLElement; // Using definite assignment assertion
  private upgradeElements: Map<string, HTMLElement> = new Map();
  
  constructor(_parentElement: HTMLElement, upgradeManager: UpgradeManager) {
    this.upgradeManager = upgradeManager;
    
    // Find the existing upgrades panel instead of creating a new one
    const existingPanel = document.getElementById('upgrades-panel');
    if (!existingPanel) {
      console.error('Upgrades panel not found in the DOM');
      return;
    }
    
    this.panelElement = existingPanel;
    
    // Clear any existing content in the upgrades list
    const upgradesList = this.panelElement.querySelector('#upgrades-list');
    if (upgradesList) {
      upgradesList.innerHTML = '';
    }
    
    // Initialize the panel with all upgrades
    this.initializeUpgrades();
    
    // Set up update interval to refresh UI
    setInterval(() => this.updateUpgradeUI(), 500);
  }
  
  /**
   * Initialize all upgrades in the panel
   */
  private initializeUpgrades(): void {
    const upgradesContainer = this.panelElement.querySelector('#upgrades-list') as HTMLElement;
    if (!upgradesContainer) {
      console.error('Upgrades list container not found');
      return;
    }
    
    // Get all upgrades from the manager and sort them by cost
    this.renderSortedUpgrades(upgradesContainer);
  }
  
  /**
   * Sort upgrades by cost and render them
   */
  private renderSortedUpgrades(container: HTMLElement): void {
    // Clear the container
    container.innerHTML = '';
    
    // Get all upgrades and sort them by cost
    const upgrades = this.upgradeManager.getAllUpgrades()
      .sort((a, b) => a.getCurrentCost() - b.getCurrentCost());
    
    // Create UI elements for each upgrade
    upgrades.forEach(upgrade => {
      const upgradeElement = this.createUpgradeElement(upgrade);
      container.appendChild(upgradeElement);
      this.upgradeElements.set(upgrade.id, upgradeElement);
    });
  }
  
  /**
   * Create an element for a single upgrade
   */
  private createUpgradeElement(upgrade: Upgrade): HTMLElement {
    const upgradeElement = document.createElement('div');
    upgradeElement.className = 'upgrade-item';
    upgradeElement.dataset.id = upgrade.id;
    
    // Add title
    const title = document.createElement('h3');
    title.textContent = upgrade.name;
    upgradeElement.appendChild(title);
    
    // Add description
    const description = document.createElement('p');
    description.className = 'upgrade-description';
    description.textContent = upgrade.description;
    upgradeElement.appendChild(description);
    
    // Add level
    const levelContainer = document.createElement('div');
    levelContainer.className = 'upgrade-level-container';
    
    const levelLabel = document.createElement('span');
    levelLabel.textContent = 'Level: ';
    levelContainer.appendChild(levelLabel);
    
    const levelValue = document.createElement('span');
    levelValue.className = 'upgrade-level';
    levelValue.textContent = upgrade.level.toString();
    levelContainer.appendChild(levelValue);
    
    upgradeElement.appendChild(levelContainer);
    
    // Add effect
    const effectContainer = document.createElement('div');
    effectContainer.className = 'upgrade-effect-container';
    
    const effectLabel = document.createElement('span');
    effectLabel.textContent = 'Effect: ';
    effectContainer.appendChild(effectLabel);
    
    const effectValue = document.createElement('span');
    effectValue.className = 'upgrade-effect';
    effectValue.textContent = this.formatEffect(upgrade);
    effectContainer.appendChild(effectValue);
    
    upgradeElement.appendChild(effectContainer);
    
    // Add cost and buy button
    const buyContainer = document.createElement('div');
    buyContainer.className = 'upgrade-buy-container';
    
    const costLabel = document.createElement('span');
    costLabel.textContent = 'Cost: ';
    buyContainer.appendChild(costLabel);
    
    const costValue = document.createElement('span');
    costValue.className = 'upgrade-cost';
    costValue.textContent = upgrade.getCurrentCost().toString();
    buyContainer.appendChild(costValue);
    
    const buyButton = document.createElement('button');
    buyButton.className = 'upgrade-buy-button';
    buyButton.textContent = 'Buy';
    buyButton.disabled = !this.upgradeManager.canPurchaseUpgrade(upgrade.id);
    
    // Add click event to buy button
    buyButton.addEventListener('click', () => {
      if (this.upgradeManager.purchaseUpgrade(upgrade.id)) {
        this.updateUpgradeElement(upgrade);
      }
    });
    
    buyContainer.appendChild(buyButton);
    upgradeElement.appendChild(buyContainer);
    
    return upgradeElement;
  }
  
  /**
   * Update a single upgrade element
   */
  private updateUpgradeElement(upgrade: Upgrade): void {
    const element = this.upgradeElements.get(upgrade.id);
    if (!element) return;
    
    // Update level
    const levelElement = element.querySelector('.upgrade-level');
    if (levelElement) {
      levelElement.textContent = upgrade.level.toString();
    }
    
    // Update effect
    const effectElement = element.querySelector('.upgrade-effect');
    if (effectElement) {
      effectElement.textContent = this.formatEffect(upgrade);
    }
    
    // Update cost
    const costElement = element.querySelector('.upgrade-cost');
    if (costElement) {
      costElement.textContent = upgrade.getCurrentCost().toString();
    }
    
    // Update buy button
    const buyButton = element.querySelector('.upgrade-buy-button') as HTMLButtonElement;
    if (buyButton) {
      buyButton.disabled = !this.upgradeManager.canPurchaseUpgrade(upgrade.id);
      
      // Add or remove the 'affordable' class based on whether the upgrade can be purchased
      if (this.upgradeManager.canPurchaseUpgrade(upgrade.id)) {
        buyButton.classList.add('affordable');
      } else {
        buyButton.classList.remove('affordable');
      }
    }
  }
  
  /**
   * Update all upgrade elements in the UI
   */
  private updateUpgradeUI(): void {
    const upgrades = this.upgradeManager.getAllUpgrades();
    
    // First update all upgrade elements
    upgrades.forEach(upgrade => {
      this.updateUpgradeElement(upgrade);
    });
    
    // Check if we need to resort based on cost changes
    const sortedUpgrades = [...upgrades].sort((a, b) => a.getCurrentCost() - b.getCurrentCost());
    const currentOrder = upgrades.map(u => u.id);
    const sortedOrder = sortedUpgrades.map(u => u.id);
    
    // Check if the order has changed
    const needsResorting = !this.arraysEqual(currentOrder, sortedOrder);
    
    if (needsResorting) {
      // Re-render all upgrades in the sorted order
      const upgradesContainer = this.panelElement.querySelector('#upgrades-list') as HTMLElement;
      if (upgradesContainer) {
        this.renderSortedUpgrades(upgradesContainer);
      }
    }
  }
  
  /**
   * Helper method to check if two arrays are equal
   */
  private arraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  
  /**
   * Format the effect value based on the upgrade type
   */
  private formatEffect(upgrade: Upgrade): string {
    const effect = upgrade.getCurrentEffect();
    
    switch (upgrade.type) {
      case 'autoclicker':
        return `${effect.toFixed(1)} items/sec`;
      case 'multiplier':
        return `${effect.toFixed(1)}x value`;
      case 'drop_rate':
        return `${effect.toFixed(1)}x spawn rate`;
      case 'gravity':
        return `${effect.toFixed(2)}x speed`;
      case 'critical_chance':
        return `${(effect * 100).toFixed(1)}% chance`;
      default:
        return effect.toString();
    }
  }
  
  /**
   * Show the upgrade panel
   */
  show(): void {
    this.panelElement.style.display = 'block';
  }
  
  /**
   * Hide the upgrade panel
   */
  hide(): void {
    this.panelElement.style.display = 'none';
  }
  
  /**
   * Toggle the visibility of the upgrade panel
   */
  toggle(): void {
    if (this.panelElement.style.display === 'none') {
      this.show();
    } else {
      this.hide();
    }
  }
}
