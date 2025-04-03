class UIPiece {
    constructor(piece, editor) {
        this.piece = piece;
        this.editor = editor;
        this.container = this.createPieceElement();
    }

    createPieceElement() {
        const pieceEl = document.createElement('div');
        pieceEl.classList.add('piece-ui');
        pieceEl.setAttribute('data-id', this.piece.objectID);
        pieceEl.style.zIndex = '10';
        pieceEl.style.position = 'relative';
        pieceEl.style.width = '40px';
        pieceEl.style.height = '40px';
        pieceEl.style.display = 'flex';
        pieceEl.style.alignItems = 'center';
        pieceEl.style.justifyContent = 'center';
        pieceEl.style.cursor = 'pointer';

        this.updateSprite(pieceEl);

        pieceEl.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.editor.activeTool === 'select') {
                this.openEditorWindow();
            }
        });

        return pieceEl;
    }

    updateSprite(el = this.container) {
        const s = this.piece.sprite;
        el.innerHTML = '';

        const shape = document.createElement('div');
        shape.classList.add('sprite-shape');
        shape.style.backgroundColor = s.fillColor;
        shape.style.border = `2px solid ${s.strokeColor}`;
        shape.style.width = '80%';
        shape.style.height = '80%';
        shape.style.display = 'flex';
        shape.style.alignItems = 'center';
        shape.style.justifyContent = 'center';
        shape.style.color = s.textColor || '#000';
        shape.style.fontSize = '10px';

        if (s.shape === 'circle') {
            shape.style.borderRadius = '50%';
        } else if (s.shape === 'triangle') {
            shape.style.width = '0';
            shape.style.height = '0';
            shape.style.border = 'none';
            shape.style.borderLeft = '10px solid transparent';
            shape.style.borderRight = '10px solid transparent';
            shape.style.borderBottom = `20px solid ${s.fillColor}`;
            shape.innerHTML = '';
        }

        if (s.shape !== 'triangle') {
            shape.innerText = s.text || '';
        }

        el.appendChild(shape);
    }

    openEditorWindow() {
        const s = this.piece.sprite;

        const win = new WindowContainer(`Piece (${this.piece.objectID})`, true, {
            width: 300,
            height: 250,
            offsetTop: 100,
            offsetLeft: 400
        });

        const content = document.createElement('div');
        content.innerHTML = `
            <label>Shape:
                <select id="shape">
                    <option value="square">Square</option>
                    <option value="circle">Circle</option>
                    <option value="triangle">Triangle</option>
                </select>
            </label><br>
            <label>Fill Color: <input type="color" id="fill-color" value="${s.fillColor}"></label><br>
            <label>Stroke Color: <input type="color" id="stroke-color" value="${s.strokeColor}"></label><br>
            <label>Text: <input type="text" id="piece-text" value="${s.text || ''}"></label><br>
            <label>Text Color: <input type="color" id="text-color" value="${s.textColor || '#000000'}"></label>
        `;

        const shape = content.querySelector('#shape');
        const fill = content.querySelector('#fill-color');
        const stroke = content.querySelector('#stroke-color');
        const text = content.querySelector('#piece-text');
        const textColor = content.querySelector('#text-color');

        // Set selector to match current value
        shape.value = s.shape;

        const updateSprite = () => {
            s.shape = shape.value;
            s.fillColor = fill.value;
            s.strokeColor = stroke.value;
            s.text = text.value;
            s.textColor = textColor.value;
            this.updateSprite();
        };

        // Attach listeners
        shape.addEventListener('change', updateSprite);
        fill.addEventListener('input', updateSprite);
        stroke.addEventListener('input', updateSprite);
        text.addEventListener('input', updateSprite);
        textColor.addEventListener('input', updateSprite);

        win.appendContent(content);
    }
}
