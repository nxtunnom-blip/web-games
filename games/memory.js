const emojis = ['🍕', '🍔', '🍟', '🌭', '🍗', '🍖', '🌮', '🌯'];
let cards = [];
let flipped = [];
let matched = 0;
let moves = 0;
let gameActive = true;

function initMemoryGame() {
    cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    const board = document.getElementById('memory-board');
    board.innerHTML = '';
    flipped = [];
    matched = 0;
    moves = 0;
    gameActive = true;
    document.getElementById('moves').textContent = moves;
    document.getElementById('matched').textContent = matched;

    cards.forEach((emoji, index) => {
        const card = document.createElement('button');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        card.textContent = '?';
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });
}

function flipCard(e) {
    if (!gameActive || e.target.classList.contains('matched')) return;
    if (flipped.length < 2 && !e.target.classList.contains('flipped')) {
        e.target.textContent = e.target.dataset.emoji;
        e.target.classList.add('flipped');
        flipped.push(e.target);

        if (flipped.length === 2) {
            moves++;
            document.getElementById('moves').textContent = moves;
            checkMatch();
        }
    }
}

function checkMatch() {
    const [card1, card2] = flipped;
    if (card1.dataset.emoji === card2.dataset.emoji) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        card1.disabled = true;
        card2.disabled = true;
        matched++;
        document.getElementById('matched').textContent = matched;
        flipped = [];
        if (matched === emojis.length) {
            setTimeout(() => alert(`You Won! Completed in ${moves} moves!`), 300);
            gameActive = false;
        }
    } else {
        setTimeout(() => {
            card1.textContent = '?';
            card2.textContent = '?';
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flipped = [];
        }, 800);
    }
}

function resetMemoryGame() {
    initMemoryGame();
}

initMemoryGame();
