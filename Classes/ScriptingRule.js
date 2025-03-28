let twoArgOperators = ["==", ">", "<", ">=", "<=", "!=", "&&", "||", "XOR", "+", "-", "*", "/", "%", "**"];
let oneArgOperators = ["!", "abs", "sign"];

// A single rule for scripting.
class ScriptingRule {
    trigger = "None";
    type = "None";
    variables = []; // Some scripts declare variables. Variables are local to the scripting rule.
    constructorArgs; // This is needed for cloning
    
    constructor(trigger, type, ...args) {
        this.trigger = trigger;
        this.type = type;
        this.variables = [];
        this.constructorArgs = Array.from(arguments);
        
        if (this.type === "Value") { // This type is for ScriptingRules that aren't actually rules, just storing a value, so that .run can be run on them and they'll just return that value.
            this.value = args[0];
        }
        else if (this.type === "Argument") { // This type returns one of the arguments given from the rule call: for example
            this.index = args[0];
        }

        // Actions
        else if (this.type === "Move Piece") {
            this.moveX = args[0];
            this.moveY = args[1];
        }
        else if (this.type === "Change Piece Owner" || this.type === "Move Piece to Inventory") {
            this.playerID = args[0];
        }
        else if (this.type === "Add Type") {
            this.typeToEdit = args[0];
            this.index = args[1];
        }
        else if (this.type === "Remove Type") {
            this.typeToEdit = args[0];
        }
        else if (this.type === "Add Piece") {
            this.newPieceTypes = args[0];
            this.newPieceX = args[1];
            this.newPieceY = args[2];
            this.newPieceOwner = args[3];
        }
        else if (this.type === "Change Turn Phase") {
            this.phase = args[0];
        }
        else if (this.type === "End Game") {
            this.winner = args[0];
        }
        else if (this.type === "Change Sprite") {
            this.newSprite = args[0];
        }
        
        // Reporters
        else if (this.type === "Tile at Coordinates") {
            this.XCoordinate = args[0];
            this.YCoordinate = args[1];
        }
        else if (this.type === "Pieces on Tile") {
            this.tileToCheck = args[0];
        }
        else if (this.type === "X Coordinate" || this.type === "Y Coordinate" || this.type === "Object Types" || this.type === "Object ID") {
            this.object = args[0];
        }

        // Control
        else if (this.type === "Edit Variable of Object" || this.type === "Edit Variable of Rule") { // Adds the variable to this rule if it's not already there, changes its value if it's already there
            this.variableName = args[0];
            this.variableValue = args[1];
            if (this.type === "Edit Variable of Object") this.object = args[2];
        }
        else if (this.type === "Return Variable of Object" || this.type === "Return Variable of Rule") {
            this.variableName = args[0];
            if (this.type === "Return Variable of Object") this.object = args[1];
        }
        else if (this.type === "if-then-else") {
            this.if = args[0];
            this.then = args[1];
            this.else = args[2];
        }
        else if (this.type === "Return at End") {
            this.scriptsToRun = args;
        }
        else if (type == "Repeat While") {
            this.repeatCheck = args[0];
            this.repeatScript = args[1];
        }
        else if (twoArgOperators.indexOf(type) != -1) {
            this.leftArg = args[0];
            this.rightArg = args[1];
        }
        else if (oneArgOperators.indexOf(type) != -1) {
            this.argument = args[0];
        }
        else if (type == "Array Length" || type == "Remove Last Element of Array") {
            this.array = args[0];
        }
        else if (type == "Array Index Of Element" || type == "Add to Array") {
            this.array = args[0];
            this.element = args[1];
        }
        else if (type == "Array Element at Index") {
            this.array = args[0];
            this.index = args[1];
        }

        else if (type == "Other Caller") {
            this.otherCaller = args[0];
            this.otherScript = args[1];
        }
        else if (type == "Console Log") {
            this.toLog = args[0];
        }
    }

    run(caller, ...args) {
        console.log(this.constructorArgs, caller, args);

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
            if (index === undefined) caller.types.push(typeToEdit);
            else caller.types.splice(index, 0, typeToEdit);
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
            let newPieceX = (this.newPieceX instanceof ScriptingRule) ? this.newPieceX.portVariables(this).run(caller, ...args) : this.newPieceX;
            let newPieceY = (this.newPieceY instanceof ScriptingRule) ? this.newPieceY.portVariables(this).run(caller, ...args) : this.newPieceY;
            let newPieceOwner = (this.newPieceOwner instanceof ScriptingRule) ? this.newPieceOwner.portVariables(this).run(caller, ...args) : this.newPieceOwner;
            activeGameState.pieceArray.push(new Piece(newPieceTypes, newPieceX, newPieceY, newPieceOwner));
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
        else if (this.type === "Change Sprite") {
            let newSprite = (this.newSprite instanceof ScriptingRule) ? this.newSprite.portVariables(this).run(caller, ...args) : this.newSprite;
            if (caller instanceof Piece) {
                caller.sprite = newSprite;
            }
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
            return object.types;
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
        else if (this.type === "Object ID") {
            let object = caller;
            if (this.object !== undefined) object = (this.object instanceof ScriptingRule) ? this.object.portVariables(this).run(caller, ...args) : this.object;
            return object.objectID;
        }
        else if (this.type === "Caller") {
            return caller;
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
            let rightArg = (this.rightArg instanceof ScriptingRule) ? this.rightArg.portVariables(this).run(caller, ...args) : this.rightArg;
            switch (this.type) {
                case "==":
                    if ((leftArg instanceof Piece || leftArg instanceof Tile) && (rightArg instanceof Piece || rightArg instanceof Tile)) return (leftArg.objectID === rightArg.objectID);
                    if ((leftArg instanceof PieceType && rightArg instanceof PieceType) || (leftArg instanceof TileType && rightArg instanceof TileType)) return (leftArg.typeID === rightArg.typeID);
                    return (leftArg === rightArg);
                case ">":
                    return (leftArg > rightArg);
                case "<":
                    return (leftArg < rightArg);
                case ">=":
                    return (leftArg >= rightArg);
                case "<=":
                    return (leftArg <= rightArg);
                case "!=":
                    if ((leftArg instanceof Piece || leftArg instanceof Tile) && (rightArg instanceof Piece || rightArg instanceof Tile)) return (leftArg.objectID !== rightArg.objectID);
                    if ((leftArg instanceof PieceType && rightArg instanceof PieceType) || (leftArg instanceof TileType && rightArg instanceof TileType)) return (leftArg.typeID !== rightArg.typeID);
                    return (leftArg !== rightArg);
                case "&&":
                    return (leftArg && rightArg);
                case "||":
                    return (leftArg || rightArg);
                case "XOR":
                    return (Boolean(leftArg) != Boolean(rightArg))
                case "+":
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
            }
        }
        else if (oneArgOperators.indexOf(this.type) != -1) {
            let argument = (this.argument instanceof ScriptingRule) ? this.argument.portVariables(this).run(caller, ...args) : this.argument;
            switch (this.type) {
                case "!": // Might change this one later to use floored modulo instead of JS modulo
                    return !argument;
                case "abs":
                    return Math.abs(argument);
                case "sign":
                    return Math.sign(argument);
            }
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
        else if (this.type === "Array Index Of Element") {
            let array = (this.array instanceof ScriptingRule) ? this.array.portVariables(this).run(caller, ...args) : this.array;
            let element = (this.element instanceof ScriptingRule) ? this.element.portVariables(this).run(caller, ...args) : this.element;
            return array.indexOf(element);
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
            return array[index];
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

    // Gives this rule the same variables array as the other rule.
    portVariables(otherRule) {
        this.variables = otherRule.variables;
        return this;
    }

    /*
        List of triggers implemented:
        "None": The rule is only called when some other scripting rule calls it.
        "Piece Moves": Triggers when that piece moves. Arguments are the x-direction change and the y-direction change.
        "Piece Lands on Tile": Triggers when that piece lands on any tile. Argument is the tile it landed on.
        "Tile is Landed on": Triggers when that tile is landed on by a piece. Argument is the piece that landed on it.
        "Piece is Removed": Triggers when that piece is removed. No arguments.
    */
}