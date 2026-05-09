const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let direction = { x: 0, y: 0 };
let nextDirection = { x: 0, y: 0 };
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameActive = false;
let gamePaused = false;
let gameLoop;

highScoreDisplay.textContent = highScore;

const gridSize = 20;

document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
        handleDirection(e.key);
    }
});

function handleDirection(key) {
    if (key === 'ArrowUp' || key === 'w') nextDirection = { x: 0, y: -1 };
    else if (key === 'ArrowDown' || key === 's') nextDirection = { x: 0, y: 1 };
    else if (key === 'ArrowLeft' || key === 'a') nextDirection = { x: -1, y: 0 };
    else if (key === 'ArrowRight' || key === 'd') nextDirection = { x: 1, y: 0 };
}

function startGame() {
    if (!gameActive) {
        gameActive = true;
        gamePaused = false;
        snake = [{ x: 10, y: 10 }];
        direction = { x: 0, y: 0 };
        nextDirection = { x: 0, y: 0 };
        score = 0;
        scoreDisplay.textContent = score;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        generateFood();
        gameLoop = setInterval(update, 100);
    }
}

function togglePause() {
    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
}

function update() {
    if (!gamePaused) {
        direction = nextDirection;
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

        if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
            endGame();
            return;
        }

        for (let segment of snake) {
            if (head.x === segment.x && head.y === segment.y) {
                endGame();
                return;
            }
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreDisplay.textContent = score;
            generateFood();
        } else {
            snake.pop();
        }
    }

    draw();
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff00';
    for (let segment of snake) {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    }

    ctx.fillStyle = '#ff0000';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function endGame() {
    gameActive = false;
    clearInterval(gameLoop);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
        localStorage.setItem('snakeHighScore', highScore);
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
}
