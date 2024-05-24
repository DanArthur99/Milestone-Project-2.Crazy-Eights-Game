/**
 * @jest-environment jsdom
 */

const { default: expect } = require("expect");
const {
    gameArrays,
    gameStates,
    draw,
    dealHand,
    resetAll,
    gameStateSetter,
    cardChoiceBuffer,
    emptyPileChecker
} = require("../script");

describe("resetAll function works correctly", () => {
    beforeAll(() => {
        gameArrays.shuffledPile = [1, 2, 3],
        gameArrays.playerHand = [1, 2, 3],
        gameArrays.cp1Hand = [1, 2, 3],
        gameArrays.cp2Hand = [1, 2, 3],
        gameArrays.discardPile = [1, 2, 3],
        gameArrays.cpPlayablePile = [1, 2, 3],
        gameStates.deckSize = 40,
        gameStates.draw2Cards = 4,
        gameStates.draw6Cards = 6,
        gameStates.clockwise = false,
        gameStates.skip = true,
        gameStates.cardChoice = { value: "7", suit: "HEARTS" },
        gameStates.topCard = { value: "7", suit: "HEARTS" }
        gameStates.suitChoice = "SPADES"
        resetAll();
    });
    test("The playerHand array should be set to empty once the startGame is called", () => {
        expect(gameArrays.playerHand.length).toBe(0);
    });
    test("The shuffledPile Array should be set to empty", () => {
        expect(gameArrays.shuffledPile.length).toBe(0);
    })
    test("The cp1Hand Array should be set to empty", () => {
        expect(gameArrays.cp1Hand.length).toBe(0);
    })
    test("The cp2Hand Array should be set to empty", () => {
        expect(gameArrays.cp2Hand.length).toBe(0);
    })
    test("The discardPile Array should be set to empty", () => {
        expect(gameArrays.discardPile.length).toBe(0);
    })
    test("The cpPlayablePile Array should be set to empty", () => {
        expect(gameArrays.cpPlayablePile.length).toBe(0);
    })
    test("The deck should be set to 104", () => {
        expect(gameStates.deckSize).toEqual(104);
    })
    test("The draw6Cards variable be set to 0", () => {
        expect(gameStates.draw6Cards).toBe(0);
    })
    test("The draw2Cards variable should be set to 0", () => {
        expect(gameStates.draw2Cards).toBe(0);
    })
    test("The clockwise variable should be set to true", () => {
        expect(gameStates.clockwise).toBe(true);
    })
    test("The skip variable should be set to false", () => {
        expect(gameStates.skip).toBe(false);
    })
    test("The cardChoice variable should be set to null", () => {
        expect(gameStates.cardChoice).toBe(null);
    })
    test("The topCard variable should be set to null", () => {
        expect(gameStates.topCard).toBe(null);
    })
    test("The suitChoice variable should be set to 0", () => {
        expect(gameStates.suitChoice).toBe(null);
    })
});

describe("Deal Hand function test", () => {
    test("playerHand should have an array of 8", () => {
        gameArrays.playerHand = []
        dealHand(gameArrays.playerHand);
        expect(gameArrays.playerHand.length).toBe(8);
    });
    test("cp1Hand should have an array of 8", () => {
        gameArrays.cp1Hand = []
        dealHand(gameArrays.cp1Hand);
        expect(gameArrays.cp1Hand.length).toBe(8);
    });
    test("cp2Hand should have an array of 8", () => {
        gameArrays.cp2Hand = [];
        dealHand(gameArrays.cp2Hand);
        expect(gameArrays.cp2Hand.length).toBe(8);
    });
}) 

describe("gameStateSetter function tests", () => {
    test("gameStates will add two to the draw2Cards property if the latest top card is a 2", () => {
        gameStates.draw2Cards = 0;
        gameStates.topCard = {suit: "HEARTS", value: "2"};
        gameStateSetter(gameArrays.cp1Hand, "cp1");
        expect(gameStates.draw2Cards).toBe(2);
    });
    test("gameStates will add six to the draw6Cards property if the latest top card is an Ace of Spades", () => {
        gameStates.draw6Cards = 6;
        gameStates.topCard = {suit: "SPADES", value: "ACE"};
        gameStateSetter(gameArrays.cp1Hand, "cp1");
        expect(gameStates.draw6Cards).toBe(12);
    });
    test("gameStates will inverse the value of clockwise if the latest top card is an Ace", () => {
        gameStates.clockwise = true;
        gameStates.topCard = {suit: "SPADES", value: "ACE"}
        gameStateSetter(gameArrays.cp1Hand, "cp1");
        expect(gameStates.clockwise).toBe(false);
    })
    test("gameStates will set skip to true if the latest top card is a Jack", () => {
        gameStates.skip = false;
        gameStates.topCard = {suit: "SPADES", value: "JACK"};
        gameStateSetter(gameArrays.cp1Hand, "cp1");
        expect(gameStates.skip).toBe(true);
    })
    test("gameStates will assign a value to suitChoice if the latest top card is an 8", () => {
        gameStates.suitChoice = null;
        gameStates.topCard = {suit: "SPADES", value: "8"};
        gameStateSetter(gameArrays.cp1Hand, "cp1");
        expect(gameStates.suitChoice).toBeTruthy();
    });
})

describe("cardChoiceBuffer function test", () => {
    beforeEach(() => {
        gameArrays.playerHand = [{value: "4", suit: "SPADES"}, {value: "6", suit: "HEARTS"}];
    })
    test("should assign a value to cardChoice based on the string passed through the function", () => {
        cardChoiceBuffer("4-of-SPADES");
        expect(gameStates.cardChoice).toEqual({value: "4", suit: "SPADES"});
    });
});

describe("EmptyPileChecker function test", () => {
    test("contents of discardPile should be transferred to the shuffledPile when called", () => {
        gameArrays.discardPile = [1, 2, 3];
        gameArrays.shuffledPile = [];
        emptyPileChecker();
        expect(gameArrays.discardPile.length).toBe(0)
        expect(gameArrays.shuffledPile.length).toBe(3);
    })
    test("contents nothing should happen if the shuffled Pile is not empty", () => {
        gameArrays.discardPile = [1, 2, 3];
        gameArrays.shuffledPile = [1];
        emptyPileChecker();
        expect(gameArrays.discardPile.length).toBe(3)
        expect(gameArrays.shuffledPile.length).toBe(1);
    })
});

describe("draw function tests", () => {
    test("draw function should add card to playerHand array", () => {
        gameArrays.playerHand = [1, 3, 4];
        draw(gameArrays.playerHand);
        expect(gameArrays.playerHand.length).toBe(4);
    })
    test("draw function should add card to cp1Hand array", () => {
        gameArrays.cp1Hand = [1, 3, 4, 5, 9];
        draw(gameArrays.cp1Hand);
        expect(gameArrays.cp1Hand.length).toBe(6);
    })
    test("draw function should add card to cp2Hand array", () => {
        gameArrays.cp2Hand = [1, 11];
        draw(gameArrays.cp2Hand);
        expect(gameArrays.cp2Hand.length).toBe(3);
    })
})