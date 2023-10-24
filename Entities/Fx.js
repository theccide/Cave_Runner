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

    constructor (gameController, id, {fxType, destroyOnFinishAnim}, position) {
        super(gameController, id, null, position);
        this.fxType = fxType;

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
        this.frameChangeInterval = 0.2;
        this.bobbingStrength = 0;
        if(destroyOnFinishAnim) this.endAnimationCallback = this.endAnimation;
    }

    endAnimation(){
        this.gameController.destroy(this);
    }

    brain=(dt)=>{}
}