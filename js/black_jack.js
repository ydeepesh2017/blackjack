document.querySelector("#blackjack-hit").addEventListener('click', blackjackHit);

document.querySelector("#blackjack-deal").addEventListener('click', blackjackDeal);

document.querySelector("#blackjack-stand").addEventListener('click', blackjackStand);


console.log("function added");

let blackjackGame = {
    'you': { 'div': '#your-box-id', 'score-div': '#your-score-result', 'score': 0 },
    'bot': { 'div': '#bot-box-id', 'score-div': '#bot-score-result', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    'cardsmap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [1, 11] },
    'win': 0,
    'lose': 0,
    'draw': 0,
    'hitActive': true,
    'standActive': false,
};

const you = blackjackGame['you'];
const bot = blackjackGame['bot'];

const hitsound = new Audio('sounds/swish.m4a');
const winsound = new Audio('sounds/cash.mp3');
const losesound = new Audio('sounds/aww.mp3');



function blackjackHit() {
    if (blackjackGame['hitActive'] == true) {
        showCard(you);
    }

    blackjackGame['standActive'] = true;

}

function showCard(activePlayer) {
    if (activePlayer['score'] <= 21) {
        let card_image = document.createElement('img');
        let ran_num = Math.floor(Math.random() * 13);
        card_image.src = 'images/images/' + blackjackGame['cards'][ran_num] + '.png';
        document.querySelector(activePlayer['div']).appendChild(card_image);
        hitsound.play();
        update_score(blackjackGame['cards'][ran_num], activePlayer)
    }
    // computeWinner();
}



function blackjackDeal() {
    if (blackjackGame['hitActive'] == false && blackjackGame['standActive'] == false) {



        // let winner = computeWinner();
        // showResult(winner);
        let playImage = document.querySelector("#your-box-id").querySelectorAll("img");
        for (let i = 0; i < playImage.length; i++) {
            playImage[i].remove();
        }

        let botImage = document.querySelector("#bot-box-id").querySelectorAll("img");
        for (let i = 0; i < botImage.length; i++) {
            botImage[i].remove();
        }

        you['score'] = 0;
        bot['score'] = 0;

        blackjackGame['hitActive'] = true;

        document.querySelector(you['score-div']).textContent = 0;
        document.querySelector(bot['score-div']).style.color = 'black';

        document.querySelector(bot['score-div']).textContent = 0;
        document.querySelector(you['score-div']).style.color = 'black';

        document.querySelector('#play').textContent = "Let's play";
        document.querySelector('#play').style.color = 'black';

    }

}

function update_score(card, user) {
    if (user['score'] < 20 && card == 'A') {
        user['score'] = user['score'] + blackjackGame['cardsmap'][card][1];

    } else if (user['score'] >= 20 && card == 'A') {
        user['score'] = user['score'] + blackjackGame['cardsmap'][card][0];

    } else {
        user['score'] = user['score'] + blackjackGame['cardsmap'][card];
    }

    if (user['score'] <= 21) {
        document.querySelector(user['score-div']).textContent = user['score'];
    } else {
        document.querySelector(user['score-div']).textContent = 'Bust!!';
        document.querySelector(user['score-div']).style.color = 'red';
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

async function blackjackStand() {
    while(blackjackGame['standActive']==true) {
        blackjackGame['hitActive'] = false;
        showCard(bot);
        if (bot['score'] > 16 || bot['score'] > you['score']) {
            blackjackGame['standActive'] = false;
            let winner = computeWinner();
            showResult(winner);
        }
        await sleep(1000);
    }
}

function computeWinner() {
    let winner;
    if (you['score'] <= 21) {
        if (you['score'] > bot['score'] || bot['score'] > 21) {
            console.log('winner');
            winner = you;
        } else if (you['score'] == bot['score']) {
            console.log('drow');
        } else if (bot['score'] > you['score']) {
            console.log('lose');
            winner = bot;
        }
    } else if (you['score'] > 21) {
        if (bot['score'] < 21) {
            console.log('lose');
            winner = bot;
        } else if (bot['score'] > 21) {
            console.log('drow');
        }
    }
    return winner;
}

function showResult(winner) {
    let text, textColor;
    // console.log(document.querySelector('#win'))
    // let win = document.querySelector('#win-score').textContent;
    // let lose = document.querySelector('#lose-score').textContent;
    // let drew = document.querySelector('#draw-score').textContent;

    if (winner == you) {
        winsound.play();
        text = 'Winner';
        textColor = 'green';
        blackjackGame['win']++;
    } else if (winner == bot) {
        losesound.play();
        text = 'Lose';
        textColor = 'red';
        blackjackGame['lose']++;

    } else {
        losesound.play();
        text = 'drow';
        textColor = 'blue';
        blackjackGame['draw']++;
    }

    document.querySelector('#play').textContent = text;
    document.querySelector('#play').style.color = textColor;

    document.querySelector('#win-score').textContent = blackjackGame['win'];
    document.querySelector('#lose-score').textContent = blackjackGame['lose'];
    document.querySelector('#draw-score').textContent = blackjackGame['draw'];
}


