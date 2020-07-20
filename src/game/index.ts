export class Game {
    private winningCases
    public scores
    public players
    private currentPlayer
    private winner
    public board

    constructor(players) {
        this.winningCases = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ]
        this.scores = {}
        this.players = players
        this.currentPlayer
        this.winner
        this.board
    }

    setScores() {
        if (this.players.human == 'x') {
            this.scores = {
                x: -10,
                o: 10,
                tie: 0
            }
        } else {
            this.scores = {
                x: 10,
                o: -10,
                tie: 0
            }
        }
    }

    setGame(board) {
        this.board = board
    }

    setBoard(position, value) {
        this.board[position] = value
    }

    ifTie() {
        return !this.board.includes('')
    }

    checkWinner(winner) {
        if (this.ifTie()) return 'tie'

        for (var x = 0; x < this.winningCases.length; x++) {
    
            var firstPosition = this.board[this.winningCases[x][0]] == winner ? true : false
            var secondPosition = this.board[this.winningCases[x][1]] == winner ? true : false
            var thirdPosition = this.board[this.winningCases[x][2]] == winner ? true : false
    
            if (firstPosition && secondPosition && thirdPosition) return winner
        }
        return null
    }

    bestMove() {
        this.currentPlayer = this.players.human
        let bestScore = -Infinity
        let move; 
        console.log(this.currentPlayer)
        for (var x = 0; x < this.board.length; x++) {
            if (this.board[x] == '') {
                this.setBoard(x, this.players.ai)
                console.log(this.board)
                const score = this.minimax(0, false)
                this.setBoard(x, '')
                if (score > bestScore) {
                    bestScore = score
                    move = x
                }
            }
        }
        this.board[move] = this.players.ai
        console.log('Best move' + move)
        this.currentPlayer = this.players.ai
        return this.board
    }

    minimax(depth, isMaximizing) {
        const result = this.checkWinner(this.currentPlayer)
        if (result != null) return this.scores[result]
    
        if (isMaximizing) {
            let bestScore = -Infinity
    
            for (var x = 0; x < this.board.length; x++) {
                if (this.board[x] == '') {
                    this.board[x] = this.players.ai
                    let score = this.minimax(depth + 1, false)
                    this.board[x] = ''
                    bestScore = Math.max(score, bestScore)
                }
            }
            return bestScore
    
        } else {
            let bestScore = +Infinity
            
            for (var x = 0; x < this.board.length; x++) {
                if (this.board[x] == '') {
                    this.board[x] = this.players.human
                    let score = this.minimax(depth + 1, true)
                    this.board[x] = ''
                    bestScore = Math.min(score, bestScore)
                }
            }
            return bestScore
        }
    
    }
}

const players = {
    human: 'x',
    ai: 'o'
}
