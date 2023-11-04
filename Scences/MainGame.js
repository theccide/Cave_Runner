class MainGame extends Scene {

    gameController = null;

    getMouseInput=(event)=>{ this.gameController.getMouseInput(event);}    
    getMouseMoveInput=(event)=>{this.gameController.getMouseMoveInput(event);}
    getKeyboardInput=(event)=>{this.gameController.getKeyboardInput(event);}

    constructor(){ super();

        this.setup({
            viewBounds:{x:0,y:0,width: canvas.width,height: canvas.height},
            offBounds:{x:0,y:0,width: 1888,height: 928}            
        });
        this.gameController = new GameController();
        this.backBuffer.imageSmoothingEnabled = false;
        this.camera = new Camera({
            backCanvas:this.backCanvas,
            screenWindow:{x:0,y:0,width: canvas.width, height:canvas.height},
            offWindow:{x:0,y:0,width:250,height:250}
        });

        this.gameController.start(this);
    }

    update({dt, currentTime, gameTime}){
        super.update({dt, currentTime, gameTime});
        this.gameController.update({dt, currentTime, gameTime});
        this.camera.render(screenBuffer);

        if(this.gameController.images["Images/lightsource.png"])
            drawImageFrom00(screenBuffer, this.gameController.images["Images/lightsource.png"],0,0,canvas.width,canvas.height);
    }
}