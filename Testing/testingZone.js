// Define the chess piece types
let typeRook = new PieceType("Rook", [ // Checks that exactly one of the two coordinate changes is nonzero
    new ScriptingRule("Piece Moves", "if-then-else",
        new ScriptingRule("None", "!=",
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
let typeBishop = new PieceType("Bishop", [ // Checks that the two coordinate changes have the same absolute value and are nonzero
    new ScriptingRule("Piece Moves", "if-then-else",
        new ScriptingRule("None", "&&",
            new ScriptingRule("None", "==",
                new ScriptingRule("None", "abs", new ScriptingRule("None", "Argument", 0)),
                new ScriptingRule("None", "abs", new ScriptingRule("None", "Argument", 1))
            ),
            new ScriptingRule("None", "!=",
                new ScriptingRule("None", "Argument", 0),
                new ScriptingRule("None", "Value", 0)
            ),
        ),
        new ScriptingRule("None", "Value", true),
        new ScriptingRule("None", "Value", false)
    )
], undefined);
let typeQueen = new PieceType("Queen", [ // Checks that either the rook or bishop rule is true
    new ScriptingRule("Piece Moves", "if-then-else",
        new ScriptingRule("None", "||",
            new ScriptingRule("None", "!=",
                new ScriptingRule("None", "==",
                    new ScriptingRule("None", "Argument", 0),
                    new ScriptingRule("None", "Value", 0)
                ),
                new ScriptingRule("None", "==",
                    new ScriptingRule("None", "Argument", 1),
                    new ScriptingRule("None", "Value", 0)
                )
            ),
            new ScriptingRule("None", "&&",
                new ScriptingRule("None", "==",
                    new ScriptingRule("None", "abs", new ScriptingRule("None", "Argument", 0)),
                    new ScriptingRule("None", "abs", new ScriptingRule("None", "Argument", 1))
                ),
                new ScriptingRule("None", "!=",
                    new ScriptingRule("None", "Argument", 0),
                    new ScriptingRule("None", "Value", 0)
                ),
            ),
        ),
        new ScriptingRule("None", "Value", true),
        new ScriptingRule("None", "Value", false)
    )
], undefined);
let typeKing = new PieceType("King", [ // Checks that the absolute values of both direction changes are under 2, and are not both 0
    new ScriptingRule("Piece Moves", "if-then-else",
        new ScriptingRule("None", "&&",
            new ScriptingRule("None", "&&",
                new ScriptingRule("None", "<",
                    new ScriptingRule("None", "abs", new ScriptingRule("None", "Argument", 0)),
                    new ScriptingRule("None", "Value", 2)
                ),
                new ScriptingRule("None", "<",
                    new ScriptingRule("None", "abs", new ScriptingRule("None", "Argument", 1)),
                    new ScriptingRule("None", "Value", 2)
                ),
            ),
            new ScriptingRule("None", "||",
                new ScriptingRule("None", "!=",
                    new ScriptingRule("None", "Argument", 0),
                    new ScriptingRule("None", "Value", 0)
                ),
                new ScriptingRule("None", "!=",
                    new ScriptingRule("None", "Argument", 1),
                    new ScriptingRule("None", "Value", 0)
                ),
            ),
        ),
        new ScriptingRule("None", "Value", true),
        new ScriptingRule("None", "Value", false)
    )
], undefined);
let typeKnight = new PieceType("Knight", [ // Checks that the absolute values of two coordinate changes sum to 3 and they're both nonzero, meaning it has to be "two in one direction, one in the other"
    new ScriptingRule("Piece Moves", "if-then-else",
        new ScriptingRule("None", "&&",
            new ScriptingRule("None", "==",
                new ScriptingRule("None", "+",
                    new ScriptingRule("None", "abs", new ScriptingRule("None", "Argument", 0)),
                    new ScriptingRule("None", "abs", new ScriptingRule("None", "Argument", 1))
                ),
                new ScriptingRule("None", "Value", 3)
            ),
            new ScriptingRule("None", "&&",
                new ScriptingRule("None", "!=",
                    new ScriptingRule("None", "Argument", 0),
                    new ScriptingRule("None", "Value", 0)
                ),
                new ScriptingRule("None", "!=",
                    new ScriptingRule("None", "Argument", 1),
                    new ScriptingRule("None", "Value", 0)
                ),
            )
        ),
        new ScriptingRule("None", "Value", true),
        new ScriptingRule("None", "Value", false)
    )
], undefined);
let typeWhite = new PieceType("White", [], undefined);
let typeBlack = new PieceType("Black", [], undefined);
let typeChessCaptures = new PieceType("Capturing", [
    new ScriptingRule(
        "Piece Lands on Tile", "if-then-else", // If the piece is alone, lands safely
        new ScriptingRule("None", "==",
            new ScriptingRule("None", "Array Length",
                new ScriptingRule("None", "Pieces on Tile",
                    new ScriptingRule("None", "Argument", 0)
                )
            ),
            new ScriptingRule("None", "Value", 1)
        ),
        new ScriptingRule("None", "Value", true),
        new ScriptingRule("None", "if-then-else", // If there's another piece on that tile, ensure they're opposite colors
            new ScriptingRule("None", "&&",
                new ScriptingRule("None", "==",
                    new ScriptingRule("None", "Array Length",
                        new ScriptingRule("None", "Pieces on Tile",
                            new ScriptingRule("None", "Argument", 0)
                        )
                    ),
                    new ScriptingRule("None", "Value", 2)
                ),
                new ScriptingRule("None", "!=",
                    new ScriptingRule("None", "Array Element at Index",
                        new ScriptingRule("None", "Object Types",
                            new ScriptingRule("None", "Array Element at Index",
                                new ScriptingRule("None", "Pieces on Tile", 
                                    new ScriptingRule("None", "Argument", 0)
                                ),
                                new ScriptingRule("None", "Value", 1)
                            )
                        ),
                        new ScriptingRule("None", "Value", 0)
                    ),
                    new ScriptingRule("None", "Array Element at Index",
                        new ScriptingRule("None", "Object Types",
                            new ScriptingRule("None", "Caller")
                        ),
                        new ScriptingRule("None", "Value", 0)
                    )
                )
            ),
            new ScriptingRule("None", "Return at End", // Capturing
                new ScriptingRule("None", "Edit Variable of Rule",
                    "Other Piece",
                    new ScriptingRule("None", "Array Element at Index",
                        new ScriptingRule("None", "Pieces on Tile", 
                            new ScriptingRule("None", "Argument", 0)
                        ),
                        new ScriptingRule("None", "Value", 1)
                    )
                ),
                new ScriptingRule("None", "Remove Piece",
                    new ScriptingRule("None", "Return Variable of Rule", "Other Piece")
                ),
                new ScriptingRule("None", "Value", true)
            ),
            new ScriptingRule("None", "Value", false)
        )
    )
], undefined)

activeGameState = new GameState(new Board("Square", 8, 8), []);
activeGameState.pieceArray.push(new Piece([typeWhite, typeRook, typeChessCaptures], 0, 0, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeKnight, typeChessCaptures], 1, 0, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeBishop, typeChessCaptures], 2, 0, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeQueen, typeChessCaptures], 3, 0, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeKing, typeChessCaptures], 4, 0, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeBishop, typeChessCaptures], 5, 0, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeKnight, typeChessCaptures], 6, 0, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeRook, typeChessCaptures], 7, 0, 1));
activeGameState.pieceArray.push(new Piece([typeBlack, typeRook, typeChessCaptures], 0, 7, 2));
activeGameState.pieceArray.push(new Piece([typeBlack, typeKnight, typeChessCaptures], 1, 7, 2));
activeGameState.pieceArray.push(new Piece([typeBlack, typeBishop, typeChessCaptures], 2, 7, 2));
activeGameState.pieceArray.push(new Piece([typeBlack, typeQueen, typeChessCaptures], 3, 7, 2));
activeGameState.pieceArray.push(new Piece([typeBlack, typeKing, typeChessCaptures], 4, 7, 2));
activeGameState.pieceArray.push(new Piece([typeBlack, typeBishop, typeChessCaptures], 5, 7, 2));
activeGameState.pieceArray.push(new Piece([typeBlack, typeKnight, typeChessCaptures], 6, 7, 2));
activeGameState.pieceArray.push(new Piece([typeBlack, typeRook, typeChessCaptures], 7, 7, 2));
for (let p of activeGameState.pieceArray) {
    if (p.types[0].typeName === "White") {
        p.sprite = new Sprite("#ddd", "#222", p.types[1].typeName + "\n" + p.objectID);
    }
    else {
        p.sprite = new Sprite("#222", "#ddd", p.types[1].typeName + "\n" + p.objectID);
    }
}

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