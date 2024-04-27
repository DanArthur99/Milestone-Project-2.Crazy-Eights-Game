let shuffledPile = [];
let playerHand = [];
let discardPile = [];
let deckSize = 52;

let cardChoice;
let topCard;

let randomizer;
let newShuffledDeckKey;


/**
 * The following function creates a new shuffled deck from the Deck of Cards API
 */
$(document).ready(function () {

    $("#decision-text").hide();
    $(".button-container").hide();

    shuffleDeck(); // shuffles deck once document is ready   

    $(document).on("click", ".card-image", function() {
        cardChoiceBuffer($(this).attr("id"));
        $(this).addClass("card-choice");
        $("#decision-text").show();
        $(".button-container").show();
         $(document).off("click", ".card-image");
    });
    
    $("#no").on("click", function () {
        cardChoice = undefined;
        $(".card-image").removeClass("card-choice");
        $("#decision-text").hide();
        $(".button-container").hide();
        $(document).on("click", ".card-image", function() {
            cardChoiceBuffer($(this).attr("id"));
            $(this).addClass("card-choice");
            $("#decision-text").show();
            $(".button-container").show();
            $(document).off("click", ".card-image");
        });
    });
    $("#yes").on("click", function() {
        addToPile();
        $(".card-choice").remove();
        $("#decision-text").hide();
        $(".button-container").hide();
        $(document).on("click", ".card-image", function() {
            cardChoiceBuffer($(this).attr("id"));
            $(this).addClass("card-choice");
            $("#decision-text").show();
            $(".button-container").show();
            $(document).off("click", ".card-image");
        });
        

    })
});


const shuffleDeck = async () => {
    fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
        .then(response => response.json())
        .then(response => {
            newShuffledDeckKey = response.deck_id;
            fetch(`https://www.deckofcardsapi.com/api/deck/${newShuffledDeckKey}/draw/?count=52`)
            .then(response => response.json())
            .then(deck => {
                for (let i = 0; i < 52; i++) {
                    shuffledPile.push({"value": deck.cards[i].value, "suit": deck.cards[i].suit, "image": deck.cards[i].image})
                };
            console.log(shuffledPile);
            dealInitialHand();
        });
    });
};


const dealInitialHand = () => {
    for (let i = 0; i < 8; i++) {
        randomizer = Math.floor(Math.random() * deckSize);
        playerHand.push(shuffledPile[randomizer]);
        shuffledPile.splice(randomizer, 1)
        console.log(randomizer);
        deckSize -=1;
    };
    console.log(playerHand);
    console.log(shuffledPile);
    console.log(deckSize);
    randomizer = undefined;
    displayInitialHand(playerHand);
};

const displayInitialHand = (hand) => {
    for (let card of hand) {
        $(".player-hand").append(`
        <div class="col-1 card-image" id="${card.value} of ${card.suit}">
        <img src="${card.image}" width="113" height="157">
        </div>
        `);
    }
}




const drawCard = () => {
    randomizer = Math.floor(Math.random() * deckSize);
    playerHand.push(shuffledPile[randomizer]);
    shuffledPile.splice(randomizer, 1)
    deckSize -=1;
    console.log(playerHand);
    console.log(shuffledPile);
    console.log(deckSize);
    $(".player-hand").append(`
        <div class="col-1 card-image" id="${playerHand[playerHand.length-1].value} of ${playerHand[playerHand.length-1].suit}">
        <img src="${playerHand[playerHand.length-1].image}" width="113" height="157">
        </div>
        `);
    randomizer = undefined;
    
};


const cardChoiceBuffer = (string) => {
let words = [];
for (let word of string.split(" ")) {
    words.push(word);
};
let buffer = playerHand.filter(card => {
    return (card.value === words[0] && card.suit === words[2])
});
cardChoice = buffer[0];
};


const addToPile = () => {
    if (topCard == undefined) {
        topCard = cardChoice;
        console.log(topCard);
    } else {
        discardPile.push(topCard);
        topCard = cardChoice;
        console.log(topCard);
        console.log(discardPile);
    }
    let index = playerHand.indexOf(topCard);
    playerHand.splice(index, 1);
    
    $(".card-image-pile").html(`
    <img src="${topCard.image}" width="113" height="157">
    `)
    cardChoice = undefined;
    console.log(playerHand);
}