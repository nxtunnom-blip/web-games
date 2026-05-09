const pongCanvas = document.getElementById('pongCanvas');
const pongCtx = pongCanvas.getContext('2d');
const playerScoreDisplay = document.getElementById('playerScore');
const computerScoreDisplay = document.getElementById('computerScore');

let playerPaddle = { x: 10, y: pongCanvas.height / 2 - 40, width: 10, height: 80 };
let computerPaddle = { x: pongCanvas.width - 20, y: pongCanvas.height / 2 - 40, width: 10, height: 80, velocity: 5 };
let ball = { x: pongCanvas.width / 2, y: pongCanvas.height / 2, radius: 8, velocityX: 5, velocityY: 5 };
let playerScore = 0;
let computerScore = 0;
let gameLoop;

const paddleSpeed = 6;

document.addEventListener('mousemove', (e) => {
    const rect = pongCanvas.getBoundingClientRect();
    playerPaddle.y = e.clientY - rect.top - playerPaddle.height / 2;
    if (playerPaddle.y < 0) playerPaddle.y = 0;
    if (playerPaddle.y + playerPaddle.height > pongCanvas.height) playerPaddle.y = pongCanvas.height - playerPaddle.height;
});

function startPongGame() {
    playerScore = 0;
    computerScore = 0;
    ball = { x: pongCanvas.width / 2, y: pongCanvas.height / 2, radius: 8, velocityX: 5, velocityY: 5 };
    playerScoreDisplay.textContent = playerScore;
    computerScoreDisplay.textContent = computerScore;
    clearInterval(gameLoop);
    gameLoop = setInterval(updatePongGame, 30);
}

function updatePongGame() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > pongCanvas.height) {
        ball.velocityY *= -1;
    }

    if (isColliding(ball, playerPaddle)) {
        ball.velocityX *= -1;
        ball.x = playerPaddle.x + playerPaddle.width + ball.radius;
    }

    if (isColliding(ball, computerPaddle)) {
        ball.velocityX *= -1;
        ball.x = computerPaddle.x - ball.radius;
    }

    if (computerPaddle.y + computerPaddle.height / 2 < ball.y) {
        computerPaddle.y += computerPaddle.velocity;
    } else {
        computerPaddle.y -= computerPaddle.velocity;
    }

    if (computerPaddle.y < 0) computerPaddle.y = 0;
    if (computerPaddle.y + computerPaddle.height > pongCanvas.height) computerPaddle.y = pongCanvas.height - computerPaddle.height;

    if (ball.x - ball.radius < 0) {
        computerScore++;
        computerScoreDisplay.textContent = computerScore;
        resetPongBall();
    } else if (ball.x + ball.radius > pongCanvas.width) {
        playerScore++;
        playerScoreDisplay.textContent = playerScore;
        resetPongBall();
    }

    drawPongGame();
}

function isColliding(circle, rect) {
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    return Math.hypot(circle.x - closestX, circle.y - closestY) < circle.radius;
}

function resetPongBall() {
    ball.x = pongCanvas.width / 2;
    ball.y = pongCanvas.height / 2;
    ball.velocityX = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.velocityY = (Math.random() - 0.5) * 8;
}

function drawPongGame() {
    pongCtx.fillStyle = '#000';
    pongCtx.fillRect(0, 0, pongCanvas.width, pongCanvas.height);

    pongCtx.fillStyle = '#fff';
    pongCtx.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);
    pongCtx.fillRect(computerPaddle.x, computerPaddle.y, computerPaddle.width, computerPaddle.height);

    pongCtx.beginPath();
    pongCtx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    pongCtx.fill();

    pongCtx.setLineDash([5, 5]);
    pongCtx.strokeStyle = '#fff';
    pongCtx.beginPath();
    pongCtx.moveTo(pongCanvas.width / 2, 0);
    pongCtx.lineTo(pongCanvas.width / 2, pongCanvas.height);
    pongCtx.stroke();
}
