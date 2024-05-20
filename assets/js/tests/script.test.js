/**
 * @jest-environment jsdom
 */

const { default: expect } = require("expect");
const {
    gameArrays,
    gameStates,
    dealHand,
    resetAll,
    gameStateSetter,
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
        gameStates.clockwise = 6,
        gameStates.skip = true,
        gameStates.cardChoice = { value: "7", suit: "HEARTS" },
        gameStates.topCard = { value: "7", suit: "HEARTS" }
        gameStates.suitChoice = "SPADES"
        resetAll();
    });
    test("The playerHand array should be set to empty once the startGame is called", () => {
        ;
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
    test("The deck should be set to 0", () => {
        expect(gameStates.draw2Cards).toBe(0);
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
    test("gameStaes will add two to the draw2Cards property if the latest top card is a 2", () => {
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