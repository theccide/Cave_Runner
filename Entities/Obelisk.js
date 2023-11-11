class Obelisk extends Entity{
    scale = 0.75;

    constructor (gameController, id, position) {
        super(gameController, id, null, position);    

        this.initSpriteSheet( {
            sprite: null,
            fileName: "Images/spritemaps/obelisk.png",
            cellSize: { width: 200, height: 400 },
            spriteSize: { width: 100*this.scale, height: 200*this.scale },
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

        // this.addChild(new Fx(this.gameController, "starfall", {fxType:"0", destroyOnFinishAnim: false, spriteMap:"STARFALL"}, {x:20, y:50}));
    }
    
    setupCollisionBounds(){
        this.collisionBounds.x = this.parent.position.x+this.position.x - this.spriteSheet.spriteSize.width*this.scale;
        this.collisionBounds.y = -100+this.parent.position.y+this.position.y - this.spriteSheet.spriteSize.height*this.scale;        
        this.collisionBounds.width = (this.spriteSheet.spriteSize.width*this.scale)*2;
        this.collisionBounds.height = (this.spriteSheet.spriteSize.height*this.scale)*2;
    }

    // update ({dt, currentTime, gameTime}){
    //     super.update({dt, currentTime, gameTime});
    // }
    // brain=({dt, currentTime, gameTime})=>{
    // }
    
    hit(direction, hitForce){
        this.switchAnimation("DEATH");
        this.endAnimationCallback=()=>{
            this.gameController.sequencer.pauseSequence("stealObeliskPower",true);
            this.gameController.destroy(this);
        }

        // if(direction.x==-1) this.shield.switchAnimation("LEFT_SIDE");
        // if(direction.x==1) this.shield.switchAnimation("RIGHT_SIDE");
        // this.shield.endAnimationCallback=()=>{
        //     this.shield.switchAnimation("OFF");
        // }
    }
}