class GameController {
    images = [];
    entities = [];
    loadImages = (callback) => {
        let imagesToLoad = ["Images/player.png"];
        let resourceCounter = 0;
        imagesToLoad.forEach(imageFile => {
            let image = new Image();
            image.src = imageFile;
            image.onload = (loadedImage) => {
                this.images.push(loadedImage.target);
                resourceCounter++;
                if (resourceCounter >= imagesToLoad.length) callback();
            };
        });
    }

    start = () => {
        this.loadImages(this.loaded);
        let e = new Entity(this,"Images/player.png");
        this.entities.push(e);
    }

    loaded = () => {
        console.log("loaded");
    }

    update = (deltaTime) => {
        this.entities.forEach(entity => {
            entity.update(deltaTime);
        });
    }
}