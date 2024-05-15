/**
 * @jest-environment jsdom
 */

const { playerHand } = require("../script");


describe("Variables are all set to default", () => {
    test("The playerHand array should be set to empty once the startGame is called", () => {
        expect(playerHand.length).toBe(0);
    })
})
