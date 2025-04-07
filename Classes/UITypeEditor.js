
class UITypeEditor {
    constructor() {
        this.tileTypes = []; //does NOT store types necessarily in visual order. 
        this.pieceTypes = [];
        this.buttonTypes = [];
        this.container;
        this.window;
        this.createContainer();
        this.createWindow();
    }

        createContainer() {

        const content = document.createElement('div');
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.gap = '10px';

        const makeSection = (label, list, kind) => {
            const wrapper = document.createElement('div');
            const title = document.createElement('div');
            title.innerHTML = `<strong>${label}</strong> <button>+ Add</button>`;
            const listDiv = document.createElement('div');

            title.querySelector('button').onclick = () => {
                const newName = `${kind}_type_${list.length + 1}`;
                var newType;
                if(kind == 'tile')
                    newType = new UIType(new TileType(newName,[]), kind);
                else
                    newType = new UIType(new PieceType(newName,[]), kind);
                list.push(newType);
                listDiv.appendChild(newType.container);
            };


            wrapper.appendChild(title);
            wrapper.appendChild(listDiv);
            content.appendChild(wrapper);
        };

        makeSection('Tile Types', this.tileTypes, 'tile');
        makeSection('Piece Types', this.pieceTypes, 'piece');
        makeSection('Button Types', this.buttonTypes, 'button');

        this.container = content;

        }


        createWindow(){

        const win = new WindowContainer('Types Editor', true, {
            width: 400,
            height: 400,
            offsetTop: 100,
            offsetLeft: 400
        });

        win.appendContent(this.container);
        this.window = win;
        this.window.beforeClose = () => this.window = null;
    }
    generateUniqueName(base, kind) {
        const list = {
            tile: this.tileTypes,
            piece: this.pieceTypes,
            button: this.buttonTypes
        }[kind];

        let index = 1;
        let newName = `${base}_copy`;
        const nameExists = (name) => list.some(t => t.type.typeName === name);

        while (nameExists(newName)) {
            newName = `${base}_copy_${index++}`;
        }

        return newName;
    }

    duplicateType(original) {
        const clone = JSON.parse(JSON.stringify(original.type));
        clone.typeID = assignTypeID();
        clone.typeName = this.generateUniqueName(clone.typeName, original.kind);

        const newUIType = new UIType(clone, original.kind);

        const list = {
            tile: this.tileTypes,
            piece: this.pieceTypes,
            button: this.buttonTypes
        }[original.kind];

        list.push(newUIType);

        const parent = original.container.parentElement;
        parent.insertBefore(newUIType.container, original.container.nextSibling);

        return newUIType;
    }
    
}
