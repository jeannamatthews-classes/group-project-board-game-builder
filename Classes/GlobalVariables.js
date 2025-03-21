let currentGameState; // The game state after the last valid move
let activeGameState; // The game state currently being edited
let tileTypesList; // An array of the created tile types
let pieceTypesList; // An array of the created piece types
let otherGlobalVariables = [];
let nextObjectID = 0;
let nextTypeID = 0;

function getObject(id, active = true) {
    let gs = (active) ? activeGameState : currentGameState;
    let boardTiles = gs.board.tileArray;
    for (let y = 0; y < boardTiles.length; y++) {
        for (let x = 0; x < boardTiles[y].length; x++) {
            if (boardTiles[y][x].objectID == id) return boardTiles[y][x];
        }
    }
    for (let p = 0; p < gs.pieceArray.length; p++) {
        if (gs.pieceArray[p].objectID == id) return gs.pieceArray[p]
    }
    return null;
}

// Returns the current available object ID and increments to the next one
function assignObjectID() {
    nextObjectID++;
    return (nextObjectID - 1);
}

// Returns the current available type ID and increments to the next one
function assignTypeID() {
    nextTypeID++;
    return (nextTypeID - 1);
}

function gameStateValid() {
    currentGameState = BGBStructuredClone(activeGameState);
}

function gameStateRevert() {
    activeGameState = BGBStructuredClone(currentGameState);
}

// A variant of structuredClone that will preserve types like Pieces and Tiles.
// NOTE TO CODERS: If you ever change the arguments to a constructor of one of the classes this project defines, make the appropriate change here too!
function BGBStructuredClone(argument) {
    if (typeof argument !== "object") return argument; // primitive types are already cloned
    if (Array.isArray(argument)) return argument.map(BGBStructuredClone); // Copy each entry of the array
    if (argument instanceof ScriptingRule) return new ScriptingRule(...BGBStructuredClone(argument.constructorArgs));
    if (argument instanceof GameState) return new GameState(BGBStructuredClone(argument.board), BGBStructuredClone(argument.pieceArray));
    if (argument instanceof Board) {
        let result = new Board(argument.boardShape, argument.width, argument.height);
        result.tileArray = BGBStructuredClone(argument.tileArray);
        return result;
    }
    if (argument instanceof TileType) return new TileType(argument.typeName, BGBStructuredClone(argument.scripts), BGBStructuredClone(argument.sprite), argument.typeID);
    if (argument instanceof Tile) return new Tile(BGBStructuredClone(argument.types), argument.xCoordinate, argument.yCoordinate, argument.playerOwnerID, argument.objectID);
    if (argument instanceof PieceType) return new PieceType(argument.typeName, BGBStructuredClone(argument.scripts), BGBStructuredClone(argument.sprite), argument.typeID);
    if (argument instanceof Piece) return new Piece(BGBStructuredClone(argument.types), argument.xCoordinate, argument.yCoordinate, argument.playerOwnerID, BGBStructuredClone(argument.sprite), argument.objectID);
    if (argument instanceof Sprite) return new Sprite(argument.color, argument.textColor, argument.text);
}