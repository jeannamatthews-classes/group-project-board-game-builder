activeGameState = new GameState(new Board("Square", 8, 8), []);
let newPiece = new Piece([], 3, 4, 1, new Sprite("#000000", "#ffff99", "P1"));
newPiece.sprite.text = newPiece.objectID;
activeGameState.pieceArray.push(newPiece);
let orthogonalOnly = new PieceType("Orthogonal Only", [
    new ScriptingRule("Piece Moves", "if-then-else",
        new ScriptingRule("None", "||",
            new ScriptingRule("None", "==",
                new ScriptingRule("None", "Argument", 0),
                new ScriptingRule("None", "Value", 0)
            ),
            new ScriptingRule("None", "==",
                new ScriptingRule("None", "Argument", 1),
                new ScriptingRule("None", "Value", 0)
            )
        ),
        new ScriptingRule("None", "Value", true),
        new ScriptingRule("None", "Value", false)
    )
], undefined);
newPiece.types.push(orthogonalOnly);
gameStateValid();
generateTestingGrid(); displayTestingGrid();


// The code below was copied from previous projects of mine

function output(output) { //Outputs whatever text is given as a new paragraph on the document
    let literal = false;
    if (arguments.length > 1) literal = arguments[1];
    let testP = document.createElement("p");
    if (literal) {
        let textT = document.createTextNode(boxArrayString(output));
        testP.appendChild(textT);
    }
    else testP.innerHTML = boxArrayString(output);
    testP.classList.add("output");
    document.body.appendChild(testP);
}

function boxArrayString(arr) { // Turns an array into a string, but with brackets aroung it
    let narr = structuredClone(arr);
    if (Array.isArray(narr)) {
        for (let e = 0; e < narr.length; e++) narr[e] = boxArrayString(narr[e]);
        return "[" + narr + "]"; 
    }
    else return String(arr);
}

function generateTestingGrid() {
    document.getElementById("testingGrid").style.setProperty("--width", currentGameState.board.width);
    document.getElementById("testingGrid").style.setProperty("--height", currentGameState.board.height);
    while (document.getElementById("testingGrid").lastElementChild) document.getElementById("grid").removeChild(document.getElementById("grid").lastElementChild);
    for (let y = 0; y < currentGameState.board.height; y++) {
        for (let x = 0; x < currentGameState.board.width; x++) {
            let newTile = document.getElementById("tileTemplate").cloneNode(true);
            newTile.id = "tile_" + x + "_" + y;
            newTile.addEventListener("click", function(){console.log(x, y)});
            document.getElementById("testingGrid").appendChild(newTile);
        }
    }
}

function displayTestingGrid() {
    document.getElementById("testingGrid").style.setProperty("display", "grid");
    for (let y = 0; y < currentGameState.board.height; y++) {
        for (let x = 0; x < currentGameState.board.width; x++) {
            let exGrid = currentGameState.board.tileArray;
            if (exGrid[y][x].getPieces(false).length > 0) {
                let firstPieceSprite = exGrid[y][x].getPieces(false)[0].sprite;
                document.getElementById("tile_" + x + "_" + y).style.setProperty("background-color", firstPieceSprite.color);
                document.getElementById("tile_" + x + "_" + y).style.setProperty("color", firstPieceSprite.textColor);
                document.getElementById("tile_" + x + "_" + y).firstElementChild.innerHTML = firstPieceSprite.text;
            }
            else {
                document.getElementById("tile_" + x + "_" + y).style.setProperty("background-color", "white")
                document.getElementById("tile_" + x + "_" + y).firstElementChild.innerHTML = "";
            }
        }
    }
}