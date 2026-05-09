const flappyCanvas = document.getElementById('flappyCanvas');
const flappyCtx = flappyCanvas.getContext('2d');
const flappyScoreDisplay = document.getElementById('flappyScore');
const flappyHighScoreDisplay = document.getElementById('flappyHighScore');
const flappyStartBtn = document.getElementById('flappyStartBtn');

let bird = { x: 50, y: flappyCanvas.height / 2, width: 20, height: 20, velocity: 0 };
let pipes = [];
let flappyScore = 0;
let flappyHighScore = localStorage.getItem('flappyHighScore') || 0;
let gameRunning = false;
let gameLoop;

flappyHighScoreDisplay.textContent = flappyHighScore;

const gravity = 0.6;
const flapPower = -15;
const pipeGap = 100;
const pipeWidth = 80;

document.addEventListener('click', flap);
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        e.preventDefault();
        flap();
    }
});

function flap() {
    if (gameRunning) {
        bird.velocity = flapPower;
    }
}

function startFlappyGame() {
    gameRunning = true;
    bird = { x: 50, y: flappyCanvas.height / 2, width: 20, height: 20, velocity: 0 };
    pipes = [];
    flappyScore = 0;
    flappyScoreDisplay.textContent = flappyScore;
    flappyStartBtn.disabled = true;
    gameLoop = setInterval(updateFlappyGame, 30);
}

function updateFlappyGame() {
    bird.velocity += gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > flappyCanvas.height || bird.y < 0) {
        endFlappyGame();
        return;
    }

    if (Math.random() < 0.02) {
        const gapY = Math.random() * (flappyCanvas.height - pipeGap - 100) + 50;
        pipes.push({ x: flappyCanvas.width, topHeight: gapY, scored: false });
    }

    pipes.forEach((pipe, index) => {
        pipe.x -= 5;
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
        }

        if (!pipe.scored && pipe.x < bird.x) {
            flappyScore++;
            flappyScoreDisplay.textContent = flappyScore;
            pipe.scored = true;
        }

        if (checkFlappyCollision(pipe)) {
            endFlappyGame();
            return;
        }
    });

    drawFlappyGame();
}

function checkFlappyCollision(pipe) {
    const bottomPipeY = pipe.topHeight + pipeGap;
    return bird.x < pipe.x + pipeWidth &&
           bird.x + bird.width > pipe.x &&
           (bird.y < pipe.topHeight || bird.y + bird.height > bottomPipeY);
}

function drawFlappyGame() {
    flappyCtx.fillStyle = '#87CEEB';
    flappyCtx.fillRect(0, 0, flappyCanvas.width, flappyCanvas.height);

    flappyCtx.fillStyle = '#FFD700';
    flappyCtx.fillRect(bird.x, bird.y, bird.width, bird.height);

    flappyCtx.fillStyle = '#228B22';
    pipes.forEach(pipe => {
        flappyCtx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        flappyCtx.fillRect(pipe.x, pipe.topHeight + pipeGap, pipeWidth, flappyCanvas.height);
    });
}

function endFlappyGame() {
    gameRunning = false;
    clearInterval(gameLoop);
    flappyStartBtn.disabled = false;
    if (flappyScore > flappyHighScore) {
        flappyHighScore = flappyScore;
        flappyHighScoreDisplay.textContent = flappyHighScore;
        localStorage.setItem('flappyHighScore', flappyHighScore);
    }
    flappyCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    flappyCtx.fillRect(0, 0, flappyCanvas.width, flappyCanvas.height);
    flappyCtx.fillStyle = '#fff';
    flappyCtx.font = '30px Arial';
    flappyCtx.textAlign = 'center';
    flappyCtx.fillText('Game Over!', flappyCanvas.width / 2, flappyCanvas.height / 2 - 20);
    flappyCtx.font = '20px Arial';
    flappyCtx.fillText(`Score: ${flappyScore}`, flappyCanvas.width / 2, flappyCanvas.height / 2 + 20);
}
