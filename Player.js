class Player extends Entity {
    camera = null;
    moveDirection = { x: 0, y: 0 };
    spriteDir = 0;

    frame = 0;
    elapsedTime = 0;
    frameChangeInterval = 0.1;//IN SECONDS

    getMouseInput = (event) => {}
    getMouseMoveInput = (event) => {}
    getKeyboardInput = (event) => {
        if (event.type === "down") {
            if (event.key === "w") {this.moveDirection.y = -1; this.spriteDir = 3;}
            else if (event.key === "s") {this.moveDirection.y = 1; this.spriteDir = 0;}
            if (event.key === "a") {this.moveDirection.x = -1; this.spriteDir = 1;}
            else if (event.key === "d") {this.moveDirection.x = 1; this.spriteDir = 2;}
        } else if (event.type === "up") {
            if (event.key === "w" || event.key === "s") this.moveDirection.y = 0;
            if (event.key === "a" || event.key === "d") this.moveDirection.x = 0;
        }
    }


    constructor(gameController) {
        super(gameController, {
            sprite: null,
            fileName: "Images/player_sheet.png",
            cellSize: { width: 11, height: 24 },
            spriteSize: { width: 11, height: 24 },
            grid: { rows: 4, columns: 4 },
        },
        { x: (32 * 4) + 16, y: (32 * 4) + 16 });
        this.camera = gameController.camera;
    }

    nextFrame = (deltaTime) => {
        this.elapsedTime += deltaTime;

        if (this.elapsedTime >= this.frameChangeInterval) {
            this.frame += 1;
            this.frame %= 4;
            this.elapsedTime = 0; // Reset the elapsed time
        }
    }

    update = (deltaTime) => {

        this.nextFrame(deltaTime);
        if(this.moveDirection.x != 0) {
            if(this.moveDirection.x > 0){this.spriteDir = 2;}
            else{this.spriteDir = 1;}
        }
        else{
            if(this.moveDirection.y != 0) {
                if(this.moveDirection.y > 0){this.spriteDir = 0;}
                else{this.spriteDir = 3;}
            }
            else this.frame = 0;
        }
        //if(this.moveDirection.x == 0 && this.moveDirection.y == 0) this.frame = 0;

        this.camera.offWindow.x = this.position.x - this.camera.offWindow.width / 2;
        this.camera.offWindow.y = this.position.y - this.camera.offWindow.height / 2;


        drawImageSprite(this.gameController.currentScene.backBuffer,
            this.spriteSheet.sprite,1 + (12 * this.frame),1 + (25 * this.spriteDir),
            this.spriteSheet.cellSize.width,
            this.spriteSheet.cellSize.height,
            this.position.x,
            this.position.y,
            this.spriteSheet.spriteSize.width,
            this.spriteSheet.spriteSize.height            
        );


        if(this.gameController.levelMap.findCellFrom({x:this.position.x+(this.moveDirection.x*10), y:this.position.y}).col === 0) this.position.x += this.speed * this.moveDirection.x * deltaTime;
        if(this.moveDirection.y < 0) {if(this.gameController.levelMap.findCellFrom({x:this.position.x, y:this.position.y+(this.moveDirection.y*15)}).col === 0) this.position.y += this.speed * this.moveDirection.y * deltaTime;}
        else {if(this.gameController.levelMap.findCellFrom({x:this.position.x, y:this.position.y+(this.moveDirection.y*25)}).col === 0) this.position.y += this.speed * this.moveDirection.y * deltaTime;}
    }
}
