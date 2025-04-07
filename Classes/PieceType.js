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

    saveCode() {
        return {
            typeID: this.typeID,
            typeName: this.typeName,
            publicVars: this.publicVars,
            scripts: this.scripts.map(s => s.saveCode?.() ?? null)
}
