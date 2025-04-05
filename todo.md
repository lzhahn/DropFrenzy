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
- [ ] Define upgrade object structure (type, level, cost, effect)
- [ ] Implement Autoclicker
- [ ] Implement Multiplier
- [ ] Implement Drop Rate increase
- [ ] Implement Gravity Control
- [ ] Implement Critical Chance

### 🧩 Upgrade Logic
- [ ] Create upgrade panel UI
- [ ] Add purchase buttons and cost display
- [ ] Deduct currency when purchasing
- [ ] Apply effect immediately after purchase
- [ ] Implement cost scaling per level

### 🎨 Upgrade UX
- [ ] Add tooltips or short descriptions
- [ ] Show upgrade level and effect

---

## ⚙️ Game Scaling & Pacing
- [ ] Link upgrades to speed, value, and frequency
- [ ] Create scaling/difficulty curve (exponential/logarithmic)
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
- [ ] HUD with currency display
- [ ] Main item drop area
- [ ] Upgrade panel (side or bottom)
- [ ] Settings button (reset, export)

### 🖼️ Visual Feedback
- [ ] Animate item collection (e.g., fade or pop)
- [ ] Highlight affordable upgrades
- [ ] Add visual effect for rare/critical items
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
- [ ] Add item types/rarities with unique visuals
- [ ] Unlockable themes/backgrounds
- [ ] Add player stats (items collected, upgrades, etc.)
- [ ] Track session time or AFK mode
- [ ] Add local leaderboard (optional)

---

## 🔄 Polish & Final Touches
- [ ] Add favicon and metadata
- [ ] Optional: Add PWA mobile support
- [ ] Add easter eggs or secrets
- [ ] Animate upgrade buttons when affordable
- [ ] Add drop trails, sparkles, or other FX
