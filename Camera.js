class Camera{
    backCanvas = null;
    screenWindow = {x:0,y:0,width:0,height:0}    
    offWindow = {x:0,y:0,width:0,height:0}
    scaledWindow = {x:0,y:0,width:0,height:0}
    zoom = 3;
    shake = true;
    shakeIntensity = {x:0,y:0};

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
        // console.log(this.offWindow);
        const x = Tools.clamp(this.offWindow.x+this.scaledWindow.x,0,this.offWindow.width-this.scaledWindow.width);
        const y = Tools.clamp(this.offWindow.y+this.scaledWindow.y,0,this.offWindow.height-this.scaledWindow.height);
        let dx = 0, dy = 0;
        if(this.shake && !paused){
            dx = Math.random() * this.shakeIntensity.x * 2 - this.shakeIntensity.x;
            dy = Math.random() * this.shakeIntensity.y * 2 - this.shakeIntensity.y; 
        }
        drawImageSpriteFrom00(screenBuffer, this.backCanvas,             
            x+dx, y+dy, this.scaledWindow.width, this.scaledWindow.height,
            this.screenWindow.x, this.screenWindow.y, this.screenWindow.width, this.screenWindow.height,
        );
    }
}