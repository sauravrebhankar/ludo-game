let currentPlayer = 1;
let diceResult = 0;
let tokens = document.querySelectorAll('.token');
const positions = createPositions();

function createPositions() {
    const positions = [];
    const boardSize = 500;
    const pathWidth = 350;
    
    // Generate positions for the circular path
    for(let i = 0; i < 56; i++) {
        const angle = (i / 56) * Math.PI * 2;
        const x = Math.cos(angle) * pathWidth/2;
        const y = Math.sin(angle) * pathWidth/2;
        positions.push({x: boardSize/2 + x, y: boardSize/2 + y});
    }
    return positions;
}

function rollDice() {
    if(diceResult !== 0) return;
    
    const dice = document.getElementById('dice');
    dice.style.animation = 'dice-shake 0.5s 3';
    
    setTimeout(() => {
        diceResult = Math.floor(Math.random() * 6) + 1;
        dice.textContent = diceResult;
        dice.style.animation = '';
        enableMovableTokens();
    }, 1500);
}

function enableMovableTokens() {
    tokens.forEach(token => {
        const isCurrentPlayer = parseInt(token.dataset.player) === currentPlayer;
        const position = parseInt(token.dataset.position);
        
        if(isCurrentPlayer) {
            if(position === 0 && diceResult === 6) {
                token.style.cursor = 'pointer';
                token.onclick = handleTokenClick;
            }
            else if(position > 0) {
                token.style.cursor = 'pointer';
                token.onclick = handleTokenClick;
            }
        }
    });
}

function handleTokenClick(e) {
    const token = e.target;
    const currentPosition = parseInt(token.dataset.position);
    let newPosition = currentPosition + diceResult;
    
    if(currentPosition === 0 && diceResult !== 6) return;
    
    if(newPosition > 56) return;
    
    // Move token
    if(currentPosition === 0) newPosition = 1; // Exit base
    
    // Check for collisions
    tokens.forEach(otherToken => {
        if(otherToken !== token && 
           parseInt(otherToken.dataset.position) === newPosition &&
           otherToken.dataset.player !== token.dataset.player) {
            otherToken.dataset.position = '0';
            updateTokenPosition(otherToken);
        }
    });
    
    token.dataset.position = newPosition.toString();
    updateTokenPosition(token);
    
    // Check winning condition
    if(newPosition === 56) {
        const playerTokens = [...tokens].filter(t => 
            t.dataset.player === token.dataset.player
        );
        if(playerTokens.every(t => parseInt(t.dataset.position) === 56)) {
            setTimeout(() => {
                alert(Player ${currentPlayer} wins!);
                resetGame();
            }, 100);
        }
    }
    
    diceResult = 0;
    document.getElementById('dice').textContent = '🎲';
    switchPlayer();
}

function updateTokenPosition(token) {
    const position = parseInt(token.dataset.position);
    if(position === 0) {
        // Return to base
        const base = token.classList.contains('red') ? 
            {x: '25%', y: '25%'} : {x: '75%', y: '75%'};
        token.style.left = base.x;
        token.style.top = base.y;
    } else {
        const pos = positions[position - 1];
        token.style.left = pos.x + 'px';
        token.style.top = pos.y + 'px';
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    document.getElementById('player-turn').textContent = 
        Player ${currentPlayer}'s Turn;
    tokens.forEach(token => {
        token.style.cursor = 'default';
        token.onclick = null;
    });
}

function resetGame() {
    tokens.forEach(token => {
        token.dataset.position = '0';
        updateTokenPosition(token);
    });
    currentPlayer = 1;
    document.getElementById('player-turn').textContent = "Player 1's Turn";
}

// Initialize token positions
tokens.forEach(updateTokenPosition);
