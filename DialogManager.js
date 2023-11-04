function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
  
    for(var n = 0; n < words.length; n++) {
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
  
  function fitTextInBox(ctx, text, x, y, width, height, fontSize, halign, valign, typeFace="monospace", color="white") {
    // Start with the largest font size and keep decreasing it until the text fits the width and height.
    let currentFontSize = fontSize;
    ctx.font = `${currentFontSize}px `+typeFace;
    let textMetrics = ctx.measureText(text);
    let lineHeight = currentFontSize * 1.2; // Line height is 20% greater than the font size
    let lines = text.split(' ').reduce((acc, word) => {
      let line = acc.length > 0 ? acc[acc.length - 1] : '';
      let testLine = line + word + ' ';
      let metrics = ctx.measureText(testLine);
  
      if (metrics.width > width) {
        acc.push(word + ' ');
      } else {
        acc[acc.length - 1] = testLine;
      }
      return acc;
    }, ['']);
  
    // Decrease font size if the text doesn't fit within the specified height.
    while ((lines.length * lineHeight > height) && currentFontSize > 0) {
      currentFontSize--;
      lineHeight = currentFontSize * 1.2;
      ctx.font = `${currentFontSize}px `+typeFace;
      lines = text.split(' ').reduce((acc, word) => {
        let line = acc.length > 0 ? acc[acc.length - 1] : '';
        let testLine = line + word + ' ';
        let metrics = ctx.measureText(testLine);
  
        if (metrics.width > width) {
          acc.push(word + ' ');
        } else {
          acc[acc.length - 1] = testLine;
        }
        return acc;
      }, ['']);
    }
  
    // Calculate the y position based on the vertical alignment
    let yPos = y;
    if (valign === 'middle') {
      yPos += (height - lines.length * lineHeight) / 2;
    } else if (valign === 'bottom') {
      yPos += height - lines.length * lineHeight;
    }
    // If valign is 'top', yPos is already correct
  
    // Draw the text line by line
    lines.forEach((line, index) => {
      // Align horizontally
      let xPos = x;
      textMetrics = ctx.measureText(line.trim());
      if (halign === 'center') {
        xPos += (width - textMetrics.width) / 2;
      } else if (halign === 'right') {
        xPos += width - textMetrics.width;
      }
      // If halign is 'left', xPos is already correct
  
      ctx.fillStyle=color;
      wrapText(ctx, line.trim(), xPos, yPos + index * lineHeight, width, lineHeight);
    });
    return currentFontSize;
  }
  
  
class Dialog{
    bounds = {x:0, y:0, width:0, height:0};
    innerbounds = {x:0, y:0, width:0, height:0};
    connerbounds = {x:0, y:0, width:0, height:0};
    dialogImage = null;
    boxSize = {width:0, height:0}
    maxBoxSize = {width:600, height:100}
    text = "";
    isVisible = false;
    isGrowing = true;
    transitionTime = 500;
    lastEventTime = 0;    
    fontSize = 22;
    lastFontSize = this.fontSize;
    typeFace="monospace"
    color="yellow"

    constructor(gameController){
        this.gameController = gameController;          
    }

    setupDialog(text){
        this.text = text;
        this.dialogImage = this.gameController.images["Images/dialog.png"];        
        this.bounds.x = canvas.width/2;
        this.bounds.y = canvas.height/2;
        this.innerbounds = {x:0, y:0, width:0, height:0};
        // if(this.lastEventTime == 0)
        this.lastEventTime = (new Date()).getTime();
        this.isVisible = true;
        this.isGrowing = true;
        this.boxSize.width=0;
        this.boxSize.height=0;
        this.setupBounds();
    }

    close(){
        // this.isVisible = false;
        this.lastEventTime = (new Date()).getTime();
        this.isShrinking = true;
    }

    setupBounds(){
        this.bounds.width = Math.floor(this.dialogImage.width/2)+this.boxSize.width;
        this.bounds.height = Math.floor(this.dialogImage.height/2)+this.boxSize.height;
        this.bounds.hwidth = Math.floor(this.bounds.width/2);
        this.bounds.hheight = Math.floor(this.bounds.height/2);

        this.innerbounds.x = 0;
        this.innerbounds.x = 0;
        this.innerbounds.width = this.dialogImage.width;
        this.innerbounds.height = this.dialogImage.height;
        this.innerbounds.hwidth = Math.floor(this.dialogImage.width/2);
        this.innerbounds.hheight = Math.floor(this.dialogImage.height/2);

        this.connerbounds.width = Math.floor(this.innerbounds.hwidth/3);
        this.connerbounds.height = Math.floor(this.innerbounds.hheight/3);
    }

    update({dt, currentTime, gameTime}){
        if(!this.isVisible) return;
        if(!this.gameController.resouncesReady) return;

        drawImageSprite(screenBuffer, this.gameController.images["Images/dialog.png"], 
                        0,0, this.innerbounds.hwidth, this.innerbounds.hheight,
                        this.bounds.x-this.bounds.hwidth,this.bounds.y-this.bounds.hheight,
                        this.connerbounds.width, this.connerbounds.height);
        drawImageSprite(screenBuffer, this.gameController.images["Images/dialog.png"], 
                        this.innerbounds.hwidth,0,this.innerbounds.hwidth,this.innerbounds.hheight,
                        this.bounds.x+this.bounds.hwidth,this.bounds.y-this.bounds.hheight,
                        this.connerbounds.width, this.connerbounds.height);
        drawImageSprite(screenBuffer, this.gameController.images["Images/dialog.png"], 
                        0,this.innerbounds.hheight,this.innerbounds.hwidth,this.innerbounds.hheight,
                        this.bounds.x-this.bounds.hwidth,this.bounds.y+this.bounds.hheight,
                        this.connerbounds.width,this.connerbounds.height);
        drawImageSprite(screenBuffer, this.gameController.images["Images/dialog.png"], 
                        this.innerbounds.hwidth,this.innerbounds.hheight,this.innerbounds.hwidth,this.innerbounds.hheight,this.bounds.x+this.bounds.hwidth,this.bounds.y+this.bounds.hheight,
                        this.connerbounds.width,this.connerbounds.height);

        drawImageSprite(screenBuffer, this.gameController.images["Images/dialog.png"], 
                        this.innerbounds.hwidth,0,1,this.innerbounds.hheight,
                        this.bounds.x,this.bounds.y-this.bounds.hheight,
                        this.bounds.hwidth-this.connerbounds.width,this.connerbounds.height);
        drawImageSprite(screenBuffer, this.gameController.images["Images/dialog.png"], 
                        this.innerbounds.hwidth,this.innerbounds.hheight,1,this.innerbounds.hheight,
                        this.bounds.x,this.bounds.y+this.bounds.hheight,
                        this.bounds.hwidth-this.connerbounds.width,this.connerbounds.height);       
        drawImageSprite(screenBuffer, this.gameController.images["Images/dialog.png"], 
                        0,88,this.innerbounds.hwidth,1,
                        this.bounds.x-this.bounds.hwidth,
                        this.bounds.y,this.connerbounds.width,this.bounds.hheight-this.connerbounds.height);
        drawImageSprite(screenBuffer, this.gameController.images["Images/dialog.png"], 
                        this.innerbounds.hwidth,88,this.innerbounds.hwidth,1,
                        this.bounds.x+this.bounds.hwidth,
                        this.bounds.y,this.connerbounds.width,this.bounds.hheight-this.connerbounds.height);

        drawImageSprite(screenBuffer, this.gameController.images["Images/dialog.png"], 
                        this.innerbounds.hwidth,this.innerbounds.hheight,1,1,this.bounds.x,this.bounds.y,
                        this.bounds.hwidth-this.connerbounds.width,this.bounds.hheight-this.connerbounds.height);

        if(this.isGrowing){
            this.setupBounds();
            let percentage = (currentTime-this.lastEventTime)/this.transitionTime;
            // if(this.lastEventTime == 0) percentage = 0;
            if(percentage>=1){
                this.lastEventTime = 0;
                this.isGrowing = false;
                percentage = 1;
            }
            this.boxSize.width = Math.round(Tools.tween1D(0, this.maxBoxSize.width, percentage));
            this.boxSize.height = Math.round(Tools.tween1D(0, this.maxBoxSize.height, percentage));
        }

        if(this.isShrinking){
            this.setupBounds();
            let percentage = (currentTime-this.lastEventTime)/this.transitionTime;
            // if(this.lastEventTime == 0) percentage = 0;
            if(percentage>=1){
                this.lastEventTime = 0;
                this.isShrinking = false;
                percentage = 1;
                this.isVisible = false;
            }
            this.boxSize.width = Math.round(Tools.tween1D(this.maxBoxSize.width, 0, percentage));
            this.boxSize.height = Math.round(Tools.tween1D(this.maxBoxSize.height, 0, percentage));
        }        
        
        this.lastFontSize = fitTextInBox(screenBuffer, this.text, 
                    (canvas.width/2)-this.bounds.hwidth, 
                    (canvas.height/2)-this.bounds.hheight+this.lastFontSize/2, 
                    this.bounds.width, this.bounds.height, 
                    this.fontSize, 'left', 'top', this.typeFace, this.color);
    }
}