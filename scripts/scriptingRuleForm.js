function scriptingRuleForm(rule, top = true, topTrigger = "None", zebraDark = false) {
    let srdiv = document.createElement("div");
    srdiv.classList.add("scriptingRuleBox");
    if (zebraDark) {
        srdiv.classList.add("scriptingRuleBoxZebraDark");
    }
    else {
        srdiv.classList.add("scriptingRuleBoxZebraLight");
    }
    if (top) {
        topTrigger = rule.trigger;
        let srdtrigger = document.createElement("p");
        if (topTrigger === "Piece Moves") srdtrigger.innerHTML = "Triggered when this piece moves.";
        else if (topTrigger === "Piece Lands on Tile") srdtrigger.innerHTML = "Triggered when this piece lands on a tile."
        else if (topTrigger === "Tile is Landed on") srdtrigger.innerHTML = "Triggered when this tile is landed on by a piece."
        else if (topTrigger === "Piece is Removed") srdtrigger.innerHTML = "Triggered when this piece is removed."
        else srdtrigger.innerHTML = "This script does not have an intrinsic trigger."
        srdiv.appendChild(srdtrigger);
    }
    let srdtype = document.createElement("p");
    srdtype.innerHTML = "Type: " + rule.type;
    srdiv.appendChild(srdtype);
    let addArgHTML = function(argToCheck, text, specialStrings = []){
        let srdarg = document.createElement("p");
        srdarg.innerHTML = text;
        for (let ss = 0; ss < specialStrings.length; ss++) {
            if (argToCheck === specialStrings[ss][0]) {
                srdarg.innerHTML += " " + specialStrings[ss][1];
                srdiv.appendChild(srdarg);
                return;
            }
        }
        if (argToCheck instanceof ScriptingRule) {
            srdiv.appendChild(srdarg);
            srdiv.appendChild(scriptingRuleForm(argToCheck, false, topTrigger, !zebraDark));
        }
        else {
            srdarg.innerHTML += " " + stringifyBGBObject(argToCheck);
            srdiv.appendChild(srdarg);
        }
    }
    if (rule.type === "Value") {
        addArgHTML(rule.value, "Value:");
    }
    else if (rule.type === "Argument") {
        if (topTrigger === "Piece Moves") {
            addArgHTML(rule.index, "Return Argument:", [[0, "X Movement"], [1, "Y Movement"]])
        }
        else if (topTrigger === "Piece Lands on Tile") {
            addArgHTML(rule.index, "Return Argument:", [[0, "The tile this piece landed on"]])
        }
        else if (topTrigger === "Tile is Landed On") {
            addArgHTML(rule.index, "Return Argument:", [[0, "The piece that landed on this tile"]])
        }
        else {
            addArgHTML(rule.index, "Return Argument:")
        }
    }

    // Actions
    else if (rule.type === "Move Piece") {
        addArgHTML(rule.moveX, "X Movement:");
        addArgHTML(rule.moveY, "Y Movement:");
    }
    else if (rule.type === "Change Piece Owner" || rule.type === "Move Piece to Inventory") {
        addArgHTML(rule.playerID, "Player Number:");
    }
    else if (rule.type === "Add Type") {
        addArgHTML(rule.typeToEdit, "Type:");
        addArgHTML(rule.typeToEdit, "Put at Index:", [[undefined, "Last"]]);
    }
    else if (rule.type === "Remove Type") {
        addArgHTML(rule.typeToEdit, "Type:");
    }
    else if (rule.type === "Add Piece") {
        addArgHTML(rule.newPieceTypes, "Array of Types:");
        addArgHTML(rule.newPieceX, "X Coordinate:");
        addArgHTML(rule.newPieceY, "Y Coordinate:");
        addArgHTML(rule.newPieceOwner, "Player Number of Owner:");
    }
    else if (rule.type === "Change Turn Phase") {
        addArgHTML(rule.phase, "Turn Phase:", [[undefined, "End Turn"]]);
    }
    else if (rule.type === "End Game") {
        addArgHTML(rule.winner, "Player Number of Winner:", [[0, "Draw"]]);
    }
    else if (rule.type === "Change Sprite") {
        addArgHTML(rule.sprite, "New Sprite:");
    }
    
    // Reporters
    else if (rule.type === "Tile at Coordinates") {
        addArgHTML(rule.XCoordinate, "X Coordinate:");
        addArgHTML(rule.YCoordinate, "Y Coordinate:");
    }
    else if (rule.type === "Pieces on Tile") {
        addArgHTML(rule.tileToCheck, "Tile:");
    }
    else if (rule.type === "X Coordinate" || rule.type === "Y Coordinate" || rule.type === "Object Types" || rule.type === "Object ID") {
        addArgHTML(rule.object, "Object:", [[undefined, "Caller"]]);
    }

    // Control
    else if (rule.type === "Edit Variable of Object" || rule.type === "Edit Variable of Rule") {
        addArgHTML(rule.variableName, "Variable Name:");
        addArgHTML(rule.variableValue, "New Value:");
        if (rule.type === "Edit Variable of Object") addArgHTML(rule.object, "Object:", [[undefined, "Caller"]]);
    }
    else if (rule.type === "Return Variable of Object" || rule.type === "Return Variable of Rule") {
        addArgHTML(rule.variableName, "Variable Name:");
        if (rule.type === "Edit Variable of Object") addArgHTML(rule.object, "Object:", [[undefined, "Caller"]]);
    }
    else if (rule.type === "if-then-else") {
        addArgHTML(rule.if, "If");
        addArgHTML(rule.then, "Then");
        addArgHTML(rule.else, "Else");
    }
    else if (rule.type === "Return at End") {
        for (let s = 0; s < rule.scriptsToRun.length; s++) {
            addArgHTML(rule.scriptsToRun[s], "Script #" + (s + 1));
        }
    }
    else if (rule.type == "Repeat While") {
        addArgHTML(rule.repeatCheck, "While:");
        addArgHTML(rule.repeatScript, "Repeat:");
    }
    else if (twoArgOperators.indexOf(rule.type) != -1) {
        addArgHTML(rule.leftArg, "Left Argument:");
        addArgHTML(rule.rightArg, "Right Argument:");
    }
    else if (oneArgOperators.indexOf(rule.type) != -1) {
        addArgHTML(rule.argument, "Argument:");
    }
    else if (rule.type == "Array Length" || rule.type == "Remove Last Element of Array") {
        addArgHTML(rule.array, "Array:");
    }
    else if (rule.type == "Array Index Of Element" || rule.type == "Add to Array") {
        addArgHTML(rule.array, "Array:");
        addArgHTML(rule.element, "Element:");
    }
    else if (rule.type == "Array Element at Index") {
        addArgHTML(rule.array, "Array:");
        addArgHTML(rule.index, "Index:");
    }

    else if (rule.type == "Other Caller") {
        addArgHTML(rule.otherCaller, "Object:");
        addArgHTML(rule.otherScript, "Script:");
    }
    else if (rule.type == "Console Log") {
        addArgHTML(rule.toLog, "Log the Result of");
    }

    return srdiv;
}

function stringifyBGBObject(obj) {
    if (obj instanceof Piece) return "Piece with ID" + obj.objectID;
    else if (obj instanceof Tile) return "Tile at (" + obj.xCoordinate + ", " + obj.yCoordinate + ")"; 
    else if (obj instanceof PieceType) return "Piece Type \"" + obj.typeName + "\"";
    else if (obj instanceof TileType) return "Tile Type \"" + obj.typeName + "\"";
    else if (obj instanceof Sprite) return "Sprite with color " + obj.color + ", text color " + obj.textColor + ", and text \"" + obj.text + "\"";
    else if (obj instanceof ScriptingRule) throw new TypeError("stringifyBGBObject should not be called on scripting rules! They become DIV elements with scriptingRuleForm instead."); // explicitly adding an error case for rule since it seems like a mistake someone might make
    else return String(obj);
}