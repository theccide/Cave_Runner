class Credits extends Scene{
    images = {}
    loaded = false;
    alpha = 0;
    fadeIn = true;

    getMouseInput=(event)=>{}    
    getMouseMoveInput=(event)=>{}
    getKeyboardInput=(event)=>{}

    constructor () {
        super();
        loadImages(["Images/credits.png"],this.finishedLoading(this));
        this.init();
    }

    init(){
        this.setup({
            viewBounds:{x:0,y:0,width: canvas.width,height: canvas.height},
            offBounds:{x:0,y:0,width: canvas.width,height: canvas.height}            
        });
    }

    finishedLoading = (self) => (images) => {
        self.images = images;
        self.loaded = true;
    }
    buttonClicked (self, id) {
        console.log("clicked");
    }

    frameRate = 60; // Frames per second (FPS)
    frameInterval = 1000 / this.frameRate; // Interval in milliseconds
    lastTime = 0;    

    update({dt, currentTime, gameTime}){
        super.update({dt, currentTime, gameTime});
        if(!this.loaded) return;

        screenBuffer.clearRect(0, 0, canvas.width, canvas.height);

        const deltaTime = gameTime - this.lastTime;
        if (deltaTime >= this.frameInterval) {
            this.lastTime = gameTime;
            if (this.fadeIn) this.alpha += 0.01;
            if (this.alpha >= 1){ 
                this.lastTime = gameTime+2000;
                this.fadeIn = false; 
            }
        }
        screenBuffer.globalAlpha = this.alpha;
        // console.log(screenBuffer.globalAlpha);
        
        drawImage(screenBuffer, this.images["Images/credits.png"],canvas.width/2,canvas.height/2,canvas.height/2,canvas.height/2);
        // drawText(screenBuffer, 400,500,"Jamie Whitten",25,"yellow");
        // this.button.update(dt);
    }
}