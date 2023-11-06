class Scene{
    camera = null;
    backCanvas = null;
    backBuffer = null;
    viewBounds={x:0,y:0,width:0,height:0};
    offBounds={x:0,y:0,width:0,height:0};

    setup(params){
        this.offBounds=params.offBounds;
        this.viewBounds=params.viewBounds;
        this.backCanvas = createBufferedImage(params.offBounds.width, params.offBounds.height);
        this.backBuffer = this.backCanvas.getContext('2d');        
    }

    update({dt, currentTime, gameTime}){
        this.backBuffer.clearRect(0, 0, this.offBounds.width, this.offBounds.height); //clear canvas
    }

    init(){}
}