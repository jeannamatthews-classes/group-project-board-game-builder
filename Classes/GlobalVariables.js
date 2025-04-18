let currentGameState; // The game state after the last valid move
let activeGameState; // The game state currently being edited
let tileTypesList = []; // An array of the created tile types
let pieceTypesList = []; // An array of the created piece types
let buttonsList = []; // An array of the created buttons
let otherGlobalVariables = [];
let globalScripts = [];
let nextObjectID = 0;
let nextTypeID = 0;
let nextRuleID = 0;

const gameSaver = new GameSaver({
    gameState: currentGameState,
    tileTypes: tileTypesList,
    pieceTypes: pieceTypesList,
    pieces: [],   
    tiles: [],      
    board: {},    
    scriptingRules: globalScripts,
    buttons: buttonsList
});

gameSaver.attachDownloadButton();


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

// Returns the current available rule ID and increments to the next one
function assignRuleID() {
    nextRuleID++;
    return (nextRuleID - 1);
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
    if (argument instanceof ScriptingRule) {
        let result = new ScriptingRule(...argument.getConstructorArguments());
        return result;
    }
    if (argument instanceof GameState) return new GameState(BGBStructuredClone(argument.board), BGBStructuredClone(argument.pieceArray), argument.playerAmount, argument.turnNumber, argument.playerTurn, argument.turnPhase, BGBStructuredClone(argument.selectedObjects));
    if (argument instanceof Board) {
        let result = new Board(argument.boardShape, argument.width, argument.height);
        result.tileArray = BGBStructuredClone(argument.tileArray);
        return result;
    }
    if (argument instanceof TileType) return new TileType(argument.typeName, BGBStructuredClone(argument.scripts), argument.typeID);
    if (argument instanceof Tile) return new Tile(BGBStructuredClone(argument.types), argument.xCoordinate, argument.yCoordinate, argument.playerOwnerID, BGBStructuredClone(argument.sprite), argument.objectID);
    if (argument instanceof PieceType) return new PieceType(argument.typeName, BGBStructuredClone(argument.scripts), argument.typeID);
    if (argument instanceof Piece) return new Piece(BGBStructuredClone(argument.types), argument.xCoordinate, argument.yCoordinate, argument.playerOwnerID, BGBStructuredClone(argument.sprite), argument.objectID);
    if (argument instanceof Button) {
        let result = new Button(BGBStructuredClone(argument.clickScripts), BGBStructuredClone(argument.visibleRules), argument.color, argument.textColor, argument.text, argument.width, argument.length);
        result.name = argument.name;
    }
    if (argument instanceof ScriptingRuleForm) return new ScriptingRuleForm(BGBStructuredClone(argument.rule), argument.top, argument.callerType, argument.zebraDark, argument.parentType, argument.name, argument.ruleID);
    return structuredClone(argument); // Sprites are non-instance objects, so we just call the usual structuredClone on them
}

// Checks if two things are equal, including working on types like Pieces and Tiles.
function BGBEquals(leftArg, rightArg) {
    if ((leftArg instanceof Piece || leftArg instanceof Tile) && (rightArg instanceof Piece || rightArg instanceof Tile)) return (leftArg.objectID === rightArg.objectID);
    if ((leftArg instanceof PieceType && rightArg instanceof PieceType) || (leftArg instanceof TileType && rightArg instanceof TileType)) return (leftArg.typeID === rightArg.typeID);
    if (Array.isArray(leftArg) && Array.isArray(rightArg)) {
        if (leftArg.length != rightArg.length) return false;
        for (let i = 0; i < leftArg.length; i++) {
            if (!BGBEquals(leftArg[i], rightArg[i])) return false;
        }
        return true;
    }
    return (leftArg === rightArg);
}

function BGBIndexOf(array, element) {
    for (i = 0; i < array.length; i++) {
        if (BGBEquals(array[i], element)) return i;
    }
    return -1;
}

function gameInProgress() {
    return Number.isFinite(activeGameState.turnNumber);
}

function endGame(winner) {
    if (!gameInProgress()) return true;
    let scriptsToExecute = [];
    for (let p of activeGameState.pieceArray.concat(activeGameState.board.tileArray.flat(1))) {
        for (let t of p.types) {
            for (let scriptToCheck of t.scripts) {
                if (scriptToCheck.trigger === "End Game") scriptsToExecute.push([scriptToCheck, p, winner]);
            }
        }
    }
    let scriptResult;
    for (let s = 0; s < scriptsToExecute.length; s++) {
        scriptResult = scriptsToExecute[s][0].run(...scriptsToExecute[s].slice(1));
        console.log(scriptResult);
        if (scriptResult === false) {
            return false;
        }
    }
    activeGameState.turnNumber = Infinity;
    activeGameState.playerTurn = winner;
    activeGameState.turnPhase = Infinity;
    return true;
}

// This function should be run whenever the game state changes, as it includes things like turn number changes
function globalScriptCheck() {
    if (!gameInProgress()) return true;
    if (!Number.isFinite(activeGameState.turnPhase)) {
        activeGameState.selectedObjects = []; // Selected objects are reset between turns
        let scriptsToExecuteEnd = [];
        let scriptsToExecuteStart = [];
        for (let p of activeGameState.pieceArray.concat(activeGameState.board.tileArray.flat(1))) {
            for (let t of p.types) {
                for (let scriptToCheck of t.scripts) {
                    if (scriptToCheck.trigger === "End Turn") scriptsToExecuteEnd.push([scriptToCheck, p]);
                    if (scriptToCheck.trigger === "Start Turn") scriptsToExecuteStart.push([scriptToCheck, p]);
                }
            }
        }
        for (let scriptToCheck of globalScripts) {
            if (scriptToCheck.trigger === "End Turn") scriptsToExecuteEnd.push([scriptToCheck, undefined]);
            if (scriptToCheck.trigger === "Start Turn") scriptsToExecuteStart.push([scriptToCheck, undefined]);
        }
        let scriptResult;
        for (let s = 0; s < scriptsToExecuteEnd.length; s++) {
            scriptResult = scriptsToExecuteEnd[s][0].run(...scriptsToExecuteEnd[s].slice(1));
            console.log(scriptResult);
            if (scriptResult === false) {
                return false;
            }
        }
        activeGameState.turnPhase = 0;
        activeGameState.playerTurn += 1;
        if (activeGameState.playerTurn > activeGameState.playerAmount) {
            activeGameState.playerTurn = 1;
            activeGameState.turnNumber += 1;
        }
        for (let s = 0; s < scriptsToExecuteEnd.length; s++) {
            scriptResult = scriptsToExecuteStart[s][0].run(...scriptsToExecuteStart[s].slice(1));
            console.log(scriptResult);
            if (scriptResult === false) {
                return false;
            }
        }
    }
    return true;
}
