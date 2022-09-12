"use strict";
exports.__esModule = true;
exports.shuffleCards = void 0;
/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffleCards(a) {
    var _a;
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [a[j], a[i]], a[i] = _a[0], a[j] = _a[1];
    }
    return a;
}
exports.shuffleCards = shuffleCards;
