const gemTypes = {
    DIAMOND : 0,
    RUBY : 1,
    EMERALD : 2
};

const GEM_NAMES = {
    0: 'DIAMOND',
    1: 'RUBY',
    2: 'EMERALD',
};

class Gem extends Entity{
    gemType="";
    constructor (gameController, gemType, position) {
        super(gameController, null, position);
        this.gemType = gemType;
        this.initSpriteSheet( {
            sprite: null,
            fileName: "Images/gems.png",
            cellSize: { width: 10, height: 10 },
            spriteSize: { width: 16, height: 16 },
            grid: { rows: 3, columns: 6 },
            startAnimation: GEM_NAMES[gemType],
            animations:{
                "DIAMOND":    [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]], // 0
                "RUBY":       [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1]], // 1
                "EMERALD":    [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2]], // 2
            }
        });
        this.frameChangeInterval = 0.2;
    }

    brain=(dt)=>{
        if(Collision.testCircleOnCircle(this.gameController.player.position,8,this.position,8)){
            this.gameController.destroy(this);
            this.gameController.score+=(4 - (this.gemsType + 1));
        }        
    }
}