class GameGlobalVariables {
    constructor(layoutInfo) {
        this.layoutInfo = layoutInfo;
        this.container = new GameElementContainer({ ...layoutInfo });

        this.displayedVars = layoutInfo.displayVariables;
        this.displayBox = document.createElement('div');
        this.displayBox.style.padding = '10px';
        this.displayBox.style.fontFamily = 'monospace';
        this.displayBox.style.fontSize = '14px';
        this.displayBox.style.color = '#000';

        this.container.addContent(this.displayBox);
        this.refresh();
    }

    refresh() {
        this.displayBox.innerHTML = '';

        // Add built-in core fields from activeGameState
        const coreVars = [
            { name: 'playerAmount', value: activeGameState.playerAmount },
            { name: 'turnNumber', value: activeGameState.turnNumber },
            { name: 'playerTurn', value: activeGameState.playerTurn },
            { name: 'turnPhase', value: activeGameState.turnPhase }
        ];

        coreVars.forEach(v => {
            const row = document.createElement('div');
            row.textContent = `${v.name}: ${v.value}`;
            this.displayBox.appendChild(row);
        });

        // Add user-defined variables (if any)
        this.displayedVars.forEach(name => {
            if (coreVars.some(v => v.name === name)) return; // Skip if already shown

            const match = activeGameState.globalVariables.find(v => v.name === name);
            if (match) {
                const row = document.createElement('div');
                row.textContent = `${match.name}: ${match.value}`;
                this.displayBox.appendChild(row);
            }
        });
    }

    update() {
        this.refresh();
    }

    getElement() {
        return this.container.getElement();
    }
}
