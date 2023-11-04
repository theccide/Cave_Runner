class Skull extends Entity{
    
    constructor (gameController, id,   position) {
        super(gameController, id, null, position);
        this.startPosition = {...position};
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
        this.globalAlpha = 0.5;
        this.brightness = 0.4;
    }

    angle = 0;
    brain=({dt, currentTime, gameTime})=>{
        this.position = Tools.rotatePointAround(0,0,this.startPosition.x, this.startPosition.y, this.angle+=100*dt);
    }    
}

