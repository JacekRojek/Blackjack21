import * as fs from 'fs'
import { Deck, Game, Player } from './game'

const sam = new Player('sam', (game: Game) => game.players[0].score < 17)
const dealer = new Player('dealer', (game: Game) => game.players[1].score <= game.players[0].score)

const filename = process.argv[2]
if (!filename) {
  const game: Game = new Game(new Deck(undefined), [sam, dealer])
  game.start()
} else {
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
      const game: Game = new Game(new Deck(undefined), [sam, dealer])
      game.start()
    } else {
      const game: Game = new Game(new Deck(data), [sam, dealer])
      game.start()
    }
  })
}
