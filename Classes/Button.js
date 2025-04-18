class Button {
    clickScripts = [];
    visibleRules = [];
    sprite = 
    {
        fillColor:  "#0f0f0f",
        text: "",
        textColor: "FFFFFF",
        borderColor: "#000000",
        borderRadius: "5px",
    }
    
    // This starts out undefined but can be changed to a string
    // Do all the buttons go in one place in the UI, or can they be put in different places? If they can go in
    // different places, we'll need parameters here for that too.
    

    constructor(clickScripts = [], visibleRules = [], color = "#000000", textColor = "#ffffff", text = "", width = 0, height = 0) {
        this.containerWidth = -1;
        this.containerHeight = -1;
        this.containerTop = -1;
        this.containerLeft = -1;
        this.borderColor = 'black';
        this.borderWidth='2px';
        this.backgroundColor ='white';
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

    saveCode() {
        return {
            
            containerWidth:this.containerWidth,
            containerHeight:this.containerHeight,
            containerTop:this.containerTop,
            containerLeft:this.containerLeft,
            borderColor:this.borderColor,
            borderWidth:this.borderWidth,
            backgroundColor : this.backgroundColor,
            clickScripts: this.clickScripts.map(script =>
                script.saveCode()
            ),
            visibleRules: this.visibleRules.map(script =>
                script.saveCode()
            ),
            sprite: this.sprite
        };
    }

    loadCode(code) {
        this.containerWidth = code.containerWidth ?? this.containerWidth;
        this.containerHeight = code.containerHeight ?? this.containerHeight;
        this.containerTop = code.containerTop ?? this.containerTop;
        this.containerLeft = code.containerLeft ?? this.containerLeft;
        this.borderColor = code.borderColor ?? this.borderColor;
        this.borderWidth = code.borderWidth ?? this.borderWidth;
        this.backgroundColor = code.backgroundColor ?? this.backgroundColor;
        this.sprite = code.sprite ?? this.sprite;
    
        this.clickScripts = (code.clickScripts || []).map(data => {
            const script = new ScriptingRule(); 
            script.loadCode(data);
            return script;
        });
    
        this.visibleRules = (code.visibleRules || []).map(data => {
            const script = new ScriptingRule();
            script.loadCode(data);
            return script;
        });
    }
    
}