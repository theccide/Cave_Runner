class GameController {
    images = {};
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

    start = () => {
        this.loadImages(this.loaded);
    }

    loaded = () => {
        let e = new Entity(this,{
            sprite:null, 
            fileName:"Images/player.png",
            cellSize:{width:16,height:16},
            spriteSize:{width:100,height:100},
            grid:{rows:4,columns:4}
        });
        this.entities.push(e);
    }

    update = (deltaTime) => {
        this.entities.forEach(entity => {
            entity.update(deltaTime);
        });
    }
}