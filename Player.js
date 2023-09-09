class Player extends Entity {
    camera = null;
    moveDirection = { x: 0, y: 0 };


    getMouseInput = (event) => {}
    getMouseMoveInput = (event) => {}
    getKeyboardInput = (event) => {
        if (event.type === "down") {
            if (event.key === "w") this.moveDirection.y = -1;
            else if (event.key === "s") this.moveDirection.y = 1;
            if (event.key === "a") this.moveDirection.x = -1;
            else if (event.key === "d") this.moveDirection.x = 1;
        } else if (event.type === "up") {
            if (event.key === "w" || event.key === "s") this.moveDirection.y = 0;
            if (event.key === "a" || event.key === "d") this.moveDirection.x = 0;
        }
    }


    constructor(gameController) {
        super(gameController, {
            sprite: null,
            fileName: "Images/player_testing.png",
            cellSize: { width: 16, height: 16 },
            spriteSize: { width: 16, height: 16 },
            grid: { rows: 4, columns: 4 },
        },
        { x: (32 * 4) + 16, y: (32 * 4) + 16 });
        this.camera = gameController.camera;
    }


    update = (deltaTime) => {
        this.camera.offWindow.x = this.position.x - this.camera.offWindow.width / 2;
        this.camera.offWindow.y = this.position.y - this.camera.offWindow.height / 2;


        drawImageSprite(this.gameController.currentScene.backBuffer,
            this.spriteSheet.sprite,0,0,
            this.spriteSheet.cellSize.width,
            this.spriteSheet.cellSize.height,
            this.position.x,
            this.position.y,
            this.spriteSheet.spriteSize.width,
            this.spriteSheet.spriteSize.height            
        );


        if(this.gameController.levelMap.findCellFrom({x:this.position.x+(this.moveDirection.x*8), y:this.position.y}).col === 0) this.position.x += this.speed * this.moveDirection.x * deltaTime;
        if(this.gameController.levelMap.findCellFrom({x:this.position.x, y:this.position.y+(this.moveDirection.y*8)}).col === 0) this.position.y += this.speed * this.moveDirection.y * deltaTime;
    }
}
