Khayrullo Isomiddinov
BET9FI
Web programming - assignment
This solution was submitted and created by the student above for the Web Programming course.
I declare that this solution is my own work. I did not copy or use it from a third party
solutions from third parties. I did not forward my solution to my fellow students, nor did I publish it.
Eötvös Loránd University Student Requirements System
(Organizational and Operational Regulations of ELTE, Volume II, § 74/C) states that as long as,
as long as a student has been working on the work - or at least a significant part of it - of another student
of another student's work as his or her own, it is a disciplinary offence.
The most serious consequence of a disciplinary offence is dismissal from the university.

---

# Stargate – Desert Hunt

A browser-based desert survival game built with vanilla HTML, CSS and JavaScript.
Recover three hidden Stargate components buried across a 5×5 desert grid before your water supply runs out.

**Author:** Khayrullo Isomiddinov
**GitHub:** [github.com/khayrullo-isomiddinov](https://github.com/khayrullo-isomiddinov)

---

## How to Play

1. Open `index.html` in any modern browser — no build step required.
2. Set the number of players (1–4), enter player names, and choose a starting water supply.
3. Click **Begin Expedition** to read the tutorial, then start.

**On your turn (3 actions):**
- **Move** — click any glowing adjacent tile to walk there (costs 1 action).
- **Dig** — press the Dig button to reveal the tile you are standing on (costs 1 action).
- After all 3 actions are used, the turn ends automatically and 1 water is deducted.

**Goal:** find both clues for each of the 3 Stargate parts, then dig them up. Collect all three parts to win.

**Oases** (marked on the board) refill your water to maximum when dug — but one of the four is a drought with no water. Choose wisely.

---

## Additional requirements

### Minimal requirements (8 points)

- [x] Other: The README.md file in the "Additional requirements" section is appropriately filled out and included in the uploaded package (0 points)
- [x] Game board: The playing field is displayed with a 5×5 board. (1 point)
- [x] Game board: Oases appear in a random place on the board (2 points)
- [x] Game board: The player's figure is placed in the centre of the board (1 point)
- [x] Movement: The figure can move to one of the adjacent squares. (2 points)
- [x] Digging: We can reveal the field element on which the player stands and what is indicated under it. (2 points)

### Normal requirements (12 points)

- [x] Home screen: players have the option to set a name (0.5 points)
- [x] Home screen: setting players' primary water supply (0.5 points)
- [x] Game board: clues are randomly assigned, initially invisible to the players. (1 point)
- [x] Game board: player data is displayed (0.5 points)
- [x] Actions: The player can perform three arbitrary actions in the round (1 point)
- [x] Actions: It is indicated how many more actions the player can perform in their turn (1 point)
- [x] Actions: The player's water supply is reduced by one at the end of their turn. (0.5 points)
- [x] Digging: All parts can only be obtained after the two clues have been found. (1 point)
- [x] Digging: If the player performs digging in an oasis space, their water supply is replenished. (1 point)
- [x] Digging: Only three of the four oases can be filled with water. (1 point)
- [x] Game over: If a player runs out of water, it's game over. (0.5 points)
- [x] End of the game: If all three parts have been found, the game ends with victory. (0.5 points)
- [x] Multiplayer mode: set player number (0.5 points)
- [x] Multiplayer mode: players' figures appear in the middle of the board (0.5 points)
- [x] Multiplayer mode: the current player is indicated (0.5 points)
- [x] Multiplayer mode: actions can only be performed with the current player (0.5 points)
- [x] Good-looking appearance (1 point)

### Extra requirements (5 points)

- [x] Game board: at the start of the game, a counter starts and is updated every second to indicate elapsed time. (1 point)
- [ ] Home screen: allow the player(s) to specify how much time they want to complete the game, and after the specified time the game ends (1 point)
- [ ] Movement: the step is animated (1 point)
- [x] Save: The game constantly saves its state in localStorage. (2 points)

---

## Implementation notes

- **No frameworks or libraries** — pure HTML5, CSS3, and ES6+ JavaScript.
- **Board generation** — the 5×5 grid is built procedurally on each new game: oasis positions, item positions, and directional clue positions are all randomised. Each item gets exactly 2 clues placed in adjacent or nearby cells, with the clue image indicating the direction toward the hidden part.
- **Turn system** — turns end automatically after 3 actions are spent. A 900 ms delay gives the player time to read the result of their last action before the handoff.
- **localStorage autosave** — every action serialises the full game state. A "Continue" button appears on the home screen when a save is detected.
- **Multiplayer** — up to 4 players share one board. All start at the centre (the Stargate). The active player is highlighted; other players cannot act on someone else's turn.
- **Clue system** — both directional clues for an item must be revealed (by any player) before the item tile can be dug up. Attempting to dig an item early refunds the action.

## File structure

```
Stargate-Game/
├── index.html       # Markup: home screen, game screen, all overlays
├── style.css        # All styling — desert theme, animations, layout
├── script.js        # Game logic, rendering, save/load
├── Assets/
│   └── Assets/      # Sprites: player, items, clues, oasis, stargate, etc.
└── README.md
```
