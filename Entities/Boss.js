class Boss extends Entity{
    states = { IDLE : 0, ATTACKING : 1, CHASING: 2, HIT : 3, DEAD: 4 };
    state = this.states.IDLE;

    lastTimeEvent=0;
    nextTimeEvent=0;
    speed = 60;
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
                "Dead":    [[7,3]], // 3
            }
        });
        this.frameChangeInterval = 0.2;
        this.brightness=1;
        this.lastTimeEvent = gameTime;
    }

    chasing({dt, currentTime, gameTime}){
        const {hit, dist, angle} = Tools2D.moveTowards_CloseEnough(dt,this.position,this.gameController.player.position, this.speed, this.hitDistance, this.pauseAtDistance);
        this.spriteAngle = Tools.toDegrees(angle);
        this.speed = 60;
        if(dist < this.pauseAtDistance+10){
            this.gameController.player.hit({x:Math.sign(this.gameController.player.position.x-this.position.x),y:Math.sign(this.gameController.player.position.y-this.position.y)},15);
        }        
        if(hit){
            this.speed = 200;
            this.switchAnimation("Attack1");
        }
        else{this.switchAnimation("Idle")}
    }   
    brain=({dt, currentTime, gameTime})=>{
        switch (this.state) {
            case this.states.IDLE:
            break;
            case this.states.CHASING:
                this.chasing({dt, currentTime, gameTime});
            break;
            case this.states.ATTACKING:
            break;
            case this.states.HIT:
            break;
            case this.states.DEAD:
            break;            
        }  
    }

    playStunAnim(){
        this.switchAnimation("Hit");
        this.endAnimationCallback=()=>{
            this.switchAnimation("Idle");
        }
    }

    playDeathAnim(){
        this.state = this.states.DEAD;
        this.spriteAngle = 0;
        this.switchAnimation("Die");
        this.endAnimationCallback=()=>{
            this.switchAnimation("Dead");
        }
    }

    chase(){
        this.state = this.states.CHASING;
    }

    hp = 3;
    hit(direction, force){
        this.hp--;
        this.state = this.states.HIT;
        if(this.hp > 0)
            this.gameController.sequencer.startSequence("bossHit");
        else
            this.gameController.sequencer.startSequence("bossDeath");
        // this.isLightSource = true;
        // this.brightness = 0.9;
        // this.switchAnimation("Die");
        // this.endAnimationCallback=()=>{
        //     this.switchAnimation("Idle");
        //     this.state = this.states.CHASING;
        //     this.isLightSource = false;
        //     // this.brightness = 0.3;    
        // }

    }
}