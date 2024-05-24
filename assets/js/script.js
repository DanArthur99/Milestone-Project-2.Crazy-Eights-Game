/**
 * Welcome to the script.js file
 */

const suits = ["HEARTS", "DIAMONDS", "SPADES", "CLUBS"];

// All arrays used throughout the game are stored inside this object
let gameArrays = {
    shuffledPile: [],  // Main Pile to draw from in-game
    playerHand: [], // The user's hand
    cp1Hand: [], // Computer Player 1's Hand
    cp2Hand: [], // Computer Player 2's Hand
    discardPile: [], // Discard pile where the layed cards are stored
    cpPlayablePile: [] // Array used to store the playable cards from Computer Player's hand array, which is then randomly drawn from
};

// All variable game states are stores inside this object
let gameStates = {
    deckSize: undefined,
    draw2Cards: undefined,
    draw6Cards: undefined,
    clockwise: undefined,
    skip: undefined,
    cardChoice: undefined,
    topCard: undefined,
    suitChoice: undefined
};

let randomizer; // Variable that stores a randomly generated number
let newShuffledDeckKey; // Deck key obtained from Deck of Cards API is assigned to this variable

let clickableCount = 0; // Keeps a count of the number of playable cards in a player's hand

// Scores for each player
let playerScore = 0;
let cp1Score = 0;
let cp2Score = 0;

// Username variable
let userName;

window.addEventListener("error", (event) => {
    errorHandler();
});
/**
 * This code below sets all the event listeners in the document once ready. jQuery is predominantly used to achieve this
 */
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname == "/Milestone-Project-2.Crazy-Eights-Game/game.html") { // Checks if the current HTML page is the game itself or not
        initializeGame();
    } else {
        sessionStorage.setItem("username", null);
        homePageListeners();
    }
});

/**
 * Sets all of the event listeners for the Home Page
 */
const homePageListeners = () => {
    $(".start-game").on("click", function () {
        $(".start-buttons-phone-only").css("display", "none");
        $("#enter-username").css("display", "block");
        $(".title-container").css("display", "none");
    });

    $("#username-form").one("submit", function (event) {
        event.preventDefault();
        userName = $("#user-name").val();
        sessionStorage.setItem("username", userName);
        $(this).trigger("submit");
    });
};

/**
 * Initializes the game by setting all of the click event listeners, before calling the starGame function
 */
const initializeGame = () => {

    $(document).on("click", ".clickable", function () {
        $(".card-image").removeClass("card-choice");
        cardChoiceBuffer($(this).attr("data-card"));
        $(this).addClass("card-choice");
        showChoiceButtons();
    });

    $(".no").on("click", function () {
        $(".card-image").removeClass("card-choice");
        $(".text-container, .button-container, .suit-container").css("display", "none");
        $(".player-hand-phone").find(".clickable").attr("data-bs-toggle", "modal")
        gameStates.cardChoice = null;
        $(document).on("click", ".clickable", function () { // Resets the click events to on after clicked
            $(".card-image").removeClass("card-choice");
            cardChoiceBuffer($(this).attr("data-card"));
            $(this).addClass("card-choice");
            showChoiceButtons();
        });
    });

    $(".yes").on("click", function () {
        $(".card-image").removeClass("clickable");
        $(".card-image").addClass("not-clickable"); // Makes the player's hand not clickable while it is not the player's turn
        addToPile();
        gameStates.cardChoice = null;
        $(document).on("click", ".clickable", function () { // Resets the click events to on after clicked
            $(".card-image").removeClass("card-choice");
            cardChoiceBuffer($(this).attr("data-card"));
            $(this).addClass("card-choice");
            showChoiceButtons();
        });
    });

    $(".suit-button").on("click", function () {
        gameStates.suitChoice = $(this).attr("data-suit");
        $(".card-image").removeClass("clickable");
        $(".card-image").addClass("not-clickable"); // Makes the player's hand not clickable while it is not the player's turn
        addToPile();
        gameStates.cardChoice = null;
        $(document).on("click", ".clickable", function () { // Resets the click events to "on" after clicked
            $(".card-image").removeClass("card-choice");
            cardChoiceBuffer($(this).attr("data-card"));
            $(this).addClass("card-choice");
            showChoiceButtons();
        });
    });

    $("#draw-card").on("click", function () {
        $(".draw-card-section").css("display", "none");
        drawCardPlayerClick();
        $(document).on("click", ".clickable", function () { // Resets the click events to "on" after clicked
            $(".card-image").removeClass("card-choice");
            cardChoiceBuffer($(this).attr("data-card"));
            $(this).addClass("card-choice");
            showChoiceButtons();
        });
    });
    $("#play-again").on("click", function () {
        startGame(); // Calls the startGame function when the play-again button is clicked
    });

    startGame();

};

/**
 * Displays the "Play Card?" section in the HTML
 * Called when the yes or suit-button buttons are clicked
 */
const showChoiceButtons = () => {
    $(".text-container").css("display", "block");
    if (gameStates.cardChoice.value == "8") {
        $(".suit-container").css("display", "block");
    } else {
        $(".button-container").css("display", "block");
    }
    $(".player-hand-phone").children().removeAttr("data-bs-toggle");
    $(document).off("click", ".clickable");
};

const startGame = async () => {
    // Sets all array and variables to their default values
    resetAll();
    await shuffleDeck(); // shuffles deck once document is ready 
};

const resetAll = () => {
    gameStates.skip = false;
    gameStates.clockwise = true;
    gameStates.topCard = null;
    gameStates.suitChoice = null;
    gameStates.cardChoice = null;
    gameArrays.playerHand.splice(0, gameArrays.playerHand.length);
    gameArrays.cp1Hand.splice(0, gameArrays.cp1Hand.length);
    gameArrays.cp2Hand.splice(0, gameArrays.cp2Hand.length);
    gameArrays.shuffledPile.splice(0, gameArrays.shuffledPile.length);
    gameArrays.discardPile.splice(0, gameArrays.discardPile.length);
    gameArrays.cpPlayablePile.splice(0, gameArrays.cpPlayablePile.length);
    gameStates.deckSize = 104;
    gameStates.draw2Cards = 0;
    gameStates.draw6Cards = 0;
    // Sets all HTML elements to their default states
    $(".suit-choice").empty();
    $(".player-hand-phone").css("display", "flex");
    $(".player-hand").empty();
    $(".player-hand-phone").empty();
    $("#draw-card").text(`Draw Card`);
    $(".play-again-section").css("display", "none");
    $(".player-score").text(`${sessionStorage.getItem("username")} - Your current score: ${playerScore}`);
    $(".cp1-score").text(`Current Score: ${cp1Score}`);
    $(".cp2-score").text(`Current Score: ${cp2Score}`);
};

/**
 * The following functions fetch the deck data from the Deck of Cards API, then "draws" all of these cards into a ShuffledPile array.
 * The dealInitialHand function is then called.
 * A .catch is added to the promise in case the API fails to load correctly, displaying an alert saying "Could not load."
 */
const shuffleDeck = async () => {
    await fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_cnt=2")
        .then(response => response.json())
        .then(response => {
            newShuffledDeckKey = response.deck_id;
            fetch(`https://www.deckofcardsapi.com/api/deck/${newShuffledDeckKey}/draw/?cot=104`)
                .then(response => response.json())
                .then(deck => {
                    for (let i = 0; i < 104; i++) {
                        gameArrays.shuffledPile.push({ "value": deck.cards[i].value, "suit": deck.cards[i].suit, "image": deck.cards[i].image });
                    }
                    try {
                        dealInitialHand();
                    } catch(error) {
                        errorHandler();
                    }
                    
                }).catch((error) => {
                    errorHandler(), error
                });
        });
};
/**
 * Displays an error message on the HTML,
 */
const errorHandler = () => {
    $(".game-body").html(`
    <div class="error-body">
    <header class="error-message-header">
        <h1>Apologies, we seem to have encountered a problem</h1>
    </header>
    <section class="error-message-body">
        <p>Please click to button below to try again</p>
        <form action="index.html">
            <button type="submit" class="btn btn-primary start-game">Try Again?</button>
        </form>
    </section>
    </div>`)
    $(".index-body").html(`
    <header class="title-container">
        <div class="start-page-header">
            <h1 class="centralize" id="error-title">Apologies, Error Occured!</h1>
            <p id="not-found-text">Oops, we seem to have encountered a problem. Click the button below to try again.</p>
            <form action="index.html" id="error-form">
                <button type="submit" class="d-none d-md-inline btn btn-danger start-game">Try Again?</button>
            </form>       
        </div>
    </header>
    <section class="start-buttons-phone-only d-md-none">
        <form action="index.html">
            <button type="submit" class="btn btn-danger start-game pnf-error-button">Try Again?</button>
        </form>
    </section>
    `)

};

/**
 * Deals the initial hands for all player's in the array, then sets the top card to a random card from what is left.
 * The HTML is also updated to show the top card. This is done using jQuery.
 * This then calls the displayHand, displayComputerPlayer1Hand, and displayComputerPlayer2Hand functions.
 */
const dealInitialHand = () => {
    dealHand(gameArrays.playerHand);
    dealHand(gameArrays.cp1Hand);
    dealHand(gameArrays.cp2Hand);
    randomizer = Math.floor(Math.random() * gameStates.deckSize);
    gameStates.topCard = gameArrays.shuffledPile[randomizer];
    gameArrays.shuffledPile.splice(randomizer, 1);
    displayTopCard();
    randomizer = undefined;
    displayHand(gameArrays.playerHand);
    displayComputerPlayer1Hand();
    displayComputerPlayer2Hand();
};

/**
 * Deals 8 cards into the hand passed in as parameter.
 * @param {Array} hand 
 */
const dealHand = (hand) => {
    for (let i = 0; i < 8; i++) {
        randomizer = Math.floor(Math.random() * gameStates.deckSize);
        hand.push(gameArrays.shuffledPile[randomizer]);
        gameArrays.shuffledPile.splice(randomizer, 1);
        gameStates.deckSize -= 1;
    }
};

/**
 * Displays the user's hand to the user. 
 * Checks to see what the current game state is and what cards are currently playable.
 * @param {Array} hand The hand that will be passed through (in this case, it is always playerHand).
 */
const displayHand = (hand) => {
    gameStates.skip = false;
    $(".player-hand").empty();
    $(".player-hand-phone").empty();
    if (gameStates.draw6Cards > 0) {
        draw6CardsCheckerPlayer(hand);
    } else if (gameStates.draw2Cards > 0) {
        draw2CardsCheckerPlayer(hand);
    } else if (gameStates.suitChoice) {
        suitChoiceCheckerPlayer(hand);
    } else {
        eligibilityCheckerPlayer(hand);
    }
    displayChecker();
};

/**
 * Checks the number if clickable (playable) cards in the player's hand. 
 * If this equals 0, the "Draw Card" button will appear.
 */
const displayChecker = () => {
    if (clickableCount > 0) {
        $(".draw-card-section").css("display", "none");
        clickableCount = 0;
    } else {
        $(".draw-card-section").css("display", "block");
    }
};

/**
 * Displays the current Top Card on screen
 */
const displayTopCard = () => {
    $("#card-pile").html(`
    <img src="${gameStates.topCard.image}" alt="${gameStates.topCard.value} of ${gameStates.topCard.suit}" width="113" height="157">
    `);
    $("#card-pile-phone").html(`
    <img src="${gameStates.topCard.image}" alt="${gameStates.topCard.value} of ${gameStates.topCard.suit}" width="70" height="98">
    `);
}

/**
 * Displays Computer Player 1's hand on screen.
 */
const displayComputerPlayer1Hand = () => {
    let cp1DOM = $(".cp1");
    let cp1DOMPhone = $(".cp1-phone");
    cp1DOM.empty();
    cp1DOMPhone.empty();
    CPDisplay(gameArrays.cp1Hand, cp1DOM);
    CPDisplayPhone(gameArrays.cp1Hand, cp1DOMPhone);
    $(".cp1-text").text(`Computer Player 1 - Card Total: ${gameArrays.cp1Hand.length}`);
};

/**
 * Displays Computer Player 2's hand on screen.
 */
const displayComputerPlayer2Hand = () => {
    let cp2DOM = $(".cp2");
    let cp2DOMPhone = $(".cp2-phone");
    cp2DOM.empty();
    cp2DOMPhone.empty();
    CPDisplay(gameArrays.cp2Hand, cp2DOM);
    CPDisplayPhone(gameArrays.cp2Hand, cp2DOMPhone);
    $(".cp2-text").text(`Computer Player 2 - Card Total: ${gameArrays.cp2Hand.length}`);
};

/**
 * Checks how many cards are left in the Computer Player's array, and displays the number of cards on screen accordingly
 * Will never display more than 8 per hand on larger screens.
 * @param {Array} hand 
 * @param {HTMLElement} DOMElement 
 */
const CPDisplay = (hand, DOMElement) => {
    if (hand.length < 8) {
        for (let i = 0; i < hand.length; i++) {
            faceDownImageLargeOnly(DOMElement);
        }
    } else {
        for (let i = 0; i < 8; i++) {
            faceDownImageLargeOnly(DOMElement);
        }
    }
};

/**
 * Displays the Computer Player's hands for mobile and smaller screens
 * Will only ever show 1 card if the player has any cards in their hand
 * @param {Array} hand 
 * @param {HTMLElement} DOMElement 
 */
const CPDisplayPhone = (hand, DOMElement) => {
    if (hand.length > 0) {
        DOMElement.append(`
        <div class="d-md-none col-1 face-down-image right">
            <img src="https://www.deckofcardsapi.com/static/img/back.png" alt="card face down image" width="70" height="98"
        </div>`);
    }
};

/**
 * Function that contains the jQuery for appending the HTML to show face down card image.
 * @param {HTMLElement} DOMElement 
 */
const faceDownImageLargeOnly = (DOMElement) => {
    DOMElement.append(`
    <div class="col-1 d-none d-md-inline-block face-down-image right">
        <img src="https://www.deckofcardsapi.com/static/img/back.png" alt="card face down image" width="113" height="157">
    </div>`);
};

/**
 * Called when the player clicks the "Draw Card" button.
 * Sets the clickable card element event listeners to off.
 * Then calls the drawCard and displyHandDrawCard synchronously
 */
const drawCardPlayerClick = () => {
    $(document).off("click", ".clickable");
    drawCard(gameArrays.playerHand, `${sessionStorage.getItem("username")}`);
    displayHandDrawCard(gameArrays.playerHand);
    if (gameStates.clockwise == false) {
        setTimeout(() => {
            cp2Turn();
        }, 1000);
    } else {
        setTimeout(() => {
            cp1Turn();
        }, 1000);
    }
};

/**
 * Ensures that no cards are clickable while it is not the player's turn 
 */
const displayHandDrawCard = (hand) => {
    $(".player-hand").empty();
    $(".player-hand-phone").empty();
    for (let card of hand) {
        $(".player-hand").append(`
        <div class="col-1 card-image not-clickable" id="${card.value}-of-${card.suit}">
        <img src="${card.image}" alt="${card.value} of ${card.suit}" width="113" height="157">
        </div>
        `);
        $(".player-hand-phone").append(`
        <div class="col-1 card-image not-clickable" id="${card.value}-of-${card.suit}">
        <img src="${card.image}" alt="${card.value} of ${card.suit}" width="70" height="98">
        </div>
        `);
    }
};

/**
 * Adds the card the player has initially clicked on to a buffer, where the player can then add to the pile, or press no and change their mind
 * @param {String} string The name of the card as a string, taken from the data-card attribute in the html
 */
const cardChoiceBuffer = (string) => {
    let words = [];
    for (let word of string.split("-")) {
        words.push(word);
    }
    let buffer = gameArrays.playerHand.filter(card => {
        return (card.value === words[0] && card.suit === words[2]);
    });
    gameStates.cardChoice = buffer[0];
};

/**
 * Adds the user's chosen card to the pile
 * Pushes the previous top card tothe discardPile array, then sets the topCard to the new top card
 */
const addToPile = async () => {
    $(".suit-choice").empty();
    $(".card-choice").remove();
    $(".text-container, .suit-container, .button-container").css("display", "none");
    if (gameStates.topCard) {
        gameArrays.discardPile.push(gameStates.topCard);  // Checks if the topCard has a value, then pushes it to the discardPile if treu
    }
    gameStates.topCard = gameStates.cardChoice; // sets the new top card
    removeCardFromHand(gameArrays.playerHand, `${sessionStorage.getItem("username")}`);
    displayTopCard();
    // Checks who's turn it is next, or whether the game is over
    if (gameArrays.playerHand.length == 0) {
        playerScore += 1;
        $("#end-of-game-text").text("You Win! Play Again?");
        $(".player-hand-phone").css("display", "none");
        $(".play-again-section").css("display", "block");
    } else if (gameStates.clockwise == true && gameStates.skip == false || gameStates.clockwise == false && gameStates.skip) {
        setTimeout(() => {
            cp1Turn();
        }, 1000);
    } else {
        setTimeout(() => {
            cp2Turn();
        }, 1000);
    }
};

/**
 * This functions calls Computer Player 1's Turn
 */
const cp1Turn = () => {
    gameStates.skip = false;
    gameStateChecker(gameArrays.cp1Hand); // Checks what the current state of the game is
    takeTurn(gameArrays.cp1Hand, "Computer Player 1");
    displayComputerPlayer1Hand();
    // Checks who's turn it is next, or whether the game is over
    if (gameArrays.cp1Hand.length == 0) {
        cp1Score += 1;
        $("#end-of-game-text").text("Computer Player 1 Wins! Play Again?");
        $(".player-hand-phone").css("display", "none");
        $(".play-again-section").css("display", "block");
    } else if (gameStates.clockwise == true && gameStates.skip == false || gameStates.clockwise == false && gameStates.skip) {
        setTimeout(() => {
            cp2Turn();
        }, 1000);
    } else {
        displayHand(gameArrays.playerHand);
    }
};

/**
 * This functions calls Computer Player 2's Turn
 */
const cp2Turn = () => {
    gameStates.skip = false;
    gameStateChecker(gameArrays.cp2Hand); // Checks what the current state of the game is
    takeTurn(gameArrays.cp2Hand, "Computer Player 2");
    displayComputerPlayer2Hand();
    // Checks who's turn it is next, or whether the game is over
    if (gameArrays.cp2Hand.length == 0) {
        cp2Score += 1;
        $("#end-of-game-text").text("Computer Player 2 Wins! Play Again?");
        $(".player-hand-phone").css("display", "none");
        $(".play-again-section").css("display", "block");
    } else if (gameStates.clockwise == true && gameStates.skip == false || gameStates.clockwise == false && gameStates.skip) {
        displayHand(gameArrays.playerHand);
    } else {
        setTimeout(() => {
            cp1Turn();
        }, 1000);
    }
};

/**
 * Checks the current state of the game with each hand, and determine what cards are playable and what are not
 * @param {Array} hand 
 */
const gameStateChecker = (hand) => {
    if (gameStates.draw6Cards > 0) {
        draw6CardsChecker(hand);
    } else if (gameStates.draw2Cards > 0) {
        draw2CardsChecker(hand);
    } else if (gameStates.suitChoice) {
        suitChoiceChecker(hand);
    } else {
        eligibilityChecker(hand);
    }
};

/**
 * Checks whether there are any playable cards in the array, and determines whether to draw a card or push and card to the pile
 * @param {Array} hand 
 * @param {String} player 
 */
const takeTurn = (hand, player) => {
    if (gameArrays.cpPlayablePile.length == 0) {
        drawCard(hand, player);
    } else {
        pushCardToPile(hand, player);
    }
};

/**
 * Checks which game state the game is currently in (normal, +2, or +6)
 * The HTML is also updated to display to the user what has happened more clearly
 * @param {Array} hand 
 * @param {String} player 
 */
const drawCard = (hand, player) => {
    emptyPileChecker();
    if (gameStates.draw6Cards > 0) {
        for (let i = 0; i < gameStates.draw6Cards; i++) {
            emptyPileChecker();
            draw(hand);
        }
        $(".suit-choice").text(`${player} has drawn ${gameStates.draw6Cards} cards`);
        gameStates.draw6Cards = 0;
    } else if (gameStates.draw2Cards > 0) {
        for (let i = 0; i < gameStates.draw2Cards; i++) {
            emptyPileChecker();
            draw(hand);
        }
        $(".suit-choice").text(`${player} has drawn ${gameStates.draw2Cards} cards`);
        gameStates.draw2Cards = 0;
    } else {
        draw(hand);
        $(".suit-choice").text(`${player} has drawn a card`);
    }
};

/**
 * Checks if the shuffledPile is empty
 * Called every time a card is needed to be drawn
 */
const emptyPileChecker = () => {
    if (gameArrays.shuffledPile.length < 1) {
        gameStates.deckSize = gameArrays.discardPile.length;
        for (let i = 0; i < gameStates.deckSize; i++) {
            randomizer = Math.floor(Math.random() * gameArrays.discardPile.length);
            gameArrays.shuffledPile.push(gameArrays.discardPile[randomizer]);
            gameArrays.discardPile.splice(randomizer, 1);
        }
    }
};

/**
 * Function for actually drawing card from the shuffledPule, and then removing it is from the pile
 * @param {Array} hand 
 */
const draw = (hand) => {
    randomizer = Math.floor(Math.random() * gameArrays.shuffledPile.length);
    hand.push(gameArrays.shuffledPile[randomizer]);
    gameArrays.shuffledPile.splice(randomizer, 1);
};

/**
 * Sets what cards are playable for the user if the current gameState is +6.
 * @param {Array} hand 
 */
const draw6CardsCheckerPlayer = (hand) => {
    for (let card of hand) {
        if (card.value == "ACE" && card.suit == "SPADES") {
            setClickable(card);
            clickableCount += 1;
        } else {
            setNotClickable(card);
        }
        $("#draw-card").text(`Draw ${gameStates.draw6Cards} Cards`);
    }
};

/**
 * Sets what cards are playable for the user if the current gameState is +2.
 * @param {Array} hand 
 */
const draw2CardsCheckerPlayer = (hand) => {
    for (let card of hand) {
        if (card.value == "2") {
            setClickable(card);
            clickableCount += 1;
        } else {
            setNotClickable(card);
        }
        $("#draw-card").text(`Draw ${gameStates.draw2Cards} Cards`);
    }
};

/**
 * Sets what cards are playable for the user if he previous player has layed down an 8 and chosen a new suit.
 * @param {Array} hand 
 */
const suitChoiceCheckerPlayer = (hand) => {
    for (let card of hand) {
        if (card.value == "8" || card.suit == gameStates.suitChoice) {
            setClickable(card);
            clickableCount += 1;
        } else {
            setNotClickable(card);
        }
        $("#draw-card").text(`Draw Card`);
    }
};

/**
 * Checks each card in the user's hand to see if the value or suit match the top card.
 * @param {Array} hand 
 */
const eligibilityCheckerPlayer = (hand) => {
    for (let card of hand) {
        if (card.value == "8" || ((card.suit === gameStates.topCard.suit) || (card.value === gameStates.topCard.value))) {
            setClickable(card);
            clickableCount += 1;
        } else {
            setNotClickable(card);
        }
        $("#draw-card").text(`Draw Card`);
    }
};


/**
 * The following functions check to see what cards are playable for the computer players.
 */
const draw2CardsChecker = (hand) => {
    for (let card of hand) {
        if (card.value == "2") {
            gameArrays.cpPlayablePile.push(card);
        }
    }
};

const draw6CardsChecker = (hand) => {
    for (let card of hand) {
        if (card.value == "ACE" && card.suit == "SPADES") {
            gameArrays.cpPlayablePile.push(card);
        }
    }
};

const suitChoiceChecker = (hand) => {
    for (let card of hand) {
        if (card.value == "8" || card.suit == gameStates.suitChoice) {
            gameArrays.cpPlayablePile.push(card);
        }
    }
};

const eligibilityChecker = (hand) => {
    for (let card of hand) {
        if (card.value == "8" || ((card.suit === gameStates.topCard.suit) || (card.value === gameStates.topCard.value))) {
            gameArrays.cpPlayablePile.push(card);
        }
    }
};

/**
 * Pushes the a random playable card from the computer player's hand to the pile.
 */
const pushCardToPile = (hand, player) => {
    $(".suit-choice").empty();
    gameStates.suitChoice = undefined;
    gameArrays.discardPile.push(gameStates.topCard);
    gameStates.topCard = gameArrays.cpPlayablePile[Math.floor(Math.random() * gameArrays.cpPlayablePile.length)];
    removeCardFromHand(hand, player);
    gameArrays.cpPlayablePile.length = 0;
    displayTopCard();
};


/**
 * Removes the selected card from the passed player's hand
 * @param {Array} hand 
 * @param {String} player 
 */
const removeCardFromHand = (hand, player) => {
    if (hand.includes(gameStates.topCard) == true) {
        let index1 = hand.indexOf(gameStates.topCard); // Finds the index of the topCard within the passed player's hand
        hand.splice(index1, 1); // Removes this array value
        gameStateSetter(hand, player);
    }
};
/**
 * Sets the game state depending on what the top card is
 * @param {Array} hand 
 * @param {String} player 
 */
const gameStateSetter = (hand, player) => {
    if (gameStates.topCard.value == "8") {
        if (hand != gameArrays.playerHand) {
            gameStates.suitChoice = suits[Math.floor(Math.random() * suits.length)];
        }
        $(".suit-choice").text(`${player} has chosen ${gameStates.suitChoice}`);
    } else {
        gameStates.suitChoice = undefined;
        if (gameStates.topCard.value == "2") {
            gameStates.draw2Cards += 2;
        } else if (gameStates.topCard.value == "ACE") {
            gameStates.clockwise = !gameStates.clockwise;
            if (gameStates.topCard.suit == "SPADES") {
                gameStates.draw6Cards += 6;
            }
        } else if (gameStates.topCard.value == "JACK") {
            gameStates.skip = true;
        }
        $(".suit-choice").text(`${player} has layed ${gameStates.topCard.value} of ${gameStates.topCard.suit}`);
    }
};

/**
 * The following functions append the HTML document with a new div displaying the card passed through
 * @param {Object} card 
 */
const setClickable = (card) => {
    $(".player-hand").append(`
        <div class="col-1 card-image clickable" data-card="${card.value}-of-${card.suit}">
        <img src="${card.image}" alt="${card.value} of ${card.suit}" width="113" height="157">
        </div>
        `);
    if (card.value == "8") { // checks which modal to enable for mobile users. If the card is an 8, a different modal enabled.
        $(".player-hand-phone").append(`
        <div class="col-1 card-image clickable" data-bs-toggle="modal" data-bs-target="#confirmation-8" data-card="${card.value}-of-${card.suit}">
        <img src="${card.image}" alt="${card.value} of ${card.suit}" width="70" height="98">
        </div>
        `);
    } else {
        $(".player-hand-phone").append(`
        <div class="col-1 card-image clickable" data-bs-toggle="modal" data-bs-target="#confirmation" data-card="${card.value}-of-${card.suit}">
        <img src="${card.image}" alt="${card.value} of ${card.suit}" width="70" height="98">
        </div>
        `);
    }
};

/**
 * The following functions append the HTML document with a new div displaying the card passed through.
 * dipslayed as not clickable, with css transparency set to 0.5
 * @param {Object} card 
 */
const setNotClickable = (card) => {
    $(".player-hand").append(`
        <div class="col-1 card-image not-clickable" data-card="${card.value}-of-${card.suit}">
        <img src="${card.image}" alt="${card.value} of ${card.suit}" width="113" height="157">
        </div>
        `);
    $(".player-hand-phone").append(`
        <div class="col-1 card-image not-clickable" data-card="${card.value}-of-${card.suit}">
        <img src="${card.image}" alt="${card.value} of ${card.suit}" width="70" height="98">
        </div>
        `);
};

//module.exports = {
    gameArrays,
    gameStates,
    dealHand,
    resetAll,
    gameStateSetter,
    cardChoiceBuffer,
    emptyPileChecker,
    draw,
    suits
//};