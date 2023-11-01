class Boss extends Entity{
    states = { IDLE : 0, ATTACKING : 1, CHASING: 2, HIT : 3 };
    state = this.states.IDLE;

    lastTimeEvent=0;
    nextTimeEvent=0;
    speed = 30;
    pauseAtDistance = 50;
    hitDistance = 100;

    constructor (gameController, id, {spawnPoints}, position) {
        super(gameController, id, null, position);
        this.spawnPoints = spawnPoints;
        this.initSpriteSheet( {
            sprite: null,
            fileName: "Images/spritemaps/boss.png",
            cellSize: { width: 64, height: 64 },
            spriteSize: { width: 64, height: 64 },
            grid: { rows: 4, columns: 8 },
            startAnimation: "Idle",
            animations:{
                "Idle":    [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]], // 0
                "Attack1": [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1]], // 1
                "Hit":     [[0,2],[1,2],[2,2],[3,2]], // 2
                "Die":     [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3]], // 3
            }
        });
        this.frameChangeInterval = 0.2;
        this.brightness=1;
        this.lastTimeEvent = (new Date()).getTime();
    }

    // const {hit, dist, angle} = Tools2D.moveTowards_CloseEnough(dt,this.position,this.gameController.player.position, this.speed, this.hitDistance, this.pauseAtDistance);
    // this.spriteAngle = Tools.toDegrees(angle);
    // if(hit){
    //     this.switchAnimation("Attack1");
    // }
    // if(dist < this.pauseAtDistance+10){
    //     this.gameController.player.hit(0,0);
    // }


    chasing(dt){
        const {hit, dist, angle} = Tools2D.moveTowards_CloseEnough(dt,this.position,this.gameController.player.position, this.speed, this.hitDistance, this.pauseAtDistance);
        this.spriteAngle = Tools.toDegrees(angle);
        if(dist < this.pauseAtDistance+10){
            this.gameController.player.hit(0,0);
        }        
        if(hit){
            this.switchAnimation("Attack1");
        }
        else{this.switchAnimation("Idle")}
    }   
    brain=(dt)=>{        const currentTime = (new Date()).getTime();
        switch (this.state) {
            case this.states.IDLE:
            break;
            case this.states.CHASING:
                this.chasing(dt);
            break;
            case this.states.ATTACKING:
            break;
            case this.states.HIT:
            break;
        }  
    }
}