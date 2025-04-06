class Tile {
    types = [];
    objectID = -1;
    xCoordinate = -1; yCoordinate = -1;
    playerOwnerID = -1;
    publicVars = []; // An array of name-value pairs
    sprite = new Sprite("#000000", "#ffffff", "");

    constructor(types, xStart, yStart, owner, sprite, id = undefined) {
        this.types = types;
        this.objectID = (id !== undefined) ? id : assignObjectID();
        this.xCoordinate = xStart;
        this.yCoordinate = yStart;
        this.playerOwnerID = owner;
        this.sprite = sprite;
    }

    getPieces(active = true) {
        let boardPieces = (active ? activeGameState : currentGameState).pieceArray;
        let result = [];
        for (let p = 0; p < boardPieces.length; p++) {
            if (boardPieces[p].xCoordinate === this.xCoordinate && boardPieces[p].yCoordinate === this.yCoordinate) result.push(boardPieces[p]);
        }
        return result;
    }

    clickObject(topCall = true) {
        if (!gameInProgress()) return true;
        let scriptsToExecute = [];
        for (let t = 0; t < this.types.length; t++) {
            for (let s = 0; s < this.types[t].scripts.length; s++) {
                let scriptToCheck = this.types[t].scripts[s];
                if (scriptToCheck.trigger === "Object Clicked") scriptsToExecute.push([scriptToCheck, this]);
            }
        }
        let scriptResult;
        for (let s = 0; s < scriptsToExecute.length; s++) {
            scriptResult = scriptsToExecute[s][0].run(...scriptsToExecute[s].slice(1));
            if (scriptResult === false) {
                if (topCall) gameStateRevert();
                return false;
            }
        }
        scriptResult = globalScriptCheck();
        if (scriptResult && topCall) gameStateValid();
        else if (topCall) gameStateRevert();
        return scriptResult;
    }
}