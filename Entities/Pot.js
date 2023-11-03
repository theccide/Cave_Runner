class Pot extends Entity{
    hp = 3;
    type = "";
    takingDamage = false;
    
    constructor (gameController, id,  {type}, position) {
        super(gameController, id, null, position);
        this.type = type;
        this.initSpriteSheet( {
            sprite: null,
            fileName: "Images/spritemaps/pots.png",
            cellSize: { width: 32, height: 32 },
            spriteSize: { width: 32, height: 32 },
            grid: { rows: 4, columns: 4 },
            startAnimation: type,
            animations:{
                "ONE":         [[0,0]], // 0
                "BREAKONE":    [[1,0],[2,0],[3,0]], // 0
                "TWO":         [[0,1]], // 0
                "BREAKTWO":    [[1,1],[2,1],[3,1]], // 0
                "THREE":       [[0,2]], // 0
                "BREAKTHREE":  [[1,2],[2,2],[3,2]], // 0
                "FOUR":        [[0,3]], // 0
                "BREAKFOUR":   [[1,3],[2,3],[3,3]], // 0
            }
        });
        this.frameChangeInterval = 0.2;
        this.isLightSource = false;        
        this.timeHitDelay = 500;
        this.lastEventTime = 0;
        this.playerInteractable = true;
    }
    
    hit(direction, force){
        this.hp--;
        if(this.hp <= 0){
            this.switchAnimation("BREAK"+this.type);
            this.endAnimationCallback=()=>{
                this.gameController.destroy(this);
            }
            return;
        }
        this.takingDamage = true;
        this.lastEventTime = (new Date()).getTime();
        this.bobbingStrength.x = 3;
        this.bobbingStrength.fx = 0.1;
    }

    brain=(dt)=>{
        if(this.takingDamage) {
            const currentTime = (new Date()).getTime();
            if(currentTime > this.lastEventTime+this.timeHitDelay){
                this.takingDamage = false;
                this.bobbingStrength.x = 0;
                this.bobbingStrength.fx = 0;        
            }
            return;
        }
    }
}

class FallingRock extends Pot{
    fallSpeed = 1;
    landed = false;
    ground = {x:0,y:0};
    light = null;
    constructor (gameController, id, {type, ground}, position) {
        super(gameController, id, {type}, position);
        this.ground = ground;
        this.isLightSource = true;
        //this.light = new EmptyEntity(gameController,"",{x: ground.x - position.x, y:ground.y - position.y})
        this.light = new Fx(gameController,"",{fxType:3},{x: ground.x - position.x, y:ground.y - position.y});
        this.light.globalAlpha = 0.1;
        this.addChild(this.light);
    }
    brain=(dt)=>{
        if(this.landed) return;
        this.fallSpeed+=this.fallSpeed*dt;
        this.position.y+= this.fallSpeed;
        this.light.position.y-= this.fallSpeed;
        if(this.position.y >= this.ground.y){
            this.landed = true;
            this.switchAnimation("BREAK"+this.type);
            this.endAnimationCallback=()=>{
                this.gameController.destroy(this);
            }
        }
    }    
}