import { Game } from '../game/Game';
import { SaveManager } from '../game/SaveManager';

/**
 * Creates and manages the save controls UI
 */
export class SaveControls {
  private saveManager: SaveManager;
  private controlsContainer: HTMLElement;
  private saveInfoElement: HTMLElement | null = null;
  
  constructor(game: Game) {
    this.saveManager = game.getSaveManager();
    this.controlsContainer = this.createControlsContainer();
    
    // Add the controls to the document
    document.body.appendChild(this.controlsContainer);
    
    // Create save info element
    this.createSaveInfoElement();
    
    // Start updating the save info
    this.startSaveInfoUpdates();
  }
  
  /**
   * Create the controls container with save buttons
   */
  private createControlsContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'save-controls';
    
    // Save button
    const saveButton = document.createElement('button');
    saveButton.className = 'save-button';
    saveButton.textContent = 'Save Game';
    saveButton.addEventListener('click', () => {
      this.saveManager.saveGame();
      this.showNotification('Game saved!');
    });
    container.appendChild(saveButton);
    
    // Delete save button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'save-button delete';
    deleteButton.textContent = 'Delete Save';
    deleteButton.addEventListener('click', () => {
      this.createDeleteConfirmationDialog();
    });
    container.appendChild(deleteButton);
    
    return container;
  }
  
  /**
   * Create the save info element
   */
  private createSaveInfoElement(): void {
    const infoElement = document.createElement('div');
    infoElement.className = 'save-info';
    infoElement.textContent = 'Auto-save: Active';
    
    document.body.appendChild(infoElement);
    this.saveInfoElement = infoElement;
    
    this.updateSaveInfo();
  }
  
  /**
   * Start updating the save info periodically
   */
  private startSaveInfoUpdates(): void {
    // Update immediately
    this.updateSaveInfo();
    
    // Then update every 10 seconds
    setInterval(() => {
      this.updateSaveInfo();
    }, 10000);
  }
  
  /**
   * Update the save info text
   */
  private updateSaveInfo(): void {
    if (!this.saveInfoElement) return;
    
    const lastSaveTime = this.saveManager.getLastSaveTimestamp();
    
    if (lastSaveTime > 0) {
      const timeAgo = this.getTimeAgo(lastSaveTime);
      this.saveInfoElement.textContent = `Last saved: ${timeAgo}`;
    } else {
      this.saveInfoElement.textContent = 'Auto-save: Active';
    }
  }
  
  /**
   * Get a human-readable time ago string
   */
  private getTimeAgo(timestamp: number): string {
    const now = Date.now();
    const secondsAgo = Math.floor((now - timestamp) / 1000);
    
    if (secondsAgo < 5) {
      return 'just now';
    } else if (secondsAgo < 60) {
      return `${secondsAgo} seconds ago`;
    } else if (secondsAgo < 3600) {
      const minutes = Math.floor(secondsAgo / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (secondsAgo < 86400) {
      const hours = Math.floor(secondsAgo / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(secondsAgo / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  }
  
  /**
   * Create a delete confirmation dialog
   */
  private createDeleteConfirmationDialog(): void {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    
    // Create dialog
    const dialog = document.createElement('div');
    dialog.className = 'confirmation-dialog';
    
    // Create title
    const titleElement = document.createElement('h3');
    titleElement.textContent = 'Delete Save Data';
    dialog.appendChild(titleElement);
    
    // Create message
    const messageElement = document.createElement('p');
    messageElement.textContent = 'Are you sure you want to delete your saved game? This action cannot be undone.';
    dialog.appendChild(messageElement);
    
    // Create buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'dialog-buttons';
    
    // Create cancel button
    const cancelButton = document.createElement('button');
    cancelButton.className = 'dialog-button cancel';
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });
    buttonsContainer.appendChild(cancelButton);
    
    // Create confirm button
    const confirmButton = document.createElement('button');
    confirmButton.className = 'dialog-button confirm';
    confirmButton.textContent = 'Delete';
    confirmButton.addEventListener('click', () => {
      console.log('Delete button clicked in confirmation dialog');
      
      try {
        // Delete the save data
        const deleted = this.saveManager.deleteSave();
        console.log(`Save deletion result: ${deleted}`);
        
        // Remove the dialog
        document.body.removeChild(overlay);
        
        if (deleted) {
          this.showNotification('Save data deleted successfully');
          
          // Update the save info immediately
          this.updateSaveInfo();
        } else {
          this.showNotification('Failed to delete save data');
        }
      } catch (error) {
        console.error('Error during save deletion:', error);
        this.showNotification('Error deleting save data');
        document.body.removeChild(overlay);
      }
    });
    buttonsContainer.appendChild(confirmButton);
    
    // Add buttons to dialog
    dialog.appendChild(buttonsContainer);
    
    // Add dialog to overlay
    overlay.appendChild(dialog);
    
    // Add overlay to body
    document.body.appendChild(overlay);
  }
  
  /**
   * Show a notification message
   */
  private showNotification(message: string): void {
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
}
