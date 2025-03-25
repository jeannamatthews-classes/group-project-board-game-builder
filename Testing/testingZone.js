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
let typeWhitePawn = new PieceType("White Pawn", [
    new ScriptingRule("Piece Moves", "if-then-else", // Checks that either the move is straight down one space and not a capture, or diagonal-down one space and a capture. Does not include moving two spaces on its first move.
        new ScriptingRule("None", "||",
            new ScriptingRule("None", "&&",
                new ScriptingRule("None", "&&", 
                    new ScriptingRule("None", "==",
                        new ScriptingRule("None", "Argument", 0),
                        new ScriptingRule("None", "Value", 0)
                    ),
                    new ScriptingRule("None", "==",
                        new ScriptingRule("None", "Argument", 1),
                        new ScriptingRule("None", "Value", 1)
                    )
                ),
                new ScriptingRule("None", "==",
                    new ScriptingRule("None", "Array Length",
                        new ScriptingRule("None", "Pieces on Tile",
                            new ScriptingRule("None", "Tile Here")
                        )
                    ),
                    new ScriptingRule("None", "Value", 1)
                )
            ),
            new ScriptingRule("None", "&&",
                new ScriptingRule("None", "&&", 
                    new ScriptingRule("None", "==",
                        new ScriptingRule("None", "abs", new ScriptingRule("None", "Argument", 0)),
                        new ScriptingRule("None", "Value", 1)
                    ),
                    new ScriptingRule("None", "==",
                        new ScriptingRule("None", "Argument", 1),
                        new ScriptingRule("None", "Value", 1)
                    )
                ),
                new ScriptingRule("None", "==",
                    new ScriptingRule("None", "Array Length",
                        new ScriptingRule("None", "Pieces on Tile",
                            new ScriptingRule("None", "Tile Here")
                        )
                    ),
                    new ScriptingRule("None", "Value", 2)
                )
            )
        ),
        new ScriptingRule("None", "Value", true),
        new ScriptingRule("None", "Value", false)
    ),
    new ScriptingRule("Piece Lands on Tile", "if-then-else", // Promotes to queen if it reaches the other end of the board
        new ScriptingRule("None", "==",
            new ScriptingRule("None", "Y Coordinate"),
            new ScriptingRule("None", "Value", 7)
        ),
        new ScriptingRule("None", "Return at End",
            new ScriptingRule("None", "Remove Type",
                new ScriptingRule("None", "Array Element at Index",
                    new ScriptingRule("None", "Object Types"),
                    new ScriptingRule("None", "Value", 1)
                )
            ),
            new ScriptingRule("None", "Add Type", typeQueen, 1),
            new ScriptingRule("None", "Change Sprite", new Sprite("#ddd", "#222", "Queen")),
            new ScriptingRule("None", "Value", true)
        ),
        new ScriptingRule("None", "Value", true)
    ),
], undefined)
let typeBlackPawn = new PieceType("Black Pawn", [
    new ScriptingRule("Piece Moves", "if-then-else", // Checks that either the move is straight up and not a capture, or diagonal-up and a capture. Does not include moving two spaces on its first move.
        new ScriptingRule("None", "||",
            new ScriptingRule("None", "&&",
                new ScriptingRule("None", "&&", 
                    new ScriptingRule("None", "==",
                        new ScriptingRule("None", "Argument", 0),
                        new ScriptingRule("None", "Value", 0)
                    ),
                    new ScriptingRule("None", "==",
                        new ScriptingRule("None", "Argument", 1),
                        new ScriptingRule("None", "Value", -1)
                    )
                ),
                new ScriptingRule("None", "==",
                    new ScriptingRule("None", "Array Length",
                        new ScriptingRule("None", "Pieces on Tile",
                            new ScriptingRule("None", "Tile Here")
                        )
                    ),
                    new ScriptingRule("None", "Value", 1)
                )
            ),
            new ScriptingRule("None", "&&",
                new ScriptingRule("None", "&&", 
                    new ScriptingRule("None", "==",
                        new ScriptingRule("None", "abs", new ScriptingRule("None", "Argument", 0)),
                        new ScriptingRule("None", "Value", 1)
                    ),
                    new ScriptingRule("None", "==",
                        new ScriptingRule("None", "Argument", 1),
                        new ScriptingRule("None", "Value", -1)
                    )
                ),
                new ScriptingRule("None", "==",
                    new ScriptingRule("None", "Array Length",
                        new ScriptingRule("None", "Pieces on Tile",
                            new ScriptingRule("None", "Tile Here")
                        )
                    ),
                    new ScriptingRule("None", "Value", 2)
                )
            )
        ),
        new ScriptingRule("None", "Value", true),
        new ScriptingRule("None", "Value", false)
    ),
    new ScriptingRule("Piece Lands on Tile", "if-then-else", // Promotes to queen if it reaches the other end of the board
        new ScriptingRule("None", "==",
            new ScriptingRule("None", "Y Coordinate"),
            new ScriptingRule("None", "Value", 0)
        ),
        new ScriptingRule("None", "Return at End",
            new ScriptingRule("None", "Remove Type",
                new ScriptingRule("None", "Array Element at Index",
                    new ScriptingRule("None", "Object Types"),
                    new ScriptingRule("None", "Value", 1)
                )
            ),
            new ScriptingRule("None", "Add Type", typeQueen, 1),
            new ScriptingRule("None", "Change Sprite", new Sprite("#222", "#ddd", "Queen")),
            new ScriptingRule("None", "Value", true)
        ),
        new ScriptingRule("None", "Value", true)
    ),
], undefined)
let typeWhite = new PieceType("White", [
    new ScriptingRule("Piece Moves", "==",
        new ScriptingRule("None", "Player Turn"),
        new ScriptingRule("None", "Value", 1)
    )
], undefined);
let typeBlack = new PieceType("Black", [
    new ScriptingRule("Piece Moves", "==",
        new ScriptingRule("None", "Player Turn"),
        new ScriptingRule("None", "Value", 2)
    )
], undefined);
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
        new ScriptingRule("None", "Return at End",
            new ScriptingRule("None", "Change Turn Phase", Infinity),
            new ScriptingRule("None", "Value", true)
        ),
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
                new ScriptingRule("None", "Other Caller", new ScriptingRule("None", "Return Variable of Rule", "Other Piece"),
                    new ScriptingRule("None", "Remove Piece")
                ),
                new ScriptingRule("None", "if-then-else",
                    new ScriptingRule("None", "==",
                        new ScriptingRule("None", "Array Element at Index",
                            new ScriptingRule("None", "Object Types",
                                new ScriptingRule("None", "Return Variable of Rule", "Other Piece")
                            ),
                            new ScriptingRule("None", "Value", 1)
                        ),
                        typeKing
                    ),
                    new ScriptingRule("None", "End Game", new ScriptingRule("None", "Player Turn")),
                    new ScriptingRule("None", "Value", true)
                ),
                new ScriptingRule("None", "Change Turn Phase", Infinity),
                new ScriptingRule("None", "Value", true)
            ),
            new ScriptingRule("None", "Value", false)
        )
    )
], undefined)
let typeNoJumps = new PieceType("No Jumps", [ // This script prevents rooks, bishops, and queens from jumping over other pieces. Since knights ARE allowed to jump, only straight-line moves need be considered here.
    new ScriptingRule("Piece Moves", "Return at End",
        new ScriptingRule("None", "Edit Variable of Rule", "X Remaining",
            new ScriptingRule("None", "*",
                new ScriptingRule("None", "Argument", 0),
                new ScriptingRule("None", "Value", -1)
            )
        ),
        new ScriptingRule("None", "Edit Variable of Rule", "Y Remaining",
            new ScriptingRule("None", "*",
                new ScriptingRule("None", "Argument", 1),
                new ScriptingRule("None", "Value", -1)
            )
        ),
        new ScriptingRule("None", "Edit Variable of Rule", "X Coordinate",
            new ScriptingRule("None", "X Coordinate")
        ),
        new ScriptingRule("None", "Edit Variable of Rule", "Y Coordinate",
            new ScriptingRule("None", "Y Coordinate")
        ),
        new ScriptingRule("None", "Edit Variable of Rule", "Return Value",
            new ScriptingRule("None", "Value", true)
        ),
        new ScriptingRule("None", "Repeat While",
            new ScriptingRule("None", "&&",
                new ScriptingRule("None", "||",
                    new ScriptingRule("None", "!=",
                        new ScriptingRule("None", "Return Variable of Rule", "X Remaining"),
                        new ScriptingRule("None", "Value", 0)
                    ),
                    new ScriptingRule("None", "!=",
                        new ScriptingRule("None", "Return Variable of Rule", "Y Remaining"),
                        new ScriptingRule("None", "Value", 0)
                    )
                ),
                new ScriptingRule("None", "==",
                    new ScriptingRule("None", "Return Variable of Rule", "Return Value"),
                    new ScriptingRule("None", "Value", true)
                )
            ),
            new ScriptingRule("None", "Return at End",
                new ScriptingRule("None", "Edit Variable of Rule", "X Coordinate",
                    new ScriptingRule("None", "+",
                        new ScriptingRule("None", "Return Variable of Rule", "X Coordinate"),
                        new ScriptingRule("None", "sign", new ScriptingRule("None", "Return Variable of Rule", "X Remaining"))
                    )
                ),
                new ScriptingRule("None", "Edit Variable of Rule", "X Remaining",
                    new ScriptingRule("None", "-",
                        new ScriptingRule("None", "Return Variable of Rule", "X Remaining"),
                        new ScriptingRule("None", "sign", new ScriptingRule("None", "Return Variable of Rule", "X Remaining"))
                    )
                ),
                new ScriptingRule("None", "Edit Variable of Rule", "Y Coordinate",
                    new ScriptingRule("None", "+",
                        new ScriptingRule("None", "Return Variable of Rule", "Y Coordinate"),
                        new ScriptingRule("None", "sign", new ScriptingRule("None", "Return Variable of Rule", "Y Remaining"))
                    )
                ),
                new ScriptingRule("None", "Edit Variable of Rule", "Y Remaining",
                    new ScriptingRule("None", "-",
                        new ScriptingRule("None", "Return Variable of Rule", "Y Remaining"),
                        new ScriptingRule("None", "sign", new ScriptingRule("None", "Return Variable of Rule", "Y Remaining"))
                    )
                ),
                new ScriptingRule("None", "Edit Variable of Rule", "Return Value",
                    new ScriptingRule("None", "==",
                        new ScriptingRule("None", "Array Length",
                            new ScriptingRule("None", "Pieces on Tile",
                                new ScriptingRule("None", "Tile at Coordinates",
                                    new ScriptingRule("None", "Return Variable of Rule", "X Coordinate"),
                                    new ScriptingRule("None", "Return Variable of Rule", "Y Coordinate")
                                )
                            )
                        ),
                        new ScriptingRule("None", "Value", 0)
                    )
                )
            )
        ),
        new ScriptingRule("None", "Return Variable of Rule", "Return Value")
    )
], undefined)

activeGameState = new GameState(new Board("Square", 8, 8), [], 2);
activeGameState.pieceArray.push(new Piece([typeWhite, typeRook, typeChessCaptures, typeNoJumps], 0, 0, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeKnight, typeChessCaptures], 1, 0, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeBishop, typeChessCaptures, typeNoJumps], 2, 0, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeQueen, typeChessCaptures, typeNoJumps], 3, 0, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeKing, typeChessCaptures], 4, 0, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeBishop, typeChessCaptures, typeNoJumps], 5, 0, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeKnight, typeChessCaptures], 6, 0, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeRook, typeChessCaptures, typeNoJumps], 7, 0, 1));
activeGameState.pieceArray.push(new Piece([typeBlack, typeRook, typeChessCaptures, typeNoJumps], 0, 7, 2));
activeGameState.pieceArray.push(new Piece([typeBlack, typeKnight, typeChessCaptures], 1, 7, 2));
activeGameState.pieceArray.push(new Piece([typeBlack, typeBishop, typeChessCaptures, typeNoJumps], 2, 7, 2));
activeGameState.pieceArray.push(new Piece([typeBlack, typeQueen, typeChessCaptures, typeNoJumps], 3, 7, 2));
activeGameState.pieceArray.push(new Piece([typeBlack, typeKing, typeChessCaptures], 4, 7, 2));
activeGameState.pieceArray.push(new Piece([typeBlack, typeBishop, typeChessCaptures, typeNoJumps], 5, 7, 2));
activeGameState.pieceArray.push(new Piece([typeBlack, typeKnight, typeChessCaptures], 6, 7, 2));
activeGameState.pieceArray.push(new Piece([typeBlack, typeRook, typeChessCaptures, typeNoJumps], 7, 7, 2));
activeGameState.pieceArray.push(new Piece([typeWhite, typeWhitePawn, typeChessCaptures], 0, 1, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeWhitePawn, typeChessCaptures], 1, 1, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeWhitePawn, typeChessCaptures], 2, 1, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeWhitePawn, typeChessCaptures], 3, 1, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeWhitePawn, typeChessCaptures], 4, 1, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeWhitePawn, typeChessCaptures], 5, 1, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeWhitePawn, typeChessCaptures], 6, 1, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeWhitePawn, typeChessCaptures], 7, 1, 1));
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackPawn, typeChessCaptures], 0, 6, 1));
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackPawn, typeChessCaptures], 1, 6, 1));
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackPawn, typeChessCaptures], 2, 6, 1));
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackPawn, typeChessCaptures], 3, 6, 1));
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackPawn, typeChessCaptures], 4, 6, 1));
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackPawn, typeChessCaptures], 5, 6, 1));
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackPawn, typeChessCaptures], 6, 6, 1));
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackPawn, typeChessCaptures], 7, 6, 1));
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
    if (Number.isFinite(activeGameState.turnNumber)) document.getElementById("turnText").innerHTML = "Turn #" + activeGameState.turnNumber + "<br>Player #" + activeGameState.playerTurn + "<br>Phase " + activeGameState.turnPhase;
    else document.getElementById("turnText").innerHTML = "Player " + activeGameState.playerTurn + " wins!";
}