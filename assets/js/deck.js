
let player1 = [];
let pcPlayer = [];
let newShuffledDeckKey;

$("#start-game").addEventListener("submit", startGame)

/**
 * The following function creates a new shuffled deck from the Deck of Cards API
 */
const shuffleDeck = () => {
    fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then(response => response.json())
    .then(response => {
        newShuffledDeckKey = response.deck_id;
        console.log(response);
    });
};

const dealCard = () => {
    fetch(`https://www.deckofcardsapi.com/api/deck/${newShuffledDeckKey}/draw/?count=1`)
    .then(response => response.json())
    .then(card => console.log(card));
};

const startGame = (event) => {
    shuffleDeck();
}


//const startNewGame = () => {
    shuffleDeck();

//};
