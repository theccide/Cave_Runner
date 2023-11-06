class Key extends Entity{
    
    constructor (gameController, id, {shouldRotate}, position) {
        super(gameController, id, null, position);
        this.distPosition = {...position};
        this.shouldRotate = shouldRotate;
        this.rotateSpeed = 25;
        this.initSpriteSheet( {
            sprite: null,
            fileName: "Images/spritemaps/key.png",
            cellSize: { width: 16, height: 16 },
            spriteSize: { width: 24, height: 24 },
            grid: { rows: 2, columns: 4 },
            startAnimation: "SILVER",
            animations:{
                "GOLD":   [[0,0],[1,0],[3,0],[2,0],[3,0],[1,0]],   // 0
                "SILVER": [[0,1],[1,1],[3,1],[2,1],[3,1],[1,1]]    // 1
            }
        }); 
        this.frameChangeInterval = 0.2;
        // this.globalAlpha = 0.5;
        // this.brightness = 0.4;
    }
    setOrbit({speed}){
        this.shouldRotate = true;
        this.rotateSpeed = speed;
        this.distPosition={...this.position};
    }

    removeOrbit(){
        this.shouldRotate = false;
    }

    angle = 0;
    brain=({dt, currentTime, gameTime})=>{
        if(this.shouldRotate)
            this.position = {...Tools.rotatePointAround(0,0,this.distPosition.x, this.distPosition.y, this.angle+=this.rotateSpeed*dt)};
    } 
    
    update({dt, currentTime, gameTime}){
        super.update({dt, currentTime, gameTime});
    }
}

