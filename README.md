# Stargate – Desert Hunt

A browser-based desert survival game. Recover three hidden Stargate components buried across a 5×5 desert grid before your water runs out.

**Author:** Khayrullo Isomiddinov · [github.com/khayrullo-isomiddinov](https://github.com/khayrullo-isomiddinov)

---

## Setup

No installation or build step required. Just open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).

```
git clone https://github.com/khayrullo-isomiddinov/Stargate-Game.git
cd Stargate-Game
open index.html
```

Or simply double-click `index.html` in your file explorer.

---

## How to Play

1. Choose the number of players (1–4), enter names, and set a starting water supply.
2. Click **Begin Expedition**, read the tutorial, then click **Begin the Expedition** to start.
3. On your turn you have **3 actions**:
   - **Move** — click a glowing adjacent tile.
   - **Dig** — press the Dig button to reveal the tile you are standing on.
4. After 3 actions the turn ends automatically and you lose 1 water.
5. Find both **clues** for a part before you can dig it up.
6. Dig an **oasis** to fully refill your water (3 of the 4 have water — one is a drought).
7. Collect all 3 Stargate parts to win. Hit 0 water and it's game over.

Your progress is saved automatically in `localStorage` — a **Continue** button will appear the next time you open the game.
