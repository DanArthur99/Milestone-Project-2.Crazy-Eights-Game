const suits = ["HEARTS", "DIAMONDS", "SPADES", "CLUBS"];

let gameArrays = {
    shuffledPile: [],
    playerHand: [],
    cp1Hand: [],
    cp2Hand: [],
    discardPile: [],
    cpPlayablePile: []
}

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

let randomizer;
let newShuffledDeckKey;

let clickableCount = 0;

let playerScore = 0;
let cp1Score = 0;
let cp2Score = 0;

let userName;



/**
 * This code below sets all the event listeners in the document once ready. jQuery is predominantly used to achieve this
 */
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname == "/Milestone-Project-2.Crazy-Eights-Game/game.html") {
        initializeGame();
    } else {
        sessionStorage.setItem("username", null);
        homePageListeners();
    }
});

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
}
const initializeGame = () => {
    
    $(document).on("click", ".clickable", function () {
        cardChoiceBuffer($(this).attr("data-card"));
        $(this).addClass("card-choice");
        clickEventSetter();
    });

    $(".no").on("click", function () {
        $(".card-image").removeClass("card-choice");
        $(".text-container, .button-container, .suit-container").css("display", "none");
        gameStates.cardChoice = null;
        $(document).on("click", ".clickable", function () {
            cardChoiceBuffer($(this).attr("data-card"));
            $(this).addClass("card-choice");
            clickEventSetter();
        });
    });

    $(".yes").on("click", function () {
        $(".card-image").removeClass("clickable");
        $(".card-image").addClass("not-clickable");
        addToPile();
        gameStates.cardChoice = null;
        $(document).on("click", ".clickable", function () {
            cardChoiceBuffer($(this).attr("data-card"));
            $(this).addClass("card-choice");
            clickEventSetter();
        });
    });

    $(".suit-button").on("click", function () {
        gameStates.suitChoice = $(this).attr("data-suit");
        $(".card-image").removeClass("clickable");
        $(".card-image").addClass("not-clickable");
        addToPile();
        gameStates.cardChoice = null;
        $(document).on("click", ".clickable", function () {
            cardChoiceBuffer($(this).attr("data-card"));
            $(this).addClass("card-choice");
            clickEventSetter();
        });
    });

    $("#draw-card").on("click", function () {
        $(".draw-card-section").css("display", "none");
        drawCardPlayerClick();
        $(document).on("click", ".clickable", function () {
            cardChoiceBuffer($(this).attr("data-card"));
            $(this).addClass("card-choice");
            clickEventSetter();
        })
    });
    $("#play-again").on("click", function () {
        startGame();
    });

    startGame();

};


const clickEventSetter = () => {
    $(".text-container").css("display", "block");
    if (gameStates.cardChoice.value == "8") {
        $(".suit-container").css("display", "block");
    } else {
        $(".button-container").css("display", "block");
    }
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
}

/**
 * The following functions fetch the deck data from the Deck of Cards API, then "draws" all of these cards into a ShuffledPile array. The players hand is then drawn by randomly selecting
 * an index of that array, pushing that item to the playerHand array, then deleting that object from the ShuffledPile array. The image of the card is then displayed to the DOM by obtaining the image
 * data inside the card object, and manipulating the HTML to include an <img> with this data as it's source (src).
 */
const shuffleDeck = async () => {
    await fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=2")
        .then(response => response.json())
        .then(response => {
            newShuffledDeckKey = response.deck_id;
            fetch(`https://www.deckofcardsapi.com/api/deck/${newShuffledDeckKey}/draw/?count=104`)
                .then(response => response.json())
                .then(deck => {
                    for (let i = 0; i < 104; i++) {
                        gameArrays.shuffledPile.push({ "value": deck.cards[i].value, "suit": deck.cards[i].suit, "image": deck.cards[i].image })
                    };
                    dealInitialHand();

                }).catch(error => alert("Could not load", error));
        });
};

// Deals the initial hand for all players
const dealInitialHand = () => {
    dealHand(gameArrays.playerHand);
    dealHand(gameArrays.cp1Hand);
    dealHand(gameArrays.cp2Hand);
    randomizer = Math.floor(Math.random() * gameStates.deckSize);
    gameStates.topCard = gameArrays.shuffledPile[randomizer];
    gameArrays.shuffledPile.splice(randomizer, 1);
    $("#card-pile").html(`
    <img src="${gameStates.topCard.image}" width="113" height="157">
    `);
    $("#card-pile-phone").html(`
    <img src="${gameStates.topCard.image}" width="70" height="98">
    `);

    randomizer = undefined;

    displayHand(gameArrays.playerHand);
    displayComputerPlayer1Hand();
    displayComputerPlayer2Hand();
};

// Deal Hand Function
const dealHand = (hand) => {
    for (let i = 0; i < 8; i++) {
        randomizer = Math.floor(Math.random() * gameStates.deckSize);
        hand.push(gameArrays.shuffledPile[randomizer]);
        gameArrays.shuffledPile.splice(randomizer, 1);
        gameStates.deckSize -= 1;
    }
};

/**
 * Displays the user's hand to the user. Checks to see what the current game state is and what cards are currently playable.
 * @param {Array} hand The hand that will be passed through (in this case, it is always playerHand)
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
    };
    displayChecker();
};

/**
 * Checks the number if clickable (playable) cards in the player's hand. If this equals 0, the "Draw Card" button will appear.
 */
const displayChecker = () => {
    if (clickableCount > 0) {
        $(".draw-card-section").css("display", "none");
        clickableCount = 0;
    } else {
        $(".draw-card-section").css("display", "block");
    };

};

/**
 * The following functions display the Computer Player's hand on screen
 */
const displayComputerPlayer1Hand = () => {
    let cp1DOM = $(".cp1");
    let cp1DOMPhone = $(".cp1-phone");
    cp1DOM.empty();
    cp1DOMPhone.empty();
    CPDisplay(gameArrays.cp1Hand, cp1DOM);
    CPDisplayPhone(gameArrays.cp1Hand, cp1DOMPhone);
    $(".cp1-text").text(`Computer Player 1 - Card Total: ${gameArrays.cp1Hand.length}`)

};

const displayComputerPlayer2Hand = () => {
    let cp2DOM = $(".cp2");
    let cp2DOMPhone = $(".cp2-phone");
    cp2DOM.empty();
    cp2DOMPhone.empty();
    CPDisplay(gameArrays.cp2Hand, cp2DOM);
    CPDisplayPhone(gameArrays.cp2Hand, cp2DOMPhone);
    $(".cp2-text").text(`Computer Player 2 - Card Total: ${gameArrays.cp2Hand.length}`)
};

const CPDisplay = (hand, DOMElement) => {
    if (hand.length < 8) {
        for (let i = 0; i < hand.length; i++) {
            faceDownImageLargeOnly(DOMElement);
        }
    } else {
        for (let i = 0; i < 8; i++) {
            faceDownImageLargeOnly(DOMElement);
        };
    };
};

const CPDisplayPhone = (hand, DOMElement) => {
    if (hand.length > 0) {
        DOMElement.append(`
        <div class="d-md-none col-1 face-down-image right">
            <img src="https://www.deckofcardsapi.com/static/img/back.png" width="70" height="98"
        </div>`);
    }
};

const faceDownImageLargeOnly = (DOMElement) => {
    DOMElement.append(`
    <div class="col-1 d-none d-md-inline-block face-down-image right">
        <img src="https://www.deckofcardsapi.com/static/img/back.png" width="113" height="157">
    </div>`);
}

/**
 * Called when the player clicks the "Draw Card" button. First it draws a card to the player's hand. Then it displays the players hand on screen.
 * It then checks to see if the current player movement is clockwise or anti-clockwise, and calls the next player's turn after the check.
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
    };
};

/**
 * The function ensures that no cards are clickable while it is not the player's turn 
 */
const displayHandDrawCard = (hand) => {
    $(".player-hand").empty();
    $(".player-hand-phone").empty();
    for (let card of hand) {
        $(".player-hand").append(`
        <div class="col-1 card-image not-clickable" id="${card.value}-of-${card.suit}">
        <img src="${card.image}" width="113" height="157">
        </div>
        `);
        $(".player-hand-phone").append(`
        <div class="col-1 card-image not-clickable" id="${card.value}-of-${card.suit}">
        <img src="${card.image}" width="70" height="98">
        </div>
        `);
    };
};

/**
 * Adds the card the player has initially clicked on to a buffer, where the player can then add to the pile, or press no and change their mind
 * @param {String} string The name of the card as a string, taken from the data-card attribute in the html
 */
const cardChoiceBuffer = (string) => {
    let words = [];
    for (let word of string.split("-")) {
        words.push(word);
    };
    let buffer = gameArrays.playerHand.filter(card => {
        return (card.value === words[0] && card.suit === words[2])
    });
    gameStates.cardChoice = buffer[0];
};

const addToPile = async () => {
    $(".suit-choice").empty();
    $(".card-choice").remove();
    $(".text-container, .suit-container, .button-container").css("display", "none");
    if (gameStates.topCard) {
        gameArrays.discardPile.push(gameStates.topCard);
    }
    gameStates.topCard = gameStates.cardChoice;
    removeCardFromHand(gameArrays.playerHand, `${sessionStorage.getItem("username")}`)
    $("#card-pile").html(`
    <img src="${gameStates.topCard.image}" width="113" height="157">
    `);
    $("#card-pile-phone").html(`
    <img src="${gameStates.topCard.image}" width="70" height="98">
    `);
    if (gameArrays.playerHand.length == 0) {
        playerScore += 1;
        $("#end-of-game-text").text("You Win! Play Again?");
        $(".play-again-section").css("display", "block");
    } else if (gameStates.clockwise == true && gameStates.skip == false || gameStates.clockwise == false && gameStates.skip) {
        setTimeout(() => {
            cp1Turn();
        }, 1000)
    } else {
        setTimeout(() => {
            cp2Turn();
        }, 1000)
    };
};

/**
 * This functions calls Computer Player 1's Turn
 */
const cp1Turn = () => {
    gameStates.skip = false;
    gameStateChecker(gameArrays.cp1Hand);
    takeTurn(gameArrays.cp1Hand, "Computer Player 1");
    displayComputerPlayer1Hand();
    if (gameArrays.cp1Hand.length == 0) {
        cp1Score += 1;
        $("#end-of-game-text").text("Computer Player 1 Wins! Play Again?");
        $(".player-hand-phone").css("display", "none")
        $(".play-again-section").css("display", "block");
    } else if (gameStates.clockwise == true & gameStates.skip == false || gameStates.clockwise == false && gameStates.skip) {
        setTimeout(() => {
            cp2Turn();
        }, 1000)
    } else {
        displayHand(gameArrays.playerHand);
    }
}

/**
 * This functions calls Computer Player 2's Turn
 */
const cp2Turn = () => {
    gameStates.skip = false;
    gameStateChecker(gameArrays.cp2Hand);
    takeTurn(gameArrays.cp2Hand, "Computer Player 2");
    displayComputerPlayer2Hand();
    if (gameArrays.cp2Hand.length == 0) {
        cp2Score += 1;
        $("#end-of-game-text").text("Computer Player 2 Wins! Play Again?");
        $(".player-hand-phone").css("display", "none")
        $(".play-again-section").css("display", "block");
    } else if (gameStates.clockwise == true && gameStates.skip == false || gameStates.clockwise == false && gameStates.skip) {
        displayHand(gameArrays.playerHand);
    } else {
        setTimeout(() => {
            cp1Turn();
        }, 1000)
    }
}

const gameStateChecker = (hand) => {
    if (gameStates.draw6Cards > 0) {
        draw6CardsChecker(hand);
    } else if (gameStates.draw2Cards > 0) {
        draw2CardsChecker(hand);
    } else if (gameStates.suitChoice) {
        suitChoiceChecker(hand);
    } else {
        eligibilityChecker(hand);
    };
};

const takeTurn = (hand, player) => {
    if (gameArrays.cpPlayablePile.length == 0) {
        drawCard(hand, player);
    } else {
        pushCardToPile(hand, player);
    };
}
/**
 * 
 * The following function takes the player's hand as a parameter and draws a card from the deck to that player's hand
 */
const drawCard = (hand, player) => {
    emptyPileChecker();
    if (gameStates.draw6Cards > 0) {
        for (let i = 0; i < gameStates.draw6Cards; i++) {
            emptyPileChecker();
            draw(hand);
        };
        $(".suit-choice").text(`${player} has drawn ${gameStates.draw6Cards} cards`);
        gameStates.draw6Cards = 0;
    } else if (gameStates.draw2Cards > 0) {
        for (let i = 0; i < gameStates.draw2Cards; i++) {
            emptyPileChecker();
            draw(hand);
        };
        $(".suit-choice").text(`${player} has drawn ${gameStates.draw2Cards} cards`);
        gameStates.draw2Cards = 0;
    } else {
        draw(hand);
        $(".suit-choice").text(`${player} has drawn a card`);
    };
};

const emptyPileChecker = () => {
    if (gameArrays.shuffledPile.length < 1) {
        for (let i = 0; i < gameArrays.discardPile.length; i++) {
            randomizer = Math.floor(Math.random() * gameArrays.discardPile.length);
            gameArrays.shuffledPile.push(gameArrays.discardPile[randomizer]);
            gameArrays.discardPile.splice(randomizer, 1);
        };
    };
};

const draw = (hand) => {
    randomizer = Math.floor(Math.random() * gameArrays.shuffledPile.length)
    hand.push(gameArrays.shuffledPile[randomizer]);
    gameArrays.shuffledPile.splice(randomizer, 1);
}

/**
 * The following functions check the state of the game to see what cards are playable for the non-computer player.
 * @param {Array} hand 
 */
const draw6CardsCheckerPlayer = (hand) => {
    for (let card of hand) {
        if (card.value == "ACE" && card.suit == "SPADES") {
            setClickable(card);
            clickableCount += 1
        } else {
            setNotClickable(card);
        };
        $("#draw-card").text(`Draw ${gameStates.draw6Cards} Cards`);
    };
};

const draw2CardsCheckerPlayer = (hand) => {
    for (let card of hand) {
        if (card.value == "2") {
            setClickable(card);
            clickableCount += 1
        } else {
            setNotClickable(card);
        };
        $("#draw-card").text(`Draw ${gameStates.draw2Cards} Cards`);
    };
};


const suitChoiceCheckerPlayer = (hand) => {
    for (let card of hand) {
        if (card.value == "8" || card.suit == gameStates.suitChoice) {
            setClickable(card);
            clickableCount += 1
        } else {
            setNotClickable(card);
        };
        $("#draw-card").text(`Draw Card`);
    }
};

const eligibilityCheckerPlayer = (hand) => {
    for (let card of hand) {
        if (card.value == "8" || ((card.suit === gameStates.topCard.suit) || (card.value === gameStates.topCard.value))) {
            setClickable(card);
            clickableCount += 1
        } else {
            setNotClickable(card);
        };
        $("#draw-card").text(`Draw Card`);
    };
};


/**
 * The following functions check to see what cards are playable for the computer players.
 */
const draw2CardsChecker = (hand) => {
    for (let card of hand) {
        if (card.value == "2") {
            gameArrays.cpPlayablePile.push(card);
        };
    };
}

const draw6CardsChecker = (hand) => {
    for (let card of hand) {
        if (card.value == "ACE" && card.suit == "SPADES") {
            gameArrays.cpPlayablePile.push(card);
        }
    }
}

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
        };
    };
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
    $("#card-pile").html(`
    <img src="${gameStates.topCard.image}" width="113" height="157">
    `);
    $("#card-pile-phone").html(`
    <img src="${gameStates.topCard.image}" width="70" height="98">
    `);
}


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
    };
}
/**
 * Sets the game state depending on what the top card is
 * @param {Array} hand 
 * @param {String} player 
 */
const gameStateSetter = (hand, player) => {
    if (gameStates.topCard.value == "8") {
        if (hand != gameArrays.playerHand) {
            gameStates.suitChoice = suits[Math.floor(Math.random() * suits.length)]
        };
        $(".suit-choice").text(`${player} has chosen ${gameStates.suitChoice}`);
    } else {
        gameStates.suitChoice = undefined;
        if (gameStates.topCard.value == "2") {
            gameStates.draw2Cards += 2;
        } else if (gameStates.topCard.value == "ACE") {
            gameStates.clockwise = !gameStates.clockwise;
            if (gameStates.topCard.suit == "SPADES") {
                gameStates.draw6Cards += 6
            }
        } else if (gameStates.topCard.value == "JACK") {
            gameStates.skip = true;
        }
        $(".suit-choice").text(`${player} has layed ${gameStates.topCard.value} of ${gameStates.topCard.suit}`);
    };
};


/**
 * The following functions append the HTML document with a new div displaying the card passed through, either clickable or not clickable
 */
const setClickable = (card) => {
    $(".player-hand").append(`
        <div class="col-1 card-image clickable" data-card="${card.value}-of-${card.suit}">
        <img src="${card.image}" width="113" height="157">
        </div>
        `);

    if (card.value == "8") { // checks which modal to enable for mobile users. If the card is an 8, a different modal enabled.
        $(".player-hand-phone").append(`
        <div class="col-1 card-image clickable" data-bs-toggle="modal" data-bs-target="#confirmation-8" data-card="${card.value}-of-${card.suit}">
        <img src="${card.image}" width="70" height="98">
        </div>
        `);
    } else {
        $(".player-hand-phone").append(`
        <div class="col-1 card-image clickable" data-bs-toggle="modal" data-bs-target="#confirmation" data-card="${card.value}-of-${card.suit}">
        <img src="${card.image}" width="70" height="98">
        </div>
        `);
    }
}

const setNotClickable = (card) => {
    $(".player-hand").append(`
        <div class="col-1 card-image not-clickable" data-card="${card.value}-of-${card.suit}">
        <img src="${card.image}" width="113" height="157">
        </div>
        `);
    $(".player-hand-phone").append(`
        <div class="col-1 card-image not-clickable" data-card="${card.value}-of-${card.suit}">
        <img src="${card.image}" width="70" height="98">
        </div>
        `);
};

//module.exports = {
    gameArrays,
    gameStates,
    dealHand,
    randomizer,
    resetAll,
    pushCardToPile,
    removeCardFromHand,
    gameStateSetter,
    suits
//};