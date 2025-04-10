class UITypeEditor {
    constructor() {
        this.tileTypes = [];
        this.pieceTypes = [];
        this.container = null;
        this.window = null;

        this.createContainer();
        this.createWindow();
    }

    createContainer() {
        const content = document.createElement('div');
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.gap = '20px';

        const makeSection = (label, list, kind) => {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.flexDirection = 'column';
            wrapper.style.border = '1px solid #ccc';
            wrapper.style.padding = '10px';

            const toolbar = document.createElement('div');
            toolbar.style.display = 'flex';
            toolbar.style.justifyContent = 'space-between';
            toolbar.style.alignItems = 'center';
            toolbar.style.marginBottom = '6px';

            const title = document.createElement('strong');
            title.textContent = label;

            const addBtn = document.createElement('button');
            addBtn.textContent = '+ Add';
            addBtn.onclick = () => {
                const newName = this.generateUniqueName("New Type", kind);
                let newType;

                if (kind === 'tile')
                    newType = new UIType(new TileType(newName, []), kind);
                else
                    newType = new UIType(new PieceType(newName, []), kind);

                list.push(newType);
                listDiv.appendChild(newType.container);
            };

            toolbar.appendChild(title);
            toolbar.appendChild(addBtn);

            const listDiv = document.createElement('div');
            listDiv.style.maxHeight = '200px';
            listDiv.style.overflowY = 'auto';
            listDiv.style.border = '1px solid #aaa';
            listDiv.style.padding = '6px';
            listDiv.style.display = 'flex';
            listDiv.style.flexDirection = 'column';
            listDiv.style.gap = '5px';

            list.forEach(t => listDiv.appendChild(t.container));

            wrapper.appendChild(toolbar);
            wrapper.appendChild(listDiv);
            content.appendChild(wrapper);
        };

        makeSection('Tile Types', this.tileTypes, 'tile');
        makeSection('Piece Types', this.pieceTypes, 'piece');

        this.container = content;
    }

    createWindow() {
        const win = new WindowContainer('Types Editor', true, {
            width: 420,
            height: 500,
            offsetTop: 80,
            offsetLeft: 450
        });

        win.appendContent(this.container);
        this.window = win;
        this.window.beforeClose = () => this.window = null;
    }

    generateUniqueName(base, kind) {
        const list = {
            tile: this.tileTypes,
            piece: this.pieceTypes
        }[kind];

        let index = 1;
        let newName = base;
        const nameExists = (name) => list.some(t => t.type.typeName === name);

        while (nameExists(newName)) {
            newName = base + index++;
        }

        return newName;
    }

    duplicateType(original) {
        const clone = JSON.parse(JSON.stringify(original.type));
        clone.typeID = assignTypeID();
        clone.typeName = this.generateUniqueName(clone.typeName+'_copy', original.kind);

        const newUIType = new UIType(clone, original.kind);

        const list = {
            tile: this.tileTypes,
            piece: this.pieceTypes
        }[original.kind];

        list.push(newUIType);

        const parent = original.container.parentElement;
        parent.insertBefore(newUIType.container, original.container.nextSibling);

        return newUIType;
    }

    removeType(uiType) {
        const list = uiType.kind === 'tile' ? this.tileTypes : this.pieceTypes;
        const index = list.indexOf(uiType);
    
        if (index !== -1) {
            list.splice(index, 1); // Remove from internal list
            if (uiType.container && uiType.container.parentElement) {
                uiType.container.parentElement.removeChild(uiType.container); // Remove from DOM
            }
        }
    }
    
}
