class Entity {
    spriteSheet = {sprite:null,fileName:'',spriteSize:{width:0,height:0},cellSize:{width:0,height:0},grid:{rows:0,columns:0}};
    position = {x:0, y:0};
    direction = "none";
    isMoving = false;
    constructor (gameController, spriteSheet) {
        this.gameController = gameController;
        this.spriteSheet = spriteSheet;
        this.spriteSheet.sprite = gameController.images[spriteSheet.fileName];
    }
    update = (deltaTime) => {
        drawImageSprite(this.spriteSheet.sprite,0,0,
                this.spriteSheet.cellSize.width,
                this.spriteSheet.cellSize.height,
                this.position.x,
                this.position.y,
                this.spriteSheet.spriteSize.width,
                this.spriteSheet.spriteSize.height,45            
            );
    }
}