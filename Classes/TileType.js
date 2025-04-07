class TileType {
    scripts = []; 
    typeID = -1;
    typeName = "";
    publicVars = []; // An array of name-value pairs

    constructor(name, scripts, id = undefined) {
        this.typeID = (id !== undefined) ? id : assignTypeID();
        this.scripts = scripts;
        this.typeName = name;
        
    saveCode() {
        return {
            typeID: this.typeID,
            typeName: this.typeName,
            publicVars: this.publicVars,
            scripts: this.scripts.map(s => s.saveCode ? s.saveCode() : null)
        };
    }
}
