class MiniBoss extends Entity{
    states = { IDLE : 0, TELEPORTING : 1, SHOOTING : 2, HIT : 3 };
    state = this.states.IDLE;
    spawnPoints = [];
    lastTimeEvent=0;
    nextTimeEvent=0;

    constructor (gameController, position, spawnPoints) {
        super(gameController, null, position);
        this.spawnPoints = spawnPoints;
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
        this.lastTimeEvent = (new Date()).getTime();
    }

    brain=(dt)=>{
        const currentTime = (new Date()).getTime();
        switch (this.state) {
            case this.states.IDLE:
                this.switchAnimation("Idle");
                this.nextTimeEvent = 2000;
                if(currentTime > this.lastTimeEvent+this.nextTimeEvent){
                    this.lastTimeEvent = currentTime;
                    this.state = (Math.random()>= 0.5)?this.states.TELEPORTING:this.states.SHOOTING;
                }
                break;
            case this.states.TELEPORTING:
                this.switchAnimation("PowerUp02");
                this.nextTimeEvent = 1000;
                if(currentTime > this.lastTimeEvent+this.nextTimeEvent){
                    this.lastTimeEvent = currentTime;
                    this.state = this.states.IDLE;
                    const newSpawnPoint = Tools.getNumberBetween(0, this.spawnPoints.length-1);
                    this.position = this.spawnPoints[newSpawnPoint];
                }
                break;
            case this.states.SHOOTING:
                this.switchAnimation("Attack01");
                this.endAnimationCallback=()=>{
                    this.lastTimeEvent = currentTime;
                    this.state = this.states.IDLE;                    
                    this.gameController.instatiate({className:"Bullet", params:{fxType:fxTypes.POOF}, position:{...this.position}});
                    this.endAnimationCallback = null;
                }
                break;
            case this.states.HIT:
                break;
        }  
    }
}