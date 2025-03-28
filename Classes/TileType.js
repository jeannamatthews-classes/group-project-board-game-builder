class TileType {
    scripts = []; 
    typeID = -1;
    typeName = "";
    publicVars = []; // An array of name-value pairs
    buttonsToShow = [];

    constructor(name, scripts, id = undefined) {
        this.typeID = (id !== undefined) ? id : assignTypeID();
        this.scripts = scripts;
        this.typeName = name;
    }
}