class Button {
    clickScripts = [];
    visibleRules = [];
    enabled = true;
    sprite = 
    {
        fillColor:  "#0f0f0f",
        text: "",
        textColor: "FFFFFF",
        borderColor: "#000000",
        borderRadius: "5px",
        width: "300px",
        height: "200px"
    }
    name; // This starts out undefined but can be changed to a string
    // Do all the buttons go in one place in the UI, or can they be put in different places? If they can go in
    // different places, we'll need parameters here for that too.
    

    constructor(clickScripts = [], visibleRules = [], color = "#000000", textColor = "#ffffff", text = "", width = 0, height = 0) {
        this.clickScripts = clickScripts;
        this.visibleRules = visibleRules;
        this.color = color;
        this.textColor = textColor;
        this.text = text;
        this.width = width;
        this.height = height;
    }

    clickButton(topCall = true) {
        let scriptResult;
        for (let s = 0; s < this.clickScripts.length; s++) {
            scriptResult = this.clickScripts[s].run();
            console.log(scriptResult);
            if (scriptResult === false) {
                if (topCall) gameStateRevert();
                return false;
            }
        }
        scriptResult = globalScriptCheck();
        if (scriptResult && topCall) gameStateValid();
        else if (topCall) gameStateRevert();
        return scriptResult;
    }

    buttonVisible() {
        for (let s = 0; s < this.visibleRules.length; s++) {
            if (!(this.visibleRules[s].run())) return false;
        }
        return true;
    }
}