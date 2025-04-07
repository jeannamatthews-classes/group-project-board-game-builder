class UIPieceEditor {
    constructor() {
        this.pieces = [];
        this.window; 
        this.toolbar = this.createToolbar();
        this.pieceContainer = this.createContainer();
        this.createWindow();


    }

    createWindow() {
        const win = new WindowContainer("Piece Editor", true, {
            width: 400,
            height: 300,
            offsetTop: 0,
            offsetLeft: 500
        });
        this.window = win;
        this.window.appendContent(this.toolbar);
        this.window.appendContent(this.pieceContainer);
        this.window.beforeClose = () => this.window = null;
    }

    createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.classList.add('toolbar');
        toolbar.style.display = 'flex';
        toolbar.style.padding = '5px';

        const btn = document.createElement('button');
        btn.textContent = 'Add Piece';
        btn.onclick = () => {
            this.createDefaultPiece();
        };
        toolbar.appendChild(btn);

        return toolbar;
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


        // drag & reorder support
        let draggedEl = null;


        container.addEventListener('dragstart', (e) => {
            draggedEl = e.target;
            e.dataTransfer.effectAllowed = 'move';
        });

        container.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        container.addEventListener('drop', (e) => {
            e.preventDefault();
            const dropTarget = e.target.closest('.piece-ui');
            if (draggedEl && dropTarget && draggedEl !== dropTarget) {
                const ui1 = this.pieces.find(p => p.container === draggedEl);
                const ui2 = this.pieces.find(p => p.container === dropTarget);
                if (ui1 && ui2) {
                    this.swapPieces(ui1, ui2);
                }
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

        const piece = new Piece([], -1, -1, 0, sprite);
        this.addPiece(piece);
    }

    addPiece(piece) {
        const uiPiece = new UIPiece(piece, this);
        uiPiece.container.setAttribute('draggable', true);
    
        // Add right-click context menu
        uiPiece.container.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e.pageX, e.pageY, uiPiece);
        });
    
        this.pieces.push(uiPiece);
        this.pieceContainer.appendChild(uiPiece.container);
    }

    showContextMenu(x, y, uiPiece) {
        // Remove any existing menu
        const oldMenu = document.getElementById('context-menu');
        if (oldMenu) oldMenu.remove();
    
        const menu = document.createElement('div');
        menu.id = 'context-menu';
        menu.style.position = 'absolute';
        menu.style.top = `${y}px`;
        menu.style.left = `${x}px`;
        menu.style.background = '#fff';
        menu.style.border = '1px solid #aaa';
        menu.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.2)';
        menu.style.padding = '5px';
        menu.style.zIndex = '9999';
        menu.style.fontSize = '14px';
        menu.style.cursor = 'pointer';
    
        const duplicate = document.createElement('div');
        duplicate.textContent = 'Duplicate';
        duplicate.onclick = () => {
            this.duplicatePiece(uiPiece);
            menu.remove();
        };
    
        const del = document.createElement('div');
        del.textContent = 'Delete';
        del.onclick = () => {
            this.deletePiece(uiPiece);
            menu.remove();
        };
    
        menu.appendChild(duplicate);
        menu.appendChild(del);
        document.body.appendChild(menu);
    
        const removeMenu = () => {
            menu.remove();
            document.removeEventListener('click', removeMenu);
        };
        // Remove on click outside
        setTimeout(() => document.addEventListener('click', removeMenu), 0);
    }
    
    duplicatePiece(uiPiece) {
        const original = uiPiece.piece;
        const clonedSprite = structuredClone ? structuredClone(original.sprite) : JSON.parse(JSON.stringify(original.sprite));
        const newPiece = new Piece([...original.types], original.xCoordinate, original.yCoordinate, original.playerOwnerID, clonedSprite);
        this.addPiece(newPiece);
    }
    
    deletePiece(uiPiece) {
        if (uiPiece.container && uiPiece.container.parentElement) {
            uiPiece.container.remove();
        }
    
        this.pieces = this.pieces.filter(p => p !== uiPiece);
    }
    
    swapPieces(ui1, ui2) {
        // Swap in the DOM
        const el1 = ui1.container;
        const el2 = ui2.container;
        const parent = el1.parentElement;
    
        const el1Next = el1.nextElementSibling;
        const el2Next = el2.nextElementSibling;
        
        parent.insertBefore(el2, el1Next);
        parent.insertBefore(el1, el2Next);
    
    }
    
    
}
