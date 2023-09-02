const wrap=(num, length)=> (num+length)%(length);
const dist=(x1, y1, x2, y2)=>{
    let a = x1 - x2;
    let b = y1 - y2;    
    return Math.sqrt( a*a + b*b );
}
// An educated guess of how far it is between two points
const heuristic=(a, b)=>dist(a.x, a.y, b.x, b.y);

class Button {
    bounds = {};
    onClick = null;
    color = "black";
    id = -1;
    self=null;
    text="";
    fontSize = 21;
    fontY =0;

    getMouseInput(event){
        if(Collision.testPointOnBox(event.position, this.bounds)){
            this.onClick(this.self, this.id);
        }
    } 

    constructor(self, id, bounds, color, text, onClick){
        this.onClick = onClick;
        this.bounds = bounds;
        this.color = color;
        this.id = id;
        this.self = self;
        this.text = text;

        this.fontY = this.bounds.y+((this.bounds.height/2)-this.fontSize/1.5)+this.fontSize;
    }

    update(){
        drawBox(this.bounds.x,this.bounds.y,this.bounds.width,this.bounds.height, this.color);
        drawBox(this.bounds.x,this.bounds.y,this.bounds.width,this.bounds.height, "black",{outline:true, thickness:3});
        drawText(this.bounds.x,this.fontY, this.text, this.fontSize, "white");
    }
}

class AStar{
    openSet = []; // a list of nodes that will be evaluated next
    closedSet = []; // a list of nodes that already have been evaluated
    path=[];
    start = null;
    end = null;
    numRows = 0;

    findPath(){
        while(this.iteratePath()){};

        // iterate backwards to find the path from the end to the start
        let temp = this.current;
        this.path.push(temp);
        while (temp.previous) {
          this.path.push(temp.previous);
          temp = temp.previous;
        }        
    }

    iteratePath(){
        
        if(this.openSet.length>0){
            let lowestIndex = 0;
            for(let i=0; i< this.openSet.length; i++){
                if(this.openSet[i].f < this.openSet[lowestIndex]) // find the lowest f
                    lowestIndex = i;
            }

            let current = this.current = this.openSet[lowestIndex]; // the current node is the one with the lowest f

            if(current == this.end){ // if current == end then we found the path!
                console.log("DONE");
                return false;
            }

            this.openSet = this.openSet.filter(node=>node!=current); // remove current from openSet
            this.closedSet.push(current);

            // Check all the neighbors
            let neighbors = current.neighbors;
            for (let i = 0; i < neighbors.length; i++) {
                let neighbor = neighbors[i];

                // check the neighor only if it has not been checked before and its not a wall
                if (!this.closedSet.includes(neighbor) && neighbor.type==0) {
                    // don't edit the neighbor g directly - pick the shortest path to the neighbor
                    let tempG = current.g + heuristic(neighbor, current); // g = the current distance traveled + the distance to the next neighbor
                    if (tempG < neighbor.g || neighbor.g==0) { // only edit this neighbor if this is the shortest path to get here || this neighbor has not been edited yet
                        neighbor.g = tempG;
                        neighbor.h = heuristic(neighbor, this.end); // h = the distance from here to the end goal
                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.previous = current;
                        if (!this.openSet.includes(neighbor)) this.openSet.push(neighbor);
                    }
                }
            }
        } else {
            console.log('no solution');
            return false;
        }
        return true;
    }
}

class AStarGrid extends AStar{
    numCols = 0;

    grid = [];

    setup(start, end, grid){
        const matrix = grid.clone().matrix;
        this.numRows = grid.numRows;
        this.numCols = grid.numCols;

        // build all the nodes for the grid
        for(let i_row=0; i_row<this.numRows; i_row++){
            this.grid[i_row] = [];
            for(let i_col=0; i_col<this.numCols; i_col++){
                this.grid[i_row][i_col] = {
                    y: i_row, x: i_col,
                    type: matrix[i_row][i_col], // collision type
                    f:0, // g + h
                    g:0, // cost from start - number of nodes traversed
                    h:0  // cost from goal - distance to goal
                };
            }
        }  
        
        // find all the neighbors for the nodes
        for(let i_row=0; i_row<this.numRows; i_row++){
            for(let i_col=0; i_col<this.numCols; i_col++){
                this.grid[i_row][i_col].neighbors = this.getNeighborsForNode(this.grid[i_row][i_col]);
            }
        }  

        this.start = this.grid[start.y][start.x];
        this.end = this.grid[end.y][end.x];

        // reset everything
        this.openSet = []; 
        this.closedSet = []; 
        this.path=[];

        this.openSet.push(this.start);
    }

    getNeighborsForNode(node) {
        let neighbors = [];
        if(this.grid)

        // search left right up and down
        if(node.y+1 < this.numRows) neighbors.push(this.grid[node.y+1][node.x]);
        if(node.y-1 >= 0) neighbors.push(this.grid[node.y-1][node.x]);
        if(node.x+1 < this.numCols) neighbors.push(this.grid[node.y][node.x+1]);
        if(node.x-1 >= 0) neighbors.push(this.grid[node.y][node.x-1]);

        // search angles
        if(node.y+1 < this.numRows && node.x+1 < this.numCols ) neighbors.push(this.grid[node.y+1][node.x+1]);
        if(node.y-1 >=0 && node.x+1 < this.numCols ) neighbors.push(this.grid[node.y-1][node.x+1]);
        if(node.y+1 < this.numRows && node.x-1 >= 0 ) neighbors.push(this.grid[node.y+1][node.x-1]);
        if(node.y-1 >=0 && node.x-1 >= 0 ) neighbors.push(this.grid[node.y-1][node.x-1]);
        
        return neighbors;
    }    
}

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
        this.grid = new Grid(this, 
            Math.floor(this.level.canvas.width*this.resolution), Math.floor(this.level.canvas.height*this.resolution), 
            {...this.bounds}
        );
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
        if(id==-2) localStorage.setItem('model', JSON.stringify(self.grid.matrix));        
        if(id==-3) self.grid.matrix = JSON.parse(localStorage.getItem('model'));
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
const loadImages = (callback) => {
    let imagesToLoad = ["Images/background1.png"];
    let resourceCounter = 0;
    imagesToLoad.forEach(imageFile => {
        let image = new Image();
        image.src = imageFile;
        image.onload = (loadedImage) => {
            this.images[imageFile]=loadedImage.target;
            resourceCounter++;
            if (resourceCounter >= imagesToLoad.length) callback();
        };
    });
}
