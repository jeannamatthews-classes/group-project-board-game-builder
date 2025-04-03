class UIPieceEditor {
    constructor() {
        this.pieces = [];
        this.window = this.createEditorWindow();
        this.toolbar = this.createToolbar();
        this.pieceContainer = this.createContainer();
        this.activeTool = 'select';

        this.window.appendContent(this.toolbar);
        this.window.appendContent(this.pieceContainer);
    }

    createEditorWindow() {
        return new WindowContainer("Piece Editor", true, {
            width: 400,
            height: 300,
            offsetTop: 80,
            offsetLeft: 100
        });
    }

    createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.classList.add('toolbar');
        toolbar.style.display = 'flex';
        toolbar.style.padding = '5px';

        const addTool = (id, label, action = null) => {
            const btn = document.createElement('button');
            btn.textContent = label;
            btn.onclick = () => {
                this.activeTool = id;
                this.updateCursor();

                if (id === 'add' && action) {
                    action();
                }
            };
            toolbar.appendChild(btn);
        };

        addTool('select', 'Select');
        addTool('grab', 'Arrange');
        addTool('add', 'Add Piece', () => this.createDefaultPiece());

        return toolbar;
    }

    updateCursor() {
        this.pieceContainer.style.cursor = this.activeTool === 'grab' ? 'grab' : 'default';
    }

    createContainer() {
        const container = document.createElement('div');
        container.style.width = '100%';
        container.style.height = '200px';
        container.style.border = '1px solid #aaa';
        container.style.overflow = 'auto';
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.gap = '5px';
        container.style.padding = '10px';

        // drag & reorder support
        let draggedEl = null;

        container.addEventListener('dragstart', (e) => {
            if (this.activeTool !== 'grab') return;
            draggedEl = e.target;
            e.dataTransfer.effectAllowed = 'move';
        });

        container.addEventListener('dragover', (e) => {
            if (this.activeTool !== 'grab') return;
            e.preventDefault();
        });

        container.addEventListener('drop', (e) => {
            if (this.activeTool !== 'grab') return;
            e.preventDefault();
            const dropTarget = e.target.closest('.piece-ui');
            if (draggedEl && dropTarget && draggedEl !== dropTarget) {
                this.pieceContainer.insertBefore(draggedEl, dropTarget);
            }
        });

        return container;
    }

    createDefaultPiece() {
        const sprite = {
            shape: 'square',
            fillColor: '#cccccc',
            strokeColor: '#000000',
            text: '',
            textColor: '#000000'
        };
        const piece = new Piece([], 0, 0, 0, sprite);
        this.addPiece(piece);
    }

    addPiece(piece) {
        const uiPiece = new UIPiece(piece, this);
        uiPiece.container.setAttribute('draggable', true);
        this.pieces.push(uiPiece);
        this.pieceContainer.appendChild(uiPiece.container);
    }
}
