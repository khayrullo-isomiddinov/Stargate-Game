'use strict';

/* ============================================================
   STARGATE – Desert Hunt  |  script.js
   ============================================================ */

const GRID        = 5;
const CENTER      = 12;   // index of centre cell (row 2, col 2)
const PLAYER_COLORS = ['#e74c3c', '#27ae60', '#3498db', '#f39c12'];
const ITEM_NAMES  = ['Watch', 'Robot', 'Camera'];
const LOG_MAX     = 40;

let state                = null;
let selectedPlayerCount  = 1;
const logBuffer          = [];

/* ============================================================
   BOARD INITIALISATION
   ============================================================ */

function buildBoard() {
  /* Start with 25 sand cells; centre is the Stargate (pre-revealed). */
  const board = Array.from({ length: 25 }, () => ({
    type:           'sand',
    revealed:       false,
    oasisUsed:      false,
    clueItemIndex:  null,
    clueDirection:  null,
  }));
  board[CENTER].type     = 'stargate';
  board[CENTER].revealed = true;

  const used = new Set([CENTER]);

  /* ── 4 oases (3 water, 1 drought), placed randomly ── */
  const oasisTypes = shuffle(['oasis', 'oasis', 'oasis', 'drought']);
  pickRandom(25, 4, used).forEach((pos, i) => {
    board[pos].type = oasisTypes[i];
    used.add(pos);
  });

  /* ── 3 items ── */
  const itemPositions = pickRandom(25, 3, used);
  itemPositions.forEach((pos, i) => {
    board[pos].type = `item${i}`;
    used.add(pos);
  });

  /* ── 2 directional clues per item ── */
  itemPositions.forEach((itemPos, itemIdx) => {
    const adj = adjacentOf(itemPos).filter(p => !used.has(p));
    let cluePositions = adj.slice(0, 2);

    /* If fewer than 2 adjacent free cells, pick more from the rest of the board. */
    if (cluePositions.length < 2) {
      const extra = pickRandom(25, 2 - cluePositions.length, new Set([...used, ...cluePositions]));
      cluePositions = [...cluePositions, ...extra];
    }

    cluePositions.forEach(cluePos => {
      board[cluePos].type          = 'clue';
      board[cluePos].clueItemIndex = itemIdx;
      board[cluePos].clueDirection = directionTo(cluePos, itemPos);
      used.add(cluePos);
    });
  });

  return board;
}

function initGame(playerCount, names, startWater) {
  if (state && state.timerInterval) clearInterval(state.timerInterval);

  state = {
    board:              buildBoard(),
    players:            names.slice(0, playerCount).map((name, i) => ({
      name:    name || `Player ${i + 1}`,
      color:   PLAYER_COLORS[i],
      water:   startWater,
      maxWater: startWater,
      position: CENTER,
      alive:   true,
    })),
    currentPlayerIndex: 0,
    actionsLeft:        3,
    cluesFound:         [0, 0, 0],   // global: how many clues revealed for each item
    itemsCollected:     [false, false, false],
    timer:              0,
    timerInterval:      null,
    gameOver:           false,
    victory:            false,
  };

  saveState();
}

/* ============================================================
   HELPERS
   ============================================================ */

function adjacentOf(pos) {
  const row = Math.floor(pos / GRID), col = pos % GRID;
  const result = [];
  if (row > 0)        result.push(pos - GRID);
  if (row < GRID - 1) result.push(pos + GRID);
  if (col > 0)        result.push(pos - 1);
  if (col < GRID - 1) result.push(pos + 1);
  return result;
}

function isAdjacent(a, b) { return adjacentOf(a).includes(b); }

function directionTo(from, to) {
  const dr = Math.floor(to / GRID) - Math.floor(from / GRID);
  const dc = (to % GRID) - (from % GRID);
  if (dr > 0) return 'DOWN';
  if (dr < 0) return 'UP';
  if (dc > 0) return 'RIGHT';
  return 'LEFT';
}

/* Return the rendered cell size so token positions stay in sync with CSS. */
function getCellSize() {
  if (window.innerWidth <= 767) {
    return Math.floor((window.innerWidth - 48) / 5);
  }
  return 88;
}

function pickRandom(total, count, excluded) {
  const excSet = excluded instanceof Set ? excluded : new Set(excluded);
  const avail  = Array.from({ length: total }, (_, i) => i).filter(i => !excSet.has(i));
  const result = [];
  while (result.length < count && avail.length > 0) {
    const idx = Math.floor(Math.random() * avail.length);
    result.push(avail[idx]);
    avail.splice(idx, 1);
  }
  return result;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ============================================================
   GAME ACTIONS
   ============================================================ */

function handleCellClick(index) {
  if (!state || state.gameOver || state.victory || state.turnEnding) return;
  const player = state.players[state.currentPlayerIndex];
  if (!player.alive) return;

  if (state.actionsLeft <= 0) return;
  if (index === player.position) {
    addLog('You are already here. Press "Dig" to reveal this tile.');
    return;
  }
  if (!isAdjacent(player.position, index)) {
    addLog('You can only move to an adjacent tile.');
    return;
  }

  player.position = index;
  state.actionsLeft--;
  addLog(`${player.name} moved. (${state.actionsLeft} action${state.actionsLeft !== 1 ? 's' : ''} left)`);

  saveState();
  render();
  maybeAutoEndTurn();
}

function handleDig() {
  if (!state || state.gameOver || state.victory || state.turnEnding) return;
  const player = state.players[state.currentPlayerIndex];
  if (!player.alive) return;
  if (state.actionsLeft <= 0) { addLog('No actions remaining!'); return; }

  const pos  = player.position;
  const cell = state.board[pos];

  if (pos === CENTER) { addLog('Nothing to dig at the Stargate.'); return; }
  if (cell.revealed)  { addLog('This tile has already been revealed.'); return; }

  /* Spend action and reveal */
  state.actionsLeft--;
  cell.revealed = true;

  switch (cell.type) {

    case 'oasis':
      if (!cell.oasisUsed) {
        player.water    = player.maxWater;
        cell.oasisUsed  = true;
        addLog(`🌴 ${player.name} found a lush oasis! Water fully replenished (${player.water}/${player.maxWater}).`);
      } else {
        addLog(`🌴 ${player.name} found an oasis, but it has already been used up.`);
      }
      break;

    case 'drought':
      addLog(`☀️ ${player.name} uncovered a drought oasis — no water here!`);
      break;

    case 'clue': {
      const idx  = cell.clueItemIndex;
      state.cluesFound[idx] = Math.min(state.cluesFound[idx] + 1, 2);
      const name = ITEM_NAMES[idx];
      addLog(`🗺️ Clue for the ${name} discovered! (${state.cluesFound[idx]}/2)`);
      if (state.cluesFound[idx] >= 2) {
        addLog(`✅ Both clues for the ${name} found — you can now dig it up!`);
      }
      break;
    }

    default:
      if (cell.type.startsWith('item')) {
        const itemIdx = parseInt(cell.type.slice(4));
        if (state.cluesFound[itemIdx] < 2) {
          /* Not enough clues — undo the reveal and refund the action */
          cell.revealed  = false;
          state.actionsLeft++;
          addLog(`❓ You need both clues first! (${state.cluesFound[itemIdx]}/2 found)`);
        } else {
          state.itemsCollected[itemIdx] = true;
          addLog(`🏆 ${player.name} recovered the ${ITEM_NAMES[itemIdx]}!`);
          checkVictory();
        }
      } else {
        addLog(`⛏️ ${player.name} dug and found only sand.`);
      }
  }

  saveState();
  render();
  maybeAutoEndTurn();
}

function maybeAutoEndTurn() {
  if (!state || state.gameOver || state.victory) return;
  if (state.actionsLeft > 0) return;
  if (state.turnEnding) return;   // guard against double-fire

  state.turnEnding = true;
  addLog('All actions used — turn ending…');
  render();                        // re-render to show locked-out state

  setTimeout(() => {
    if (!state) return;
    state.turnEnding = false;
    endTurn();
  }, 900);
}

function endTurn() {
  if (!state || state.gameOver || state.victory) return;
  const player = state.players[state.currentPlayerIndex];

  /* Deduct water at end of turn */
  player.water--;
  addLog(`${player.name}'s turn ended. Water: ${player.water}/${player.maxWater}`);

  if (player.water <= 0) {
    player.water = 0;
    player.alive = false;
    addLog(`💀 ${player.name} ran out of water in the desert!`);
    checkGameOver();
    if (state.gameOver) { saveState(); render(); return; }
  }

  /* Advance to next alive player */
  let next = (state.currentPlayerIndex + 1) % state.players.length;
  for (let i = 0; i < state.players.length; i++) {
    if (state.players[next].alive) break;
    next = (next + 1) % state.players.length;
  }

  state.currentPlayerIndex = next;
  state.actionsLeft        = 3;
  addLog(`─── ${state.players[next].name}'s turn ───`);

  saveState();
  render();
}

function checkVictory() {
  if (state.itemsCollected.every(Boolean)) {
    state.victory = true;
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}

function checkGameOver() {
  if (state.players.every(p => !p.alive)) {
    state.gameOver = true;
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}

/* ============================================================
   LOGGING
   ============================================================ */

function addLog(msg) {
  logBuffer.push(msg);
  if (logBuffer.length > LOG_MAX) logBuffer.shift();
  const el = document.getElementById('gameLog');
  if (el) {
    el.innerHTML = [...logBuffer].reverse()
      .map(m => `<p class="log-entry">${m}</p>`)
      .join('');
  }
}

/* ============================================================
   RENDER
   ============================================================ */

function render() {
  if (!state) return;
  renderBoard();
  renderPlayers();
  renderActionBar();
  renderClueTracker();
  renderItemSlots();

  if (state.victory) {
    const m = String(Math.floor(state.timer / 60)).padStart(2, '0');
    const s = String(state.timer % 60).padStart(2, '0');
    document.getElementById('victoryMsg').textContent =
      `All Stargate components recovered in ${m}:${s}!`;
    document.getElementById('victoryOverlay').classList.remove('hidden');
  } else if (state.gameOver) {
    document.getElementById('gameOverOverlay').classList.remove('hidden');
  }
}

function renderBoard() {
  const boardEl     = document.getElementById('gameBoard');
  boardEl.innerHTML = '';
  const cp          = state.players[state.currentPlayerIndex];

  state.board.forEach((cell, i) => {
    const el = document.createElement('div');
    el.className = 'cell';

    /* Background / revealed styling */
    if (cell.revealed) {
      el.classList.add('revealed');
      const baseType = cell.type.startsWith('item') ? 'item' : cell.type;
      el.classList.add(`cell-${baseType}`);
    } else {
      el.classList.add('cell-hidden');
    }

    /* Highlight adjacent movable cells */
    if (!state.gameOver && !state.victory && !state.turnEnding && cp.alive
        && state.actionsLeft > 0 && isAdjacent(cp.position, i)) {
      el.classList.add('movable');
    }

    /* Highlight current player's position */
    if (cp.position === i && cp.alive) el.classList.add('current-pos');

    /* ── Cell image ── */
    if (cell.revealed) {
      const img   = document.createElement('img');
      img.className = 'cell-img';

      if (cell.type === 'stargate') {
        img.src = 'Assets/Assets/Stargate.png';
      } else if (cell.type === 'oasis') {
        img.src = 'Assets/Assets/Oasis.png';
      } else if (cell.type === 'drought') {
        img.src = 'Assets/Assets/Drought.png';
      } else if (cell.type === 'sand') {
        img.src = 'Assets/Assets/Hole.png';
      } else if (cell.type.startsWith('item')) {
        img.src = `Assets/Assets/Item ${parseInt(cell.type.slice(4)) + 1}.png`;
      } else if (cell.type === 'clue') {
        img.src = `Assets/Assets/Item ${cell.clueItemIndex + 1} - clue_${cell.clueDirection}.png`;
      }

      el.appendChild(img);

    } else if (cell.type === 'oasis' || cell.type === 'drought') {
      /* Oasis marker is visible before digging (shows something is here) */
      const marker      = document.createElement('img');
      marker.className  = 'cell-img oasis-marker';
      marker.src        = 'Assets/Assets/Oasis marker.png';
      el.appendChild(marker);
    }

    /* ── Player tokens ── */
    const hereIndices = state.players
      .map((p, pi) => ({ p, pi }))
      .filter(({ p }) => p.position === i && p.alive)
      .map(({ pi }) => pi);

    const single   = hereIndices.length === 1;
    const cellSize = getCellSize();
    const szSingle = Math.round(cellSize * 0.52);   // ≈ 46px at 88px cells
    const szMulti  = Math.round(cellSize * 0.25);   // ≈ 22px at 88px cells

    hereIndices.forEach((pi, slot) => {
      const player    = state.players[pi];
      const isActive  = pi === state.currentPlayerIndex;
      const token     = document.createElement('div');
      token.className = 'player-token' + (isActive ? ' active-token' : '');
      token.style.borderColor = player.color;
      token.style.background  = player.color + '38';

      if (single) {
        /* Solo on this tile — large, centred */
        token.style.width     = szSingle + 'px';
        token.style.height    = szSingle + 'px';
        token.style.top       = '50%';
        token.style.left      = '50%';
        token.style.transform = 'translate(-50%, -50%)';
      } else {
        /* Multiple players — small strip along the top */
        token.style.width  = szMulti + 'px';
        token.style.height = szMulti + 'px';
        token.style.top    = '3px';
        token.style.left   = `${2 + slot * (szMulti + 2)}px`;
      }

      const sprite     = document.createElement('img');
      sprite.src       = 'Assets/Assets/Player.png';
      sprite.className = 'token-sprite';
      token.appendChild(sprite);
      el.appendChild(token);
    });

    el.addEventListener('click', () => handleCellClick(i));
    boardEl.appendChild(el);
  });
}

function renderPlayers() {
  const panel     = document.getElementById('playersPanel');
  panel.innerHTML = '';

  state.players.forEach((player, i) => {
    const isActive = i === state.currentPlayerIndex;
    const card     = document.createElement('div');
    card.className = `player-card${isActive ? ' active-player' : ''}${!player.alive ? ' dead' : ''}`;

    const pct = player.maxWater > 0 ? Math.max(0, player.water / player.maxWater * 100) : 0;
    const low = pct <= 30;

    card.innerHTML = `
      <div class="player-name-header" style="color:${player.color}">
        ${player.name}${!player.alive ? ' 💀' : isActive ? ' ◀' : ''}
      </div>
      <div class="water-bar-wrap">
        <div class="water-bar${low ? ' low' : ''}" style="width:${pct}%"></div>
      </div>
      <div class="player-stat">
        <img src="Assets/Assets/Water.png" alt="Water">
        <span>${player.water} / ${player.maxWater}</span>
      </div>
      <div class="player-items">
        ${[0, 1, 2].map(idx => `
          <div class="player-item-ind${state.itemsCollected[idx] ? ' found' : ''}"
               title="${ITEM_NAMES[idx]}">
            <img src="Assets/Assets/Item ${idx + 1}.png" alt="${ITEM_NAMES[idx]}">
          </div>`).join('')}
      </div>`;

    panel.appendChild(card);
  });
}

function renderActionBar() {
  const actEl  = document.getElementById('actionsLeft');
  const nameEl = document.getElementById('currentPlayerName');

  if (actEl) {
    actEl.textContent = state.actionsLeft;
    actEl.style.color = state.actionsLeft > 0 ? '#27ae60' : '#c0392b';
  }
  if (nameEl) {
    const cp         = state.players[state.currentPlayerIndex];
    nameEl.textContent = cp.name;
    nameEl.style.color = cp.color;
  }

  const digBtn = document.getElementById('digBtn');
  const cp     = state.players[state.currentPlayerIndex];
  const locked = state.gameOver || state.victory || !cp.alive || !!state.turnEnding;

  if (digBtn) digBtn.disabled = locked || state.actionsLeft <= 0;
}

function renderClueTracker() {
  [0, 1, 2].forEach(i => {
    const el  = document.getElementById(`clue${i}count`);
    const row = document.getElementById(`clueRow${i}`);
    if (el)  el.textContent = `${Math.min(state.cluesFound[i], 2)}/2`;
    if (row) row.classList.toggle('complete', state.cluesFound[i] >= 2);
  });
}

function renderItemSlots() {
  [0, 1, 2].forEach(i => {
    const slot = document.getElementById(`itemSlot${i}`);
    if (slot) slot.classList.toggle('found', state.itemsCollected[i]);
  });
}

/* ============================================================
   TIMER
   ============================================================ */

function startTimer() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    if (!state || state.gameOver || state.victory) return;
    state.timer++;
    updateTimerDisplay();
  }, 1000);
}

function updateTimerDisplay() {
  const el = document.getElementById('timerDisplay');
  if (el && state) {
    el.textContent =
      String(Math.floor(state.timer / 60)).padStart(2, '0') + ':' +
      String(state.timer % 60).padStart(2, '0');
  }
}

/* ============================================================
   SAVE / LOAD  (localStorage)
   ============================================================ */

function saveState() {
  if (!state) return;
  try {
    /* Don't serialise the interval handle */
    const { timerInterval: _t, ...toSave } = state;
    localStorage.setItem('stargateGame', JSON.stringify(toSave));
  } catch (_) {}
}

function loadSavedGame() {
  try {
    const raw = localStorage.getItem('stargateGame');
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    state = { ...parsed, timerInterval: null };
    if (!state.gameOver && !state.victory) startTimer();
    return true;
  } catch (_) {
    return false;
  }
}

/* ============================================================
   HOME SCREEN
   ============================================================ */

function initHomeScreen() {
  document.querySelectorAll('.count-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedPlayerCount = parseInt(btn.dataset.count);
      document.querySelectorAll('.count-btn')
        .forEach(b => b.classList.toggle('active', b === btn));
      renderPlayerInputs(selectedPlayerCount);
    });
  });

  renderPlayerInputs(1);

  document.getElementById('startBtn').addEventListener('click', startGame);

  /* Show "Continue" button if a save exists */
  if (localStorage.getItem('stargateGame')) {
    document.getElementById('continueRow').classList.remove('hidden');
    document.getElementById('continueBtn').addEventListener('click', continueGame);
  }
}

function renderPlayerInputs(count) {
  const container     = document.getElementById('playerInputs');
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const row       = document.createElement('div');
    row.className   = 'player-input-row';
    row.innerHTML   = `
      <div class="player-color-dot" style="background:${PLAYER_COLORS[i]}"></div>
      <input type="text" class="player-name-input"
             placeholder="Player ${i + 1}" maxlength="12">`;
    container.appendChild(row);
  }
}

function startGame() {
  const inputs = document.querySelectorAll('.player-name-input');
  const names  = Array.from(inputs).map((inp, i) => inp.value.trim() || `Player ${i + 1}`);
  const water  = Math.max(1, parseInt(document.getElementById('startingWater').value) || 5);

  initGame(selectedPlayerCount, names, water);
  showGameScreen();
  /* Show tutorial — timer starts only after player dismisses it */
  document.getElementById('tutorialOverlay').classList.remove('hidden');
}

function showStory() {
  document.getElementById('storyOverlay').classList.remove('hidden');
}

function hideStory() {
  document.getElementById('storyOverlay').classList.add('hidden');
}

function dismissTutorial() {
  document.getElementById('tutorialOverlay').classList.add('hidden');
  startTimer();
  addLog('The expedition begins! Find all 3 Stargate components.');
  addLog('Click a glowing tile to move. Press "Dig" to reveal your current tile.');
}

function continueGame() {
  if (loadSavedGame()) {
    showGameScreen();
    updateTimerDisplay();
    addLog('Game restored — welcome back!');
  }
}

function showGameScreen() {
  document.getElementById('homeScreen').classList.remove('active');
  document.getElementById('gameScreen').classList.add('active');
  render();
}

function resetGame() {
  if (state && state.timerInterval) clearInterval(state.timerInterval);
  state = null;
  logBuffer.length = 0;
  localStorage.removeItem('stargateGame');

  document.getElementById('gameOverOverlay').classList.add('hidden');
  document.getElementById('victoryOverlay').classList.add('hidden');
  document.getElementById('gameScreen').classList.remove('active');
  document.getElementById('homeScreen').classList.add('active');

  /* Hide continue button since save was deleted */
  document.getElementById('continueRow').classList.add('hidden');
}

/* ============================================================
   BOOT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHomeScreen();
  document.getElementById('digBtn').addEventListener('click', handleDig);
  document.getElementById('tutorialDismiss').addEventListener('click', dismissTutorial);
});
