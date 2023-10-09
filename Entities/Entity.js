class Entity {
        
    // ANIMATION VARIABLES
    spriteSheet = {sprite:null,fileName:'',spriteSize:{width:0,height:0},cellSize:{width:0,height:0},grid:{rows:0,columns:0}};
    frame = 0;
    elapsedTime = 0;
    currentAnimation = "";
    frameChangeInterval = 0.1;//IN SECONDS
    animationQueue = [];
    nonInteruptable = false;
    
    position = {x:0, y:0};
    
    constructor (gameController, spriteSheet, position) {
        this.gameController = gameController;
        this.spriteSheet = spriteSheet;
        this.spriteSheet.sprite = gameController.images[spriteSheet.fileName];
        this.position = position;
        this.currentAnimation = this.spriteSheet.startAnimation;
    }
    
    changeState = (state) => {this.state = state;}

    findWaypoint = () => {
        this.gameController.levelMap.aStar.setup({x:Math.floor(this.position.x/32),y:Math.floor(this.position.y/32)}, this.target, this.gameController.levelMap.grid);
        this.path = this.gameController.levelMap.aStar.findPath().map(pos=>{return {x:(pos.x*32)+16,y:(pos.y*32)+16}}).reverse();
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
    
    brain = (deltaTime) => {}

    update = (deltaTime) => {
        this.nextFrame(deltaTime);
        this.brain(deltaTime);
        this.drawSprite(deltaTime);
    }
}
