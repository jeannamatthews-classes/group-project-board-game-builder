class GameSaveManager {
    constructor({
        gameState,
        tileType,
        pieceType,
        piece,
        tile,
        board,
        scriptingRules,
        button
    }) {
        this.gameState = gameState;
        this.tileType = tileType;
        this.pieceType = pieceType;
        this.piece = piece;
        this.tile = tile;
        this.board = board;
        this.scriptingRules = scriptingRules;
        this.button = button;
    }

    createSaveData() {
        return {
            gameState: this.gameState.saveCode(),
            tileTypes: this.tileTypes.map(t => t.saveCode()),
            pieceTypes: this.pieceTypes.map(p => p.saveCode()),
            pieces: this.pieces.map(p => p.saveCode()),
            tiles: this.tiles.map(t => t.saveCode()),
            board: this.board.saveCode(),
            scriptingRules: this.scriptingRules.map(s => s.saveCode()),
            buttons: this.buttons.map(b => b.saveCode()),
            metadata: {
                version: "1.0",
                savedAt: new Date().toISOString()
            }
        };
    }

    saveToFile(filename = "game_save.json") {
        const saveData = this.createSaveData();
        const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    static loadFromData(data) {
        return {
            gameState: GameState.loadCode(data.gameState),
            tileTypes: data.tileTypes.map(TileType.loadCode),
            pieceTypes: data.pieceTypes.map(PieceType.loadCode),
            pieces: data.pieces.map(Piece.loadCode),
            tiles: data.tiles.map(Tile.loadCode),
            board: Board.loadCode(data.board),
            scriptingRules: data.scriptingRules.map(ScriptingRule.loadCode),
            buttons: data.buttons.map(Button.loadCode)
        };
    }
}
