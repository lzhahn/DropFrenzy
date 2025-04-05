import '../styles/main.css';
import { Game } from '@/game/Game';

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const gameContainer = document.getElementById('game-container');
  
  if (!gameContainer) {
    console.error('Game container not found');
    return;
  }
  
  // Initialize the game
  const game = new Game(gameContainer);
  game.start();
  
  // For debugging purposes
  console.log('Drop Frenzy initialized');
});
