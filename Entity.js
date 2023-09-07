class Entity {
    states = {
        IDLE: 0,
        SEARCHING : 1,
        CHASING : 2
    };
    // searchingWaypoints = [{x:38,y:1},{x:4,y:3},{x:1,y:27}];
    searchingWaypoints = [{x:6,y:1},{x:4,y:3},{x:3,y:6}];
    target = null;
    waypointPointer = null;
    tweenPercent = 0;
    path = [];
    state = this.states.SEARCHING;
    spriteSheet = {sprite:null,fileName:'',spriteSize:{width:0,height:0},cellSize:{width:0,height:0},grid:{rows:0,columns:0}};
    position = {x:0, y:0};
    direction = "none";
    isMoving = false;
    speed = 100;
    gameController = null;
    constructor (gameController, spriteSheet, position) {
        this.gameController = gameController;
        this.spriteSheet = spriteSheet;
        this.spriteSheet.sprite = gameController.images[spriteSheet.fileName];
        this.position = position;
    }
    changeState = (state) => {this.state = state;}
    findWaypoint = () => {
        this.gameController.levelMap.aStar.setup({x:Math.floor(this.position.x/32),y:Math.floor(this.position.y/32)}, this.target, this.gameController.levelMap.grid);
        this.path = this.gameController.levelMap.aStar.findPath().map(pos=>{return {x:(pos.x*32)+16,y:(pos.y*32)+16}}).reverse();
    }
    brain = (deltaTime) => {
        switch (this.state) {
            case this.states.IDLE:
                console.log("Idle state");
                break;
            case this.states.SEARCHING:
                if(!this.target) {
                    this.waypointPointer=0;
                    this.target = this.searchingWaypoints[this.waypointPointer];
                    this.findWaypoint();
                }
                
                let result2 = Tools2D.moveTowards_CloseEnough(deltaTime,this.position,this.path[1],this.speed,8);//move to the next waypoint
                if(result2.hit){                     
                    this.path.shift();
                    if(this.path.length === 1) { 
                        this.position = this.path[0]; 
                        this.target=this.searchingWaypoints[(this.waypointPointer+=1) % this.searchingWaypoints.length];
                        this.findWaypoint();
                    } // correct last cell for rounding errors
                }
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
        drawImageSprite(backBuffer, this.spriteSheet.sprite,0,0,
                this.spriteSheet.cellSize.width,
                this.spriteSheet.cellSize.height,
                this.position.x,
                this.position.y,
                this.spriteSheet.spriteSize.width,
                this.spriteSheet.spriteSize.height            
            );
    }
}