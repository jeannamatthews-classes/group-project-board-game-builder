class GameState {
    board;
    pieceArray;
    playerAmount;
    turnNumber;
    playerTurn;
    turnPhase;
    inventories;

    constructor(board, pieces, playerAmount, turnNumber = 1, playerTurn = 1, turnPhase = 0) {
        this.board = board;
        this.pieceArray = pieces;
        this.playerAmount = playerAmount;
        this.turnNumber = turnNumber;
        this.playerTurn = playerTurn;
        this.turnPhase = turnPhase;
        this.inventories = [];
    }
}