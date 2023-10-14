class Entity {
        
    // ANIMATION VARIABLES
    spriteSheet = {sprite:null,fileName:'',spriteSize:{width:0,height:0},cellSize:{width:0,height:0},grid:{rows:0,columns:0}};
    frame = 0;
    elapsedTime = 0;
    currentAnimation = "";
    frameChangeInterval = 0.1;//IN SECONDS
    animationQueue = [];
    nonInteruptable = false;
    isLightSource = true;
    brightness = 0.25;
    
    position = {x:0, y:0};
    
    constructor (gameController, spriteSheet, position) {
        this.gameController = gameController;
        this.position = position;
        if(spriteSheet) this.initSpriteSheet(spriteSheet);
    }

    initSpriteSheet(spriteSheet){
        this.spriteSheet = spriteSheet;
        this.spriteSheet.sprite = this.gameController.images[spriteSheet.fileName];
        this.currentAnimation = this.spriteSheet.startAnimation;
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

    brain = (deltaTime) => {}

    update = (deltaTime) => {
        this.nextFrame(deltaTime);
        this.brain(deltaTime);
        this.drawSprite(deltaTime);
    }
}
