import { shuffleCards } from './utils/shuffleCards'

type Suit = 'C' | 'D' | 'H' | 'S'
type Symbol = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A'

export class Card {
  suit: Suit
  symbol: Symbol
  constructor(suit, symbol) {
    this.suit = suit
    this.symbol = symbol
  }
  public toString = (): string => {
    return `${this.suit}${this.symbol}`
  }
  public getValue() {
    const { symbol } = this
    return isNaN(Number(symbol)) ? (symbol === 'A' ? 11 : 10) : Number(symbol)
  }
}

export class Deck {
  cards: Card[]
  constructor(fileInput: string) {
    const suits = ['C', 'D', 'H', 'S']
    const symbols = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
    const fullDeck = suits.flatMap((suit) => symbols.map((symbol) => new Card(suit, symbol)))
    if (!fileInput) {
      this.cards = shuffleCards(fullDeck)
    } else {
      const cardsFromFile = fileInput.split(',').map((card) => {
        const [suit, ...symbol] = Array.from(card.trim())
        return new Card(suit, symbol.join(''))
      })
      const allCardsAreValid = cardsFromFile.every((c) => fullDeck.map((c) => c.toString()).includes(c.toString()))
      if (!allCardsAreValid || cardsFromFile.length < 4) {
        throw new Error('Invalid input')
      }
      this.cards = cardsFromFile
    }
  }
}

export class Player {
  name: string
  score: number
  cards: Card[]
  shouldKeepPlaying: (game: Game) => boolean
  constructor(name: string, shouldKeepPlaying) {
    this.name = name
    this.score = 0
    this.cards = []
    this.shouldKeepPlaying = shouldKeepPlaying
  }
  public receiveCard(card: Card) {
    this.cards.push(card)
    this.score = this.cards.reduce((acc, c: Card) => acc + c.getValue(), 0)
  }
  public printHand = (): void => {
    console.log(`${this.name}: ${this.cards.join(', ')}`)
  }
}

export class Game {
  deck?: Deck
  players: Player[]
  winner: Player
  activePlayerIndex: number = 0
  constructor(deck: Deck, players: Player[]) {
    this.deck = deck
    this.players = players
  }
  public start() {
    const [a, b, c, d, ...deck] = this.deck.cards
    this.giveCard(0, a)
    this.giveCard(1, b)
    this.giveCard(0, c)
    this.giveCard(1, d)
    this.deck.cards = deck
    const sam = this.players[0]
    const dealer = this.players[1]
    if (sam.score === 22) {
      this.announceWinner(dealer.score === 22 ? dealer : sam)
      return
    }
    this.playNextCard()
  }
  public announceWinner = (winner: Player): void => {
    this.winner = winner
    console.log(winner.name)
    this.players.map((p) => p.printHand())
  }
  public giveCard = (playerIndex: number, card: Card) => {
    if (!card) {
      throw new Error('Out of cards')
    }
    this.players[playerIndex].receiveCard(card)
  }
  public playNextCard = () => {
    const sam = this.players[0]
    const dealer = this.players[1]
    if (sam.score === 21 || dealer.score > 21) {
      this.announceWinner(sam)
      return
    } else if (sam.score > 21 || dealer.score == 21) {
      this.announceWinner(dealer)
      return
    }
    if (this.players[this.activePlayerIndex].shouldKeepPlaying(this)) {
      const card = this.deck.cards.shift()

      this.giveCard(this.activePlayerIndex, card)
    } else {
      const lastPlayer = this.activePlayerIndex === this.players.length - 1
      if (lastPlayer) {
        this.announceWinner(dealer)
        return
      } else {
        this.activePlayerIndex++
      }
    }
    this.playNextCard()
  }
}
