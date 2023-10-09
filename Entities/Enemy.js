class Enemy extends MoveableEntity{
    states = { IDLE : 0, SEARCHING : 1, CHASING : 2 };
    state = this.states.CHASING;

    //TODO: remove this from here //WAY POINTS FOR SEARCHING
    searchingWaypoints = [{x:6,y:1},{x:4,y:3},{x:3,y:6}];
    
    brain = (deltaTime) => {
        this.calcState();

        switch (this.state) {
            case this.states.IDLE:
                console.log("Idle state");
                break;
            case this.states.SEARCHING:
                this.runSearchingState(deltaTime);
                break;
            case this.states.CHASING:
                this.runChasingState(deltaTime);
                break;
            default:
              console.log("Yep, no state");          
        }            
    }

    calcState=()=>{
        let distance = Math.sqrt(Math.pow((this.position.x-this.gameController.player.position.x),2) + Math.pow((this.position.y-this.gameController.player.position.y),2));
        if(distance < 50) {
            if(this.state = this.states.SEARCHING){this.target = null;this.path = [];}
            this.state = this.states.CHASING;
        }
        else {
            this.state = this.states.SEARCHING;
        }
    }

    runSearchingState=(deltaTime)=>{
        if(!this.target) {
            this.waypointPointer=0;
            this.target = this.searchingWaypoints[this.waypointPointer];
            this.findWaypoint();
        }
       
        const targetWaypoint = Tools2D.moveTowards_CloseEnough(deltaTime,this.position,this.path[1],this.speed-10,8);//move to the next waypoint
        if(targetWaypoint?.hit){
            this.path.shift();
            if(this.path.length === 1) {
                this.position = this.path[0];
                this.target=this.searchingWaypoints[(this.waypointPointer+=1) % this.searchingWaypoints.length];
                this.findWaypoint();
            } // correct last cell for rounding errors
        }
        if(targetWaypoint) this.animateTowards(targetWaypoint);

    }

    runChasingState=(deltaTime)=>{
        if(!this.target) {
            this.gameController.levelMap.aStar.setup({x:Math.floor(this.position.x/32),y:Math.floor(this.position.y/32)},
            this.gameController.levelMap.findCellFrom(this.gameController.player.position), this.gameController.levelMap.grid);
            this.path = this.gameController.levelMap.aStar.findPath().map(pos=>{return {x:(pos.x*32)+16,y:(pos.y*32)+16}}).reverse();
        }
        if(this.path.length === 1) {
            // this.frame=0;
            // changeScene(new GameOver(this.gameController.score*100));
            return;
        }
        const targetWaypoint = Tools2D.moveTowards_CloseEnough(deltaTime,this.position,this.path[1],this.speed-5,8);//move to the next waypoint
        if(targetWaypoint.hit){                    
            this.path.shift();
        }
        if(targetWaypoint) this.animateTowards(targetWaypoint);
    }

    animateTowards=(targetWaypoint)=>{
        let angle = targetWaypoint.angle * (180 / Math.PI);
        if(Math.abs(angle) <= 180 && Math.abs(angle) > 135) {
            this.faceDir = this.directions.LEFT;
            this.moveDirection.y = 0;
            this.moveDirection.x = -1;
        }
        if(Math.abs(angle) <= 45 && Math.abs(angle) > 0) {
            this.faceDir = this.directions.RIGHT;
            this.moveDirection.y = 0;
            this.moveDirection.x = 1;
        }
        if(angle >= 0) {
            if(Math.abs(angle) <= 135 && Math.abs(angle) > 45) {
                this.faceDir = this.directions.DOWN;
                this.moveDirection.x = 0;
                this.moveDirection.y = 1;
            }
        }
        else {
            if(Math.abs(angle) <= 135 && Math.abs(angle) > 45) {
                this.faceDir = this.directions.UP;
                this.moveDirection.x = 0;
                this.moveDirection.y = -1;
            }
        }
    }    
}