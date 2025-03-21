class Piece {
    types = [];
    xCoordinate = -1; yCoordinate = -1;
    objectID = -1;
    playerOwnerID = -1;
    publicVars = [];
    sprite = new Sprite("#000000", "#ffffff", "")

    constructor(types, xStart, yStart, owner, sprite, id = undefined) {
        this.types = types;
        this.objectID = (id !== undefined) ? id : assignObjectID();
        this.xCoordinate = xStart;
        this.yCoordinate = yStart;
        this.playerOwnerID = owner;
        this.sprite = sprite;
    }

    getTile(active = true) {
        let boardTiles = (active ? activeGameState : currentGameState).board.tileArray;
        let row = boardTiles[this.yCoordinate];
        if (row === undefined) return null;
        let tile = row[this.xCoordinate];
        if (tile === undefined) return null;
        return tile;
    }

    movePiece(xChange, yChange) {
        let newX = this.xCoordinate + xChange;
        let newY = this.yCoordinate + yChange;
        let tileLanded = activeGameState.board.tileArray[newY];
        if (tileLanded === undefined) return;
        tileLanded = tileLanded[newX];
        if (tileLanded === undefined) return;
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
            if (scriptResult === false) {
                gameStateRevert();
                return;
            }
        }
        gameStateValid();
        return;
    }

    removePiece() {
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
                gameStateRevert();
                return;
            }
        }
        gameStateValid();
        return;
    }

    changeOwner(playerID) {
        this.playerID = playerID;
        gameStateValid();
        return;
    }
}