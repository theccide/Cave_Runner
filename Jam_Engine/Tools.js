const wrap=(num, length)=> (num+length)%(length);
const dist=(x1, y1, x2, y2)=>{
    let a = x1 - x2;
    let b = y1 - y2;    
    return Math.sqrt( a*a + b*b );
}
// An educated guess of how far it is between two points
const heuristic=(a, b)=>dist(a.x, a.y, b.x, b.y);

const loadImages = (imagesToLoad, callback) => {
    //let imagesToLoad = ["Images/background1.png"];
    let resourceCounter = 0;
    let images = {}
    imagesToLoad.forEach(imageFile => {
        let image = new Image();
        image.src = imageFile;
        image.onload = (loadedImage) => {
            images[imageFile]=loadedImage.target;
            resourceCounter++;
            if (resourceCounter >= imagesToLoad.length) callback(images);
        };
    });
}

const loadSounds = (soundsToLoad, callback) => {
    // let soundsToLoad = ["Sounds/noise.wav"];
    let resourceCounter = 0;
    let sounds = {}
    soundsToLoad.forEach(soundFile => {
        let audio = new Audio();
        audio.src = soundFile;
        audio.oncanplaythrough = () => {
            sounds[soundFile]=audio;
            resourceCounter++;
            if (resourceCounter >= soundsToLoad.length) callback(sounds);
        };
    });
};

class Tools {
    static MIN=0;
    static MAX=1;

    static compressArray(array) {
        const jsonString = JSON.stringify(array);
        const compressedData = pako.deflate(jsonString);
        return btoa(String.fromCharCode.apply(null, compressedData));
    }

    static decompressArray(base64String) {
        const compressedData = Uint8Array.from(atob(base64String), c => c.charCodeAt(0));
        const jsonString = pako.inflate(compressedData, { to: 'string' });
        return JSON.parse(jsonString);
    }

    static randomSwap(arr, numberOfSwaps=1){
        for(let i=0; i<numberOfSwaps; i++){
            let i1 = Tools.getNumberBetween(0, arr.length-1);
            let i2 = Tools.getNumberBetween(0, arr.length-1);
            Tools.swap(arr, i1, i2);
        }
    }

    static swap(arr, i1, i2){
        let temp = arr[i1];
        arr[i1]=arr[i2];
        arr[i2]=temp;
    }

    static shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    static tween1D(start, end, percentage) {
        if (percentage < 0) percentage = 0;
        if (percentage > 1) percentage = 1;
        return start + (end - start) * percentage;
    }
    static tween2D(start, end, percentage) {
        let x = Tools.tween1D(start.x,end.x,percentage);
        let y = Tools.tween1D(start.y,end.y,percentage);
        return {x,y};
    }
    static getRandomNumberArray(start, end){
        let length = end-start;
        let array = [];
        for(let i=start; i<length; i++) array.push(i);        
        return Tools.shuffle(array);
    }

    static getRandomObjectByProbability = arr =>{
        let sumOfProbabilities = arr.reduce((acc,e)=>acc+=e.probability,0);
        const randomSelection = Tools.getNumberBetween(0,sumOfProbabilities);    
        let result = arr[0];
        let found = false;
        arr.reduce((acc,e)=>{
            if(found) return acc;
    
            acc+=e.probability;
            if (randomSelection <= acc){
                result = e;
                found = true;
            }
            return acc;
        },0);
        return result;
    }

    static getRandomPointInBox(x,y,width,height){
        return {x: Tools.getNumberBetween(x, x+width), y: Tools.getNumberBetween(y, y+height)};
    }

    static sortObjectArray(list, property){
        return list.sort((a, b) => (a[property] > b[property]) ? -1 : 1)
    }
    static sortObjectArrayDsc(list, property){
        return list.sort((a, b) => (a[property] > b[property]) ? 1 : -1)
    }
    static toRadians(degrees){
        return degrees * (Math.PI/180);
    }

    static distanceBetweenPoints(pointA, pointB){
        let a = pointA.x - pointB.x;
        let b = pointA.y - pointB.y;
        return Math.sqrt( a*a + b*b );
    }

    static rotatePointAroundR(cx, cy, x, y, radians) {
        var cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
            ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return {x:nx, y:ny};
    }
    static rotatePointAround(cx, cy, x, y, angle) {
        var radians = (Math.PI / 180) * angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
            ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return {x:nx, y:ny};
    }
    static getPointOnCircle(radius, degrees){
        var angle = Tools.toRadians(degrees);
        return {x:(radius * Math.cos(angle)),y:(radius * Math.sin(angle))}
    }
    static getPointOnCircleR(radius, radians){
        return {x:(radius * Math.cos(radians)),y:(radius * Math.sin(radians))}
    }
    static getPointOnOval(radiusX, radiusY, degrees){
        var angle = Tools.toRadians(degrees);
        return {x:(radiusX * Math.cos(angle)),y:(radiusY * Math.sin(angle))}
    }

    static projectTo2D(x,y,z, width, height){
        if(z===0)return{x: width/2,y: height/2, z}
        
        return{
            x: ((width/2) + (1024*(x/z))),
            y: ((height/2) + (1024*(y/z))),
            z
        }
    }
    
    static revertProjectTo2D(x,y,z, width, height){
        if(z===0)return{x: width/2,y: height/2}
     
        x -=(width/2);
        y-=(height/2);
        return{
            x: (((x*z)/1024)),
            y: (((y*z)/1024)),
            z
        }
    }    

    static clampMin(number, min){
        if(number < min) return min;
        return number;
    }
    static clampMax(number, max){
        if(number > max) return max;
        return number;
    }
    static clampMinMax(number, min, max){
        if(number < min) return min;
        if(number > max) return max;
        return number;
    } 
    static getMilliseconds(){
        let d = new Date();
        return d.getTime();
    }

    static intToHex(rgb) { 
        let hex = Math.round(rgb).toString(16);
        if (hex.length < 2) hex = "0" + hex;        
        return hex;
    }  
    
    static rgbToHex(rgb) {   
        return '#'+Tools.intToHex(rgb.r)+Tools.intToHex(rgb.g)+Tools.intToHex(rgb.b);
    }

    static getRandomObject(arr){
        return arr[Math.floor(Math.random() * arr.length)];
    }
    
    static cloneObject(obj){
        return JSON.parse(JSON.stringify(obj));
    }

    static getNumberBetween(min, max){
        max++;
        return Math.floor(Math.random() * (max - min)) + min;
    }

    static getDecimalBetween(min, max){
        max++;
        return Math.random() * (max - min) + min;
    }    

    static mergeWithObject(obj, params){
        if(!params) return;
        
        for (const [key, value] of Object.entries(params)) {
            if(!(key in obj))
                obj[key] = value;
        }
    }

    static overideObject(obj, params){
        if(!params) return;
        
        for (const [key, value] of Object.entries(params)) {
            obj[key] = value;
        }
    }
    
    static sqr(x) { 
        return x * x 
    }
    
    static dist2(v, w) { 
        return Tools.sqr(v.x - w.x) + Tools.sqr(v.y - w.y) 
    }
    
    static distToSegmentSquared(p, v, w) {
      var l2 = Tools.dist2(v, w);
        
      if (l2 == 0) return Tools.dist2(p, v);
        
      var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        
      if (t < 0) return Tools.dist2(p, v);
      if (t > 1) return Tools.dist2(p, w);
        
      return Tools.dist2(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) });
    }
    
    static closestPointOnLineSegment(p, v, w) {
        var l2 = Tools.dist2(v, w);
          
        if (l2 == 0) return Tools.dist2(p, v);
          
        var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
          
        if (t < 0) return Tools.dist2(p, v);
        if (t > 1) return Tools.dist2(p, w);
          
        return { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) };
    }
    
    static rayCast(pos, dir, segment) {
        const {x1, y1, x2, y2} = segment;
    
        const x3 = pos.x;
        const y3 = pos.y;
        const x4 = pos.x + dir.x;
        const y4 = pos.y + dir.y;
    
        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (den == 0) { return; }
    
        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
        if (t > 0 && t < 1 && u > 0) 
            return { x: x1 + t * (x2 - x1), y: y1 + t * (y2 - y1) };
    }

    static vecToAngle(vec){
        return Math.atan2(vec.y, vec.x);
    }      
    static distToLineSegment(p, v, w) { 
        return Math.sqrt(Tools.distToSegmentSquared(p, v, w));
    }       
}

class Tools2D{
    static normalize(v) {
        let length=Math.sqrt(v.x*v.x + v.y*v.y);       
        if(length===0) return v;
        return {x:v.x/length,y:v.y/length};
    }

    static distanceBetweenVerts( v1, v2 ){
        var dx = v1.x - v2.x;
        var dy = v1.y - v2.y;
        return Math.sqrt( dx * dx + dy * dy);
    }

    static fromAngle (angle, length) {
        if (typeof length === 'undefined')  length = 1;        
        return {x:length * Math.cos(angle), y:length * Math.sin(angle)};
    };

    static getRandomVector() {
        return Tools2D.fromAngle(Math.random() * TWO_PI);
    }; 

    static mag(v){return Math.sqrt(v.x*v.x + v.y*v.y);}

    static addVector(vector1, amount){return {x: vector1.x+amount, y: vector1.y+amount};}
    static subVector(vector1, amount){return {x: vector1.x-amount, y: vector1.y-amount};}
    static multVector(vector1, amount){return {x: vector1.x*amount, y: vector1.y*amount};}
    static divVector(vector1, amount){return {x: vector1.x/amount, y: vector1.y/amount};}    

    static addVectors(vector1, vector2){return {x: vector1.x+vector2.x, y: vector1.y+vector2.y};}
    static subVectors(vector1, vector2){return {x: vector1.x-vector2.x, y: vector1.y-vector2.y};}
    static multVectors(vector1, vector2){return {x: vector1.x*vector2.x, y: vector1.y*vector2.y};}    
    static divVectors(vector1, vector2){return {x: vector1.x/vector2.x, y: vector1.y/vector2.y};}      

    static moveTowards_CloseEnough(delta, pos, target, speed, hitDist){
        if(target == null) return;
        let normal = Tools2D.normalize({x: (target.x - pos.x), y: (target.y - pos.y)});

        pos.x += normal.x * speed * delta;
        pos.y += normal.y * speed * delta;
       
        return {
            angle:Math.atan2(target.y - pos.y, target.x - pos.x),
            hit:Tools.distanceBetweenPoints(pos, target) < hitDist
        };
    }

    static moveTowards_UntilChange(delta, pos, target, speed){
        const normal = Tools2D.normalize({x: (target.x - pos.x), y: (target.y - pos.y)});

        pos.x += normal.x * speed * delta;
        pos.y += normal.y * speed * delta;
       
        // Check if the normal changed on the next step.  If so then either you past the target or you got too close
        const normalAfter = Tools2D.normalize({x: (target.x - pos.x), y: (target.y - pos.y)});

        return {
            angle:Math.atan2(target.y - pos.y, target.x - pos.x),
            hit: normal.x != normalAfter.x || normal.y != normalAfter.y
        };
    }
}

class Collision {
    static buildBounds(center, size){
        return {
            x: center.x - size.width/2,
            y: center.y - size.height/2,
            width: size.width,
            height: size.height
        }
    }

    //https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    static testBoxOnBox(rect1, rect2){
        if (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y) {
                return true;
         }
         return false;
    }

    static testPointOnCircle(point, position, radius){
        return (Math.sqrt((point.x-position.x)*(point.x-position.x) + (point.y-position.y)*(point.y-position.y)) < radius)
    }

    static testCircleOnCircle(circlePostision1, radius1, circlePostision2, radius2){
        let dist = Math.sqrt((circlePostision1.x-circlePostision2.x)*(circlePostision1.x-circlePostision2.x) + (circlePostision1.y-circlePostision2.y)*(circlePostision1.y-circlePostision2.y))
        return (dist <= radius1+radius2);
    }    

    static testPointOnBox(point, bounds){        
        if( point.x >= bounds.x && 
            point.y >= bounds.y &&
            point.x <= bounds.x + bounds.width && 
            point.y <= bounds.y + bounds.height)
        {
            return true;
        }
        return false;
    }

    static testCircleOnBox(circle, rect){
        let cx = circle.x; 
        let cy = circle.y; 
        let radius = circle.r; 
        let rx = rect.x; 
        let ry = rect.y;
        let rw = rect.width;
        let rh = rect.height;

        // temporary variables to set edges for testing
        let testX = cx;
        let testY = cy;
        
        // which edge is closest?
        if (cx < rx)         testX = rx;      // test left edge
        else if (cx > rx+rw) testX = rx+rw;   // right edge
        if (cy < ry)         testY = ry;      // top edge
        else if (cy > ry+rh) testY = ry+rh;   // bottom edge
        
        // get distance from closest edges
        let distX = cx-testX;
        let distY = cy-testY;
        let distance = Math.sqrt((distX*distX) + (distY*distY));
        
        // if the distance is less than the radius, collision!
        if (distance <= radius) 
            return true;
        
        return false;
    }        

    static distToLineSegment(point, lineStartPoint, lineEndPoint) {
        return Tools.distToLineSegment(point, lineStartPoint, lineEndPoint);
    }
      
    static closestPointOnLineSegment(point, lineStartPoint, lineEndPoint) {
        return Tools.closestPointOnLineSegment(point, lineStartPoint, lineEndPoint);
    }
  
    static testLineIntersect(line1, line2) {
        let x1 = line1.x1;
        let y1 = line1.y1;
        let x2 = line1.x2;
        let y2 = line1.y2;
        let x3 = line2.x1;
        let y3 = line2.y1;
        let x4 = line2.x2;
        let y4 = line2.y2;

        // Check if none of the lines are of length 0
        if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) return false;
                
        let denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
      
        // Lines are parallel
        if (denominator === 0) return false;
      
        let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
        let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator
      
        // is the intersection along the segments
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1)  return false
                
        // Return a object with the x and y coordinates of the intersection
        let x = x1 + ua * (x2 - x1)
        let y = y1 + ua * (y2 - y1)
      
        return {x, y}
    }
}