if (activeGameState === undefined) activeGameState = new GameState(new Board("Square", 1, 1), [], 2)
gameStateValid();
let clickingPieces = true;
generateTestingGrid(); displayTestingGrid();
document.getElementById("clickChange").addEventListener("click", function(){
    clickingPieces = !clickingPieces;
    displayTestingGrid();
});


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
    while (document.getElementById("testingGrid").lastElementChild) document.getElementById("testingGrid").removeChild(document.getElementById("testingGrid").lastElementChild);
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
    for (let b = 0; b < buttonsList.length; b++) {
        let buttonH = document.createElement("button");
        buttonH.id = "button_" + b;
        buttonH.style.setProperty("background-color", buttonsList[b].sprite.fillColor);
        buttonH.style.setProperty("color", buttonsList[b].sprite.textColor);
        buttonH.style.setProperty("border-style", "solid");
        buttonH.style.setProperty("border-color", buttonsList[b].sprite.borderColor);
        buttonH.style.setProperty("border-radius", buttonsList[b].sprite.borderRadius);
        buttonH.innerHTML = buttonsList[b].sprite.text;
        buttonH.addEventListener("click", function(){
            buttonsList[b].clickButton();
            displayTestingGrid();
        });
        document.getElementById("buttonsBox").appendChild(buttonH);
    }
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
    for (let b = 0; b < buttonsList.length; b++) {
        if (buttonsList[b].buttonVisible()) document.getElementById("button_" + b).style.setProperty("display", "inline-block");
        else document.getElementById("button_" + b).style.setProperty("display", "none");
    }
    if (Number.isFinite(activeGameState.turnNumber)) document.getElementById("turnText").innerHTML = "Turn #" + activeGameState.turnNumber + "<br>Player #" + activeGameState.playerTurn + "<br>Phase " + activeGameState.turnPhase;
    else if (activeGameState.playerTurn === 0) document.getElementById("turnText").innerHTML = "It's a draw!";
    else document.getElementById("turnText").innerHTML = "Player " + activeGameState.playerTurn + " wins!";
    if (clickingPieces) document.getElementById("clickChange").innerHTML = "Clicking pieces";
    else document.getElementById("clickChange").innerHTML = "Clicking tiles";
}

function saveCode() {
    const game = {
        minPlayers: activeGameState.playerAmount,
        maxPlayers: activeGameState.playerAmount,
        board: activeGameState.board.saveCode(),
        pieces: activeGameState.pieceArray.map(piece =>
            piece.saveCode()
        ),
        pieceTypes: pieceTypesList.map(type => type.saveCode()),
        tileTypes: tileTypesList.map(type => type.saveCode()),
        buttons: buttonsList.map(button => button.saveCode()),
        globalVariables: otherGlobalVariables,
        globalScripts: globalScripts.map(rule => rule.saveCode()),
        inventoryLayout: {containerWidth: -1, containerHeight: -1, containerTop: -1, containerLeft:-1, borderColor:'rgba(0, 0, 0, 0.9)', borderWidth:'2px', backgroundColor:'rgba(255, 255, 255, 0.9)'},
        globalLayout: {containerWidth: -1, containerHeight: -1, containerTop: -1, containerLeft:-1, borderColor:'rgba(0, 0, 0, 0.9)', borderWidth:'2px', backgroundColor:'rgba(255, 255, 255, 0.9)', displayVariables:[]}
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
                
                activeGameState = new GameState(Board.loadCode(game.board), [], game.minPlayers);
                for (let p of game.pieces) {
                    activeGameState.pieceArray.push(Piece.loadCode(p))
                }
                otherGlobalVariables = game.globalVariables;
                pieceTypesList = [];
                tileTypesList = [];
                buttonsList = [];
                globalScripts = [];
                for (let t of game.tileTypes) {
                    tileTypesList.push(TileType.loadCode(t))
                }
                for (let t of game.pieceTypes) {
                    pieceTypesList.push(PieceType.loadCode(t))
                }
                for (let b of game.buttons) {
                    buttonsList.push(Button.loadCode(b))
                }
                for (let s of game.globalScripts) {
                    globalScripts.push(ScriptingRule.loadCode(s))
                }
                
                playerInventories = {containerWidth: game.inventoryLayout.containerWidth, containerHeight: game.inventoryLayout.containerHeight, containerTop: game.inventoryLayout.containerTop, containerLeft:game.inventoryLayout.containerLeft, borderColor:game.inventoryLayout.borderColor, borderWidth:game.inventoryLayout.borderWidth, backgroundColor:game.inventoryLayout.backgroundColor}
                globals = {containerWidth: game.globalLayout.containerWidth, containerHeight:  game.globalLayout.containerHeight, containerTop:  game.globalLayout.containerTop, containerLeft: game.globalLayout.containerLeft, borderColor: game.globalLayout.borderColor, borderWidth: game.globalLayout.borderWidth, backgroundColor: game.globalLayout.backgroundColor, displayVariables: game.globalLayout.displayVariables}

                gameStateValid();
                generateTestingGrid();
                displayTestingGrid();
                
            } catch (err) {
                alert("Error parsing JSON: " + err.message);
                console.error(err); // ← logs full stack trace
            }
        };
        reader.readAsText(file);
    });
    input.click();
}