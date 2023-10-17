const fxTypes = {
    EXPLOD1E : 0
};

const FX_NAMES = {
    0: 'EXPLODE'
};

class Fx extends Entity{

    constructor (gameController, {fxType, destroyOnFinish}, position) {
        super(gameController, null, position);
        this.fxType = fxType;

        this.initSpriteSheet( {
            sprite: null,
            fileName: "Images/spritemaps/fx.png",
            cellSize: { width: 16, height: 16 },
            spriteSize: { width: 32, height: 32 },
            grid: { rows: 3, columns: 6 },
            startAnimation: "EXPLODE",
            animations:{
                "EXPLODE":    [[0,0],[1,0],[2,0],[3,0]] // 0
            }
        });
        this.frameChangeInterval = 0.2;
        this.bobbingStrength = 0;
        if(destroyOnFinish) this.endAnimationCallback = this.endAnimation;
    }

    endAnimation(){
        this.gameController.destroy(this);
    }

    brain=(dt)=>{}
}