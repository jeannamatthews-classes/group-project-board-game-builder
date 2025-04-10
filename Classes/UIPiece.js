class UIPiece {
    constructor(piece, editor) {
        this.piece = piece;
        this.editor = editor;
        this.container = null;
        this.boardContainer = null;
        this.editorWindow = null;
        this.refreshEditorWindowContent = null;

        this.createPiece();
    }

    createPiece() {
        const create = () => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('piece-ui');
            wrapper.setAttribute('data-id', this.piece.objectID);
            wrapper.style.width = '40px';
            wrapper.style.height = '40px';
            wrapper.style.position = 'relative';
            wrapper.style.display = 'flex';
            wrapper.style.flexDirection = 'column';
            wrapper.style.alignItems = 'center';
            wrapper.style.justifyContent = 'center';        
            wrapper.style.cursor = 'pointer';       

            const icon = document.createElement('div');
            icon.style.width = '40px';
            icon.style.height = '40px';
            wrapper.appendChild(icon);

            wrapper._icon = icon;
            return wrapper;
        };

        this.container = create();
        this.boardContainer = document.createElement('div');
        this.boardContainer.classList.add('board-piece');
        this.boardContainer.style.width = '40px';
        this.boardContainer.style.height = '40px';
        this.boardContainer.style.position = 'relative';
        this.boardContainer.style.display = 'flex';
        this.boardContainer.style.alignItems = 'center';
        this.boardContainer.style.justifyContent = 'center';
        this.boardContainer.style.cursor = 'pointer';

        this.updateSprite();

        this.container.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openEditorWindow();
        });
    }

    updateSprite(sprite = this.piece.sprite) {
        const renderTo = (el) => {
            const target = el._icon || el;
            target.innerHTML = '';

            const s = sprite;
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
            } else {
                shape.innerText = s.text || '';
            }

            target.appendChild(shape);
        };

        renderTo(this.container);
        renderTo(this.boardContainer);

    }

    openEditorWindow() {
        if (this.editorWindow && document.body.contains(this.editorWindow.container)) {
            this.editorWindow.container.style.zIndex = ++__windowZIndex;
            this.refreshEditorWindowContent?.();
            return;
        }

        const win = new WindowContainer(`Piece: ${this.piece.name}`, true, {
            width: 320,
            height: 440,
            offsetTop: 100,
            offsetLeft: 400
        });
        this.editorWindow = win;

        const content = document.createElement('div');
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.gap = '6px';

        content.innerHTML = `
            <label>Name: <input type="text" id="piece-name" /></label>
            <label>Shape:
                <select id="shape">
                    <option value="square">Square</option>
                    <option value="circle">Circle</option>
                    <option value="triangle">Triangle</option>
                </select>
            </label>
            <label>Fill Color: <input type="color" id="fill-color"></label>
            <label>Stroke Color: <input type="color" id="stroke-color"></label>
            <label>Text: <input type="text" id="piece-text"></label>
            <label>Text Color: <input type="color" id="text-color"></label>
            <hr>
            <div><strong>Piece Types</strong> <button id="add-type">+ Add Type</button></div>
            <div id="type-list"></div>
            <hr>
            <div id="location-controls"></div>
        `;

        const nameInput = content.querySelector('#piece-name');
        const shape = content.querySelector('#shape');
        const fill = content.querySelector('#fill-color');
        const stroke = content.querySelector('#stroke-color');
        const text = content.querySelector('#piece-text');
        const textColor = content.querySelector('#text-color');
        const typeList = content.querySelector('#type-list');
        const addTypeBtn = content.querySelector('#add-type');
        const locationControls = content.querySelector('#location-controls');

        const renderTypes = () => {
            typeList.innerHTML = '';
            this.piece.types.forEach((type, i) => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.justifyContent = 'space-between';

                const span = document.createElement('span');
                span.textContent = type;

                const remove = document.createElement('button');
                remove.textContent = '✕';
                remove.onclick = () => {
                    this.piece.types.splice(i, 1);
                    renderTypes();
                };

                row.appendChild(span);
                row.appendChild(remove);
                typeList.appendChild(row);
            });
        };

        addTypeBtn.onclick = () => {
            const select = document.createElement('select');
            TILE_TYPES.forEach(type => {
                if (!this.piece.types.includes(type)) {
                    const opt = document.createElement('option');
                    opt.value = type;
                    opt.textContent = type;
                    select.appendChild(opt);
                }
            });

            const confirm = document.createElement('button');
            confirm.textContent = '✔';
            confirm.onclick = () => {
                this.piece.types.push(select.value);
                renderTypes();
                select.remove();
                confirm.remove();
            };

            content.insertBefore(select, typeList);
            content.insertBefore(confirm, typeList);
        };

        const updateLocationDisplay = () => {
            locationControls.innerHTML = '';
            const { xCoordinate: x, yCoordinate: y } = this.piece;

            if (x >= 0 && y >= 0) {
                const label = document.createElement('div');
                label.textContent = `On board at (${x}, ${y})`;
                locationControls.appendChild(label);

                const removeBtn = document.createElement('button');
                removeBtn.textContent = 'Remove from Board';
                removeBtn.onclick = () => {
                    this.piece.xCoordinate = -1;
                    this.piece.yCoordinate = -1;
                    boardEditor.tiles[y][x].updatePieceDisplay();
                    updateLocationDisplay();
                };
                locationControls.appendChild(removeBtn);
            } else {
                const label = document.createElement('div');
                label.textContent = 'Not on board.';
                locationControls.appendChild(label);

                const xInput = document.createElement('input');
                xInput.type = 'number';
                xInput.min = 0;
                xInput.max = boardEditor.board.width - 1;
                xInput.placeholder = 'x';

                const yInput = document.createElement('input');
                yInput.type = 'number';
                yInput.min = 0;
                yInput.max = boardEditor.board.height - 1;
                yInput.placeholder = 'y';

                const placeBtn = document.createElement('button');
                placeBtn.textContent = 'Place on Board';
                placeBtn.onclick = () => {
                    const newX = parseInt(xInput.value);
                    const newY = parseInt(yInput.value);

                    if (!isNaN(newX) && !isNaN(newY) &&
                        newX >= 0 && newX < boardEditor.board.width &&
                        newY >= 0 && newY < boardEditor.board.height) {
                        this.piece.xCoordinate = newX;
                        this.piece.yCoordinate = newY;
                        boardEditor.tiles[newY][newX].updatePieceDisplay();
                        updateLocationDisplay();
                    }
                };

                locationControls.append(xInput, yInput, placeBtn);
            }
        };

        const wireInputs = () => {
            nameInput.value = this.piece.name;
            shape.value = this.piece.sprite.shape;
            fill.value = this.piece.sprite.fillColor;
            stroke.value = this.piece.sprite.strokeColor;
            text.value = this.piece.sprite.text;
            textColor.value = this.piece.sprite.textColor;

            nameInput.addEventListener('input', (e) => {
                const newName = e.target.value.trim();
                const isDuplicate = pieceEditor.pieces.some(p =>
                    p !== this && p.piece.name === newName
                );

                if (!newName || isDuplicate) {
                    nameInput.style.borderColor = 'red';
                    return;
                }

                nameInput.style.borderColor = '';
                this.piece.name = newName;
                win.header.querySelector('span').textContent = `Piece: ${newName}`;
            });

            const update = () => {
                this.piece.sprite.shape = shape.value;
                this.piece.sprite.fillColor = fill.value;
                this.piece.sprite.strokeColor = stroke.value;
                this.piece.sprite.text = text.value;
                this.piece.sprite.textColor = textColor.value;
                this.updateSprite();
            };

            shape.addEventListener('change', update);
            fill.addEventListener('input', update);
            stroke.addEventListener('input', update);
            text.addEventListener('input', update);
            textColor.addEventListener('input', update);
        };

        this.refreshEditorWindowContent = () => {
            wireInputs();
            renderTypes();
            updateLocationDisplay();
        };

        this.refreshEditorWindowContent();
        win.onMouseDown = () => {
            if (__windowZIndex != win.container.style.zIndex)
                this.refreshEditorWindowContent();
        };
        win.appendContent(content);
    }
}
