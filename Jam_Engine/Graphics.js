const drawRoundBox = (x, y, width, height, col, params) => {
    if(!params) params={};

    let cornerRadius = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };    
    if (isObject(params.radius)) {
        for (let side in params.radius) {
            cornerRadius[side] = params.radius[side];
        }
    }

    // https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(x + cornerRadius.upperLeft, y);
    canvas.ctx.lineTo(x + width - cornerRadius.upperRight, y);
    canvas.ctx.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.upperRight);
    canvas.ctx.lineTo(x + width, y + height - cornerRadius.lowerRight);
    canvas.ctx.quadraticCurveTo(x + width, y + height, x + width - cornerRadius.lowerRight, y + height);
    canvas.ctx.lineTo(x + cornerRadius.lowerLeft, y + height);
    canvas.ctx.quadraticCurveTo(x, y + height, x, y + height - cornerRadius.lowerLeft);
    canvas.ctx.lineTo(x, y + cornerRadius.upperLeft);
    canvas.ctx.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
    canvas.ctx.closePath();

    canvas.ctx.fillStyle = col;
    canvas.ctx.strokeStyle = col;

    if(params.canvasProps)
        for (const [key, value] of Object.entries(params.canvasProps)) 
            canvas.ctx[key] = value;

    if (params.fill) canvas.ctx.fill();        
    if (params.stroke) canvas.ctx.stroke();
} 

const drawBox2=(bounds, col, params)=>drawBox(bounds.position.x, bounds.position.y,bounds.width,bounds.height,col,params);
const drawBox=(x,y,w,h,col,params)=>{
    if(!params) params = {};
    canvas.ctx.beginPath();
    let outline = (params && params.outline) ? params.outline : false;
    canvas.ctx.rect(x, y, w, h);

    if(outline){
        let thickness = 15;
        if(params.thickness)
            thickness = params.thickness;
        canvas.ctx.lineWidth = thickness;
        canvas.ctx.strokeStyle = col;
        canvas.ctx.stroke();    
    }
    else{
        canvas.ctx.fillStyle = col;
        canvas.ctx.fill();
    }
}

const drawRotatedBoxR=(x,y,width,height,radians,col,params)=>{
    x += -width/2;
    y += -height/2;    
    canvas.ctx.save();
    canvas.ctx.beginPath();
    canvas.ctx.translate( x+width/2, y+height/2 );
    canvas.ctx.rotate(radians);
    canvas.ctx.rect( -width/2, -height/2, width,height);
    canvas.ctx.fillStyle=col;
    canvas.ctx.fill();
    canvas.ctx.restore();
}

const drawRotatedBox=(x,y,width,height,degrees,col,params)=>{
    canvas.ctx.save();
    canvas.ctx.beginPath();
    canvas.ctx.translate( x+width/2, y+height/2 );
    canvas.ctx.rotate(degrees*Math.PI/180);
    canvas.ctx.rect( -width/2, -height/2, width,height);
    canvas.ctx.fillStyle=col;
    canvas.ctx.fill();
    canvas.ctx.restore();
}

const drawRotatedOffsetBox=(x,y,width,height,degrees,col, pivit,params)=>{
    canvas.ctx.save();
    canvas.ctx.beginPath();
    canvas.ctx.translate( pivit.x, pivit.y);
    canvas.ctx.rotate(degrees*Math.PI/180);
    canvas.ctx.rect( x, y, width,height);
    canvas.ctx.fillStyle=col;
    canvas.ctx.fill();
    canvas.ctx.restore();
}

const drawCircle2=(position, r, col, params)=>drawCircle(position.x, position.y,r,col,params);
const drawCircle=(x,y,r,col,params)=>{
    if(!params) params = {};
    canvas.ctx.beginPath();
    let outline = (params && params.outline) ? params.outline : false;
    let startAngle = (params && params.startAngle) ? Math.PI * params.startAngle : 0;
    let endAngle = (params && params.endAngle) ? Math.PI * params.endAngle : Math.PI * 360;
    canvas.ctx.arc(x, y, r, startAngle, endAngle);

    if(outline){
        canvas.ctx.lineWidth = 15;
        canvas.ctx.strokeStyle = col;
        canvas.ctx.stroke();    
    }
    else{
        canvas.ctx.fillStyle = col;
        canvas.ctx.fill();
    }
}

const drawLine2=(position1, position2, col, params)=> drawLine(position1.x,position1.y,position2.x,position2.y,col,params)
const drawLine=(x1,y1,x2,y2,col,params)=>{
    if(!params) params = {};
    canvas.ctx.beginPath();
    canvas.ctx.strokeStyle = col;
    canvas.ctx.lineWidth = (params.lineWidth)?params.lineWidth:1;
    canvas.ctx.moveTo(x1,y1);
    canvas.ctx.lineTo(x2,y2);
    canvas.ctx.stroke();
    canvas.ctx.closePath();
}

function drawRay(slope, intercept, scale, offset){
    scale = canvas.height;
    const x1 = 0 + offset.x;
    const y1 = (intercept * scale) + offset.y;
    const x2 = canvas.width + offset.x;
    const y2 = slope * x2 + (intercept * scale) + offset.y;
    drawLine(x1, y1,x2, y2,'green',{lineWidth:10});
}

const drawLine3D=(x1, y1, z1, x2, y2, z2,col, params)=>{   
    var project2D1=Tools.projectTo2D(x1, y1, z1, canvas.width, canvas.height);
    var project2D2=Tools.projectTo2D(x2, y2, z2, canvas.width, canvas.height);
    drawLine(project2D1.x,project2D1.y,project2D2.x,project2D2.y,col, params);
}

const drawCircle3D=(x, y, z, r, col, params)=>{   
    var project2D=Tools.projectTo2D(x, y, z, canvas.width, canvas.height);
    var project2DEdge=Tools.projectTo2D(x+r, y, z, canvas.width, canvas.height);
    var size = Math.abs(project2D.x - project2DEdge.x);
    drawCircle(project2D.x,project2D.y, size, col, params);
}

const drawFill=(path,col, params)=>{
    canvas.ctx.fillStyle = col;
    canvas.ctx.beginPath();
    for(let i=0; i<path.length; i++){
        if(i===0)
            canvas.ctx.moveTo(path[i].x, path[i].y);
        else
            canvas.ctx.lineTo(path[i].x,path[i].y);
    }
    canvas.ctx.closePath();
    canvas.ctx.fill();  
    
    // canvas.ctx.strokeStyle = col;
    // canvas.ctx.stroke();  
}

const drawLines=(path,col, params)=>{
    canvas.ctx.fillStyle = col;
    canvas.ctx.beginPath();
    canvas.ctx.lineWidth = (params.lineWidth)?params.lineWidth:1;
    for(let i=0; i<path.length; i++){
        if(i===0)
            canvas.ctx.moveTo(path[i].x, path[i].y);
        else
            canvas.ctx.lineTo(path[i].x,path[i].y);
    }
    if(!params.openPath) canvas.ctx.closePath();
    canvas.ctx.strokeStyle = col;
    canvas.ctx.stroke();  
}


const drawText2=(position, text, size, col, params)=>drawText(position.x, position.y, text, size, col, params);
const drawText=(x,y,text,size,col,params)=>{
    if(!params) params = {};
    canvas.ctx.font = size+"px Arial";
    canvas.ctx.fillStyle = col;
    if(params.canvasProps)
        for (const [key, value] of Object.entries(params.canvasProps)) 
            canvas.ctx[key] = value;    
    canvas.ctx.fillText(text, x, y);
}

const createBufferedImage=(width, height)=>{
    var canvas2 = document.createElement('canvas');
    canvas2.width = width;
    canvas2.height = height;
    return canvas2;
}

const createFlippedImage=(image, width, height)=>{
    let canvas2 = document.createElement('canvas');
    canvas2.width = width;
    canvas2.height = height;
    let context2 = canvas2.getContext('2d');
    context2.translate(width, 0);
    context2.scale(-1, 1);
    context2.drawImage(bradEngine.currentLevel.images[image], 0, 0, width, height);
    return canvas2;
}

const createMonoDataImage=(colors, alpha, width, height)=>{
    let image = canvas.ctx.createImageData(width, height);
    let data = image.data;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let cell = (x + y * width) * 4;
            data[cell] = data[cell + 1] = data[cell + 2] = colors[y][x];
            data[cell + 3] = alpha;
        }
    }
    return image;
}
const drawDataImage=(dataImage, x1, y1, w1, h1)=>{
    canvas.ctx.putImageData(dataImage, x1, y1);
    return {x:x1, y: y1, w:w1, h:h1};
}

const getImageData=(image)=>{
    let canvas2 = document.createElement('canvas');
    canvas2.width = image.width;
    canvas2.height = image.height;
    let context2 = canvas2.getContext('2d');
    context2.drawImage(image, 0, 0, image.width, image.height);    
    return context2;
}

const drawSpritePixel=(img, x1, y1, w1, h1, x2, y2, w2, h2, brightness)=>{
    canvas.ctx.imageSmoothingEnabled = false;
    canvas.ctx.filter = `brightness(${brightness})`;
    canvas.ctx.drawImage(img, x1, y1, w1, h1, x2, y2, w2, h2);
    canvas.ctx.imageSmoothingEnabled = true;
    canvas.ctx.filter = `brightness(1)`;
}

const getPixelData=(image)=>{
    let canvas2 = document.createElement('canvas');
    canvas2.width = image.width;
    canvas2.height = image.height;
    let context2 = canvas2.getContext('2d');
    context2.drawImage(image, 0, 0, image.width, image.height);    
    return context2.getImageData(0,0,image.width, image.height);
}

const getPixelColorAt=(pixelData,x,y, hasAlpha)=>{
    var index = (y*pixelData.width + x) * 4;
    if(hasAlpha)
        return {r: pixelData.data[index], g: pixelData.data[index+1],  b: pixelData.data[index+2], a: pixelData.data[index+3]};
    return {r: pixelData.data[index], g: pixelData.data[index+1],  b: pixelData.data[index+2]};
}

const drawSprite2=(img, bounds1, bounds2)=> drawSprite(img, bounds1.position.x, bounds1.position.y, bounds1.width, bounds1.height,bounds2.position.x, bounds2.position.y, bounds2.width, bounds2.height);  
const drawSprite=(img, x1, y1, w1, h1, x2, y2, w2, h2)=>
    canvas.ctx.drawImage(img, x1, y1, w1, h1, x2, y2, w2, h2);

const drawImage2=(img, bounds)=>drawImage(img, bounds.position.x, bounds.position.y, bounds.width, bounds.height);  
const drawImageR=(imgString, x1, y1, w1, h1, radians)=>{
    drawRotatedImageR(imgString, x1, y1, w1, h1, radians); 
    return {x:x1, y: y1, w:w1, h:h1};
}
const drawImage=(imgString, x1, y1, w1, h1, degrees)=>{
    if(degrees && degrees!==0){ 
        drawRotatedImage(imgString, x1, y1, w1, h1, degrees); 
        return {x:x1, y: y1, w:w1, h:h1};
    }
    canvas.ctx.drawImage(bradEngine.currentLevel.images[imgString], x1-w1, y1-h1, w1*2, h1*2);
    return {x:x1, y: y1, w:w1, h:h1};
}
const drawImageSprite=(imgString, x1, y1, w1, h1, x2, y2, w2, h2, degrees)=>{
    if(degrees && degrees!==0){ 
        drawRotatedSprite(imgString, x1, y1, w1, h1, x2, y2, w2, h2, degrees); 
        return {x:x2, y: y2, w:w2, h:h2};
    }
    canvas.ctx.drawImage(bradEngine.currentLevel.images[imgString], x1, y1, w1, h1, x2-w2, y2-h2, w2*2, h2*2);
    return {x:x2, y: y2, w:w2, h:h2};
}

const drawImageSpriteFrom00=(imgString, x1, y1, w1, h1, x2, y2, w2, h2, ctx=canvas.ctx)=>{
    ctx.drawImage(bradEngine.currentLevel.images[imgString], x1, y1, w1, h1, x2, y2, w2, h2);
    return {x:x2, y: y2, w:w2, h:h2};
}

const drawImageFrom00=(imgString, x1, y1, w1, h1)=>{
    canvas.ctx.drawImage(bradEngine.currentLevel.images[imgString], x1, y1, w1, h1);
    return {x:x1, y: y1, w:w1, h:h1};
}
const drawImage3D=(imgString, x1, y1, z1, w1, h1, degrees)=>{
    if(degrees && degrees!==0){ 
        var projectEdge1=Tools.projectTo2D(x1, y1, z1, canvas.width, canvas.height);
        var projectEdge2=Tools.projectTo2D(x1 + w1, y1 + h1, z1, canvas.width, canvas.height)
        
        let w2 = Tools.clampMin(projectEdge2.x - projectEdge1.x,0); 
        let h2 = Tools.clampMin(projectEdge2.y - projectEdge1.y,0); 
    
        drawRotatedImage(imgString, projectEdge1.x, projectEdge1.y, w2, h2, degrees); 
        return {x:projectEdge1.x, y: projectEdge1.y, w:w2, h:h2};
    }

    var projectEdge1=Tools.projectTo2D(x1, y1, z1, canvas.width, canvas.height);
    var projectEdge2=Tools.projectTo2D(x1 + w1, y1 + h1, z1, canvas.width, canvas.height)
    
    let w2 = Tools.clampMin(projectEdge2.x - projectEdge1.x,0); 
    let h2 = Tools.clampMin(projectEdge2.y - projectEdge1.y,0); 

    drawImage(imgString, projectEdge1.x, projectEdge1.y, w2, h2); 
    return {x:projectEdge1.x, y: projectEdge1.y, w:w2, h:h2};    
}

const drawSprite3D=(imgString, x1, y1, w1, h1, x2, y2, z1, w2, h2, degrees)=>{
    if(degrees && degrees!==0){ 
        var projectEdge1=Tools.projectTo2D(x2, y2, z1, canvas.width, canvas.height);
        var projectEdge2=Tools.projectTo2D(x2 + w2, y2 + h2, z1, canvas.width, canvas.height)
        
        let w3D = Tools.clampMin(projectEdge2.x - projectEdge1.x,0); 
        let h3D = Tools.clampMin(projectEdge2.y - projectEdge1.y,0); 
    
        drawRotatedSprite(imgString, x1, y1, w1, h1, projectEdge1.x, projectEdge1.y, w3D, h3D, degrees); 
        return {x:projectEdge1.x, y: projectEdge1.y, w:w3D, h:h3D};
    }

    var projectEdge1=Tools.projectTo2D(x2, y2, z1, canvas.width, canvas.height);
    var projectEdge2=Tools.projectTo2D(x2 + w2, y2 + h2, z1, canvas.width, canvas.height)
    
    let w3D = Tools.clampMin(projectEdge2.x - projectEdge1.x,0); 
    let h3D = Tools.clampMin(projectEdge2.y - projectEdge1.y,0); 

    drawImageSprite(imgString, x1, y1, w1, h1, projectEdge1.x, projectEdge1.y, w3D, h3D); 
    return {x:projectEdge1.x, y: projectEdge1.y, w:w3D, h:h3D};    
}

const drawRotatedImageR=(image,x,y,width,height,radians,params)=>{
    canvas.ctx.save();
    canvas.ctx.beginPath();
    canvas.ctx.translate( x, y);
    canvas.ctx.rotate(radians);
    canvas.ctx.drawImage(bradEngine.currentLevel.images[image], -width, -height, (width*2), (height*2));
    canvas.ctx.fill();
    canvas.ctx.restore();
}

const drawRotatedSpriteR=(image,x1,y1,width1,height1,x2,y2,width2,height2,radians,params)=>{
    canvas.ctx.save();
    canvas.ctx.beginPath();
    canvas.ctx.translate( x2, y2);
    canvas.ctx.rotate(radians);
    canvas.ctx.drawImage(bradEngine.currentLevel.images[image], x1, y1, width1, height1,-width2, -height2, (width2*2), (height2*2));
    canvas.ctx.fill();
    canvas.ctx.restore();
}

const drawRotatedImage=(image,x,y,width,height,degrees,params)=>{
    canvas.ctx.save();
    canvas.ctx.beginPath();
    canvas.ctx.translate( x, y);
    canvas.ctx.rotate(Tools.toRadians(degrees));
    canvas.ctx.drawImage(bradEngine.currentLevel.images[image], -width, -height, (width*2), (height*2));
    canvas.ctx.fill();
    canvas.ctx.restore();
}

const drawRotatedSprite=(image,x1, y1, w1, h1, x,y,width,height,degrees,params)=>{
    canvas.ctx.save();
    canvas.ctx.beginPath();
    canvas.ctx.translate( x, y);
    canvas.ctx.rotate(Tools.toRadians(degrees));
    canvas.ctx.drawImage(bradEngine.currentLevel.images[image],x1, y1, w1, h1, -width, -height, (width*2), (height*2));
    canvas.ctx.fill();
    canvas.ctx.restore();
}

const drawRotatedFlippableImage=(image,x,y,width,height,degrees,params)=>{
    canvas.ctx.save();
    canvas.ctx.beginPath();
    canvas.ctx.translate(x, y);
    canvas.ctx.rotate(Tools.toRadians(degrees));

    let flipScale = 1;
    let flopScale = 1;
    // Flip/flop the canvas
    if(params && params.flip) flipScale=-1;
    if(params && params.flop) flopScale=-1;

    canvas.ctx.scale(flipScale, flopScale);        

    canvas.ctx.drawImage(image, -width, -height, (width*2), (height*2));
    canvas.ctx.fill();
    canvas.ctx.restore();
}