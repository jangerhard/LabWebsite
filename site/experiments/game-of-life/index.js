import init, { Universe } from './pkg/game_of_life.js';

// Configuration
const CELL_SIZE = 8; // pixels
const GRID_COLOR = '#30363d';  // --border
const DEAD_COLOR = '#0d1117';  // --bg
const ALIVE_COLOR = '#3fb950'; // --success
const WIDTH = 64;
const HEIGHT = 64;

// State
let universe;
let memory;
let canvas;
let ctx;
let animationId = null;

async function main() {
    // Initialize WASM
    const wasm = await init();
    memory = wasm.memory;

    // Create universe
    universe = Universe.new(WIDTH, HEIGHT);
    console.log(`Universe created: ${universe.width()}x${universe.height()}`);

    // Set up canvas
    canvas = document.getElementById('game-canvas');
    canvas.width = (CELL_SIZE + 1) * WIDTH + 1;
    canvas.height = (CELL_SIZE + 1) * HEIGHT + 1;
    ctx = canvas.getContext('2d');

    // Set up controls
    setupControls();

    // Initial render and start animation
    draw();
    play();
}

function setupControls() {
    const playPauseBtn = document.getElementById('play-pause');
    const resetBtn = document.getElementById('reset');
    const clearBtn = document.getElementById('clear');

    playPauseBtn.addEventListener('click', () => {
        if (isPaused()) {
            play();
        } else {
            pause();
        }
    });

    resetBtn.addEventListener('click', () => {
        universe.reset();
        draw();
    });

    clearBtn.addEventListener('click', () => {
        universe.clear();
        draw();
    });

    // Click to toggle cells
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const canvasX = (event.clientX - rect.left) * scaleX;
        const canvasY = (event.clientY - rect.top) * scaleY;

        const col = Math.floor(canvasX / (CELL_SIZE + 1));
        const row = Math.floor(canvasY / (CELL_SIZE + 1));

        if (row >= 0 && row < HEIGHT && col >= 0 && col < WIDTH) {
            universe.toggle_cell(row, col);
            draw();
        }
    });
}

function isPaused() {
    return animationId === null;
}

function play() {
    document.getElementById('play-pause').textContent = 'Pause';
    renderLoop();
}

function pause() {
    document.getElementById('play-pause').textContent = 'Play';
    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

function renderLoop() {
    universe.tick();
    draw();
    animationId = requestAnimationFrame(renderLoop);
}

function draw() {
    drawGrid();
    drawCells();
}

function drawGrid() {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;

    // Vertical lines
    for (let i = 0; i <= WIDTH; i++) {
        const x = i * (CELL_SIZE + 1) + 1;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, (CELL_SIZE + 1) * HEIGHT + 1);
    }

    // Horizontal lines
    for (let j = 0; j <= HEIGHT; j++) {
        const y = j * (CELL_SIZE + 1) + 1;
        ctx.moveTo(0, y);
        ctx.lineTo((CELL_SIZE + 1) * WIDTH + 1, y);
    }

    ctx.stroke();
}

function drawCells() {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, WIDTH * HEIGHT);

    ctx.beginPath();

    // Draw alive cells
    ctx.fillStyle = ALIVE_COLOR;
    for (let row = 0; row < HEIGHT; row++) {
        for (let col = 0; col < WIDTH; col++) {
            const idx = row * WIDTH + col;
            if (cells[idx] === 1) {
                ctx.fillRect(
                    col * (CELL_SIZE + 1) + 1,
                    row * (CELL_SIZE + 1) + 1,
                    CELL_SIZE,
                    CELL_SIZE
                );
            }
        }
    }

    // Draw dead cells
    ctx.fillStyle = DEAD_COLOR;
    for (let row = 0; row < HEIGHT; row++) {
        for (let col = 0; col < WIDTH; col++) {
            const idx = row * WIDTH + col;
            if (cells[idx] === 0) {
                ctx.fillRect(
                    col * (CELL_SIZE + 1) + 1,
                    row * (CELL_SIZE + 1) + 1,
                    CELL_SIZE,
                    CELL_SIZE
                );
            }
        }
    }

    ctx.stroke();
}

main().catch(console.error);
