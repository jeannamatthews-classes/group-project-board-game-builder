class GameState {
    board;
    pieceArray;
    turnNumber;
    playerTurn;
    turnPhase;
    inventories;

    constructor(board, pieces) {
        this.board = board;
        this.pieceArray = pieces;
        this.turnNumber = 1;
        this.playerTurn = 1;
        this.turnPhase = 0;
        this.inventories = [];
    }
}