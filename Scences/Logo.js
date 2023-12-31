class Logo extends Scene{
    images = {}
    loaded = false;
    alpha = 0;
    fadeIn = true;

    getMouseInput=(event)=>{}    
    getMouseMoveInput=(event)=>{}
    getKeyboardInput=(event)=>{}

    constructor () {
        super();
        loadImages(["Images/logo.png"],this.finishedLoading(this));
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
            if (this.fadeIn) this.alpha += 0.01; else this.alpha -= 0.01;
            if (this.alpha >= 1){ 
                this.lastTime = gameTime+2000;
                this.fadeIn = false; 
            }
            else if (this.alpha <= 0) {
                //changeScene(new Title())
                changeScene(titleScreen);
                // this.fadeIn = true;
            }
        }
        screenBuffer.globalAlpha = this.alpha;
        // console.log(screenBuffer.globalAlpha);
        
        drawImage(screenBuffer, this.images["Images/logo.png"],canvas.width/2,canvas.height/2,canvas.height/2,canvas.height/2);
        // this.button.update(dt);
    }
}