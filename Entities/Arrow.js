class Arrow extends Entity{
    speed = 150;
    dir={x:0,y:1};
    fadeOut = false;
    lastTime = gameTime;
    ttl = 1000;

    constructor (gameController, id, params, position) {
        super(gameController, id, null, position);
        this.brightness = 0.5;

        this.initSpriteSheet( {
            sprite: null,
            fileName: "Images/arrow.png",
            cellSize: { width: 16, height: 16 },
            spriteSize: { width: 16, height: 16 },
            grid: { rows: 1, columns: 1 },
            startAnimation: ["ARROW"],
            animations:{
                "ARROW": [[0,0]],   // 0
            }
        });
        this.frameChangeInterval = 0.2;

        this.gameController.soundFxManager.playSoundEffect('Sounds/arrow.wav', this.position, 0.1, 1000);
    }

    brain=({dt, currentTime, gameTime})=>{

        if(this.fadeOut && gameTime > this.lastTime+this.ttl){
            this.brightness -= 0.5*dt;
            if(this.brightness <=0){
                this.brightness = 0;                
                this.gameController.destroy(this);
                return;
            }
        }

        const dist={
            x: this.dir.x * this.speed * dt,
            y: this.dir.y * this.speed * dt
        }

        if(this.gameController.levelMap.findCellFrom({x:this.position.x+dist.x, y:this.position.y+dist.y}).col === 1) {            
            if(!this.fadeOut){
                 this.lastTime = gameTime;
                 this.gameController.soundFxManager.playSoundEffect('Sounds/arrow_damage.wav', this.position);
            }
            
            this.fadeOut = true;
            // this.gameController.destroy(this);
            return;
        }

        this.position.x += dist.x;
        this.position.y += dist.y;
        
        // check to see if the player was hit
        if(Collision.testBoxOnBox(this.gameController.player.collisionBounds,this.collisionBounds)){
            this.gameController.soundManager.playSoundEffect('Sounds/arrow_damage.wav', 0.5);
            this.gameController.player.hit(0, 0);
            this.gameController.destroy(this);
        }
    }
}