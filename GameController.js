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
    gems = [{type:this.gemTypes.DIAMOND,pos:{x:64,y:64}},{type:this.gemTypes.EMERALD,pos:{x:96,y:64}},{type:this.gemTypes.RUBY,pos:{x:128,y:64}}];
    images = {};
    sounds = {};
    entities = [];
    resouncesReady = false;
    levelMap = {};
    camera = null;
    currentScene = null;

    getMouseInput=(event)=>{this.player.getMouseInput(event);}    
    getMouseMoveInput=(event)=>{this.player.getMouseMoveInput(event);}
    getKeyboardInput=(event)=>{this.player.getKeyboardInput(event);}

    start = (scene) => {
        this.currentScene = scene;
        this.camera = scene.camera;
        this.levelMap = new LevelMap(this);
        loadImages(["Images/goblin_sheet.png","Images/map1.png","Images/player_sheet.png","Images/lightsource.png","Images/gems.png"],this.imagesFinished);
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
        let e = new Entity(this,{
            sprite:null, 
            fileName:"Images/goblin_sheet.png",
            cellSize:{width:10,height:17},
            spriteSize:{width:10,height:17},
            grid:{rows:4,columns:4}
        }, {x:(32*2)+16,y:(32*2)+16});
        this.entities.push(e);
        const playButton = document.getElementById('playButton');
        playButton.addEventListener('click', () => {
            this.sounds["Sounds/noise.wav"].play()
        });
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
            drawImageSprite(this.currentScene.backBuffer, this.images["Images/gems.png"], this.frame*10, this.gems[i].type*10, 9, 9, this.gems[i].pos.x, this.gems[i].pos.y, 10, 10);
            if(Collision.testCircleOnCircle(this.player.position,8,this.gems[i].pos,8)){this.score+=(4 - (this.gems[i].type + 1));this.gems.splice(i, 1);}
        }
        this.player.update(deltaTime);
    }
}