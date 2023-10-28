class GameOver extends Scene{
    images = {}
    loaded = false;

    constructor (score) {
        super();
        this.score = score;
        this.setup({
            viewBounds:{x:0,y:0,width: canvas.width,height: canvas.height},
            offBounds:{x:0,y:0,width: canvas.width,height: canvas.height}            
        });
        loadImages(["Images/gameover.png"],this.finishedLoading(this));
    }
    finishedLoading = (self) => (images) => {
        self.images = images;
        self.loaded = true;
    }
    update(dt){
        super.update(dt);
        if(!this.loaded) return;
        drawBox(screenBuffer,0,0,canvas.width, canvas.height, 'black');
        drawImage(screenBuffer, this.images["Images/gameover.png"],canvas.height,canvas.height/2,canvas.height/2,canvas.height/2);
        // drawText(screenBuffer, 750, 60,"SCORE : "+this.score,30,"yellow");
    }

    getMouseInput=(event)=>{ }    
    getMouseMoveInput=(event)=>{}
    getKeyboardInput=(event)=>{}
}