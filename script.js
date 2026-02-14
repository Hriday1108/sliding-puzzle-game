const GRID_SIZE = 4;
const TILE_SIZE = 90;
const TOTAL_TILES = GRID_SIZE * GRID_SIZE;
const EMPTY_TILE = TOTAL_TILES - 1;

let board = [];
let emptyIndex = EMPTY_TILE;
let moves = 0;
let currentPuzzle = "dragonfly1";

let touchStartX = 0;
let touchStartY = 0;

const puzzles = {
    dragonfly1: 'https://i.ibb.co/xqH6BT9n/Whats-App-Image-2026-02-14-at-1-39-22-AM.jpg',
    tower: 'https://i.ibb.co/LXLdPxVn/image.png',
    roses: 'https://i.ibb.co/kVHMj11y/image.png',
    painter: 'https://i.ibb.co/5WQ8Qtv7/image.png',
    catty: 'https://i.ibb.co/nNy104v3/image.png',
    big_boy: 'https://i.ibb.co/xqMNSWkg/image.png',
    pt_township_sky: 'https://i.ibb.co/NnrQrfwH/image.png',
    coffee: 'https://i.ibb.co/d03z3Y93/image.png',
    pt_township: 'https://i.ibb.co/prr09mvx/image.png',
    dragonfly2: 'https://i.ibb.co/0RwtVVyP/image.png',
    indian_flag: 'https://i.ibb.co/XkfGMxW6/image.png'
};


const puzzleContainer = document.getElementById("puzzle-container");
const movesDisplay = document.getElementById("moves");
const referenceImg = document.getElementById("reference-image");
const puzzleSelect = document.getElementById("puzzle-select");

function initPuzzle() {

    board = Array.from({ length: TOTAL_TILES }, (_, i) => i);
    emptyIndex = EMPTY_TILE;
    moves = 0;

    shuffle();
    updateReference();
    renderBoard();

    movesDisplay.textContent = "Moves: 0";
}

function updateReference() {
    referenceImg.style.backgroundImage = `url(${puzzles[currentPuzzle]})`;
}

function renderBoard() {

    puzzleContainer.innerHTML = "";

    board.forEach((value, i) => {

        const tile = document.createElement("div");
        tile.className = "tile";
        tile.dataset.index = i;

        const row = Math.floor(i / GRID_SIZE);
        const col = i % GRID_SIZE;

        tile.style.transform =
            `translate(${col * TILE_SIZE}px, ${row * TILE_SIZE}px)`;

        if (value !== EMPTY_TILE) {

            tile.style.backgroundImage = `url(${puzzles[currentPuzzle]})`;
            tile.style.backgroundSize =
                `${GRID_SIZE * TILE_SIZE}px ${GRID_SIZE * TILE_SIZE}px`;

            tile.style.backgroundPosition =
                `-${(value % GRID_SIZE) * TILE_SIZE}px -${Math.floor(value / GRID_SIZE) * TILE_SIZE}px`;

            tile.addEventListener("click", () => moveTile(i));

        } else {
            tile.classList.add("empty");
        }

        puzzleContainer.appendChild(tile);
    });
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

    // swap in board
    [board[index], board[emptyIndex]] =
        [board[emptyIndex], board[index]];

    emptyIndex = index;

    moves++;
    movesDisplay.textContent = `Moves: ${moves}`;

    renderBoard(); // ← THIS keeps DOM + board ALWAYS in sync
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

/* 🎚 DROPDOWN */

puzzleSelect.addEventListener("change", e => {
    currentPuzzle = e.target.value;
    initPuzzle();
});

/* 🔘 BUTTONS */

document.getElementById("new-game").onclick = initPuzzle;
document.getElementById("restart").onclick = initPuzzle;

/* 📱 SWIPE */

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
