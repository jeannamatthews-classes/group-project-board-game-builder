let typeRed = new PieceType("Red", [
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

let typeRedRegular = new PieceType("Regular Red", [
    new ScriptingRule("Piece Moves", "&&",
        new ScriptingRule("None", "<",
            new ScriptingRule("None", "Argument", 1),
            new ScriptingRule("None", "Value", 0)
        )
    ),
    new ScriptingRule("Piece Lands on Tile", "if-then-else",
        new ScriptingRule("None", "==",
            new ScriptingRule("None", "Y Coordinate"),
            new ScriptingRule("None", "Value", 0)
        ),
        new ScriptingRule("None", "Return at End",
            new ScriptingRule("None", "Remove Type",
                new ScriptingRule("None", "Choose Piece Type", 2)
            ),
            new ScriptingRule("None", "Add Type",
                new ScriptingRule("None", "Choose Piece Type", 4),
                new ScriptingRule("None", "Value", 1),
            ),
            new ScriptingRule("None", "Change Piece Sprite", new ScriptingRule("None", "Create Piece Sprite", "square", "#ff0000", "#000000", "Red King", "#000000")),
            new ScriptingRule("None", "Value", true)
        ),
        new ScriptingRule("None", "Value", true)
    )
]);
let typeBlackRegular = new PieceType("Regular Black", [
    new ScriptingRule("Piece Moves", "&&",
        new ScriptingRule("None", ">",
            new ScriptingRule("None", "Argument", 1),
            new ScriptingRule("None", "Value", 0)
        )
    ),
    new ScriptingRule("Piece Lands on Tile", "if-then-else",
        new ScriptingRule("None", "==",
            new ScriptingRule("None", "Y Coordinate"),
            new ScriptingRule("None", "Value", 7)
        ),
        new ScriptingRule("None", "Return at End",
            new ScriptingRule("None", "Remove Type",
                new ScriptingRule("None", "Choose Piece Type", 3)
            ),
            new ScriptingRule("None", "Add Type",
                new ScriptingRule("None", "Choose Piece Type", 4),
                new ScriptingRule("None", "Value", 1),
                new ScriptingRule("None", "Change Piece Sprite", new ScriptingRule("None", "Create Piece Sprite", "square", "#000000", "#ffffff", "Black King", "#ffffff")),
                new ScriptingRule("None", "Value", true)
            ),
            new ScriptingRule("None", "Value", true)
        ),
        new ScriptingRule("None", "Value", true)
    )
]);
let typeKing = new PieceType("King", [
    // No inherent restrictions that other types don't already accomplish
]);

let typeCheckersMovement = new PieceType("Checkers Piece", [
    new ScriptingRule("Piece Moves", "if-then-else",
        new ScriptingRule("Piece Moves", "&&",
            new ScriptingRule("None", "==",
                new ScriptingRule("None", "abs", new ScriptingRule("None", "Argument", 0)),
                new ScriptingRule("None", "abs", new ScriptingRule("None", "Argument", 1))
            ),
            new ScriptingRule("None", "!=",
                new ScriptingRule("None", "abs", new ScriptingRule("None", "Argument", 0)),
                new ScriptingRule("None", "Value", 0)
            )
        ),
        new ScriptingRule("None", "if-then-else",
            new ScriptingRule("None", "&&",
                new ScriptingRule("None", "==",
                    new ScriptingRule("None", "abs", new ScriptingRule("None", "Argument", 0)),
                    new ScriptingRule("None", "Value", 1)
                ),
                new ScriptingRule("None", "==",
                    new ScriptingRule("None", "Turn Phase"),
                    new ScriptingRule("None", "Value", 0)
                )
            ),
            new ScriptingRule("None", "Change Turn Phase", Infinity),
            new ScriptingRule("None", "if-then-else",
                new ScriptingRule("None", "&&",
                    new ScriptingRule("None", "==",
                        new ScriptingRule("None", "abs", new ScriptingRule("None", "Argument", 0)),
                        new ScriptingRule("None", "Value", 2)
                    ),
                    new ScriptingRule("None", "==",
                        new ScriptingRule("None", "Array Length",
                            new ScriptingRule("None", "Pieces on Tile",
                                new ScriptingRule("None", "Tile at Coordinates",
                                    new ScriptingRule("None", "-",
                                        new ScriptingRule("None", "X Coordinate"),
                                        new ScriptingRule("None", "/",
                                            new ScriptingRule("None", "Argument", 0),
                                            new ScriptingRule("None", "Value", 2)
                                        )
                                    ),
                                    new ScriptingRule("None", "-",
                                        new ScriptingRule("None", "Y Coordinate"),
                                        new ScriptingRule("None", "/",
                                            new ScriptingRule("None", "Argument", 1),
                                            new ScriptingRule("None", "Value", 2)
                                        )
                                    )
                                )
                            )
                        ),
                        new ScriptingRule("None", "Value", 1)
                    )
                ),
                new ScriptingRule("None", "Return at End",
                    new ScriptingRule("None", "Edit Variable of Rule", "Jumped Piece",
                        new ScriptingRule("None", "Array Element at Index",
                            new ScriptingRule("None", "Pieces on Tile",
                                new ScriptingRule("None", "Tile at Coordinates",
                                    new ScriptingRule("None", "-",
                                        new ScriptingRule("None", "X Coordinate"),
                                        new ScriptingRule("None", "/",
                                            new ScriptingRule("None", "Argument", 0),
                                            new ScriptingRule("None", "Value", 2)
                                        )
                                    ),
                                    new ScriptingRule("None", "-",
                                        new ScriptingRule("None", "Y Coordinate"),
                                        new ScriptingRule("None", "/",
                                            new ScriptingRule("None", "Argument", 1),
                                            new ScriptingRule("None", "Value", 2)
                                        )
                                    )
                                )
                            ),
                            new ScriptingRule("None", "Value", 0)
                        )
                    ),
                    new ScriptingRule("None", "if-then-else",
                        new ScriptingRule("None", "!=",
                            new ScriptingRule("None", "Array Element at Index",
                                new ScriptingRule("None", "Object Types", new ScriptingRule("None", "Return Variable of Rule", "Jumped Piece")),
                                new ScriptingRule("None", "Value", 0)
                            ),
                            new ScriptingRule("None", "Array Element at Index",
                                new ScriptingRule("None", "Object Types", new ScriptingRule("None", "Caller")),
                                new ScriptingRule("None", "Value", 0)
                            )
                        ),
                        new ScriptingRule("None", "Return at End",
                            new ScriptingRule("None", "Other Caller",
                                new ScriptingRule("None", "Return Variable of Rule", "Jumped Piece"),
                                new ScriptingRule("None", "Remove Piece")
                            ),
                            new ScriptingRule("None", "Change Turn Phase", 1),
                            new ScriptingRule("None", "if-then-else",
                                new ScriptingRule("None", "==",
                                    new ScriptingRule("None", "Player Turn"),
                                    new ScriptingRule("None", "Value", 1)
                                ),
                                new ScriptingRule("None", "Return at End",
                                    new ScriptingRule("None", "Edit Global Variable", "Black Pieces Remaining",
                                        new ScriptingRule("None", "-",
                                            new ScriptingRule("None", "Return Global Variable", "Black Pieces Remaining"),
                                            new ScriptingRule("None", "Value", 1)
                                        )
                                    ),
                                    new ScriptingRule("None", "if-then-else",
                                        new ScriptingRule("None", "==",
                                            new ScriptingRule("None", "Return Global Variable", "Black Pieces Remaining"),
                                            new ScriptingRule("None", "Value", 0)
                                        ),
                                        new ScriptingRule("None", "End Game", new ScriptingRule("None", "Value", 1)),
                                        new ScriptingRule("None", "Value", true)
                                    )
                                ),
                                new ScriptingRule("None", "Return at End",
                                    new ScriptingRule("None", "Edit Global Variable", "Red Pieces Remaining",
                                        new ScriptingRule("None", "-",
                                            new ScriptingRule("None", "Return Global Variable", "Red Pieces Remaining"),
                                            new ScriptingRule("None", "Value", 1)
                                        )
                                    ),
                                    new ScriptingRule("None", "if-then-else",
                                        new ScriptingRule("None", "==",
                                            new ScriptingRule("None", "Return Global Variable", "Red Pieces Remaining"),
                                            new ScriptingRule("None", "Value", 0)
                                        ),
                                        new ScriptingRule("None", "End Game", new ScriptingRule("None", "Value", 2)),
                                        new ScriptingRule("None", "Value", true)
                                    )
                                )
                            )
                        ),
                        new ScriptingRule("None", "Value", false)
                    )
                ),
                new ScriptingRule("None", "Value", false)
            )
        ),
        new ScriptingRule("None", "Value", false)
    )
])

let pieceClick = new PieceType("Clickable Piece", [
    new ScriptingRule("Object Clicked", "Return at End",
        new ScriptingRule("None", "Clear Selected Objects"),
        new ScriptingRule("None", "Select Object", new ScriptingRule("None", "Caller")),
        new ScriptingRule("None", "Value", true)
    )
]);
let tileClick = new TileType("Clickable Tile", [
    new ScriptingRule("Object Clicked", "if-then-else",
        new ScriptingRule("None", "&&",
            new ScriptingRule("None", "==",
                new ScriptingRule("None", "Array Length", new ScriptingRule("None", "Selected Objects")),
                new ScriptingRule("None", "Value", 1)
            ),
            new ScriptingRule("None", "==",
                new ScriptingRule("None", "Array Length",
                    new ScriptingRule("None", "Pieces on Tile", new ScriptingRule("None", "Caller"))
                ),
                new ScriptingRule("None", "Value", 0)
            )
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

pieceTypesList.push(typeRed, typeBlack, typeRedRegular, typeBlackRegular, typeKing, typeCheckersMovement);
tileTypesList.push(tileClick);

activeGameState = new GameState(new Board("Square", 8, 8), [], 2);
activeGameState.pieceArray.push(new Piece([typeRed, typeRedRegular, typeCheckersMovement, pieceClick], 0, 7, 1))
activeGameState.pieceArray.push(new Piece([typeRed, typeRedRegular, typeCheckersMovement, pieceClick], 2, 7, 1))
activeGameState.pieceArray.push(new Piece([typeRed, typeRedRegular, typeCheckersMovement, pieceClick], 4, 7, 1))
activeGameState.pieceArray.push(new Piece([typeRed, typeRedRegular, typeCheckersMovement, pieceClick], 6, 7, 1))
activeGameState.pieceArray.push(new Piece([typeRed, typeRedRegular, typeCheckersMovement, pieceClick], 1, 6, 1))
activeGameState.pieceArray.push(new Piece([typeRed, typeRedRegular, typeCheckersMovement, pieceClick], 3, 6, 1))
activeGameState.pieceArray.push(new Piece([typeRed, typeRedRegular, typeCheckersMovement, pieceClick], 5, 6, 1))
activeGameState.pieceArray.push(new Piece([typeRed, typeRedRegular, typeCheckersMovement, pieceClick], 7, 6, 1))
activeGameState.pieceArray.push(new Piece([typeRed, typeRedRegular, typeCheckersMovement, pieceClick], 0, 5, 1))
activeGameState.pieceArray.push(new Piece([typeRed, typeRedRegular, typeCheckersMovement, pieceClick], 2, 5, 1))
activeGameState.pieceArray.push(new Piece([typeRed, typeRedRegular, typeCheckersMovement, pieceClick], 4, 5, 1))
activeGameState.pieceArray.push(new Piece([typeRed, typeRedRegular, typeCheckersMovement, pieceClick], 6, 5, 1))
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackRegular, typeCheckersMovement, pieceClick], 1, 0, 2))
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackRegular, typeCheckersMovement, pieceClick], 3, 0, 2))
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackRegular, typeCheckersMovement, pieceClick], 5, 0, 2))
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackRegular, typeCheckersMovement, pieceClick], 7, 0, 2))
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackRegular, typeCheckersMovement, pieceClick], 0, 1, 2))
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackRegular, typeCheckersMovement, pieceClick], 2, 1, 2))
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackRegular, typeCheckersMovement, pieceClick], 4, 1, 2))
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackRegular, typeCheckersMovement, pieceClick], 6, 1, 2))
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackRegular, typeCheckersMovement, pieceClick], 1, 2, 2))
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackRegular, typeCheckersMovement, pieceClick], 3, 2, 2))
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackRegular, typeCheckersMovement, pieceClick], 5, 2, 2))
activeGameState.pieceArray.push(new Piece([typeBlack, typeBlackRegular, typeCheckersMovement, pieceClick], 7, 2, 2))
for (let p of activeGameState.pieceArray) {
    if (p.types[0].typeName === "Red") {
        p.sprite = new ScriptingRule("None", "Create Piece Sprite", "square", "#ff0000", "#000", p.types[1].typeName, "#000").run()
    }
    else {
        p.sprite = new ScriptingRule("None", "Create Piece Sprite", "square", "#000000", "#fff", p.types[1].typeName, "#fff").run()
    }
}
for (let y = 0; y < activeGameState.board.tileArray.length; y++) {
    for (let x = 0; x < activeGameState.board.tileArray[y].length; x++) {
        activeGameState.board.tileArray[y][x].types.push(tileClick);
    }
}
otherGlobalVariables.push(["Red Pieces Remaining", 12], ["Black Pieces Remaining", 12])
let endTurnButton = new Button( // Shows up to let you end your turn if you've captured at least once
    [
        new ScriptingRule("None", "Change Turn Phase", Infinity)
    ],
    [
        new ScriptingRule("None", "==",
            new ScriptingRule("None", "Turn Phase"),
            new ScriptingRule("None", "Value", 1)
        )
    ]
);
endTurnButton.sprite = {
    fillColor:  "#880000",
    text: "End Turn",
    textColor: "#ff8844",
    borderColor: "#ff8844",
    borderRadius: "5px",
}
buttonsList.push(endTurnButton);