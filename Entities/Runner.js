class Runner extends MoveableEntity{
    static states = { IDLE : 0, RUN : 1 };
    state = Runner.states.RUN;
    searchingWaypoints = [{x:2710, y:1256},{x:2115,y:1200},{x:2093,y:793},{x:2685,y:815}];

    constructor (gameController, id, params, position, fields) {
        super(gameController, id, null, position, {});

        this.initSpriteSheet( {
            sprite:null, 
            fileName: "Images/spritemaps/skeleton.png",            
            cellSize: { width: 32, height: 32 },
            spriteSize: { width: 32, height: 32 },
            grid: { rows: 16, columns: 8 },
            startAnimation: "IDLE_DOWN",
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
        
        if("lavadoortop" in this.gameController.entityMap){ // TODO: this is bad idea when there are 2 runners and they will fight over the doors
            this.gameController.entityMap["lavadoortop"].updateFields({attachedEntities:[this]});
            this.gameController.entityMap["lavadoorright"].updateFields({attachedEntities:[this]});
            this.gameController.entityMap["Tolavadoortop"].updateFields({attachedEntities:[this]});
        }
    }

    run(params){
        this.sequencerStatus[params.block.statusID]={complete:false};
        this.state = Runner.states.RUN;
        this.speed = 200;
    }

    brain({dt, currentTime, gameTime}){
        switch (this.state) {
            case Runner.states.IDLE:
                this.autoControlAnimation = true;
                break;
            case Runner.states.RUN:
                this.autoControlAnimation = true;
                this.runRUNState({dt, currentTime, gameTime});
                break;      
        }          
    }
    
    findWaypoint(){
        this.path = [...this.searchingWaypoints];
    }

    runRUNState({dt, currentTime, gameTime}){
        this.walkingOnWater = false;
        let triggerID = this.gameController.levelMap.findCellFrom({x:this.position.x, y:this.position.y}).col;
        if(triggerID === 4) {
            this.walkingOnWater = true;
            this.overWater({dt, currentTime, gameTime});
        }

        if(this.moveDirection.x!=0 || this.moveDirection.y!=0){
            this.playFootStep({dt, currentTime, gameTime});
        }

        if(!this.target) {
            this.waypointPointer=0;
            this.target = this.searchingWaypoints[this.waypointPointer];
            this.findWaypoint();
        }
       
        const targetWaypoint = Tools2D.moveTowards_CloseEnough(dt,this.position,this.path[this.waypointPointer],this.speed,8);//move to the next waypoint
        if(targetWaypoint?.hit){ 
            this.waypointPointer+=1;
            if(this.waypointPointer == this.path.length)
                delete this.sequencerStatus["GottoDoor"];
        }

        if(targetWaypoint) this.animateTowards(targetWaypoint);
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
   
   waterDelay = 250;
   lastWaterTime = 0;
   overWater({dt, currentTime, gameTime}){
        if(gameTime > this.lastWaterTime+this.waterDelay){
            this.lastWaterTime = gameTime;
            this.gameController.spawn(this.gameController, {entityType:"Fx", params:{fxType:"0", destroyOnFinishAnim: true}, pos:{...this.position}});
            this.gameController.placeOnTop(this);
        }
   }
   
   footDelay = 250;
   lastFootTime = 0;
   playFootStep({dt, currentTime, gameTime}){
       if(gameTime > this.lastFootTime+this.footDelay){
           this.lastFootTime = gameTime;
           if(!this.walkingOnWater)
               this.gameController.soundManager.playSoundEffect('Sounds/step.wav', 0.3);
           else
               this.gameController.soundManager.playSoundEffect('Sounds/water_step.wav', 0.3);
       }        
   }   
   
}