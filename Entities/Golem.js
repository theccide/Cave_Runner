class Golem extends MoveableEntity{
    isPlayerControlled = false;
    hitForce = 15;
    takingDamage = false;
    damageTime = 2000;
    damageStartTime = 0;
    score = 0;
    hp = 5;
    dragFriction = 1;   

    constructor (gameController, id, params, position) {
        super(gameController, id, {
            sprite: null,
            fileName: "Images/spritemaps/golem.png",
            cellSize: { width: 158, height: 125 },
            spriteSize: { width: 158, height: 125 },
            grid: { rows: 5, columns: 9 },
            startAnimation: "DEAD_RIGHT",
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
                "DEAD_RIGHT":     [[4,6]], 
                "WAKEUP_RIGHT":   [[4,6],[3,6],[2,6],[1,6],[0,6]], 
            }
        }, position);

        this.frameChangeInterval = 0.2;
        this.brightness=.8;
        this.lightOffset = {x:50, y:50};
    }
    
    swingBoxBounds= {x:-50,y:0,width:100,height:50};
    update = ({dt, currentTime, gameTime}) => {
        const setupBounds=()=>{
            if(this.faceDir == this.directions.DOWN) this.swingBoxBounds= {x: this.position.x -50,y: this.position.y, width:100,height:75};
            if(this.faceDir == this.directions.UP) this.swingBoxBounds= {x: this.position.x -50,y: this.position.y-75, width:100,height: 75};
            if(this.faceDir == this.directions.RIGHT) this.swingBoxBounds= {x: this.position.x, y: this.position.y-50, width:75,height: 100};
            if(this.faceDir == this.directions.LEFT) this.swingBoxBounds= {x: this.position.x-75, y: this.position.y-50, width:75,height: 100};

            this.collisionBounds.x = this.position.x - this.spriteSheet.spriteSize.width*.6;
            this.collisionBounds.y = this.position.y - this.spriteSheet.spriteSize.height*.8;
            this.collisionBounds.width = (this.spriteSheet.spriteSize.width*.6)*2;
            this.collisionBounds.height = (this.spriteSheet.spriteSize.height*.8)*2;    

            if(this.showPlayerDebug)
            drawBox(
                this.gameController.currentScene.backBuffer,
                this.swingBoxBounds.x, this.swingBoxBounds.y,
                this.swingBoxBounds.width, this.swingBoxBounds.height,
                "Black"
            )
        }

        const collisionDetection=()=>{
            if(this.gameController.levelMap.findCellFrom({x:this.position.x+(this.moveDirection.x*10), y:this.position.y}).col !== 1) 
                this.position.x += this.speed * this.moveDirection.x * dt;
            if(this.moveDirection.y < 0) {
                if(this.gameController.levelMap.findCellFrom({x:this.position.x, y:this.position.y+(this.moveDirection.y*15)}).col !== 1) 
                    this.position.y += this.speed * this.moveDirection.y * dt;
            }
            else {
                if(this.gameController.levelMap.findCellFrom({x:this.position.x, y:this.position.y+(this.moveDirection.y*25)}).col !== 1) 
                    this.position.y += this.speed * this.moveDirection.y * dt;
            }
            
            // trigger Detection
            let triggerID = this.gameController.levelMap.findCellFrom({x:this.position.x, y:this.position.y}).col;
            if(triggerID !=0 && triggerID != 1){
                if(triggerID === 4){
                    this.overWater({dt, currentTime, gameTime});
                    return;
                }
                let trigger = this.gameController.triggers.find(trigger=>trigger.id == triggerID);
                if(trigger) this.gameController.runTrigger(trigger);
                // console.log("trigger",trigger.code);
            }
        }
        
        const runHit=()=>{
   
            this.forceHitDist.x = Math.max(0, this.forceHitDist.x-this.dragFriction);
            this.forceHitDist.y = Math.max(0, this.forceHitDist.y-this.dragFriction);
            const newLocation ={
                x: this.forceHitDist.x * this.forceDir.x,
                y: this.forceHitDist.y * this.forceDir.y
            }
    
            // console.log({x:this.forceHitDist.x,y:this.forceHitDist.y});
            if(this.gameController.levelMap.findCellFrom({x:this.position.x+newLocation.x, y:this.position.y+newLocation.y}).col === 0) {
                this.position.x += newLocation.x;
                this.position.y += newLocation.y;    
            }            
        }

        if(this.forceHitDist.x!=0 || this.forceHitDist.y!=0) runHit(); else this.takingDamage = false;
        
        if(this.visible){ this.drawSprite({dt, currentTime, gameTime});}
        this.processCamera();       
        setupBounds();
        collisionDetection();
        this.children.forEach(child=>child.update({dt, currentTime, gameTime}));

        if("Obelisk" in this.gameController.entityMap){
            if(this.currentAnimation.startsWith("ATTACK") && this.frame==6)
            if(Collision.testBoxOnBox(this.swingBoxBounds,this.gameController.entityMap["Obelisk"].collisionBounds)){
                const direction = {x:this.currentAnimation.endsWith("RIGHT")?-1:1, y:0}
                this.gameController.entityMap["Obelisk"].hit(direction, this.hitForce);
                // this.hit(direction, this.hitForce);
            }
        }
        if("endRunner" in this.gameController.entityMap){
            if(Collision.testBoxOnBox(this.swingBoxBounds,this.gameController.entityMap["endRunner"].collisionBounds)){
                const direction = {x:this.currentAnimation.endsWith("RIGHT")?-1:1, y:0}
                this.gameController.entityMap["endRunner"].hit(direction, this.hitForce);
                this.hit(direction, this.hitForce);
            }
        }
    }

    hitTime = 0;
    forceHitDist = {x:0, y:0};
    forceDir = {x:0, y:0};
    hit(direction, force){
        // console.log("hit",direction);
        if(this.takingDamage) return;
        this.takingDamage = true;        
        this.damageStartTime=gameTime;
        // this.hp -= 1;
        if(force > 0){
            this.hitTime = gameTime;
            //this.forceDir= {x:1, y:0};
            //direction = {x:1,y:0};
            this.forceDir= {x:direction.x, y:direction.y};
            this.forceHitDist = {x:Math.abs(direction.x)*force, y:Math.abs(direction.y)*force}
        }
        // if(this.hp <= 0){
        //     this.hp = 0;
        //     this.gameController.playSequence(this.gameController,"playerDeath");
        //     // changeScene(new GameOver(this.score));
        // }
        console.log("hit");
    }

    setPlayerControlled(playerControlled){
        this.isPlayerControlled = playerControlled;
        if(!this.playerControlled){
            this.moveDirection.x = 0;
            this.moveDirection.y = 0;
        }
    }

    getKeyboardInput = (event) => {
        if(!this.isPlayerControlled) return;
        this.processInput(event);
    }

    drawSprite=({dt, currentTime, gameTime})=>{
        this.nextFrame({dt, currentTime, gameTime});
        
        if(this.isPlayerControlled){
            if(this.moveDirection.x != 0) {
                if(this.moveDirection.x > 0) this.switchAnimation("WALK_RIGHT");
                if(this.moveDirection.x < 0) this.switchAnimation("WALK_LEFT");
            }
            breakme: if(this.moveDirection.y != 0) {
                // holding 2 move keys (Example: Down and Left)
                if(this.moveDirection.x != 0) {
                    if(this.moveDirection.x > 0) this.switchAnimation("WALK_RIGHT");
                    if(this.moveDirection.x < 0) this.switchAnimation("WALK_LEFT");
                    break breakme;
                }            

                if(this.currentAnimation.endsWith("LEFT"))
                    this.switchAnimation("WALK_LEFT");
                if(this.currentAnimation.endsWith("RIGHT"))
                    this.switchAnimation("WALK_RIGHT");
                
            }
            
            if(this.moveDirection.x == 0 && this.moveDirection.y == 0 ){
                if(this.faceDir == this.directions.LEFT)   this.switchAnimation("IDLE_LEFT");
                if(this.faceDir == this.directions.RIGHT)  this.switchAnimation("IDLE_RIGHT");
                if(this.faceDir == this.directions.DOWN || this.faceDir == this.directions.UP){
                    if(this.currentAnimation.endsWith("LEFT"))
                        this.switchAnimation("IDLE_LEFT");
                    if(this.currentAnimation.endsWith("RIGHT"))
                        this.switchAnimation("IDLE_RIGHT");
                }
            }
        }

        drawImageSprite(this.gameController.currentScene.backBuffer,
            this.spriteSheet.sprite,
            this.spriteSheet.animations[this.currentAnimation][this.frame][0]*this.spriteSheet.cellSize.width,
            this.spriteSheet.animations[this.currentAnimation][this.frame][1]*this.spriteSheet.cellSize.height,
            this.spriteSheet.cellSize.width,
            this.spriteSheet.cellSize.height,
            this.position.x,
            this.position.y,
            this.spriteSheet.spriteSize.width,
            this.spriteSheet.spriteSize.height            
        );
    }

    processInput(event){        
        if (event.type === "down") {
            if (event.key === "w") this.moveDirection.y = -1;
            else if (event.key === "s") this.moveDirection.y = 1;
            if (event.key === "a") this.moveDirection.x = -1;
            else if (event.key === "d") this.moveDirection.x = 1;
            if(event.key === "e") {
                if(this.faceDir == this.directions.UP || this.faceDir == this.directions.DOWN){
                    if(this.currentAnimation.endsWith("LEFT"))
                        this.forceAnimation("ATTACK_LEFT");
                    if(this.currentAnimation.endsWith("RIGHT"))
                        this.forceAnimation("ATTACK_RIGHT");
                }

                if(this.faceDir == this.directions.LEFT){this.forceAnimation("ATTACK_LEFT");}
                if(this.faceDir == this.directions.RIGHT){this.forceAnimation("ATTACK_RIGHT");}


                // this.gameController.enemies.forEach (enemy=>{                    
                //     if(Collision.testBoxOnBox(this.swingBoxBounds,enemy.collisionBounds)){
                //         enemy.hit(this.faceDir, this.hitForce);
                //     }
                // });
                // this.gameController.bullets.forEach (bullet=>{
                //     if(Collision.testBoxOnBox(this.swingBoxBounds,bullet.collisionBounds)){
                //         bullet.hit(this.faceDir, this.hitForce);
                //     }
                // });
                // this.gameController.interactableObjects.forEach (interactableObject=>{
                //     if(Collision.testBoxOnBox(this.swingBoxBounds,interactableObject.collisionBounds)){
                //         interactableObject.hit(this.faceDir, this.hitForce);
                //     }
                // });                   
            }
        } else if (event.type === "up") {
            if (event.key === "w" || event.key === "s") this.moveDirection.y = 0;
            if (event.key === "a" || event.key === "d") this.moveDirection.x = 0;
        }
        if (this.moveDirection.y>0) {this.faceDir = this.directions.DOWN;}
        if (this.moveDirection.y<0) {this.faceDir = this.directions.UP;}
        if (this.moveDirection.x>0) {this.faceDir = this.directions.RIGHT;}
        if (this.moveDirection.x<0) {this.faceDir = this.directions.LEFT;}    
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
   wakeup(){
        this.switchAnimation("WAKEUP_RIGHT");
        this.endAnimationCallback=()=>{
            this.switchAnimation("IDLE_RIGHT");
            delete this.sequencerStatus["wakeup"];
            this.lightOffset = {x:0, y:0};
        };
   }     
}