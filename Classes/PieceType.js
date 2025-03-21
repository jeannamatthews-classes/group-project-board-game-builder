class PieceType {
    scripts = [];
    typeID = -1;
    typeName = "";
    typeSprite;
    publicVars = [];
    buttonsToShow = [];

    constructor(name, scripts, sprite, id = undefined) {
        this.typeID = (id !== undefined) ? id : assignTypeID();
        this.typeName = name;
        this.typeSprite = sprite;
        this.scripts = scripts;
    }
}