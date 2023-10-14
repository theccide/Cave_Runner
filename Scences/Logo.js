class Logo extends Scene{
    images = {}
    loaded = false;
    alpha = 0;
    fadeIn = true;

    getMouseInput=(event)=>{if(event.type == "down")changeScene(new LargeMap())}    
    getMouseMoveInput=(event)=>{}
    getKeyboardInput=(event)=>{}

    constructor () {
        super();
        this.setup({
            viewBounds:{x:0,y:0,width: canvas.width,height: canvas.height},
            offBounds:{x:0,y:0,width: canvas.width,height: canvas.height}            
        });
        loadImages(["Images/logo.png"],this.finishedLoading(this));
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

    update(dt){
        super.update(dt);
        if(!this.loaded) return;

        screenBuffer.clearRect(0, 0, canvas.width, canvas.height);

        const currentTime = (new Date()).getTime();
        const deltaTime = currentTime - this.lastTime;
        if (deltaTime >= this.frameInterval) {
            this.lastTime = currentTime;
            if (this.fadeIn) this.alpha += 0.01; else this.alpha -= 0.01;
            if (this.alpha >= 1){ 
                this.lastTime = currentTime+2000;
                this.fadeIn = false; 
            }
            else if (this.alpha <= 0) {
                changeScene(new Title())
                // this.fadeIn = true;
            }
        }
        screenBuffer.globalAlpha = this.alpha;
        // console.log(screenBuffer.globalAlpha);
        
        drawImage(screenBuffer, this.images["Images/logo.png"],canvas.height,canvas.height/2,canvas.height/2,canvas.height/2);
        // this.button.update(dt);
    }
}