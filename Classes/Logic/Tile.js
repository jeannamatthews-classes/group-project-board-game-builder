class Tile {
    types = []; // Now stores only type IDs (e.g., [1, 5, 9])
    objectID = -1;
    xCoordinate = -1;
    yCoordinate = -1;
    playerOwnerID = -1;
    enabled = true;

    publicVars = [];
    sprite = {
        fillColor: '#cccccc',
        text: '',
        textColor: '#000000'
    };

    constructor(typeIDs = [], xStart, yStart, id = undefined) {
        this.types = typeIDs;
        this.objectID = (id !== undefined) ? id : assignObjectID();
        this.xCoordinate = xStart;
        this.yCoordinate = yStart;
    }

    getPieces(active = true) {
        const boardPieces = (active ? activeGameState : currentGameState).pieceArray;
        return boardPieces.filter(p =>
            p.xCoordinate === this.xCoordinate && p.yCoordinate === this.yCoordinate
        );
    }

    clickObject(topCall = true) {
        if (!gameInProgress()) return true;

        const typeObjects = this.types
            .map(id => typeEditor.tileTypes.find(t => Number(t.type.typeID) === Number(id))?.type)
            .filter(t => t); // filter out nulls

        const scriptsToExecute = [];

        for (let type of typeObjects) {
            for (let script of type.scripts || []) {
                if (script.trigger === "Object Clicked") {
                    scriptsToExecute.push([script, this]);
                }
            }
        }

        let scriptResult = true;
        for (let [script, target] of scriptsToExecute) {
            scriptResult = script.run(target);
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

    saveCode() {
        return {
            objectID: this.objectID,
            xCoordinate: this.xCoordinate,
            yCoordinate: this.yCoordinate,
            playerOwnerID: this.playerOwnerID,
            enabled: this.enabled,
            publicVars: this.publicVars,
            sprite: this.sprite,
            types: this.types.slice() // Just IDs
        };
    }

    static loadCode(data) {
        const tile = new Tile(data.types || [], data.xCoordinate, data.yCoordinate, data.objectID);
        tile.playerOwnerID = data.playerOwnerID;
        tile.enabled = data.enabled;
        tile.publicVars = data.publicVars;
        tile.sprite = data.sprite;
        return tile;
    }

    clone() {
        return Tile.loadCode(this.saveCode());
    }
}
