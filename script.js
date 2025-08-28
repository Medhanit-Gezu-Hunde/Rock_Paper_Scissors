// Game State
let gameState = {
    playerScore: 0,
    computerScore: 0,
    currentRound: 0,
    maxRounds: 5,
    playerChoice: null,
    computerChoice: null,
    result: null,
    phase: 'setup', // 'setup', 'playing', 'result', 'gameOver'
    finalResult: null,
    playerName: "Player", // Default name (updated from input)
};

// Game choices
const choices = ['rock', 'paper', 'scissors'];

// Choice emojis
const choiceEmojis = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️'
};

// Result messages
const resultMessages = {
    win: "You Win! 🎉",
    lose: "You Lose 😔",
    draw: "It's a Draw! 🤝"
};

const finalResultMessages = {
    win: "🏆 Congratulations <strong>{player}</strong>! You Won the Game! 🏆",
    lose: "💔 Sorry <strong>{player}</strong>, You Lost! Better Luck Next Time 💔",
    draw: "🤝 It's a Tie <strong>{player}</strong>! Great Game! 🤝"
};

// DOM Elements
const setupScreen = document.getElementById('setupScreen');
const gameScreen = document.getElementById('gameScreen');
const choiceSection = document.getElementById('choiceSection');
const resultSection = document.getElementById('resultSection');
const gameOverSection = document.getElementById('gameOverSection');
const backButton = document.getElementById('backButton');

// Score elements
const playerScoreEl = document.getElementById('playerScore');
const computerScoreEl = document.getElementById('computerScore');
const currentRoundEl = document.getElementById('currentRound');
const maxRoundsEl = document.getElementById('maxRounds');
const progressFill = document.getElementById('progressFill');

// Result elements
const playerChoiceEmoji = document.getElementById('playerChoiceEmoji');
const computerChoiceEmoji = document.getElementById('computerChoiceEmoji');
const resultMessage = document.getElementById('resultMessage');
const finalResultMessage = document.getElementById('finalResultMessage');

// Leaderboard elements
const leaderboardSection = document.getElementById("leaderboardSection");
const leaderboardBody = document.getElementById("leaderboardBody");
const viewLeaderboardBtn = document.getElementById("viewLeaderboardBtn");

// Utility Functions
function getRandomChoice() {
    return choices[Math.floor(Math.random() * choices.length)];
}

function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) return 'draw';
    
    const winConditions = {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper',
    };
    
    return winConditions[playerChoice] === computerChoice ? 'win' : 'lose';
}

function updateScoreDisplay() {
    playerScoreEl.textContent = gameState.playerScore;
    computerScoreEl.textContent = gameState.computerScore;
    currentRoundEl.textContent = gameState.currentRound;
    maxRoundsEl.textContent = gameState.maxRounds;
    
    const progress = (gameState.currentRound / gameState.maxRounds) * 100;
    progressFill.style.width = `${progress}%`;
}

function showScreen(screenName) {
    setupScreen.classList.remove('active');
    gameScreen.classList.remove('active');
    
    if (screenName === 'setup') {
        setupScreen.classList.add('active');
    } else if (screenName === 'game') {
        gameScreen.classList.add('active');
    }
}

function showGameContent(contentName) {
    choiceSection.classList.add('hidden');
    resultSection.classList.add('hidden');
    gameOverSection.classList.add('hidden');
    backButton.classList.add('hidden');
    leaderboardSection.classList.add("hidden");
    
    if (contentName === 'choice') {
        choiceSection.classList.remove('hidden');
        backButton.classList.remove('hidden');
    } else if (contentName === 'result') {
        resultSection.classList.remove('hidden');
    } else if (contentName === 'gameOver') {
        gameOverSection.classList.remove('hidden');
    } else if (contentName === 'leaderboard') {
        leaderboardSection.classList.remove("hidden");
    }
}

function resetChoiceButtons() {
    const choiceButtons = document.querySelectorAll('.choice-btn');
    choiceButtons.forEach(btn => {
        btn.classList.remove('selected', 'result-win', 'result-lose', 'result-draw');
        btn.disabled = false;
    });
}

function highlightPlayerChoice(choice, result) {
    const choiceButtons = document.querySelectorAll('.choice-btn');
    choiceButtons.forEach(btn => {
        if (btn.classList.contains(`${choice}-btn`)) {
            btn.classList.add('selected');
            if (result) {
                btn.classList.add(`result-${result}`);
            }
        }
        btn.disabled = true;
    });
}

// Game Functions
function startGame(rounds) {
    const playerNameInput = document.getElementById("playerNameInput");
    gameState.playerName = playerNameInput?.value.trim() || "Player";

    gameState = {
        ...gameState,
        maxRounds: rounds,
        playerScore: 0,
        computerScore: 0,
        currentRound: 0,
        phase: 'playing',
        finalResult: null
    };
    
    showScreen('game');
    showGameContent('choice');
    updateScoreDisplay();
    resetChoiceButtons();
}

function makeChoice(choice) {
    if (gameState.phase !== 'playing') return;
    
    const computerChoice = getRandomChoice();
    const result = determineWinner(choice, computerChoice);
    
    gameState.playerChoice = choice;
    gameState.computerChoice = computerChoice;
    gameState.result = result;
    gameState.currentRound += 1;
    
    if (result === 'win') {
        gameState.playerScore += 1;
    } else if (result === 'lose') {
        gameState.computerScore += 1;
    }
    
    const isGameOver = gameState.currentRound >= gameState.maxRounds;
    
    if (isGameOver) {
        if (gameState.playerScore > gameState.computerScore) {
            gameState.finalResult = 'win';
            saveToLeaderboard(gameState.playerName, gameState.playerScore);
        } else if (gameState.computerScore > gameState.playerScore) {
            gameState.finalResult = 'lose';
        } else {
            gameState.finalResult = 'draw';
        }
        gameState.phase = 'gameOver';
    } else {
        gameState.phase = 'result';
    }
    
    highlightPlayerChoice(choice, result);
    updateScoreDisplay();
    showResult();
    
    if (isGameOver) {
        setTimeout(() => {
            showGameOver();
        }, 2500);
    } else {
        setTimeout(() => {
            nextRound();
        }, 2500);
    }
}

function showResult() {
    playerChoiceEmoji.textContent = choiceEmojis[gameState.playerChoice];
    computerChoiceEmoji.textContent = choiceEmojis[gameState.computerChoice];
    resultMessage.textContent = resultMessages[gameState.result];
    resultMessage.className = `result-message result-${gameState.result}`;
    
    showGameContent('result');
}

function showGameOver() {
    const msgTemplate = finalResultMessages[gameState.finalResult];
    finalResultMessage.innerHTML = msgTemplate.replace("{player}", gameState.playerName);
    finalResultMessage.className = `final-result-message result-${gameState.finalResult}`;
    
    showGameContent('gameOver');
}

function nextRound() {
    gameState.phase = 'playing';
    gameState.playerChoice = null;
    gameState.computerChoice = null;
    gameState.result = null;
    
    showGameContent('choice');
    resetChoiceButtons();
}

function playAgain() {
    gameState = {
        ...gameState,
        playerScore: 0,
        computerScore: 0,
        currentRound: 0,
        phase: 'playing',
        finalResult: null,
        playerChoice: null,
        computerChoice: null,
        result: null
    };
    
    showGameContent('choice');
    updateScoreDisplay();
    resetChoiceButtons();
}

function newGame() {
    gameState = {
        playerScore: 0,
        computerScore: 0,
        currentRound: 0,
        maxRounds: 5,
        playerChoice: null,
        computerChoice: null,
        result: null,
        phase: 'setup',
        finalResult: null,
        playerName: "Player"
    };
    
    showScreen('setup');
}

function saveToLeaderboard(name, score) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function renderLeaderboard() {
    leaderboardBody.innerHTML = "";
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.forEach((entry, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.score}</td>
        `;
        leaderboardBody.appendChild(row);
    });
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', function() {
    showScreen('setup');

    if (viewLeaderboardBtn) {
        viewLeaderboardBtn.addEventListener("click", () => {
            renderLeaderboard();
            showGameContent("leaderboard");
        });
    }
});

