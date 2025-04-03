// --- UIBoard class ---
class UIBoard {
    constructor(board) {
        this.board = board;
        this.tiles = [];
        this.container = this.createBoard();
        this.window;
        this.toolbar;
        this.createWindow();
        this.createTiles();

        // For dragging
        this.offsetX = 0;
        this.offsetY = 0;
        this.scale = 1;
        this.enableDragging();
    }

    createBoard() {
        const boardContainer = document.createElement('div');
        boardContainer.classList.add('board');
        boardContainer.style.display = 'grid';
        boardContainer.style.gridTemplateColumns = `repeat(${this.board.width}, 40px)`;
        boardContainer.style.gridTemplateRows = `repeat(${this.board.height}, 40px)`;
        boardContainer.style.gap = '0px';
        boardContainer.style.position = 'absolute';
        boardContainer.style.transformOrigin = 'top left';
        return boardContainer;
    }

    createTiles() {
        for (let y = 0; y < this.board.height; y++) {
            for (let x = 0; x < this.board.width; x++) {
                const tile = this.board.getTile(x, y);
                const uiTile = new UITile(tile, this);
                this.container.appendChild(uiTile.container);
                this.tiles.push(uiTile);
            }
        }
    }

    resize(scaleFactor) {
        this.scale *= scaleFactor;
        this.container.style.transform = `scale(${this.scale}) translate(${this.offsetX}px, ${this.offsetY}px)`;
    }

    reposition(dx, dy) {
        this.offsetX += dx / this.scale;
        this.offsetY += dy / this.scale;
        this.container.style.transform = `scale(${this.scale}) translate(${this.offsetX}px, ${this.offsetY}px)`;
    }

    createWindow(){
        const win = new WindowContainer("Game Board", true);
        win.setContent(    `<div id="toolbar-container" style="width: 100%;height:10%"></div>
            <div id="game-container" style="width: 100%; height: 80%; overflow: hidden; border: 1px solid black;"></div>`);
    
        const toolbarArea = document.getElementById('toolbar-container');
        const targetArea = document.getElementById('game-container'); // The area where cursor applies
    
        const toolbar = new Toolbar(toolbarArea, targetArea);
    
        toolbar.addTool("select", ["drag"]);
        toolbar.addTool("zoom_in", ["zoom_out"]);
        toolbar.addTool("paint");
        toolbar.addTool("eyedropper");
    
        targetArea.appendChild(this.container);
        this.toolbar = toolbar;
        this.window = win;
    }

    enableDragging() {
        let isDragging = false;
        let startX, startY;

        this.container.parentElement.addEventListener('mousedown', (e) => {
            if (this.toolbar.activeTool === 'drag') {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                this.reposition(dx, dy);
                startX = e.clientX;
                startY = e.clientY;
            }
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
}