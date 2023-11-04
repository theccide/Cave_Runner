const enemyTypes = {
    SKELITON : 0,
    BAT : 1,
    SLIME : 2,
    WIZARD : 3,
};

const ENEMY_NAMES = {
    0: 'SKELITON',
    1: 'BAT',
    2: 'SLIME',
    3: 'WIZARD'
};

class Enemy extends MoveableEntity{
    hitPoints = 100;
    states = { IDLE : 0, PATROLLING : 1, CHASING : 2, HIT : 3 };
    state = this.states.CHASING;
    searchingWaypoints = [];
    hitForce = {x:0, y:0};
    hitDirection = null;
    dragFriction = 1;
    
    constructor(gameController, id, spriteSheet, position, searchingWaypoints) {
        super(gameController, id, spriteSheet, position);
        this.searchingWaypoints = searchingWaypoints;
    }

    changeState = (state) => {this.state = state;}
    
    brain = ({dt, currentTime, gameTime}) => {
        switch (this.state) {
            case this.states.IDLE:
                this.autoControlAnimation = true;
                console.log("Idle state");
                break;
            case this.states.PATROLLING:
                this.autoControlAnimation = true;
                this.calcState();
                this.runPatrollingState({dt, currentTime, gameTime});
                break;
            case this.states.CHASING:
                this.autoControlAnimation = true;
                this.calcState();
                this.runChasingState({dt, currentTime, gameTime});
                break;
            case this.states.HIT:
                this.autoControlAnimation = false;
                this.runHitState({dt, currentTime, gameTime});
                break;     
        }          
    }

    calcState=()=>{
        let distance = Math.sqrt(Math.pow((this.position.x-this.gameController.player.position.x),2) + Math.pow((this.position.y-this.gameController.player.position.y),2));
        if(distance < 50) {
            if(this.state == this.states.PATROLLING){this.target = null;this.path = [];}
            this.state = this.states.CHASING;
        }
        else {
            this.state = this.states.PATROLLING;
        }
    }

    findWaypoint = () => {
        this.gameController.levelMap.aStar.setup({x:Math.floor(this.position.x/32),y:Math.floor(this.position.y/32)}, this.target, this.gameController.levelMap.grid);
        this.path = this.gameController.levelMap.aStar.findPath().map(pos=>{return {x:(pos.x*32)+16,y:(pos.y*32)+16}}).reverse();
    }

    runPatrollingState=({dt, currentTime, gameTime})=>{
        if(!this.target) {
            this.waypointPointer=0;
            this.target = this.searchingWaypoints[this.waypointPointer];
            this.findWaypoint();
        }
       
        const targetWaypoint = Tools2D.moveTowards_CloseEnough(dt,this.position,this.path[1],this.speed-10,8);//move to the next waypoint
        if(this.path.length === 1 || targetWaypoint?.hit){ // take in account that you can start on the waypoint at your position
            if(this.path.length !== 1) this.path.shift();
            if(this.path.length === 1) { // correct last cell for rounding errors
                this.position = this.path[0];
                this.target=this.searchingWaypoints[(this.waypointPointer+=1) % this.searchingWaypoints.length];
                this.findWaypoint();
            } 
        }
        if(targetWaypoint) this.animateTowards(targetWaypoint);
    }

    hit(direction, force){
        this.frameChangeInterval = 0.3;
        this.state = this.states.HIT;
        this.hitDirection = direction;
        this.autoControlAnimation = false;
        this.hitTime = gameTime;
        if (direction == this.directions.UP) this.hitForce.y=-force;
        if (direction == this.directions.DOWN) this.hitForce.y=force;
        if (direction == this.directions.LEFT) this.hitForce.x=-force;
        if (direction == this.directions.RIGHT) this.hitForce.x=force;        
        this.forceDir={
            x: Math.sign(this.hitForce.x),
            y: Math.sign(this.hitForce.y)
        }
        this.forceDist = {
            x: Math.abs(this.hitForce.x),
            y: Math.abs(this.hitForce.y)
        }   

        // console.log({force, forceDir:this.forceDir, forceDist:this.forceDist});
             
        this.hitPoints -= (force*2);
        if(this.hitPoints <= 0){
            this.gameController.destroy(this);
            this.gameController.instatiate({entityType:"Fx", params:{fxType: fxTypes.EXPLODE, destroyOnFinishAnim:true}, pos:this.position});
        }
    }

    hitTime = 0;

    runHitState=({dt, currentTime, gameTime})=>{
        this.switchAnimation("HIT");

        if(this.forceDist.x==0 && this.forceDist.y==0){
            if(gameTime > this.hitTime + 500){
                this.state = this.states.PATROLLING;
                this.target = null;this.path = [];
                this.frameChangeInterval = 0.1;
            }            
            return;
        }

        // deltaTime = 1;
        this.forceDist.x = Math.max(0, this.forceDist.x-this.dragFriction);
        this.forceDist.y = Math.max(0, this.forceDist.y-this.dragFriction);
        const newLocation ={
            x: this.forceDist.x * this.forceDir.x,
            y: this.forceDist.y * this.forceDir.y
        }

        // console.log({x:this.forceDist.x,y:this.forceDist.y});
        if(this.gameController.levelMap.findCellFrom({x:this.position.x+newLocation.x, y:this.position.y+newLocation.y}).col === 0) {
            this.position.x += newLocation.x;
            this.position.y += newLocation.y;    
        }
    }

    runChasingState=({dt, currentTime, gameTime})=>{
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
        const targetWaypoint = Tools2D.moveTowards_CloseEnough(dt,this.position,this.path[1],this.speed-5,8);//move to the next waypoint
        if(targetWaypoint.hit){                    
            this.path.shift();
        }
        if(targetWaypoint) this.animateTowards(targetWaypoint);
    }

    animateTowards=(targetWaypoint)=>{
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