class Torch extends Entity{
    constructor (gameController, id, {type, isInteractable}, position) {
        super(gameController, id, null, position);
        this.playerInteractable = isInteractable;
        // this.isLightSource = false;
        if(type=="thin"){
            this.initSpriteSheet( {
                sprite: null,
                fileName: "Images/spritemaps/torch.png",
                cellSize: { width: 15, height: 24 },
                spriteSize: { width: 15, height: 24 },
                grid: { rows: 1, columns: 6 },
                startAnimation: "BURN",
                animations:{
                    "BURN":    [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]], // 0
                }
            });
            this.brightness = 0.6;
        }
        if(type=="thick"){
            this.initSpriteSheet( {
                sprite: null,
                fileName: "Images/spritemaps/torch2.png",
                cellSize: { width: 24, height: 32 },
                spriteSize: { width: 24, height: 32 },
                grid: { rows: 1, columns: 8 },
                startAnimation: "BURN",
                animations:{
                    "BURN":    [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]], // 0
                }
            });
            this.brightness = 0.9;
        }

        this.frameChangeInterval = 0.2;        
    }

    brain=({dt, currentTime, gameTime})=>{}

    hit(direction, force){        
        this.gameController.instatiate({
            entityType:"Fx", params:{fxType:"5", destroyOnFinishAnim: true}, pos:{...this.position}
        });
        if("Boss" in this.gameController.entityMap){
            this.gameController.entityMap["Boss"].hit(0,0);
        }
        this.gameController.destroy(this);
    }
}