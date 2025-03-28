class ScriptingRuleForm {
    rule;
    top;
    topTrigger;
    zebraDark = false;
    div;
    childrenForms = [];

    constructor(rule, top = true, topTrigger = undefined, zebraDark = false) {
        this.rule = rule;
        this.top = top;
        if (this.top && this.topTrigger === undefined) this.topTrigger = this.rule.trigger;
        else if (this.topTrigger === undefined) this.topTrigger = topTrigger;
        this.zebraDark = zebraDark;
        this.createDIV();
    }

    createDIV() {
        let srdiv = document.createElement("div");
        srdiv.classList.add("scriptingRuleBox");
        if (this.zebraDark) {
            srdiv.classList.add("scriptingRuleBoxZebraDark");
        }
        else {
            srdiv.classList.add("scriptingRuleBoxZebraLight");
        }
        if (this.top) {
            this.topTrigger = this.rule.trigger;
            let srdtrigger = document.createElement("p");
            if (this.topTrigger === "Piece Moves") srdtrigger.innerHTML = "Triggered when this piece moves.";
            else if (this.topTrigger === "Piece Lands on Tile") srdtrigger.innerHTML = "Triggered when this piece lands on a tile."
            else if (this.topTrigger === "Tile is Landed on") srdtrigger.innerHTML = "Triggered when this tile is landed on by a piece."
            else if (this.topTrigger === "Piece is Removed") srdtrigger.innerHTML = "Triggered when this piece is removed."
            else srdtrigger.innerHTML = "This script does not have an intrinsic trigger."
            srdiv.appendChild(srdtrigger);
        }
        let srdtype = document.createElement("p");
        srdtype.innerHTML = "Type: " + this.rule.type;
        srdiv.appendChild(srdtype);
        let form = this;
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
                let newForm = new ScriptingRuleForm(argToCheck, false, form.topTrigger, !form.zebraDark);
                form.childrenForms.push(newForm);
                console.log(newForm);
                srdiv.appendChild(newForm.div);
            }
            else {
                srdarg.innerHTML += " " + stringifyBGBObject(argToCheck);
                srdiv.appendChild(srdarg);
            }
        }
        if (this.rule.type === "Value") {
            addArgHTML(this.rule.value, "Value:");
        }
        else if (this.rule.type === "Argument") {
            if (this.topTrigger === "Piece Moves") {
                addArgHTML(this.rule.index, "Return Argument:", [[0, "X Movement"], [1, "Y Movement"]])
            }
            else if (this.topTrigger === "Piece Lands on Tile") {
                addArgHTML(this.rule.index, "Return Argument:", [[0, "The tile this piece landed on"]])
            }
            else if (this.topTrigger === "Tile is Landed On") {
                addArgHTML(this.rule.index, "Return Argument:", [[0, "The piece that landed on this tile"]])
            }
            else {
                addArgHTML(this.rule.index, "Return Argument:")
            }
        }

        // Actions
        else if (this.rule.type === "Move Piece") {
            addArgHTML(this.rule.moveX, "X Movement:");
            addArgHTML(this.rule.moveY, "Y Movement:");
        }
        else if (this.rule.type === "Change Piece Owner" || this.rule.type === "Move Piece to Inventory") {
            addArgHTML(this.rule.playerID, "Player Number:");
        }
        else if (this.rule.type === "Add Type") {
            addArgHTML(this.rule.typeToEdit, "Type:");
            addArgHTML(this.rule.typeToEdit, "Put at Index:", [[undefined, "Last"]]);
        }
        else if (this.rule.type === "Remove Type") {
            addArgHTML(this.rule.typeToEdit, "Type:");
        }
        else if (this.rule.type === "Add Piece") {
            addArgHTML(this.rule.newPieceTypes, "Array of Types:");
            addArgHTML(this.rule.newPieceX, "X Coordinate:");
            addArgHTML(this.rule.newPieceY, "Y Coordinate:");
            addArgHTML(this.rule.newPieceOwner, "Player Number of Owner:");
        }
        else if (this.rule.type === "Change Turn Phase") {
            addArgHTML(this.rule.phase, "Turn Phase:", [[undefined, "End Turn"]]);
        }
        else if (this.rule.type === "End Game") {
            addArgHTML(this.rule.winner, "Player Number of Winner:", [[0, "Draw"]]);
        }
        else if (this.rule.type === "Change Sprite") {
            addArgHTML(this.rule.sprite, "New Sprite:");
        }
        
        // Reporters
        else if (this.rule.type === "Tile at Coordinates") {
            addArgHTML(this.rule.XCoordinate, "X Coordinate:");
            addArgHTML(this.rule.YCoordinate, "Y Coordinate:");
        }
        else if (this.rule.type === "Pieces on Tile") {
            addArgHTML(this.rule.tileToCheck, "Tile:");
        }
        else if (this.rule.type === "X Coordinate" || this.rule.type === "Y Coordinate" || this.rule.type === "Object Types" || this.rule.type === "Object ID") {
            addArgHTML(this.rule.object, "Object:", [[undefined, "Caller"]]);
        }

        // Control
        else if (this.rule.type === "Edit Variable of Object" || this.rule.type === "Edit Variable of Rule") {
            addArgHTML(this.rule.variableName, "Variable Name:");
            addArgHTML(this.rule.variableValue, "New Value:");
            if (this.rule.type === "Edit Variable of Object") addArgHTML(this.rule.object, "Object:", [[undefined, "Caller"]]);
        }
        else if (this.rule.type === "Return Variable of Object" || this.rule.type === "Return Variable of Rule") {
            addArgHTML(this.rule.variableName, "Variable Name:");
            if (this.rule.type === "Edit Variable of Object") addArgHTML(this.rule.object, "Object:", [[undefined, "Caller"]]);
        }
        else if (this.rule.type === "if-then-else") {
            addArgHTML(this.rule.if, "If");
            addArgHTML(this.rule.then, "Then");
            addArgHTML(this.rule.else, "Else");
        }
        else if (this.rule.type === "Return at End") {
            for (let s = 0; s < this.rule.scriptsToRun.length; s++) {
                addArgHTML(this.rule.scriptsToRun[s], "Script #" + (s + 1));
            }
        }
        else if (this.rule.type == "Repeat While") {
            addArgHTML(this.rule.repeatCheck, "While:");
            addArgHTML(this.rule.repeatScript, "Repeat:");
        }
        else if (twoArgOperators.indexOf(this.rule.type) != -1) {
            addArgHTML(this.rule.leftArg, "Left Argument:");
            addArgHTML(this.rule.rightArg, "Right Argument:");
        }
        else if (oneArgOperators.indexOf(this.rule.type) != -1) {
            addArgHTML(this.rule.argument, "Argument:");
        }
        else if (this.rule.type == "Array Length" || this.rule.type == "Remove Last Element of Array") {
            addArgHTML(this.rule.array, "Array:");
        }
        else if (this.rule.type == "Array Index Of Element" || this.rule.type == "Add to Array") {
            addArgHTML(this.rule.array, "Array:");
            addArgHTML(this.rule.element, "Element:");
        }
        else if (this.rule.type == "Array Element at Index") {
            addArgHTML(this.rule.array, "Array:");
            addArgHTML(this.rule.index, "Index:");
        }

        else if (this.rule.type == "Other Caller") {
            addArgHTML(this.rule.otherCaller, "Object:");
            addArgHTML(this.rule.otherScript, "Script:");
        }
        else if (this.rule.type == "Console Log") {
            addArgHTML(this.rule.toLog, "Log the Result of");
        }

        this.div = srdiv;
    }
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