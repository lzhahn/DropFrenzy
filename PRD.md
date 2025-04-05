# Drop Frenzy - Product Requirements Document (PRD)

## 1. Overview

**Objective**  
Create a browser-based endless game where items drop from the top of the screen. Players collect items by clicking or through passive upgrades. The game intensifies over time as players unlock upgrades like autoclickers, multipliers, and drop frequency boosts.

**Platform**  
- Web (desktop and mobile browser support)

**Monetization**  
- None (no ads, no purchases)

---

## 2. Game Loop

### Core Loop
1. Items fall from the top of the screen.
2. Players click or tap to collect them.
3. Each item adds to the player's currency.
4. Currency is used to purchase upgrades.
5. Upgrades increase game speed and automation.

### Endless Progression
- No endgame; the goal is to progress as far as possible.
- Players strive to beat personal milestones.
- Optional prestige system adds long-term progression.

---

## 3. Core Features

### Falling Items
- Randomized horizontal spawn and interval.
- Drop rate increases over time or with upgrades.
- Optional: Item variety with visual or mechanical impact.

### Upgrades
- **Autoclicker** – Automatically collects items at intervals.
- **Multiplier** – Increases value per collected item.
- **Drop Rate** – More items fall per second.
- **Gravity Control** – Items fall faster (challenge-based reward).
- **Critical Chance** – Random bonus multiplier per item.
- **Prestige Reset** – Resets progress for permanent buffs.

### Game Speed/Scaling
- Difficulty and pace scale with player progression.
- Upgrades have escalating cost and effect.
- Visual and audio feedback reflects speed increase.

---

## 4. Technical Stack

- **Frontend:** HTML5, CSS, JavaScript (React or Vanilla)
- **Graphics:** DOM elements or Canvas (PixiJS / p5.js if needed)
- **Save System:** LocalStorage
- **Responsiveness:** Touch support for mobile, mouse for desktop

---

## 5. UI/UX Requirements

### Main Game View
- Falling items from top to bottom
- Central clickable/tappable area
- Minimalist, clean background

### Upgrade Panel
- Sidebar or modal
- Lists upgrades, costs, current level, and effects
- Tooltips or short descriptions

### Progress Panel
- Stats: items collected, value, clicks/sec, etc.
- Prestige/reset button (if implemented)

### Style Guide
- Clean, bright visuals
- Smooth animations
- Clear feedback for actions

---

## 6. Art & Audio

- **Art Style:** 2D vector or pixel art
- **Sound FX:** Clicks, item collection, upgrade sounds
- **Music:** Optional ambient loop that scales with game speed

---

## 7. Save & Persistence

- Autosave every few seconds using LocalStorage
- Manual reset and hard reset buttons
- Optional: export/import save as JSON

---

## 8. Metrics (Internal Use Only)

- Items/sec peak
- Longest session time
- Most used upgrade
- Prestige count (if applicable)

---

## 9. Development Roadmap

### MVP
- Core drop and click mechanic
- Basic upgrade system (3–4 types)
- Currency accumulation
- Basic art and sound
- LocalStorage saving

### Post-MVP
- Prestige system
- Item types/rarities
- Background transitions
- Optional offline progress
- Local-only leaderboard (optional)

---
