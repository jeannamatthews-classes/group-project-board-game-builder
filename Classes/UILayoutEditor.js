class UILayoutEditor {
    constructor() {
        this.container = this.createOverlayContainer();
        this.layoutBoxes = [];
        this.globalBox = null;
        this.isOpen = false;
    }

    createOverlayContainer() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.backgroundColor = 'rgba(255, 255, 255, 1.0)';
        container.style.zIndex = '-1';
        container.style.display = 'none';
        document.body.appendChild(container);
        return container;
    }

    initLayoutBoxes() {
        this.layoutBoxes = [];

        // Rebuild layout boxes live every time
        this.layoutBoxes.push(new UILayoutBox(boardEditor.board, 'Board'));
        this.layoutBoxes.push(new UILayoutBox(playerInventories, 'Inventory'));

        buttonEditor.buttons.forEach(b => {
            this.layoutBoxes.push(new UILayoutBox(b.button, `Button: ${b.button.name}`));
        });

        this.globalBox = new UILayoutBox(globals, 'Global Variables');
        this.addGlobalVariablesForm(this.globalBox);
        this.layoutBoxes.push(this.globalBox);

        this.container.innerHTML = '';
        this.layoutBoxes.forEach(box => this.container.appendChild(box.container));
    }

    addGlobalVariablesForm(globalBox) {
        globalBox.container.querySelector('.global-vars-form')?.remove();

        const form = document.createElement('form');
        form.classList.add('global-vars-form');
        form.style.overflowY = 'auto';
        form.style.maxHeight = '80%';

        const title = document.createElement('h3');
        title.textContent = 'Display Global Variables';
        form.appendChild(title);

        const variableList = document.createElement('ul');
        globalEditor.globalVariables.forEach(variable => {
            const listItem = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `display-${variable.name}`;
            checkbox.checked = variable.display || false;
            checkbox.addEventListener('change', () => {
                variable.display = checkbox.checked;
            });

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = variable.name;

            listItem.appendChild(checkbox);
            listItem.appendChild(label);
            variableList.appendChild(listItem);
        });

        form.appendChild(variableList);
        globalBox.container.appendChild(form);
    }

    open() {
        this.initLayoutBoxes();  // ← Now we build them fresh every time!
        this.isOpen = true;
        this.container.style.display = 'block';
        this.container.style.zIndex = ++__windowZIndex;
    }

    close() {
        this.isOpen = false;
        this.container.style.display = 'none';
    }
}
