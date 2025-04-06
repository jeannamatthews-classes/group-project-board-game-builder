class UITile {
    constructor(tile, board) {
        this.tile = tile;
        this.board = board;
        this.container;
        this.editorWindow = null;
        this.xOverlay = null;
        this.createTile();
    }


    createTile() {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.setAttribute('data-id', this.tile.objectID);
        tile.style.position = 'relative';
        this.container = tile;
        const xOverlay = document.createElement('div');
        xOverlay.classList.add('tile-disabled-x');
        xOverlay.innerHTML = `
          <div class="line black"></div>
          <div class="line red"></div>
        `;
        xOverlay.style.display = 'none';
        tile.appendChild(xOverlay);
        this.xOverlay = xOverlay;

        this.updateSprite();

        tile.addEventListener('click', (e) => {
            e.stopPropagation();
        
            switch (this.board.toolbar.activeTool) {
                case 'select':
                    this.showTileEditor();
                    break;
                case 'zoom_in':
                    this.board.resize(1.2);
                    break;
                case 'zoom_out':
                    this.board.resize(0.8);
                    break;
                case 'eyedropper':
                    this.board.selectedSprite = { ...this.tile.sprite };
                    if (this.board.spritePreview) {
                        const s = this.board.selectedSprite;
                        this.board.spritePreview.style.backgroundColor = s.fillColor;
                        this.board.spritePreview.style.color = s.textColor;
                        this.board.spritePreview.innerText = s.text || '';
                    }
                    break;                    
                case 'paint':
                    this.tile.sprite = { ...this.board.selectedSprite }; // apply sprite
                    this.updateSprite();
                    break;
                case 'disable':
                    this.tile.enabled = !this.tile.enabled;
                    this.updateSprite();
                    break;

                default:
                    break;
            }
        });

        tile.addEventListener('mouseenter', (e) => {
            if (
                e.buttons === 1 && 
                this.board.toolbar.activeTool === 'paint' &&
                this.board.isPainting 
            ) {
                this.tile.sprite = { ...this.board.selectedSprite };
                this.updateSprite();
            }
        });
        
        
    }

    updateSprite(sprite = this.tile.sprite) {
        const el = this.container;
        el.innerHTML = ''; // Clear

        const bg = document.createElement('div');
        bg.classList.add('sprite-shape');
        bg.style.backgroundColor = sprite.fillColor || '#ccc';
        bg.style.width = '100%';
        bg.style.height = '100%';
        bg.style.display = 'flex';
        bg.style.alignItems = 'center';
        bg.style.justifyContent = 'center';
        bg.style.color = sprite.textColor || '#000';
        bg.style.fontSize = '10px';
        bg.innerText = sprite.text || '';

        el.appendChild(bg);
        this.xOverlay.style.display = this.tile.enabled === false ? 'block' : 'none';
        el.appendChild(this.xOverlay);
        console.log(this.tile.enabled)
        if(pieceEditor){
        this.updatePieceDisplay();
        }
    }


    updatePieceDisplay() {
        const piecesHere = pieceEditor.pieces.filter(p =>
            p.piece.xCoordinate === this.tile.xCoordinate &&
            p.piece.yCoordinate === this.tile.yCoordinate
        );
    
        // Remove previous grid and old listeners
        this.container.querySelectorAll('.piece-tile-wrapper')?.forEach(e => e.remove());
    
        if (piecesHere.length === 0) return;
    
        const wrapper = document.createElement('div');
        wrapper.classList.add('piece-tile-wrapper');
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';
        wrapper.style.display = 'grid';
        wrapper.style.position = 'absolute';
        wrapper.style.top = '0';
        wrapper.style.left = '0';
    
        const gridSize = Math.ceil(Math.sqrt(piecesHere.length));
        wrapper.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        wrapper.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    
        piecesHere.forEach(uiPiece => {
            const el = uiPiece.boardContainer;
    
            // Clone to strip old listeners
            const newEl = el.cloneNode(true);
            el.replaceWith(newEl);
            uiPiece.boardContainer = newEl;
    
            // Add event listener
            newEl.addEventListener('click', (e) => {
                if (this.board.toolbar.activeTool === 'select') {
                    e.stopPropagation();
                    uiPiece.openEditorWindow();
                }
                // Otherwise: let it fall through
            });
            
            // Right-click to remove piece
            newEl.addEventListener('contextmenu', (e) => {
                e.preventDefault(); // prevent the browser context menu
                uiPiece.piece.xCoordinate = -1;
                uiPiece.piece.yCoordinate = -1;
                this.updatePieceDisplay();
            });
            
    
            newEl.style.width = '100%';
            newEl.style.height = '100%';
            wrapper.appendChild(newEl);
        });
    
        this.container.appendChild(wrapper);
    }
    

    showTileEditor() {
        
        if (this.editorWindow && document.body.contains(this.editorWindow.container)) {
            this.editorWindow.container.style.zIndex = ++__windowZIndex;
            return;}
        

        const original = structuredClone ? structuredClone(this.tile.sprite) : JSON.parse(JSON.stringify(this.tile.sprite));
        const temp = { ...original };
        const typesTemp = [...this.tile.types];
        const piecesToAdd = [];
        const piecesToRemove = [];


        const win = new WindowContainer(`Tile (${this.tile.xCoordinate}, ${this.tile.yCoordinate})`, true, {
            width: 350,
            height: 400,
            offsetTop: 50,
            offsetLeft: 500
        });
        this.editorWindow=win;

        const content = document.createElement('div');

        const renderTypes = () => {
            typeList.innerHTML = '';
            typesTemp.forEach((type, i) => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.justifyContent = 'space-between';

                const span = document.createElement('span');
                span.textContent = type;

                const remove = document.createElement('button');
                remove.textContent = '✕';
                remove.onclick = () => {
                    typesTemp.splice(i, 1);
                    renderTypes();
                };

                row.appendChild(span);
                row.appendChild(remove);
                typeList.appendChild(row);
            });
        };

        const renderAvailablePieces = () => {
            pieceList.innerHTML = '';
        
            const piecesHere = pieceEditor.pieces.filter(p =>
                p.piece.xCoordinate === this.tile.xCoordinate &&
                p.piece.yCoordinate === this.tile.yCoordinate
            );
        
            // List existing pieces on tile
            piecesHere.forEach((uiPiece, i) => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.justifyContent = 'space-between';
        
                const label = document.createElement('span');
                label.textContent = `Piece ${uiPiece.piece.objectID}`;
        
                const remove = document.createElement('button');
                remove.textContent = '✕';
                remove.onclick = () => {
                    piecesToRemove.push(uiPiece);
                    uiPiece.piece.xCoordinate = -1;
                    uiPiece.piece.yCoordinate = -1;
                    this.updatePieceDisplay();
                    renderAvailablePieces();
                };
        
                row.appendChild(label);
                row.appendChild(remove);
                pieceList.appendChild(row);
            });
        }
        
        

        content.innerHTML = `
            <label>Background Color: <input type="color" id="tile-color"></label><br>
            <label>Text: <input type="text" id="tile-text"></label><br>
            <label>Text Color: <input type="color" id="tile-text-color"></label><br>
            <hr>
            <div><strong>Tile Types</strong> <button id="add-type">+ Add Type</button></div>
            <div id="type-list"></div>
            <hr>
            <div><strong>Pieces on Tile</strong> <button id="add-piece">+ Add Piece</button></div>
            <div id="piece-list"></div>
            <div style="text-align:center; margin-top:10px;">
                <button id="save-btn">Save and Close</button>
                <button id="cancel-btn">Cancel</button>
            </div>
        `;

        // Fields
        const colorInput = content.querySelector('#tile-color');
        const textInput = content.querySelector('#tile-text');
        const textColorInput = content.querySelector('#tile-text-color');
        const addTypeBtn = content.querySelector('#add-type');
        const typeList = content.querySelector('#type-list');
        const pieceList = content.querySelector('#piece-list');
        const addBtn = content.querySelector('#add-piece');


        colorInput.value = temp.fillColor;
        textInput.value = temp.text;
        textColorInput.value = temp.textColor;

        renderTypes();
        renderAvailablePieces();

        addBtn.onclick = () => {
            const available = pieceEditor.pieces.filter(p =>
                p.piece.xCoordinate === -1 &&
                p.piece.yCoordinate === -1 &&
                !piecesToAdd.includes(p)
            );
    
            if (available.length === 0) return;
    
            const select = document.createElement('select');
            available.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.piece.objectID;
                opt.textContent = `Piece ${p.piece.objectID}`;
                select.appendChild(opt);
            });
    
            const confirm = document.createElement('button');
            confirm.textContent = '✔';
            confirm.onclick = () => {
                const id = parseInt(select.value);
                const uiPiece = pieceEditor.pieces.find(p => p.piece.objectID === id);
                if (uiPiece) {
                    piecesToAdd.push(uiPiece);
            
                    // TEMPORARILY move piece to this tile
                    uiPiece.piece.xCoordinate = this.tile.xCoordinate;
                    uiPiece.piece.yCoordinate = this.tile.yCoordinate;
            
                    this.updatePieceDisplay();
                    renderAvailablePieces();
            
                    select.remove();
                    confirm.remove();
                }
            };
            
    
            pieceList.appendChild(select);
            pieceList.appendChild(confirm);
        };


        addTypeBtn.onclick = () => {
            const select = document.createElement('select');
            TILE_TYPES.forEach(type => {
                if (!typesTemp.includes(type)) {
                    const opt = document.createElement('option');
                    opt.value = type;
                    opt.textContent = type;
                    select.appendChild(opt);
                }
            });

            const confirm = document.createElement('button');
            confirm.textContent = '✔';
            confirm.onclick = () => {
                typesTemp.push(select.value);
                renderTypes();
                select.remove();
                confirm.remove();
            };

            content.insertBefore(select, typeList);
            content.insertBefore(confirm, typeList);
        };

        const updateTemp = () => {
            temp.fillColor = colorInput.value;
            temp.text = textInput.value;
            temp.textColor = textColorInput.value;
            this.updateSprite(temp);
        };

        colorInput.addEventListener('input', updateTemp);
        textInput.addEventListener('input', updateTemp);
        textColorInput.addEventListener('input', updateTemp);

        content.querySelector('#save-btn').addEventListener('click', () => {
            this.tile.sprite = { ...temp };
            this.tile.types = [...typesTemp];
        
            piecesToAdd.forEach(uiPiece => {
                uiPiece.piece.xCoordinate = this.tile.xCoordinate;
                uiPiece.piece.yCoordinate = this.tile.yCoordinate;
            });
        
            piecesToAdd.length = 0;
        
            this.updateSprite();
            win.close();
        });
        
        
        content.querySelector('#cancel-btn').addEventListener('click', () => {
            // Revert removed pieces
            piecesToRemove.forEach(uiPiece => {
                uiPiece.piece.xCoordinate = this.tile.xCoordinate;
                uiPiece.piece.yCoordinate = this.tile.yCoordinate;
            });
        
            // Revert added pieces
            piecesToAdd.forEach(uiPiece => {
                uiPiece.piece.xCoordinate = -1;
                uiPiece.piece.yCoordinate = -1;
            });
        
            this.updateSprite(); // revert everything
            win.close();
        });
        
        

        win.beforeClose = () => {
            piecesToRemove.forEach(uiPiece => {
                uiPiece.piece.xCoordinate = this.tile.xCoordinate;
                uiPiece.piece.yCoordinate = this.tile.yCoordinate;
            });
        
            piecesToAdd.forEach(uiPiece => {
                uiPiece.piece.xCoordinate = -1;
                uiPiece.piece.yCoordinate = -1;
            });
        
            this.updateSprite();
        };

        win.appendContent(content);
    }
}
