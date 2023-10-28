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
        this.bulletEntity = new Fx(gameController, generateRandomId(8), {fxType, destroyOnFinishAnim: false}, position)
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
            this.gameController.instatiate({className:"Fx", params:{fxType:fxTypes.SMOKE_POOF, destroyOnFinishAnim:true}, position:{...this.position}});
            this.gameController.destroy(this);
            return;
        }

        this.position.x += dist.x;
        this.position.y += dist.y;
        this.bulletEntity.position = {...this.position}; 
        this.collisionBounds = this.bulletEntity.collisionBounds;   
        
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
    update = (deltaTime) => {
        this.brain(deltaTime);
        this.bulletEntity.update(deltaTime);
    }
}