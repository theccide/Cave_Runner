class GameController {
    images = {};
    sounds = {};
    entities = [];

    start = () => {
        loadImages(["Images/player.png"],this.imagesFinished);
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
            spriteSize:{width:100,height:100},
            grid:{rows:4,columns:4}
        });
        this.entities.push(e);
        e.position.x=500;
        e.position.y=500;
        const playButton = document.getElementById('playButton');
        playButton.addEventListener('click', () => {
            this.sounds["Sounds/noise.wav"].play()
        });

    }

    update = (deltaTime) => {
        this.entities.forEach(entity => {
            entity.update(deltaTime);
        });
    }
}