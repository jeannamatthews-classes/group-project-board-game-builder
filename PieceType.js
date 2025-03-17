class PieceType {
    scripts = []; // Each entry here is itself an array: the 0th entry is a scripting rule, the rest of the entries control when the rule triggers
    movementRules = [];
    typeID = -1;
    typeName = "";
    typeSprite;
    publicVars = [];
    buttonsToShow = [];

    constructor(id, name, sprite) {
        this.typeID = id;
        this.typeName = name;
        this.typeSprite = sprite;
    }
}