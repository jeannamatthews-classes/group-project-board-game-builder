class TileType {
    scripts = []; 
    typeID = -1;
    typeName = "";
    typeSprite;
    publicVars = []; // An array of name-value pairs
    buttonsToShow = [];

    constructor(name, scripts, sprite, id = undefined) {
        this.typeID = (id !== undefined) ? id : assignTypeID();
        this.scripts = scripts;
        this.typeName = name;
        this.typeSprite = sprite;
    }
}