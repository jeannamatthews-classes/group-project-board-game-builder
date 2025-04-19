class GameState {
    board;
    pieceArray;
    playerAmount;
    turnNumber;
    playerTurn;
    turnPhase;
    selectedObjects;
    inventories;

    constructor(board, pieces, playerAmount, turnNumber = 1, playerTurn = 1, turnPhase = 0, selectedObjects = []) {
        this.board = board;
        this.pieceArray = pieces;
        this.playerAmount = playerAmount;
        this.turnNumber = turnNumber;
        this.playerTurn = playerTurn;
        this.turnPhase = turnPhase;
        this.selectedObjects = selectedObjects;
        this.inventories = [];
    }

    saveCode() {
        return {
            board: this.board.saveCode(),
            pieceArray: this.pieceArray.map(p => p.saveCode ? p.saveCode() : null),
            playerAmount: this.playerAmount,
            turnNumber: this.turnNumber,
            playerTurn: this.playerTurn,
            turnPhase: this.turnPhase,
            selectedObjects: this.selectedObjects.map(o => o.objectID ?? null),
        };
   }

    static loadCode(data) {
    const board = Board.loadCode(data.board);
    const pieces = data.pieceArray.map(Piece.loadCode);
    const gameState = new GameState(board, pieces, data.playerAmount, data.turnNumber, data.playerTurn, data.turnPhase, []);
    gameState.selectedObjects = data.selectedObjects ?? [];
    gameState.inventories = data.inventories ?? [];
    return gameState;
}

}
