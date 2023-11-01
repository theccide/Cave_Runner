const fxTypes = {
    EXPLODE : 0,
    FIREBALL: 1,
    FIREBALL_EXPLODE: 2,
    RINGFIRE: 3,
    POOF: 4,
    SMOKE_POOF: 5   
};

const FX_NAMES = {
    0: "EXPLODE",
    1: "FIREBALL",
    2: "FIREBALL_EXPLODE",
    3: "RINGFIRE",
    4: "POOF",
    5: "SMOKE_POOF"
};

class Fx extends Entity{

    constructor (gameController, id, {fxType, destroyOnFinishAnim, spriteMap}, position) {
        super(gameController, id, null, position);
        this.fxType = fxType;

        if(!spriteMap){
            this.initSpriteSheet( {
                sprite: null,
                fileName: "Images/spritemaps/fx.png",
                cellSize: { width: 16, height: 16 },
                spriteSize: { width: 32, height: 32 },
                grid: { rows: 3, columns: 6 },
                startAnimation: FX_NAMES[fxType],
                animations:{
                    "EXPLODE": [[0,0],[1,0],[2,0],[3,0]],   // 0
                    "FIREBALL": [[0,1]],                    // 1
                    "FIREBALL_EXPLODE": [[1,1],[2,1]],      // 1
                    "RINGFIRE": [[0,2],[1,2]],              // 2
                    "POOF": [[0,3],[1,3],[2,3]],            // 3
                    "SMOKE_POOF": [[0,4],[1,4],[2,4],[3,4]] // 4
                }
            });
        }
        if(spriteMap == "BUBBLE"){
            this.initSpriteSheet( {
                sprite: null,
                fileName: "Images/spritemaps/bubble.png",
                cellSize: { width: 27, height: 21 },
                spriteSize: { width: 27/2, height: 21/2 },
                grid: { rows: 1, columns: 4 },
                startAnimation: "BUBBLE",
                animations:{
                    "BUBBLE": [[3,0],[1,0],[2,0],[0,0],[3,0],[3,0]]   // 0
                }
            });            
        }
        if(spriteMap == "KEY"){
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
        }        
        this.frameChangeInterval = 0.4;
        if(destroyOnFinishAnim) this.endAnimationCallback = this.endAnimation;
    }

    endAnimation(){
        this.gameController.destroy(this);
    }

    brain=(dt)=>{}
}