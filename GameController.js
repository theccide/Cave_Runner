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
            // fileName: "Images/spritemaps/complete_hero.png",
            fileName: "Images/spritemaps/skeleton.png",            
            cellSize: { width: 32, height: 32 },
            spriteSize: { width: 32, height: 32 },
            // cellSize: { width: 64, height: 64 },
            // spriteSize: { width: 64, height: 64 },
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

            // animations:{
            //     "IDLE_DOWN":    [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]], // 0
            //     "IDLE_RIGHT":   [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]], // 1
            //     "IDLE_UP":      [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2]], // 2
            //     "IDLE_LEFT":    [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3]], // 3
            //     "WALK_DOWN":    [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4]], // 4
            //     "WALK_RIGHT":   [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5]], // 5
            //     "WALK_UP":      [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6]], // 6
            //     "WALK_LEFT":    [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7]], // 7
            //     "RUN_DOWN":     [[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8]], // 8
            //     "RUN_RIGHT":    [[0,9],[1,9],[2,9],[3,9],[4,9],[5,9],[6,9],[7,9]], // 9
            //     "RUN_UP":       [[0,10],[1,10],[2,10],[3,10],[4,10],[5,10],[6,10],[7,10]], // 10
            //     "RUN_LEFT":     [[0,11],[1,11],[2,11],[3,11],[4,11],[5,11],[6,11],[7,11]], // 11
            //     "SWING_DOWN":   [[0,12],[1,12],[2,12],[3,12],[4,12],[5,12],[6,12],[7,12]], // 12
            //     "SWING_RIGHT":  [[0,13],[1,13],[2,13],[3,13],[4,13],[5,13],[6,13],[7,13]], // 13
            //     "SWING_UP":     [[0,14],[1,14],[2,14],[3,14],[4,14],[5,14],[6,14],[7,14]], // 14
            //     "SWING_LEFT":   [[0,15],[1,15],[2,15],[3,15],[4,15],[5,15],[6,15],[7,15]]  // 15
            // }
            // fileName:"Images/goblin_sheet.png",
            // cellSize:{width:10,height:17},
            // spriteSize:{width:10,height:17},
            // grid:{rows:4,columns:4}
        }, {x:(32*2)+16,y:(32*2)+16});
        
        this.entities.push(e);
        // const playButton = document.getElementById('playButton');
        // playButton.addEventListener('click', () => {
        //     this.sounds["Sounds/noise.wav"].play()
        // });
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