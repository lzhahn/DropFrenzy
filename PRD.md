
# 📝 Product Requirements Document

## 🧠 Project Title:
**ClickStorm** *(working title)*

---

## 💡 Objective:
Create a simple, addictive web/mobile game where users click on falling objects to gain points. The goal is to test reaction speed, hand-eye coordination, and just kill time in the most satisfying way possible.

---

## 🎯 Core Features:

### 1. Falling Objects Engine
- Objects fall from the top of the screen at random x-positions.
- Object types can vary (e.g., apples, bombs, golden stars).
- Objects fall at increasing speed as time passes (difficulty scaling).

### 2. Click Interaction
- Clicking an object gives you points.
- Some objects give more points than others (rarity system).
- Some objects (like bombs) deduct points or end the game.

### 3. Score System
- Score displayed in real-time at top of screen.
- Bonus streaks for multiple fast clicks.
- Leaderboard integration (optional for MVP).

### 4. Game States
- Start screen → Game screen → Game over screen.
- Game over screen shows final score and "Play Again" button.

### 5. Visuals & Sounds
- Simple and cute animations (bounce on click, splat on miss, etc).
- Fun sound effects per object.
- Background music (optional toggle).

---

## 🔧 MVP Requirements:

| Feature                | Included in MVP |
|------------------------|------------------|
| Falling objects        | ✅               |
| Click-to-score         | ✅               |
| Game timer or lives    | ✅               |
| Score counter          | ✅               |
| Start/Restart buttons  | ✅               |
| Mobile + Desktop support | ✅             |
| Sound toggle           | ✅               |

---

## 🧪 Stretch Features (Post-MVP):
- Object types with unique behaviors (e.g., bouncy, splitting).
- Power-ups (e.g., slow motion, score multiplier).
- Skins/themes (e.g., spooky, space, candy).
- User accounts for saving high scores.
- Leaderboard + friend challenge mode.
- Multiplayer mode (side-by-side click battles).

---

## 📱 Platforms:
- Web-based (HTML5, JavaScript, CSS)
- Optional: Mobile version via wrapper (Capacitor/Cordova or PWA)

---

## 🖼️ Wireframe (Simple View):

```
+----------------------------+
|        Score: 215         |
|                            |
|       ⭐        🍎         |
|                            |
|     💣                    |
|                            |
|            🧠              |
|                            |
|     [PLAY AGAIN]          |
+----------------------------+
```

---

## ⏱️ Timeline:

| Phase             | Duration       |
|------------------|----------------|
| Design & Prototype | 1 week        |
| Development MVP    | 2 weeks       |
| Bug Fixes & Polish | 1 week        |
| Launch             | Week 4        |
