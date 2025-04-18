class Board {
    boardShape = "Square"; // The shape of the board
    width; height; // The dimensions of the board
    tileArray; // A 2D array of Tiles
        
    constructor(boardShape, width, height) {
        this.containerWidth = -1;
        this.containerHeight = -1;
        this.containerTop = -1;
        this.containerLeft = -1;
        this.borderColor = 'rgba(0, 0, 0, 0.9)';
        this.borderWidth='2px';
        this.backgroundColor ='rgba(255, 255, 255, 0.9)';

        if (boardShape === "Square") {
            this.boardShape = "Square";
            this.width = width;
            this.height = height;
            let ta = [];
            for (let y = 0; y < height; y++) {
                ta.push([]);
                for (let x = 0; x < width; x++) {
                    ta[y].push(new Tile([], x, y));
                }
            }
            this.tileArray = ta;
        }
        else if (boardShape === "Hexagon") {
            this.boardShape = "Hexagon";
            this.width = width;
            this.height = height;
            let ta = [];
            for (let y = 0; y < height; y++) {
                ta.push([]);
                for (let x = 0; x < width; x++) {
                    ta[y].push(new Tile([], x, y));
                }
                if (y < Math.floor((height - 1) / 2)) width++;
                else if (y >= Math.ceil((height - 1) / 2)) width--;
            }
            this.tileArray = ta;
        }
        else if (boardShape === "Triangle") {
            this.boardShape = "Triangle";
            this.width = width;
            this.height = height;
            let ta = [];
            for (let y = 0; y < height; y++) {
                ta.push([]);
                for (let x = 0; x < width; x++) {
                    ta[y].push(new Tile([], x, y));
                }
                width += 2;
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

    saveCode() {
        return {
            boardShape: this.boardShape,
            width: this.width,
            height: this.height,
            containerWidth:this.containerWidth,
            containerHeight:this.containerHeight,
            containerTop:this.containerTop,
            containerLeft:this.containerLeft,
            borderColor:this.borderColor,
            borderWidth:this.borderWidth,
            backgroundColor : this.backgroundColor,
            tileArray: this.tileArray.map(row =>
                row.map(tile => tile.saveCode()) 
            )
        };
    }
    static loadCode(data) {
    const board = new Board(data.boardShape, data.width, data.height);
    board.tileArray = data.tileArray.map(row =>
        row.map(tileData => Tile.loadCode(tileData))
    );
    return board;
}

}
