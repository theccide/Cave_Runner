class WorldMap{
    resolution = 0.02;
    bounds = {};
    buttons = [];
    currentColor = 1;
    triggers = [];
    currentTrigger = {
        id:-1,
        name:"none",
        code:"Test code",
        color:"#FFFF00",
        entity: "NONE",
        letter: ""
    };

    colors=[
        "#FFFFFF7F",
        "#0000007F",
        "#FF00007F",
        "#00FF007F",
        "#0000FF7F"
    ]

    letters=["","C","C","C","C"];

    addTrigger(trigger, newTrigger){
        this.currentTrigger=trigger; 
        const id = trigger.id - 5;      
        const x = (id % 4) * 50;
        const y = Math.floor(id / 4) * 50;
        this.buttons.push(new Button(this, trigger.id, {x,y:450+y,width:50, height:50},trigger.color, trigger.name,this.buttonClicked));
        this.colors.push(trigger.color);
        this.letters.push(trigger.letter);
        this.grid.colors = this.colors;
        this.grid.letters = this.letters;
        if(newTrigger)
            this.triggers.push(trigger);
        else
            this.triggers = this.triggers.map(obj => (obj.id === trigger.id) ? trigger: obj);
        
    }

    mouseToGrid(event){
        let pointX = event.position.x - this.bounds.x;
        let pointY = event.position.y - this.bounds.y;
        let x =  Math.floor((pointX/this.bounds.width)*this.grid.numCols);
        let y =  Math.floor((pointY/this.bounds.height)*this.grid.numRows);
        return {x,y};
    }

    mouseDown = false;
    getMouseInput(event){
        this.mouseDown = false;
        if(event.type === "down"){
            if(Collision.testPointOnBox(event.position, this.bounds)){
                if(this.settingTarget){
                    this.target = this.mouseToGrid(event);
                    this.settingTarget = false;
                }
                else if(this.settingMob){
                    this.mob = this.mouseToGrid(event);
                    this.settingMob = false;
                }
                else
                    this.mouseDown = true;
            }
            this.buttons.forEach(button=>button.getMouseInput(event));
        }
    }    
    getMouseMoveInput(event){
        if(this.mouseDown){
            if(Collision.testPointOnBox(event.position, this.bounds)){
                let pointX = event.position.x - this.bounds.x;
                let pointY = event.position.y - this.bounds.y;
                let fingerX =  Math.floor((pointX/this.bounds.width)*this.grid.numCols);
                let fingerY =  Math.floor((pointY/this.bounds.height)*this.grid.numRows);
                if(fingerY>=0)
                this.grid.matrix[fingerY][fingerX] = this.currentColor;
            }
        }
    }

    constructor(level){
        this.bounds = {x:200, y:0, width: level.canvas.width-200,height: level.canvas.height};
        this.level = level;
        this.grid = new Grid(this, 44, 88, {...this.bounds});
        this.grid.showBorders = true;
        this.aStar = new AStarGrid();
        
        this.buttons.push(new Button(this, -2, {x:0,y:0,width:50, height:50},"darkgreen","Save",this.buttonClicked));
        this.buttons.push(new Button(this, -3, {x:0,y:50,width:50, height:50},"darkblue","Load",this.buttonClicked));
        this.buttons.push(new Button(this, -1, {x:0,y:100,width:50, height:50},"green","New",this.buttonClicked));
        this.buttons.push(new Button(this, -5, {x:0,y:150,width:50, height:50},"blue","Edit",this.buttonClicked));
        this.buttons.push(new Button(this, 0, {x:0,y:200,width:50, height:50},"white","          Delete",this.buttonClicked));
        this.buttons.push(new Button(this, 1, {x:0,y:250,width:50, height:50},"black","Collision",this.buttonClicked));
        this.buttons.push(new Button(this, 2, {x:50,y:250,width:50, height:50},"red","Collision",this.buttonClicked));
        this.buttons.push(new Button(this, 3, {x:100,y:250,width:50, height:50},"green","Collision",this.buttonClicked));
        this.buttons.push(new Button(this, 4, {x:150,y:250,width:50, height:50},"blue","Collision",this.buttonClicked));

        this.setupTriggers();
        // this.triggers = [this.currentTrigger];
        

        // this.buttons.push(new Button(this, -4, {x:0,y:300,width:50, height:50},"orange","Picker",this.buttonClicked));
    } 
    setupTriggers(){
        this.buttons = this.buttons.filter(obj => obj.id < 5);
        this.triggers.forEach((trigger, i)=>{
            const id = trigger.id - 5;      
            const x = (id % 4) * 50;
            const y = Math.floor(id / 4) * 50;
            this.buttons.push(new Button(this, trigger.id, {x,y:450+y,width:50, height:50},trigger.color, trigger.name,this.buttonClicked));
            this.colors.push(trigger.color);
            this.letters.push(trigger.letter);
        });
        this.grid.colors = this.colors;
        this.grid.letters = this.letters;
    }

    buttonClicked(self, id){
        // console.log("Button Clicked:",id);
        if(id >=0 ) {
            self.currentColor = id;            
            self.currentTrigger = self.triggers.find(obj => obj.id === id);
        }
        if(id==-1) {
            document.getElementById('nameInput').value = "";
            document.getElementById("colorPicker").value = "#000000";
            document.getElementById('codeInput').value = "";
            document.getElementById('dropdown').value = "";
            document.getElementById('letterPicker').value = "";
            document.getElementById('id').value = "-1";
            document.getElementById('myModal').style.display = 'block';
        }
        if(id==-2) {
            localStorage.setItem('triggerModel', Tools.compressArray(self.grid.matrix));
            localStorage.setItem('triggers', JSON.stringify(self.triggers));
        }
        if(id==-3){
            self.grid.matrix = Tools.decompressArray(localStorage.getItem('triggerModel'));
            self.triggers = JSON.parse(localStorage.getItem('triggers'));
            self.setupTriggers();
        }
        if(id==-5) {
            if(self.currentTrigger){
                document.getElementById('id').value = self.currentTrigger.id;
                document.getElementById('nameInput').value = self.currentTrigger.name;
                document.getElementById("colorPicker").value = self.currentTrigger.color;
                document.getElementById('codeInput').value = self.currentTrigger.code; 
                document.getElementById('dropdown').value = self.currentTrigger.entity;
                document.getElementById('letterPicker').value = self.currentTrigger.letter;
                document.getElementById('myModal').style.display = 'block';
            }
        }
    }
    
    update(delta){
        this.grid.update(delta);  
        this.buttons.forEach(button=>button.update(delta));
        if(this.currentTrigger.id !==-1){
            drawText(backBuffer,0,350,`Trigger: ${this.currentTrigger.name}`,20,"white");
            drawText(backBuffer,10,370,`ID: ${this.currentTrigger.id}`,15,"white");
            drawBox(backBuffer,10,373,12,12,this.currentTrigger.color);
            drawText(backBuffer,30,385,`Color: ${this.currentTrigger.color}`,15,"white");
            drawText(backBuffer,30,400,`Enity: ${this.currentTrigger.entity}`,15,"white");
            drawText(backBuffer,10,415,this.currentTrigger.code,15,"lightgreen");
        }
    }
}

images = {};

