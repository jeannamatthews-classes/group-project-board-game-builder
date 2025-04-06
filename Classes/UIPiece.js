class UIPiece {
    constructor(piece, editor) {
        this.piece = piece;
        this.editor = editor;
        this.container = null;
        this.boardContainer = null;
        this.editorWindow = null;
        this.createPieceElement();
        
    }

    createPieceElement() {
        const create = () => {
            const el = document.createElement('div');
            el.classList.add('piece-ui');
            el.setAttribute('data-id', this.piece.objectID);
            el.style.width = '40px';
            el.style.height = '40px';
            el.style.position = 'relative';
            el.style.display = 'flex';
            el.style.alignItems = 'center';
            el.style.justifyContent = 'center';
            el.style.cursor = 'pointer';
            return el;
        };
    
        this.container = create();
        this.boardContainer = create();
        this.boardContainer.classList.add('board-piece')
    
        this.updateSprite();
    
        this.container.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openEditorWindow();
        });
    }
    


updateSprite(sprite = this.piece.sprite) {
    const renderTo = (el) => {
        const s = sprite;
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
    };

    renderTo(this.container);
    renderTo(this.boardContainer);
}

    openEditorWindow() {
        if (this.editorWindow && document.body.contains(this.editorWindow.container)) {
            this.editorWindow.container.style.zIndex = ++__windowZIndex;
            return;}
    const temp = structuredClone ? structuredClone(this.piece.sprite) : JSON.parse(JSON.stringify(this.piece.sprite));

    const win = new WindowContainer(`Piece (${this.piece.objectID})`, true, {
        width: 300,
        height: 300,
        offsetTop: 100,
        offsetLeft: 400
    });
    this.editorWindow=win;

    // TEMPORARY CONTENT TO EDIT
    const content = document.createElement('div');
    content.innerHTML = `
        <label>Shape:
            <select id="shape">
                <option value="square">Square</option>
                <option value="circle">Circle</option>
                <option value="triangle">Triangle</option>
            </select>
        </label><br>
        <label>Fill Color: <input type="color" id="fill-color"></label><br>
        <label>Stroke Color: <input type="color" id="stroke-color"></label><br>
        <label>Text: <input type="text" id="piece-text"></label><br>
        <label>Text Color: <input type="color" id="text-color"></label><br>
        <div style="text-align:center; margin-top:10px;">
            <button id="save-btn">Save and Close</button>
            <button id="cancel-btn">Cancel</button>
        </div>
    `;

    const shape = content.querySelector('#shape');
    const fill = content.querySelector('#fill-color');
    const stroke = content.querySelector('#stroke-color');
    const text = content.querySelector('#piece-text');
    const textColor = content.querySelector('#text-color');

    // Set initial values
    shape.value = temp.shape;
    fill.value = temp.fillColor;
    stroke.value = temp.strokeColor;
    text.value = temp.text;
    textColor.value = temp.textColor;

    const updateTemp = () => {
        temp.shape = shape.value;
        temp.fillColor = fill.value;
        temp.strokeColor = stroke.value;
        temp.text = text.value;
        temp.textColor = textColor.value;
        this.updateSprite(temp);
    };

    shape.addEventListener('change', updateTemp);
    fill.addEventListener('input', updateTemp);
    stroke.addEventListener('input', updateTemp);
    text.addEventListener('input', updateTemp);
    textColor.addEventListener('input', updateTemp);

    // Save & Close
    content.querySelector('#save-btn').addEventListener('click', () => {
        this.piece.sprite = temp;
        this.updateSprite();
        win.close(); // triggers default close
    });

    // Cancel — revert to original
    content.querySelector('#cancel-btn').addEventListener('click', () => {
        this.updateSprite(); // redraw original
        win.close(); 
    });

    // Hook into X close to also cancel
    win.beforeClose = () => {
        this.updateSprite();
    };

    win.appendContent(content);
}
}
