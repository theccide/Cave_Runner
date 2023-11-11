class Player extends MoveableEntity {
    showPlayerDebug = false;
    hitForce = 15;
    takingDamage = false;
    damageTime = 2000;
    damageStartTime = 0;
    score = 0;
    hp = 5;
    dragFriction = 1;    
    isPlayerControlled = true;
    inventory={
        questItems:{Maguffin:0},
    };

    setPlayerControlled(playerControlled){
        this.isPlayerControlled = playerControlled;
        if(!this.playerControlled){
            this.moveDirection.x = 0;
            this.moveDirection.y = 0;
        }
    }
    getMouseInput = (event) => {}
    getMouseMoveInput = (event) => {}
    getKeyboardInput = (event) => {
        if(!this.isPlayerControlled) return;
        this.processInput(event);
    }

    processInput(event){        
        if (event.type === "down") {
            if (event.key === "w") this.moveDirection.y = -1;
            else if (event.key === "s") this.moveDirection.y = 1;
            if (event.key === "a") this.moveDirection.x = -1;
            else if (event.key === "d") this.moveDirection.x = 1;
            if(event.key === "e") {
                if(this.faceDir == this.directions.UP){this.forceAnimation("SWING_UP");}
                if(this.faceDir == this.directions.DOWN){this.forceAnimation("SWING_DOWN");}
                if(this.faceDir == this.directions.LEFT){this.forceAnimation("SWING_LEFT");}
                if(this.faceDir == this.directions.RIGHT){this.forceAnimation("SWING_RIGHT");}
                this.gameController.enemies.forEach (enemy=>{                    
                    if(Collision.testBoxOnBox(this.swingBoxBounds,enemy.collisionBounds)){
                        enemy.hit(this.faceDir, this.hitForce);
                    }
                });
                this.gameController.bullets.forEach (bullet=>{
                    if(Collision.testBoxOnBox(this.swingBoxBounds,bullet.collisionBounds)){
                        bullet.hit(this.faceDir, this.hitForce);
                    }
                });
                this.gameController.interactableObjects.forEach (interactableObject=>{
                    if(Collision.testBoxOnBox(this.swingBoxBounds,interactableObject.collisionBounds)){
                        interactableObject.hit(this.faceDir, this.hitForce);
                    }
                });                   
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

    constructor(gameController) {
        super(gameController, "Player",{
            sprite: null,
            fileName: "Images/spritemaps/complete_hero.png",
            cellSize: { width: 64, height: 64 },
            spriteSize: { width: 64, height: 64 },
            grid: { rows: 16, columns: 8 },
            startAnimation: "IDLE_DOWN",
            animations:{
                "IDLE_DOWN":    [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]], // 0
                "IDLE_RIGHT":   [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]], // 1
                "IDLE_UP":      [[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2]], // 2
                "IDLE_LEFT":    [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3]], // 3

                "WALK_DOWN":    [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4]], // 4
                "WALK_RIGHT":   [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5]], // 5
                "WALK_UP":      [[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6]], // 6
                "WALK_LEFT":    [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7]], // 7

                "RUN_DOWN":     [[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8]], // 8
                "RUN_RIGHT":    [[0,9],[1,9],[2,9],[3,9],[4,9],[5,9],[6,9],[7,9]], // 9
                "RUN_UP":       [[0,10],[1,10],[2,10],[3,10],[4,10],[5,10],[6,10],[7,10]], // 10
                "RUN_LEFT":     [[0,11],[1,11],[2,11],[3,11],[4,11],[5,11],[6,11],[7,11]], // 11

                "SWING_DOWN":   [[0,12],[1,12],[2,12],[3,12],[4,12],[5,12],[6,12]], // 12
                "SWING_RIGHT":  [[0,13],[1,13],[2,13],[3,13],[4,13],[5,13],[6,13]], // 13
                "SWING_UP":     [[0,14],[1,14],[2,14],[3,14],[4,14],[5,14],[6,14]], // 14
                "SWING_LEFT":   [[0,15],[1,15],[2,15],[3,15],[4,15],[5,15],[6,15]]  // 15
            }
        },
        { x: (32 * 30) + 16, y: (32 * 18) + 16 });
        this.moveDirection = {x:0, y:0};
        this.camera = gameController.camera;
        this.id="player";
        this.frameChangeCallback=(frame)=>{
            this.spriteSheet.sprite=this.gameController.images["Images/spritemaps/complete_hero.png"];
            if(this.takingDamage){
                const currentTime = gameTime;
                (frame%2==0)?this.spriteSheet.sprite=this.gameController.images["Images/spritemaps/complete_hero_hit.png"]:this.spriteSheet.sprite=this.gameController.images["Images/spritemaps/complete_hero.png"];
                if(currentTime > this.damageStartTime+this.damageTime) this.takingDamage=false;
            }
        }
        // this.addChild(new Skull(this.gameController, "skull", {shouldRotate:true}, {x:45, y:45}));

        // this.addChild(new Skull(this.gameController, "skull", {shouldRotate:true}, {x:this.position.x+45, y:this.position.y+45}));
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

        if(this.forceHitDist.x!=0 || this.forceHitDist.y!=0) runHit();
        
        if(this.visible){ this.drawSprite({dt, currentTime, gameTime});}
        this.processCamera();       
        setupBounds();
        collisionDetection();
        this.children.forEach(child=>child.update({dt, currentTime, gameTime}));

    }

    waterDelay = 250;
    lastWaterTime = 0;
    overWater({dt, currentTime, gameTime}){
        if(this.inventory.questItems["Maguffin"]==0) {
            this.hit(0,0);
            return;
        }

        if(gameTime > this.lastWaterTime+this.waterDelay){
            this.lastWaterTime = gameTime;
            this.gameController.spawn(this.gameController, {entityType:"Fx", params:{fxType:"0", destroyOnFinishAnim: true}, pos:{...this.position}});
        }
        // console.log("over water");
    }

    hitTime = 0;
    forceHitDist = {x:0, y:0};
    forceDir = {x:0, y:0};
    hit(direction, force){
        if(this.takingDamage) return;
        this.takingDamage = true;        
        this.damageStartTime=gameTime;
        this.hp -= 1;
        if(force > 0){
            this.hitTime = gameTime;
            this.forceDir= {x:direction.x, y:direction.y}
            this.forceHitDist = {x:Math.abs(direction.x)*force, y:Math.abs(direction.y)*force}
        }
        if(this.hp <= 0){
            this.hp = 0;
            this.gameController.playSequence(this.gameController,"playerDeath");
            // changeScene(new GameOver(this.score));
        }
        console.log("hit");
    }
}
