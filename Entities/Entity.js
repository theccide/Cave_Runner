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
    collisionBounds = {x:0, y:0, width:0, height:0};
    id="";
    bobbingStrength = 0;
    showDebug = false;
    endAnimationCallback=null;
    
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

    forceAnimation(name){
        if(this.nonInteruptable && this.forcePlaying) return; // dont play another animation if not allowed
        if(this.currentAnimation == name) return;
        // if(this.id=="player") console.log("force",name);
        this.frame = 0;
        this.currentAnimation = name;
        this.nonInteruptable = true;
        this.forcePlaying = true; 
    }    
    
    switchAnimation(name){
        if(this.nonInteruptable && this.forcePlaying) return; // dont play another animation if not allowed
        if(this.currentAnimation == name) return;
        // if(this.id=="player") console.log("switch",name);
        this.frame = 0;
        this.currentAnimation = name;
        this.nonInteruptable = false;
        this.forcePlaying = false;
    }

    queueAnimation(animations){
        this.animationQueue = animations;
    }

    nextFrame = (deltaTime) => {
        this.elapsedTime += deltaTime;

        if (this.elapsedTime >= this.frameChangeInterval) {
            this.frame += 1;
            this.frame %= this.spriteSheet.animations[this.currentAnimation].length;
            if(this.frame == 0 ){
                 this.forcePlaying = false;// this has played at least 1 time
                 if(this.endAnimationCallback) this.endAnimationCallback();
            }
            this.elapsedTime = 0; // Reset the elapsed time
        }
    }
    
    drawSprite=(deltaTime)=>{
        const getBob=(amplitude,frequency)=>{
            if(amplitude == 0) return 0;
            const elapsed = (new Date()).getTime();
            return amplitude * Math.sin(frequency * elapsed);
        }

        this.nextFrame(deltaTime);

        drawImageSprite(this.gameController.currentScene.backBuffer,
            this.spriteSheet.sprite,
            this.spriteSheet.animations[this.currentAnimation][this.frame][0]*this.spriteSheet.cellSize.width,
            this.spriteSheet.animations[this.currentAnimation][this.frame][1]*this.spriteSheet.cellSize.height,
            this.spriteSheet.cellSize.width,
            this.spriteSheet.cellSize.height,
            this.position.x,
            this.position.y+getBob(this.bobbingStrength,0.005),
            this.spriteSheet.spriteSize.width,
            this.spriteSheet.spriteSize.height            
        );
    }

    brain = (deltaTime) => {}

    update = (deltaTime) => {
        this.nextFrame(deltaTime);
        this.brain(deltaTime);
        this.collisionBounds.x = this.position.x - this.spriteSheet.spriteSize.width;
        this.collisionBounds.y = this.position.y - this.spriteSheet.spriteSize.height;        
        this.collisionBounds.width = this.spriteSheet.spriteSize.width*2;
        this.collisionBounds.height = this.spriteSheet.spriteSize.height*2;

        if(this.showDebug) drawBox(this.gameController.currentScene.backBuffer, this.collisionBounds.x, this.collisionBounds.y , this.collisionBounds.width, this.collisionBounds.height, "red");
        this.drawSprite(deltaTime);
        if(this.showDebug) drawCircle(this.gameController.currentScene.backBuffer, this.position.x, this.position.y, 4, "red");
    }

    hit(direction, force){}
}
