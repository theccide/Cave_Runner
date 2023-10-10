class MiniBoss extends Entity{
    
    constructor (gameController, position) {
        super(gameController, null, position);
        this.initSpriteSheet( {
            sprite: null,
            fileName: "Images/spritemaps/miniboss.png",
            cellSize: { width: 62, height: 48 },
            spriteSize: { width: 62, height: 48 },
            grid: { rows: 5, columns: 6 },
            startAnimation: "Idle",
            animations:{
                "Attack01":    [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]], // 0
                "Attack02":    [[0,1],[1,1],[2,1],[3,1],[4,1]], // 1
                "PowerUp01":   [[0,2],[1,2],[2,2],[3,2]], // 2
                "PowerUp02":   [[0,3],[1,3],[2,3],[3,3],[4,3]], // 3
                "Idle":        [[0,4],[1,4],[2,4],[3,4],[4,4]], // 3
            }
        });
        this.frameChangeInterval = 0.2;
    }

    brain=(dt)=>{}
}