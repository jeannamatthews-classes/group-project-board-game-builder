class TileType {
    scripts = []; 
    typeID = -1;
    typeName = "";
    publicVars = []; // An array of name-value pairs

    constructor(name, scripts, id = undefined) {
        this.typeID = (id !== undefined) ? id : assignTypeID();
        this.scripts = scripts;
        this.typeName = name;
        
     // Setter
        setPublicVar(name, value) {
        this.publicVars.set(name, value);
    }

    // Getter
    getPublicVar(name) {
        return this.publicVars.get(name);
    }

    // Method to generate a saveable code for tileType
    saveCode() {
        return {
            typeID: this.typeID,
            typeName: this.typeName,
            scripts: this.scripts.map(script => ({
                trigger: script.trigger,
                run: script.run.toString(), 
            })),
            publicVars: this.publicVars.map(pv => ({ name: pv.name, value: pv.value }))
        };
    }

    // Method to load tileType from a save
    static loadCode(saveCode) {
        const tileType = new TileType(saveCode.typeName, saveCode.scripts.map(script => ({trigger: script.trigger, run: new Function('return ' + script.run)(), })), saveCode.typeID);

        tileType.publicVars = saveCode.publicVars.map(pv => ({ name: pv.name, value: pv.value }));

        return tileType;
    

        
    }
}
