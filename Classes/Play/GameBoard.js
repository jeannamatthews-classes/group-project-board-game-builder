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
            enablePanningControls: false // we will do manual right-click drag
        });

        this.offsetX = 0;
        this.offsetY = 0;
        this.isDragging = false;

        const containerEl = this.container.getElement();
        document.body.appendChild(containerEl);

            const bounds = containerEl.getBoundingClientRect();
            const pixelWidth = bounds.width;
            const pixelHeight = bounds.height;

            const tileW = pixelWidth / logicalBoard.width;
            const tileH = pixelHeight / logicalBoard.height;
            const tileSize = Math.floor(Math.min(tileW, tileH));

            const totalBoardWidth = tileSize * logicalBoard.width;
            const totalBoardHeight = tileSize * logicalBoard.height;

            this.tileGrid = document.createElement('div');
            this.tileGrid.style.position = 'absolute';
            this.tileGrid.style.display = 'grid';
            this.tileGrid.style.gridTemplateColumns = `repeat(${logicalBoard.width}, ${tileSize}px)`;
            this.tileGrid.style.gridTemplateRows = `repeat(${logicalBoard.height}, ${tileSize}px)`;
            this.tileGrid.style.width = `${totalBoardWidth}px`;
            this.tileGrid.style.height = `${totalBoardHeight}px`;

            this.centerBoard(bounds.width, bounds.height, totalBoardWidth, totalBoardHeight);

            this.tiles = Array.from({ length: logicalBoard.height }, () =>
                []
            );


            for (let y = 0; y < logicalBoard.tileArray.length; y++) {
                for (let x = 0; x < logicalBoard.tileArray[y].length; x++) {
                    const tile = logicalBoard.tileArray[y][x];
                    const gameTile = new GameTile(tile);
                    this.tiles[y][x] = gameTile;
                    this.tileGrid.appendChild(gameTile.container);
                }
            }
        

            this.container.zoomedContent.appendChild(this.tileGrid);
            this.enableDragging();
    }

    centerBoard(containerWidth, containerHeight, boardWidth, boardHeight) {
        this.offsetX = (containerWidth - boardWidth) / 2;
        this.offsetY = (containerHeight - boardHeight) / 2;
        this.applyTransform();
    }

    applyTransform() {
        this.tileGrid.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px)`;
    }

    enableDragging() {
        let startX, startY;

        const contentEl = this.container.zoomedContent;

        contentEl.addEventListener('contextmenu', e => e.preventDefault());

        contentEl.addEventListener('mousedown', (e) => {
            if (e.button === 2) {
                this.isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                e.preventDefault();
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                this.offsetX += dx;
                this.offsetY += dy;

                // Enforce bounds
                const containerBounds = this.container.getElement().getBoundingClientRect();
                const boardBounds = this.tileGrid.getBoundingClientRect();

                const maxOffsetX = 0;
                const maxOffsetY = 0;
                const minOffsetX = containerBounds.width - boardBounds.width;
                const minOffsetY = containerBounds.height - boardBounds.height;

                this.offsetX = Math.min(maxOffsetX, Math.max(minOffsetX, this.offsetX));
                this.offsetY = Math.min(maxOffsetY, Math.max(minOffsetY, this.offsetY));

                this.applyTransform();
                startX = e.clientX;
                startY = e.clientY;
            }
        });

        window.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
    }

    update(){
        // console.log(this.tiles)
        this.logical = activeGameState.board; 
        let flatTiles = this.tiles.flat();
        flatTiles.forEach(tile => tile.update());
        activeGameState.pieceArray.forEach(p=> {
            // if(p.xCoordinate != -1 && p.yCoordinate !=-1)
            //     console.log(p.yCoordinate)
            this.tiles[p.yCoordinate][p.xCoordinate].addPiece(p) //top and left format.
        })

    }

}
