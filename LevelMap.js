let mapData={
    map1:"eJzNlk0OhSAMhC/EQs5juP81NG4etJ3+YepLFyQI/aZTUM+ztw9itJt7lMc/ct/21l8v2rVV6ZPL4/O7dD935ddzae1dnLM6TLneEzFrWMdcvXEHETdab9xpeSbOtVb/Rs1DTMZc7GVvFtXWpXFXfZTr77rWI5k7Z8hyrfskcztTUcPl1Vdw597WcdcMe+fKz2XPCdd7j7SbfDAuVp97b8hkykWeWHnQak1j/Xffz91mqD5XBeJqnZP+NzzrhAhzmXKhmgw37Fhu78P9IMa4AHSNfxY=",
    map2:"eJyLjjbUGQAYqwO014DucNTeUXsHxl7auGrU3sFjLwLS017awFF7R+0dtXfU3lF7R+0dtXcg+kexAA+mfR0="
};

class LevelMap{
    showDebugInfo = false;
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

    findCellFrom=(pos)=>{
        let pointX = pos.x - this.bounds.x;
        let pointY = pos.y - this.bounds.y;
        let x =  Math.floor((pointX/this.bounds.width)*this.grid.numCols);
        let y =  Math.floor((pointY/this.bounds.height)*this.grid.numRows);
        return {x,y,col:this.grid.matrix[y][x]};            
    }

    mouseToGrid(event){
        let pointX = event.position.x - this.bounds.x;
        let pointY = event.position.y - this.bounds.y;
        let x =  Math.floor((pointX/this.bounds.width)*this.grid.numCols);
        let y =  Math.floor((pointY/this.bounds.height)*this.grid.numRows);
        return {x,y};
    }

    getMouseInput(event){
        if(event.type === "down"){
            if(Collision.testPointOnBox(event.position, this.bounds)){
                this.target = this.mouseToGrid(event);
            }
        }
    }    
    getMouseMoveInput(event){}
    getKeyboardInput(event){
        if(event.type==="down" && event.key==="Enter"){
            this.mob = this.gameController.entities[0];
            this.mob.changeState(this.mob.states.CHASING);
            //this.aStar.setup(this.mob, this.target, this.grid);
            this.aStar.setup({x:Math.floor(this.mob.position.x/32),y:Math.floor(this.mob.position.y/32)}, this.target, this.grid);
            this.mob.path = this.aStar.findPath().map(pos=>{return {x:(pos.x*32)+16,y:(pos.y*32)+16}}).reverse();
        }
    }
    constructor(gameController){
        this.gameController = gameController;
        this.bounds = {x:0, y:0, width: canvas.width, height: canvas.height};
        this.grid = new Grid(this, 29, 59, {...this.bounds});
        this.grid.colors = this.colors;
        this.grid.matrix = Tools.decompressArray(mapData.map1);
        this.aStar = new AStarGrid();

        this.mob={x:2,y:2};
        this.target={x:16,y:10};
    } 
    
    update(delta){
        if(this.showDebugInfo){
            this.grid.update(delta);  
            if(this.target) this.grid.fillCellAt(this.target.y,this.target.x,"blue");
            if(this.mob) this.grid.fillCellAt(this.mob.y,this.mob.x,"green");
            this.grid.fillCellAt(1,6,"red");
            this.grid.fillCellAt(3,4,"red");
            this.grid.fillCellAt(6,3,"red");
            // this.grid.fillCellAt(1,38,"red");
            // this.grid.fillCellAt(3,4,"red");
            // this.grid.fillCellAt(27,1,"red");
            this.aStar.path.forEach(cell=>this.grid.fillCellAt(cell.y,cell.x,"purple"));
        }
    }
}