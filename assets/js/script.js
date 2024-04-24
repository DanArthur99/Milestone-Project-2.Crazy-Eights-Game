let player1 = [];
let pcPlayer = [];
let newShuffledDeckKey;

/**
 * The following function creates a new shuffled deck from the Deck of Cards API
 */
$(document).ready(function() {
    shuffleDeck(); // shuffles deck once document is ready
})

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
        .then(card => {
            $("#card-image").html(`
            <img src="${card.cards[0].image}" alt="${card.cards[0].value} of ${card.cards[0].suit}">`);
            console.log(card);
        });
};

