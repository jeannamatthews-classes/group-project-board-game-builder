class Board {
    boardShape = "Square"; // The shape of the board
    width; height; // The dimensions of the board
    tileArray; // A 2D array of Tiles

    constructor(boardShape, width, height) {
        if (boardShape === "Square") {
            this.boardShape = "Square";
            this.width = width;
            this.height = height;
            let ta = [];
            for (let y = 0; y < height; y++) {
                ta.push([]);
                for (let x = 0; x < width; x++) {
                    ta[y].push(new Tile([], x, y, 0));
                }
            }
            this.tileArray = ta;
        }
        else {
            throw new Error("Invalid board shape");
        }
    }

    getTile(x, y) {
        if (y >= 0 && y < this.tileArray.length && y % 1 == 0) {
            if (x >= 0 && x < this.tileArray[y].length && x % 1 == 0) {
                return this.tileArray[y][x];
            }
        }
        return undefined;
    }
}