class EndRunner extends MoveableEntity{
    static states = { IDLE : 0, RUN : 1 };
    state = Runner.states.IDLE;
    scale = 0.5;

    constructor (gameController, id, params, position, fields) {
        super(gameController, id, null, position, {});

        this.initSpriteSheet( {
            sprite:null, 
            fileName: "Images/spritemaps/skeleton.png",            
            cellSize: { width: 32, height: 32 },
            spriteSize: { width: 32, height: 32 },
            grid: { rows: 16, columns: 8 },
            startAnimation: "IDLE_UP",
            animations:{
                "IDLE_DOWN":    [[0,0],[1,0],[2,0],[3,0]], // 0
                "IDLE_RIGHT":   [[0,1],[1,1],[2,1],[3,1]], // 1
                "IDLE_UP":      [[0,2],[1,2],[2,2],[3,2]], // 2
                "IDLE_LEFT":    [[0,6],[1,6],[2,6],[3,6]], // 6
                "WALK_DOWN":    [[0,3],[1,3],[2,3],[3,3]], // 3
                "WALK_RIGHT":   [[0,4],[1,4],[2,4],[3,4]], // 4
                "WALK_UP":      [[0,5],[1,5],[2,5],[3,5]], // 5
                "WALK_LEFT":    [[0,7],[1,7],[2,7],[3,7]], // 7
                "HIT":          [[0,8],[1,8]], // 8
            }
        });

        this.frameChangeInterval = 0.2;
        this.brightness=.8;
        if(fields)
            this.updateFields(fields); 

        //960, 1536
        this.shield = new Entity(gameController,"shield", 
        {
            sprite: null,
            fileName: "Images/spritemaps/shields.png",
            cellSize: { width: 192, height: 192 },
            spriteSize: { width: 192*this.scale, height: 192*this.scale },
            grid: { rows: 8, columns: 5 },
            startAnimation: "OFF",
            animations:{
                "OFF":          [[0,0]], 
                // "LEFT_SIDE":    [[0,1],[2,1][4,1],[1,2],[2,2],[0,3],[2,3],[4,3]], 
                "LEFT_SIDE":    [[0,1],[1,1],[2,1],[3,1],[4,1],
                                 [0,2],[1,2],[2,2],[3,2],[4,2],
                                 [0,3],[1,3],[2,3],[3,3],[4,3]],
                "RIGHT_SIDE":    [[4,5],[3,5],[2,5],[1,5],[0,5],
                                 [4,6],[3,6],[2,6],[1,6],[0,6],
                                 [4,7],[3,7],[2,7],[1,7],[0,7]]
            }
        }, {x:0, y:0});
        //}, {...this.position});
        
        this.addChild(this.shield);            
    }

    brain({dt, currentTime, gameTime}){
        switch (this.state) {
            // case Runner.states.IDLE:
            //     this.autoControlAnimation = true;
            //     break;    
        }          
    }

    hit(direction, hitForce){
        if("Obelisk" in this.gameController.entityMap){
            if(direction.x==-1) this.shield.switchAnimation("LEFT_SIDE");
            if(direction.x==1) this.shield.switchAnimation("RIGHT_SIDE");
            this.shield.endAnimationCallback=()=>{
                this.shield.switchAnimation("OFF");
            }
        }
        else{
            this.gameController.destroy(this);
            this.gameController.instatiate({entityType:"Fx", params:{fxType: fxTypes.EXPLODE, destroyOnFinishAnim:true}, pos:this.position});
            this.gameController.sequencer.startSequence("win");
        }
    }
    
    animateTowards(targetWaypoint){
        let angle = (targetWaypoint.angle * (180 / Math.PI))+180;
        if(angle > 45 && angle <= 135) {
            this.faceDir = this.directions.UP;
            this.moveDirection.x = 0;
            this.moveDirection.y = -1;
        }
        if(angle > 135 && angle <= 225) {
            this.faceDir = this.directions.RIGHT;
            this.moveDirection.y = 0;
            this.moveDirection.x = 1;
        }
        if(angle > 225 && angle <= 315) {
            this.faceDir = this.directions.DOWN;
            this.moveDirection.x = 0;
            this.moveDirection.y = 1;
        }
        if(angle > 315 || angle <= 45) {
            this.faceDir = this.directions.LEFT;
            this.moveDirection.y = 0;
            this.moveDirection.x = -1;
        }            
   }
   
}