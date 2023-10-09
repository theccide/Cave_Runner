class MoveableEntity extends Entity{
    directions = { DOWN : 0, LEFT : 1, RIGHT: 2, UP : 3 };

    moveDirection={x:0,y:0};
    faceDir = this.directions.DOWN;

    //TODO: remove this from here //WAY POINTS FOR SEARCHING
    searchingWaypoints = [{x:6,y:1},{x:4,y:3},{x:3,y:6}];
    
    target = null;
    waypointPointer = null;
    tweenPercent = 0;
    path = [];
    direction = "none";
    isMoving = false;
    speed = 100;

    constructor(gameController, spriteSheet, position) {
        super(gameController, spriteSheet, position);        
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
        let targetWaypoint = null;
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
               
                targetWaypoint = Tools2D.moveTowards_CloseEnough(deltaTime,this.position,this.path[1],this.speed-10,8);//move to the next waypoint
                if(targetWaypoint?.hit){
                    this.path.shift();
                    if(this.path.length === 1) {
                        this.position = this.path[0];
                        this.target=this.searchingWaypoints[(this.waypointPointer+=1) % this.searchingWaypoints.length];
                        this.findWaypoint();
                    } // correct last cell for rounding errors
                }
                
                break;
            case this.states.CHASING:
                if(!this.target) {
                    this.gameController.levelMap.aStar.setup({x:Math.floor(this.position.x/32),y:Math.floor(this.position.y/32)},
                    this.gameController.levelMap.findCellFrom(this.gameController.player.position), this.gameController.levelMap.grid);
                    this.path = this.gameController.levelMap.aStar.findPath().map(pos=>{return {x:(pos.x*32)+16,y:(pos.y*32)+16}}).reverse();
                }
                if(this.path.length === 1) {
                    // this.frame=0;
                    // changeScene(new GameOver(this.gameController.score*100));
                    break;
                }
                targetWaypoint = Tools2D.moveTowards_CloseEnough(deltaTime,this.position,this.path[1],this.speed-5,8);//move to the next waypoint
                if(targetWaypoint.hit){                    
                    this.path.shift();
                }
                break;
            default:
              console.log("Yep, no state");
          }

          if(targetWaypoint){
            let angle = targetWaypoint.angle * (180 / Math.PI);
            if(Math.abs(angle) <= 180 && Math.abs(angle) > 135) {
                this.faceDir = this.directions.LEFT;
                this.moveDirection.y = 0;
                this.moveDirection.x = -1;
            }
            if(Math.abs(angle) <= 45 && Math.abs(angle) > 0) {
                this.faceDir = this.directions.RIGHT;
                this.moveDirection.y = 0;
                this.moveDirection.x = 1;
            }
            if(angle >= 0) {
                if(Math.abs(angle) <= 135 && Math.abs(angle) > 45) {
                    this.faceDir = this.directions.DOWN;
                    this.moveDirection.x = 0;
                    this.moveDirection.y = 1;
                }
            }
            else {
                if(Math.abs(angle) <= 135 && Math.abs(angle) > 45) {
                    this.faceDir = this.directions.UP;
                    this.moveDirection.x = 0;
                    this.moveDirection.y = -1;
                }
            }
        }            
    }

    switchAnimation(name, nonInteruptable=false){
        if(this.nonInteruptable && this.playOnce) return; // dont play another animation if not allowed
        if(this.currentAnimation == name) return;
        this.frame = 0;
        this.currentAnimation = name;
        this.nonInteruptable = nonInteruptable;
        this.playOnce = true; // see if this has played at least 1 time
    }

    queueAnimation(animations){
        this.animationQueue = animations;
    }

    nextFrame = (deltaTime) => {
        this.elapsedTime += deltaTime;

        if (this.elapsedTime >= this.frameChangeInterval) {
            this.frame += 1;
            this.frame %= this.spriteSheet.animations[this.currentAnimation].length;
            if(this.frame == 0 ) this.playOnce = false;// this has played at least 1 time
            this.elapsedTime = 0; // Reset the elapsed time
        }
    }

    drawSprite=(deltaTime)=>{
        this.nextFrame(deltaTime);

        if(this.moveDirection.x != 0) {
            if(this.moveDirection.x > 0) this.switchAnimation("WALK_RIGHT");
            if(this.moveDirection.x < 0) this.switchAnimation("WALK_LEFT");
        }
        if(this.moveDirection.y != 0) {
            if(this.moveDirection.y > 0) this.switchAnimation("WALK_DOWN");
            if(this.moveDirection.y < 0) this.switchAnimation("WALK_UP");
        }
        if(this.moveDirection.x == 0 && this.moveDirection.y == 0 ){
            if(this.faceDir == this.directions.DOWN)   this.switchAnimation("IDLE_DOWN");
            if(this.faceDir == this.directions.LEFT)   this.switchAnimation("IDLE_LEFT");
            if(this.faceDir == this.directions.RIGHT)  this.switchAnimation("IDLE_RIGHT");
            if(this.faceDir == this.directions.UP)     this.switchAnimation("IDLE_UP");
        }

        drawImageSprite(this.gameController.currentScene.backBuffer,
            this.spriteSheet.sprite,
            this.spriteSheet.animations[this.currentAnimation][this.frame][0]*this.spriteSheet.cellSize.width,
            this.spriteSheet.animations[this.currentAnimation][this.frame][1]*this.spriteSheet.cellSize.height,
            this.spriteSheet.cellSize.width,
            this.spriteSheet.cellSize.height,
            this.position.x,
            this.position.y,
            this.spriteSheet.spriteSize.width,
            this.spriteSheet.spriteSize.height            
        );
    }
}