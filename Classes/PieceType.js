class PieceType {
    scripts = [];
    typeID = -1;
    typeName = "";
    publicVars = [];

    constructor(name, scripts, id = undefined) {
        this.typeID = (id !== undefined) ? id : assignTypeID();
        this.typeName = name;
        this.scripts = scripts;
    }
}