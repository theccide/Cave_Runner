class Entity {
    states = {
        IDLE: 0,
        SEARCHING : 1,
        CHASING : 2
    };
    tweenPercent = 0;
    path = [];
    state = this.states.IDLE;
    spriteSheet = {sprite:null,fileName:'',spriteSize:{width:0,height:0},cellSize:{width:0,height:0},grid:{rows:0,columns:0}};
    position = {x:0, y:0};
    direction = "none";
    isMoving = false;
    speed = 100;
    constructor (gameController, spriteSheet, position) {
        this.gameController = gameController;
        this.spriteSheet = spriteSheet;
        this.spriteSheet.sprite = gameController.images[spriteSheet.fileName];
        this.position = position;
    }
    changeState = (state) => {this.state = state;}

    brain = (deltaTime) => {
        switch (this.state) {
            case this.states.IDLE:
                console.log("Idle state");
                break;
            case this.states.SEARCHING:
                console.log("Searching state");
                break;
            case this.states.CHASING:
                if(this.path.length <= 1) break;
                /*
                this.position = Tools.tween2D(this.position,this.path[1],this.tweenPercent+=0.1);
                if(this.tweenPercent >= 1) {
                    this.tweenPercent = 0;
                    this.path.shift();
                }
                */

                //const result = Tools2D.moveTowards_UntilChange(1,this.position,this.path[1],1);
                const result = Tools2D.moveTowards_CloseEnough(deltaTime,this.position,this.path[1],this.speed,8);
                if(result.hit){                     
                    this.path.shift();
                    if(this.path.length === 1) this.position = this.path[0]; // correct last cell for rounding errors
                }
                //console.log("Chasing state");
                break;
            default:
              console.log("Yep, no state");
          }
    }
    update = (deltaTime) => {
        this.brain(deltaTime);
        drawImageSprite(this.spriteSheet.sprite,0,0,
                this.spriteSheet.cellSize.width,
                this.spriteSheet.cellSize.height,
                this.position.x,
                this.position.y,
                this.spriteSheet.spriteSize.width,
                this.spriteSheet.spriteSize.height            
            );
    }
}