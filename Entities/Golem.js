class Golem extends MoveableEntity{
    states = { IDLE : 0, PATROLLING : 1, CHASING : 2, HIT : 3, ATTACKING: 4 };
    state = this.states.PATROLLING;
    searchingWaypoints = [{x:2710, y:1256},{x:2115,y:1200},{x:2093,y:793},{x:2685,y:815}];

    constructor (gameController, id, position) {
        super(gameController, id, null, position);

        this.initSpriteSheet( {
            sprite: null,
            fileName: "Images/spritemaps/golem.png",
            cellSize: { width: 158, height: 125 },
            spriteSize: { width: 158, height: 125 },
            grid: { rows: 5, columns: 9 },
            startAnimation: "IDLE_LEFT",
            animations:{
                "ATTACK_LEFT":    [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]], // 0
                "DEATH_LEFT":     [[0,1],[1,1],[2,1],[3,1],[4,1]], // 1
                "IDLE_LEFT":      [[0,2],[1,2],[2,2],[3,2],[4,2]], // 2
                "WALK_LEFT":      [[0,3],[1,3],[2,3],[3,3],[4,3]], // 3
                "HIT_LEFT":       [[0,4],[1,4],[2,4]], // 4
                "ATTACK_RIGHT":   [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5]], // 0
                "DEATH_RIGHT":    [[0,6],[1,6],[2,6],[3,6],[4,6]], // 1
                "IDLE_RIGHT":     [[0,7],[1,7],[2,7],[3,7],[4,7]], // 2
                "WALK_RIGHT":     [[0,8],[1,8],[2,8],[3,8],[4,8]], // 3
                "HIT_RIGHT":      [[0,9],[1,9],[2,9]], // 4
            }
        });

        this.frameChangeInterval = 0.2;
        this.brightness=.8;
    }

    brain(dt){
        switch (this.state) {
            case this.states.IDLE:
                this.autoControlAnimation = true;
                break;
            case this.states.PATROLLING:
                this.autoControlAnimation = true;
                this.runPatrollingState(dt);
                break;     
            case this.states.ATTACKING:
                this.autoControlAnimation = false;
                this.runAttackState(dt);
                break;         
        }          
    }
    
    findWaypoint(){
        // this.gameController.levelMap.aStar.setup({x:Math.floor(this.position.x/32),y:Math.floor(this.position.y/32)}, this.target, this.gameController.levelMap.grid);
        // this.path = this.gameController.levelMap.aStar.findPath().map(pos=>{return {x:(pos.x*32)+16,y:(pos.y*32)+16}}).reverse();
        this.path = [...this.searchingWaypoints];
    }

    runPatrollingState(deltaTime){
        if(!this.target) {
            this.waypointPointer=0;
            this.target = this.searchingWaypoints[this.waypointPointer];
            this.findWaypoint();
        }
       
        const targetWaypoint = Tools2D.moveTowards_CloseEnough(deltaTime,this.position,this.path[this.waypointPointer],this.speed-10,8);//move to the next waypoint
        if(targetWaypoint?.hit){ 
            this.waypointPointer = (this.waypointPointer+=1) % this.path.length;
            this.state = this.states.ATTACKING;
        }

        if(targetWaypoint) this.animateTowards(targetWaypoint);
    } 

    runAttackState(dt){
        if(this.endAnimationCallback) return;
        // this.attackStartTime = (new Date()).getTime();

        if(this.currentAnimation.endsWith("LEFT")){
            this.switchAnimation("ATTACK_LEFT");
            this.endAnimationCallback=()=>{
                this.switchAnimation("WALK_LEFT");
                this.state = this.states.PATROLLING;
                this.gameController.sequencer.startSequence("golemAttack");
            }
        }
        if(this.currentAnimation.endsWith("RIGHT")){
            this.switchAnimation("ATTACK_RIGHT");
            this.endAnimationCallback=()=>{
                this.switchAnimation("WALK_RIGHT");
                this.state = this.states.PATROLLING;
                this.gameController.sequencer.startSequence("golemAttack");
            }
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

    // FRAMES={
    //     IDLE:{
    //         fileName: "Images/spritemaps/golem/IDLE.png",
    //         cellSize: { width: 158, height: 125 },
    //         spriteSize: { width: 158, height: 125 },
    //         grid: { rows: 1, columns: 5 },
    //         startAnimation: "IDLE",
    //         animations:{
    //             "IDLE":    [[0,0],[1,0],[2,0],[3,0],[4,0]], // 0
    //         }
    //     },
    //     // 14222x125
    //     ATTACK:{
    //         fileName: "Images/spritemaps/golem.png",
    //         cellSize: { width: 158, height: 125 },
    //         spriteSize: { width: 158, height: 125 },
    //         grid: { rows: 1, columns: 5 },
    //         startAnimation: "ATTACK",
    //         animations:{
    //             "ATTACK":    [[0,0],[1,0],[2,0],[3,0],[4,0]], // 0
    //         }
    //     }

    // }

    // switchAnimation(name){
    //     if(this.nonInteruptable && this.forcePlaying) return; // dont play another animation if not allowed
    //     if(this.currentAnimation == name) return;
    //     // if(this.id=="player") console.log("switch",name);
    //     this.frame = 0;
    //     this.currentAnimation = name;
    //     this.nonInteruptable = false;
    //     this.forcePlaying = false;
    // }

        // this.initSpriteSheet( {
        //     sprite: null,
        //     ...this.FRAMES['IDLE']
        // });