const COLS = 8;
const ROWS = 10;
const MINES = 12;
const LONG_PRESS_MS = 460;

const boardElement = document.querySelector('#board');
const levelElement = document.querySelector('#level');
const minesLeftElement = document.querySelector('#mines-left');
const streakElement = document.querySelector('#streak');
const resetButton = document.querySelector('#reset-button');
const resultOverlay = document.querySelector('#result-overlay');
const resultTitle = document.querySelector('#result-title');
const resultKicker = document.querySelector('#result-kicker');
const resultDetail = document.querySelector('#result-detail');
const resultButton = document.querySelector('#result-button');
const laughAudio = document.querySelector('#win-audio');

let level = 1;
let streak = 0;
let board = [];
let ended = false;
let firstMove = true;
let longPressTimer = null;
let pressTarget = null;
let longPressTriggered = false;
let resultTimer = null;

function makeBoard() {
  ended = false;
  firstMove = true;
  board = Array.from({ length: ROWS * COLS }, (_, index) => ({ index, mine: false, open: false, flag: false, adjacent: 0 }));
  const mineIndexes = new Set();
  while (mineIndexes.size < MINES) mineIndexes.add(Math.floor(Math.random() * board.length));
  mineIndexes.forEach(index => { board[index].mine = true; });
  board.forEach(cell => { cell.adjacent = neighbours(cell.index).filter(index => board[index].mine).length; });
  renderBoard();
  updateStats();
}

function neighbours(index) {
  const row = Math.floor(index / COLS);
  const col = index % COLS;
  const result = [];
  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      if (!rowOffset && !colOffset) continue;
      const nextRow = row + rowOffset;
      const nextCol = col + colOffset;
      if (nextRow >= 0 && nextRow < ROWS && nextCol >= 0 && nextCol < COLS) result.push(nextRow * COLS + nextCol);
    }
  }
  return result;
}

function renderBoard() {
  boardElement.innerHTML = '';
  board.forEach(cell => {
    const button = document.createElement('button');
    button.className = 'cell';
    button.type = 'button';
    button.dataset.index = cell.index;
    button.setAttribute('role', 'gridcell');
    button.setAttribute('aria-label', `第 ${Math.floor(cell.index / COLS) + 1} 行第 ${(cell.index % COLS) + 1} 列`);
    updateCell(button, cell);
    bindPress(button);
    boardElement.appendChild(button);
  });
}

function updateCell(element, cell) {
  element.className = 'cell';
  element.replaceChildren();
  if (cell.open) {
    element.classList.add('open');
    if (cell.mine) {
      element.classList.add('mine-hit');
      const image = document.createElement('img');
      image.src = 'assets/mine.jpg'; image.alt = '雷'; element.append(image);
    } else if (cell.adjacent) {
      element.classList.add(`number-${cell.adjacent}`);
      element.textContent = cell.adjacent;
    }
  } else if (cell.flag) {
    element.classList.add('flagged');
    const image = document.createElement('img');
    image.src = 'assets/flag.jpg'; image.alt = '旗帜'; element.append(image);
  }
}

function bindPress(button) {
  button.addEventListener('pointerdown', event => {
    if (ended || event.button > 0) return;
    pressTarget = button;
    longPressTriggered = false;
    longPressTimer = window.setTimeout(() => {
      longPressTriggered = true;
      toggleFlag(Number(button.dataset.index));
      if (navigator.vibrate) navigator.vibrate(35);
    }, LONG_PRESS_MS);
  });
  const finishPress = () => {
    window.clearTimeout(longPressTimer);
    if (pressTarget === button && !longPressTriggered && !ended) openCell(Number(button.dataset.index));
    pressTarget = null;
  };
  button.addEventListener('pointerup', finishPress);
  button.addEventListener('pointercancel', finishPress);
  button.addEventListener('pointerleave', () => { if (longPressTimer && !longPressTriggered) window.clearTimeout(longPressTimer); });
  button.addEventListener('contextmenu', event => event.preventDefault());
}

function toggleFlag(index) {
  const cell = board[index];
  if (cell.open) return;
  cell.flag = !cell.flag;
  const element = boardElement.children[index];
  updateCell(element, cell);
  updateStats();
}

function openCell(index) {
  const cell = board[index];
  if (cell.open || cell.flag) return;
  if (firstMove) {
    makeFirstMoveSafe(index);
    firstMove = false;
  }
  if (cell.mine) {
    cell.open = true;
    ended = true;
    revealMines();
    renderBoard();
    showResult(false);
    return;
  }
  floodOpen(index);
  renderBoard();
  if (board.every(item => item.mine || item.open)) {
    ended = true;
    streak += 1;
    showResult(true);
  }
}

function makeFirstMoveSafe(index) {
  if (!board[index].mine) return;
  const replacement = board.find(item => !item.mine && item.index !== index);
  if (!replacement) return;
  board[index].mine = false;
  replacement.mine = true;
  board.forEach(cell => { cell.adjacent = neighbours(cell.index).filter(neighbour => board[neighbour].mine).length; });
}

function floodOpen(start) {
  const queue = [start];
  const visited = new Set();
  while (queue.length) {
    const index = queue.shift();
    if (visited.has(index)) continue;
    visited.add(index);
    const cell = board[index];
    if (cell.mine || cell.flag) continue;
    cell.open = true;
    if (cell.adjacent === 0) neighbours(index).forEach(neighbour => { if (!visited.has(neighbour)) queue.push(neighbour); });
  }
}

function revealMines() { board.forEach(cell => { if (cell.mine) cell.open = true; }); }

function updateStats() {
  levelElement.textContent = level;
  minesLeftElement.textContent = MINES - board.filter(cell => cell.flag).length;
  streakElement.textContent = streak;
}

function showResult(won) {
  window.clearTimeout(resultTimer);
  resultOverlay.hidden = false;
  updateStats();

  if (won) {
    resultOverlay.classList.remove('reveal-phase');
    resultTitle.textContent = '挑战胜利';
    resultTitle.className = 'win';
    resultKicker.textContent = `第 ${level} 关完成`;
    resultDetail.textContent = '准备好后点击按钮，进入下一关。';
    resultButton.textContent = '进入下一关';
    resultButton.hidden = false;
    laughAudio.currentTime = 0;
    laughAudio.play().catch(() => {});
    return;
  }

  // 失败先停在雷区展示阶段，4 秒后才显示最终结算和播放音频。
  resultOverlay.classList.add('reveal-phase');
  resultTitle.textContent = '踩到雷了！';
  resultTitle.className = 'lose mine-warning-title';
  resultKicker.textContent = '所有奶蛋雷已显示';
  resultDetail.textContent = '看清雷区，4 秒后查看挑战结算。';
  resultButton.hidden = true;
  resultTimer = window.setTimeout(() => {
    if (!ended) return;
    resultOverlay.classList.remove('reveal-phase');
    resultTitle.textContent = '挑战失败';
    resultTitle.className = 'lose';
    resultKicker.textContent = '本关挑战结束';
    resultDetail.textContent = '准备好后点击按钮，再来一次挑战。';
    resultButton.textContent = '重新挑战';
    resultButton.hidden = false;
    laughAudio.currentTime = 0;
    laughAudio.play().catch(() => {});
  }, 4000);
}

function closeResult() {
  if (resultButton.hidden) return;
  window.clearTimeout(resultTimer);
  laughAudio.pause();
  laughAudio.currentTime = 0;
  resultOverlay.hidden = true;
  if (resultTitle.classList.contains('win')) level += 1;
  else streak = 0;
  makeBoard();
}

resetButton.addEventListener('click', () => {
  window.clearTimeout(resultTimer);
  laughAudio.pause();
  laughAudio.currentTime = 0;
  resultOverlay.hidden = true;
  level = 1;
  streak = 0;
  makeBoard();
});
resultButton.addEventListener('click', closeResult);

makeBoard();
