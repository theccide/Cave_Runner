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
    state = this.states.CHASING;
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
        if(distance < 150) {
            if(this.state = this.states.SEARCHING){this.target = null;this.path = [];}
            this.state = this.states.CHASING;
        }
        else {
            this.state = this.states.SEARCHING;
        }
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
               
                let result2 = Tools2D.moveTowards_CloseEnough(deltaTime,this.position,this.path[1],this.speed-10,8);//move to the next waypoint
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
                    break;
                }
                //console.log(this.path);
                let result3 = Tools2D.moveTowards_CloseEnough(deltaTime,this.position,this.path[1],this.speed-5,8);//move to the next waypoint
                if(result3.hit){                    
                    this.path.shift();
                }
                break;
            default:
              console.log("Yep, no state");
          }
    }
    update = (deltaTime) => {
        this.brain(deltaTime);
        drawImageSprite(this.gameController.currentScene.backBuffer, this.spriteSheet.sprite,0,0,
                this.spriteSheet.cellSize.width,
                this.spriteSheet.cellSize.height,
                this.position.x,
                this.position.y,
                this.spriteSheet.spriteSize.width,
                this.spriteSheet.spriteSize.height            
            );


    }
}
