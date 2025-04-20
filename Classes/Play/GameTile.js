class GameTile {
    constructor(logicalTile) {
        this.logical = logicalTile;
        this.pieceWrapper = null;

        this.container = document.createElement('div');
        this.container.classList.add('game-tile');
        this.container.style.position = 'relative';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.boxSizing = 'border-box';
        this.container.style.border = '1px solid rgba(0,0,0,0.2)';
        this.container.style.cursor = 'pointer';
        this.container.style.overflow = 'hidden';

        this.container.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('click tile: x-', this.logical.xCoordinate, ' y-', this.logical.yCoordinate);
            this.logical.clickObject(true);
        });

        this.refresh();
    }

    refresh() {
        const el = this.container;
        el.innerHTML = '';
        el.style.backgroundColor = this.logical.sprite.fillColor || '#ccc';
        el.style.opacity = this.logical.enabled === false ? '0.4' : '1';

        // SVG overlay
        if (this.logical.sprite.imageName && SPRITE_LIBRARY[this.logical.sprite.imageName]) {
            const wrapper = document.createElement('div');
            wrapper.style.position = 'absolute';
            wrapper.style.top = '0';
            wrapper.style.left = '0';
            wrapper.style.width = '100%';
            wrapper.style.height = '100%';
            wrapper.style.pointerEvents = 'none';
            wrapper.style.zIndex = 1;

            const temp = document.createElement('div');
            temp.innerHTML = SPRITE_LIBRARY[this.logical.sprite.imageName];
            const svg = temp.querySelector('svg');

            if (svg) {
                svg.setAttribute('width', '100%');
                svg.setAttribute('height', '100%');
                svg.style.display = 'block';

                svg.querySelectorAll('[fill]').forEach(el => {
                    el.setAttribute('fill', this.logical.sprite.imageColor || '#000');
                });

                wrapper.appendChild(svg);
                el.appendChild(wrapper);
            }
        }

        // Text overlay
        if (this.logical.sprite.text) {
            const text = document.createElement('div');
            text.innerText = this.logical.sprite.text;
            text.style.position = 'absolute';
            text.style.top = '50%';
            text.style.left = '50%';
            text.style.transform = 'translate(-50%, -50%)';
            text.style.color = this.logical.sprite.textColor || '#000';
            text.style.fontSize = '10px';
            text.style.fontWeight = 'bold';
            text.style.zIndex = 2;
            text.style.pointerEvents = 'none';
            el.appendChild(text);
        }

        // Recreate pieceWrapper after refresh
        this.pieceWrapper = document.createElement('div');
        this.pieceWrapper.classList.add('piece-tile-wrapper');
        this.pieceWrapper.style.position = 'absolute';
        this.pieceWrapper.style.top = '0';
        this.pieceWrapper.style.left = '0';
        this.pieceWrapper.style.width = '100%';
        this.pieceWrapper.style.height = '100%';
        this.pieceWrapper.style.display = 'grid';
        this.pieceWrapper.style.zIndex = '5';

        el.appendChild(this.pieceWrapper);
    }

    update() {
        const newLogical = activeGameState.board.getTile(this.logical.xCoordinate, this.logical.yCoordinate);
        if (!newLogical) return;
        this.logical = newLogical;
        this.refresh();
    }

    addPiece(logicalPiece) {
        const piece = new GamePiece(logicalPiece);
        const el = piece.getElement();

        const currentCount = this.pieceWrapper.children.length + 1;
        const gridSize = Math.ceil(Math.sqrt(currentCount));
        this.pieceWrapper.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        this.pieceWrapper.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

        el.style.width = '100%';
        el.style.height = '100%';

        this.pieceWrapper.appendChild(el);
    }
}
