class Camera{
    backCanvas = null;
    screenWindow = {x:0,y:0,width:0,height:0}    
    offWindow = {x:0,y:0,width:0,height:0}

    constructor(params){
        this.backCanvas = params.backCanvas;
        this.screenWindow = params.screenWindow;
        this.offWindow = params.offWindow;
    }

    render(screenBuffer){
        drawImageSpriteFrom00(screenBuffer, backCanvas,             
            this.offWindow.x, this.offWindow.y, this.offWindow.width, this.offWindow.height,
            this.screenWindow.x, this.screenWindow.y, this.screenWindow.width, this.screenWindow.height,
        );
    }
}