let shuffledPile = [];
let playerHand = [];
let cp1Hand = [];
let cp2Hand = [];
let discardPile = [];
let cpPlayablePile = [];

let suits = ["HEARTS", "DIAMONDS", "SPADES", "CLUBS"];


let deckSize;

let draw2Cards = 0;

let cardChoice;
let topCard;
let suitChoice;

let randomizer;
let newShuffledDeckKey;

let clickableCount = 0;

let playerScore = 0;
let cp1Score = 0;
let cp2Score = 0;



/**
 * jQuery code that calls the onClick functions via Event Listners
 */



$(document).ready(function () {

    $(document).on("click", ".clickable", function () {
        cardChoiceBuffer($(this).attr("data-card"));
        $(this).addClass("card-choice");
        if (cardChoice.value == "8") {
            $(".text-container").css("display", "block");
            $(".suit-container").css("display", "block");
        } else {
            $(".text-container").css("display", "block");
            $(".button-container").css("display", "block");
        }
        $(document).off("click", ".clickable");
    });

    $(".no").on("click", function () {
        $(".card-image").removeClass("card-choice");
        $(".text-container").css("display", "none");
        $(".button-container").css("display", "none");
        $(".suit-container").css("display", "none");
        $(document).on("click", ".clickable", function () {
            cardChoiceBuffer($(this).attr("data-card"));
            $(this).addClass("card-choice");
            if (cardChoice.value == "8") {
                $(".text-container").css("display", "block");
                $(".suit-container").css("display", "block");
            } else {
                $(".text-container").css("display", "block");
                $(".button-container").css("display", "block");
            }
            $(document).off("click", ".clickable");
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
            if (cardChoice.value == "8") {
                $(".text-container").css("display", "block");
                $(".suit-container").css("display", "block");
            } else {
                $(".text-container").css("display", "block");
                $(".button-container").css("display", "block");
            }
            $(document).off("click", ".clickable");
        });
    });

    $(".suit-button").on("click", function () {
        suitChoice = $(this).attr("id");
        addToPile();
        cardChoice = null;
        $(document).on("click", ".clickable", function () {
            cardChoiceBuffer($(this).attr("data-card"));
            $(this).addClass("card-choice");
            if (cardChoice.value == "8") {
                $(".text-container").css("display", "block");
                $(".suit-container").css("display", "block");
            } else {
                $(".text-container").css("display", "block");
                $(".button-container").css("display", "block");
            }
            $(document).off("click", ".clickable");
        });
    });

    $("#draw-card").on("click", function () {
        $(".draw-card-section").css("display", "none");
        drawCardPlayerClick();
        $(document).on("click", ".clickable", function () {
            cardChoiceBuffer($(this).attr("data-card"));
            $(this).addClass("card-choice");
            if (cardChoice.value == "8") {
                $(".text-container").css("display", "block");
                $(".suit-container").css("display", "block");
            } else {
                $(".text-container").css("display", "block");
                $(".button-container").css("display", "block");
            }
            $(document).off("click", ".clickable");
        })
    });
    $("#play-again").on("click", function () {
        startGame();
    });

    startGame();

});


/**
 * The following functions fetch the deck data from the Deck of Cards API, then "draws" all of these cards into a ShuffledPile array. The players hand is then drawn by randomly selecting
 * an index of that array, pushing that item to the playerHand array, then deleting that object from the ShuffledPile array. The image of the card is then displayed to the DOM by obtaining the image
 * data inside the card object, and manipulating the HTML to include an <img> with this data as it's source (src).
 */


const startGame = async () => {

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
    $(".player-score").text(`Your current score: ${playerScore}`);
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
        shuffledPile.splice(randomizer, 1);
        deckSize -= 1;
    };
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


const displayHand = (hand) => {
    $(".player-hand").empty();
    if (draw2Cards > 0) {
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
    } else if (suitChoice) {
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
    } else {
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
    $(".cp1").empty();
    if (cp1Hand.length < 8) {
        for (let i = 0; i < cp1Hand.length; i++) {
            $(".cp1").append(`
            <div class="col-1 face-down-image right">
                <img src="https://www.deckofcardsapi.com/static/img/back.png" width="113" height="157">
            </div>`);
        }
    } else {
        for (let i = 0; i < 8; i++) {
            $(".cp1").append(`
            <div class="col-1 face-down-image right">
                <img src="https://www.deckofcardsapi.com/static/img/back.png" width="113" height="157">
            </div>
            `);
        };
    };
    $(".cp1-text").text(`Computer Player 1. Card Total: ${cp1Hand.length}`)

}

const displayComputerPlayer2Hand = () => {
    $(".cp2").empty();
    if (cp2Hand.length < 8) {
        for (let i = 0; i < cp2Hand.length; i++) {
            $(".cp2").append(`
            <div class="col-1 face-down-image right">
                <img src="https://www.deckofcardsapi.com/static/img/back.png" width="113" height="157">
            </div>`);
        }
    } else {
        for (let i = 0; i < 8; i++) {
            $(".cp2").append(`
            <div class="col-1 face-down-image right">
                <img src="https://www.deckofcardsapi.com/static/img/back.png" width="113" height="157">
            </div>
            `);
        };
    };
    $(".cp2-text").text(`Computer Player 2. Card Total: ${cp2Hand.length}`)
}

const drawCardPlayerClick = () => {
    $(document).off("click", ".clickable");
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
            playerHand.push(shuffledPile[randomizer]);
            shuffledPile.splice(randomizer, 1);
        }
        draw2Cards = 0;
    } else {
        randomizer = Math.floor(Math.random() * shuffledPile.length)
        playerHand.push(shuffledPile[randomizer]);
        shuffledPile.splice(randomizer, 1);
    };
    displayHandDrawCard(playerHand);
    setTimeout(() => {
        cp1Turn();
    }, 1000);
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

const drawCp1Card = () => {
    if (shuffledPile.length < 1) {
        for (let i = 0; i < discardPile.length; i++) {
            randomizer = Math.floor(Math.random() * discardPile.length);
            shuffledPile.push(discardPile[randomizer]);
            discardPile.splice(randomizer, 1);
        };
    };
    randomizer = Math.floor(Math.random() * shuffledPile.length)
    cp1Hand.push(shuffledPile[randomizer]);
    shuffledPile.splice(randomizer, 1);
};

const drawCp2Card = () => {
    if (shuffledPile.length < 1) {
        for (let i = 0; i < discardPile.length; i++) {
            randomizer = Math.floor(Math.random() * discardPile.length);
            shuffledPile.push(discardPile[randomizer]);
            discardPile.splice(randomizer, 1);
        };
    };
    randomizer = Math.floor(Math.random() * shuffledPile.length)
    cp2Hand.push(shuffledPile[randomizer]);
    shuffledPile.splice(randomizer, 1);
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
    $(".text-container").css("display", "none");
    $(".suit-container").css("display", "none");
    $(".button-container").css("display", "none");
    if (topCard) {
        discardPile.push(topCard);
        topCard = cardChoice;
    } else {
        topCard = cardChoice;
    };

    if (playerHand.includes(topCard) == true) {
        let index0 = playerHand.indexOf(topCard);
        playerHand.splice(index0, 1);
        if (topCard.value == "2") {
            draw2Cards += 2;
            console.log(draw2Cards);
        }
        console.log("Current Top Card");
        console.log(topCard);
    };

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
    } else {
        setTimeout(() => {
            cp1Turn();
        }, 1000)
    };
};


const cp1Turn = () => {
    if (draw2Cards > 0) {
        for (let card of cp1Hand) {
            if (card.value == "2") {
                cpPlayablePile.push(card);
            };
        };
    } else if (suitChoice) {
        for (let card of cp1Hand) {
            if (card.value == "8" || card.suit == suitChoice) {
                cpPlayablePile.push(card);
            }
        }
    } else {
        for (let card of cp1Hand) {
            if (card.value == "8" || ((card.suit === topCard.suit) || (card.value === topCard.value))) {
                cpPlayablePile.push(card);
            };
        };
    }
    if (cpPlayablePile.length == 0) {
        if (draw2Cards > 0) {
            for (let i = 0; i < draw2Cards; i++) {
                drawCp1Card();
            }
            draw2Cards = 0;
        } else {
            drawCp1Card();
        }
    } else {
        $(".suit-choice").empty();
        suitChoice = undefined;
        discardPile.push(topCard);
        topCard = cpPlayablePile[Math.floor(Math.random() * cpPlayablePile.length)];
        if (cp1Hand.includes(topCard) == true) {
            let index1 = cp1Hand.indexOf(topCard);
            cp1Hand.splice(index1, 1);
            if (topCard.value == "2") {
                draw2Cards += 2;
                console.log(draw2Cards);
            } else if (topCard.value == "8") {
                suitChoice = suits[Math.floor(Math.random() * suits.length)];
                $(".suit-choice").text(`Computer Player 1 has chosen ${suitChoice}`);
            }
            console.log("Current Top Card");
            console.log(topCard);
        }
        cpPlayablePile.length = 0;
        $(".card-image-pile").html(`
            <img src="${topCard.image}" width="113" height="157">
                `);
    };
    displayComputerPlayer1Hand();
    if (cp1Hand.length == 0) {
        cp1Score += 1;
        $("#end-of-game-text").text("Computer Player 1 Wins! Play Again?");
        $(".play-again-section").css("display", "block");
    } else {
        setTimeout(() => {
            cp2Turn();
        }, 1000)
    }

};


const cp2Turn = () => {
    if (draw2Cards > 0) {
        for (let card of cp2Hand) {
            if (card.value == "2") {
                cpPlayablePile.push(card);
            };
        };
    } else if (suitChoice) {
        for (let card of cp2Hand) {
            if (card.value == "8" || card.suit == suitChoice) {
                cpPlayablePile.push(card);
            }
        }
    } else {
        for (let card of cp2Hand) {
            if (card.value == "8" || ((card.suit === topCard.suit) || (card.value === topCard.value))) {
                cpPlayablePile.push(card);
            };
        };
    }
    if (cpPlayablePile.length == 0) {
        if (draw2Cards > 0) {
            for (let i = 0; i < draw2Cards; i++) {
                drawCp2Card();
            }
            draw2Cards = 0;
        } else {
            drawCp2Card();
        }

    } else {
        $(".suit-choice").empty();
        suitChoice = undefined;
        discardPile.push(topCard);
        topCard = cpPlayablePile[Math.floor(Math.random() * cpPlayablePile.length)];
        if (cp2Hand.includes(topCard) == true) {
            let index2 = cp2Hand.indexOf(topCard);
            cp2Hand.splice(index2, 1);
            if (topCard.value == "2") {
                draw2Cards += 2;
                console.log(draw2Cards);
            } else if (topCard.value == "8") {
                suitChoice = suits[Math.floor(Math.random() * suits.length)]
                $(".suit-choice").text(`Computer Player 2 has chosen ${suitChoice}`);
            }
            console.log("Current Top Card");
            console.log(topCard);
        };
        cpPlayablePile.length = 0;
        $(".card-image-pile").html(`
            <img src="${topCard.image}" width="113" height="157">
            `);
    };
    displayComputerPlayer2Hand();
    if (cp2Hand.length == 0) {
        cp2Score += 1;
        $("#end-of-game-text").text("Computer Player 2 Wins! Play Again?");
        $(".play-again-section").css("display", "block");
    } else {
        displayHand(playerHand);
    }
};