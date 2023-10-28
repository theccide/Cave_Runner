class Story extends Scene{
    images = {}
    loaded = false;
    // storyText = 'A fearless treasure hunter embarks on a perilous journey through a treacherous cave filled with ancient secrets and deadly traps.';

    getMouseInput=(event)=>{
        if(event.type == "down"){
            changeScene(new LargeMap())
        }
    }    
    getMouseMoveInput=(event)=>{}
    getKeyboardInput=(event)=>{}

    wrapText(context, text, x, y, maxWidth, lineHeight) {
        maxWidth = 650; // Width of the rectangle
        lineHeight = 25; // Height between lines
        x = (canvas.width - maxWidth) / 2;
        y = 60;
        context.font = "25px monospace";
        var words = text.split(' ');
        var line = '';
    
        context.strokeStyle = '#aaa';
        context.fillStyle = '#0000007F';
        context.beginPath();
        context.rect(x-25, y-50, maxWidth, canvas.height - y*2);
        context.fill();
        context.stroke();

        context.fillStyle = "white";
        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }
        
        context.fillText(line, x, y);        
    }

    constructor () {
        super();
        this.setup({
            viewBounds:{x:0,y:0,width: canvas.width,height: canvas.height},
            offBounds:{x:0,y:0,width: canvas.width,height: canvas.height}            
        });
        screenBuffer.globalAlpha = 1;
        loadImages([`${localStorage.getItem("S3_BUCKET")}/generated_image.png`],this.finishedLoading(this));
        const audio = new Audio(`${localStorage.getItem("S3_BUCKET")}/generatedSound.mp3`);
        audio.play();
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
        drawImage(screenBuffer, this.images[`${localStorage.getItem("S3_BUCKET")}/generated_image.png`],canvas.height,canvas.height/2,canvas.height/2,canvas.height/2);
        this.wrapText(screenBuffer, storyContent);
        // this.button.update(dt);
    }
}