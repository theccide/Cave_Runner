class SoundManager {
    constructor(gameController) {
        this.backgroundMusic = new Audio();
        this.backgroundMusic.loop = true;
        this.soundEffects = {};
        this.gameController = gameController;
    }

    loadBackgroundMusic(src) {
        this.backgroundMusic.src = src;
        this.backgroundMusic.load();
    }

    playBackgroundMusic() {
        this.backgroundMusic.play();
    }

    stopBackgroundMusic() {
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
    }

    changeBackgroundMusic(src, callback) {
        this.backgroundMusic.src = src;
        this.backgroundMusic.load();
        this.backgroundMusic.volume = 0; // Start with volume at 0
        this.backgroundMusic.oncanplaythrough = () => {
            if (callback) callback();
        };
    }

    fadeOutBackgroundMusic(duration = 1000, callback) {
        let fadeAudio = setInterval(() => {
            if (this.backgroundMusic.volume > 0.1) {
                this.backgroundMusic.volume -= 0.1;
            } else {
                this.backgroundMusic.volume = 0;
                this.backgroundMusic.pause();
                clearInterval(fadeAudio);
                if (callback) callback();
            }
        }, duration / 10);
    }
    
    fadeInBackgroundMusic(duration = 5000) {
        this.backgroundMusic.play();
        this.backgroundMusic.volume = 0;
        let interval = 100; // Interval in ms for volume increase steps
        let step = interval / duration;
        let fadeAudio = setInterval(() => {
            if (this.backgroundMusic.volume < 1 - step) {
                this.backgroundMusic.volume += step;
            } else {
                this.backgroundMusic.volume = 1;
                clearInterval(fadeAudio);
            }
        }, interval);
    }

    setVolume(volume) {
        this.backgroundMusic.volume = volume;
    }

    loadAllSoundEffects(soundsToLoad, callback){
        let resourceCounter = 0;
        soundsToLoad.forEach(sound => {
            this.loadSoundEffect(sound, sound,()=>{
                resourceCounter++;
                if (resourceCounter >= soundsToLoad.length) callback();
            });
        });
    }
    loadSoundEffect(name, src, callback) {
        const sound = new Audio(src);
        sound.addEventListener('canplaythrough', () => {
            this.soundEffects[name] = sound;
            if (callback) callback();
        }, { once: true });        
        // this.soundEffects[name] = sound;
        // if(callback){
        //     this.soundEffects[name].oncanplaythrough = () => {
        //         sounds[soundFile]=audio;
        //         resourceCounter++;
        //         if (resourceCounter >= soundsToLoad.length) callback(sounds);
        //     };
        // }
    }

    playSoundEffect(name, volume = 1, playbackRate = 1) {
        if (volume > 0 && this.soundEffects[name]) {
            const sound = this.soundEffects[name].cloneNode();
            sound.volume = volume;
            sound.playbackRate = playbackRate;
            sound.play();
        }
    }
}

class SoundFxManager {

    calculateDistance(source, maxVolume=0.5, maxDistance=500) {
        let ear = this.gameController.ear.position;
        if(!ear) return {volume:0, pan:0}

        // Calculate the distance and angle
        const deltaX = source.x - ear.x;
        const deltaY = source.y - ear.y;
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        const angle = Math.atan2(deltaY, deltaX); // Angle in radians

        // If the source is further than the max distance, return volume 0
        if (distance > maxDistance) {
            return { volume: 0, pan: 0 };
        }

        // Calculate volume (inverse relationship with distance)
        const volume = maxVolume * (1 - distance / maxDistance);

        // Calculate pan (only horizontal component affects pan)
        const pan = Math.max(-1, Math.min(1, Math.cos(angle)));        

        // console.log("pan",pan)
        return { volume, pan };

        // // Calculate the distance between the ear and the sound source
        // const distance = Math.sqrt((ear.x - source.x) ** 2 + (ear.y - source.y) ** 2);
    
        // // If the source is further than the max distance, return volume 0
        // if (distance > maxDistance) {
        //     return { volume: 0, pan: 0 };
        // }
    
        // // Calculate volume based on distance (inverse relationship)
        // const volume = maxVolume * (1 - distance / maxDistance);
    
        // // Calculate pan based on the relative X position
        // // Assuming a linear pan change from left to right
        // // const panRange = source.x - ear.x;
        // // const maxPanDistance = Math.max(Math.abs(ear.x - maxDistance), Math.abs(ear.x + maxDistance));
        // // const pan = Math.max(-1, Math.min(1, panRange / maxPanDistance));
        // const pan = Math.sign(source.x - ear.x);
        // console.log("pan",pan)
        // return { volume, pan };
    }  

    constructor(gameController) {
        this.gameController = gameController;
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.backgroundMusic = new Audio();
        this.backgroundMusic.loop = true;
        this.soundEffects = {};
    }

    loadAllSoundEffects(soundsToLoad, callback){
        let resourceCounter = 0;
        soundsToLoad.forEach(sound => {
            this.loadSoundEffect(sound, sound,()=>{
                resourceCounter++;
                if (resourceCounter >= soundsToLoad.length) callback();
            });
        });
    }

    loadSoundEffect(name, src, callback) {
        fetch(src)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => this.audioCtx.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                this.soundEffects[name] = audioBuffer;
                if (callback) callback();
            });
    }

    // playSoundEffect(name, volume = 1, pan = 0) {
    playSoundEffect(name, position, maxVolume=0.5, maxDistance=300 ) {
        const {volume, pan} = this.calculateDistance(position,maxVolume, maxDistance);
        if (volume > 0 && this.soundEffects[name]) {
            const soundSource = this.audioCtx.createBufferSource();
            soundSource.buffer = this.soundEffects[name];

            const gainNode = this.audioCtx.createGain();
            gainNode.gain.value = volume;

            const panner = new StereoPannerNode(this.audioCtx, { pan: pan });

            soundSource.connect(gainNode).connect(panner).connect(this.audioCtx.destination);
            soundSource.start();
        }
    }
}
