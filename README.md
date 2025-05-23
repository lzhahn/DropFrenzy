# Drop Frenzy

A browser-based endless game where items drop from the top of the screen. Players collect items by clicking or through passive upgrades. The game intensifies over time as players unlock upgrades like autoclickers, multipliers, and drop frequency boosts.

## Project Overview

Drop Frenzy is a web-based idle/clicker game with the following features:
- Items falling from the top of the screen
- Click or tap to collect items and earn currency
- Purchase upgrades to automate and enhance collection
- Endless progression with scaling difficulty
- LocalStorage save system

## Documentation

- [Product Requirements Document (PRD.md)](./PRD.md) - Detailed game specifications
- [Implementation Checklist (todo.md)](./todo.md) - Development tasks and progress tracking

## Project Structure

```
drop-frenzy/
├── src/               # Source code
│   ├── ts/            # TypeScript files
│   ├── js/            # JavaScript files (compiled from TS)
│   └── utils/         # Utility functions
├── assets/            # Static assets
│   ├── images/        # Game images and sprites
│   └── audio/         # Sound effects and music
├── styles/            # CSS styles
│   ├── components/    # Component-specific styles
│   └── pages/         # Page-specific styles
├── components/        # Reusable UI components
│   ├── game/          # Game-specific components
│   └── ui/            # General UI components
├── index.html         # Main HTML file
├── PRD.md             # Product Requirements Document
└── todo.md            # Implementation Checklist
```

## Getting Started

1. Clone this repository
2. Set up the development environment (instructions will be added)
3. Run the development server
4. Open the game in your browser

## Tech Stack

- HTML5, CSS, TypeScript
- Graphics: DOM elements or Canvas (PixiJS / p5.js)
- Save System: LocalStorage
- Responsive design for desktop and mobile browsers

## Development Status

This project is currently in the initial development phase. See the [implementation checklist](./todo.md) for current progress.

## License

This project is for educational purposes only.
