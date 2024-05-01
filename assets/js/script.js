let shuffledPile = [];
let playerHand = [];
let cp1Hand = [];
let cp2Hand = [];

let discardPile = [];
let currentPlayer;

let cpPlayablePile = [];

let playersArray = ["realPlayer", "cp1", "cp2"];

let deckSize = 52;

let cardChoice;
let topCard;

let randomizer;
let newShuffledDeckKey;

let arrayNumber = 0;

let realPlayerComplete = false;
let cp1Complete = false;
let cp2Complete = false;

/**
 * jQuery code that calls the onClick functions via Event Listners
 */
$(document).ready(function () {

    startGame();

});


/**
 * The following functions fetch the deck data from the Deck of Cards API, then "draws" all of these cards into a ShuffledPile array. The players hand is then drawn by randomly selecting
 * an index of that array, pushing that item to the playerHand array, then deleting that object from the ShuffledPile array. The image of the card is then displayed to the DOM by obtaining the image
 * data inside the card object, and manipulating the HTML to include an <img> with this data as it's source (src).
 */


const startGame = () => {
    $("#decision-text").hide();
    $(".button-container").hide();

    shuffleDeck(); // shuffles deck once document is ready 

    for (let i = 0; i < 8; i++) {
        $(".cp1").append(`
    <div class="col-1 face-down-image right">
    <img src="https://www.deckofcardsapi.com/static/img/back.png" width="113" height="157">
    </div>
    `);
        $(".cp2").append(`
    <div class="col-1 face-down-image" >
    <img src="https://www.deckofcardsapi.com/static/img/back.png" width="113" height="157">
    </div>
    `);
    }

    realPlayerTurn();
}

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
    for (let i = 0; i < 8; i++) {
        randomizer = Math.floor(Math.random() * deckSize);
        cp1Hand.push(shuffledPile[randomizer]);
        shuffledPile.splice(randomizer, 1)
        deckSize -= 1;
    };
    for (let i = 0; i < 8; i++) {
        randomizer = Math.floor(Math.random() * deckSize);
        cp2Hand.push(shuffledPile[randomizer]);
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
        for (let i = 0; i < discardPile.length; i++) {
            randomizer = Math.floor(Math.random() * discardPile.length);
            shuffledPile.push(discardPile[randomizer]);
            discardPile.splice(randomizer, 1);
        };
        randomFunction(currentPlayer);
    } else {
        randomFunction(currentPlayer);
    };
    console.log("Current Deck size");
    console.log(shuffledPile);
    console.log("Current Player Hand");
    console.log(playerHand);
};

const randomFunction = (cp) => {
    if (cp == "realPlayer") {
        randomizer = Math.floor(Math.random() * shuffledPile.length);
        playerHand.push(shuffledPile[randomizer]);
        shuffledPile.splice(randomizer, 1);
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
        realPlayerComplete = true;
        setTimeout(() => {
            cpTurn("cp1");
        }, 1000);
    } else if (cp == "cp1") {
        randomizer = Math.floor(Math.random() * shuffledPile.length);
        cp1Hand.push(shuffledPile[randomizer]);
        shuffledPile.splice(randomizer, 1);
        cp1Complete = true;
        setTimeout(() => {
            cpTurn("cp2");
        }, 1000);
    } else if (cp == "cp2") {
        randomizer = Math.floor(Math.random() * shuffledPile.length);
        cp2Hand.push(shuffledPile[randomizer]);
        shuffledPile.splice(randomizer, 1);
        cp2Complete = true;
        setTimeout(() => {
            realPlayerTurn();
        }, 1000)

    };

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
    console.log(cardChoice);
};

const addToPile = () => {
    $(".card-choice").remove();
    $("#decision-text").hide();
    $(".button-container").hide();
    if (topCard) {
        discardPile.push(topCard);
        topCard = cardChoice;
    } else {
        topCard = cardChoice;
    };
    if (playerHand.includes(topCard) == true && cp2Complete == false) {
        let index0 = playerHand.indexOf(topCard);
        playerHand.splice(index0, 1);
        console.log("Current Discard Pile")
        console.log(discardPile);
        console.log("Current Top Card");
        console.log(topCard);
    }
    realPlayerComplete = true;
    if (topCard == undefined) {
        console.log("Couldnt load card");
    } else {
        $(".card-image-pile").html(`
    <img src="${topCard.image}" width="113" height="157">
    `);
    };
    setTimeout(() => {
        cpTurn("cp1");
    }, 1000)
};



const realPlayerTurn = () => {
    cardChoice = null;
    cp2Complete = false;
    currentPlayer = "realPlayer"
    console.log("Current Player Hand");
    console.log(playerHand);
    console.log("cp1 Hand");
    console.log(cp1Hand);
    console.log("cp2 Hand");
    console.log(cp2Hand);
    $(".player-hand").empty();
    displayHand(playerHand);
    $(document).on("click", ".clickable", function () {
        cardChoiceBuffer($(this).attr("id"));
        $(this).addClass("card-choice");
        $("#decision-text").show();
        $(".button-container").show();
        $(document).off("click", ".clickable");
    });

    $("#no").on("click", function () {
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
    });
};


const cpTurn = (cpPlayer) => {
    realPlayerComplete = false;
    currentPlayer = "cp1";
    if (cpPlayer == "cp1" && cp1Complete == false) {
        for (let card of cp1Hand) {
            if (card.value == "8" || ((card.suit === topCard.suit) || (card.value === topCard.value))) {
                cpPlayablePile.push(card);
            };
        };
        if (cpPlayablePile.length == 0) {
            drawCard();
        } else {
            discardPile.push(topCard);
            topCard = cpPlayablePile[Math.floor(Math.random() * cpPlayablePile.length)];
            if (cp1Hand.includes(topCard) == true) {
                let index1 = cp1Hand.indexOf(topCard);
                cp1Hand.splice(index1, 1);
                console.log("Current Top Card");
                console.log(topCard);
                console.log(cp1Hand);
            }
            cpPlayablePile.length = 0;
            $(".card-image-pile").html(`
            <img src="${topCard.image}" width="113" height="157">
            `);
            cp1Complete = true;
            setTimeout(() => {
                cpTurn("cp2");
            }, 1000);
        };
    } else if (cpPlayer == "cp2" && cp2Complete == false) {
        cp1Complete = false;
        currentPlayer = "cp2";
        for (let card of cp2Hand) {
            if (card.value == "8" || ((card.suit === topCard.suit) || (card.value === topCard.value))) {
                cpPlayablePile.push(card);
            };
        };
        if (cpPlayablePile.length == 0) {
            drawCard();
        } else {
            
            discardPile.push(topCard);
            topCard = cpPlayablePile[Math.floor(Math.random() * cpPlayablePile.length)];
            if (cp2Hand.includes(topCard) == true) {
                let index2 = cp2Hand.indexOf(topCard);
                cp2Hand.splice(index2, 1);
                console.log("Current Top Card");
                console.log(topCard);
            };
            cpPlayablePile.length = 0;
            $(".card-image-pile").html(`
            <img src="${topCard.image}" width="113" height="157">
            `);
            cp2Complete = true;
            setTimeout(() => {
                realPlayerTurn();
            }, 1000);
        };
    };

};