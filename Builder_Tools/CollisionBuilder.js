class WorldMap{
    resolution = 0.02;
    bounds = {};
    buttons = [];
    currentColor = 1;
    target=null;
    mob=null;
    settingTarget = false;
    settingMob = false;
    aStar = null;

    colors=[
        "#FFFFFF7F",
        "#0000007F",
        "#FFFF007F",
        "#FF00007F"
    ]

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
        this.grid = new Grid(this, 29, 59, {...this.bounds});
        this.grid.colors = this.colors;
        this.aStar = new AStarGrid();
        
        this.buttons.push(new Button(this, -2, {x:0,y:0,width:50, height:50},"darkgreen","Save",this.buttonClicked));
        this.buttons.push(new Button(this, -3, {x:0,y:50,width:50, height:50},"darkblue","Load",this.buttonClicked));
        this.buttons.push(new Button(this, -4, {x:0,y:100,width:50, height:50},"green","Mob",this.buttonClicked));
        this.buttons.push(new Button(this, -5, {x:0,y:150,width:50, height:50},"blue","Target",this.buttonClicked));
        this.buttons.push(new Button(this, 0, {x:0,y:200,width:50, height:50},"white","",this.buttonClicked));
        this.buttons.push(new Button(this, 1, {x:0,y:250,width:50, height:50},"black","",this.buttonClicked));
        // this.buttons.push(new Button(this, 2, {x:0,y:300,width:50, height:50},"yellow","",this.buttonClicked));
        // this.buttons.push(new Button(this, 3, {x:0,y:350,width:50, height:50},"red","",this.buttonClicked));
        this.buttons.push(new Button(this, -6, {x:0,y:300,width:50, height:50},"orange","Find",this.buttonClicked));
    } 

    buttonClicked(self, id){
        // console.log("Button Clicked:",id);
        if(id >=0 ) self.currentColor = id;
        if(id==-2) localStorage.setItem('model', Tools.compressArray(self.grid.matrix));        
        if(id==-3) self.grid.matrix = Tools.decompressArray(localStorage.getItem('model'));
        if(id==-4) self.settingMob = true;
        if(id==-5) self.settingTarget = true;
        if(id==-6) {
            self.aStar.setup(self.mob, self.target, self.grid);
            self.aStar.findPath();
        }
    }
    
    update(delta){
        this.grid.update(delta);  

        // this.aStar.openSet.forEach(cell=>this.grid.fillCellAt(cell.y,cell.x,"purple"));
        // this.aStar.closedSet.forEach(cell=>this.grid.fillCellAt(cell.y,cell.x,"red"));
        this.aStar.path.forEach(cell=>this.grid.fillCellAt(cell.y,cell.x,"purple"));

        if(this.target) this.grid.fillCellAt(this.target.y,this.target.x,"blue");
        if(this.mob) this.grid.fillCellAt(this.mob.y,this.mob.x,"green");

        this.buttons.forEach(button=>button.update(delta));
    }
}

images = {};

