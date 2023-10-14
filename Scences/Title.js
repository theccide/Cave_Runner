class Title extends Scene{
    images = {}
    loaded = false;

    getMouseInput=(event)=>{
        if(event.type == "down"){
            screenBuffer.globalAlpha = 1;
            changeScene(new LargeMap())
        }
    }    
    getMouseMoveInput=(event)=>{}
    getKeyboardInput=(event)=>{}

    constructor () {
        super();
        this.setup({
            viewBounds:{x:0,y:0,width: canvas.width,height: canvas.height},
            offBounds:{x:0,y:0,width: canvas.width,height: canvas.height}            
        });
        loadImages(["Images/titlescreen.png"],this.finishedLoading(this));
    }
    finishedLoading = (self) => (images) => {
        self.images = images;
        self.loaded = true;
        this.button = new Button(this, -2, {x:0,y:0,width:50, height:50},"yellow","Play",this.buttonClicked);
    }
    buttonClicked (self, id) {
        console.log("clicked");
    }
    update(dt){
        super.update(dt);
        if(!this.loaded) return;
        drawImage(screenBuffer, this.images["Images/titlescreen.png"],canvas.height,canvas.height/2,canvas.height/2,canvas.height/2);
        // this.button.update(dt);
    }
}