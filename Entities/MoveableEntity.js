class MoveableEntity extends Entity{
    directions = { DOWN : 0, LEFT : 1, RIGHT: 2, UP : 3 };

    moveDirection={x:0,y:0};
    faceDir = this.directions.DOWN;

    target = null;
    waypointPointer = null;
    tweenPercent = 0;
    path = [];
    direction = "none";
    isMoving = false;
    speed = 100;
    autoControlAnimation = true;

    constructor(gameController, id, spriteSheet, position, fields) {
        super(gameController, id, spriteSheet, position, fields);        
    }

    drawSprite=({dt, currentTime, gameTime})=>{
        this.nextFrame({dt, currentTime, gameTime});

        if(this.autoControlAnimation){
            if(this.moveDirection.x != 0) {
                if(this.moveDirection.x > 0) this.switchAnimation("WALK_RIGHT");
                if(this.moveDirection.x < 0) this.switchAnimation("WALK_LEFT");
            }
            breakme: if(this.moveDirection.y != 0) {
                // holding 2 move keys (Example: Down and Left)
                if(this.moveDirection.x != 0) {
                    if(this.moveDirection.x > 0) this.switchAnimation("WALK_RIGHT");
                    if(this.moveDirection.x < 0) this.switchAnimation("WALK_LEFT");
                    break breakme;
                }            

                if(this.moveDirection.y > 0) this.switchAnimation("WALK_DOWN");
                if(this.moveDirection.y < 0) this.switchAnimation("WALK_UP");
            }
            if(this.moveDirection.x == 0 && this.moveDirection.y == 0 ){
                if(this.faceDir == this.directions.DOWN)   this.switchAnimation("IDLE_DOWN");
                if(this.faceDir == this.directions.LEFT)   this.switchAnimation("IDLE_LEFT");
                if(this.faceDir == this.directions.RIGHT)  this.switchAnimation("IDLE_RIGHT");
                if(this.faceDir == this.directions.UP)     this.switchAnimation("IDLE_UP");
            }
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