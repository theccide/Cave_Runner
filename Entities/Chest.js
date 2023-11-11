class Chest extends Entity{
    showItem = false;
    scrollY = 10;
    constructor (gameController, id, params, position) {
        super(gameController, id, null, position);
        // 240x256
        this.initSpriteSheet( {
            sprite: null,
            fileName: "Images/spritemaps/chests.png",
            cellSize: { width: 48, height: 32 },
            spriteSize: { width: 48, height: 32 },
            grid: { rows: 8, columns: 5 },
            startAnimation: "IDLE",
            animations:{
                "IDLE":   [[0,4],[1,4],[3,4],[2,4],[3,4],[4,4]],   // 4
                "OPENING": [[0,5],[1,5],[3,5],[2,5],[3,5],[4,5]],  // 5
                "OPEN": [[4,5]]                                    // 4
            }
        }); 
        this.frameChangeInterval = 0.2;

        this.gameController.levelMap.switchCellValueFromMap({ x:this.position.x, y:this.position.y+20},1);
        this.gameController.levelMap.switchCellValueFromMap({ x:this.position.x, y:this.position.y},1);
        this.gameController.levelMap.switchCellValueFromMap({ x:this.position.x-30, y:this.position.y+20},1);
        this.gameController.levelMap.switchCellValueFromMap({ x:this.position.x-30, y:this.position.y},1);

        //this.gameController.levelMap.switchCellValueFromMap(this.position,1);
    }

    hit(){
        this.switchAnimation("OPENING");
        this.endAnimationCallback=()=>{
            this.switchAnimation("OPEN");
            this.showItem = true;
            this.gameController.player.inventory.questItems.Maguffin=1;            
        }
    }
    
    drawSprite=({dt, currentTime, gameTime})=>{
        if(this.showItem) {
            this.scrollY = this.scrollY-(50*dt);
            if(this.scrollY < -25) {
                this.showItem = false;
                this.gameController.currentScene.dialogManager.setupDialog(["You obtained the Maguffin spell that allows you to walk on lava."]);
            }
        
            drawImage(this.gameController.currentScene.backBuffer,
                this.gameController.images["Images/scroll.png"],
                this.position.x+this.parent.position.x-20,
                this.position.y+this.parent.position.y+this.scrollY,
                32,32
            );
        }

        this.nextFrame({dt, currentTime, gameTime});

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
}

