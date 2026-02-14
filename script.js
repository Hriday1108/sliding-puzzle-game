const GRID_SIZE = 4;
const TILE_SIZE = 90;
const TOTAL_TILES = GRID_SIZE * GRID_SIZE;
const EMPTY_TILE = TOTAL_TILES - 1;

let board = [];
let emptyIndex = EMPTY_TILE;

let moves = 0;
let touchStartX = 0;
let touchStartY = 0;

const puzzles = {
    dragonfly1: 'https://i.ibb.co/xqH6BT9n/Whats-App-Image-2026-02-14-at-1-39-22-AM.jpg',
    roses: 'https://i.ibb.co/kVHMj11y/image.png'
};

const puzzleContainer = document.getElementById('puzzle-container');
const movesDisplay = document.getElementById('moves');
const referenceImg = document.getElementById('reference-image');

function initPuzzle() {
    board = Array.from({ length: TOTAL_TILES }, (_, i) => i);
    emptyIndex = EMPTY_TILE;
    moves = 0;
    movesDisplay.textContent = "Moves: 0";
    shuffle();
    renderBoard();
    referenceImg.style.backgroundImage = `url(${puzzles.dragonfly1})`;
}

function renderBoard() {

    puzzleContainer.innerHTML = '';

    for (let i = 0; i < TOTAL_TILES; i++) {

        const value = board[i];

        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.id = 'tile-' + value;

        const row = Math.floor(i / GRID_SIZE);
        const col = i % GRID_SIZE;

        tile.style.transform =
            `translate(${col * TILE_SIZE}px, ${row * TILE_SIZE}px)`;

        if (value !== EMPTY_TILE) {

            tile.style.backgroundImage = `url(${puzzles.dragonfly1})`;
            tile.style.backgroundSize =
                `${GRID_SIZE * TILE_SIZE}px ${GRID_SIZE * TILE_SIZE}px`;

            tile.style.backgroundPosition =
                `-${(value % GRID_SIZE) * TILE_SIZE}px -${Math.floor(value / GRID_SIZE) * TILE_SIZE}px`;

            // ⭐ IMPORTANT — find current index on click
            tile.onclick = () => {
                const currentIndex = board.indexOf(value);
                moveTile(currentIndex);
            };

        } else {
            tile.classList.add('empty');
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
        (tileRow === emptyRow && Math.abs(tileCol - emptyCol) === 1) ||
        (tileCol === emptyCol && Math.abs(tileRow - emptyRow) === 1);

    if (!isAdjacent) return;

    // swap board
    [board[index], board[emptyIndex]] =
        [board[emptyIndex], board[index]];

    emptyIndex = index;

    updateTilePositions();

    moves++;
    movesDisplay.textContent = `Moves: ${moves}`;
}

function updateTilePositions() {

    for (let i = 0; i < TOTAL_TILES; i++) {

        const value = board[i];
        const tile = document.getElementById('tile-' + value);

        const row = Math.floor(i / GRID_SIZE);
        const col = i % GRID_SIZE;

        tile.style.transform =
            `translate(${col * TILE_SIZE}px, ${row * TILE_SIZE}px)`;
    }
}

function shuffle() {

    for (let i = 0; i < 200; i++) {

        const possibleMoves = [];

        const row = Math.floor(emptyIndex / GRID_SIZE);
        const col = emptyIndex % GRID_SIZE;

        if (row > 0) possibleMoves.push(emptyIndex - GRID_SIZE);
        if (row < GRID_SIZE - 1) possibleMoves.push(emptyIndex + GRID_SIZE);
        if (col > 0) possibleMoves.push(emptyIndex - 1);
        if (col < GRID_SIZE - 1) possibleMoves.push(emptyIndex + 1);

        const randomMove =
            possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

        [board[randomMove], board[emptyIndex]] =
            [board[emptyIndex], board[randomMove]];

        emptyIndex = randomMove;
    }
}

/* 📱 SWIPE SUPPORT */

puzzleContainer.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

puzzleContainer.addEventListener("touchend", e => {

    let dx = e.changedTouches[0].clientX - touchStartX;
    let dy = e.changedTouches[0].clientY - touchStartY;

    const row = Math.floor(emptyIndex / GRID_SIZE);
    const col = emptyIndex % GRID_SIZE;

    if (Math.abs(dx) > Math.abs(dy)) {

        if (dx > 30 && col > 0) moveTile(emptyIndex - 1);
        if (dx < -30 && col < GRID_SIZE - 1) moveTile(emptyIndex + 1);

    } else {

        if (dy > 30 && row > 0) moveTile(emptyIndex - GRID_SIZE);
        if (dy < -30 && row < GRID_SIZE - 1) moveTile(emptyIndex + GRID_SIZE);
    }
});

initPuzzle();
