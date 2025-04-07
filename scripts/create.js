
const boardCreator = document.getElementById("board-creator") 
const centerTile = document.getElementById("tile-center") 
const leftTile = document.getElementById("tile-left")
const rightTile = document.getElementById("tile-right")
const widthInput = document.getElementById('board-width');
const heightInput = document.getElementById('board-height');
const doneButton = document.getElementById('done-btn');
const tileType = document.getElementById('tile-type');
const boardTypeText = ["Square", "Hex", "Triangle"]
const boardTypeSources = ["images/square.png","images/hexagon.png","images/triangle.png"];
const TILE_TYPES = ['Grass', 'Water', 'Mountain', 'Road'];
var boardEditor;
var pieceEditor;
var typeEditor;
var buttonEditor;


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
    
    setUpButtons()
    boardCreator.remove();
    



}


function validateInputs() { //THIS DETERMINES WHETHER THE DONE BUTTON IS ABAILABLE 
    const widthValid = widthInput.checkValidity() && parseInt(widthInput.value) > 0 && parseInt(widthInput.value) < 999;
    const heightValid = heightInput.checkValidity() && parseInt(heightInput.value) > 0 && parseInt(heightInput.value) < 999;

    doneButton.disabled = !(widthValid && heightValid && boardType==0); // FOR NOW WE ONLY ALLOW BOARD TYPE SQUARE.
    console.log(doneButton.disabled)
}

//Check everytime the input is changed.
widthInput.addEventListener('input', validateInputs);
heightInput.addEventListener('input', validateInputs);







function saveFile(){
    return //dummy function to buff out later.
}


function setUpButtons(){
    const controls = document.createElement('div');
    controls.id = 'control-buttons';
   
    // --- Preview Toggle ---
    let previewEnabled = true;
    const previewBtn = document.createElement('div');
    previewBtn.classList.add('control-btn');
    previewBtn.style.backgroundImage = `url(images/preview_on.png)`;
    previewBtn.title = 'Toggle Preview';
    previewBtn.onclick = () => {
        previewEnabled = !previewEnabled;
        previewBtn.style.backgroundImage = `url(images/${previewEnabled ? 'preview_on' : 'preview_off'}.png)`;
    };
  
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
    editBtn.title = 'Open Editors';
    editBtn.onclick = () => {
        if (!window._editorLauncherWindow || !document.body.contains(window._editorLauncherWindow.container)) {
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
            window._editorLauncherWindow = win;
        } else {
            window._editorLauncherWindow.container.style.zIndex = ++__windowZIndex;
        }
    };
  
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
                boardEditor.window.container.style.zIndex = ++__windowZIndex;
            break;
        case 'pieces':
            if(!pieceEditor.window)
                pieceEditor.createWindow();
            else 
                pieceEditor.window.container.style.zIndex = ++__windowZIndex;
            break;
        case 'buttons':
            if(!buttonEditor.window)
                buttonEditor.createWindow();
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
            break;
        // Add stubs for other editors
    }
    if (window._typeEditor && window._typeEditor.window) {
        window._typeEditor.window.container.style.zIndex = ++__windowZIndex;
    }
}