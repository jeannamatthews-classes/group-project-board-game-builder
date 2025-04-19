class GameBoard {
    constructor(logicalBoard) {
        this.logical = logicalBoard;

        const containerWidth = logicalBoard.containerWidth === -1 ? 80 : logicalBoard.containerWidth;
        const containerHeight = logicalBoard.containerHeight === -1 ? 60 : logicalBoard.containerHeight;
        const containerTop = logicalBoard.containerTop === -1 ? 10 : logicalBoard.containerTop;
        const containerLeft = logicalBoard.containerLeft === -1 ? 10 : logicalBoard.containerLeft;

        this.container = new GameElementContainer({
            containerWidth,
            containerHeight,
            containerTop,
            containerLeft,
            borderColor: logicalBoard.borderColor,
            borderWidth: logicalBoard.borderWidth,
            backgroundColor: logicalBoard.backgroundColor,
            enablePanningControls: true
        });

        // Temporarily add container to DOM to measure it
        const containerEl = this.container.getElement();
        document.body.appendChild(containerEl);

        // Delay layout calc to next frame so it's rendered
        requestAnimationFrame(() => {
            const bounds = containerEl.getBoundingClientRect();
            const pixelWidth = bounds.width;
            const pixelHeight = bounds.height;

            const tileW = pixelWidth / logicalBoard.width;
            const tileH = pixelHeight / logicalBoard.height;
            const tileSize = Math.floor(Math.min(tileW, tileH));

            this.tileGrid = document.createElement('div');
            this.tileGrid.style.position = 'absolute';
            this.tileGrid.style.top = '0';
            this.tileGrid.style.left = '0';
            this.tileGrid.style.display = 'grid';
            this.tileGrid.style.gridTemplateColumns = `repeat(${logicalBoard.width}, ${tileSize}px)`;
            this.tileGrid.style.gridTemplateRows = `repeat(${logicalBoard.height}, ${tileSize}px)`;
            this.tileGrid.style.width = `${tileSize * logicalBoard.width}px`;
            this.tileGrid.style.height = `${tileSize * logicalBoard.height}px`;

            this.tiles = [];

            for (let y = 0; y < logicalBoard.tileArray.length; y++) {
                for (let x = 0; x < logicalBoard.tileArray[y].length; x++) {
                    const tile = logicalBoard.tileArray[y][x];
                    const gameTile = new GameTile(tile);
                    this.tiles.push(gameTile);
                    this.tileGrid.appendChild(gameTile.container);
                }
            }

            this.container.addContent(this.tileGrid);
        });
    }
}
