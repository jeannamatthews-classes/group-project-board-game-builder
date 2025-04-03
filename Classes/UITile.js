
// --- UITile class ---
class UITile {
    constructor(tile, board) {
        this.tile = tile;
        this.board = board;
        this.container = this.createTile();
    }

    createTile() {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.setAttribute('data-id', this.tile.objectID);

        tile.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.board.toolbar.activeTool === 'select') {
                this.showTileEditor();
            } else if (this.board.toolbar.activeTool === 'zoom_in') {
                this.board.resize(1.2);
            } else if (this.board.toolbar.activeTool === 'zoom_out') {
                this.board.resize(0.8);
            }
        });

        return tile;
    }

    showTileEditor() {
        const win = new WindowContainer(`Tile (${this.tile.xCoordinate}, ${this.tile.yCoordinate})`, true, {
            width: 300,
            height: 220,
            offsetTop: 50,
            offsetLeft: 500
        });
    
        const content = document.createElement('div');
        content.innerHTML = `
            <label>Background Color: <input type="color" id="tile-color" value="#ffffff"></label><br>
            <label>Text: <input type="text" id="tile-text"></label><br>
            <label>Text Color: <input type="color" id="tile-text-color" value="#000000"></label><br>
            <label>Tile Type:
                <select id="tile-type">
                    ${TILE_TYPES.map(type => `<option value="${type}">${type}</option>`).join('')}
                </select>
            </label><br>
            <label>Place Piece:
                <select id="place-piece-dropdown">
                    <option value="">-- Select a Piece --</option>
                    ${editor.pieces.map(p => `<option value="${p.piece.objectID}">Piece ${p.piece.objectID}</option>`).join('')}
                </select>
            </label>
        `;
    
        const colorInput = content.querySelector('#tile-color');
        const textInput = content.querySelector('#tile-text');
        const textColorInput = content.querySelector('#tile-text-color');
        const typeSelect = content.querySelector('#tile-type');
        const pieceDropdown = content.querySelector('#place-piece-dropdown');
    
        colorInput.addEventListener('input', () => {
            this.container.style.backgroundColor = colorInput.value;
        });
    
        textInput.addEventListener('input', () => {
            this.container.textContent = textInput.value;
            this.applyTextStyles();
        });
    
        textColorInput.addEventListener('input', () => {
            this.applyTextStyles();
        });
    
        typeSelect.addEventListener('change', () => {
            this.tile.types = [typeSelect.value];
        });
    
        pieceDropdown.addEventListener('change', (e) => {
            const selectedID = e.target.value;
            if (!selectedID) return;
    
            const uiPiece = editor.pieces.find(p => p.piece.objectID === parseInt(selectedID));
            if (!uiPiece) return;
    
            // Position piece logic-wise
            uiPiece.piece.xCoordinate = this.tile.xCoordinate;
            uiPiece.piece.yCoordinate = this.tile.yCoordinate;
    
            // Visually place it on this tile
            this.container.appendChild(uiPiece.container);
            uiPiece.container.style.position = 'absolute';
            uiPiece.container.style.top = '0';
            uiPiece.container.style.left = '0';
            uiPiece.container.style.zIndex = '20'; // above tile content
        });
    
        win.appendContent(content);
    }
    
}