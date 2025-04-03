
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
var gameBoard
var editor


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
    gameBoard = new UIBoard(new Board(boardTypeText[boardType], parseInt(widthInput.value), parseInt(heightInput.value)))
    boardCreator.remove();
    editor = new UIPieceEditor();
    const dummySprite = { shape: "square", fillColor: "#ccc", strokeColor: "#000", text: "", textColor: "#000" };
    const piece = new Piece([], 0, 0, 0, dummySprite);
    const piece2 = new Piece([], 0, 0, 0, dummySprite);
    editor.addPiece(piece);
    editor.addPiece(piece2);


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