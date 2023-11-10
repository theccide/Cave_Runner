
function clearRingRect(ctx, x, y, width, height, alpha, flicker){
    const layer1 = 3*(flicker+6);
    const layer2 = 1*(flicker+6);
    clearRectAlpha(ctx, x-layer1, y-layer1, width+layer1*2, height+layer1*2, alpha/4);
    clearRectAlpha(ctx, x-layer2, y-layer2, width+layer2*2, height+layer2*2, alpha/3);
    clearRectAlpha(ctx, x, y, width, height, alpha);
}

function clearRectAlpha(ctx, x, y, width, height, alpha){
    ctx.globalCompositeOperation = 'destination-out';
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
}

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
    isTransitioning = true;
    transitionCrop = 500;

    getMouseInput=(event)=>{ this.gameController.getMouseInput(event);}    
    getMouseMoveInput=(event)=>{this.gameController.getMouseMoveInput(event);}
    getKeyboardInput=(event)=>{this.gameController.getKeyboardInput(event);}

    constructor(){ 
        super();
        this.init();
    }

    init(){
        this.mapSize = {width: 2816,height: 1408};
        this.setup({
            viewBounds:{x:0,y:0,width: canvas.width,height: canvas.height},
            offBounds:{x:0,y:0,width: this.mapSize.width,height: this.mapSize.height}            
        });
        this.backBuffer.imageSmoothingEnabled= false;
        this.blackCanvas = createBufferedImage(this.mapSize.width, this.mapSize.height);
        this.blackBuffer = this.blackCanvas.getContext('2d');  

        if(!this.camera){ // create a new camera the first time this loads
            this.gameController = new GameController();
            this.camera = new Camera({
                backCanvas:this.backCanvas,
                screenWindow:{x:0,y:0,width: canvas.width, height:canvas.height},
                offWindow:{x:0,y:0,width: this.mapSize.width,height: this.mapSize.height}
            });
            this.gameController.start(this);
        }
        else{ // if the screen size changes use the old camera
            this.camera.init({
                backCanvas:this.backCanvas,
                screenWindow:{x:0,y:0,width: canvas.width, height:canvas.height},
                offWindow:{x:0,y:0,width: this.mapSize.width,height: this.mapSize.height}
            });
        }
        
        this.HUD = new HUD(this.gameController);
    }

    drawTransition({dt, currentTime, gameTime}){
        this.gameController.camera.setZoom(this.gameController.camera.zoom - 2*dt);
        if(this.gameController.camera.zoom <= 1){
            this.gameController.camera.zoom = 1;
            this.isTransitioning = false;
        }
    }
    
    update({dt, currentTime, gameTime}){
        super.update({dt, currentTime, gameTime});
        this.gameController.update({dt, currentTime, gameTime});
        this.camera.render(screenBuffer);

        const elapsed = gameTime;
        const getFlicker=(brightness, frequency)=>{
            const amplitude = brightness*3; 
            return amplitude * Math.sin(frequency * elapsed);
        }

        if(this.gameController.player && this.gameController.useDarkOverlay){
            this.blackBuffer.clearRect(0, 0,this.camera.offWindow.width, this.camera.offWindow.height);         
            drawBox(this.blackBuffer,0,0,this.camera.offWindow.width, this.camera.offWindow.height,`rgba(0, 0, 0, ${this.gameController.darkOverlayLevel})`);
            clearRingCircles(this.blackBuffer, this.gameController.player.position.x, this.gameController.player.position.y, 100+getFlicker(this.gameController.player.brightness, 0.005), 0.4);
            this.gameController.player.children.forEach(child => {
                if(child.isLightSource){
                    clearRingCircles(this.blackBuffer, this.gameController.player.position.x+child.position.x, this.gameController.player.position.y+child.position.y, 50+(child.brightness*50)+getFlicker(child.brightness,0.005), child.brightness);
                }
            });

            clearRingRect(this.blackBuffer, 1435,260,135,417,0.9,getFlicker(0.9,0.002));
            clearRingRect(this.blackBuffer, 1570,40,350,405+8,0.9,getFlicker(0.9,0.002));
            clearRingRect(this.blackBuffer, 1570+350,270,190,180,0.9,getFlicker(0.9,0.002));

            this.gameController.entities.forEach(entity => {
                if(entity.isLightSource){
                    clearRingCircles(this.blackBuffer, entity.position.x+entity.lightOffset.x, entity.position.y+entity.lightOffset.y, 50+(entity.brightness*50)+getFlicker(entity.brightness,0.005), entity.brightness);
                }
                entity.children.forEach(child => {
                    if(child.isLightSource){
                        clearRingCircles(this.blackBuffer, entity.position.x+child.position.x, entity.position.y+child.position.y, 50+(child.brightness*50)+getFlicker(child.brightness,0.005), child.brightness);
                    }
                });
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
        
        if(this.isTransitioning) this.drawTransition({dt, currentTime, gameTime});
        this.dialogManager.update({dt, currentTime, gameTime});
        this.HUD.update({dt, currentTime, gameTime});
        if(paused && Math.floor(currentTime/500)%2==0)        
                drawText(screenBuffer, 85, 130, "PAUSED")//, 25, "yellow")
    }
}