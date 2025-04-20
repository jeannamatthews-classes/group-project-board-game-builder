activeGameState = new GameState(new Board("Square", 7, 6), [], 2);

let typeRed = new PieceType("Red", [
]);
let typeYellow = new PieceType("Yellow", [
]);

let typeTileClick = new TileType("Clickable Tile", [
    new ScriptingRule("Object Clicked", "if-then-else",
        new ScriptingRule("None", "==",
            new ScriptingRule("None", "Array Length",
                new ScriptingRule("None", "Pieces on Tile",
                    new ScriptingRule("None", "Tile at Coordinates",
                        new ScriptingRule("None", "X Coordinate"),
                        new ScriptingRule("None", "Value", 0)
                    )
                )
            ),
            new ScriptingRule("None", "Value", 0)
        ),
        new ScriptingRule("None", "Return at End",
            new ScriptingRule("None", "Edit Variable of Rule", "Column Y", new ScriptingRule("None", "Value", 0)),
            new ScriptingRule("None", "Repeat While",
                new ScriptingRule("None", "&&",
                    new ScriptingRule("None", "<",
                        new ScriptingRule("None", "Return Variable of Rule", "Column Y"),
                        new ScriptingRule("None", "Board Height")
                    ),
                    new ScriptingRule("None", "==",
                        new ScriptingRule("None", "Array Length",
                            new ScriptingRule("None", "Pieces on Tile",
                                new ScriptingRule("None", "Tile at Coordinates",
                                    new ScriptingRule("None", "X Coordinate"),
                                    new ScriptingRule("None", "Return Variable of Rule", "Column Y")
                                )
                            )
                        ),
                        new ScriptingRule("None", "Value", 0)
                    )
                ),
                new ScriptingRule("None", "Edit Variable of Rule", "Column Y",
                    new ScriptingRule("None", "+",
                        new ScriptingRule("None", "Return Variable of Rule", "Column Y"),
                        new ScriptingRule("None", "Value", 1)
                    )
                )
            ),
            new ScriptingRule("None", "Edit Variable of Rule", "Column Y",
                new ScriptingRule("None", "-",
                    new ScriptingRule("None", "Return Variable of Rule", "Column Y"),
                    new ScriptingRule("None", "Value", 1)
                )
            ),
            new ScriptingRule("None", "Console Log", new ScriptingRule("None", "Return Variable of Rule", "Column Y")),
            new ScriptingRule("None", "Add Piece",
                new ScriptingRule("None", "Create an Array",
                    new ScriptingRule("None", "if-then-else",
                        new ScriptingRule("None", "==",
                            new ScriptingRule("None", "Player Turn"),
                            new ScriptingRule("None", "Value", 1)
                        ),
                        new ScriptingRule("None", "Choose Piece Type", 0),
                        new ScriptingRule("None", "Choose Piece Type", 1)
                    )
                ),
                new ScriptingRule("None", "X Coordinate"),
                new ScriptingRule("None", "Return Variable of Rule", "Column Y"),
                new ScriptingRule("None", "Player Turn"),
                new ScriptingRule("None", "if-then-else",
                    new ScriptingRule("None", "==",
                        new ScriptingRule("None", "Player Turn"),
                        new ScriptingRule("None", "Value", 1)
                    ),
                    new ScriptingRule("None", "Create Piece Sprite",
                        "square", "#ff4040", "#000000", "", "#000000"
                    ),
                    new ScriptingRule("None", "Create Piece Sprite",
                        "square", "#ffff40", "#000000", "", "#000000"
                    )
                )
            ),
            new ScriptingRule("None", "Edit Variable of Rule", "Direction Index", new ScriptingRule("None", "Value", 0)),
            new ScriptingRule("None", "Edit Variable of Rule", "Directions",
                new ScriptingRule("None", "Create an Array",
                    new ScriptingRule("None", "Create an Array",
                        new ScriptingRule("None", "Value", 1),
                        new ScriptingRule("None", "Value", 0)
                    ),
                    new ScriptingRule("None", "Create an Array",
                        new ScriptingRule("None", "Value", 0),
                        new ScriptingRule("None", "Value", 1)
                    ),
                    new ScriptingRule("None", "Create an Array",
                        new ScriptingRule("None", "Value", 1),
                        new ScriptingRule("None", "Value", 1)
                    ),
                    new ScriptingRule("None", "Create an Array",
                        new ScriptingRule("None", "Value", 1),
                        new ScriptingRule("None", "Value", -1)
                    )
                )
            ),
            new ScriptingRule("None", "Edit Variable of Rule", "Examined X", new ScriptingRule("None", "X Coordinate")), //7
            new ScriptingRule("None", "Edit Variable of Rule", "Examined Y", new ScriptingRule("None", "Return Variable of Rule", "Column Y")), //8
            new ScriptingRule("None", "Edit Variable of Rule", "Loop Going", new ScriptingRule("None", "Value", true)), //9 
            new ScriptingRule("None", "Edit Variable of Rule", "Line Length", new ScriptingRule("None", "Value", 0)), //10
            new ScriptingRule("None", "Edit Variable of Rule", "Direction Phase", new ScriptingRule("None", "Value", -1)), //11
            new ScriptingRule("None", "Repeat While", //12
                new ScriptingRule("None", "<",
                    new ScriptingRule("None", "Return Variable of Rule", "Direction Index"),
                    new ScriptingRule("None", "Value", 4)
                ),
                new ScriptingRule("None", "Return at End",
                    new ScriptingRule("None", "Edit Variable of Rule", "Loop Going", new ScriptingRule("None", "Value", true)), //1
                    new ScriptingRule("None", "Repeat While", //2
                        new ScriptingRule("None", "==",
                            new ScriptingRule("None", "Return Variable of Rule", "Loop Going"),
                            new ScriptingRule("None", "Value", true)
                        ),
                        new ScriptingRule("None", "Return at End",
                            new ScriptingRule("None", "Edit Variable of Rule", "Examined X", //1
                                new ScriptingRule("None", "+",
                                    new ScriptingRule("None", "Return Variable of Rule", "Examined X"),
                                    new ScriptingRule("None", "*",
                                        new ScriptingRule("None", "Array Element at Index",
                                            new ScriptingRule("None", "Array Element at Index",
                                                new ScriptingRule("None", "Return Variable of Rule", "Directions"),
                                                new ScriptingRule("None", "Return Variable of Rule", "Direction Index"),
                                            ),
                                            new ScriptingRule("None", "Value", 0)
                                        ),
                                        new ScriptingRule("None", "Return Variable of Rule", "Direction Phase")
                                    )
                                )
                            ),
                            new ScriptingRule("None", "Edit Variable of Rule", "Examined Y", //2
                                new ScriptingRule("None", "+",
                                    new ScriptingRule("None", "Return Variable of Rule", "Examined Y"),
                                    new ScriptingRule("None", "*",
                                        new ScriptingRule("None", "Array Element at Index",
                                            new ScriptingRule("None", "Array Element at Index",
                                                new ScriptingRule("None", "Return Variable of Rule", "Directions"),
                                                new ScriptingRule("None", "Return Variable of Rule", "Direction Index"),
                                            ),
                                            new ScriptingRule("None", "Value", 1)
                                        ),
                                        new ScriptingRule("None", "Return Variable of Rule", "Direction Phase")
                                    )
                                )
                            ),
                            new ScriptingRule("None", "if-then-else", //3
                                new ScriptingRule("None", "||", //1 
                                    new ScriptingRule("None", "||", //2 
                                        new ScriptingRule("None", "||", //3 
                                            new ScriptingRule("None", "<",
                                                new ScriptingRule("None", "Return Variable of Rule", "Examined X"),
                                                new ScriptingRule("None", "Value", 0)
                                            ),
                                            new ScriptingRule("None", ">=",
                                                new ScriptingRule("None", "Return Variable of Rule", "Examined X"),
                                                new ScriptingRule("None", "Board Width")
                                            )
                                        ),
                                        new ScriptingRule("None", "||",
                                            new ScriptingRule("None", "<",
                                                new ScriptingRule("None", "Return Variable of Rule", "Examined Y"),
                                                new ScriptingRule("None", "Value", 0)
                                            ),
                                            new ScriptingRule("None", ">=",
                                                new ScriptingRule("None", "Return Variable of Rule", "Examined Y"),
                                                new ScriptingRule("None", "Board Height")
                                            )
                                        )
                                    ),
                                    new ScriptingRule("None", "||",
                                        new ScriptingRule("None", "==",
                                            new ScriptingRule("None", "Array Length",
                                                new ScriptingRule("None", "Pieces on Tile",
                                                    new ScriptingRule("None", "Tile at Coordinates",
                                                        new ScriptingRule("None", "Return Variable of Rule", "Examined X"),
                                                        new ScriptingRule("None", "Return Variable of Rule", "Examined Y")
                                                    )
                                                )
                                            ),
                                            new ScriptingRule("None", "Value", 0)
                                        ),
                                        new ScriptingRule("None", "!=",
                                            new ScriptingRule("None", "Array Element at Index",
                                                new ScriptingRule("None", "Object Types", //type of array 
                                                    new ScriptingRule("None", "Array Element at Index", //WHAT
                                                        new ScriptingRule("None", "Pieces on Tile",
                                                            new ScriptingRule("None", "Tile at Coordinates",
                                                                new ScriptingRule("None", "Return Variable of Rule", "Examined X"),
                                                                new ScriptingRule("None", "Return Variable of Rule", "Examined Y")
                                                            )
                                                        ),
                                                        new ScriptingRule("None", "Value", 0)
                                                    ),
                                                ),
                                                new ScriptingRule("None", "Value", 0)
                                            ),
                                            new ScriptingRule("None", "Array Element at Index",
                                                new ScriptingRule("None", "Object Types",
                                                    new ScriptingRule("None", "Array Element at Index",
                                                        new ScriptingRule("None", "Pieces on Tile",
                                                            new ScriptingRule("None", "Tile at Coordinates",
                                                                new ScriptingRule("None", "X Coordinate"),
                                                                new ScriptingRule("None", "Return Variable of Rule", "Column Y")
                                                            )
                                                        ),
                                                        new ScriptingRule("None", "Value", 0)
                                                    ),
                                                ),
                                                new ScriptingRule("None", "Value", 0)
                                            ),
                                        )
                                    )
                                ),
                                new ScriptingRule("None", "Edit Variable of Rule", "Loop Going", new ScriptingRule("None", "Value", false)),
                                new ScriptingRule("None", "if-then-else",
                                    new ScriptingRule("None", "==",
                                        new ScriptingRule("None", "Return Variable of Rule", "Direction Phase"),
                                        new ScriptingRule("None", "Value", 1)
                                    ),
                                    new ScriptingRule("None", "Edit Variable of Rule", "Line Length",
                                        new ScriptingRule("None", "+",
                                            new ScriptingRule("None", "Return Variable of Rule", "Line Length"),
                                            new ScriptingRule("None", "Value", 1)
                                        )
                                    ),
                                    new ScriptingRule("None", "Value", true)
                                )
                            )
                        )
                    ),
                    new ScriptingRule("None", "if-then-else",
                        new ScriptingRule("None", "==",
                            new ScriptingRule("None", "Return Variable of Rule", "Direction Phase"),
                            new ScriptingRule("None", "Value", -1)
                        ),
                        new ScriptingRule("None", "Edit Variable of Rule", "Direction Phase", new ScriptingRule("None", "Value", 1)),
                        new ScriptingRule("None", "Return at End",
                            new ScriptingRule("None", "if-then-else",
                                new ScriptingRule("None", ">=",
                                    new ScriptingRule("None", "Return Variable of Rule", "Line Length"),
                                    new ScriptingRule("None", "Value", 4)
                                ),
                                new ScriptingRule("None", "End Game", new ScriptingRule("None", "Player Turn")),
                                new ScriptingRule("None", "Value", true)
                            ),
                            new ScriptingRule("None", "Edit Variable of Rule", "Examined X", new ScriptingRule("None", "X Coordinate")),
                            new ScriptingRule("None", "Edit Variable of Rule", "Examined Y", new ScriptingRule("None", "Return Variable of Rule", "Column Y")),
                            new ScriptingRule("None", "Edit Variable of Rule", "Line Length", new ScriptingRule("None", "Value", 0)),
                            new ScriptingRule("None", "Edit Variable of Rule", "Direction Phase", new ScriptingRule("None", "Value", -1)),
                            new ScriptingRule("None", "Edit Variable of Rule", "Direction Index",
                                new ScriptingRule("None", "+",
                                    new ScriptingRule("None", "Return Variable of Rule", "Direction Index"),
                                    new ScriptingRule("None", "Value", 1)
                                )
                            ),
                        )
                    )
                )
            ),
            new ScriptingRule("None", "if-then-else",
                new ScriptingRule("None", ">=",
                    new ScriptingRule("None", "+",
                        new ScriptingRule("None", "*",
                            new ScriptingRule("None", "-",
                                new ScriptingRule("None", "Turn Number"),
                                new ScriptingRule("None", "Value", 1)
                            ),
                            new ScriptingRule("None", "Value", 2)
                        ),
                        new ScriptingRule("None", "Player Turn")
                    ),
                    new ScriptingRule("None", "*",
                        new ScriptingRule("None", "Board Width"),
                        new ScriptingRule("None", "Board Height")
                    )
                ),
                new ScriptingRule("None", "End Game", new ScriptingRule("None", "Value", 0)),
                new ScriptingRule("None", "Value", true)
            ),
            new ScriptingRule("None", "Change Turn Phase", Infinity),
            new ScriptingRule("None", "Value", true)
        ),
        new ScriptingRule("None", "Value", false)
    )
])

pieceTypesList.push(typeRed, typeYellow);
tileTypesList.push(typeTileClick);

for (let y = 0; y < activeGameState.board.tileArray.length; y++) {
    for (let x = 0; x < activeGameState.board.tileArray[y].length; x++) {
        activeGameState.board.tileArray[y][x].types.push(typeTileClick);
    }
}