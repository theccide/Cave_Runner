class SpikeTrap extends Entity{

    constructor (gameController, id, position) {
        super(gameController, id, null, position);
        this.isUP = false;
        this.timeDelay = 2000;
        this.lastEventTime = (new Date()).getTime();

        this.initSpriteSheet( {
            sprite: null,
            fileName: "Images/spritemaps/fx.png",
            cellSize: { width: 16, height: 16 },
            spriteSize: { width: 32, height: 32 },
            grid: { rows: 3, columns: 6 },
            startAnimation: "DOWN",
            animations:{
                "UP": [[0,5]], 
                "DOWN": [[2,5]], 
                "RISING": [[3,5],[1,5]], 
                "LOWERING": [[1,5],[3,5]]
            }
        });
        this.frameChangeInterval = 0.2;
    }

    brain=({dt, currentTime, gameTime})=>{

        if(currentTime > this.lastEventTime+this.timeDelay){
            this.lastEventTime = currentTime;
            if(this.isUP) {
                this.switchAnimation("LOWERING");
                this.endAnimationCallback=()=>{
                    this.switchAnimation("DOWN");
                    this.endAnimationCallback = null;
                }
            }
            if(!this.isUP) {
                this.switchAnimation("RISING");
                this.endAnimationCallback=()=>{
                    this.switchAnimation("UP");
                    this.endAnimationCallback = null;
                }
            }
            this.isUP = !this.isUP;
        }
    }
}