class Tile {
    types = [];
    objectID = -1;
    xCoordinate = -1; yCoordinate = -1;
    playerOwnerID = -1;
    enabled = true; 
    
    publicVars = []; // An array of name-value pairs
    sprite = {
        fillColor: '#cccccc',
        text: '',
        textColor: '#000000'
    };

    constructor(types, xStart, yStart, id = undefined) {
        this.types = types;
        this.objectID = (id !== undefined) ? id : assignObjectID();
        this.xCoordinate = xStart;
        this.yCoordinate = yStart;
    }

    getPieces(active = true) {
        let boardPieces = (active ? activeGameState : currentGameState).pieceArray;
        let result = [];
        for (let p = 0; p < boardPieces.length; p++) {
            if (boardPieces[p].xCoordinate === this.xCoordinate && boardPieces[p].yCoordinate === this.yCoordinate) result.push(boardPieces[p]);
        }
        return result;
    }
}