class Entity {
    
    //TODO: remove this from here
    states = { IDLE : 0, SEARCHING : 1, CHASING : 2 };
    state = this.states.CHASING;
    
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

    brain = (deltaTime) => {}

    update = (deltaTime) => {
        this.nextFrame(deltaTime);
        this.brain(deltaTime);
        this.drawSprite(deltaTime);
    }
}
