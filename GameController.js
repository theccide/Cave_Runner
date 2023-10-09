class GameController {
    gemTypes = {
        DIAMOND : 0,
        RUBY : 1,
        EMERALD : 2
    }

    score = 0;

    //ANIMATION
    frame = 0;
    elapsedTime = 0;
    frameChangeInterval = 0.1;//IN SECONDS
    //OTHER
    gems = [
        {type:this.gemTypes.DIAMOND,pos:{x:64,y:64}},
        {type:this.gemTypes.EMERALD,pos:{x:96,y:64}},
        {type:this.gemTypes.RUBY,pos:{x:128,y:64}}
    ];
    images = {};
    sounds = {};
    entities = [];
    resouncesReady = false;
    levelMap = {};
    camera = null;
    currentScene = null;

    getMouseInput=(event)=>{if(this.player) this.player.getMouseInput(event);}    
    getMouseMoveInput=(event)=>{if(this.player) this.player.getMouseMoveInput(event);}
    getKeyboardInput=(event)=>{if(this.player) this.player.getKeyboardInput(event);}

    start = (scene) => {
        this.currentScene = scene;
        this.camera = scene.camera;
        this.levelMap = new LevelMap(this);
        loadImages(["Images/spritemaps/skeleton.png","Images/map1.png","Images/spritemaps/complete_hero.png","Images/lightsource.png","Images/gems.png"],this.imagesFinished);
        loadSounds(["Sounds/noise.wav"],this.soundsFinished);        
    }

    imagesFinished=(loadedImages)=>{
        this.images = loadedImages;
        this.resourceFinished();
    }

    soundsFinished=(loadedSounds)=>{
        this.sounds = loadedSounds;
        this.resourceFinished();
    }

    resourceCounter = 0;
    resourceFinished = () => {
        this.resourceCounter ++;
        if(this.resourceCounter >= 2) this.finishedLoading();
    }

    finishedLoading = () => {
        
        let e = new Enemy(this,{
            sprite:null, 
            fileName: "Images/spritemaps/skeleton.png",            
            cellSize: { width: 32, height: 32 },
            spriteSize: { width: 32, height: 32 },
            grid: { rows: 16, columns: 8 },
            startAnimation: "IDLE_DOWN",
            animations:{
                "IDLE_DOWN":    [[0,0],[1,0],[2,0],[3,0]], // 0
                "IDLE_RIGHT":   [[0,1],[1,1],[2,1],[3,1]], // 1
                "IDLE_UP":      [[0,2],[1,2],[2,2],[3,2]], // 2
                "IDLE_LEFT":    [[0,6],[1,6],[2,6],[3,6]], // 6
                "WALK_DOWN":    [[0,3],[1,3],[2,3],[3,3]], // 3
                "WALK_RIGHT":   [[0,4],[1,4],[2,4],[3,4]], // 4
                "WALK_UP":      [[0,5],[1,5],[2,5],[3,5]], // 5
                "WALK_LEFT":    [[0,7],[1,7],[2,7],[3,7]], // 7
            }
        }, 
            {x:(32*2)+16,y:(32*2)+16}, // position
            [{x:6,y:1},{x:4,y:3},{x:3,y:6}] // patrol points
        );
        
        this.entities.push(e);
        this.player = new Player(this);
        this.resouncesReady = true;
    }
    nextFrame = (deltaTime) => {
        this.elapsedTime += deltaTime;

        if (this.elapsedTime >= this.frameChangeInterval) {
            this.frame += 1;
            this.frame %= 6;
            this.elapsedTime = 0; // Reset the elapsed time
        }
    }
    update = (deltaTime) => {
        this.nextFrame(deltaTime);
        if(!this.resouncesReady) return;

        drawImageFrom00(this.currentScene.backBuffer, this.images["Images/map1.png"],
                        0,0,this.currentScene.offBounds.width,this.currentScene.offBounds.height);

        this.levelMap.update(deltaTime);

        this.entities.forEach(entity => {
            entity.update(deltaTime);
        });
        
        for (let i = 0; i < this.gems.length; i ++) {
            drawImageSprite(this.currentScene.backBuffer, this.images["Images/gems.png"], 
                            this.frame*10, this.gems[i].type*10, 9, 9, this.gems[i].pos.x, 
                            this.gems[i].pos.y, 10, 10);
            if(Collision.testCircleOnCircle(this.player.position,8,this.gems[i].pos,8)){
                this.score+=(4 - (this.gems[i].type + 1));
                this.gems.splice(i, 1);
            }
        }
        this.player.update(deltaTime);
    }
}