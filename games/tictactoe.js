let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cells = document.querySelectorAll('.cell');

cells.forEach(cell => {
    cell.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        if (board[index] === '' && gameActive) {
            board[index] = currentPlayer;
            e.target.textContent = currentPlayer;
            e.target.disabled = true;
            checkWinner();
            if (gameActive && currentPlayer === 'X') {
                currentPlayer = 'O';
                document.getElementById('status').textContent = 'Computer Turn (O)';
                setTimeout(computerMove, 500);
            }
        }
    });
});

function computerMove() {
    let emptyIndices = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    if (emptyIndices.length > 0) {
        let randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        board[randomIndex] = 'O';
        document.querySelector(`[data-index="${randomIndex}"]`).textContent = 'O';
        document.querySelector(`[data-index="${randomIndex}"]`).disabled = true;
        checkWinner();
        if (gameActive) {
            currentPlayer = 'X';
            document.getElementById('status').textContent = 'Your Turn (X)';
        }
    }
}

function checkWinner() {
    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            document.getElementById('status').textContent = `${board[a]} Wins! 🎉`;
            gameActive = false;
            return;
        }
    }
    if (!board.includes('')) {
        document.getElementById('status').textContent = "It's a Draw! 🤝";
        gameActive = false;
    }
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    document.getElementById('status').textContent = 'Your Turn (X)';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.disabled = false;
    });
}
