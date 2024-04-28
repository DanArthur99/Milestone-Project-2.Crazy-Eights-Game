let shuffledPile = [];
let playerHand = [];
let discardPile = [];

let discardDeckSize;
let deckSize = 52;

let cardChoice;
let topCard;

let randomizer;
let newShuffledDeckKey;


/**
 * jQuery code that calls the onClick functions via Event Listners
 */
$(document).ready(function () {

    $("#decision-text").hide();
    $(".button-container").hide();

    shuffleDeck(); // shuffles deck once document is ready   

    $(document).on("click", ".clickable", function () {
        cardChoiceBuffer($(this).attr("id"));
        $(this).addClass("card-choice");
        $("#decision-text").show();
        $(".button-container").show();
        $(document).off("click", ".clickable");
    });

    $("#no").on("click", function () {
        cardChoice = undefined;
        $(".card-image").removeClass("card-choice");
        $("#decision-text").hide();
        $(".button-container").hide();
        $(document).on("click", ".clickable", function () {
            cardChoiceBuffer($(this).attr("id"));
            $(this).addClass("card-choice");
            $("#decision-text").show();
            $(".button-container").show();
            $(document).off("click", ".clickable");
        });
    });
    $("#yes").on("click", function () {
        addToPile();
        $(".card-choice").remove();
        $("#decision-text").hide();
        $(".button-container").hide();
        $(document).on("click", ".clickable", function () {
            cardChoiceBuffer($(this).attr("id"));
            $(this).addClass("card-choice");
            $("#decision-text").show();
            $(".button-container").show();
            $(document).off("click", ".clickable");
        });


    })
});


/**
 * The following functions fetch the deck data from the Deck of Cards API, then "draws" all of these cards into a ShuffledPile array. The players hand is then drawn by randomly selecting
 * an index of that array, pushing that item to the playerHand array, then deleting that object from the ShuffledPile array. The image of the card is then displayed to the DOM by obtaining the image
 * data inside the card object, and manipulating the HTML to include an <img> with this data as it's source (src).
 */

const shuffleDeck = async () => {
    fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
        .then(response => response.json())
        .then(response => {
            newShuffledDeckKey = response.deck_id;
            fetch(`https://www.deckofcardsapi.com/api/deck/${newShuffledDeckKey}/draw/?count=52`)
                .then(response => response.json())
                .then(deck => {
                    for (let i = 0; i < 52; i++) {
                        shuffledPile.push({ "value": deck.cards[i].value, "suit": deck.cards[i].suit, "image": deck.cards[i].image })
                    };
                    dealInitialHand();
                });
        });
};

const dealInitialHand = () => {
    for (let i = 0; i < 8; i++) {
        randomizer = Math.floor(Math.random() * deckSize);
        playerHand.push(shuffledPile[randomizer]);
        shuffledPile.splice(randomizer, 1)
        deckSize -= 1;
    };
    randomizer = Math.floor(Math.random() * deckSize);
    topCard = shuffledPile[randomizer];
    $(".card-image-pile").html(`
    <img src="${topCard.image}" width="113" height="157">
    `);
    randomizer = undefined;
    console.log("Current Pile")
    console.log(shuffledPile);
    console.log("Current Player Hand");
    console.log(playerHand);
    console.log("Current Top Card");
    console.log(topCard);

    displayHand(playerHand);
};
const displayHand = (hand) => {
    for (let card of hand) {
        if (card.value == "8" || ((card.suit === topCard.suit) || (card.value === topCard.value))) {
            $(".player-hand").append(`
        <div class="col-1 card-image clickable" id="${card.value}-of-${card.suit}">
        <img src="${card.image}" width="113" height="157">
        </div>
        `);
        } else {
            $(".player-hand").append(`
        <div class="col-1 card-image not-clickable" id="${card.value}-of-${card.suit}">
        <img src="${card.image}" width="113" height="157">
        </div>
        `);
        };

    };
};



const drawCard = () => {
    if (shuffledPile.length < 1) {
        totalLoopReps = discardPile.length
        discardDeckSize = discardPile.length;
        for (let i = 0; i < totalLoopReps; i++) {
            randomizer = Math.floor(Math.random() * discardDeckSize);
            shuffledPile.push(discardPile[randomizer]);
            discardPile.splice(randomizer, 1);
            discardDeckSize -= 1;
        };
        randomizer = undefined;
        randomFunction();
    } else {
        randomFunction();
    };
    console.log("Current Deck size");
    console.log(shuffledPile);
    console.log("Current Player Hand");
    console.log(playerHand);
};

const randomFunction = () => {
    deckSize = shuffledPile.length;
    randomizer = Math.floor(Math.random() * deckSize);
    playerHand.push(shuffledPile[randomizer]);
    shuffledPile.splice(randomizer, 1);
    deckSize -= 1;
    if (playerHand[playerHand.length - 1].value == "8" || ((playerHand[playerHand.length - 1].value === topCard.value) || (playerHand[playerHand.length - 1].suit === topCard.suit))) {
        $(".player-hand").append(`
        <div class="col-1 card-image clickable" id="${playerHand[playerHand.length - 1].value}-of-${playerHand[playerHand.length - 1].suit}">
        <img src="${playerHand[playerHand.length - 1].image}" width="113" height="157">
        </div>
        `);
    } else {
        $(".player-hand").append(`
        <div class="col-1 card-image not-clickable" id="${playerHand[playerHand.length - 1].value}-of-${playerHand[playerHand.length - 1].suit}">
        <img src="${playerHand[playerHand.length - 1].image}" width="113" height="157">
        </div>
        `);
    };

    randomizer = undefined;
};
const cardChoiceBuffer = (string) => {
    let words = [];
    for (let word of string.split("-")) {
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
        console.log("Current Top Card");
        console.log(topCard);
    } else {
        discardPile.push(topCard);
        topCard = cardChoice;
        // Console testers
        console.log("Current Top Card");
        console.log(topCard);
        console.log("Current Discard Pile")
        console.log(discardPile);
    };
    let index = playerHand.indexOf(topCard);
    playerHand.splice(index, 1);

    $(".card-image-pile").html(`
    <img src="${topCard.image}" width="113" height="157">
    `);
    cardChoice = undefined;
    $(".player-hand").html("");
    displayHand(playerHand);
    console.log("Current player hand");
    console.log(playerHand);
};