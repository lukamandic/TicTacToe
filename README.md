# TIC TAC TOE

Single player game with a Minimax AI implementation

## Installation

Game was developed with Typescript Version 3.6.3

```bash

git clone
cd TicTacToe/
npm install
npm start
```

This is the url: http://localhost:3900/graphql

## Architecture

**Logging**

No logging due to time constraints

**Game**: 

```ts
interface Game {
    id: number          // id of the game
    board: [string]     // current occupied positions on the board in history
    v: number           // version number. Example: v: 1 (first move in history)
    human: string       // character that belongs to a human
    ai: string          // character that belongs to the computer
    end: string         // is the game over (eg. if 'o' won then end: 'o', if the game has not ended jet then end: '')
}

// game object example
const game = {
    id: 1,
    board: [
        'x', '', ''
        '', '', ''
        '', '', ''
    ],
    v: 1,
    human: 'o',
    ai: 'x',
    end: ''
}
```

**Database**:

This is for a possible future database interactions and for now it only supports MongoDB

```ts

const databaseInfo = {
    host: 'localhost',
    port: '27017',
    databaseName: 'amazon'
}

const models = new Map()

models["TicTacToe"] = {
    schema: {
        id: {
            type: Number
            required: true
        },
        board: [{
            type: String,
            default: ''
        }],
        v: {
            type: Number,
            required: true
        },
        human: {
            type: String,
            required: true
        },
        ai: {
            type: String,
            required: true
        },
        end: {
            type: String,
            default: ''
        }
    }
}

const database = new Database(databaseInfo, models)



```

**Datastore**

```ts

insertInHistory(data: Game): void       // function for inserting game data in history

lastGameId(): number                    // function for finding the last game id

lastVersionId(): number                 // function for finding the last version id of a game

groupHistoryDataById(gameId: number)    // function for grouping all games history by their game id

const datastore = new Datastore()       // this is how we initialize the server and we also provide it a port number (eg. 3900)

```

**Server**

```ts

initializeServer(): void        // function for initializing the server

addNewType(): void              // function for adding new types in the schema

addNewResolver(): void          // function for adding new resolvers for queries, mutations, subscriptions etc.

const game = new Server(3900)   // this is how we initialize the server and we also provide it a port number (eg. 3900)

```

## Usage

### When a new game is added (Subscription)

```graphql
subscription {
    gameAdded {
        id
        board
        human
        ai
        v
        end
    }
}
```

### Live results (Subscription)

```graphql
subscription {
    moveAdded {
        id
        board
        human
        ai
        v
        end
    }
}
```

### Add new game (Mutation)

```graphql
mutation {
    newGame(gameInfo: { board: ["", "", "", "x", "", "", "", "", "", human: "o", ai: "x"] }) {
        id
        board
        human
        ai
        v
        end
    }
}
```

### Add new move to a game (Mutation)

```graphql
mutation {
    newMove(id: 1, gameInfo: { board: ["x", "", "", "x", "o", "", "", "", ""], human: "o", ai: "x" }) {
        id
        board
        human
        ai
        v
        end
    }
}
```

### List game history by Id (Subscription)

```graphql
query {
    gameHistory(id: 1) {
        id
        board
        human
        ai
        v
        end
    }
}
```
