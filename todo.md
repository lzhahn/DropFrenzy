# ✅ Drop Frenzy - Implementation Checklist

## 🎯 Project Setup
- [ ] Set up project folder structure (`/src`, `/assets`, `/styles`, `/components`)
- [ ] Initialize with HTML/CSS/JS or framework (React, etc.)
- [ ] Set up development environment (Vite, Webpack, CRA, etc.)
- [ ] Set up Git version control
- [ ] Create `index.html` with base layout

---

## 🎮 Core Game Loop

### ⬇️ Item Drop System
- [ ] Define item object (position, speed, value, ID)
- [ ] Spawn items at random X-positions
- [ ] Implement timed loop to spawn new items
- [ ] Animate items falling down the screen
- [ ] Despawn items when offscreen

### 👆 Click Detection
- [ ] Detect mouse click or touch on falling item
- [ ] Remove item and increase currency on click
- [ ] Add hitbox/collision detection
- [ ] Add visual + audio feedback on collection

### 💰 Currency System
- [ ] Create currency variable
- [ ] Add function to increase currency
- [ ] Display currency in UI

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
