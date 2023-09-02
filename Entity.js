class Entity {
    spriteSheet = {sprite:null,cellSize:{width:16,height:16},grid:{rows:4,columns:4}};
    direction = "none";
    isMoving = false;
    constructor (gameController, spriteSheet) {
        this.gameController = gameController;
        this.spriteSheet = gameController.images[spriteSheet];
    }
    update = (deltaTime) => {
        drawImageSprite(this.spriteSheet,0,0,16,16,0,0,100,100);
    }
}