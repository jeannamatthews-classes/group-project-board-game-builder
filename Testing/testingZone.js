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
]);
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
]);
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
]);
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
]);
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
]);
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
            new ScriptingRule("None", "Console Log", "White pawn promotion"),
            new ScriptingRule("None", "Remove Type",
                new ScriptingRule("None", "Array Element at Index",
                    new ScriptingRule("None", "Object Types"),
                    new ScriptingRule("None", "Value", 1)
                )
            ),
            new ScriptingRule("None", "Add Type", new ScriptingRule("None", "Choose Piece Type", 7), 1),
            new ScriptingRule("None", "Change Piece Sprite", new ScriptingRule("None", "Create Piece Sprite", "square", "#ddd", "#222", "Queen", "#222")),
            new ScriptingRule("None", "Value", true)
        ),
        new ScriptingRule("None", "Value", true)
    ),
])
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
            new ScriptingRule("None", "Console Log", "Black pawn promotion"),
            new ScriptingRule("None", "Remove Type",
                new ScriptingRule("None", "Array Element at Index",
                    new ScriptingRule("None", "Object Types"),
                    new ScriptingRule("None", "Value", 1)
                )
            ),
            new ScriptingRule("None", "Add Type", new ScriptingRule("None", "Choose Piece Type", 7), 1),
            new ScriptingRule("None", "Change Piece Sprite", new ScriptingRule("None", "Create Piece Sprite", "square", "#222", "#ddd", "Queen", "#ddd")),
            new ScriptingRule("None", "Value", true)
        ),
        new ScriptingRule("None", "Value", true)
    ),
])
let typeWhite = new PieceType("White", [
    new ScriptingRule("Object Clicked", "==",
        new ScriptingRule("None", "Player Turn"),
        new ScriptingRule("None", "Value", 1)
    )
]);
let typeBlack = new PieceType("Black", [
    new ScriptingRule("Object Clicked", "==",
        new ScriptingRule("None", "Player Turn"),
        new ScriptingRule("None", "Value", 2)
    )
]);
let pieceClick = new PieceType("Clickable Piece", [
    new ScriptingRule("Object Clicked", "Return at End",
        new ScriptingRule("None", "Clear Selected Objects"),
        new ScriptingRule("None", "Select Object", new ScriptingRule("None", "Caller")),
        new ScriptingRule("None", "Change Turn Phase", new ScriptingRule("None", "Value", 1)),
        new ScriptingRule("None", "Value", true)
    )
]);
let tileClick = new TileType("Clickable Tile", [
    new ScriptingRule("Object Clicked", "if-then-else",
        new ScriptingRule("None", "==",
            new ScriptingRule("None", "Array Length", new ScriptingRule("None", "Selected Objects")),
            new ScriptingRule("None", "Value", 1)
        ),
        new ScriptingRule("None", "Return at End",
            new ScriptingRule("None", "Edit Variable of Rule",
                "Tile", new ScriptingRule("None", "Caller")
            ),
            new ScriptingRule("None", "Other Caller",
                new ScriptingRule("None", "Array Element at Index",
                    new ScriptingRule("None", "Selected Objects"),
                    new ScriptingRule("None", "Value", 0)
                ),
                new ScriptingRule("None", "Move Piece to Coordinates",
                    new ScriptingRule("None", "X Coordinate", new ScriptingRule("None", "Return Variable of Rule", "Tile")),
                    new ScriptingRule("None", "Y Coordinate", new ScriptingRule("None", "Return Variable of Rule", "Tile"))
                )
            )
        ),
        new ScriptingRule("None", "Value", false)
    )
]);
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
                        new ScriptingRule("None", "Choose Piece Type", 8)
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
])

pieceTypesList.push(typeWhite, typeBlack, typeWhitePawn, typeBlackPawn, typeRook, typeKnight, typeBishop, typeQueen, typeKing, typeChessCaptures, typeNoJumps);
tileTypesList.push(tileClick);

activeGameState = new GameState(new Board("Square", 8, 8), [], 2);
activeGameState.pieceArray.push(new Piece([typeWhite, typeRook, pieceClick, typeChessCaptures, typeNoJumps], 0, 0, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeKnight, pieceClick, typeChessCaptures], 1, 0, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeBishop, pieceClick, typeChessCaptures, typeNoJumps], 2, 0, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeQueen, pieceClick, typeChessCaptures, typeNoJumps], 3, 0, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeKing, pieceClick, typeChessCaptures], 4, 0, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeBishop, pieceClick, typeChessCaptures, typeNoJumps], 5, 0, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeKnight, pieceClick, typeChessCaptures], 6, 0, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeRook, pieceClick, typeChessCaptures, typeNoJumps], 7, 0, 1));
activeGameState.pieceArray.push(new Piece([typeBlack, typeRook, pieceClick, typeChessCaptures, typeNoJumps], 0, 7, 2));
activeGameState.pieceArray.push(new Piece([typeBlack, typeKnight, pieceClick, typeChessCaptures], 1, 7, 2));
activeGameState.pieceArray.push(new Piece([typeBlack, typeBishop, pieceClick, typeChessCaptures, typeNoJumps], 2, 7, 2));
activeGameState.pieceArray.push(new Piece([typeBlack, typeQueen, pieceClick, typeChessCaptures, typeNoJumps], 3, 7, 2));
activeGameState.pieceArray.push(new Piece([typeBlack, typeKing, pieceClick, typeChessCaptures], 4, 7, 2));
activeGameState.pieceArray.push(new Piece([typeBlack, typeBishop, pieceClick, typeChessCaptures, typeNoJumps], 5, 7, 2));
activeGameState.pieceArray.push(new Piece([typeBlack, typeKnight, pieceClick, typeChessCaptures], 6, 7, 2));
activeGameState.pieceArray.push(new Piece([typeBlack, typeRook, pieceClick, typeChessCaptures, typeNoJumps], 7, 7, 2));
activeGameState.pieceArray.push(new Piece([typeWhite, typeWhitePawn, pieceClick, typeChessCaptures], 0, 1, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeWhitePawn, pieceClick, typeChessCaptures], 1, 1, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeWhitePawn, pieceClick, typeChessCaptures], 2, 1, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeWhitePawn, pieceClick, typeChessCaptures], 3, 1, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeWhitePawn, pieceClick, typeChessCaptures], 4, 1, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeWhitePawn, pieceClick, typeChessCaptures], 5, 1, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeWhitePawn, pieceClick, typeChessCaptures], 6, 1, 1));
activeGameState.pieceArray.push(new Piece([typeWhite, typeWhitePawn, pieceClick, typeChessCaptures], 7, 1, 1));
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackPawn, pieceClick, typeChessCaptures], 0, 6, 1));
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackPawn, pieceClick, typeChessCaptures], 1, 6, 1));
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackPawn, pieceClick, typeChessCaptures], 2, 6, 1));
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackPawn, pieceClick, typeChessCaptures], 3, 6, 1));
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackPawn, pieceClick, typeChessCaptures], 4, 6, 1));
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackPawn, pieceClick, typeChessCaptures], 5, 6, 1));
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackPawn, pieceClick, typeChessCaptures], 6, 6, 1));
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackPawn, pieceClick, typeChessCaptures], 7, 6, 1));
for (let p of activeGameState.pieceArray) {
    if (p.types[0].typeName === "White") {
        p.sprite = new ScriptingRule("None", "Create Piece Sprite", "square", "#ddd", "#222", p.types[1].typeName, "#222").run()
    }
    else {
        p.sprite = new ScriptingRule("None", "Create Piece Sprite", "square", "#222", "#ddd", p.types[1].typeName, "#ddd").run()
    }
}
for (let y = 0; y < activeGameState.board.tileArray.length; y++) {
    for (let x = 0; x < activeGameState.board.tileArray[y].length; x++) {
        activeGameState.board.tileArray[y][x].types.push(tileClick);
    }
}

gameStateValid();
let clickingPieces = true;
generateTestingGrid(); displayTestingGrid();


// The code below was copied from previous projects of mine and edited

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
            let exGrid = activeGameState.board.tileArray;
            let newTile = document.getElementById("tileTemplate").cloneNode(true);
            newTile.id = "tile_" + x + "_" + y;
            newTile.addEventListener("click", function(){
                if (!clickingPieces || exGrid[y][x].getPieces().length == 0) {
                    exGrid[y][x].clickObject();
                    displayTestingGrid();
                }
                else {
                    exGrid[y][x].getPieces()[0].clickObject();
                    displayTestingGrid();
                }
            });
            document.getElementById("testingGrid").appendChild(newTile);
        }
    }
    document.getElementById("clickChange").addEventListener("click", function(){
        clickingPieces = !clickingPieces;
        displayTestingGrid();
    });
}

function displayTestingGrid() {
    document.getElementById("testingGrid").style.setProperty("display", "grid");
    for (let y = 0; y < currentGameState.board.height; y++) {
        for (let x = 0; x < currentGameState.board.width; x++) {
            let exGrid = currentGameState.board.tileArray;
            if (exGrid[y][x].getPieces(false).length > 0) {
                let firstPieceSprite = exGrid[y][x].getPieces(false)[0].sprite;
                document.getElementById("tile_" + x + "_" + y).style.setProperty("background-color", firstPieceSprite.fillColor);
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
    if (clickingPieces) document.getElementById("clickChange").innerHTML = "Clicking pieces";
    else document.getElementById("clickChange").innerHTML = "Clicking tiles";
}