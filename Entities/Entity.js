class Entity {
        
    // ANIMATION VARIABLES
    spriteSheet = {sprite:null,fileName:'',spriteSize:{width:0,height:0},cellSize:{width:0,height:0},grid:{rows:0,columns:0}};
    frame = 0;
    elapsedTime = 0;
    currentAnimation = "";
    frameChangeInterval = 0.1;//IN SECONDS
    animationQueue = [];
    nonInteruptable = false;
    isLightSource = true;
    brightness = 0.25;
    collisionBounds = {x:0, y:0, width:0, height:0};
    id="";
    bobbingStrength={x: 0, y:0, fx:0.005, fy:0.005};
    showDebug = false;
    endAnimationCallback=null;
    frameChangeCallback=null;    
    position = {x:0, y:0};
    camera = null;
    pauseAnimation = false;
    spriteAngle = 0;
    visible = true;
    playerInteractable = false;
    parent = { position:{x:0,y:0} };
    children=[];
    globalAlpha = 1;

    entityMap = {};

    animationController={
        fade:[],
        transtlation:[],
        rotation:[],
        brightness:[]
    };
    sequencerStatus = {};
    
    constructor (gameController, id, spriteSheet, position, fields={}) {
        this.id = id;
        this.gameController = gameController;
        this.position = position;
        if(!isObjectEmpty(fields))
            this.updateFields(fields);
        if(spriteSheet) this.initSpriteSheet(spriteSheet);
    }

    updateFields(fields){
        const keys = Object.keys(fields);
        keys.forEach(field=>{
            this[field] = fields[field];
        })
    }

    initSpriteSheet(spriteSheet){
        this.spriteSheet = spriteSheet;
        this.spriteSheet.sprite = this.gameController.images[spriteSheet.fileName];
        this.currentAnimation = this.spriteSheet.startAnimation;
        this.setupCollisionBounds();
    }

    addChild(entity){
        entity.parent = this;
        let id = generateRandomId(8);
        if("id" in entity){
            id = entity.id;
        }
        this.entityMap[id]=entity;
        this.children.push(entity);
    }

    detachChild(childID){
        const entityToRemove = this.entityMap[childID];
        delete this.entityMap[childID];
        this.children = this.children.filter(child=>child!=entityToRemove);
        entityToRemove.position = {
            x: entityToRemove.position.x + this.position.x,
            y: entityToRemove.position.y + this.position.y,
            z: 0
        }
        entityToRemove.parent = { position:{x:0,y:0} };
        this.gameController.addEntity(this.gameController,entityToRemove, entityToRemove.playerInteractable);
    }

    // check the completeion status of an Entity function running from the Sequencer.
    getSequencerStatus(statusID){
        if(statusID in this.sequencerStatus){
            return this.sequencerStatus[statusID].complete;
        }
        return true; // there is no id for this function so mark it as complete
    }

    forceAnimation(name){
        if(this.nonInteruptable && this.forcePlaying) return; // dont play another animation if not allowed
        if(this.currentAnimation == name) return;
        // if(this.id=="player") console.log("force",name);
        this.frame = 0;
        this.currentAnimation = name;
        this.nonInteruptable = true;
        this.forcePlaying = true; 
    }    
    
    switchAnimation(name){
        if(!(name in this.spriteSheet.animations)) return;
        if(this.nonInteruptable && this.forcePlaying) return; // dont play another animation if not allowed
        if(this.currentAnimation == name) return;
        // if(this.id=="player") console.log("switch",name);
        this.frame = 0;
        this.currentAnimation = name;
        this.nonInteruptable = false;
        this.forcePlaying = false;
    }

    queueAnimation(animations){
        this.animationQueue = animations;
    }

    nextFrame = ({dt, currentTime, gameTime}) => {
        // if(this.id=="miniboss") console.log("paused",this.pauseAnimation);
        if(this.pauseAnimation) return;

        this.elapsedTime += dt;

        if (this.elapsedTime >= this.frameChangeInterval) {
            this.frame += 1;
            this.frame %= this.spriteSheet.animations[this.currentAnimation].length;
            if(this.frameChangeCallback) this.frameChangeCallback(this.frame);
            if(this.frame == this.spriteSheet.animations[this.currentAnimation].length-1 ){
                 this.forcePlaying = false;// this has played at least 1 time
                 if(this.endAnimationCallback) {this.endAnimationCallback(); this.endAnimationCallback=null;}
                //  if(this.id=="miniboss") console.log("endAnimationCallback paused",this.pauseAnimation);
            }
            this.elapsedTime = 0; // Reset the elapsed time
        }
    }
    
    drawSprite=({dt, currentTime, gameTime})=>{

        this.nextFrame({dt, currentTime, gameTime});

        this.gameController.currentScene.backBuffer.globalAlpha = this.globalAlpha;
        //this.gameController.currentScene.backBuffer.scale(-1, 1);
        drawImageSprite(this.gameController.currentScene.backBuffer,
            this.spriteSheet.sprite,
            this.spriteSheet.animations[this.currentAnimation][this.frame][0]*this.spriteSheet.cellSize.width,
            this.spriteSheet.animations[this.currentAnimation][this.frame][1]*this.spriteSheet.cellSize.height,
            this.spriteSheet.cellSize.width,
            this.spriteSheet.cellSize.height,
            this.position.x+this.parent.position.x+Tools.getBob(this.bobbingStrength.x,this.bobbingStrength.fx),
            this.position.y+this.parent.position.y+Tools.getBob(this.bobbingStrength.y,this.bobbingStrength.fy),
            this.spriteSheet.spriteSize.width,
            this.spriteSheet.spriteSize.height,
            this.spriteAngle
        );
        this.gameController.currentScene.backBuffer.globalAlpha = 1;
    }

    brain({dt, currentTime, gameTime}){}

    setupCollisionBounds(){
        this.collisionBounds.x = this.parent.position.x+this.position.x - this.spriteSheet.spriteSize.width;
        this.collisionBounds.y = this.parent.position.y+this.position.y - this.spriteSheet.spriteSize.height;        
        this.collisionBounds.width = this.spriteSheet.spriteSize.width*2;
        this.collisionBounds.height = this.spriteSheet.spriteSize.height*2;
    }

    update ({dt, currentTime, gameTime}){
        this.runKeyFrames({dt, currentTime, gameTime});
        this.nextFrame({dt, currentTime, gameTime});
        this.brain({dt, currentTime, gameTime});
        this.setupCollisionBounds();
        this.children.forEach(child=>
            child.update({dt, currentTime, gameTime})
            );

        if(this.visible){
            if(this.showDebug) drawBox(this.gameController.currentScene.backBuffer, this.collisionBounds.x, this.collisionBounds.y , this.collisionBounds.width, this.collisionBounds.height, "red");
            this.drawSprite({dt, currentTime, gameTime});
            if(this.showDebug) drawCircle(this.gameController.currentScene.backBuffer, this.parent.position.x+this.position.x, this.parent.position.y+this.position.y, 4, "red");
        }
        this.processCamera();
    }

    processCamera(){
        if(this.camera){
            // const halfScreenWidth = (screenBuffer.canvas.width/(this.gameController.camera.zoom*2));
            // const halfScreenHeight = (screenBuffer.canvas.height/(this.gameController.camera.zoom*2));
            this.camera.offWindow.x = this.parent.position.x+this.position.x - this.camera.screenWindow.width / 2;
            this.camera.offWindow.y = this.parent.position.y+this.position.y - this.camera.screenWindow.height / 2;
        }        
    }

    keyFrameState = {}
    runKeyFrames({dt, currentTime, gameTime}){
        if(this.keyFrameState["fade"]){
            const percent = (gameTime-this.keyFrameState["fade"].startTime)/this.keyFrameState["fade"].time;
            this.globalAlpha= Tools.tween1D(this.keyFrameState["fade"].startVal, this.keyFrameState["fade"].val, percent);
            if(percent >= 1){
                if("statusID" in this.keyFrameState["fade"]){
                    delete this.sequencerStatus[this.keyFrameState["fade"].statusID];
                }
                this.keyFrameState["fade"] = null;
                this.animationController["fade"].shift();
            }            
        }
        if(this.keyFrameState["transtlation"]){
            const percent = (gameTime-this.keyFrameState["transtlation"].startTime)/this.keyFrameState["transtlation"].time;
            this.position={...Tools.tween2D(this.keyFrameState["transtlation"].startVal, this.keyFrameState["transtlation"].val, percent)};
            if(percent >= 1){
                if("statusID" in this.keyFrameState["transtlation"]){
                    // console.log("released");
                    delete this.sequencerStatus[this.keyFrameState["transtlation"].statusID];
                }
                this.keyFrameState["transtlation"] = null;
                this.animationController["transtlation"].shift();
            }            
        }

        if(!this.keyFrameState["fade"] && this.animationController["fade"].length>0){
            this.keyFrameState["fade"] = this.animationController["fade"][0];
            this.keyFrameState["fade"].startTime = gameTime;
            this.keyFrameState["fade"].startVal = this.globalAlpha;
        }

        if(!this.keyFrameState["transtlation"] && this.animationController["transtlation"].length>0){
            this.keyFrameState["transtlation"] = this.animationController["transtlation"][0];
            this.keyFrameState["transtlation"].startTime = gameTime;
            this.keyFrameState["transtlation"].startVal = {...this.position};
        }
    }

    addKeyFrame(kf){
        if("block" in kf) {
            kf.keyFrame.statusID = kf.block.statusID;
            this.sequencerStatus[kf.block.statusID]={complete:false};
        }
        this.animationController[kf.type].push(kf.keyFrame);
    }

    hit(direction, force){}
}

class EmptyEntity extends Entity{   
    constructor (gameController, id, position) {
        super(gameController, id, null, position);
    }
    update = ({dt, currentTime, gameTime}) => {}
}
