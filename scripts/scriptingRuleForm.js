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
        
        this.modifyDIV(srdiv);

        this.div = srdiv;
    }

    modifyDIV(srdiv = this.div) {
        while (srdiv.firstElementChild) srdiv.removeChild(srdiv.lastElementChild);
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
        let scriptingRuleChild = function(argToCheck) {
            if (argToCheck instanceof ScriptingRule) {
                srdiv.appendChild(srdarg);
                let newForm = new ScriptingRuleForm(argToCheck, false, form.topTrigger, !form.zebraDark);
                form.childrenForms.push(newForm);
                console.log(newForm);
                srdiv.appendChild(newForm.div);
                return true;
            }
            else return false;
        }
        let srdarg, srdarg2, srdarg3, srdarg4;
        if (this.rule.type === "Value") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Value:";
            if (!scriptingRuleChild(this.rule.value)) {
                if (typeof this.rule.value === "number") {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("input");
                    srdarg2.value = this.rule.value;
                    srdarg2.addEventListener("change", function(){
                        let v = Number(this.value);
                        if (Number.isFinite(v)) form.rule.value = v;
                        form.modifyDIV();
                    });
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
                else if (typeof this.rule.value === "boolean") {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("span");
                    srdarg2.classList.add("SRFBooleanBox");
                    srdarg2.innerHTML = this.rule.value;
                    srdarg2.addEventListener("click", function(){
                        form.rule.value = !form.rule.value;
                        form.modifyDIV();
                    })
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
                else {
                    srdarg.innerHTML += " " + stringifyBGBObject(this.rule.value);
                    srdiv.appendChild(srdarg);
                }
                srdarg = document.createElement("button");
                srdarg.classList.add("SRFButton");
                srdarg.innerHTML = "Change Type";
                srdarg.addEventListener("click", function(){
                    if (typeof form.rule.value === "number") {
                        form.rule.value = Boolean(form.rule.value);
                    }
                    else {
                        form.rule.value = Number(form.rule.value);
                    }
                    form.modifyDIV();
                })
                srdiv.appendChild(srdarg);
            }
        }
        else if (this.rule.type === "Argument") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Argument: ";
            srdarg2 = document.createElement("select");
            if (this.topTrigger === "Piece Moves") {
                srdarg3 = document.createElement("option");
                srdarg3.setAttribute("value", 0);
                srdarg3.innerHTML = "X Movement";
                srdarg2.appendChild(srdarg3);
                srdarg3 = document.createElement("option");
                srdarg3.setAttribute("value", 1);
                srdarg3.innerHTML = "Y Movement";
                srdarg2.appendChild(srdarg3);
            }
            else if (this.topTrigger === "Piece Lands on Tile") {
                srdarg3 = document.createElement("option");
                srdarg3.setAttribute("value", 0);
                srdarg3.innerHTML = "The tile this piece landed on";
                srdarg2.appendChild(srdarg3);
            }
            else if (this.topTrigger === "Tile is Landed On") {
                srdarg3 = document.createElement("option");
                srdarg3.setAttribute("value", 0);
                srdarg3.innerHTML = "The piece that landed on this tile";
                srdarg2.appendChild(srdarg3);
            }
            srdarg2.value = this.rule.index;
            srdarg2.addEventListener("change", function(){
                console.log(Number(this.value));
                form.rule.index = Number(this.value);
                form.modifyDIV();
            })
            srdarg.appendChild(srdarg2);
            srdiv.appendChild(srdarg);
        }

        // Actions
        else if (this.rule.type === "Move Piece") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "X Movement:";
            if (!scriptingRuleChild(this.rule.moveX)) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.moveX;
                srdarg2.addEventListener("change", function(){
                    let v = Number(this.value);
                    if (Number.isFinite(v)) form.rule.moveX = v;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Y Movement:";
            if (!scriptingRuleChild(this.rule.moveY)) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.moveY;
                srdarg2.addEventListener("change", function(){
                    let v = Number(this.value);
                    if (Number.isFinite(v)) form.rule.moveY = v;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
        }
        else if (this.rule.type === "Change Piece Owner" || this.rule.type === "Move Piece to Inventory") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Player Number:";
            if (!scriptingRuleChild(this.rule.playerID)) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.playerID;
                srdarg2.addEventListener("change", function(){
                    let v = Number(this.value);
                    if (v > 0 && v <= activeGameState.playerAmount && v % 1 == 0) form.rule.playerID = v;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
        }
        // Allow both piece types and tile types for now. I'll add "caller" in later.
        else if (this.rule.type === "Add Type" || this.rule.type === "Remove Type") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Type:";
            if (!scriptingRuleChild(this.rule.typeToEdit)) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("select");
                srdarg3 = document.createElement("optgroup");
                srdarg3.setAttribute("label", "Piece Types");
                for (let t = 0; t < pieceTypesList.length; t++) {
                    srdarg4 = document.createElement("option");
                    srdarg4.setAttribute("value", "Piece Type " + t);
                    srdarg4.innerHTML = stringifyBGBObject(pieceTypesList[t]);
                    srdarg3.appendChild(srdarg4);
                }
                srdarg2.appendChild(srdarg3);
                srdarg3 = document.createElement("optgroup");
                srdarg3.setAttribute("label", "Tile Types");
                for (let t = 0; t < tileTypesList.length; t++) {
                    srdarg4 = document.createElement("option");
                    srdarg4.setAttribute("value", "Tile Type " + t);
                    srdarg4.innerHTML = stringifyBGBObject(tileTypesList[t]);
                    srdarg3.appendChild(srdarg4);
                }
                srdarg2.appendChild(srdarg3);
                if (this.rule.typeToEdit instanceof PieceType) {
                    let index = 0;
                    for (index = 0; index < pieceTypesList.length; index++) {
                        if (pieceTypesList[index].typeID === this.rule.typeToEdit.typeID) break;
                    }
                    srdarg2.value = "Piece Type " + index;
                }
                else if (this.rule.typeToEdit instanceof TileType) {
                    let index = 0;
                    for (index = 0; index < tileTypesList.length; index++) {
                        if (tileTypesList[index].typeID === this.rule.typeToEdit.typeID) break;
                    }
                    srdarg2.value = "Tile Type " + index;
                }
                srdarg2.addEventListener("change", function(){
                    if (this.value.includes("Piece Type")) form.rule.typeToEdit = pieceTypesList[this.value.slice(11)];
                    else if (this.value.includes("Tile Type")) form.rule.typeToEdit = tileTypesList[this.value.slice(10)];
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
            if (this.rule.type === "Add Type") {
                srdarg = document.createElement("p");
                if (!scriptingRuleChild(this.rule.index)) {
                    if (this.rule.index === undefined) {
                        srdarg.innerHTML = "Placed at the end of the tile list.";
                        srdiv.appendChild(srdarg);
                        srdarg = document.createElement("button");
                        srdarg.classList.add("SRFButton");
                        srdarg.innerHTML = "Specify Index";
                        srdarg.addEventListener("click", function(){
                            form.rule.index = 0;
                            form.modifyDIV();
                        })
                        srdiv.appendChild(srdarg);
                    }
                    else {
                        srdarg = document.createElement("p");
                        srdarg.innerHTML = "Placed at index ";
                        srdarg2 = document.createElement("input");
                        srdarg2.value = this.rule.index;
                        srdarg2.addEventListener("change", function(){
                            let v = Number(this.value);
                            if (Number.isFinite(v)) form.rule.index = v;
                            form.modifyDIV();
                        });
                        srdarg.appendChild(srdarg2);
                        srdiv.appendChild(srdarg);
                        srdarg = document.createElement("button");
                        srdarg.classList.add("SRFButton");
                        srdarg.innerHTML = "Place at End";
                        srdarg.addEventListener("click", function(){
                            form.rule.index = undefined;
                            form.modifyDIV();
                        })
                        srdiv.appendChild(srdarg);
                    }
                }
            }
        }
        else if (this.rule.type === "Add Piece") {
            addArgHTML(this.rule.newPieceTypes, "Array of Types:");
            addArgHTML(this.rule.newPieceX, "X Coordinate:");
            addArgHTML(this.rule.newPieceY, "Y Coordinate:");
            addArgHTML(this.rule.newPieceOwner, "Player Number of Owner:");
        }
        else if (this.rule.type === "Change Turn Phase") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Turn Phase:";
            if (!scriptingRuleChild(this.rule.phase)) {
                if (this.rule.phase === Infinity) {
                    srdarg.innerHTML += " End Turn";
                    srdiv.appendChild(srdarg);
                    srdarg = document.createElement("button");
                    srdarg.classList.add("SRFButton");
                    srdarg.innerHTML = "Specify Phase";
                    srdarg.addEventListener("click", function(){
                        form.rule.phase = 0;
                        form.modifyDIV();
                    })
                    srdiv.appendChild(srdarg);
                }
                else {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("input");
                    srdarg2.value = this.rule.phase;
                    srdarg2.addEventListener("change", function(){
                        let v = Number(this.value);
                        if (Number.isFinite(v) && v % 1 == 0) form.rule.phase = v;
                        form.modifyDIV();
                    });
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                    srdarg = document.createElement("button");
                    srdarg.classList.add("SRFButton");
                    srdarg.innerHTML = "End Turn";
                    srdarg.addEventListener("click", function(){
                        form.rule.phase = Infinity;
                        form.modifyDIV();
                    })
                    srdiv.appendChild(srdarg);
                }
            }
        }
        else if (this.rule.type === "End Game") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Winner:";
            if (!scriptingRuleChild(this.rule.winner)) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.winner;
                srdarg2.addEventListener("change", function(){
                    let v = Number(this.value);
                    if (v >= 0 && v <= activeGameState.playerAmount && v % 1 == 0) form.rule.winner = v;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
        }
        else if (this.rule.type === "Change Sprite") {
            addArgHTML(this.rule.sprite, "New Sprite:");
        }
        
        // Reporters
        else if (this.rule.type === "Tile at Coordinates") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "X Coordinate:";
            if (!scriptingRuleChild(this.rule.XCoordinate)) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.XCoordinate;
                srdarg2.addEventListener("change", function(){
                    let v = Number(this.value);
                    if (Number.isFinite(v)) form.rule.XCoordinate = v;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Y Coordinate:";
            if (!scriptingRuleChild(this.rule.YCoordinate)) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.YCoordinate;
                srdarg2.addEventListener("change", function(){
                    let v = Number(this.value);
                    if (Number.isFinite(v)) form.rule.YCoordinate = v;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
        }
        else if (this.rule.type === "Pieces on Tile") {
            addArgHTML(this.rule.tileToCheck, "Tile:");
        }
        else if (this.rule.type === "X Coordinate" || this.rule.type === "Y Coordinate" || this.rule.type === "Object Types" || this.rule.type === "Object ID") {
            addArgHTML(this.rule.object, "Object:", [[undefined, "Caller"]]);
        }

        // Control
        else if (this.rule.type === "Edit Variable of Object" || this.rule.type === "Edit Variable of Rule") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Variable Name:";
            if (!scriptingRuleChild(this.rule.variableName)) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.variableName;
                srdarg2.addEventListener("change", function(){
                    form.rule.variableName = String(this.value);
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Value:";
            if (!scriptingRuleChild(this.rule.variableValue)) {
                if (typeof this.rule.variableValue === "number") {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("input");
                    srdarg2.variableValue = this.rule.variableValue;
                    srdarg2.addEventListener("change", function(){
                        let v = Number(this.value);
                        if (Number.isFinite(v)) form.rule.variableValue = v;
                        form.modifyDIV();
                    });
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
                else if (typeof this.rule.variableValue === "boolean") {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("span");
                    srdarg2.classList.add("SRFBooleanBox");
                    srdarg2.innerHTML = this.rule.variableValue;
                    srdarg2.addEventListener("click", function(){
                        form.rule.variableValue = !form.rule.variableValue;
                        form.modifyDIV();
                    })
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
                else {
                    srdarg.innerHTML += " " + stringifyBGBObject(this.rule.variableValue);
                    srdiv.appendChild(srdarg);
                }
                srdarg = document.createElement("button");
                srdarg.classList.add("SRFButton");
                srdarg.innerHTML = "Change Type";
                srdarg.addEventListener("click", function(){
                    if (typeof form.rule.variableValue === "number") {
                        form.rule.variableValue = Boolean(form.rule.variableValue);
                    }
                    else {
                        form.rule.variableValue = Number(form.rule.variableValue);
                    }
                    form.modifyDIV();
                })
                srdiv.appendChild(srdarg);
            }
            if (this.rule.type === "Edit Variable of Object") addArgHTML(this.rule.object, "Object:", [[undefined, "Caller"]]);
        }
        else if (this.rule.type === "Return Variable of Object" || this.rule.type === "Return Variable of Rule") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Variable Name:";
            if (!scriptingRuleChild(this.rule.variableName)) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.variableName;
                srdarg2.addEventListener("change", function(){
                    form.rule.variableName = String(this.value);
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
            if (this.rule.type === "Edit Variable of Object") addArgHTML(this.rule.object, "Object:", [[undefined, "Caller"]]);
        }
        else if (this.rule.type === "if-then-else") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "If:";
            scriptingRuleChild(this.rule.if);
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Then:";
            scriptingRuleChild(this.rule.then);
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Then:";
            scriptingRuleChild(this.rule.else);
        }
        else if (this.rule.type === "Return at End") {
            for (let s = 0; s < this.rule.scriptsToRun.length; s++) {
                srdarg = document.createElement("p");
                srdarg.innerHTML = "Script #" + (s + 1);
                scriptingRuleChild(this.rule.scriptsToRun[s]);
            }
        }
        else if (this.rule.type == "Repeat While") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "While:";
            scriptingRuleChild(this.rule.repeatCheck);
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Repeat:";
            scriptingRuleChild(this.rule.repeatScript);
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
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Index:";
            if (!scriptingRuleChild(this.rule.index)) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.index;
                srdarg2.addEventListener("change", function(){
                    let v = Number(this.value);
                    if (v >= 0 && v % 1 == 0) form.rule.index = v;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
        }

        else if (this.rule.type == "Other Caller") {
            addArgHTML(this.rule.otherCaller, "Object:");
            addArgHTML(this.rule.otherScript, "Script:");
        }
        else if (this.rule.type == "Console Log") {
            addArgHTML(this.rule.toLog, "Log the Result of");
        }
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