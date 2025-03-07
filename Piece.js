class Piece {
    types = [];
    xCoordinate = -1; yCoordinate = -1;
    objectID = -1;
    playerOwnerID = -1;
    publicVars = [];

    constructor(type, xStart, yStart, owner) {
        this.type = type;
        this.objectID = assignObjectID();
        this.xCoordinate = xStart;
        this.yCoordinate = yStart;
        this.playerOwnerID = owner;
    }

    getTile() {
        let boardTiles = activeGameState.board.tileArray;
        let row = boardTiles[this.yCoordinate];
        if (row === undefined) return null;
        let tile = row[this.xCoordinate];
        if (tile === undefined) return null;
        return tile;
    }
}