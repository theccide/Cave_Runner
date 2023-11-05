class Skull extends Entity{
    
    constructor (gameController, id, {shouldRotate}, position) {
        super(gameController, id, null, position);
        this.distPosition = {...position};
        this.shouldRotate = shouldRotate;
        this.rotateSpeed = 100;
        this.initSpriteSheet( {
            sprite: null,
            fileName: "Images/spritemaps/skull.png",
            cellSize: { width: 16, height: 16 },
            spriteSize: { width: 16, height: 16 },
            grid: { rows: 1, columns: 4 },
            startAnimation: "IDLE",
            animations:{
                "IDLE":    [[0,0],[1,0],[2,0],[3,0]], // 0
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
    angle = 0;
    brain=({dt, currentTime, gameTime})=>{
        if(this.shouldRotate)
            this.position = Tools.rotatePointAround(0,0,this.distPosition.x, this.distPosition.y, this.angle+=this.rotateSpeed*dt);
    }    
}

