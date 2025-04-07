class UIType {
    constructor(type, kind) { // kind = 'tile' | 'piece' | 'button'
        this.type = type;
        this.kind = kind;
        this.container = this.createContainer();
        this.window = null;
        this.openEditorWindow();
    }

    createContainer() {
        const row = document.createElement('div');
        row.style.height = `18px`;
        row.style.paddingTop = '6px';
        row.style.paddingBottom = '6px';
        row.style.fontSize = '18px';
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';
        row.style.cursor = 'pointer';
    
        const nameSpan = document.createElement('span');
        nameSpan.textContent = this.type.typeName;
        row.appendChild(nameSpan);
    
        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.gap = '4px';
    
        // Move Up
        const upBtn = document.createElement('button');
        upBtn.textContent = '↑';
        upBtn.title = 'Move up';
        upBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const parent = row.parentElement;
            if (row.previousElementSibling) {
                parent.insertBefore(row, row.previousElementSibling);
            }
        });
    
        // Move Down
        const downBtn = document.createElement('button');
        downBtn.textContent = '↓';
        downBtn.title = 'Move down';
        downBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const parent = row.parentElement;
            const next = row.nextElementSibling;
            if (next) {
                parent.insertBefore(next, row);
            }
        });
    
        // Duplicate
        const duplicateBtn = document.createElement('button');
        duplicateBtn.textContent = '⧉';
        duplicateBtn.title = 'Duplicate type';
        duplicateBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            typeEditor.duplicateType(this);
        });
    
        // Remove
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✕';
        removeBtn.title = 'Remove type';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            row.remove();
            typeEditor.removeType(this); // optional hook
        });
    
        controls.appendChild(upBtn);
        controls.appendChild(downBtn);
        controls.appendChild(duplicateBtn);
        controls.appendChild(removeBtn);
        row.appendChild(controls);
    
        row.addEventListener('click', () => this.openEditorWindow());
    
        this._nameSpan = nameSpan;
        return row;
    }
    
    

    openEditorWindow() {
        if (this.window && document.body.contains(this.window.container)) {
            this.window.container.style.zIndex = ++__windowZIndex;
            return;
        }

        const win = new WindowContainer(`Type: ${this.type.typeName}`, true, {
            width: 350,
            height: 400,
            offsetTop: 80,
            offsetLeft: 520
        });

        const content = document.createElement('div');
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.gap = '8px';

        // Name
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = this.type.typeName;
        nameInput.addEventListener('input', e => {
            const newName = e.target.value.trim();
            const list = {
                tile: typeEditor.tileTypes,
                piece: typeEditor.pieceTypes,
                button: typeEditor.buttonTypes
            }[this.kind];
        
            const isDuplicate = list.some(t => t !== this && t.type.typeName === newName);
        
            if (isDuplicate) {
                nameInput.style.borderColor = 'red';
                return;
            }
        
            nameInput.style.borderColor = '';
            this.type.typeName = newName;
            this._nameSpan.textContent = newName;
            win.header.querySelector('span').textContent = `Type: ${newName}`;
        });
        

        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Name:';
        nameLabel.appendChild(nameInput);
        content.appendChild(nameLabel);

        // Scripting Rules
        const rulesHeader = document.createElement('div');
        rulesHeader.innerHTML = '<strong>Scripting Rules</strong>';
        content.appendChild(rulesHeader);

        const rulesList = document.createElement('div');
        rulesList.id = 'rules-list';
        content.appendChild(rulesList);

        const addRule = document.createElement('button');
        addRule.textContent = '+ Add Rule';
        addRule.addEventListener('click', () => {
            const rule = document.createElement('div');
            rule.textContent = '[new rule]';
            rulesList.appendChild(rule);
        });
        content.appendChild(addRule);

        // Public Vars
        const varsHeader = document.createElement('div');
        varsHeader.innerHTML = '<strong>Public Variables</strong>';
        content.appendChild(varsHeader);

        const varsList = document.createElement('div');
        varsList.id = 'vars-list';
        content.appendChild(varsList);

        const renderVars = () => {
            varsList.innerHTML = '';
            this.type.publicVars.forEach((v, index) => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.gap = '4px';
                row.style.alignItems = 'center';

                const name = document.createElement('input');
                name.value = v.name;
                name.placeholder = 'name';
                name.style.width = '75px';
                name.addEventListener('input', e => v.name = e.target.value);

                const value = document.createElement('input');
                value.value = v.value;
                value.placeholder = 'value';
                value.style.width = '75px';
                value.addEventListener('input', e => v.value = e.target.value);

                const typeSelect = document.createElement('select');
                ['string', 'boolean', 'number'].forEach(t => {
                    const opt = document.createElement('option');
                    opt.value = t;
                    opt.textContent = t;
                    if (v.type === t) opt.selected = true;
                    typeSelect.appendChild(opt);
                });
                typeSelect.addEventListener('change', e => v.type = e.target.value);

                const remove = document.createElement('button');
                remove.textContent = '✕';
                remove.addEventListener('click', () => {
                    this.type.publicVars.splice(index, 1);
                    renderVars();
                });

                row.appendChild(name);
                row.appendChild(value);
                row.appendChild(typeSelect);
                row.appendChild(remove);
                varsList.appendChild(row);
            });
        };

        const addVar = document.createElement('button');
        addVar.textContent = '+ Add Public Var';
        addVar.addEventListener('click', () => {
            this.type.publicVars.push({ name: '', value: '', type: 'string' });
            renderVars();
        });
        content.appendChild(addVar);

        renderVars();

        win.appendContent(content);
        this.window = win;
    }
}
