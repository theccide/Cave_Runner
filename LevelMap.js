let mapData={
    map4:"eJztzUEJAAAIBLBCPuwj17+GYAk/YwE20/Ug5fV6vV6v1+v1er3ee7Ml43xn",
    map2:"eJzNlk0OhSAMhC/EQs5juP81NG4etJ3+YepLFyQI/aZTUM+ztw9itJt7lMc/ct/21l8v2rVV6ZPL4/O7dD935ddzae1dnLM6TLneEzFrWMdcvXEHETdab9xpeSbOtVb/Rs1DTMZc7GVvFtXWpXFXfZTr77rWI5k7Z8hyrfskcztTUcPl1Vdw597WcdcMe+fKz2XPCdd7j7SbfDAuVp97b8hkykWeWHnQak1j/Xffz91mqD5XBeJqnZP+NzzrhAhzmXKhmgw37Fhu78P9IMa4AHSNfxY=",
    map3:"eJyLjjbUGQAYqwO014DucNTeUXsHxl7auGrU3sFjLwLS017awFF7R+0dtXfU3lF7R+0dtXcg+kexAA+mfR0=",
    // map1:"eJztmEsOgzAMRC/EIjkPyv2v0QpUlQT/JqGRXUVelGDjPEZ0cLvvaUtbjhNlO4hP6lRFu7bUZPKY6kSdzcyq6noQ525iWx4lbnnuxPE0/h/iT1D7eSSWKXwTS0HXtkdIX2XPN3H9DZVCr+itttdaNPZHHE/jRbyIKeKrG9G+ZXG2b11q8viE1l5HayzdtXUqGnmDGKsGiLWr/BH71Fh+Zn0SU7lFjBPfvYVf8RMZ51M9vsb34zXW71fzZ8u8jccYcR+JX+J4Gmu/aeIQW7K/Iday/ohjaIy4mUbc9zRjxBihpS/O/DyxPPHrXWYQo++8+cS5+eT2XsQjxE94xVxi23mbu0UixnZdxDGJsToPxDM1DhWX/+iDRCkvyCWStA==",
    map1:"eJztmFEOgzAIhi/kQ3se4/2vscXFTGvh/yldYxfCg7ZQ+ESk3dY1LWnJ88i27MQf6nSRcszY5Op9zVNtNguji9edODcTc3q0qrRT8+DMsaZHOea9e4hRDF9VMHqd+JBZiHWKXxDzXx4i1qRme7+z+AUx38TSF8q+px7WvC2T4+cRz5fjIA5iiVjvW0xnO+y+9vpq1DOFuVOOtadmzxieHYS0chCjVf9PjD0yxHrNPpOY9+Ul7lMVTyXWO0s5lk5kDecwqNfPblhQj2ZyZt2HbqtdxG0kQdyPGP2mGU+MtDbrIK5Faa2KscSWboaI26rZRmwjZPzamfsTy++A8zKC2LrnjSfOxVWKHcQe4h69YiwxN891t5mIbVGD2G4XxC2xRlbFVHL6j34S2bYXQ5+Sow==",
    // map1Extras: "eJztzsEJgEAMAMGG8jCgNhPSfxuCCD7MwwPjXY5l/8uYqagsdXKxP7xrEGLEiBFXFUfOuNnFWV7EiOcSf3pFXFK8nSHOFN8hzhen9EK89zY2iwcLMWLEiJPEeoUY8dOMOFPcNcSIESNGPEbuB2/hk7k=",
    map1Extras: "eJzt0NkJgDAUBdGG8mHApZhH+m9DEdEPn6CQm0WGaeAwZjHEMPRTClbCOzohRowYca9iz+n3d7HKixhxT+Ll7Emc9UORx4hzO6c9xErxFWK9WNIL8bxV3flJ3FiIESNGLBLHI8SI72bESnHVECNGjBhxG6W0Apupk+I="
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

    switchCellValue(pos, value){
        let pointX = pos.x - this.bounds.x;
        let pointY = pos.y - this.bounds.y;
        let x =  Math.floor((pointX/this.bounds.width)*this.grid.numCols);
        let y =  Math.floor((pointY/this.bounds.height)*this.grid.numRows);
        this.grid.matrix[y][x] = value;
    }

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
    constructor(gc){
        this.gameController = gc;
        this.init();
    } 

    init(){
        const gc = this.gameController;
        this.bounds = {x:0, y:0, width: gc.currentScene.offBounds.width, height: gc.currentScene.offBounds.height};
        this.grid = new Grid(this, 44, 88, {...this.bounds});
        this.grid.colors = this.colors;
        this.grid.matrix = Tools.decompressArray(mapData.map1);
        this.grid.overlayMatrix(Tools.decompressArray(mapData.map1Extras));
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