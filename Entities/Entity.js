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
    bobbingStrength={x: 0, y:0, fx:0.005, fy:0.005};
    showDebug = false;
    endAnimationCallback=null;
    frameChangeCallback=null;    
    position = {x:0, y:0};
    camera = null;
    pauseAnimation = false;
    spriteAngle = 0;
    visible = true;
    playerInteractable = false;
    parent = { position:{x:0,y:0} };
    children=[];
    globalAlpha = 1;
    
    constructor (gameController, id, spriteSheet, position) {
        this.id = id;
        this.gameController = gameController;
        this.position = position;        
        if(spriteSheet) this.initSpriteSheet(spriteSheet);
    }

    initSpriteSheet(spriteSheet){
        this.spriteSheet = spriteSheet;
        this.spriteSheet.sprite = this.gameController.images[spriteSheet.fileName];
        this.currentAnimation = this.spriteSheet.startAnimation;
        this.setupCollisionBounds();
    }

    addChild(entity){
        entity.parent = this;
        this.children.push(entity);
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
        if(!(name in this.spriteSheet.animations)) return;
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
        // if(this.id=="miniboss") console.log("paused",this.pauseAnimation);
        if(this.pauseAnimation) return;

        this.elapsedTime += deltaTime;

        if (this.elapsedTime >= this.frameChangeInterval) {
            this.frame += 1;
            this.frame %= this.spriteSheet.animations[this.currentAnimation].length;
            if(this.frameChangeCallback) this.frameChangeCallback(this.frame);
            if(this.frame == this.spriteSheet.animations[this.currentAnimation].length-1 ){
                 this.forcePlaying = false;// this has played at least 1 time
                 if(this.endAnimationCallback) {this.endAnimationCallback(); this.endAnimationCallback=null;}
                //  if(this.id=="miniboss") console.log("endAnimationCallback paused",this.pauseAnimation);
            }
            this.elapsedTime = 0; // Reset the elapsed time
        }
    }
    
    drawSprite=(deltaTime)=>{

        this.nextFrame(deltaTime);

        this.gameController.currentScene.backBuffer.globalAlpha = this.globalAlpha;
        //this.gameController.currentScene.backBuffer.scale(-1, 1);
        drawImageSprite(this.gameController.currentScene.backBuffer,
            this.spriteSheet.sprite,
            this.spriteSheet.animations[this.currentAnimation][this.frame][0]*this.spriteSheet.cellSize.width,
            this.spriteSheet.animations[this.currentAnimation][this.frame][1]*this.spriteSheet.cellSize.height,
            this.spriteSheet.cellSize.width,
            this.spriteSheet.cellSize.height,
            this.position.x+this.parent.position.x+Tools.getBob(this.bobbingStrength.x,this.bobbingStrength.fx),
            this.position.y+this.parent.position.y+Tools.getBob(this.bobbingStrength.y,this.bobbingStrength.fy),
            this.spriteSheet.spriteSize.width,
            this.spriteSheet.spriteSize.height,
            this.spriteAngle
        );
        this.gameController.currentScene.backBuffer.globalAlpha = 1;
    }

    brain(deltaTime){}

    setupCollisionBounds(){
        this.collisionBounds.x = this.parent.position.x+this.position.x - this.spriteSheet.spriteSize.width;
        this.collisionBounds.y = this.parent.position.y+this.position.y - this.spriteSheet.spriteSize.height;        
        this.collisionBounds.width = this.spriteSheet.spriteSize.width*2;
        this.collisionBounds.height = this.spriteSheet.spriteSize.height*2;
    }

    update = (deltaTime) => {
        this.nextFrame(deltaTime);
        this.brain(deltaTime);
        this.setupCollisionBounds();
        this.children.forEach(child=>child.update(deltaTime));

        if(this.visible){
            if(this.showDebug) drawBox(this.gameController.currentScene.backBuffer, this.collisionBounds.x, this.collisionBounds.y , this.collisionBounds.width, this.collisionBounds.height, "red");
            this.drawSprite(deltaTime);
            if(this.showDebug) drawCircle(this.gameController.currentScene.backBuffer, this.parent.position.x+this.position.x, this.parent.position.y+this.position.y, 4, "red");
        }
        this.processCamera();
    }

    processCamera(){
        if(this.camera){
            // const halfScreenWidth = (screenBuffer.canvas.width/(this.gameController.camera.zoom*2));
            // const halfScreenHeight = (screenBuffer.canvas.height/(this.gameController.camera.zoom*2));
            this.camera.offWindow.x = this.parent.position.x+this.position.x - this.camera.screenWindow.width / 2;
            this.camera.offWindow.y = this.parent.position.y+this.position.y - this.camera.screenWindow.height / 2;
        }        
    }

    hit(direction, force){}
}

class EmptyEntity extends Entity{   
    constructor (gameController, id, position) {
        super(gameController, id, null, position);
    }
    update = (deltaTime) => {}
}
