// Variáveis do jogo
let deckId, turn = 0, mariaScore = 0, joaquimScore = 0;
let gameOver = false;
const maxCards = 10;

// Elementos HTML
const messageElement = document.getElementById('message');
const topCardImg = document.getElementById('top-card');
const roundCounterElement = document.getElementById('round-counter');
const restartButton = document.getElementById('restart');

// Contêineres dinâmicos para as cartas
// TO-DO: corrigir bug
const mariaCardsContainer = document.getElementById('maria-cards');
const joaquimCardsContainer = document.getElementById('joaquim-cards');

// Pontuação dinâmica
const mariaScoreDisplay = document.getElementById('maria-score');
const joaquimScoreDisplay = document.getElementById('joaquim-score');

// Função para inicializar o jogo
async function initGame() {
    const response = await fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1&jokers_enabled=true');
    const data = await response.json();
    deckId = data.deck_id;
    resetGame();
}

// Função para pegar uma nova carta
async function drawCard() {
    if (gameOver || turn >= maxCards)
    {
        return; // Se o jogo já acabou ou o limite de cartas foi alcançado
    }

    const response = await fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    const data = await response.json();

    if (data.cards.length === 0)
    {
        return;
    }

    const card = data.cards[0];
    topCardImg.src = card.image;
    topCardImg.style.display = 'block';

    // Atualiza o contador de rodadas
    roundCounterElement.textContent = `Rodada: ${turn + 1}`;

    // Verifica se a carta é um coringa
    if (card.value === 'JOKER')
    {
        const winner = turn % 2 === 0 ? 'Joaquim' : 'Maria';
        const loser = turn % 2 === 0 ? 'Maria' : 'Joaquim';

        messageElement.textContent = `${winner} ganhou! ${loser} pegou um coringa!`;
        gameOver = true;
        restartButton.style.display = 'block';
        return;
    }

    // Verifica de quem é a jogada
    if (turn % 2 === 0)
    {
        // Jogada de Maria
        //mariaCardsContainer.innerHTML += `<img src="${card.image}" alt="Carta da Maria" style="width: 200px; height: 280px;">`; 
        mariaScore += getCardValue(card);
        mariaScoreDisplay.textContent = mariaScore; // Atualiza a pontuação
    }
    else
    {
        // Jogada de Joaquim
        //joaquimCardsContainer.innerHTML += `<img src="${card.image}" alt="Carta do Joaquim" style="width: 200px; height: 280px;">`;
        joaquimScore += getCardValue(card);
        joaquimScoreDisplay.textContent = joaquimScore; // Atualiza a pontuação
    }

    turn++;

    if (turn === maxCards)
    {
        declareWinner();
        gameOver = true;
    }
}

// Função para resetar o jogo
function resetGame() {
    turn = 0;
    mariaScore = 0;
    joaquimScore = 0;
    gameOver = false;
    mariaCardsContainer.innerHTML = '';
    joaquimCardsContainer.innerHTML = '';
    mariaScoreDisplay.textContent = '0';
    joaquimScoreDisplay.textContent = '0';
    messageElement.textContent = '';
    roundCounterElement.textContent = 'Rodada: 0';
    restartButton.style.display = 'none';
    topCardImg.src = 'https://www.deckofcardsapi.com/static/img/back.png';
    topCardImg.style.display = 'block';
}

// Função para calcular o valor das cartas
function getCardValue(card) {
    switch (card.value) {
        case 'ACE':
            return 1;
        case 'JACK':
            return 11;
        case 'QUEEN':
            return 12;
        case 'KING':
            return 13;
        default:
            return parseInt(card.value);
    }
}

// Função para declarar o vencedor
function declareWinner() {
    let message;

    if (mariaScore > joaquimScore)
    {
        message = `Maria ganhou com ${mariaScore} pontos!`;
    }
    else if (joaquimScore > mariaScore)
    {
        message = `Joaquim ganhou com ${joaquimScore} pontos!`;
    }
    else
    {
        message = 'Empate!';
    }

    messageElement.textContent = message;
    gameOver = true;
    restartButton.style.display = 'block';
}

// Adiciona eventos (cliques)
document.getElementById('card-pile').addEventListener('click', drawCard);
restartButton.addEventListener('click', initGame);

// Inicializa o jogo
initGame();
