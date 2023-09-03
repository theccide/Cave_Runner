class LevelMap{
    bounds = {};
    buttons = [];
    target=null;
    mob=null;
    aStar = null;
    colors=[
        "#FFFFFF7F",
        "#0000007F",
        "#FFFF007F",
        "#FF00007F"
    ];

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
    getMouseMoveInput(event){}
    getKeyboardInput(event){
        // console.log(event);
        if(event.type==="down" && event.key==="Enter"){
            this.aStar.setup(this.mob, this.target, this.grid);
            this.aStar.findPath();
        }
    }
    constructor(){
        this.bounds = {x:0, y:0, width: canvas.width, height: canvas.height};
        this.grid = new Grid(this, 29, 59, {...this.bounds});
        this.grid.colors = this.colors;
        this.grid.matrix = JSON.parse(localStorage.getItem('model'));
        this.aStar = new AStarGrid();

        this.mob={x:2,y:2};
        this.target={x:16,y:10};
    } 
    
    update(delta){
        this.grid.update(delta);  
        if(this.target) this.grid.fillCellAt(this.target.y,this.target.x,"blue");
        if(this.mob) this.grid.fillCellAt(this.mob.y,this.mob.x,"green");
        this.aStar.path.forEach(cell=>this.grid.fillCellAt(cell.y,cell.x,"purple"));
    }
}