
const boardCreator = document.getElementById("board-creator") 
const centerTile = document.getElementById("tile-center") 
const leftTile = document.getElementById("tile-left")
const rightTile = document.getElementById("tile-right")
const widthInput = document.getElementById('board-width');
const heightInput = document.getElementById('board-height');
const doneButton = document.getElementById('done-btn');
const tileType = document.getElementById('tile-type');
const minPlayersInput = document.getElementById('min-players');
const maxPlayersInput = document.getElementById('max-players');

const boardTypeText = ["Square", "Hex", "Triangle"]
const boardTypeSources = ["images/square.png","images/hexagon.png","images/triangle.png"];
var boardEditor;
var pieceEditor;
var typeEditor;
var buttonEditor;
var globalEditor;
var minPlayers;
var maxPlayers;
var playerInventories = {containerWidth: -1, containerHeight: -1, containerTop: -1, containerLeft:-1, borderColor:'black', borderWidth:'2px', backgroundColor:'white' }
var globals = {containerWidth: -1, containerHeight: -1, containerTop: -1, containerLeft:-1, borderColor:'black', borderWidth:'2px', backgroundColor:'white', displayVariables:[]}
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
    boardCreator.remove();
    



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


//Check everytime the input is changed.
widthInput.addEventListener('input', validateInputs);
heightInput.addEventListener('input', validateInputs);
minPlayersInput.addEventListener('input', validateInputs);
maxPlayersInput.addEventListener('input', validateInputs);






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

function loadCode() {

}