class Saw extends Entity{
    startPosition = {x:0, y:0}
    constructor (gameController, id,   position) {
        super(gameController, id, null, position);
        this.startPosition = {...position};
        this.initSpriteSheet( {
            sprite: null,
            fileName: "Images/spritemaps/saw.png",
            cellSize: { width: 25, height: 13 },
            spriteSize: { width: 25, height: 13 },
            grid: { rows: 1, columns: 7 },
            startAnimation: "SAW_TOP",
            animations:{
                "SAW_TOP":    [[3,0],[4,0],[5,0],[6,0]], // 0
                "SAW_BOT":    [[3,1],[4,1],[5,1],[6,1]], // 0
            }
        });
        this.frameChangeInterval = 0.2;
    }

    yoyoAngle = 0;
    startTime = Date.now();
    lastDist = 0;
    brain=({dt, currentTime, gameTime})=>{
        const easeInOutSine=(currentTime, startValue, changeInValue, duration)=> {
            return -changeInValue / 2 * (Math.cos(Math.PI * currentTime / duration) - 1) + startValue;
        }        
        //const dist = easeInOutSine(Date.now() - this.startTime, 0, 250, 1000)
        const dist = easeInOutSine(gameTime, 0, 250, 1000)
        this.position.x = this.startPosition.x + dist;

        // check to see if the player was hit
        if(Collision.testBoxOnBox(this.gameController.player.collisionBounds,this.collisionBounds)){
            this.gameController.player.hit({x: Math.sign(dist-this.lastDist),y:0}, 15);
        }
        this.lastDist = dist; // find the direction the saw is going

    }    
}

        // const calcYoYo=(angle, amplitude)=> {
        //     let radians = angle * Math.PI / 180;
        //     let sinValue = Math.sin(radians);
        //     let movementInPixels = sinValue * amplitude;          
        //     return movementInPixels;
        // }

        // console.log(this.startPosition.x, Tools.tween1D(0, 200, (Date.now() - this.startTime)/2000));
        // this.position.x = this.startPosition.x + Tools.tween1D(0, 200, (Date.now() - this.startTime)/2000);

        // this.position.x = this.startPosition.x + calcYoYo(this.yoyoAngle+=10,3000)*dt;
