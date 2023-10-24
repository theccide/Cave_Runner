
function clearRingCircles(ctx, x, y, radius, alpha){
    for(let i=0; i<3; i++){
        clearCircle(ctx, x, y, radius-(i * radius*0.2), alpha);
        //clearCircle(ctx, x, y, radius-(i * radius*0.2), alpha*((3-i)/3));
    }
}

function clearCircle(ctx, x, y, radius, alpha) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
}

class LargeMap extends Scene {
    first = true;
    gameController = null;
    useDarkOverlay = true;
    isTransitioning = true;
    transitionCrop = 500;

    getMouseInput=(event)=>{ this.gameController.getMouseInput(event);}    
    getMouseMoveInput=(event)=>{this.gameController.getMouseMoveInput(event);}
    getKeyboardInput=(event)=>{this.gameController.getKeyboardInput(event);}

    constructor(){ super();
        this.mapSize = {width: 2816,height: 1408};
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
        this.HUD = new HUD(this.gameController);
    }

    drawTransition(dt){
        this.gameController.camera.setZoom(this.gameController.camera.zoom - 2*dt);
        if(this.gameController.camera.zoom <= 1){
            this.gameController.camera.zoom = 1;
            this.isTransitioning = false;
        }
    }
    
    update(dt){
        super.update(dt);
        this.gameController.update(dt);
        this.camera.render(screenBuffer);

        const elapsed = (new Date()).getTime();
        const getFlicker=(brightness)=>{
            const amplitude = brightness*3; 
            const frequency = 0.005; 
            return amplitude * Math.sin(frequency * elapsed);
        }

        if(this.gameController.player && this.useDarkOverlay){
            this.blackBuffer.clearRect(0, 0,this.camera.offWindow.width, this.camera.offWindow.height);         
            drawBox(this.blackBuffer,0,0,this.camera.offWindow.width, this.camera.offWindow.height,"rgba(0, 0, 0, 0.9)");
            clearRingCircles(this.blackBuffer, this.gameController.player.position.x, this.gameController.player.position.y, 100+getFlicker(this.gameController.player.brightness), 0.8);

            this.gameController.entities.forEach(entity => {
                if(entity.isLightSource){

                    clearRingCircles(this.blackBuffer, entity.position.x, entity.position.y, 50+(entity.brightness*50)+getFlicker(entity.brightness), entity.brightness);
                }
            });

            const x = Tools.clamp(this.camera.offWindow.x+this.camera.scaledWindow.x,0,this.camera.offWindow.width-this.camera.scaledWindow.width);
            const y = Tools.clamp(this.camera.offWindow.y+this.camera.scaledWindow.y,0,this.camera.offWindow.height-this.camera.scaledWindow.height);    
            drawImageSpriteFrom00(screenBuffer, this.blackCanvas,
                x, y,
                this.camera.scaledWindow.width, this.camera.scaledWindow.height,
                this.camera.screenWindow.x, this.camera.screenWindow.y, 
                this.camera.screenWindow.width, this.camera.screenWindow.height
            );
        }
        
        if(this.isTransitioning) this.drawTransition(dt);
        this.HUD.update(dt);
    }
}