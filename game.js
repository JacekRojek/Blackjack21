"use strict";
exports.__esModule = true;
exports.Game = exports.Player = exports.Deck = exports.Card = void 0;
var shuffleCards_1 = require("./utils/shuffleCards");
var Card = /** @class */ (function () {
    function Card(suit, symbol) {
        var _this = this;
        this.toString = function () {
            return "".concat(_this.suit).concat(_this.symbol);
        };
        this.suit = suit;
        this.symbol = symbol;
    }
    Card.prototype.getValue = function () {
        var symbol = this.symbol;
        return isNaN(Number(symbol)) ? (symbol === 'A' ? 11 : 10) : Number(symbol);
    };
    return Card;
}());
exports.Card = Card;
var Deck = /** @class */ (function () {
    function Deck(fileInput) {
        var suits = ['C', 'D', 'H', 'S'];
        var symbols = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        var fullDeck = suits.flatMap(function (suit) { return symbols.map(function (symbol) { return new Card(suit, symbol); }); });
        if (!fileInput) {
            this.cards = (0, shuffleCards_1.shuffleCards)(fullDeck);
        }
        var cardsFromFile = fileInput.split(',').map(function (card) {
            var _a = Array.from(card.trim()), suit = _a[0], symbol = _a.slice(1);
            return new Card(suit, symbol.join(''));
        });
        var allCardsAreValid = cardsFromFile.every(function (c) { return fullDeck.map(function (c) { return c.toString(); }).includes(c.toString()); });
        if (!allCardsAreValid || cardsFromFile.length < 4) {
            throw new Error('Invalid input');
        }
        this.cards = cardsFromFile;
    }
    return Deck;
}());
exports.Deck = Deck;
var Player = /** @class */ (function () {
    function Player(name, shouldKeepPlaying) {
        var _this = this;
        this.printHand = function () {
            console.log("".concat(_this.name, ": ").concat(_this.cards.join(', ')));
        };
        this.name = name;
        this.score = 0;
        this.cards = [];
        this.shouldKeepPlaying = shouldKeepPlaying;
    }
    Player.prototype.receiveCard = function (card) {
        this.cards.push(card);
        this.score = this.cards.reduce(function (acc, c) { return acc + c.getValue(); }, 0);
    };
    return Player;
}());
exports.Player = Player;
var Game = /** @class */ (function () {
    function Game(deck, players) {
        var _this = this;
        this.activePlayerIndex = 0;
        this.announceWinner = function (winner) {
            _this.winner = winner;
            console.log(winner.name);
            _this.players.map(function (p) { return p.printHand(); });
        };
        this.giveCard = function (playerIndex, card) {
            if (!card) {
                throw new Error('Out of cards');
            }
            _this.players[playerIndex].receiveCard(card);
        };
        this.playNextCard = function () {
            var sam = _this.players[0];
            var dealer = _this.players[1];
            if (sam.score === 21 || dealer.score > 21) {
                _this.announceWinner(sam);
                return;
            }
            else if (sam.score > 21 || dealer.score == 21) {
                _this.announceWinner(dealer);
                return;
            }
            if (_this.players[_this.activePlayerIndex].shouldKeepPlaying(_this)) {
                var card = _this.deck.cards.shift();
                _this.giveCard(_this.activePlayerIndex, card);
            }
            else {
                var lastPlayer = _this.activePlayerIndex === _this.players.length - 1;
                if (lastPlayer) {
                    _this.announceWinner(dealer);
                    return;
                }
                else {
                    _this.activePlayerIndex++;
                }
            }
            _this.playNextCard();
        };
        this.deck = deck;
        this.players = players;
    }
    Game.prototype.start = function () {
        var _a = this.deck.cards, a = _a[0], b = _a[1], c = _a[2], d = _a[3], deck = _a.slice(4);
        this.giveCard(0, a);
        this.giveCard(1, b);
        this.giveCard(0, c);
        this.giveCard(1, d);
        this.deck.cards = deck;
        var sam = this.players[0];
        var dealer = this.players[1];
        if (sam.score === 22) {
            this.announceWinner(dealer.score === 22 ? dealer : sam);
            return;
        }
        this.playNextCard();
    };
    return Game;
}());
exports.Game = Game;
