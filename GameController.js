class GameController {
    images = {};
    sounds = [];
    entities = [];
    loadImages = (callback) => {
        let imagesToLoad = ["Images/player.png"];
        let resourceCounter = 0;
        imagesToLoad.forEach(imageFile => {
            let image = new Image();
            image.src = imageFile;
            image.onload = (loadedImage) => {
                this.images[imageFile]=loadedImage.target;
                resourceCounter++;
                if (resourceCounter >= imagesToLoad.length) callback();
            };
        });
    }
    loadSounds = (callback) => {
        let soundsToLoad = ["Sounds/noise.wav"];
        let resourceCounter = 0;
        soundsToLoad.forEach(soundFile => {
            let audio = new Audio();
            audio.src = soundFile;
            audio.oncanplaythrough = () => {
                this.sounds.push(audio);
                resourceCounter++;
                if (resourceCounter >= soundsToLoad.length) callback();
            };
        });
    };

    start = () => {
        this.loadImages(this.resourceFinished);
        this.loadSounds(this.resourceFinished);
    }
    resourceCounter = 0;
    resourceFinished = () => {
        this.resourceCounter ++;
        if(this.resourceCounter >= 2) this.finished();
    }
    finished = () => {
        let e = new Entity(this,{
            sprite:null, 
            fileName:"Images/player.png",
            cellSize:{width:16,height:16},
            spriteSize:{width:100,height:100},
            grid:{rows:4,columns:4}
        });
        this.entities.push(e);

        const playButton = document.getElementById('playButton');
        playButton.addEventListener('click', () => {
            this.sounds[0].play()
        });

    }

    update = (deltaTime) => {
        this.entities.forEach(entity => {
            entity.update(deltaTime);
        });
    }
}