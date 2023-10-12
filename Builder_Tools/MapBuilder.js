class WorldMap{
    bounds = {};
    buttons = [];
    currentColor = 1;

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
                isDirty = true;
            }
        }
    }

    constructor({width, height, numRowTiles, numColTiles}){
        this.bounds = {x:0, y:0, width: width, height};
        this.grid = new Grid(this, numRowTiles, numColTiles, {...this.bounds});
        this.grid.colors = this.colors;
        
        this.buttons.push(new Button(this, -2, {x:0,y:0,width:50, height:50},"darkgreen","Save",this.buttonClicked));
        this.buttons.push(new Button(this, -3, {x:0,y:50,width:50, height:50},"darkblue","Load",this.buttonClicked));
        this.buttons.push(new Button(this, -4, {x:0,y:100,width:50, height:50},"darkred","PNG",this.buttonClicked));
        this.buttons.push(new Button(this, 0, {x:0,y:200,width:50, height:50},"white","",this.buttonClicked));
        this.buttons.push(new Button(this, 1, {x:0,y:250,width:50, height:50},"black","",this.buttonClicked));
    } 

    buttonClicked(self, id){
        // console.log("Button Clicked:",id);
        if(id >=0 ) self.currentColor = id;
        if(id==-2) localStorage.setItem('model', Tools.compressArray(self.grid.matrix));        
        if(id==-3) { self.grid.matrix = Tools.decompressArray(localStorage.getItem('model')); isDirty = true;}
        if(id==-4) saveCanvasToPNG("myCanvas", "myImage.png");
    }
    
    update(delta){
        // this.grid.update(delta);  
        this.buttons.forEach(button=>button.update(delta));
    }
}

