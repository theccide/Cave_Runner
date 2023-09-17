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
        loadImages(["Images/game_over_placehold.png"],this.finishedLoading(this));
    }
    finishedLoading = (self) => (images) => {
        self.images = images;
        self.loaded = true;
    }
    update(dt){
        super.update(dt);
        if(!this.loaded) return;
        drawImageFrom00(screenBuffer, this.images["Images/game_over_placehold.png"],0,0,canvas.width,canvas.height);
        drawText(screenBuffer, 750, 60,"SCORE : "+this.score,30,"blue");
    }
}