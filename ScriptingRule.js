// A single rule for scripting.
class ScriptingRule {
    ruleArray = []; // This array contains what the rule is.

    constructor(ruleArray) {
        this.ruleArray = ruleArray;
    }

    // ["if-then-else", [["objectVar", 3, 0], ">", 3], ["MovePiece", 1, 3], ["return_fail"]]

    /**
     * Gets the result of checking this ScriptingRule, but doesn't do anything with that result.
     * @param {boolean} final If final is true, the check returns a ScriptingRuleReturn. If final is false, it just returns a boolean (or some other type). true by default.
     */
    check(final = true) {
        return this.checkArray(this.ruleArray, final);
    }
    /**
     * Gets the result of checking a ScriptingRule array, but doesn't do anything with that result.
     * @param {*} arr The array in question.
     * @param {boolean} final If final is true, the check returns a ScriptingRuleReturn. If final is false, it just returns a boolean (or some other type).
     * final should be true for the outermost array, false for inner arrays.
     */
    checkArray(arr, final = false) {
        // A ScriptingRule array tends to contain a bunch of arrays inside it to be evaluated themselves along the way.
        // In a given array, its 0th entry tells you what type of operation it is, the remaining entries are used in the evaluation.
        try {
            if (!Array.isArray(arr)) return arr;
            else if (arr[0] == "literalArray") return arr.slice(0); // The "literalArray" operation says to just return the array as an actual array
            // "return_pass" means the scriptingRule evaluated successfully. The following arguments should each be a pair of [an object ID, the index in that object's scripts to run].
            else if (arr[0] == "return_pass") {
                if (!final) return true;
                else return new ScriptingRuleReturn("pass", ...arr.slice(1).map(x => this.checkArray(x, false)));
            }
            // "return_fail" means the scriptingRule did not evaluate successfully (which probably means that move was invalid). The following arguments don't do anything.
            else if (arr[0] == "return_fail") {
                if (!final) return false;
                else return new ScriptingRuleReturn("fail", ...arr.slice(1).map(x => this.checkArray(x, false)));
            }
            // "return_error" means the scriptingRule encountered an error during execution. The following arguments should be the error's type and the error's message, which are both strings.
            else if (arr[0] == "return_error") {
                if (!final) throw new Error(...arr.slice(1));
                else return new ScriptingRuleReturn("error", ...arr.slice(1).map(x => this.checkArray(x, false)));
            }
            // "objectVar" as arr[0] means to go to the object of ID arr[1] and get its public variable of index arr[2].
            else if (arr[0] == "objectVar") {
                if (final) throw new Error(["invalidFinalOperation", "objectVar on outside of scripting rule."]);
                let obj = getObject(arr[1]);
                if (obj == null) throw new Error(["getObject_fail", "Object of ID " + arr[1] + " not found."]);
                return obj.publicVars[arr[2]];
            }
            // "objectScript" as arr[0] means to go to the object of ID arr[1] and execute its script of type index arr[2], script index arr[3] (arr[4] is whether or not that should be considered "final") and return its return value.
            else if (arr[0] == "objectScript") {
                let obj = getObject(arr[1]);
                if (obj == null) throw new Error(["getObject_fail", "Object of ID " + arr[1] + " not found."]);
                let type = obj.types[arr[2]];
                if (type === undefined) throw new Error(["objectScript_fail", "Object of ID " + arr[1] + " does not have a type of ID " + arr[2] + "."]);
                let script = type.scripts[arr[3]];
                if (script === undefined) throw new Error(["objectScript_fail", "Object type of ID " + arr[2] + " does not have a script of ID " + arr[3] + "."]);
                else {
                    result = script.check(arr[4]);
                    if (!final) return result;
                    else if (result == true) return new ScriptingRule("pass", result);
                    else return new ScriptingRule("fail", result);
                }
            }
            // "if-then-else" means that, if arr[1] as a scripting rule evaluates to true/pass, then return the result of arr[2] as a scripting rule, else return the result of arr[3] as a scripting rule.
            else if (arr[0] == "if-then-else") {
                if (this.checkArray(arr[1])) {
                    return this.checkArray(arr[2], final);
                }
                else {
                    return this.checkArray(arr[3], final);
                }
            }
            // "operation" is used to do math and boolean comparisons. For example, ["operation", 4, "==", 7] returns false, while ["operation", 2, "+", 3] returns 5.
            else if (arr[0] == "operation") {
                if (final) throw new Error(["invalidFinalOperation", "operation on outside of scripting rule."]);
                return this.operationCheck(arr.slice(1));
            }
            // "try-catch" means to attempt to run arr[1] as a scripting rule, then if that encounters an error, run arr[2] as a scripting rule instead.
            else if (arr[0] == "try-catch") {
                try {
                    let result = this.checkArray(arr[1], final);
                    if (result instanceof ScriptingRuleReturn && result.returnType == "error") throw new Error();
                    return result; 
                }
                catch {
                    return this.checkArray(arr[2], final);
                }
            }
            // else if (arr[0] == "MovePiece") {
            //     caller.x += arr[1];
            //     caller.y += arr[2];
            // }
            else throw new Error(["invalidOperation", arr[0] + " is not a valid scripting rule array starter."]);
        }
        catch (error) {
            if (!final) throw new Error(error);
            else return new ScriptingRuleReturn("error", ...error.map(x => this.checkArray(x, false)));
        }
    }
    operationCheck(arr) {
        // Operations are done left-to-right, no order of operations, so [2, "+", 3, "*", 4, "==", 20], becomes [5, "*", 4, "==", 20], becomes [20, "==", 20], returns true.
        arr = structuredClone(arr);
        let result = this.checkArray(arr[0]);
        arr.shift();
        let to_remove = 2;
        while (arr.length > 0) {
            to_remove = 2;
            switch (arr[0]) {
                // booleans
                case "==":
                    result = (result == this.checkArray(arr[1]));
                break;
                case "===":
                    result = (result === this.checkArray(arr[1]));
                break;
                case "!=":
                    result = (result != this.checkArray(arr[1]));
                break;
                case "!==":
                    result = (result !== this.checkArray(arr[1]));
                break;
                case ">":
                    result = (result > this.checkArray(arr[1]));
                break;
                case "<":
                    result = (result < this.checkArray(arr[1]));
                break;
                case ">=":
                    result = (result >= this.checkArray(arr[1]));
                break;
                case "<=":
                    result = (result <= this.checkArray(arr[1]));
                break;
                case "!":
                    result = !result;
                    to_remove = 1;
                break;
                // numbers
                case "+":
                    result = result + this.checkArray(arr[1]);
                break;
                case "-":
                    result = result - this.checkArray(arr[1]);
                break;
                case "*":
                    result = result * this.checkArray(arr[1]);
                break;
                case "/":
                    result = result / this.checkArray(arr[1]);
                break;
                case "%":
                    result = result % this.checkArray(arr[1]);
                break;
            }
            arr.splice(0, to_remove);
        }
        return result;
    }
    /**
     * Gets the result of checking this ScriptingRule. If the rule passes, it then has each object ID in the return's callArray
     * call its corresponding script.
     */
    run() {
        let checkResult = this.check();
        if (checkResult.returnType === "pass") {
            for (let returnIndex = 0; returnIndex < checkResult.callArray.length; returnIndex++) {
                let obj = getObject(checkResult.callArray[returnIndex][0]);
                if (obj == null) continue;
                let script = obj.type.scripts[checkResult.callArray[returnIndex][1]][0]
                if (script === undefined) continue;
                script.run();
            }
        }
    }
}

/**
 * This type is used to store the return values of ScriptingRules.
 * Has a "returnType" value.
 * 
 * If returnType is "pass", it also has a "callArray" value, an array of pairs of [object ID, entry in that object's scripts variable to trigger].
 * 
 * If returnType is "fail", it has no other data.
 * 
 * If returnType is "error", it has an "errorType" and an "errorMessage", both strings.
 */
class ScriptingRuleReturn {
    returnType;
    constructor(rt) {
        if (rt === "pass") {
            this.returnType = "pass";
            this.callArray = arguments.slice(1);
        }
        else if (rt === "fail") {
            this.returnType = "fail";
        }
        else if (rt === "error") {
            this.returnType = "error";
            this.errorType = arguments[1];
            this.errorMessage = arguments[2];
        }
    }
}