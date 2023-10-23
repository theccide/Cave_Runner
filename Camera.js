class Camera{
    backCanvas = null;
    screenWindow = {x:0,y:0,width:0,height:0}    
    offWindow = {x:0,y:0,width:0,height:0}
    scaledWindow = {x:0,y:0,width:0,height:0}
    zoom = 3;

    constructor(params){
        this.backCanvas = params.backCanvas;
        this.screenWindow = params.screenWindow;
        this.offWindow = params.offWindow;
        this.setZoom(this.zoom);
    }

    setZoom(zoom){
        this.zoom = zoom;
        const scaledWidth = this.screenWindow.width/this.zoom;
        const scaledHeight = this.screenWindow.height/this.zoom;

        const widthDiff = (this.screenWindow.width - scaledWidth)/2;
        const heightDiff = (this.screenWindow.height - scaledHeight)/2;
        this.scaledWindow={x:widthDiff,y:heightDiff,width:scaledWidth,height:scaledHeight}
    }

    render(screenBuffer){

        drawImageSpriteFrom00(screenBuffer, this.backCanvas,             
            this.offWindow.x+this.scaledWindow.x, this.offWindow.y+this.scaledWindow.y, this.scaledWindow.width, this.scaledWindow.height,
            this.screenWindow.x, this.screenWindow.y, this.screenWindow.width, this.screenWindow.height,
        );
    }
}