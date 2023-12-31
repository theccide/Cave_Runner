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
        if(spriteMap == "SMOKEFX"){
            // 1152x576 16x9
            this.initSpriteSheet( {
                sprite: null,
                fileName: "Images/spritemaps/smokeFx.png",
                cellSize: { width: 64, height: 64 },
                spriteSize: { width: 64, height: 64 },
                grid: { rows: 9, columns: 18 },
                startAnimation: fxType,
                animations:{
                    "ONE":   [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0],[11,0],[12,0],[13,0],[14,0],[15,0],[17,0],[17,0]],   // 0
                    "TWO":   [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1],[11,1],[12,1],[13,1],[14,1],[15,1],[17,1],[17,1]],   // 1
                    "THREE": [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2],[11,2],[12,2],[13,2],[14,2],[15,2],[17,2],[17,2]],   // 2
                    "FOUR":  [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[10,3],[11,3],[12,3],[13,3],[14,3],[15,3],[17,3],[17,3]],   // 3
                    "FIVE":  [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,4],[11,4],[12,4],[13,4],[14,4],[15,4],[17,4],[17,4]],   // 4
                    "SIX":   [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],[10,5],[11,5],[12,5],[13,5],[14,5],[15,5],[17,5],[17,5]],   // 5
                    "SEVEN": [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6],[10,6],[11,6],[12,6],[13,6],[14,6],[15,6],[17,6],[17,6]],   // 6
                    "EIGHT": [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],[8,7],[9,7],[10,7],[11,7],[12,7],[13,7],[14,7],[15,7],[17,7],[17,7]],   // 7
                    "NINE":  [[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],[8,8],[9,8],[10,8],[11,8],[12,8],[13,8],[14,8],[15,8],[17,8],[17,8]],   // 8
                }
            });            
        }
        if(spriteMap == "SMOKEFX02"){
            // 1152x576 16x9
            this.initSpriteSheet( {
                sprite: null,
                fileName: "Images/spritemaps/smokeFx02.png",
                cellSize: { width: 64, height: 64 },
                spriteSize: { width: 64, height: 64 },
                grid: { rows: 9, columns: 18 },
                startAnimation: fxType,
                animations:{
                    "ONE":   [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0],[11,0],[12,0],[13,0],[14,0],[15,0],[16,0],[17,0],[18,0],[19,0],[20,0]],   // 0
                    "TWO":   [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1],[11,1],[12,1],[13,1],[14,1],[15,1],[16,1],[17,1],[18,1],[19,1],[20,1]],   // 1
                    "THREE": [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2],[11,2],[12,2],[13,2],[14,2],[15,2],[16,2],[17,2],[18,2],[19,2],[20,2]],   // 2
                    "FOUR":  [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[10,3],[11,3],[12,3],[13,3],[14,3],[15,3],[16,3],[17,3],[18,3],[19,3],[20,3]],   // 3
                    "FIVE":  [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,4],[11,4],[12,4],[13,4],[14,4],[15,4],[16,4],[17,4],[18,4],[19,4],[20,4]],   // 4
                    "SIX":   [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],[10,5],[11,5],[12,5],[13,5],[14,5],[15,5],[16,5],[17,5],[18,5],[19,5],[20,5]],   // 5
                    "SEVEN": [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6],[10,6],[11,6],[12,6],[13,6],[14,6],[15,6],[16,6],[17,6],[18,6],[19,6],[20,6]],   // 6
                    "EIGHT": [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],[8,7],[9,7],[10,7],[11,7],[12,7],[13,7],[14,7],[15,7],[16,7],[17,7],[18,7],[19,7],[20,7]],   // 7
                    "NINE":  [[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],[8,8],[9,8],[10,8],[11,8],[12,8],[13,8],[14,8],[15,8],[16,8],[17,8],[18,8],[19,8],[20,8]],   // 8
                }
            });            
        }        
        if(spriteMap == "SMOKEFX03"){
            // 1152x576 16x9
            this.initSpriteSheet( {
                sprite: null,
                fileName: "Images/spritemaps/smokeFx03.png",
                cellSize: { width: 64, height: 58.7 },
                spriteSize: { width: 64, height: 58.7 },
                grid: { rows: 9, columns: 18 },
                startAnimation: fxType,
                animations:{
                    "ONE":   [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0],[11,0],[12,0],[13,0],[14,0],[15,0],[16,0],[17,0],[18,0],[19,0],[20,0],[21,0],[22,0],[23,0]],   // 0
                    "TWO":   [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1],[11,1],[12,1],[13,1],[14,1],[15,1],[16,1],[17,1],[18,1],[19,1],[20,1],[21,1],[22,1],[23,1]],   // 1
                    "THREE": [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2],[11,2],[12,2],[13,2],[14,2],[15,2],[16,2],[17,2],[18,2],[19,2],[20,2],[21,2],[22,2],[23,2]],   // 2
                    "FOUR":  [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[10,3],[11,3],[12,3],[13,3],[14,3],[15,3],[16,3],[17,3],[18,3],[19,3],[20,3],[21,3],[22,3],[23,3]],   // 3
                    "FIVE":  [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,4],[11,4],[12,4],[13,4],[14,4],[15,4],[16,4],[17,4],[18,4],[19,4],[20,4],[21,4],[22,4],[23,4]],   // 4
                    "SIX":   [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],[10,5],[11,5],[12,5],[13,5],[14,5],[15,5],[16,5],[17,5],[18,5],[19,5],[20,5],[21,5],[22,5],[23,5]],   // 5
                }
            });            
        }
        if(spriteMap == "EXPLODE_1"){
            // 1375x138
            this.initSpriteSheet( {
                sprite: null,
                fileName: "Images/spritemaps/fx1.png",
                cellSize: { width: 137.5, height: 138 },
                spriteSize: { width: 137.5, height: 138 },
                grid: { rows: 1, columns: 18 },
                startAnimation: "EXPLODE",
                animations:{
                    "EXPLODE":   [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]],   // 0
                }
            });
        }
        if(spriteMap == "EXPLODE_2"){
            // 1152x576 16x9
            this.initSpriteSheet( {
                sprite: null,
                fileName: "Images/spritemaps/fx2.png",
                cellSize: { width: 130, height: 130 },
                spriteSize: { width: 130, height: 130 },
                grid: { rows: 1, columns: 18 },
                startAnimation: "EXPLODE",
                animations:{
                    "EXPLODE":   [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]],   // 0
                }
            });
        }
        if(spriteMap == "EXPLODE_3"){
            // 1152x576 16x9
            this.initSpriteSheet( {
                sprite: null,
                fileName: "Images/spritemaps/fx3.png",
                cellSize: { width: 160, height: 160 },
                spriteSize: { width: 160, height: 160 },
                grid: { rows: 1, columns: 10 },
                startAnimation: "EXPLODE",
                animations:{
                    "EXPLODE":   [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]],   // 0
                }
            });
        }
        if(spriteMap == "EXPLODE_4"){
            // 1900x190 16x9
            this.initSpriteSheet( {
                sprite: null,
                fileName: "Images/spritemaps/fx4.png",
                cellSize: { width: 190, height: 190 },
                spriteSize: { width: 190, height: 190 },
                grid: { rows: 1, columns: 10 },
                startAnimation: "EXPLODE",
                animations:{
                    "EXPLODE":   [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]],   // 0
                }
            });
        }
        if(spriteMap == "STARFALL"){
            // 1712x824
            this.initSpriteSheet( {
                sprite: null,
                fileName: "Images/spritemaps/starfall.png",
                cellSize: { width: 214, height: 206 },
                spriteSize: { width: 214, height: 206 },
                grid: { rows: 4, columns: 8 },
                startAnimation: "EXPLODE",
                animations:{
                    "EXPLODE":   [
                        [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],
                        [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],
                        [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],
                        [0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3]
                    ],   // 0
                }
            });
        }

        
        // "Images/spritemaps/fx1.png",
        // "Images/spritemaps/fx2.png",
        // "Images/spritemaps/fx3.png",
        // "Images/spritemaps/fx4.png",
        // "Images/spritemaps/starfall.png",
        
        this.frameChangeInterval = 0.2;
        if(destroyOnFinishAnim) this.endAnimationCallback = this.endAnimation;
    }

    endAnimation(){
        this.gameController.destroy(this);
    }

    brain=({dt, currentTime, gameTime})=>{}
}