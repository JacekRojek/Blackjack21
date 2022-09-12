import { Card, Deck, Game, Player } from './game'

const SAM = 'sam'
const DEALER = 'dealer'

const testValidGameInput = (data: string, winner: string, p1Cards?: string[], p2Cards?: string[]) => {
  const sam = new Player(SAM, (game: Game) => game.players[0].score < 17)
  const dealer = new Player(DEALER, (game: Game) => game.players[1].score <= game.players[0].score)
  const game: Game = new Game(new Deck(data), [sam, dealer])
  game.start()
  expect(game.winner.name).toStrictEqual(winner)
  if (p1Cards) {
    expect(game.players[0].cards.map((c) => c.toString())).toStrictEqual(p1Cards)
  }
  if (p2Cards) {
    expect(game.players[1].cards.map((c) => c.toString())).toStrictEqual(p2Cards)
  }
}

describe('throw error on invalid input', () => {
  test('invalid Card', () => {
    try {
      const sam = new Player(SAM, (game: Game) => game.players[0].score < 17)
      const dealer = new Player(DEALER, (game: Game) => game.players[1].score <= game.players[0].score)
      const game: Game = new Game(new Deck('CX, D5, H9, HQ, S8'), [sam, dealer])
    } catch (e) {
      expect(e.message).toBe('Invalid input')
    }
  })

  test('not enough cards', () => {
    try {
      const sam = new Player(SAM, (game: Game) => game.players[0].score < 17)
      const dealer = new Player(DEALER, (game: Game) => game.players[1].score <= game.players[0].score)
      const game: Game = new Game(new Deck('CA, D5, H9'), [sam, dealer])
    } catch (e) {
      expect(e.message).toBe('Invalid input')
    }
  })
})

describe('valid game', () => {
  test('sam winning conditions', () => {
    testValidGameInput('CA, D5, H9, HQ, S8', SAM, ['CA', 'H9'], ['D5', 'HQ', 'S8'])
    testValidGameInput('CJ, C5, C10, CQ, C8', SAM)
    testValidGameInput('CJ, C5, CJ, CQ, C8', SAM)
    testValidGameInput('C5, D5, C6, DQ, C10', SAM, ['C5', 'C6', 'C10'], ['D5', 'DQ'])
    testValidGameInput('C5, D5, C6, DQ, H4, H6', SAM)
    testValidGameInput('C5, D5, C6, DQ, H4, H5, DA, DJ', SAM)
  })
  test('dealer winning conditions', () => {
    testValidGameInput('CA, DA, HA, SA, H4, H7', DEALER)
    testValidGameInput('C5, D5, C6, DQ, H4, H7', DEALER)
    testValidGameInput('CA, D5, C5, DQ, HA, H7', DEALER)
    testValidGameInput('CA, D5, C5, DQ, H2, H6', DEALER)
  })
})
