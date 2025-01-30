// script.js
document.addEventListener('DOMContentLoaded', () => {
    const rollBtn = document.getElementById('roll-btn');
    const dice = document.getElementById('dice');
    const turnIndicator = document.getElementById('turn-indicator');
    const board = document.querySelector('.board');

    let currentPlayer = 1;
    let diceValue = 0;

    // Initialize board cells
    for (let i = 0; i < 225; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        if (i === 0 || i === 14 || i === 210 || i === 224) {
            cell.classList.add('safe-cell');
        }
        board.appendChild(cell);
    }

    // Roll dice
    rollBtn.addEventListener('click', () => {
        diceValue = Math.floor(Math.random() * 6) + 1;
        dice.textContent = getDiceFace(diceValue);
        turnIndicator.textContent = `Player ${currentPlayer}'s Turn (Rolled ${diceValue})`;
        enableTokenSelection();
    });

    // Enable token selection
    function enableTokenSelection() {
        document.querySelectorAll('.token').forEach(token => {
            if (token.dataset.player == currentPlayer) {
                token.classList.add('selectable');
                token.addEventListener('click', handleTokenClick);
            }
        });
    }

    // Handle token click
    function handleTokenClick(e) {
        const token = e.target;
        alert(`Player ${currentPlayer} moved token ${token.dataset.token} by ${diceValue} steps!`);
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;
        resetTokenSelection();
    }

    // Reset token selection
    function resetTokenSelection() {
        document.querySelectorAll('.token').forEach(token => {
            token.classList.remove('selectable');
            token.removeEventListener('click', handleTokenClick);
        });
    }

    // Get dice face emoji
    function getDiceFace(value) {
        const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        return faces[value - 1];
    }
});
