# ✅ Drop Frenzy - Implementation Checklist

## 🎯 Project Setup
- [x] Set up project folder structure (`/src`, `/assets`, `/styles`, `/components`)
- [x] Initialize with HTML/CSS/TS or framework (React, etc.)
- [x] Set up development environment (Vite, Webpack, CRA, etc.)
- [x] Set up Git version control
- [x] Create `index.html` with base layout

---

## 🎮 Core Game Loop

### ⬇️ Item Drop System
- [x] Define item object (position, speed, value, ID)
- [x] Spawn items at random X-positions
- [x] Implement timed loop to spawn new items
- [x] Animate items falling down the screen
- [x] Despawn items when offscreen

### 👆 Click Detection
- [x] Detect mouse click or touch on falling item
- [x] Remove item and increase currency on click
- [x] Add hitbox/collision detection
- [x] Add visual + audio feedback on collection

### 💰 Currency System
- [x] Create currency variable
- [x] Add function to increase currency
- [x] Display currency in UI

---

## 🛠️ Upgrades System

### 📦 Upgrade Types
- [x] Define upgrade object structure (type, level, cost, effect)
- [x] Implement Autoclicker
- [x] Implement Multiplier
- [x] Implement Drop Rate increase
- [x] Implement Gravity Control
- [x] Implement Critical Chance

### 🧩 Upgrade Logic
- [x] Create upgrade panel UI
- [x] Add purchase buttons and cost display
- [x] Deduct currency when purchasing
- [x] Apply effect immediately after purchase
- [x] Implement cost scaling per level

### 🎨 Upgrade UX
- [x] Add tooltips or short descriptions
- [x] Show upgrade level and effect

---

## ⚙️ Game Scaling & Pacing
- [x] Link upgrades to speed, value, and frequency
- [x] Create scaling/difficulty curve (exponential/logarithmic)
- [ ] Add visual cues as pace increases (blur, background, shake, etc.)

---

## 💾 Save & Persistence
- [ ] Create save object (currency, upgrades, prestige)
- [ ] Auto-save using LocalStorage every X seconds
- [ ] Load saved data on page load
- [ ] Add manual reset button
- [ ] Add import/export save as JSON

---

## ✨ UI & Visuals

### 📱 Game Interface
- [x] HUD with currency display
- [x] Main item drop area
- [x] Upgrade panel (side or bottom)
- [ ] Settings button (reset, export)

### 🖼️ Visual Feedback
- [x] Animate item collection (e.g., fade or pop)
- [x] Highlight affordable upgrades
- [x] Add visual effect for rare/critical items
- [ ] Evolve background visuals over time

---

## 🔊 Audio
- [ ] Add sound effects for click, upgrade, and critical
- [ ] Add optional looping background music
- [ ] Create mute/volume toggle

---

## 🔁 Prestige System (Post-MVP)
- [ ] Define prestige conditions (e.g., currency threshold)
- [ ] Reset player progress except permanent boosts
- [ ] Add prestige currency + UI
- [ ] Add scaling buffs unlocked through prestige
- [ ] Add feedback for prestige action (visual/audio)

---

## 🎨 Customization & Progression

### 🏪 Ball Shop
- [ ] Create a store interface for ball customization
- [ ] Add different ball designs (colors, patterns, effects)
- [ ] Implement purchase system using in-game currency
- [ ] Add preview functionality for ball designs
- [ ] Save selected ball customizations

### 📈 Player Progression
- [ ] Add player level system that increases with each ball click
- [ ] Create level-up rewards and visual effects
- [ ] Display current level prominently in UI
- [ ] Implement level-based unlocks for special features

### ✨ Special Events
- [ ] Add rare golden ball with special visual effects
- [ ] Implement "ball shower" event triggered by golden ball
- [ ] Create time-limited bonus periods
- [ ] Add seasonal or timed special events

### 🏆 Achievements
- [ ] Implement achievement system with rewards
- [ ] Add milestone achievements (first ball, 69 balls, 1000 balls, etc.)
- [ ] Create collection-based achievements (collect all ball types)
- [ ] Add UI for viewing achievements and progress
- [ ] Implement achievement notifications

---

## 🧪 Testing & Optimization
- [x] Unit tests for core components (Item, ItemManager, Game)
- [ ] Test on Chrome, Firefox, Edge (desktop)
- [ ] Test on Safari, Chrome (mobile)
- [ ] Optimize performance for high item count
- [ ] Add FPS limiter or max item cap
- [ ] Test and debug save/load
- [ ] Test responsive UI on different screen sizes

---

## 🎁 Post-MVP Features
- [x] Add item types/rarities with unique visuals
- [ ] Unlockable themes/backgrounds
- [ ] Add player stats (items collected, upgrades, etc.)
- [ ] Track session time or AFK mode
- [ ] Add local leaderboard (optional)

---

## 🔄 Polish & Final Touches
- [ ] Add favicon and metadata
- [ ] Optional: Add PWA mobile support
- [ ] Add easter eggs or secrets
- [x] Animate upgrade buttons when affordable
- [x] Add drop trails, sparkles, or other FX

## 🆕 Additional Features
- [x] Rising balls that move upward from the bottom of the screen
- [x] Collision detection between balls
- [x] Separate auto-clickers for falling and rising balls
- [x] Capped upgrade levels for balance (Rising Balls: 5, Rising Auto-Clicker: 7)
- [x] Rising balls accelerate as they move higher on the screen
