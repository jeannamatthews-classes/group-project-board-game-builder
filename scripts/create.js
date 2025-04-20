
var boardCreator;
var centerTile;
var leftTile;
var rightTile;
var widthInput;
var heightInput;
var doneButton;
var tileType;
var minPlayersInput;
var maxPlayersInput;
var boardType;


const boardTypeText = ["Square", "Hex", "Triangle"]
const boardTypeSources = ["images/square.png","images/hexagon.png","images/triangle.png"];
var boardEditor;
var pieceEditor;
var typeEditor;
var buttonEditor;
var globalEditor;
var minPlayers;
var maxPlayers;
var playerInventories;
var globals;
var layoutEditor;


var boardType = 0;


function changeBoardType(direction){
    boardType = (boardType + direction + 3) % 3
    tileType.innerHTML = boardTypeText[boardType];
    centerTile.src = boardTypeSources[boardType];
    rightTile.src = boardTypeSources[(boardType - 1 + boardTypeSources.length) % boardTypeSources.length];
    leftTile.src = boardTypeSources[(boardType + 1) % boardTypeSources.length];
    validateInputs();
}

function submitBoard(){
    playerInventories = {containerWidth: -1, containerHeight: -1, containerTop: -1, containerLeft:-1, borderColor:'rgba(0, 0, 0, 0.9)', borderWidth:'2px', backgroundColor:'rgba(255, 255, 255, 0.9)'}
    globals = {containerWidth: -1, containerHeight: -1, containerTop: -1, containerLeft:-1, borderColor:'rgba(0, 0, 0, 0.9)', borderWidth:'2px', backgroundColor:'rgba(255, 255, 255, 0.9)', displayVariables:[]}
    boardEditor = new UIBoard(new Board(boardTypeText[boardType], parseInt(widthInput.value), parseInt(heightInput.value)))
    pieceEditor = new UIPieceEditor();
    typeEditor = new UITypeEditor();
    buttonEditor = new UIButtonEditor();
    globalEditor = new UIGlobalEditor();
    minPlayers = parseInt(minPlayersInput.value);
    maxPlayers = parseInt(maxPlayersInput.value);    
    setUpButtons()
    typeEditor.window.close();
    buttonEditor.window.close();
    document.getElementById("main-screen").innerHTML = ''; 
}


function validateInputs() {
    minPlayers = parseInt(minPlayersInput.value);
    maxPlayers = parseInt(maxPlayersInput.value);

    const widthValid = widthInput.checkValidity() && parseInt(widthInput.value) > 0 && parseInt(widthInput.value) < 999;
    const heightValid = heightInput.checkValidity() && parseInt(heightInput.value) > 0 && parseInt(heightInput.value) < 999;
    
    const minValid = minPlayersInput.checkValidity() && minPlayers >= 1;
    const maxValid = maxPlayersInput.checkValidity() && maxPlayers >= minPlayers;

    doneButton.disabled = !(widthValid && heightValid && minValid && maxValid && boardType==0);
}




function setUpButtons(){
    const controls = document.createElement('div');
    controls.id = 'control-buttons';
   
    let previewEnabled = true;
    layoutEditor = new UILayoutEditor();
    

    // --- Preview Toggle ---
    const previewBtn = document.createElement('div');
    previewBtn.classList.add('control-btn');
    previewBtn.style.backgroundImage = `url(images/preview_on.png)`;
    previewBtn.title = 'Toggle Layout Editor';


    // --- Download Button ---
    const downloadBtn = document.createElement('div');
    downloadBtn.classList.add('control-btn');
    downloadBtn.style.backgroundImage = `url(images/download.png)`;
    downloadBtn.title = 'Download';
    downloadBtn.onclick = () => saveCode();


    // --- Edit Button ---
    const editBtn = document.createElement('div');
    editBtn.classList.add('control-btn');
    editBtn.style.backgroundImage = `url(images/edit.png)`;
    editBtn.title = 'Open Editors / Toggle Boxes';

    previewBtn.onclick = () => {
        if (layoutEditor.isOpen) {
            layoutEditor.close();
            previewBtn.style.backgroundImage = 'url(images/preview_off.png)';
            setEditBtnToEditors();  // ← Add this!
        } else {
            layoutEditor.open();
            console.log(layoutEditor.layoutBoxes);
            previewBtn.style.backgroundImage = 'url(images/preview_on.png)';
            setEditBtnToLayoutBoxes();
        }
    };    

    function setEditBtnToEditors() {
        editBtn.onclick = () => {
            if (!window.editorLauncherWindow || !document.body.contains(window.editorLauncherWindow.container)) {
                const win = new WindowContainer('Editor Launcher', true, {
                    width: 300,
                    height: 250,
                    offsetTop: 60,
                    offsetLeft: 500
                });
                win.setContent(`
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <div><strong>Board Editor</strong> <button onclick="openEditor('board')">Open</button></div>
                        <div><strong>Pieces Editor</strong> <button onclick="openEditor('pieces')">Open</button></div>
                        <div><strong>Buttons Editor</strong> <button onclick="openEditor('buttons')">Open</button></div>
                        <div><strong>Types Editor</strong> <button onclick="openEditor('types')">Open</button></div>
                        <div><strong>Global Editor</strong> <button onclick="openEditor('global')">Open</button></div>
                    </div>
                `);
                window.editorLauncherWindow = win;
            } else {
                window.editorLauncherWindow.container.style.zIndex = ++__windowZIndex;
            }
        };
    }

    function setEditBtnToLayoutBoxes() {
        editBtn.onclick = () => {
            if (!window.layoutBoxToggleWindow || !document.body.contains(window.layoutBoxToggleWindow.container)) {
                const win = new WindowContainer('Toggle Layout Boxes', true, {
                    width: 300,
                    height: 300,
                    offsetTop: 60,
                    offsetLeft: 500
                });

                let html = `<div style="display: flex; flex-direction: column; gap: 6px;">`;
                layoutEditor.layoutBoxes.forEach(box => {
                    html += `
                        <div>
                            <label>
                                <input type="checkbox" ${box.container.style.display !== 'none' ? 'checked' : ''} 
                                    onchange="this.checked ? layoutEditor.showBox('${box.name}') : layoutEditor.hideBox('${box.name}')">
                                ${box.name}
                            </label>
                        </div>
                    `;
                });
                html += `</div>`;
                
                win.setContent(html);
                window.layoutBoxToggleWindow = win;
            } else {
                window.layoutBoxToggleWindow.container.style.zIndex = ++__windowZIndex;
            }
        };
    }

    layoutEditor.showBox = (label) => {
        const box = layoutEditor.layoutBoxes.find(b => b.name === label);
        if (box) box.container.style.display = 'block';
    };

    layoutEditor.hideBox = (label) => {
        const box = layoutEditor.layoutBoxes.find(b => b.name === label);
        if (box) box.container.style.display = 'none';
    };

    // Initialize with editor mode by default
    setEditBtnToEditors();

    controls.appendChild(previewBtn);
    controls.appendChild(downloadBtn);
    controls.appendChild(editBtn);
    document.body.appendChild(controls);
}





function openEditor(type) {
    switch (type) {
        case 'board':
            if(!boardEditor.window)
                boardEditor.createWindow();
            else
                boardEditor.window.container.style.zIndex = ++__windowZIndex; //IF THE EDTIOR ALREADY EXISTS.... INCREASE Z INDEX
            break;
        case 'pieces':
            if(!pieceEditor.window)
                pieceEditor.createWindow();
            else 
                pieceEditor.window.container.style.zIndex = ++__windowZIndex;
            break;
        case 'buttons':
            if(!buttonEditor.window )
                buttonEditor.createWindow();
            else 
                buttonEditor.window.container.style.zIndex = ++__windowZIndex;
            console.log(buttonEditor)
            break;
        case 'types':
            if (!typeEditor.window) 
                typeEditor.createWindow();
            else 
                typeEditor.window.container.style.zIndex = ++__windowZIndex;
            break;
        case 'global':
            if (!globalEditor.window)
                globalEditor.createWindow();
            else
                globalEditor.window.container.style.zIndex  = ++__windowZIndex;
            break;
    }
}



function saveCode() {
    const game = {
        minPlayers: minPlayers,
        maxPlayers: maxPlayers,
        board: boardEditor.board.saveCode(),
        pieces: pieceEditor.pieces.map(pieceUI =>
            pieceUI.piece.saveCode()
        ),
        pieceTypes: typeEditor.pieceTypes.map(typeUI => typeUI.type.saveCode()),
        tileTypes: typeEditor.tileTypes.map(typeUI => typeUI.type.saveCode()),
        buttons: buttonEditor.buttons.map(buttonUI => buttonUI.button.saveCode()),
        globalVariables: globalEditor.globalVariables,
        globalScripts: globalEditor.globalScripts.map(scriptUI => scriptUI.form.script.saveCode()),
        inventoryLayout: playerInventories,
        globalLayout: globals
    };

    const json = JSON.stringify(game, null, 4);  // Pretty print for humans
    const blob = new Blob([json], { type: 'application/json' });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    
    const filename = prompt("Enter a filename for your game:", "myGame.json") || "game.json";
    
    a.download = filename.endsWith('.json') ? filename : filename + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


function newGame() {
    const container = document.createElement('div');
    container.id = 'board-creator';
    container.className = 'container-main text-center';
    container.innerHTML = `
        <div class="header">SELECT YOUR BOARD</div>
        <div class="creation-form">
            <div class="labels">Choose Board Type</div>
            <div class="tile-images">
                <img id="tile-left" src="images/hexagon.png">
                <img id="tile-center" src="images/square.png">
                <img id="tile-right" src="images/triangle.png">
            </div>
            <div class="tile-selector">
                <div class="arrow-btn left" onclick="changeBoardType(-1)"></div>
                <div id="tile-type" class="tile-type">SQUARE</div>
                <div class="arrow-btn right" onclick="changeBoardType(1)"></div>
            </div>
            <div class="labels">Set Board Size</div>
            <div class="size-selector">
                <div class="labeled-input">
                    <label class="required">* WIDTH</label><br>
                    <input type="number" id="board-width" min="0" max="999" required>
                </div>
                <div class="labeled-input">
                    <label class="required">* HEIGHT</label><br>
                    <input type="number" id="board-height" min="0" max="999" required>
                </div>
            </div>
            <div class="labels">Choose Number of Players</div>
            <div class="player-selector">
                <div class="labeled-input">
                    <label class="required">* MIN PLAYERS</label><br>
                    <input type="number" id="min-players" min="1" max="999" required>
                </div>
                <div class="labeled-input">
                    <label class="required">* MAX PLAYERS</label><br>
                    <input type="number" id="max-players" min="1" max="999" required>
                </div>
            </div>
            <div class="done-selector">
                <button id="done-btn" disabled>Done</button>
            </div>
        </div>
    `;

    const main = document.getElementById('main-screen');
    main.innerHTML = '';
    main.appendChild(container);

    tileType = document.getElementById('tile-type');
    leftTile = document.getElementById('tile-left');
    centerTile = document.getElementById('tile-center');
    rightTile = document.getElementById('tile-right');
    tileType = document.getElementById('tile-type')

    widthInput = document.getElementById('board-width');
    heightInput = document.getElementById('board-height');
    minPlayersInput = document.getElementById('min-players');
    maxPlayersInput = document.getElementById('max-players');
    doneButton = document.getElementById('done-btn');


    widthInput.addEventListener('input', validateInputs);
    heightInput.addEventListener('input', validateInputs);
    minPlayersInput.addEventListener('input', validateInputs);
    maxPlayersInput.addEventListener('input', validateInputs);
    doneButton.addEventListener('click', submitBoard);

    boardType = 0;
    changeBoardType(0); // Reset to default
}





let game = null;

function loadGame() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                game = JSON.parse(e.target.result);
                console.log("Game loaded:", game);
                alert("Game file loaded successfully!");
                
                game.inventoryLayout.containerWidth
                playerInventories = {containerWidth: game.inventoryLayout.containerWidth, containerHeight: game.inventoryLayout.containerHeight, containerTop: game.inventoryLayout.containerTop, containerLeft:game.inventoryLayout.containerLeft, borderColor:game.inventoryLayout.borderColor, borderWidth:game.inventoryLayout.borderWidth, backgroundColor:game.inventoryLayout.backgroundColor}
                globals = {containerWidth: game.globalLayout.containerWidth, containerHeight:  game.globalLayout.containerHeight, containerTop:  game.globalLayout.containerTop, containerLeft: game.globalLayout.containerLeft, borderColor: game.globalLayout.borderColor, borderWidth: game.globalLayout.borderWidth, backgroundColor: game.globalLayout.backgroundColor, displayVariables: game.globalLayout.displayVariables}
                boardEditor = new UIBoard(Board.loadCode(game.board));
                nextObjectID = game.board.width * game.board.height;
                pieceEditor = new UIPieceEditor();
                game.pieces.forEach( p => {
                    let newPiece = Piece.loadCode(p);
                    pieceEditor.addPiece(newPiece)
                    if(newPiece.objectID >= nextObjectID)
                        nextObjectID = newPiece.objectID+1
                } );
                minPlayers = game.minPlayers;
                maxPlayers = game.maxPlayers;    
                typeEditor = new UITypeEditor();
                game.tileTypes.forEach(t => {
                    let newType = TileType.loadCode(t);
                    typeEditor.addType(newType)
                    if(newType.typeID >= nextTypeID)
                        nextTypeID = newType.typeID+1
                    newType.scripts.forEach(s => {
                        if(s.ruleID >= nextRuleID)
                            nextRuleID = s.ruleID+1

                    });
                }) ;
                game.pieceTypes.forEach(t => {
                    let newType = PieceType.loadCode(t)
                    typeEditor.addType(newType)
                    if(newType.typeID >= nextTypeID)
                        nextTypeID = newType.typeID+1
                    newType.scripts.forEach(s => {
                        if(s.ruleID >= nextRuleID)
                            nextRuleID = s.ruleID+1;
                    });
                }) ;
                
                

                buttonEditor = new UIButtonEditor();
                game.buttons.forEach(b =>{
                    let newButton  = Button.loadCode(b)
                    buttonEditor.addButton(newButton)
                    newButton.clickScripts.forEach(s=>{
                        if(s.ruleID >=nextRuleID)
                            nextRuleID = s.ruleID+1;
                    })
                    newButton.visibleRules.forEach(s=>{
                        if(s.ruleID >=nextRuleID)
                            nextRuleID = s.ruleID+1;
                    })
                });

                globalScripts = game.globalScripts.map(script => ScriptingRule.loadCode(script))
                globalEditor = new UIGlobalEditor(game.globalVariables,globalScripts);


                globalScripts.forEach(s =>{
                    if(s.ruleID >=nextRuleID)
                        nextRuleID = s.ruleID+1;
                })

                setUpButtons()
                typeEditor.window.close();
                buttonEditor.window.close();
                document.getElementById("main-screen").innerHTML = ''; 

                
            } catch (err) {
                alert("Error parsing JSON: " + err.message);
                console.error(err); // ← logs full stack trace
            }
        };
        reader.readAsText(file);
    });
    input.click();
}





window.addEventListener('DOMContentLoaded', () => {
    showStartMenu();
});

function showStartMenu() {
    const main = document.getElementById('main-screen');
    main.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.justifyContent = 'center';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '30px';
    wrapper.style.height = '100vh';

    const newGameBtn = document.createElement('button');
    newGameBtn.textContent = 'New Game';
    newGameBtn.style.padding = '16px 32px';
    newGameBtn.style.fontSize = '18px';
    newGameBtn.style.border = 'none';
    newGameBtn.style.borderRadius = '8px';
    newGameBtn.style.cursor = 'pointer';
    newGameBtn.style.backgroundColor = '#dcdcdc';
    newGameBtn.addEventListener('click', () => newGame());

    const loadGameBtn = document.createElement('button');
    loadGameBtn.textContent = 'Load Game';
    loadGameBtn.style.padding = '16px 32px';
    loadGameBtn.style.fontSize = '18px';
    loadGameBtn.style.border = 'none';
    loadGameBtn.style.borderRadius = '8px';
    loadGameBtn.style.cursor = 'pointer';
    loadGameBtn.style.backgroundColor = '#dcdcdc';
    loadGameBtn.addEventListener('click', () => loadGame());

    wrapper.appendChild(newGameBtn);
    wrapper.appendChild(loadGameBtn);
    main.appendChild(wrapper);
}
