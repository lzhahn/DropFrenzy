import '../styles/main.css';
import { Game } from './game/Game';
import { UpgradePanel } from './upgrades/UpgradePanel';
import { SaveControls } from './ui/SaveControls';

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const gameContainer = document.getElementById('game-container');
  
  if (!gameContainer) {
    console.error('Game container not found');
    return;
  }
  
  // Initialize the game
  const game = new Game(gameContainer);
  
  // Start the game
  game.start();
  
  // Initialize the upgrade panel with the existing panel in the HTML
  new UpgradePanel(document.body, game.getUpgradeManager());
  
  // Initialize the save controls
  new SaveControls(game);
  
  // For debugging purposes
  console.log('Drop Frenzy initialized with upgrades and save system');
});
