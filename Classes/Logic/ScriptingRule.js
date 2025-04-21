let twoArgOperators = ["==", ">", "<", ">=", "<=", "!=", "&&", "||", "XOR", "+", "-", "*", "/", "%", "**", "Random Integer", "Random Decimal", "Concatenate Strings", "Character of String"];
let oneArgOperators = ["!", "abs", "sign"];
let booleanOperators = ["&&", "||", "XOR", "!"];
let stringOperators = ["Concatenate Strings", "Character of String"]

// A single rule for scripting.
class ScriptingRule {
    trigger = "None";
    type = "None";
    variables = []; // Some scripts declare variables. Variables are local to the scripting rule.
    
    constructor(trigger, type, ...args) {
        this.resetScriptingRule(trigger, type, ...args);
    }

    resetScriptingRule(trigger, type, ...args) {
        for (let p in this) if (this.hasOwnProperty(p)) delete this[p];
        this.trigger = trigger;
        this.type = type;
        this.variables = [];
        
        if (this.type === "Value") { // This type is for ScriptingRules that aren't actually rules, just storing a value, so that .run can be run on them and they'll just return that value.
            if (args.length <= 0) args.push(0);
            this.value = args[0];
        }
        else if (this.type === "Argument") { // This type returns one of the arguments given from the rule call, based on the trigger: for example, for a rule triggered by Piece Moves, the arguments are the x direction and y direction of its movement.
            if (args.length <= 0) args.push(0);
            this.index = args[0];
        }

        // Actions
        else if (this.type === "Move Piece" || this.type === "Move Piece to Coordinates") {
            if (args.length <= 0) args.push(new ScriptingRule("None", "Value", 0).clone());
            this.moveX = args[0];
            if (args.length <= 1) args.push(new ScriptingRule("None", "Value", 0).clone());
            this.moveY = args[1];
        }
        else if (this.type === "Change Piece Owner" || this.type === "Move Piece to Inventory") {
            if (args.length <= 0) args.push(new ScriptingRule("None", "Value", 0).clone());
            this.playerID = args[0];
        }
        else if (this.type === "Add Type") {
            if (args.length <= 0) args.push(new ScriptingRule("None", "Array Element at Index", new ScriptingRule("None", "Object Types"), new ScriptingRule("None", "Value", 0).clone()));
            this.typeToEdit = args[0];
            if (args.length <= 1) args.push(new ScriptingRule("None", "Value", -1));
            this.index = args[1];
        }
        else if (this.type === "Remove Type") {
            if (args.length <= 0) args.push(new ScriptingRule("None", "Array Element at Index", new ScriptingRule("None", "Object Types"), new ScriptingRule("None", "Value", 0).clone()));
            this.typeToEdit = args[0];
        }
        else if (this.type === "Add Piece") {
            if (args.length <= 0) args.push(new ScriptingRule("None", "Create an Array"));
            this.newPieceTypes = args[0];
            if (args.length <= 1) args.push(new ScriptingRule("None", "Value", 0).clone());
            this.newPieceX = args[1];
            if (args.length <= 2) args.push(new ScriptingRule("None", "Value", 0).clone());
            this.newPieceY = args[2];
            if (args.length <= 3) args.push(new ScriptingRule("None", "Value", 0).clone());
            this.newPieceOwner = args[3];
            if (args.length <= 4) args.push(new ScriptingRule("None", "Create Piece Sprite"));
            this.newPieceSprite = args[4];
        }
        else if (this.type === "Change Turn Phase") {
            if (args.length <= 0) args.push(Infinity);
            this.phase = args[0];
            if (this.phase === null) this.phase = Infinity;
        }
        else if (this.type === "End Game") {
            if (args.length <= 0) args.push(new ScriptingRule("None", "Value", 0).clone());
            this.winner = args[0];
        }
        else if (this.type === "Change Piece Sprite") {
            if (args.length <= 0) args.push(new ScriptingRule("None", "Create Piece Sprite", "square", "#cccccc", "#000000", "", "#000000"));
            this.newPieceSprite = args[0];
        }
        else if (this.type === "Change Tile Sprite") {
            if (args.length <= 0) args.push(new ScriptingRule("None", "Create Tile Sprite", "#cccccc", "", "#000000"));
            this.newTileSprite = args[0];
        }
        
        
        // Reporters
        else if (this.type === "Tile at Coordinates") {
            if (args.length <= 0) args.push(new ScriptingRule("None", "Value", 0).clone());
            this.XCoordinate = args[0];
            if (args.length <= 1) args.push(new ScriptingRule("None", "Value", 0).clone());
            this.YCoordinate = args[1];
        }
        else if (this.type === "Pieces on Tile") {
            if (args.length <= 0) args.push(new ScriptingRule("None", "Tile at Coordinates"));
            this.tileToCheck = args[0];
        }
        else if (this.type === "X Coordinate" || this.type === "Y Coordinate" || this.type === "Object Types" || this.type === "Object ID" || this.type === "Select Object" || this.type === "Deselect Object") {
            if (args.length <= 0) args.push(undefined);
            this.object = args[0];
        }
        else if (this.type === "Create Piece Sprite") {
            this.shape = args[0] ?? "square";
            this.fillColor = args[1] ?? "#cccccc";
            this.strokeColor = args[2] ?? "#000000";
            this.text = args[3] ?? "";
            this.textColor = args[4] ?? "#000000";
        }
        else if (this.type === "Create Tile Sprite") {
            this.fillColor = args[0] ?? "#cccccc";
            this.text = args[1] ?? "";
            this.textColor = args[2] ?? "#000000";
        }
        
        else if (this.type === "Choose Piece Type" || this.type === "Choose Tile Type") {
            if (args.length <= 0) args.push(0);
            this.index = args[0];
        }

        // Control
        else if (this.type === "Edit Variable of Object" || this.type === "Edit Variable of Rule" || this.type === "Edit Global Variable") { // Adds the variable to this rule if it's not already there, changes its value if it's already there
            if (args.length <= 0) args.push("Placeholder");
            this.variableName = args[0];
            if (args.length <= 1) args.push(new ScriptingRule("None", "Value", 0).clone());
            this.variableValue = args[1];
            if (args.length <= 2) args.push(undefined);
            if (this.type === "Edit Variable of Object") this.object = args[2];
        }
        else if (this.type === "Return Variable of Object" || this.type === "Return Variable of Rule" || this.type === "Return Global Variable") {
            if (args.length <= 0) args.push("Placeholder");
            this.variableName = args[0];
            if (args.length <= 1) args.push(undefined);
            if (this.type === "Return Variable of Object") this.object = args[1];
        }
        else if (this.type === "if-then-else") {
            if (args.length <= 0) args.push(new ScriptingRule("None", "Value", true));
            this.if = args[0];
            if (args.length <= 1) args.push(new ScriptingRule("None", "Value", true));
            this.then = args[1];
            if (args.length <= 2) args.push(new ScriptingRule("None", "Value", true));
            this.else = args[2];
        }
        else if (this.type === "Return at End") {
            this.scriptsToRun = args;
        }
        else if (this.type == "Repeat While") {
            if (args.length <= 0) args.push(new ScriptingRule("None", "Value", false));
            this.repeatCheck = args[0];
            if (args.length <= 1) args.push(new ScriptingRule("None", "Value", false));
            this.repeatScript = args[1];
        }
        else if (twoArgOperators.indexOf(type) != -1) {
            let typeDefault;
            if (booleanOperators.indexOf(type) != -1) typeDefault = new ScriptingRule("None", "Value", true);
            else if (stringOperators.indexOf(type) != -1) typeDefault = new ScriptingRule("None", "Value", "");
            else typeDefault = new ScriptingRule("None", "Value", 0).clone();
            if (args.length <= 0) args.push(typeDefault);
            this.leftArg = args[0];
            if (args.length <= 1) args.push((type === "Character of String") ? new ScriptingRule("None", "Value", 0).clone() : typeDefault);
            this.rightArg = args[1];
        }
        else if (oneArgOperators.indexOf(type) != -1) {
            if (args.length <= 0) args.push(new ScriptingRule("None", "Value", 0).clone());
            this.argument = args[0];
        }

        // Arrays
        else if (this.type === "Create an Array") {
            this.elements = args;
        }
        else if (this.type == "Array Length" || this.type == "Remove Last Element of Array") {
            if (args.length <= 0) args.push(new ScriptingRule("None", "Create an Array"));
            this.array = args[0];
        }
        else if (this.type == "Array Index of Element" || this.type == "Add to Array") {
            if (args.length <= 0) args.push(new ScriptingRule("None", "Create an Array"));
            this.array = args[0];
            if (args.length <= 1) args.push(new ScriptingRule("None", "Value", 0).clone());
            this.element = args[1];
        }
        else if (this.type == "Array Element at Index") {
            if (args.length <= 0) args.push(new ScriptingRule("None", "Create an Array"));
            this.array = args[0];
            if (args.length <= 1) args.push(new ScriptingRule("None", "Value", 0).clone());
            this.index = args[1];
        }
        else if (this.type == "Slice of String" || this.type == "Slice of Array") {
            if (args.length <= 0) args.push(this.type == "Slice of String" ? new ScriptingRule("None", "Value", "") : new ScriptingRule("None", "Create an Array"));
            this.outer = args[0];
            if (args.length <= 1) args.push(new ScriptingRule("None", "Value", 0).clone());
            this.leftIndex = args[1];
            if (args.length <= 2) args.push(new ScriptingRule("None", "Value", 0).clone());
            this.rightIndex = args[1];
        }

        else if (this.type == "Other Caller") {
            if (args.length <= 0) args.push(new ScriptingRule("None", "Caller"));
            this.otherCaller = args[0];
            if (args.length <= 1) args.push(new ScriptingRule("None", "Value", 0).clone());
            this.otherScript = args[1];
        }
        else if (this.type == "Console Log") {
            if (args.length <= 0) args.push(new ScriptingRule("None", "Value", 0).clone());
            this.toLog = args[0];
        }
    }

    run(caller, ...args) {

        console.log(this.getConstructorArguments(), caller, args);

        if (this.type === "Value") {
            return this.value;
        }
        if (this.type === "Argument") {
            return args[this.index];
        }

        // Actions
        else if (this.type === "Remove Piece") {
            if (caller instanceof Piece) {
                return caller.removePiece(false);
            }
        }
        else if (this.type === "Move Piece") {
            if (caller instanceof Piece) {
                let moveX = (this.moveX instanceof ScriptingRule) ? this.moveX.portVariables(this).run(caller, ...args) : this.moveX;
                let moveY = (this.moveY instanceof ScriptingRule) ? this.moveY.portVariables(this).run(caller, ...args) : this.moveY;
                return caller.movePiece(moveX, moveY, false);
            }
        }
        else if (this.type === "Move Piece to Coordinates") {
            if (caller instanceof Piece) {
                let moveX = (this.moveX instanceof ScriptingRule) ? this.moveX.portVariables(this).run(caller, ...args) : this.moveX;
                let moveY = (this.moveY instanceof ScriptingRule) ? this.moveY.portVariables(this).run(caller, ...args) : this.moveY;
                return caller.movePiece(moveX - caller.xCoordinate, moveY - caller.yCoordinate, false);
            }
        }
        else if (this.type === "Change Piece Owner") {
            if (caller instanceof Piece) {
                let playerID = (this.playerID instanceof ScriptingRule) ? this.playerID.portVariables(this).run(caller, ...args) : this.playerID;
                return caller.changeOwner(playerID, false);
            }
        }
        else if (this.type === "Move Piece to Inventory") {
            if (caller instanceof Piece) {
                // To be implemented later
            }
        }
        else if (this.type === "Add Type") { // Adds the new type to the piece or tile only if it doesn't already have that type
            let typeToEdit = (this.typeToEdit instanceof ScriptingRule) ? this.typeToEdit.portVariables(this).run(caller, ...args) : this.typeToEdit;
            let typesList = caller.types;
            if (typesList === undefined) return; // Throw error?
            for (let t = 0; t < typesList.length; t++) {
                if (typesList[t].typeID === typeToEdit.typeID) return false;
            }
            let index = (this.index instanceof ScriptingRule) ? this.index.portVariables(this).run(caller, ...args) : this.index;
            if (index === undefined) caller.types.push(typeToEdit.typeID);
            else caller.types.splice(index, 0, typeToEdit.typeID);
            return true;
        }
        else if (this.type === "Remove Type") { // A piece or tile shouldn't have multiple copies of the same type, but I'm handling that possibility just in case.
            let typeToEdit = (this.typeToEdit instanceof ScriptingRule) ? this.typeToEdit.portVariables(this).run(caller, ...args) : this.typeToEdit;
            let typesList = caller.types;
            if (typesList === undefined) return; // Throw error?
            for (let t = 0; t < typesList.length; t++) {
                if (typesList[t].typeID === typeToEdit.typeID) {
                    caller.types.splice(t, 1);
                    t--;
                }
            }
            return true;
        }
        else if (this.type === "Add Piece") {
            let newPieceTypes = (this.newPieceTypes instanceof ScriptingRule) ? this.newPieceTypes.portVariables(this).run(caller, ...args) : this.newPieceTypes;
            newPieceTypes = newPieceTypes.map(t => t.typeID);
            let newPieceX = (this.newPieceX instanceof ScriptingRule) ? this.newPieceX.portVariables(this).run(caller, ...args) : this.newPieceX;
            let newPieceY = (this.newPieceY instanceof ScriptingRule) ? this.newPieceY.portVariables(this).run(caller, ...args) : this.newPieceY;
            let newPieceOwner = (this.newPieceOwner instanceof ScriptingRule) ? this.newPieceOwner.portVariables(this).run(caller, ...args) : this.newPieceOwner;
            let newPieceSprite = (this.newPieceSprite instanceof ScriptingRule) ? this.newPieceSprite.portVariables(this).run(caller, ...args) : this.newPieceSprite;
            activeGameState.pieceArray.push(new Piece(newPieceTypes, newPieceX, newPieceY, newPieceOwner, newPieceSprite));
            return true;
        }
        else if (this.type === "Change Turn Phase") {
            // Finite phases keep the turn going. A non-finite phase ends the turn.
            let phase = (this.phase instanceof ScriptingRule) ? this.phase.portVariables(this).run(caller, ...args) : this.phase;
            activeGameState.turnPhase = phase;
            return true;
        }
        else if (this.type === "End Game") {
            let winner = (this.winner instanceof ScriptingRule) ? this.winner.portVariables(this).run(caller, ...args) : this.winner;
            endGame(winner);
            return true;
        }
        else if (this.type === "Change Piece Sprite") {
            let sprite = (this.newPieceSprite instanceof ScriptingRule) ? this.newPieceSprite.portVariables(this).run(caller, ...args) : this.newPieceSprite;
            if (caller instanceof Piece) {
                caller.sprite = sprite;
            }
        }
        else if (this.type === "Change Tile Sprite") {
            let sprite = (this.newTileSprite instanceof ScriptingRule) ? this.newTileSprite.portVariables(this).run(caller, ...args) : this.newTileSprite;
            if (caller instanceof Tile) {
                caller.sprite = sprite;
            }
        }
        
        else if (this.type === "Select Object") {
            let object = caller;
            if (this.object !== undefined) object = (this.object instanceof ScriptingRule) ? this.object.portVariables(this).run(caller, ...args) : this.object;
            if (BGBIndexOf(activeGameState.selectedObjects, object) === -1) activeGameState.selectedObjects.push(object);
            return true;
        }
        else if (this.type === "Deselect Object") {
            let object = caller;
            if (this.object !== undefined) object = (this.object instanceof ScriptingRule) ? this.object.portVariables(this).run(caller, ...args) : this.object;
            if (BGBIndexOf(activeGameState.selectedObjects, object) != -1) activeGameState.selectedObjects.splice(BGBIndexOf(activeGameState.selectedObjects, object), 1);
            return true;
        }
        else if (this.type === "Clear Selected Objects") {
            activeGameState.selectedObjects = [];
            return true;
        }
        // else if (this.type === "Valid Game State") {
        //     gameStateValid();
        // }
        // else if (this.type === "Revert Game State") {
        //     gameStateRevert();
        // }

        // Reporters
        else if (this.type === "X Coordinate") {
            let object = caller;
            if (this.object !== undefined) object = (this.object instanceof ScriptingRule) ? this.object.portVariables(this).run(caller, ...args) : this.object;
            return object.xCoordinate;
        }
        else if (this.type === "Y Coordinate") {
            let object = caller;
            if (this.object !== undefined) object = (this.object instanceof ScriptingRule) ? this.object.portVariables(this).run(caller, ...args) : this.object;
            return object.yCoordinate;
        }
        else if (this.type === "Object Types") {
            let object = caller;
            if (this.object !== undefined) object = (this.object instanceof ScriptingRule) ? this.object.portVariables(this).run(caller, ...args) : this.object;
            return object.getTypeObjects();
        }
        else if (this.type === "Turn Number") {
            return activeGameState.turnNumber;
        }
        else if (this.type === "Player Turn") {
            return activeGameState.playerTurn;
        }
        else if (this.type === "Turn Phase") {
            return activeGameState.turnPhase;
        }
        else if (this.type === "Return Variable of Rule") {
            let variableName = (this.variableName instanceof ScriptingRule) ? this.variableName.portVariables(this).run(caller, ...args) : this.variableName;
            let index = this.variables.map(x => x[0]).indexOf(variableName);
            if (index === -1) {
                return undefined;
            }
            else {
                return this.variables[index][1];
            }
        }
        else if (this.type === "Return Variable of Object") {
            let variableName = (this.variableName instanceof ScriptingRule) ? this.variableName.portVariables(this).run(caller, ...args) : this.variableName;
            let object = caller;
            if (this.object !== undefined) object = (this.object instanceof ScriptingRule) ? this.object.portVariables(this).run(caller, ...args) : this.object;
            let index = object.publicVars.map(x => x[0]).indexOf(variableName);
            if (index === -1) {
                return undefined;
            }
            else {
                return object.publicVars[index][1];
            }
        }
        else if (this.type === "Return Global Variable") {
            let variableName = (this.variableName instanceof ScriptingRule) ? this.variableName.portVariables(this).run(caller, ...args) : this.variableName;
            let index = otherGlobalVariables.map(x => x[0]).indexOf(variableName);
            if (index === -1) {
                return undefined;
            }
            else {
                return otherGlobalVariables[index][1];
            }
        }
        else if (this.type === "Board Width") {
            return activeGameState.board.width;
        }
        else if (this.type === "Board Height") {
            return activeGameState.board.height;
        }
        else if (this.type === "Tile at Coordinates") {
            let XCoordinate = (this.XCoordinate instanceof ScriptingRule) ? this.XCoordinate.portVariables(this).run(caller, ...args) : this.XCoordinate;
            let YCoordinate = (this.YCoordinate instanceof ScriptingRule) ? this.YCoordinate.portVariables(this).run(caller, ...args) : this.YCoordinate;
            return activeGameState.board.getTile(XCoordinate, YCoordinate);
        }
        else if (this.type === "Pieces on Tile") {
            let tileToCheck = (this.tileToCheck instanceof ScriptingRule) ? this.tileToCheck.portVariables(this).run(caller, ...args) : this.tileToCheck;
            let pieces = tileToCheck.getPieces();
            if (caller instanceof Piece) {
            // If the caller is a piece, that piece always comes first in this list
                for (let p = 0; p < pieces.length; p++) {
                    if (pieces[p].objectID === caller.objectID) {
                        pieces.splice(p, 1);
                        pieces.unshift(caller);
                    }
                }
            }
            return pieces;
        }
        else if (this.type === "Tile Here") {
            if (caller instanceof Piece) {
                return caller.getTile();
            }
            else if (caller instanceof Tile) {
                return caller;
            }
            return false; // throw error?
        }
        else if (this.type === "All Pieces") {
            let pieces = Array(...activeGameState.pieceArray);
            if (caller instanceof Piece) {
                // If the caller is a piece, that piece always comes first in this list
                    for (let p = 0; p < pieces.length; p++) {
                        if (pieces[p].objectID === caller.objectID) {
                            pieces.splice(p, 1);
                            pieces.unshift(caller);
                        }
                    }
                }
            return pieces;
        }
        else if (this.type === "All Tiles") {
            return Array(activeGameState.board.tileArray);
        }
        else if (this.type === "Object ID") {
            let object = caller;
            if (this.object !== undefined) object = (this.object instanceof ScriptingRule) ? this.object.portVariables(this).run(caller, ...args) : this.object;
            return object.objectID;
        }
        else if (this.type === "Caller") {
            return caller;
        }
        else if (this.type === "Create Piece Sprite") {
            return {
                shape: (this.shape instanceof ScriptingRule) ? this.shape.portVariables(this).run(caller, ...args) : this.shape,
                fillColor: (this.fillColor instanceof ScriptingRule) ? this.fillColor.portVariables(this).run(caller, ...args) : this.fillColor,
                strokeColor: (this.strokeColor instanceof ScriptingRule) ? this.strokeColor.portVariables(this).run(caller, ...args) : this.strokeColor,
                text: (this.text instanceof ScriptingRule) ? this.text.portVariables(this).run(caller, ...args) : this.text,
                textColor: (this.textColor instanceof ScriptingRule) ? this.textColor.portVariables(this).run(caller, ...args) : this.textColor,
            };
        }
        else if (this.type === "Create Tile Sprite") {
            return {
                fillColor: (this.fillColor instanceof ScriptingRule) ? this.fillColor.portVariables(this).run(caller, ...args) : this.fillColor,
                text: (this.text instanceof ScriptingRule) ? this.text.portVariables(this).run(caller, ...args) : this.text,
                textColor: (this.textColor instanceof ScriptingRule) ? this.textColor.portVariables(this).run(caller, ...args) : this.textColor,
            };
        }
        
        else if (this.type === "Choose Piece Type") {
            return pieceTypesList[this.index];
        }
        else if (this.type === "Choose Tile Type") {
            return tileTypesList[this.index];
        }
        else if (this.type === "Selected Objects") {
            return activeGameState.selectedObjects;
        }

        // Control
        else if (this.type === "Edit Variable of Rule") {
            let variableName = (this.variableName instanceof ScriptingRule) ? this.variableName.portVariables(this).run(caller, ...args) : this.variableName;
            let variableValue = (this.variableValue instanceof ScriptingRule) ? this.variableValue.portVariables(this).run(caller, ...args) : this.variableValue;
            let index = this.variables.map(x => x[0]).indexOf(variableName);
            if (index === -1) {
                this.variables.push([variableName, variableValue]);
            }
            else {
                this.variables[index][1] = variableValue;
            }
        }
        else if (this.type === "Edit Variable of Object") { // Player variables, such as score, haven't been implemented yet, but this will probably be used for them too
            let variableName = (this.variableName instanceof ScriptingRule) ? this.variableName.portVariables(this).run(caller, ...args) : this.variableName;
            let variableValue = (this.variableValue instanceof ScriptingRule) ? this.variableValue.portVariables(this).run(caller, ...args) : this.variableValue;
            let object = caller;
            if (this.object !== undefined) object = (this.object instanceof ScriptingRule) ? this.object.portVariables(this).run(caller, ...args) : this.object;
            let index = object.publicVars.map(x => x[0]).indexOf(variableName);
            if (index === -1) {
                object.publicVars.push([variableName, variableValue]);
            }
            else {
                object.publicVars[index][1] = variableValue;
            }
        }
        else if (this.type === "Edit Global Variable") {
            let variableName = (this.variableName instanceof ScriptingRule) ? this.variableName.portVariables(this).run(caller, ...args) : this.variableName;
            let variableValue = (this.variableValue instanceof ScriptingRule) ? this.variableValue.portVariables(this).run(caller, ...args) : this.variableValue;
            let index = otherGlobalVariables.map(x => x[0]).indexOf(variableName);
            if (index === -1) {
                otherGlobalVariables.push([variableName, variableValue]);
            }
            else {
                otherGlobalVariables[index][1] = variableValue;
            }
        }
        else if (this.type === "if-then-else") {
            if (this.if.portVariables(this).run(caller, ...args) === true) {
                let result = this.then.portVariables(this).run(caller, ...args);
                return result;
            }
            else {
                return this.else.portVariables(this).run(caller, ...args);
            }
        }
        else if (this.type === "Return at End") { // Runs multiple ScriptingRules in a row, returns the result of the last one
            let result;
            for (let s = 0; s < this.scriptsToRun.length; s++) {
                result = this.scriptsToRun[s].portVariables(this).run(caller, ...args);
            }
            return result;
        }
        else if (this.type === "Repeat While") {
            while (this.repeatCheck.portVariables(this).run(caller, ...args) === true) {
                this.repeatScript.portVariables(this).run(caller, ...args);
            }
        }
        else if (twoArgOperators.indexOf(this.type) != -1) {
            let leftArg = (this.leftArg instanceof ScriptingRule) ? this.leftArg.portVariables(this).run(caller, ...args) : this.leftArg;
            //shortcut evaluation
            if (this.type === "&&" && leftArg == false) return false;
            if (this.type === "||" && leftArg == true) return true;
            let rightArg = (this.rightArg instanceof ScriptingRule) ? this.rightArg.portVariables(this).run(caller, ...args) : this.rightArg;
            switch (this.type) {
                case "==":
                    return BGBEquals(leftArg, rightArg);
                case ">":
                    return (leftArg > rightArg);
                case "<":
                    return (leftArg < rightArg);
                case ">=":
                    return (leftArg >= rightArg);
                case "<=":
                    return (leftArg <= rightArg);
                case "!=":
                    return !BGBEquals(leftArg, rightArg);
                case "&&":
                    return (leftArg && rightArg);
                case "||":
                    return (leftArg || rightArg);
                case "XOR":
                    return (Boolean(leftArg) != Boolean(rightArg))
                case "+":
                case "Concatenate Strings":
                    return (leftArg + rightArg);
                case "-":
                    return (leftArg - rightArg);
                case "*":
                    return (leftArg * rightArg);
                case "/":
                    return (leftArg / rightArg);
                case "%": // Might change this one later to use floored modulo instead of JS modulo
                    return (leftArg % rightArg);
                case "**":
                    return (leftArg ** rightArg);
                case "Random Integer":
                    return Math.floor(Math.random() * (rightArg - leftArg + 1) + leftArg);
                case "Random Decimal":
                    return Math.random() * (rightArg - leftArg) + leftArg;
                case "Character of String":
                    return leftArg.at(rightArg);
            }
        }
        else if (oneArgOperators.indexOf(this.type) != -1) {
            let argument = (this.argument instanceof ScriptingRule) ? this.argument.portVariables(this).run(caller, ...args) : this.argument;
            switch (this.type) {
                case "!":
                    return !argument;
                case "abs":
                    return Math.abs(argument);
                case "sign":
                    return Math.sign(argument);
            }
        }

        // Arrays
        else if (this.type === "Create an Array") {
            let arr = [];
            for (let e = 0; e < this.elements.length; e++) {
                arr.push((this.elements[e] instanceof ScriptingRule) ? this.elements[e].portVariables(this).run(caller, ...args) : this.elements[e]);
            }
            return arr;
        }
        else if (this.type === "Array Length") {
            let array = (this.array instanceof ScriptingRule) ? this.array.portVariables(this).run(caller, ...args) : this.array;
            return array.length;
        }
        else if (this.type === "Remove Last Element of Array") {
            let array = (this.array instanceof ScriptingRule) ? this.array.portVariables(this).run(caller, ...args) : this.array;
            array.pop();
            return array;
        }
        else if (this.type === "Array Index of Element") {
            let array = (this.array instanceof ScriptingRule) ? this.array.portVariables(this).run(caller, ...args) : this.array;
            let element = (this.element instanceof ScriptingRule) ? this.element.portVariables(this).run(caller, ...args) : this.element;
            return BGBIndexOf(array, element);
        }
        else if (this.type === "Add to Array") {
            let array = (this.array instanceof ScriptingRule) ? this.array.portVariables(this).run(caller, ...args) : this.array;
            let element = (this.element instanceof ScriptingRule) ? this.element.portVariables(this).run(caller, ...args) : this.element;
            array.push(element);
            return array;
        }
        else if (this.type === "Array Element at Index") {
            let array = (this.array instanceof ScriptingRule) ? this.array.portVariables(this).run(caller, ...args) : this.array;
            let index = (this.index instanceof ScriptingRule) ? this.index.portVariables(this).run(caller, ...args) : this.index;
            return array.at(index);
        }
        else if (this.type === "Slice of String" || this.type === "Slice of Array") {
            let outer = (this.outer instanceof ScriptingRule) ? this.outer.portVariables(this).run(caller, ...args) : this.outer;
            let leftIndex = (this.leftIndex instanceof ScriptingRule) ? this.leftIndex.portVariables(this).run(caller, ...args) : this.leftIndex;
            let rightIndex = (this.rightIndex instanceof ScriptingRule) ? this.rightIndex.portVariables(this).run(caller, ...args) : this.rightIndex;
            return outer.slice(leftIndex, rightIndex + 1);
        }

        else if (this.type === "Other Caller") {
            let otherCaller = (this.otherCaller instanceof ScriptingRule) ? this.otherCaller.portVariables(this).run(caller, ...args) : this.otherCaller;
            return this.otherScript.portVariables(this).run(otherCaller, ...args);
        }
        else if (this.type === "Console Log") {
            let toLog = (this.toLog instanceof ScriptingRule) ? this.toLog.portVariables(this).run(caller, ...args) : this.toLog;
            console.log(toLog);
            return toLog;
        }
    }

    /*
    List of triggers implemented:
    "None": The rule is only called when some other scripting rule calls it.
    "Piece Moves": Triggers when that piece moves. Arguments are the x-direction change and the y-direction change.
    "Piece Lands on Tile": Triggers when that piece lands on any tile. Argument is the tile it landed on.
    "Tile is Landed on": Triggers when that tile is landed on by a piece. Argument is the piece that landed on it.
    "Piece is Removed": Triggers when that piece is removed. No arguments.
    "End Turn": Triggers at the end of a turn. No arguments.
    "Start Turn": Triggers at the start of a turn. No arguments.
    "Object Clicked": Triggers when this object is clicked. No arguments.
    */

    // Gives this rule the same variables array as the other rule.
    portVariables(otherRule) {
        this.variables = otherRule.variables.map(
            ([name, value]) => [name, value instanceof ScriptingRule ? value.clone() : value]
        );
        return this;
    }
    

    // This is used for cloning.
    getConstructorArguments() {
        const cloneArg = (arg) => {
            if (arg instanceof ScriptingRule) return arg.clone();
            if (Array.isArray(arg)) return arg.map(cloneArg);
            return arg;
        };
    
        let args = [this.trigger, this.type];
    
        // Value & Argument types
        if (this.type === "Value") {
            args.push(cloneArg(this.value));
        } else if (this.type === "Argument") {
            args.push(cloneArg(this.index));
        }
    
        // Actions
        else if (this.type === "Move Piece" || this.type === "Move Piece to Coordinates") {
            args.push(cloneArg(this.moveX), cloneArg(this.moveY));
        } else if (this.type === "Change Piece Owner" || this.type === "Move Piece to Inventory") {
            args.push(cloneArg(this.playerID));
        } else if (this.type === "Add Type") {
            args.push(cloneArg(this.typeToEdit), cloneArg(this.index));
        } else if (this.type === "Remove Type") {
            args.push(cloneArg(this.typeToEdit));
        } else if (this.type === "Add Piece") {
            args.push(
                cloneArg(this.newPieceTypes),
                cloneArg(this.newPieceX),
                cloneArg(this.newPieceY),
                cloneArg(this.newPieceOwner),
                cloneArg(this.newPieceSprite)
            );
        } else if (this.type === "Change Turn Phase") {
            args.push(cloneArg(this.phase));
        } else if (this.type === "End Game") {
            args.push(cloneArg(this.winner));
        } else if (this.type === "Change Piece Sprite") {
            args.push(cloneArg(this.newPieceSprite));
        } else if (this.type === "Change Tile Sprite") {
            args.push(cloneArg(this.newTileSprite));
        }
    
        // Reporters
        else if (this.type === "Tile at Coordinates") {
            args.push(cloneArg(this.XCoordinate), cloneArg(this.YCoordinate));
        } else if (this.type === "Pieces on Tile") {
            args.push(cloneArg(this.tileToCheck));
        } else if (["X Coordinate", "Y Coordinate", "Object Types", "Object ID", "Select Object", "Deselect Object"].includes(this.type)) {
            args.push(cloneArg(this.object));
        } else if (this.type === "Create Piece Sprite") {
            args.push(
                cloneArg(this.shape),
                cloneArg(this.fillColor),
                cloneArg(this.strokeColor),
                cloneArg(this.text),
                cloneArg(this.textColor)
            );
        } else if (this.type === "Create Tile Sprite") {
            args.push(
                cloneArg(this.fillColor),
                cloneArg(this.text),
                cloneArg(this.textColor)
            );
        } else if (this.type === "Choose Piece Type" || this.type === "Choose Tile Type") {
            args.push(cloneArg(this.index));
        }
    
        // Control
        else if (["Edit Variable of Object", "Edit Variable of Rule", "Edit Global Variable"].includes(this.type)) {
            args.push(cloneArg(this.variableName), cloneArg(this.variableValue));
            if (this.type === "Edit Variable of Object") {
                args.push(cloneArg(this.object));
            }
        } else if (["Return Variable of Object", "Return Variable of Rule", "Return Global Variable"].includes(this.type)) {
            args.push(cloneArg(this.variableName));
            if (this.type === "Return Variable of Object") {
                args.push(cloneArg(this.object));
            }
        } else if (this.type === "if-then-else") {
            args.push(cloneArg(this.if), cloneArg(this.then), cloneArg(this.else));
        } else if (this.type === "Return at End") {
            args = args.concat(cloneArg(this.scriptsToRun));
        } else if (this.type === "Repeat While") {
            args.push(cloneArg(this.repeatCheck), cloneArg(this.repeatScript));
        }
    
        // Operators
        else if (twoArgOperators.includes(this.type)) {
            args.push(cloneArg(this.leftArg), cloneArg(this.rightArg));
        } else if (oneArgOperators.includes(this.type)) {
            args.push(cloneArg(this.argument));
        }
    
        // Arrays
        else if (this.type === "Create an Array") {
            args = args.concat(cloneArg(this.elements));
        } else if (["Array Length", "Remove Last Element of Array"].includes(this.type)) {
            args.push(cloneArg(this.array));
        } else if (["Array Index of Element", "Add to Array"].includes(this.type)) {
            args.push(cloneArg(this.array), cloneArg(this.element));
        } else if (this.type === "Array Element at Index") {
            args.push(cloneArg(this.array), cloneArg(this.index));
        } else if (this.type === "Slice of String" || this.type === "Slice of Array") {
            args.push(cloneArg(this.outer), cloneArg(this.leftIndex), cloneArg(this.rightIndex));
        }
    
        // Misc
        else if (this.type === "Other Caller") {
            args.push(cloneArg(this.otherCaller), cloneArg(this.otherScript));
        } else if (this.type === "Console Log") {
            args.push(cloneArg(this.toLog));
        }
    
        return args;
    }
        saveCode() {
        const serialize = (value) => {
            if (value instanceof ScriptingRule) return value.saveCode();
            if (Array.isArray(value)) return value.map(serialize);
            return value;
        };
    
        return {
            trigger: this.trigger,
            type: this.type,
            args: this.getConstructorArguments().slice(2).map(serialize),
            variables: this.variables.map(([name, value]) => [name, value instanceof ScriptingRule ? value.saveCode() : value])
        };
    }
    clone(){
        let saveCode = this.saveCode();
        let newScriptingRule = ScriptingRule.loadCode(saveCode)
        return newScriptingRule
    }
    static loadCode(data) {
        const deserialize = (val) => {
            if (val && typeof val === 'object' && val.type && Array.isArray(val.args)) {
                return ScriptingRule.loadCode(val);
            } else if (Array.isArray(val)) {
                return val.map(deserialize);
            }
            return val;
        };
    
        const args = Array.isArray(data.args) ? data.args.map(deserialize) : [];
        const rule = new ScriptingRule(data.trigger, data.type, ...args);
        rule.variables = Array.isArray(data.variables)
    ? data.variables.map(([name, value]) => [name, value instanceof ScriptingRule ? value.clone() : value])
    : [];

        return rule;
    }
    

}
