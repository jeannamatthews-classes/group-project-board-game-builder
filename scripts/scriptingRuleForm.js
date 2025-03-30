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
        let form = this;
        if (this.top) {
            this.topTrigger = this.rule.trigger;
            let srdtrigger = document.createElement("p");
            srdtrigger.innerHTML = "Trigger:";
            let srdtriggerselect = document.createElement("select");
            let srdtriggeroption;
            if (true) {
                srdtriggeroption = document.createElement("option");
                srdtriggeroption.setAttribute("value", "Piece Moves");
                srdtriggeroption.innerHTML = "When this piece moves";
                srdtriggerselect.appendChild(srdtriggeroption);
            }
            if (true) {
                srdtriggeroption = document.createElement("option");
                srdtriggeroption.setAttribute("value", "Piece Lands on Tile");
                srdtriggeroption.innerHTML = "When this piece lands on a tile";
                srdtriggerselect.appendChild(srdtriggeroption);
            }
            if (true) {
                srdtriggeroption = document.createElement("option");
                srdtriggeroption.setAttribute("value", "Tile is Landed On");
                srdtriggeroption.innerHTML = "When this tile is landed on";
                srdtriggerselect.appendChild(srdtriggeroption);
            }
            if (true) {
                srdtriggeroption = document.createElement("option");
                srdtriggeroption.setAttribute("value", "Piece is Removed");
                srdtriggeroption.innerHTML = "When this piece is removed";
                srdtriggerselect.appendChild(srdtriggeroption);
            }
            // No need for an if here, "no trigger" is always an option
            document.createElement("option");
            srdtriggeroption.setAttribute("value", "None");
            srdtriggeroption.innerHTML = "None";
            srdtriggerselect.appendChild(srdtriggeroption);
            srdtriggerselect.value = form.rule.trigger;
            srdtriggerselect.addEventListener("change", function(){
                form.rule.trigger = this.value;
                form.modifyDIV();
            })
            srdtrigger.appendChild(srdtriggerselect);
            srdiv.appendChild(srdtrigger);
        }
        let srdtype = document.createElement("p");
        srdtype.innerHTML = "Type: ";
        srdtype.appendChild(this.createTypeSelect());
        srdiv.appendChild(srdtype);
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
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Array of Types:";
            scriptingRuleChild(this.rule.newPieceTypes);
            srdarg = document.createElement("p");
            srdarg.innerHTML = "X Coordinate:";
            if (!scriptingRuleChild(this.rule.newPieceX)) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.newPieceX;
                srdarg2.addEventListener("change", function(){
                    let v = Number(this.value);
                    if (Number.isFinite(v)) form.rule.newPieceX = v;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Y Coordinate:";
            if (!scriptingRuleChild(this.rule.newPieceY)) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.newPieceY;
                srdarg2.addEventListener("change", function(){
                    let v = Number(this.value);
                    if (Number.isFinite(v)) form.rule.newPieceY = v;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Player Number of Owner:";
            if (!scriptingRuleChild(this.rule.newPieceOwner)) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.newPieceOwner;
                srdarg2.addEventListener("change", function(){
                    let v = Number(this.value);
                    if (v > 0 && v <= activeGameState.playerAmount && v % 1 == 0) form.rule.newPieceOwner = v;
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
        }
        else if (this.rule.type === "Change Turn Phase") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Turn Phase:";
            if (this.rule.phase === Infinity) {
                srdarg.innerHTML += " End Turn";
                srdiv.appendChild(srdarg);
                srdarg = document.createElement("button");
                srdarg.classList.add("SRFButton");
                srdarg.innerHTML = "Specify Phase";
                srdarg.addEventListener("click", function(){
                    form.rule.phase = new ScriptingRule("None", "Value", 0);
                    form.modifyDIV();
                })
                srdiv.appendChild(srdarg);
            }
            else {
                if (!scriptingRuleChild(this.rule.phase)) {
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
                }
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
        // Change this later, it should have an option to edit the sprite directly rather than use a scripting rule
        else if (this.rule.type === "Change Sprite") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "New Sprite:";
            scriptingRuleChild(this.rule.sprite);
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
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Tile:";
            if (!scriptingRuleChild(this.rule.tileToCheck)) {
                srdarg.innerHTML = "Tile at x"
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
        }
        else if (this.rule.type === "X Coordinate" || this.rule.type === "Y Coordinate" || this.rule.type === "Object Types" || this.rule.type === "Object ID") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Object:";
            if (!scriptingRuleChild(this.rule.object)) {
                srdarg.innerHTML += " Caller";
                srdiv.appendChild(srdarg);
            }
        }
        else if (this.rule.type === "Create a Sprite") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Color:";
            if (!scriptingRuleChild(this.rule.color)) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.color;
                srdarg2.addEventListener("change", function(){
                    form.rule.color = String(this.value);
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Text Color:";
            if (!scriptingRuleChild(this.rule.textColor)) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.textColor;
                srdarg2.addEventListener("change", function(){
                    form.rule.textColor = String(this.value);
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Text:";
            if (!scriptingRuleChild(this.rule.text)) {
                srdarg.innerHTML += " "
                srdarg2 = document.createElement("input");
                srdarg2.value = this.rule.text;
                srdarg2.addEventListener("change", function(){
                    form.rule.text = String(this.value);
                    form.modifyDIV();
                });
                srdarg.appendChild(srdarg2);
                srdiv.appendChild(srdarg);
            }
        }
        else if (this.rule.type === "Choose Piece Type" || this.rule.type === "Choose Tile Type") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Type: ";
            srdarg2 = document.createElement("select");
            let listToCheck = (this.rule.type === "Choose Tile Type" ? tileTypesList : pieceTypesList)
            for (let t = 0; t < listToCheck.length; t++) {
                srdarg3 = document.createElement("option");
                srdarg3.setAttribute("value", t);
                srdarg3.innerHTML = stringifyBGBObject(listToCheck[t]);
                srdarg2.appendChild(srdarg3);
            }
            srdarg2.value = this.rule.index;
            srdarg2.addEventListener("change", function(){
                form.rule.index = this.value;
                form.modifyDIV();
            });
            srdarg.appendChild(srdarg2);
            srdiv.appendChild(srdarg);
        }

        // Control
        else if (this.rule.type === "Edit Variable of Object" || this.rule.type === "Edit Variable of Rule" || this.rule.type === "Edit Global Variable") {
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
            if (this.rule.type === "Edit Variable of Object") {
                srdarg = document.createElement("p");
                srdarg.innerHTML = "Object:";
                if (!scriptingRuleChild(this.rule.object)) {
                    srdarg.innerHTML += " Caller";
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
            }
        }
        else if (this.rule.type === "Return Variable of Object" || this.rule.type === "Return Variable of Rule" || this.rule.type === "Return Global Variable") {
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
            if (this.rule.type === "Edit Variable of Object") {
                srdarg = document.createElement("p");
                srdarg.innerHTML = "Object:";
                if (!scriptingRuleChild(this.rule.object)) {
                    srdarg.innerHTML += " Caller";
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
            }
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
            srdarg = document.createElement("button");
            srdarg.classList.add("SRFButton");
            srdarg.innerHTML = "Add New Entry";
            srdarg.addEventListener("click", function(){
                form.rule.scriptsToRun.push(new ScriptingRule("None", "Value", 0));
                form.modifyDIV();
            })
            srdiv.appendChild(srdarg);
            if (this.rule.scriptsToRun.length > 0) {
                srdarg = document.createElement("button");
                srdarg.classList.add("SRFButton");
                srdarg.innerHTML = "Remove Last Entry";
                srdarg.addEventListener("click", function(){
                    form.rule.scriptsToRun.pop();
                    form.modifyDIV();
                })
                srdiv.appendChild(srdarg);
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
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Left Argument:";
            if (!scriptingRuleChild(this.rule.leftArg)) {
                if (typeof this.rule.leftArg === "number") {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("input");
                    srdarg2.leftArg = this.rule.leftArg;
                    srdarg2.addEventListener("change", function(){
                        let v = Number(this.value);
                        if (Number.isFinite(v)) form.rule.leftArg = v;
                        form.modifyDIV();
                    });
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
                else if (typeof this.rule.leftArg === "boolean") {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("span");
                    srdarg2.classList.add("SRFBooleanBox");
                    srdarg2.innerHTML = this.rule.leftArg;
                    srdarg2.addEventListener("click", function(){
                        form.rule.leftArg = !form.rule.leftArg;
                        form.modifyDIV();
                    })
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
                else {
                    srdarg.innerHTML += " " + stringifyBGBObject(this.rule.leftArg);
                    srdiv.appendChild(srdarg);
                }
                srdarg = document.createElement("button");
                srdarg.classList.add("SRFButton");
                srdarg.innerHTML = "Change Type";
                srdarg.addEventListener("click", function(){
                    if (typeof form.rule.leftArg === "number") {
                        form.rule.leftArg = Boolean(form.rule.leftArg);
                    }
                    else {
                        form.rule.leftArg = Number(form.rule.leftArg);
                    }
                    form.modifyDIV();
                })
                srdiv.appendChild(srdarg);
            }
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Right Argument:";
            if (!scriptingRuleChild(this.rule.rightArg)) {
                if (typeof this.rule.rightArg === "number") {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("input");
                    srdarg2.rightArg = this.rule.rightArg;
                    srdarg2.addEventListener("change", function(){
                        let v = Number(this.value);
                        if (Number.isFinite(v)) form.rule.rightArg = v;
                        form.modifyDIV();
                    });
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
                else if (typeof this.rule.rightArg === "boolean") {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("span");
                    srdarg2.classList.add("SRFBooleanBox");
                    srdarg2.innerHTML = this.rule.rightArg;
                    srdarg2.addEventListener("click", function(){
                        form.rule.rightArg = !form.rule.rightArg;
                        form.modifyDIV();
                    })
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
                else {
                    srdarg.innerHTML += " " + stringifyBGBObject(this.rule.rightArg);
                    srdiv.appendChild(srdarg);
                }
                srdarg = document.createElement("button");
                srdarg.classList.add("SRFButton");
                srdarg.innerHTML = "Change Type";
                srdarg.addEventListener("click", function(){
                    if (typeof form.rule.rightArg === "number") {
                        form.rule.rightArg = Boolean(form.rule.rightArg);
                    }
                    else {
                        form.rule.rightArg = Number(form.rule.rightArg);
                    }
                    form.modifyDIV();
                })
                srdiv.appendChild(srdarg);
            }
        }
        else if (oneArgOperators.indexOf(this.rule.type) != -1) {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Left Argument:";
            if (!scriptingRuleChild(this.rule.argument)) {
                if (typeof this.rule.argument === "number") {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("input");
                    srdarg2.argument = this.rule.argument;
                    srdarg2.addEventListener("change", function(){
                        let v = Number(this.value);
                        if (Number.isFinite(v)) form.rule.argument = v;
                        form.modifyDIV();
                    });
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
                else if (typeof this.rule.argument === "boolean") {
                    srdarg.innerHTML += " "
                    srdarg2 = document.createElement("span");
                    srdarg2.classList.add("SRFBooleanBox");
                    srdarg2.innerHTML = this.rule.argument;
                    srdarg2.addEventListener("click", function(){
                        form.rule.argument = !form.rule.argument;
                        form.modifyDIV();
                    })
                    srdarg.appendChild(srdarg2);
                    srdiv.appendChild(srdarg);
                }
                else {
                    srdarg.innerHTML += " " + stringifyBGBObject(this.rule.argument);
                    srdiv.appendChild(srdarg);
                }
                srdarg = document.createElement("button");
                srdarg.classList.add("SRFButton");
                srdarg.innerHTML = "Change Type";
                srdarg.addEventListener("click", function(){
                    if (typeof form.rule.argument === "number") {
                        form.rule.argument = Boolean(form.rule.argument);
                    }
                    else {
                        form.rule.argument = Number(form.rule.argument);
                    }
                    form.modifyDIV();
                })
                srdiv.appendChild(srdarg);
            }
        }

        // Arrays
        // I'm assuming for now that arrays are always generated via scripting rules.
        // Should probably add a "create new array" rule later.
        else if (this.rule.type === "Create an Array") {
            for (let e = 0; e < this.rule.elements.length; e++) {
                srdarg = document.createElement("p");
                srdarg.innerHTML = "Element #" + (s + 1);
                if (!scriptingRuleChild(this.rule.elements[e])) {
                    if (typeof this.rule.elements[e] === "number") {
                        srdarg.innerHTML += " "
                        srdarg2 = document.createElement("input");
                        srdarg2.elements[e] = this.rule.elements[e];
                        srdarg2.addEventListener("change", function(){
                            let v = Number(this.value);
                            if (Number.isFinite(v)) form.rule.elements[e] = v;
                            form.modifyDIV();
                        });
                        srdarg.appendChild(srdarg2);
                        srdiv.appendChild(srdarg);
                    }
                    else if (typeof this.rule.elements[e] === "boolean") {
                        srdarg.innerHTML += " "
                        srdarg2 = document.createElement("span");
                        srdarg2.classList.add("SRFBooleanBox");
                        srdarg2.innerHTML = this.rule.elements[e];
                        srdarg2.addEventListener("click", function(){
                            form.rule.elements[e] = !form.rule.elements[e];
                            form.modifyDIV();
                        })
                        srdarg.appendChild(srdarg2);
                        srdiv.appendChild(srdarg);
                    }
                    else {
                        srdarg.innerHTML += " " + stringifyBGBObject(this.rule.elements[e]);
                        srdiv.appendChild(srdarg);
                    }
                    srdarg = document.createElement("button");
                    srdarg.classList.add("SRFButton");
                    srdarg.innerHTML = "Change Type";
                    srdarg.addEventListener("click", function(){
                        if (typeof form.rule.elements[e] === "number") {
                            form.rule.elements[e] = Boolean(form.rule.elements[e]);
                        }
                        else {
                            form.rule.elements[e] = Number(form.ruleelements[e]);
                        }
                        form.modifyDIV();
                    })
                    srdiv.appendChild(srdarg);
                }
            }
            srdarg = document.createElement("button");
            srdarg.classList.add("SRFButton");
            srdarg.innerHTML = "Add New Entry";
            srdarg.addEventListener("click", function(){
                form.rule.elements.push(0);
                form.modifyDIV();
            })
            srdiv.appendChild(srdarg);
            if (this.rule.elements.length > 0) {
                srdarg = document.createElement("button");
                srdarg.classList.add("SRFButton");
                srdarg.innerHTML = "Remove Last Entry";
                srdarg.addEventListener("click", function(){
                    form.rule.elements.pop();
                    form.modifyDIV();
                })
                srdiv.appendChild(srdarg);
            }
        }
        else if (this.rule.type == "Array Length" || this.rule.type == "Remove Last Element of Array") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Array:";
            scriptingRuleChild(this.rule.array);
        }
        else if (this.rule.type == "Array Index Of Element" || this.rule.type == "Add to Array") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Array:";
            scriptingRuleChild(this.rule.array);
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Element:";
            scriptingRuleChild(this.rule.element);
        }
        else if (this.rule.type == "Array Element at Index") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Array:";
            scriptingRuleChild(this.rule.array);
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
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Object:";
            scriptingRuleChild(this.rule.otherCaller);
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Script:";
            scriptingRuleChild(this.rule.otherScript);
        }
        else if (this.rule.type == "Console Log") {
            srdarg = document.createElement("p");
            srdarg.innerHTML = "Log the Result of";
            scriptingRuleChild(this.rule.toLog);
        }
    }

    createTypeSelect() {
        let select, group, type;
        select = document.createElement("select");

        group = document.createElement("optgroup");
        group.setAttribute("label", "Values");
        // All these "if (true)'s are here because that "true" is going to be changed into more specific conditions later
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Value");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Argument");
            type.innerHTML = "Trigger Argument";
            group.appendChild(type);
        }
        select.appendChild(group);

        group = document.createElement("optgroup");
        group.setAttribute("label", "Actions");
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Remove Piece");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Move Piece");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Change Piece Owner");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Move Piece to Inventory");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Add Type");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Remove Type");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Add Piece");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Change Turn Phase");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "End Game");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Change Sprite");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        select.appendChild(group);

        group = document.createElement("optgroup");
        group.setAttribute("label", "Reporters");
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "X Coordinate");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Y Coordinate");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Object Types");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Turn Number");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Player Turn");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Turn Phase");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Return Variable of Rule");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Return Variable of Object");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Return Global Variable");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Board Width");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Board Height");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Tile at Coordinates");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Pieces on Tile");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Tile Here");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Object ID");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Caller");
            type.innerHTML = "Owner of this Rule"
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Create a Sprite");
            type.innerHTML = "New Sprite"
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Choose Piece Type");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Choose Tile Type");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        select.appendChild(group);

        group = document.createElement("optgroup");
        group.setAttribute("label", "Control");
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Edit Variable of Rule");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Edit Variable of Object");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Edit Global Variable");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "if-then-else");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Return at End");
            type.innerHTML = "Run Multiple Scripts";
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Repeat While");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "==");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", ">");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "<");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", ">=");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "<=");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "!=");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "&&");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "||");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "XOR");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "+");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "-");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "*");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "/");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "%");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "**");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "!");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "abs");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "sign");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        select.appendChild(group);

        group = document.createElement("optgroup");
        group.setAttribute("label", "Arrays");
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Create an Array");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Array Length");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Remove Last Element of Array");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Array Index of Element");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Add to Array");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Array Element at Index");
            type.innerHTML = type.getAttribute("value");
            group.appendChild(type);
        }
        select.appendChild(group);

        group = document.createElement("optgroup");
        group.setAttribute("label", "Other");
        if (true) {
            type = document.createElement("option");
            type.setAttribute("value", "Other Caller");
            type.innerHTML = "Have Another Object Run a Script"
            group.appendChild(type);
        }
        select.appendChild(group);
        
        select.value = this.rule.type;
        let form = this;
        select.addEventListener("change", function(){
            form.rule.resetScriptingRule(form.rule.trigger, this.value);
            form.modifyDIV();
        })
        return select;
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