class GameController {
    images = {};
    sounds = {};
    entities = [];
    resouncesReady = false;
    levelMap = {};

    getMouseInput=(event)=>{this.levelMap.getMouseInput(event);}    
    getMouseMoveInput=(event)=>{this.levelMap.getMouseMoveInput(event);}
    getKeyboardInput=(event)=>{this.levelMap.getKeyboardInput(event);}

    start = () => {
        this.levelMap = new LevelMap();
        loadImages(["Images/player.png","Images/map1.png"],this.imagesFinished);
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
            fileName:"Images/player.png",
            cellSize:{width:16,height:16},
            spriteSize:{width:16,height:16},
            grid:{rows:4,columns:4}
        }, {x:(32*2)+16,y:(32*2)+16});
        this.entities.push(e);
        const playButton = document.getElementById('playButton');
        playButton.addEventListener('click', () => {
            this.sounds["Sounds/noise.wav"].play()
        });
        this.resouncesReady = true;
    }

    update = (deltaTime) => {
        if(!this.resouncesReady) return;

        drawImageFrom00(this.images["Images/map1.png"],0,0,width,height);

        this.levelMap.update(deltaTime);

        this.entities.forEach(entity => {
            entity.update(deltaTime);
        });
    }
}