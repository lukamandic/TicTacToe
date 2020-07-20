import Server from './server'
import { Datastore } from './datastore'
import { Game } from './game'

let datastore = new Datastore()

const serve = new Server(3900)

serve.addNewType(`
type Query {
  gameHistory(id: Int!): [Game]
}
input GameInfo {
  id: Int
  board: [String!]!
  human: String!
  ai: String!
}
type Game {
  id: Int
  board: [String]
  v: Int
  human: String
  ai: String
  end: String
}
type Mutation {
  newGame(gameInfo: GameInfo!): Game
  newMove(id: Int!, gameInfo: GameInfo!): Game
}
type Subscription {
  gameAdded: Game!
  moveAdded: Game!
}
`)

serve.addNewResolver({
  Subscription: {
    gameAdded: {
      subscribe: (_, __, {pubsub}) => pubsub.asyncIterator('NEW_GAME')
    },
    moveAdded: {
      subscribe: (_, __, {pubsub}) => pubsub.asyncIterator('NEW_MOVE')
    }
  },
  Query: {
    gameHistory: (_, args) => {
      const id = datastore.groupHistoryDataById(args.id)
      return id
    }
  },
  Mutation: {
    newGame: (_, args, {pubsub}) => {
      let game = args.gameInfo

      datastore.history.length == 0 ? game.id = 1 : game.id = datastore.lastGameId() + 1

      game.human == 'o' ? game.ai = 'x' : game.ai = 'o'
      game.v = 1
      game.end = ''

      datastore.insertInHistory(game)

      pubsub.publish('NEW_GAME', {
        gameAdded: game
      })

      const tictac = new Game({human: game.human, ai: game.ai})
      
      tictac.setScores()
      tictac.setGame(game.board)

      datastore.insertInHistory(game)

      const move = {
        id: args.id,
        board: tictac.bestMove(),
        human: game.human,
        ai: game.ai,
        v: datastore.lastVersionId() + 1,
        end: tictac.checkWinner(game.human) == null ? '' : tictac.checkWinner(game.human) == 'x' ? 'x' : 'o'
      }

      pubsub.publish('NEW_MOVE', {
        moveAdded: game
      })

      return game
    },
    newMove: (_, args, {pubsub}) => {
      const gameData = args.gameInfo

      const tictac = new Game({human: gameData.human, ai: gameData.ai})
      tictac.setGame(gameData.board)
      const isOver = tictac.checkWinner(gameData.human) == null ? '' : tictac.checkWinner(gameData.human)  
      
      let nextVersion = datastore.lastVersionId() + 1
      const move = {
        id: args.id,
        board: gameData.board,
        human: gameData.human,
        ai: gameData.ai,
        v: nextVersion,
        end: isOver
      }

      datastore.insertInHistory(move)


      pubsub.publish('NEW_MOVE', {
        moveAdded: move
      })

      tictac.setGame(move.board)
      tictac.setScores()

      move.board = tictac.bestMove()
      console.log(move)
      move.v = datastore.lastVersionId() + 1

      datastore.insertInHistory(move)

      pubsub.publish('NEW_MOVE', {
        moveAdded: move
      })

      return move
    }
  }
})

serve.initializeServer()