class StarEntity extends Entity{
    constructor (gameController, id, position) {
        super(gameController, id, null, position);
        // 66x29
        this.initSpriteSheet( {
            sprite: null,
            fileName: "Images/gameover_star.png",
            cellSize: { width: 22, height: 29 },
            spriteSize: { width: 12, height: 15 },
            grid: { rows: 1, columns: 6 },
            startAnimation: "BURN",
            animations:{
                "BURN":    [[0,0],[1,0],[2,0],[2,0],[2,0],[2,0],[2,0],[2,0],[2,0],[2,0],[1,0],[0,0]], // 0
            }
        });
        this.timeDelay = (Math.random()*60000)+500;
        this.lastEventTime = (new Date()).getTime();
        this.visible = false;
        this.frameChangeInterval = 0.2
    }
    brain=({dt, currentTime, gameTime})=>{

        if(currentTime > this.lastEventTime+this.timeDelay){
            this.lastEventTime = currentTime;
            this.timeDelay = (Math.random()*60000)+500;
            this.visible = true;
            this.frame = 0;
            this.endAnimationCallback = ()=>{
                this.visible = false;                
            }
        }
    }        
}

class SplashEntity extends Entity{
    constructor (gameController, id, position) {
        super(gameController, id, null, position);
  
        this.initSpriteSheet( {
            sprite: null,
            fileName: "Images/go_spray.png",
            cellSize: { width: 119, height: 96 },
            spriteSize: { width: 119/3, height: 96/3 },
            grid: { rows: 1, columns: 3 },
            startAnimation: "SPLASH",
            animations:{
                "SPLASH": [[0,0],[1,0],[2,0],[1,0]], // 0
            }
        });
        this.frameChangeInterval = 0.2
    }      
}

class GameOver extends Scene{
    images = {}
    loaded = false;
    droplet={
        pos:{x:718, y:500}
    }

    constructor (score) {
        super();
        this.score = score;
        this.setup({
            viewBounds:{x:0,y:0,width: canvas.width,height: canvas.height},
            offBounds:{x:0,y:0,width: canvas.width,height: canvas.height}            
        });
        loadImages([
            "Images/gameover.png",
            "Images/gameoverlabel.png",
            "Images/go_spray.png",
            "Images/gameover_star.png",
            "Images/droplet.png"
        ],this.finishedLoading(this));

        this.backgroundBounds = {
            x: canvas.height,
            y: canvas.height/2,
            width: canvas.height/2,
            height: canvas.height/2
        }
        this.gameOverAlpha = 0;
        this.enities = [];
        this.timeDelayGO = 2000;
        this.lastEventTimeGO = (new Date()).getTime();        
    }

    convertRes(size){
        return ((canvas.height/2)/1024)*size;
    }

    finishedLoading = (self) => (images) => {
        self.images = images;
        self.loaded = true;

        for(let i = 0; i<20; i++)
            this.enities.push(new StarEntity({images, currentScene:{backBuffer:screenBuffer}}, "star"+i,{x:(canvas.width/2*Math.random())+canvas.width/4,y:500*Math.random()}));
        this.enities.push(new SplashEntity({images, currentScene:{backBuffer:screenBuffer}}, "splash", {x:712,y:710}));     
    }
    update({dt, currentTime, gameTime}){
        super.update({dt, currentTime, gameTime});
        if(!this.loaded) return;
        drawBox(screenBuffer,0,0,canvas.width, canvas.height, 'black');
        screenBuffer.globalAlpha = 1;
        drawImage(screenBuffer, this.images["Images/gameover.png"],canvas.height,canvas.height/2,canvas.height/2,canvas.height/2);
        const label = this.images["Images/gameoverlabel.png"];

        screenBuffer.globalAlpha = 0;
        if(currentTime > this.lastEventTimeGO+this.timeDelayGO){
            this.gameOverAlpha+=0.5*dt;
            if(this.gameOverAlpha > 1) this.gameOverAlpha = 1;
            screenBuffer.globalAlpha = this.gameOverAlpha;
        }
        //console.log(screenBuffer.globalAlpha, currentTime, this.lastEventTimeGO+this.timeDelayGO);
        drawImage(screenBuffer, label,canvas.height,(canvas.height/2)-200,
            this.convertRes(label.width),
            this.convertRes(label.height)
        );
        screenBuffer.globalAlpha = 1;

        const droplet = this.images["Images/droplet.png"];
        if(this.droplet.pos.y > 700) this.droplet.pos.y=500;
        this.droplet.pos.y+=(100*dt);
        drawImage(screenBuffer, droplet,this.droplet.pos.x,this.droplet.pos.y,
            this.convertRes(droplet.width),
            this.convertRes(droplet.height)
        );

        this.enities.forEach(entity=>entity.update({dt, currentTime, gameTime}));

    }

    getMouseInput=(event)=>{ }    
    getMouseMoveInput=(event)=>{}
    getKeyboardInput=(event)=>{}
}