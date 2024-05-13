let shuffledPile = [];
let playerHand = [];
let cp1Hand = [];
let cp2Hand = [];
let discardPile = [];
let cpPlayablePile = [];

let suits = ["HEARTS", "DIAMONDS", "SPADES", "CLUBS"];

let deckSize;

let draw2Cards = 0;

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
 * This code below sets all th event listeners in the document once ready. jQuery is predominantly used to achieve this
 */
$(document).ready(function () {

    $("#start-game").on("click", function () {
        $("#enter-username").css("display", "block");
        $(".title-container").css("display", "none");
    });

    $("#username-form").one("submit", function (event) {
        event.preventDefault();
        userName = $("#user-name").val();
        sessionStorage.setItem("username", userName);
        $(this).submit();
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

    $("#yes").on("click", function () {
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
        suitChoice = $(this).attr("id");
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

});

const clickEventSetter = () => {
    $(".text-container").css("display", "block");
    if (cardChoice.value == "8") {
        $(".suit-container").css("display", "block");
    } else {
        $(".button-container").css("display", "block");
    }
    $(document).off("click", ".clickable");
};

/**
 * The following functions fetch the deck data from the Deck of Cards API, then "draws" all of these cards into a ShuffledPile array. The players hand is then drawn by randomly selecting
 * an index of that array, pushing that item to the playerHand array, then deleting that object from the ShuffledPile array. The image of the card is then displayed to the DOM by obtaining the image
 * data inside the card object, and manipulating the HTML to include an <img> with this data as it's source (src).
 */


const startGame = async () => {
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
    $(".suit-choice").empty();
    $(".player-hand").empty();
    $("#draw-card").text(`Draw Card`);
    $(".play-again-section").css("display", "none");
    $(".player-score").text(`${sessionStorage.getItem("username")} - Your current score: ${playerScore}`);
    $(".cp1-score").text(`Current Score: ${cp1Score}`);
    $(".cp2-score").text(`Current Score: ${cp2Score}`);

    await shuffleDeck(); // shuffles deck once document is ready 

};

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
    dealHand(playerHand);
    dealHand(cp1Hand);
    dealHand(cp2Hand);
    randomizer = Math.floor(Math.random() * deckSize);
    topCard = shuffledPile[randomizer];
    shuffledPile.splice(randomizer, 1);
    $(".card-image-pile").html(`
    <img src="${topCard.image}" width="113" height="157">
    `);
    randomizer = undefined;

    displayHand(playerHand);
    displayComputerPlayer1Hand();
    displayComputerPlayer2Hand();
};

const dealHand = (hand) => {
    for (let i = 0; i < 8; i++) {
        randomizer = Math.floor(Math.random() * deckSize);
        hand.push(shuffledPile[randomizer]);
        shuffledPile.splice(randomizer, 1)
        deckSize -= 1;
    };
}


/**
 * Displays the user's hand to the user. Checks to see what the current game state is and what cards are currently playable.
 */
const displayHand = (hand) => {
    if (skip) {
        skip = false;
        if (clockwise == false) {
            cp2Turn();
        } else {
            cp1Turn();
        }
    }
    console.log("Player Turn");
    $(".player-hand").empty();
    if (draw2Cards > 0) {
        draw2CardsCheckerPlayer(hand);
    } else if (suitChoice) {
        suitChoiceCheckerPlayer(hand);
    } else {
        eligibilityCheckerPlayer(hand);
    };
    displayChecker();
};

const displayChecker = () => {
    if (clickableCount > 0) {
        $(".draw-card-section").css("display", "none");
        suitChoice = undefined;
        clickableCount = 0;
    } else {
        $(".draw-card-section").css("display", "block");
    };

};

const displayComputerPlayer1Hand = () => {
    let cp1DOM = $(".cp1");
    cp1DOM.empty();
    CPDisplay(cp1Hand, cp1DOM);
    $(".cp1-text").text(`Computer Player 1 - Card Total: ${cp1Hand.length}`)

};

const displayComputerPlayer2Hand = () => {
    let cp2DOM = $(".cp2");
    cp2DOM.empty();
    CPDisplay(cp2Hand, cp2DOM);
    $(".cp2-text").text(`Computer Player 2 - Card Total: ${cp2Hand.length}`)
};

const CPDisplay = (hand, DOMElement) => {
    if (hand.length > 0) {
        DOMElement.append(`
        <div class="col-1 face-down-image right">
            <img src="https://www.deckofcardsapi.com/static/img/back.png" width="113" height="157">
        </div>`);
    }
    if (hand.length < 8) {
        for (let i = 0; i < hand.length - 1; i++) {
            DOMElement.append(`
            <div class="col-1 d-none d-md-inline-block face-down-image right">
                <img src="https://www.deckofcardsapi.com/static/img/back.png" width="113" height="157">
            </div>`);
        }
    } else {
        for (let i = 0; i < 7; i++) {
            DOMElement.append(`
            <div class="col-1 d-none d-md-inline-block face-down-image right">
                <img src="https://www.deckofcardsapi.com/static/img/back.png" width="113" height="157">
            </div>
            `);
        };
    };
};

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


const displayHandDrawCard = (hand) => {
    $(".player-hand").empty();
    for (let card of hand) {
        $(".player-hand").append(`
        <div class="col-1 card-image not-clickable" id="${card.value}-of-${card.suit}">
        <img src="${card.image}" width="113" height="157">
        </div>
        `);
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
};

const addToPile = async () => {
    $(".suit-choice").empty();
    $(".card-choice").remove();
    $(".text-container, .suit-container, .button-container").css("display", "none");
    if (topCard) {
        discardPile.push(topCard);
    }
    topCard = cardChoice;

    removeCardFromHand(playerHand, `${sessionStorage.getItem("username")}`);

    if (topCard == undefined) {
        console.log("Couldnt load card");
    } else {
        $(".card-image-pile").html(`
    <img src="${topCard.image}" width="113" height="157">
    `);
    };
    if (playerHand.length == 0) {
        playerScore += 1;
        $("#end-of-game-text").text("You Win! Play Again?");
        $(".play-again-section").css("display", "block");
    } else if (clockwise == false) {
        setTimeout(() => {
            cp2Turn();
        }, 1000)
    } else {
        setTimeout(() => {
            cp1Turn();
        }, 1000)
    };
};

/**
 * This functions calls Computer Player 1's Turn
 */
const cp1Turn = () => {
    if (skip) {
        skip = false;
        if (clockwise == false) {
            displayHand(playerHand)
        } else {
            cp2Turn();
        }
    } else {
        console.log("CP1 Turn");
        if (draw2Cards > 0) {
            draw2CardsChecker(cp1Hand);
        } else if (suitChoice) {
            suitChoiceChecker(cp1Hand);
        } else {
            eligibilityChecker(cp1Hand);
        }
        if (cpPlayablePile.length == 0) {
            drawCard(cp1Hand);
        } else {
            pushCardToPile(cp1Hand, "Computer Player 1");
        };
        displayComputerPlayer1Hand();
        if (cp1Hand.length == 0) {
            cp1Score += 1;
            $("#end-of-game-text").text("Computer Player 1 Wins! Play Again?");
            $(".play-again-section").css("display", "block");
        } else if (clockwise == false) {
            displayHand(playerHand);
        } else {
            setTimeout(() => {
                cp2Turn();
            }, 1000)
        }
    }

};

/**
 * This functions calls Computer Player 2's Turn
 */
const cp2Turn = () => {
    if (skip) {
        skip = false;
        if (clockwise == false) {
            cp1Turn();
        } else {
            displayHand(playerHand);
        }
    } else {
        console.log("CP2 Turn");
        if (draw2Cards > 0) {
            draw2CardsChecker(cp2Hand);
        } else if (suitChoice) {
            suitChoiceChecker(cp2Hand);
        } else {
            eligibilityChecker(cp2Hand);
        };
    
        if (cpPlayablePile.length == 0) {
            drawCard(cp2Hand);
        } else {
            pushCardToPile(cp2Hand, "Computer Player 2");
        };
        displayComputerPlayer2Hand();
        if (cp2Hand.length == 0) {
            cp2Score += 1;
            $("#end-of-game-text").text("Computer Player 2 Wins! Play Again?");
            $(".play-again-section").css("display", "block");
        } else if (clockwise == false) {
            setTimeout(() => {
                cp1Turn();
            }, 1000)
        } else {
            displayHand(playerHand);
        }
    } 
};

/**
 * 
 * The following function takes the player's hand as a parameter and draws a card from the deck to that player's hand
 */
const drawCard = (hand) => {
    if (shuffledPile.length < 1) {
        for (let i = 0; i < discardPile.length; i++) {
            randomizer = Math.floor(Math.random() * discardPile.length);
            shuffledPile.push(discardPile[randomizer]);
            discardPile.splice(randomizer, 1);
        };
    };
    if (draw2Cards > 0) {
        for (let i = 0; i < draw2Cards; i++) {
            randomizer = Math.floor(Math.random() * shuffledPile.length)
            hand.push(shuffledPile[randomizer]);
            shuffledPile.splice(randomizer, 1);
        };
        draw2Cards = 0;
    } else {
        randomizer = Math.floor(Math.random() * shuffledPile.length)
        hand.push(shuffledPile[randomizer]);
        shuffledPile.splice(randomizer, 1);
    };
};

/**
 * Helper Functions
 */
const draw2CardsCheckerPlayer = (hand) => {
    for (let card of hand) {
        if (card.value == "2") {
            $(".player-hand").append(`
        <div class="col-1 card-image clickable" data-card="${card.value}-of-${card.suit}">
        <img src="${card.image}" width="113" height="157">
        </div>
        `);
            clickableCount += 1
        } else {
            $(".player-hand").append(`
        <div class="col-1 card-image not-clickable" data-card="${card.value}-of-${card.suit}">
        <img src="${card.image}" width="113" height="157">
        </div>
        `);
        };
        $("#draw-card").text(`Draw ${draw2Cards} Cards`);
    };
};

const suitChoiceCheckerPlayer = (hand) => {
    for (let card of hand) {
        if (card.value == "8" || card.suit == suitChoice) {
            $(".player-hand").append(`
        <div class="col-1 card-image clickable" data-card="${card.value}-of-${card.suit}">
        <img src="${card.image}" width="113" height="157">
        </div>
        `);
            clickableCount += 1
        } else {
            $(".player-hand").append(`
        <div class="col-1 card-image not-clickable" data-card="${card.value}-of-${card.suit}">
        <img src="${card.image}" width="113" height="157">
        </div>
        `);
        };
        $("#draw-card").text(`Draw Card`);
    }
};

const eligibilityCheckerPlayer = (hand) => {
    for (let card of hand) {
        if (card.value == "8" || ((card.suit === topCard.suit) || (card.value === topCard.value))) {
            $(".player-hand").append(`
        <div class="col-1 card-image clickable" data-card="${card.value}-of-${card.suit}">
        <img src="${card.image}" width="113" height="157">
        </div>
        `);
            clickableCount += 1
        } else {
            $(".player-hand").append(`
        <div class="col-1 card-image not-clickable" data-card="${card.value}-of-${card.suit}">
        <img src="${card.image}" width="113" height="157">
        </div>
        `);
        };
        $("#draw-card").text(`Draw Card`);
    };
};

const draw2CardsChecker = (hand) => {
    for (let card of hand) {
        if (card.value == "2") {
            cpPlayablePile.push(card);
        };
    };
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

const pushCardToPile = (hand, player) => {
    $(".suit-choice").empty();
    suitChoice = undefined;
    discardPile.push(topCard);
    topCard = cpPlayablePile[Math.floor(Math.random() * cpPlayablePile.length)];
    removeCardFromHand(hand, player);
    cpPlayablePile.length = 0;
    $(".card-image-pile").html(`
    <img src="${topCard.image}" width="113" height="157">
    `);
}

const removeCardFromHand = (hand, player) => {
    if (hand.includes(topCard) == true) {
        let index1 = hand.indexOf(topCard);
        hand.splice(index1, 1);
        if (topCard.value == "2") {
            draw2Cards += 2;
        } else if (topCard.value == "ACE") {
            clockwise = !clockwise;
        } else if (topCard.value == "JACK") {
            skip = true;
        } else if (topCard.value == "8") {
            if (hand != playerHand) {
                suitChoice = suits[Math.floor(Math.random() * suits.length)]
            };
            $(".suit-choice").text(`${player} has chosen ${suitChoice}`);
        }
    };
}