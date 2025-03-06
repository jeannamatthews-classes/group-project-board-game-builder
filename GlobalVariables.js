currentGameState; // The game state after the last valid move
activeGameState; // The game state currently being edited
tileTypesList; // An array of the created tile types
pieceTypesList; // An array of the created tile types
otherGlobalVariables = [];
nextObjectID = 0;

function getObject(id) {
    let boardTiles = activeGameState.board.tileArray;
    for (let y = 0; y < boardTiles.length; y++) {
        for (let x = 0; x < boardTiles[y].length; x++) {
            if (boardTiles[y][x].objectID == id) return boardTiles[y][x];
        }
    }
    for (let p = 0; p < activeGameState.pieceArray.length; p++) {
        if (activeGameState.pieceArray[p].objectID == id) return activeGameState.pieceArray[p]
    }
    return null;
}

// Returns the current available object ID and increments to the next one
function assignObjectID() {
    nextObjectID++;
    return (nextObjectID - 1);
}