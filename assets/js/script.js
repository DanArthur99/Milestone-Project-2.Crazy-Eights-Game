let playerHand = [];
let layPile = [];

/**
 * The following function creates a new shuffled deck from the Deck of Cards API
 */
$(document).ready(function () {

    $("#decision-text").hide();
    $(".button-container").hide();

    shuffleDeck(); // shuffles deck once document is ready   

    $(".card-image").on("click", function () {
        $(this).addClass("card-choice");
        $("#decision-text").show();
        $(".button-container").show();
        $(".card-image").off();
    });

    $("#no").on("click", function () {
        $(".card-image").removeClass("card-choice");
        $("#decision-text").hide();
        $(".button-container").hide();
        $(".card-image").on("click", function () {
            $(this).addClass("card-choice");
            $("#decision-text").show();
            $(".button-container").show();
            $(".card-image").off();
        });
    });
    $("#yes").on("click", function() {
        $(".card-choice").html(" ");
        $(".card-image").removeClass("card-choice");
        $("#decision-text").hide();
        $(".button-container").hide();
        $(".card-image").on("click", function () {
            $(this).addClass("card-choice");
            $("#decision-text").show();
            $(".button-container").show();
            $(".card-image").off();
        });
        
    })
});


const shuffleDeck = () => {
    fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
        .then(response => response.json())
        .then(response => {
            newShuffledDeckKey = response.deck_id;
            console.log(response);
            dealHand();
        });
};

const dealHand = () => {
    fetch(`https://www.deckofcardsapi.com/api/deck/${newShuffledDeckKey}/draw/?count=8`)
        .then(response => response.json())
        .then(card => {
            for (let i = 0; i < 8; i++) {
                $(`#card-image-${i}`).html(`
            <img src="${card.cards[i].image}" alt="${card.cards[i].value} of ${card.cards[i].suit}" width="113" height="157">`);
            playerHand.push({"value": card.cards[i].value, "suit": card.cards[i].suit})
            };
            console.log(card);
            console.log(playerHand);
        });
};

