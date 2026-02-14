const GRID_SIZE = 4;
const TOTAL_TILES = 17;
const EMPTY_TILE = 16;

let board = [];
let emptyIndex = 16;

let moves = 0;
let timeElapsed = 0;
let timerInterval;
let currentPuzzle = 'dragonfly1';

const puzzles = {
    dragonfly1: 'https://i.ibb.co/xqH6BT9n/Whats-App-Image-2026-02-14-at-1-39-22-AM.jpg',
    tower: 'https://i.ibb.co/LXLdPxVn/image.png',
    roses: 'https://i.ibb.co/kVHMj11y/image.png',
    painter: 'https://i.ibb.co/5WQ8Qtv7/image.png',
    catty: 'https://i.ibb.co/nNy104v3/image.png',
    your_momo: 'https://i.ibb.co/xqMNSWkg/image.png',
    pt_township_sky: 'https://i.ibb.co/NnrQrfwH/image.png',
    coffee: 'https://i.ibb.co/d03z3Y93/image.png',
    pt_township: 'https://i.ibb.co/prr09mvx/image.png',
    dragonfly2: 'https://i.ibb.co/0RwtVVyP/image.png',
    indian_flag: 'https://i.ibb.co/XkfGMxW6/image.png'
};

const puzzleContainer = document.getElementById('puzzle-container');
const puzzleSelect = document.getElementById('puzzle-select');
const newGameBtn = document.getElementById('new-game');
const restartBtn = document.getElementById('restart');
const timerDisplay = document.getElementById('timer');
const movesDisplay = document.getElementById('moves');
const victoryDiv = document.getElementById('victory');
const victoryStats = document.getElementById('victory-stats');
const playAgainBtn = document.getElementById('play-again');
const referenceImg = document.getElementById('reference-image');

function initPuzzle() {

    // 16 image tiles + 1 helper empty tile
    board = Array.from({ length: 16 }, (_, i) => i);
    board.push(EMPTY_TILE);

    emptyIndex = 16;

    scrambleBoard();
    renderBoard();
    updateReferenceImage();
    resetStats();
}

function renderBoard() {

    puzzleContainer.innerHTML = '';

    for (let i = 0; i < TOTAL_TILES; i++) {

        const tile = document.createElement('div');
        tile.className = 'tile';

        const row = Math.floor(i / GRID_SIZE);
        const col = i % GRID_SIZE;

        tile.style.left = col * 90 + 'px';
        tile.style.top = row * 90 + 'px';

        // EMPTY HELPER TILE
        if (board[i] === EMPTY_TILE) {

            tile.classList.add('empty');

        } else {

            const value = board[i];

            tile.style.backgroundImage = `url(${puzzles[currentPuzzle]})`;
            tile.style.backgroundSize = `360px 360px`;

            tile.style.backgroundPosition =
                `-${(value % GRID_SIZE) * 90}px -${Math.floor(value / GRID_SIZE) * 90}px`;

            tile.addEventListener('click', () => moveTile(i));
        }

        puzzleContainer.appendChild(tile);
    }
}

function moveTile(index) {

    const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
    const emptyCol = emptyIndex % GRID_SIZE;

    const tileRow = Math.floor(index / GRID_SIZE);
    const tileCol = index % GRID_SIZE;

    const isAdjacent =
        (Math.abs(tileRow - emptyRow) === 1 && tileCol === emptyCol) ||
        (Math.abs(tileCol - emptyCol) === 1 && tileRow === emptyRow);

    if (!isAdjacent) return;

    [board[index], board[emptyIndex]] =
    [board[emptyIndex], board[index]];

    emptyIndex = index;

    renderBoard();

    moves++;
    movesDisplay.textContent = `Moves: ${moves}`;

    if (isSolved()) {
        clearInterval(timerInterval);
        showVictory();
    }
}

function scrambleBoard() {

    do {

        let tiles = Array.from({ length: 16 }, (_, i) => i);

        // Fisher–Yates shuffle
        for (let i = tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
        }

        board = [...tiles, EMPTY_TILE];

    } while (!isSolvable());

    emptyIndex = 16;
}

function isSolved() {

    for (let i = 0; i < 16; i++) {
        if (board[i] !== i) return false;
    }
    return true;
}

function isSolvable() {

    let inversions = 0;

    for (let i = 0; i < 16; i++) {
        for (let j = i + 1; j < 16; j++) {
            if (board[i] > board[j]) inversions++;
        }
    }

    // For 4×4 puzzle → solvable when inversions are EVEN
    return inversions % 2 === 0;
}


function updateReferenceImage() {
    referenceImg.style.backgroundImage = `url(${puzzles[currentPuzzle]})`;
}

function resetStats() {

    timeElapsed = 0;
    moves = 0;

    timerDisplay.textContent = 'Time: 00:00';
    movesDisplay.textContent = 'Moves: 0';

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {

        timeElapsed++;

        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;

        timerDisplay.textContent =
            `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    }, 1000);
}

function showVictory() {

    victoryStats.textContent =
        `Time: ${timerDisplay.textContent.split(': ')[1]}, Moves: ${moves}`;

    victoryDiv.classList.remove('hidden');
}

puzzleSelect.addEventListener('change', () => {
    currentPuzzle = puzzleSelect.value;
    initPuzzle();
});

newGameBtn.addEventListener('click', initPuzzle);
restartBtn.addEventListener('click', initPuzzle);

playAgainBtn.addEventListener('click', () => {
    victoryDiv.classList.add('hidden');
    initPuzzle();
});

initPuzzle();
