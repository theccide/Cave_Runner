function clearCircle(ctx, x, y, radius) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
}

class LargeMap extends Scene {

    gameController = null;

    getMouseInput=(event)=>{ this.gameController.getMouseInput(event);}    
    getMouseMoveInput=(event)=>{this.gameController.getMouseMoveInput(event);}
    getKeyboardInput=(event)=>{this.gameController.getKeyboardInput(event);}

    constructor(){ super();
        this.mapSize = {width: 1888,height: 928};
        this.setup({
            viewBounds:{x:0,y:0,width: canvas.width,height: canvas.height},
            offBounds:{x:0,y:0,width: this.mapSize.width,height: this.mapSize.height}            
        });
        this.gameController = new GameController();
        this.backBuffer.imageSmoothingEnabled= false;
        this.camera = new Camera({
            backCanvas:this.backCanvas,
            screenWindow:{x:0,y:0,width: canvas.width, height:canvas.height},
            offWindow:{x:0,y:0,width: this.mapSize.width,height: this.mapSize.height}
        });

        this.blackCanvas = createBufferedImage(this.mapSize.width, this.mapSize.height);
        this.blackBuffer = this.blackCanvas.getContext('2d');       

        this.gameController.start(this);
    }

    update(dt){
        super.update(dt);
        this.gameController.update(dt);
        this.camera.render(screenBuffer);

        if(this.gameController.player){
            drawBox(this.blackBuffer,0,0,this.camera.offWindow.width, this.camera.offWindow.height,"black");
            // drawImageFrom00(this.blackBuffer, this.gameController.images["Images/map1.png"],0,0,this.camera.offWindow.width, this.camera.offWindow.height);
            clearCircle(this.blackBuffer, this.gameController.player.position.x, this.gameController.player.position.y, 100);

            this.gameController.entities.forEach(entity => {
                clearCircle(this.blackBuffer, entity.position.x, entity.position.y, 100);                
            });

            drawImageSpriteFrom00(screenBuffer, this.blackCanvas,             
                this.camera.offWindow.x, this.camera.offWindow.y, 
                this.camera.screenWindow.width, this.camera.screenWindow.height,

                this.camera.screenWindow.x, this.camera.screenWindow.y, 
                this.camera.screenWindow.width, this.camera.screenWindow.height,
            );            
        }

    }
}