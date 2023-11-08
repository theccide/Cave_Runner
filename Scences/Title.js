class Title extends Scene{
    images = {}
    loaded = false;
    msg = "Loading";

    readyToStart = false;
    readyCallback(self){
        self.readyToStart = true;
    }

    getMouseInput=(event)=>{
        if(event.type == "down"){
            screenBuffer.globalAlpha = 1;
            if(this.readyToStart)
                changeScene(new Story())
        }
    }    
    getMouseMoveInput=(event)=>{}
    getKeyboardInput=(event)=>{}

    constructor () {
        super();
        loadImages(["Images/titlescreen.png","Images/spritemaps/fx.png"],this.finishedLoading(this));
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
        this.spinner = new Fx({images, currentScene:{backBuffer:screenBuffer}}, "spinner",{fxType:3, destroyOnFinishAnim: false}, {x:0,y:0})
        //this.button = new Button(this, -2, {x:0,y:0,width:50, height:50},"yellow","Play",this.buttonClicked);
    }
    buttonClicked (self, id) {
        console.log("clicked");
    }
    update(dtPackage){
        super.update(dtPackage);
        if(!this.loaded) return;
        drawImage(screenBuffer, this.images["Images/titlescreen.png"],canvas.width/2,canvas.height/2,canvas.height/2,canvas.height/2);
        if(this.readyToStart){
            screenBuffer.globalAlpha = 1;
            drawText(screenBuffer, ((canvas.width/2)-150)-3,(canvas.height*.95)-3,"Click To Start",50, "black");
            drawText(screenBuffer, (canvas.width/2)-150,canvas.height*.95,"Click To Start",50, "yellow");
        }
        else{
            drawText(screenBuffer, ((canvas.width/2)-150)-3,(canvas.height*.95)-3,loadingStatus,50, "black");
            drawText(screenBuffer, (canvas.width/2)-150,canvas.height*.95,loadingStatus,50, "yellow");

            this.spinner.position.x=((canvas.width/2)-190);
            this.spinner.position.y=canvas.height*.93;
            this.spinner.update(dtPackage);
        }
        //this.button.update(dt);
    }
}