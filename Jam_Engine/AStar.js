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