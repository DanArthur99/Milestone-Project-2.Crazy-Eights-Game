let shuffledPile = [];
let playerHand = [];
let cp1Hand = [];
let cp2Hand = [];
let discardPile = [];
let cpPlayablePile = [];

const suits = ["HEARTS", "DIAMONDS", "SPADES", "CLUBS"];

let deckSize;

let draw2Cards;
let draw6Cards;

let clockwise;
let skip;

let cardChoice;
let topCard;
let suitChoice;

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
$(() => {
    initializeGame();
});

const initializeGame = () => {
    $("#start-game").on("click", function () {
        $("#enter-username").css("display", "block");
        $(".title-container").css("display", "none");
    });

    $("#username-form").one("submit", function (event) {
        event.preventDefault();
        userName = $("#user-name").val();
        sessionStorage.setItem("username", userName);
        $(this).trigger("submit");
    });

    $(document).on("click", ".clickable", function () {
        cardChoiceBuffer($(this).attr("data-card"));
        $(this).addClass("card-choice");
        clickEventSetter();
    });

    $(".no").on("click", function () {
        $(".card-image").removeClass("card-choice");
        $(".text-container, .button-container, .suit-container").css("display", "none");
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
        cardChoice = null;
        $(document).on("click", ".clickable", function () {
            cardChoiceBuffer($(this).attr("data-card"));
            $(this).addClass("card-choice");
            clickEventSetter();
        });
    });

    $(".suit-button").on("click", function () {
        suitChoice = $(this).attr("data-suit");
        $(".card-image").removeClass("clickable");
        $(".card-image").addClass("not-clickable");
        addToPile();
        cardChoice = null;
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
    if (cardChoice.value == "8") {
        $(".suit-container").css("display", "block");
    } else {
        $(".button-container").css("display", "block");
    }
    $(document).off("click", ".clickable");
};




const startGame = async () => {
    // Sets all array and variables to their default values
    skip = false;
    clockwise = true;
    topCard = null;
    cardChoice = null;
    playerHand.splice(0, playerHand.length);
    cp1Hand.splice(0, cp1Hand.length);
    cp2Hand.splice(0, cp2Hand.length);
    shuffledPile.splice(0, shuffledPile.length);
    discardPile.splice(0, discardPile.length);
    cpPlayablePile.splice(0, cpPlayablePile.length);
    deckSize = 52;
    draw2Cards = 0;
    draw6Cards = 0;
    // Sets all HTML elements to their default states
    $(".suit-choice").empty();
    $(".player-hand").empty();
    $("#draw-card").text(`Draw Card`);
    $(".play-again-section").css("display", "none");
    $(".player-score").text(`${sessionStorage.getItem("username")} - Your current score: ${playerScore}`);
    $(".cp1-score").text(`Current Score: ${cp1Score}`);
    $(".cp2-score").text(`Current Score: ${cp2Score}`);

    await shuffleDeck(); // shuffles deck once document is ready 

};


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

// Deals the initial hand for all players
const dealInitialHand = () => {
    dealHand(playerHand);
    dealHand(cp1Hand);
    dealHand(cp2Hand);
    randomizer = Math.floor(Math.random() * deckSize);
    topCard = shuffledPile[randomizer];
    shuffledPile.splice(randomizer, 1);
    $("#card-pile").html(`
    <img src="${topCard.image}" width="113" height="157">
    `);
    $("#card-pile-phone").html(`
    <img src="${topCard.image}" width="70" height="98">
    `);

    randomizer = undefined;

    displayHand(playerHand);
    displayComputerPlayer1Hand();
    displayComputerPlayer2Hand();
};

// Deal Hand Function
const dealHand = (hand) => {
    for (let i = 0; i < 8; i++) {
        randomizer = Math.floor(Math.random() * deckSize);
        hand.push(shuffledPile[randomizer]);
        shuffledPile.splice(randomizer, 1);
        deckSize -= 1;
    }
};



/**
 * Displays the user's hand to the user. Checks to see what the current game state is and what cards are currently playable.
 * @param {Array} hand The hand that will be passed through (in this case, it is always playerHand)
 */
const displayHand = (hand) => {
    skip = false;
    $(".player-hand").empty();
    $(".player-hand-phone").empty();
    if (draw6Cards > 0) {
        draw6CardsCheckerPlayer(hand);
    } else if (draw2Cards > 0) {
        draw2CardsCheckerPlayer(hand);
    } else if (suitChoice) {
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
    console.log("Player Turn");
    if (clickableCount > 0) {
        $(".draw-card-section").css("display", "none");
        suitChoice = undefined;
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
    CPDisplay(cp1Hand, cp1DOM);
    CPDisplayPhone(cp1Hand, cp1DOMPhone);
    $(".cp1-text").text(`Computer Player 1 - Card Total: ${cp1Hand.length}`)

};

const displayComputerPlayer2Hand = () => {
    let cp2DOM = $(".cp2");
    let cp2DOMPhone = $(".cp2-phone");
    cp2DOM.empty();
    cp2DOMPhone.empty();
    CPDisplay(cp2Hand, cp2DOM);
    CPDisplayPhone(cp2Hand, cp2DOMPhone);
    $(".cp2-text").text(`Computer Player 2 - Card Total: ${cp2Hand.length}`)
};

const CPDisplay = (hand, DOMElement) => {
    if (hand.length < 8) {
        for (let i = 0; i < hand.length - 1; i++) {
            faceDownImageLargeOnly(DOMElement);
        }
    } else {
        for (let i = 0; i < 7; i++) {
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
    drawCard(playerHand);
    displayHandDrawCard(playerHand);
    if (clockwise == false) {
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
    let buffer = playerHand.filter(card => {
        return (card.value === words[0] && card.suit === words[2])
    });
    cardChoice = buffer[0];
};

const addToPile = async () => {
    $(".suit-choice").empty();
    $(".card-choice").remove();
    $(".text-container, .suit-container, .button-container").css("display", "none");
    if (topCard) {
        discardPile.push(topCard);
    }
    topCard = cardChoice;
    removeCardFromHand(playerHand, `${sessionStorage.getItem("username")}`)
    $("#card-pile").html(`
    <img src="${topCard.image}" width="113" height="157">
    `);
    $("#card-pile-phone").html(`
    <img src="${topCard.image}" width="70" height="98">
    `);
    if (playerHand.length == 0) {
        playerScore += 1;
        $("#end-of-game-text").text("You Win! Play Again?");
        $(".play-again-section").css("display", "block");
    } else if (clockwise == true && skip == false || clockwise == false && skip) {
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
    skip = false;
    console.log("CP1 Turn");
    gameStateChecker(cp1Hand);
    takeTurn(cp1Hand, "Computer Player 1");
    displayComputerPlayer1Hand();
    if (cp1Hand.length == 0) {
        cp1Score += 1;
        $("#end-of-game-text").text("Computer Player 1 Wins! Play Again?");
        $(".play-again-section").css("display", "block");
    } else if (clockwise == true & skip == false || clockwise == false && skip) {
        setTimeout(() => {
            cp2Turn();
        }, 1000)
    } else {
        displayHand(playerHand);
    }
}

/**
 * This functions calls Computer Player 2's Turn
 */
const cp2Turn = () => {
    skip = false;
    console.log("CP2 Turn");
    gameStateChecker(cp2Hand);
    takeTurn(cp2Hand, "Computer Player 2");
    displayComputerPlayer2Hand();
    if (cp2Hand.length == 0) {
        cp2Score += 1;
        $("#end-of-game-text").text("Computer Player 2 Wins! Play Again?");
        $(".play-again-section").css("display", "block");
    } else if (clockwise == true && skip == false || clockwise == false && skip) {
        displayHand(playerHand);
    } else {
        setTimeout(() => {
            cp1Turn();
        }, 1000)
    }
}

const gameStateChecker = (hand) => {
    if (draw6Cards > 0) {
        draw6CardsChecker(hand);
    } else if (draw2Cards > 0) {
        draw2CardsChecker(hand);
    } else if (suitChoice) {
        suitChoiceChecker(hand);
    } else {
        eligibilityChecker(hand);
    };
};

const takeTurn = (hand, player) => {
    if (cpPlayablePile.length == 0) {
        drawCard(hand);
    } else {
        pushCardToPile(hand, player);
    };
}
/**
 * 
 * The following function takes the player's hand as a parameter and draws a card from the deck to that player's hand
 */
const drawCard = (hand) => {
    emptyPileChecker();
    if (draw6Cards > 0) {
        for (let i = 0; i < draw6Cards; i++) {
            emptyPileChecker();
            draw(hand);
        };
        draw6Cards = 0;
    } else if (draw2Cards > 0) {
        for (let i = 0; i < draw2Cards; i++) {
            emptyPileChecker();
            draw(hand);
        };
        draw2Cards = 0;
    } else {
        draw(hand);
    };
};

const emptyPileChecker = () => {
    if (shuffledPile.length < 1) {
        for (let i = 0; i < discardPile.length; i++) {
            randomizer = Math.floor(Math.random() * discardPile.length);
            shuffledPile.push(discardPile[randomizer]);
            discardPile.splice(randomizer, 1);
        };
    };
};

const draw = (hand) => {
    randomizer = Math.floor(Math.random() * shuffledPile.length)
    hand.push(shuffledPile[randomizer]);
    shuffledPile.splice(randomizer, 1);
}


/**
 * The following functions check the state of the game to see what cards are playable for the non-computer player.
 */
const draw6CardsCheckerPlayer = (hand) => {
    for (let card of hand) {
        if (card.value == "ACE" && card.suit == "SPADES") {
            setClickable(card);
            clickableCount += 1
        } else {
            setNotClickable(card);
        };
        $("#draw-card").text(`Draw ${draw6Cards} Cards`);
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
        $("#draw-card").text(`Draw ${draw2Cards} Cards`);
    };
};


const suitChoiceCheckerPlayer = (hand) => {
    for (let card of hand) {
        if (card.value == "8" || card.suit == suitChoice) {
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
        if (card.value == "8" || ((card.suit === topCard.suit) || (card.value === topCard.value))) {
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
            cpPlayablePile.push(card);
        };
    };
}

const draw6CardsChecker = (hand) => {
    for (let card of hand) {
        if (card.value == "ACE" && card.suit == "SPADES") {
            cpPlayablePile.push(card);
        }
    }
}

const suitChoiceChecker = (hand) => {
    for (let card of hand) {
        if (card.value == "8" || card.suit == suitChoice) {
            cpPlayablePile.push(card);
        }
    }
};

const eligibilityChecker = (hand) => {
    for (let card of hand) {
        if (card.value == "8" || ((card.suit === topCard.suit) || (card.value === topCard.value))) {
            cpPlayablePile.push(card);
        };
    };
};

/**
 * Pushes the a random playable card from the computer player's hand to the pile.
 */
const pushCardToPile = (hand, player) => {
    $(".suit-choice").empty();
    suitChoice = undefined;
    discardPile.push(topCard);
    topCard = cpPlayablePile[Math.floor(Math.random() * cpPlayablePile.length)];
    removeCardFromHand(hand, player);
    cpPlayablePile.length = 0;
    $("#card-pile").html(`
    <img src="${topCard.image}" width="113" height="157">
    `);
    $("#card-pile-phone").html(`
    <img src="${topCard.image}" width="70" height="98">
    `);
}


const removeCardFromHand = (hand, player) => {
    if (hand.includes(topCard) == true) {
        let index1 = hand.indexOf(topCard);
        hand.splice(index1, 1);
        gameStateSetter(hand, player);
    };
}

const gameStateSetter = (hand, player) => {
    if (topCard.value == "2") {
        draw2Cards += 2;
    } else if (topCard.value == "ACE") {
        clockwise = !clockwise;
        if (topCard.suit == "SPADES") {
            draw6Cards += 6
        }
    } else if (topCard.value == "JACK") {
        skip = true;
    } else if (topCard.value == "8") {
        if (hand != playerHand) {
            suitChoice = suits[Math.floor(Math.random() * suits.length)]
        };
        $(".suit-choice").text(`${player} has chosen ${suitChoice}`);
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

    if (card.value == "8") {
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

// module.exports = { playerHand };