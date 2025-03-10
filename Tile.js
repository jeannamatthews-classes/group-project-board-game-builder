class Tile {
    types = [];
    objectID = -1;
    xCoordinate = -1; yCoordinate = -1;
    playerOwnerID = -1;
    publicVars = [];

    constructor(type, xStart, yStart, owner) {
        this.type = type;
        this.objectID = assignObjectID();
        this.xCoordinate = xStart;
        this.yCoordinate = yStart;
        this.playerOwnerID = owner;
    }

    getPieces() {
        let boardPieces = activeGameState.pieceArray;
        let result = [];
        for (let p = 0; p < boardPieces.length; p++) {
            if (boardPieces[p].xCoordinate === this.xCoordinate && boardPieces.yCoordinate === this.yCoordinate) result.push(boardPieces[p]);
        }
        return result;
    }
}