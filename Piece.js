class Piece {
    type = PieceType();
    xCoordinate = -1; yCoordinate = -1;
    objectID = -1;
    playerOwnerID = -1;
    publicVars = [];

    constructor(type, ID, xStart, yStart, owner) {
        this.type = type;
        this.objectID = ID;
        this.xCoordinate = xStart;
        this.yCoordinate = yStart;
        this.playerOwnerID = owner;
    }
}