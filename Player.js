class Player extends Entity{
    static STOP = 0;
    static LEFT = -1;
    static RIGHT = 1;
    static UP = -2;
    static DOWN = 2;
    moveDirection = Player.STOP;
    getMouseInput=(event)=>{}    
    getMouseMoveInput=(event)=>{}
    getKeyboardInput=(event)=>{
        if(event.type==="down"){
            if(event.key=="w") this.moveDirection=Player.UP;
            if(event.key=="s") this.moveDirection=Player.DOWN;
            if(event.key=="d") this.moveDirection=Player.RIGHT;
            if(event.key=="a") this.moveDirection=Player.LEFT;
        }
        else{
            if(event.key=="w") this.moveDirection=Player.STOP;
            if(event.key=="s") this.moveDirection=Player.STOP;
            if(event.key=="d") this.moveDirection=Player.STOP;
            if(event.key=="a") this.moveDirection=Player.STOP;
        }
    }
    constructor(gameController){
        super(gameController,
            {
                sprite:null, 
                fileName:"Images/player_testing.png",
                cellSize:{width:16,height:16},
                spriteSize:{width:16,height:16},
                grid:{rows:4,columns:4}
            },
            {x:(32*4)+16,y:(32*4)+16}
        );
    }
    update = (deltaTime) => {
        drawImageSprite(this.spriteSheet.sprite,0,0,
            this.spriteSheet.cellSize.width,
            this.spriteSheet.cellSize.height,
            this.position.x,
            this.position.y,
            this.spriteSheet.spriteSize.width,
            this.spriteSheet.spriteSize.height            
        );
        if((this.moveDirection == Player.RIGHT) || (this.moveDirection == Player.LEFT)){
            this.position.x+=this.speed*this.moveDirection*deltaTime;
        }
        if((this.moveDirection == Player.UP) || (this.moveDirection == Player.DOWN)){
            this.position.y+=this.speed*(this.moveDirection/2)*deltaTime;
        }
    }
}