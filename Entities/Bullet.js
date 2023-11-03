class Bullet extends Entity{
    speed = 150;
    dir={x:1,y:0};
    bulletEntity = null;
    ttl = 2000;
    lastTime = (new Date()).getTime();
    target = null;

    constructor (gameController, id, {fxType, destroyOnFinishAnim}, position) {
        super(gameController, id, null, position);
        this.brightness = 0.9;

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
        this.target = this.gameController.player;
    }

    brain=(dt)=>{
        const currentTime = (new Date()).getTime();
        if(currentTime > this.lastTime+this.ttl){
            this.brightness -= 0.5*dt;
            if(this.brightness <=0){
                this.brightness = 0;
                this.gameController.destroy(this);
                return;
            }
        }

        const dist={
            x: this.dir.x * this.speed * dt,
            y: this.dir.y * this.speed * dt
        }

        if(this.gameController.levelMap.findCellFrom({x:this.position.x+dist.x, y:this.position.y+dist.y}).col === 1) {
            this.gameController.instatiate({entityType:"Fx", params:{fxType:fxTypes.SMOKE_POOF, destroyOnFinishAnim:true}, pos:{...this.position}});
            this.gameController.destroy(this);
            return;
        }

        this.position.x += dist.x;
        this.position.y += dist.y;
        
        // check to see if the player was hit
        if(Collision.testBoxOnBox(this.target.collisionBounds,this.collisionBounds)){
            this.target.hit(this.faceDir, this.hitForce);
            this.gameController.destroy(this);
        }
    }

    hit(direction, force){
        if("miniboss" in this.gameController.entityMap) 
            this.target = this.gameController.entityMap["miniboss"];
        this.dir.x = -2;
    } 
}