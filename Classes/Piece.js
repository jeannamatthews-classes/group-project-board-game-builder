class Piece {
    types = [];
    xCoordinate = -1; yCoordinate = -1;
    objectID = -1;
    playerOwnerID = -1;
    publicVars = [];
    sprite;
    

    constructor(types, xStart, yStart, owner, sprite, id = undefined) {
        this.types = types;
        this.objectID = (id !== undefined) ? id : assignObjectID();
        this.xCoordinate = xStart;
        this.yCoordinate = yStart;
        this.playerOwnerID = owner;
        this.sprite = sprite;
        this.name = '';
    }
    
    saveCode() {
        return {
            objectID: this.objectID,
            xCoordinate: this.xCoordinate,
            yCoordinate: this.yCoordinate,
            playerOwnerID: this.playerOwnerID,
            publicVars: this.publicVars,
            sprite: {
                fillColor: this.sprite.fillColor,
                textColor: this.sprite.textColor,
                text: this.sprite.text
            },
            types: this.types.map(t => t.saveCode ? t.saveCode() : null)
        };
    }
    

    getTile(active = true) {
        let boardTiles = (active ? activeGameState : currentGameState).board.tileArray;
        let row = boardTiles[this.yCoordinate];
        if (row === undefined) return null;
        let tile = row[this.xCoordinate];
        if (tile === undefined) return null;
        return tile;
    }

    movePiece(xChange, yChange, topCall = true) {
        if (!gameInProgress()) return true;
        let newX = this.xCoordinate + xChange;
        let newY = this.yCoordinate + yChange;
        let tileLanded = activeGameState.board.tileArray[newY];
        if (tileLanded === undefined) return false;
        tileLanded = tileLanded[newX];
        if (tileLanded === undefined) return false;
        if (!tileLanded.enabled) return false;
        this.xCoordinate = newX;
        this.yCoordinate = newY;
        let scriptsToExecute = [];
        for (let t = 0; t < this.types.length; t++) {
            for (let s = 0; s < this.types[t].scripts.length; s++) {
                let scriptToCheck = this.types[t].scripts[s];
                if (scriptToCheck.trigger === "Piece Moves") scriptsToExecute.push([scriptToCheck, this, xChange, yChange]);
                else if (scriptToCheck.trigger === "Piece Lands on Tile") scriptsToExecute.push([scriptToCheck, this, tileLanded]);
            }
        }
        for (let t = 0; t < tileLanded.types.length; t++) {
            for (let s = 0; s < tileLanded.types[t].scripts.length; s++) {
                let scriptToCheck = tileLanded.types[t].scripts[s];
                if (scriptToCheck.trigger === "Tile is Landed on") scriptsToExecute.push([scriptToCheck, tileLanded, this]);
            }
        }
        let scriptResult;
        for (let s = 0; s < scriptsToExecute.length; s++) {
            scriptResult = scriptsToExecute[s][0].run(...scriptsToExecute[s].slice(1));
            console.log(scriptResult);
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

    removePiece(topCall = true) {
        if (!gameInProgress()) return true;
        let boardPieces = activeGameState.pieceArray;
        for (let p = 0; p < boardPieces.length; p++) {
            if (boardPieces[p].objectID === this.objectID) {
                boardPieces.splice(p, 1);
                return;
            }
        }
        let scriptsToExecute = [];
        for (let t = 0; t < this.types.length; t++) {
            for (let s = 0; s < this.types[t].scripts.length; s++) {
                let scriptToCheck = this.types[t].scripts[s];
                if (scriptToCheck.trigger === "Piece is Removed") scriptsToExecute.push([scriptToCheck, this]);
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

    changeOwner(playerID, topCall = true) {
        if (!gameInProgress()) return true;
        this.playerID = playerID;
        scriptResult = globalScriptCheck();
        if (scriptResult && topCall) gameStateValid();
        else if (topCall) gameStateRevert();
        return scriptResult;
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
