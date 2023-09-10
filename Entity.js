class Entity {
    states = {
        IDLE : 0,
        SEARCHING : 1,
        CHASING : 2
    };
    directions = {
        DOWN : 0,
        LEFT : 1,
        RIGHT: 2,
        UP : 3
    };
    // ANIMATION VARIABLES
    facing = this.directions.UP;
    frame = 0;
    elapsedTime = 0;
    frameChangeInterval = 0.1;//IN SECONDS
    //WAY POINTS FOR SEARCHING
    searchingWaypoints = [{x:6,y:1},{x:4,y:3},{x:3,y:6}];
    target = null;
    waypointPointer = null;
    tweenPercent = 0;
    path = [];
    state = this.states.CHASING;
    //OTHER
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
        let distance = Math.sqrt(Math.pow((this.position.x-this.gameController.player.position.x),2) + Math.pow((this.position.y-this.gameController.player.position.y),2));
        if(distance < 50) {
            if(this.state = this.states.SEARCHING){this.target = null;this.path = [];}
            this.state = this.states.CHASING;
        }
        else {
            this.state = this.states.SEARCHING;
        }
        let result2 = null;
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
               
                result2 = Tools2D.moveTowards_CloseEnough(deltaTime,this.position,this.path[1],this.speed-10,8);//move to the next waypoint
                if(result2!=null){
                    if(result2.hit){                    
                        this.path.shift();
                        if(this.path.length === 1) {
                            this.position = this.path[0];
                            this.target=this.searchingWaypoints[(this.waypointPointer+=1) % this.searchingWaypoints.length];
                            this.findWaypoint();
                        } // correct last cell for rounding errors
                    }
                }
                break;
            case this.states.CHASING:
                if(!this.target) {
                    this.gameController.levelMap.aStar.setup({x:Math.floor(this.position.x/32),y:Math.floor(this.position.y/32)},
                    this.gameController.levelMap.findCellFrom(this.gameController.player.position), this.gameController.levelMap.grid);
                    this.path = this.gameController.levelMap.aStar.findPath().map(pos=>{return {x:(pos.x*32)+16,y:(pos.y*32)+16}}).reverse();
                }
                if(this.path.length === 1) {
                    this.frame=0;
                    break;
                }
                result2 = Tools2D.moveTowards_CloseEnough(deltaTime,this.position,this.path[1],this.speed-5,8);//move to the next waypoint
                if(result2.hit){                    
                    this.path.shift();
                }
                break;
            default:
              console.log("Yep, no state");
          }
          if(result2 != null){
            let angle = result2.angle * (180 / Math.PI);
            if(Math.abs(angle) <= 180 && Math.abs(angle) > 135) {this.facing = this.directions.LEFT;}
            if(Math.abs(angle) <= 45 && Math.abs(angle) > 0) {this.facing = this.directions.RIGHT;}
            if(angle >= 0) {if(Math.abs(angle) <= 135 && Math.abs(angle) > 45) {this.facing = this.directions.DOWN;}}
            else {if(Math.abs(angle) <= 135 && Math.abs(angle) > 45) {this.facing = this.directions.UP;}}
          }
            
    }
    nextFrame = (deltaTime) => {
        this.elapsedTime += deltaTime;

        if (this.elapsedTime >= this.frameChangeInterval) {
            this.frame += 1;
            this.frame %= 4;
            this.elapsedTime = 0; // Reset the elapsed time
        }
    }
    update = (deltaTime) => {
        this.nextFrame(deltaTime);
        this.brain(deltaTime);
        drawImageSprite(this.gameController.currentScene.backBuffer, this.spriteSheet.sprite, 1 + (11 * this.frame), 1 + (18 * this.facing),
            this.spriteSheet.cellSize.width,
            this.spriteSheet.cellSize.height,
            this.position.x,
            this.position.y,
            this.spriteSheet.spriteSize.width,
            this.spriteSheet.spriteSize.height
        );
    }
}
