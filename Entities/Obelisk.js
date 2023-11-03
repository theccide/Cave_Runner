class Obelisk extends Entity{
    
    constructor (gameController, id, position) {
        super(gameController, id, null, position);

        // 3400x1200

        this.initSpriteSheet( {
            sprite: null,
            fileName: "Images/spritemaps/obelisk.png",
            cellSize: { width: 200, height: 400 },
            spriteSize: { width: 100, height: 200 },
            grid: { rows: 3, columns: 16 },
            startAnimation: "IDLE",
            animations:{
                "DEATH":    [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0],[11,0],[12,0],[13,0],[14,0],[15,0],[16,0]], // 0
                "HIT":      [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1],[11,1],[12,1]], // 1
                "IDLE":     [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2],[11,2],[12,2]], // 2
            }
        });
        
        this.frameChangeInterval = 0.2;
        this.brightness=2;
    }

    brain=(dt)=>{
    }    
}