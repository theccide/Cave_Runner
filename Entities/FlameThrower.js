class FlameThrower extends Entity{
    constructor (gameController, id, type, position) {
        super(gameController, id, null, position);

        if(type == 0){
            this.initSpriteSheet( {
                sprite: null,
                fileName: "Images/spritemaps/flamethrower1.png",
                cellSize: { width: 16, height: 32 },
                spriteSize: { width: 16, height: 32 },
                grid: { rows: 1, columns: 4 },
                startAnimation: "FLAME",
                animations:{
                    "FLAME":  [[0,0],[1,0],[2,0],[3,0]], // 0
                }
            });
        }
        if(type == 1){
            this.initSpriteSheet( {
                sprite: null,
                fileName: "Images/spritemaps/flamethrower2.png",
                cellSize: { width: 32, height: 16 },
                spriteSize: { width: 32, height: 16 },
                grid: { rows: 1, columns: 4 },
                startAnimation: "FLAME",
                animations:{
                    "FLAME":  [[0,0],[1,0],[2,0],[3,0]], // 0
                }
            });
        }
        this.frameChangeInterval = 0.2;
    }

    brain=({dt, currentTime, gameTime})=>{
 
    }    
}