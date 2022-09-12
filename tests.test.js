"use strict";
exports.__esModule = true;
var game_1 = require("./game");
var SAM = 'sam';
var DEALER = 'dealer';
var testValidGameInput = function (data, winner, p1Cards, p2Cards) {
    var sam = new game_1.Player(SAM, function (game) { return game.players[0].score < 17; });
    var dealer = new game_1.Player(DEALER, function (game) { return game.players[1].score <= game.players[0].score; });
    var game = new game_1.Game(new game_1.Deck(data), [sam, dealer]);
    game.start();
    expect(game.winner.name).toStrictEqual(winner);
    if (p1Cards) {
        expect(game.players[0].cards.map(function (c) { return c.toString(); })).toStrictEqual(p1Cards);
    }
    if (p2Cards) {
        expect(game.players[1].cards.map(function (c) { return c.toString(); })).toStrictEqual(p2Cards);
    }
};
describe('throw error on invalid input', function () {
    test('invalid Card', function () {
        try {
            var sam = new game_1.Player(SAM, function (game) { return game.players[0].score < 17; });
            var dealer = new game_1.Player(DEALER, function (game) { return game.players[1].score <= game.players[0].score; });
            var game = new game_1.Game(new game_1.Deck('CX, D5, H9, HQ, S8'), [sam, dealer]);
        }
        catch (e) {
            expect(e.message).toBe('Invalid input');
        }
    });
    test('not enough cards', function () {
        try {
            var sam = new game_1.Player(SAM, function (game) { return game.players[0].score < 17; });
            var dealer = new game_1.Player(DEALER, function (game) { return game.players[1].score <= game.players[0].score; });
            var game = new game_1.Game(new game_1.Deck('CA, D5, H9'), [sam, dealer]);
        }
        catch (e) {
            expect(e.message).toBe('Invalid input');
        }
    });
});
describe('valid game', function () {
    test('sam winning conditions', function () {
        testValidGameInput('CA, D5, H9, HQ, S8', SAM, ['CA', 'H9'], ['D5', 'HQ', 'S8']);
        testValidGameInput('CJ, C5, C10, CQ, C8', SAM);
        testValidGameInput('CJ, C5, CJ, CQ, C8', SAM);
        testValidGameInput('C5, D5, C6, DQ, C10', SAM, ['C5', 'C6', 'C10'], ['D5', 'DQ']);
        testValidGameInput('C5, D5, C6, DQ, H4, H6', SAM);
        testValidGameInput('C5, D5, C6, DQ, H4, H5, DA, DJ', SAM);
    });
    test('dealer winning conditions', function () {
        testValidGameInput('CA, DA, HA, SA, H4, H7', DEALER);
        testValidGameInput('C5, D5, C6, DQ, H4, H7', DEALER);
        testValidGameInput('CA, D5, C5, DQ, HA, H7', DEALER);
        testValidGameInput('CA, D5, C5, DQ, H2, H6', DEALER);
    });
});
