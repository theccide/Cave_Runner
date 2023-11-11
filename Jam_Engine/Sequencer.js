const startBossBattleSequence = [
    {command:"Player", params:{controls:false}},
    {command:"Camera", params:{zoom:2,time:1000}},
    {command:"Delay", params:{delayTime:10}},
    {command:"Camera", params:{detach:"Player"}},
    {command:"Player", params:{keyPressed:"s",time:1000}},
    {command:"Delay", params:{delayTime:1000}},

    {command:"Spawn", params:{entityType:"Torch", params:{type:"thick"},pos:{"x":54,"y":740}}},
    {command:"Camera", params:{fromEntity:"Player", moveTo:{"x":54,"y":740}, time:1000}},
    // {command:"Delay", params:{delayTime:500}},

    {command:"Camera", params:{from:{"x":54,"y":740}, moveTo:{"x":640,"y":730}, time:1000}},
    {command:"Spawn", params:{entityType:"Torch", params:{type:"thick"},pos:{"x":640,"y":730}}},    

    {command:"Camera", params:{from:{"x":640,"y":730}, moveTo:{"x":818,"y":1096}, time:1000}},
    {command:"Spawn", params:{entityType:"Torch", params:{type:"thick"},pos:{"x":818,"y":1096}}},    
    
    {command:"Camera", params:{from:{"x":818,"y":1096}, moveTo:{"x":235,"y":1324}, time:1000}},
    {command:"Spawn", params:{entityType:"Torch", params:{type:"thick"},pos:{"x":235,"y":1324}}},  

    {command:"Camera", params:{from:{"x":235,"y":1324}, moveTo:{"x":59,"y":881}, time:1000}},
    {command:"Spawn", params:{entityType:"Torch", params:{type:"thick"},pos:{"x":59,"y":881}}},  
    
    {command:"Delay", params:{delayTime:500}},

    {command:"Camera", params:{from:{"x":59,"y":881}, moveTo:{"x":380,"y":1000}, time:2000}},

    {command:"Spawn", params:{id:"Boss", entityType:"Boss", params:{}, pos:{"x":380,"y":1000}}},
    {command:"Camera", params:{shake:true,shakeIntensity:{x:5, y:5}}},
    {command:"Camera", params:{zoom:4,time:1000}},
    {command:"Delay", params:{delayTime:1000}},
    {command:"Camera", params:{zoom:2,time:1000}},
    {command:"Camera", params:{shake:false}},

    {command:"Spawn", params:{entityType:"Torch",params:{type:"thick",isInteractable:true},pos:{"x":413,"y":729}, delayTime:100}},
    // {command:"GameController", params:{fields:[{key:"darkOverlayLevel",value:0.89}]}},
    {command:"Spawn", params:{entityType:"Torch",params:{type:"thick",isInteractable:true},pos:{"x":650,"y":936}, delayTime:100}},
    // {command:"GameController", params:{fields:[{key:"darkOverlayLevel",value:0.79}]}},
    {command:"Spawn", params:{entityType:"Torch",params:{type:"thick",isInteractable:true},pos:{"x":715,"y":996}, delayTime:100}},
    // {command:"GameController", params:{fields:[{key:"darkOverlayLevel",value:0.69}]}},
    {command:"Spawn", params:{entityType:"Torch",params:{type:"thick",isInteractable:true},pos:{"x":868,"y":994}, delayTime:100}},
    // {command:"GameController", params:{fields:[{key:"darkOverlayLevel",value:0.59}]}},
    {command:"Spawn", params:{entityType:"Torch",params:{type:"thick",isInteractable:true},pos:{"x":873,"y":1101}, delayTime:100}},
    // {command:"GameController", params:{fields:[{key:"darkOverlayLevel",value:0.49}]}},
    {command:"Spawn", params:{entityType:"Torch",params:{type:"thick",isInteractable:true},pos:{"x":740,"y":1149}, delayTime:100}},
    // {command:"GameController", params:{fields:[{key:"darkOverlayLevel",value:0.39}]}},
    {command:"Spawn", params:{entityType:"Torch",params:{type:"thick",isInteractable:true},pos:{"x":742,"y":1327}, delayTime:100}},
    // {command:"GameController", params:{fields:[{key:"darkOverlayLevel",value:0.29}]}},
    {command:"Spawn", params:{entityType:"Torch",params:{type:"thick",isInteractable:true},pos:{"x":444,"y":1327}, delayTime:100}},
    // {command:"GameController", params:{fields:[{key:"darkOverlayLevel",value:0.19}]}},
    {command:"Spawn", params:{entityType:"Torch",params:{type:"thick",isInteractable:true},pos:{"x":48,"y":1317}, delayTime:100}},
    // {command:"GameController", params:{fields:[{key:"darkOverlayLevel",value:0.09}]}},
    {command:"Spawn", params:{entityType:"Torch",params:{type:"thick",isInteractable:true},pos:{"x":48,"y":1107}, delayTime:100}},
    {command:"Delay", params:{delayTime:500}},
    // {command:"GameController", params:{fields:[{key:"useDarkOverlay",value:false}]}},
    // {command:"GameController", params:{fields:[{key:"darkOverlayLevel",value:0.99}]}},
    {command:"Entity", params:{id:"Boss", fields:{brightness:0.9}}},
    {command:"Delay", params:{delayTime:100}},
    {command:"Entity", params:{id:"Boss", fields:{brightness:0.8}}},
    {command:"Delay", params:{delayTime:100}},
    {command:"Entity", params:{id:"Boss", fields:{brightness:0.7}}},
    {command:"Delay", params:{delayTime:100}},
    {command:"Entity", params:{id:"Boss", fields:{brightness:0.6}}},
    {command:"Delay", params:{delayTime:100}},
    {command:"Entity", params:{id:"Boss", fields:{brightness:0.5}}},
    {command:"Delay", params:{delayTime:100}},
    {command:"Entity", params:{id:"Boss", fields:{brightness:0.4}}},
    {command:"Delay", params:{delayTime:100}},
    {command:"Entity", params:{id:"Boss", fields:{brightness:0.3}}},
    {command:"Delay", params:{delayTime:100}},
    {command:"Entity", params:{id:"Boss", fields:{brightness:0.2}}},
    {command:"Delay", params:{delayTime:100}},

    {command:"Entity", params:{id:"Boss", fields:{isLightSource:false}}},

    {command:"Camera", params:{from:{"x":380,"y":1000}, moveToEntity:"Player", time:1500}},
    {command:"Camera", params:{attach:"Player"}},
    {command:"Player", params:{controls:true}},
    {command:"State", params:{entity:"Boss", state:2}},
    {command:"End"}
];

const miniBossDeathSequence = [
    {command:"Entity", params:{id:"miniboss", fn:"removeOrbit"}},
    {command:"Entity", params:{id:"miniboss", fn:"detachChild", args:"key"}},
    {command:"Player", params:{controls:false}},
    {command:"Camera", params:{detach:"Player"}},
    {command:"Camera", params:{attachToEntity:"miniboss"}},
    {command:"Camera", params:{zoom:2,time:1000}},
    {command:"Spawn", params:{id:"runner",entityType:"Runner",params:{},pos:{x:850,y:300}, fields:{
        searchingWaypoints:[{x:1350,y:300},{x:1350,y:85},{x:1500,y:85},{x:1500,y:320},{x:1600,y:320},{x:1900,y:90},{x:2100,y:90}],
        state: Runner.states.IDLE        
    },delayTime:100}},
    {command:"Delay", params:{delayTime:1000}},
    {command:"Camera", params:{attachToEntity:"key"}},
    {command:"Entity", params:{id:"key", fn:"addKeyFrame", block:{statusID:"transtlation"}, args:{type:"transtlation", keyFrame:{val:{x:825,y:300}, time:2000}}}},
    {command:"Entity", params:{id:"runner", attachEntity:"key"}},
    {command:"Camera", params:{zoom:2.7}},
    {command:"Delay", params:{delayTime:1000}},
    {command:"Camera", params:{attachToEntity:"runner"}},
    {command:"Entity", params:{id:"runner", fn:"run", args:{}, block:{statusID:"GottoDoor"}}},
    {command:"Entity", params:{id:"runner", fn:"detachChild", args:"key"}},
    {command:"Camera", params:{zoom:1, time:500}},
    {command:"Camera", params:{detach:"runner"}},
    {command:"Camera", params:{fromEntity:"runner", moveToEntity:"Player", time:2000}},
    {command:"Entity", params:{id:"runner", destroy:true}},
    {command:"Entity", params:{id:"key", destroy:true}},

    {command:"Spawn", params:{id:"endRunner",entityType:"EndRunner",params:{},pos:{x:2400,y:1250}}},
    {command:"Sequence", params:{start:"stealObeliskPower"}},

    {command:"Camera", params:{attach:"Player"}},
    {command:"Player", params:{controls:true}},
    {command:"End"}
];

const golemAttackSequence = [
    {command:"Camera", params:{shake:true,shakeIntensity:{x:5, y:5}}},
    {command:"Delay", params:{delayTime:1000}},
    {command:"Camera", params:{shake:false}},
    {command:"Spawn", params:{entityType:"FallingRock",params:{type:"FOUR", ground:{x:2293,y:1200}},pos:{x:2293,y:900}, delayTime:100}},
    {command:"Spawn", params:{entityType:"FallingRock",params:{type:"FIVE", ground:{x:2550,y:1300}},pos:{x:2550,y:860}, delayTime:100}},
    {command:"Spawn", params:{entityType:"FallingRock",params:{type:"FOUR", ground:{x:2550,y:900}},pos:{x:2600,y:800}, delayTime:100}},
    {command:"Spawn", params:{entityType:"FallingRock",params:{type:"FIVE", ground:{x:2000,y:1250}},pos:{x:2000,y:900}, delayTime:100}},
    {command:"Spawn", params:{entityType:"FallingRock",params:{type:"FOUR", ground:{x:2600,y:970}},pos:{x:2700,y:830}, delayTime:100}},
    {command:"End"}
];

const rescueSpiritSequence = [
    {command:"Player", params:{controls:false}},
    {command:"Camera", params:{detach:"Player"}},
    {command:"Camera", params:{zoom:2,time:1000}},
    {command:"Spawn", params:{entityType:"Fx",params:{fxType:5, destroyOnFinishAnim: true},pos:{x:850,y:500}, delayTime:100}},
    {command:"Delay", params:{delayTime:1000}},
    {command:"Spawn", params:{id:"skull", entityType:"Skull",params:{shouldRotate:false},pos:{x:850,y:500}, delayTime:100}},
    {command:"Delay", params:{delayTime:100}},
    {command:"Camera", params:{attachToEntity:"skull"}},
    {command:"Delay", params:{delayTime:1000}},    
    {command:"Dialog", params:{open:true, text:["Thank you for resucing me adventurer! I have been stuck in this pot for a 1000 years!","Let me join you to defeat the stone Golem guarding the obelisk."]}},
    {command:"Delay", params:{delayTime:100}},
    {command:"Dialog", params:{open:false}},
    {command:"Player", params:{attachEntity:"skull"}},
    {command:"Entity", params:{id:"skull", fn:"addKeyFrame", args:{type:"fade", keyFrame:{val:0.5, time:2000}}}},
    {command:"Entity", params:{id:"skull", fn:"addKeyFrame", block:{statusID:"transtlation"}, args:{type:"transtlation", keyFrame:{val:{x:45, y:45}, time:2000}}}},
    {command:"Entity", params:{id:"Obelisk", fn:"switchAnimation", args:"HIT"}},
    {command:"Camera", params:{attach:"Player"}},
    {command:"Camera", params:{zoom:1,time:1000}},
    {command:"Player", params:{controls:true}},    
    {command:"Entity", params:{id:"skull", fn:"setOrbit", args:{speed:50}}},
    {command:"End"}
];

const playerDeathSequence=[
    {command:"Player", params:{controls:false}},
    {command:"Player", params:{fields:{visible:false}}},
    {command:"Spawn", params:{entityType:"Fx",params:{fxType:"THREE", destroyOnFinishAnim: true, spriteMap:"SMOKEFX03"},fields:{frameChangeInterval:0.1}, pos:"player"}},
    {command:"Camera", params:{zoom:2, timeScale:0.5, time:1000}},
    {command:"Delay", params:{delayTime:1500}},
    {command:"Camera", params:{timeScale:1}},
    {command:"Level", params:{scene:"GameOver"}},
    {command:"End"}
]

const stealObeliskPowerSequence = [
    {command:"Delay", params:{delayTime:10}},
    {command:"Spawn", params:{entityType:"Fx", params:{fxType:"0", destroyOnFinishAnim: true, spriteMap:"STARFALL"}, pos:{x:2420,y:1050}}},
    {command:"Delay", params:{delayTime:2000}},
    {command:"Sequence", params:{start:"golemAttack"}},    
    // {command:"Camera", params:{shake:true,shakeIntensity:{x:5, y:5}}},
    // {command:"Delay", params:{delayTime:1000}},
    // {command:"Camera", params:{shake:false}},
    {command:"Delay", params:{delayTime:5000}},
    {command:"Sequence", params:{start:"stealObeliskPower"}},
    {command:"End"}
]

const activateGolemSequence = [
    {command:"Player", params:{moveTo:{x:2000,y:600}}},
    {command:"Player", params:{controls:false}},
    {command:"Delay", params:{delayTime:10}},
    {command:"Camera", params:{detach:"Player"}},

    {command:"Player", params:{fn:"detachChild", args:"skull"}},
    {command:"Entity", params:{id:"skull", fields:{shouldRotate:false}}},
    {command:"Camera", params:{attachToEntity:"skull"}},
    {command:"Entity", params:{id:"skull", fn:"addKeyFrame", block:{statusID:"transtlation"}, args:{type:"transtlation", keyFrame:{val:{x:2250,y:850}, time:2000}}}},

    {command:"Delay", params:{delayTime:1000}},

    {command:"Spawn", params:{id:"endRunner",entityType:"EndRunner",params:{},pos:{x:2400,y:1250}}},
    {command:"Sequence", params:{start:"stealObeliskPower"}},
    {command:"Spawn", params:{id:"golem",entityType:"Golem",params:{},pos:{x:2200,y:800}}},    
    {command:"Entity", params:{id:"golem", attachEntity:"skull"}},

    {command:"Delay", params:{delayTime:1500}},
    {command:"Entity", params:{id:"golem", args:{}, block:{statusID:"wakeup"}, fn:"wakeup"}},
    {command:"Entity", params:{id:"skull", fn:"setOrbit", args:{speed:50}}},

    {command:"Camera", params:{zoom:2,time:1000}},
    {command:"Camera", params:{attachToEntity:"golem"}},
    {command:"Hud", params:{mode:"golem"}},
    {command:"Entity", params:{id:"golem", controls:true}},

    {command:"GameController", params:{fields:[{key:"darkOverlayLevel",value:0.89}]}},
    {command:"Delay", params:{delayTime:100}},
    {command:"GameController", params:{fields:[{key:"darkOverlayLevel",value:0.79}]}},
    {command:"Delay", params:{delayTime:100}},
    {command:"GameController", params:{fields:[{key:"darkOverlayLevel",value:0.69}]}},
    {command:"Delay", params:{delayTime:100}},
    {command:"GameController", params:{fields:[{key:"darkOverlayLevel",value:0.59}]}},
    {command:"Delay", params:{delayTime:100}},
    {command:"GameController", params:{fields:[{key:"darkOverlayLevel",value:0.49}]}},
    {command:"Delay", params:{delayTime:100}},
    {command:"GameController", params:{fields:[{key:"darkOverlayLevel",value:0.39}]}},
    {command:"Delay", params:{delayTime:100}},
    {command:"GameController", params:{fields:[{key:"darkOverlayLevel",value:0.29}]}},
    {command:"Delay", params:{delayTime:100}},
    {command:"GameController", params:{fields:[{key:"darkOverlayLevel",value:0.19}]}},
    {command:"Delay", params:{delayTime:100}},
    {command:"GameController", params:{fields:[{key:"darkOverlayLevel",value:0.09}]}},    

    {command:"End"}
];

const winSequence = [
    {command:"Player", params:{controls:false}},
    {command:"Delay", params:{delayTime:2000}},
    {command:"Level", params:{scene:"Credits"}},
    {command:"End"}
];

class Sequence{
    gameController = null;
    script = null;
    name="";
    scriptPtr = 0;
    isPaused = true;
    isWaiting = false;
    lastEventTime = 0;
    commandGlobals = {};

    constructor(name, gameController, script){
        this.name = name;
        this.gameController = gameController;
        this.script = script;
    }

    pause(pause){this.isPaused = pause;}
    start(){
        this.isPaused = false;
        this.scriptPtr = 0;
    }

    runCommand(dtPackage,command){
        switch(command.command){
            case "Sequence":
                return this.command_Sequence(dtPackage,command.params);                        
            case "Spawn":
                return this.command_Spawn(dtPackage,command.params);
            case "Dialog":
                return this.command_Dialog(dtPackage,command.params);                
            case "Delay":
                return this.command_Delay(dtPackage,command.params);
            case "Entity":
                return this.command_Entity(dtPackage,command.params);
            case "Camera":
                return this.command_Camera(dtPackage,command.params);
            case "Hud":
                return this.command_Hud(dtPackage,command.params);    
            case "Player":
                return this.command_Player(dtPackage,command.params);
            case "State":
                return this.command_State(dtPackage,command.params);
            case "Level":
                return this.command_Level(dtPackage,command.params);
            case "GameController":
                return this.command_GameController(dtPackage,command.params);
            case "End":
                // console.log("end");
                break;
            default:
                console.log("Command Not Found! "+command.command);
                break;
        }
        this.scriptPtr++;
        return true;
    }

    update(dtPackage){
        if(this.isPaused) return;
        if(this.scriptPtr >= this.script.length-1) return;
        while(this.scriptPtr < this.script.length && this.runCommand(dtPackage,this.script[this.scriptPtr])){}
    }

    command_GameController(dtPackage,command){
        if(command.fields){
            command.fields.forEach(field=>{
                this.gameController[field.key]=field.value;
            });
            this.scriptPtr++;
            return true;                        
        }
    }

    command_Sequence(dtPackage,command){
        if(command.start){
            this.gameController.sequencer.startSequence(command.start);
            this.scriptPtr++;
            return true;                        
        }
    }

    command_Level(dtPackage,command){
        if(command.scene == "GameOver"){
            changeScene(new GameOver(this.gameController.player.score));
        }
        if(command.scene == "Credits"){
            changeScene(new Credits(this.gameController.player.score));
        }        
    }
    
    command_Hud(dtPackage,command){
        if("mode" in command){
            this.gameController.currentScene.HUD.mode = command.mode;
        }
        this.scriptPtr++;
        return true;
    }

    command_Spawn({dt, currentTime, gameTime},command){
        if(command?.pos=="player"){
            command.pos = {...this.gameController.player.position};
        }
        if(command.delayTime){

            if(!this.isWaiting) this.lastEventTime = gameTime;
    
            this.isWaiting = true;
            // console.log(gameTime, this.lastEventTime+command.params.delayTime)
            if(gameTime > this.lastEventTime+command.delayTime){
                this.isWaiting = false;
                this.gameController.spawn(this.gameController, command, command.id);
                this.scriptPtr++;
                return true;
            }
            return false;            
        }
        this.scriptPtr++;
        this.gameController.spawn(this.gameController, command, command.id);
        return true;
    }
    
    command_Entity({dt, currentTime, gameTime},command){ 
        let entity =  this.gameController.entityMap[command.id];

        if (command.hasOwnProperty('fields')){        
            entity.updateFields(command.fields);
            this.scriptPtr++;
            return true;
        }
        if (command.hasOwnProperty('destroy')){
            this.gameController.destroy(entity);
            this.scriptPtr++;
            return true;            
        }  
        
        if (command.hasOwnProperty('controls')){
            this.gameController.entityMap[command.id].setPlayerControlled(command.controls);
            this.scriptPtr++;
            return true;              
        }

        if (command.hasOwnProperty('attachEntity')){
            let child = this.gameController.entityMap[command.attachEntity];
            child.position = {x:child.position.x-entity.position.x, y:child.position.y-entity.position.y};
            entity.addChild(child);
            this.scriptPtr++;
            return true;            
        }         

        if(command.block){
            if(this.isWaiting != true){
                command.args["block"] = {...command.block};
                if("args" in command){
                    if(typeof command.args == "string") 
                        entity[command.fn](command.args);
                    else 
                        entity[command.fn]({...command.args});
                }else{
                    entity[command.fn]();
                }
            }
            this.isWaiting = true;
            if(entity.getSequencerStatus(command.block.statusID)){
                this.isWaiting = false;
                this.scriptPtr++;
                return true;
            }
            return false;
        }

        if("args" in command){
            if(typeof command.args == "string") 
                entity[command.fn](command.args);
            else 
                entity[command.fn]({...command.args});
        }else{
            entity[command.fn]();
        }
        
        this.scriptPtr++;
    }
    command_Player({dt, currentTime, gameTime},command){ 
        if (command.hasOwnProperty('fields')){        
            this.gameController.player.updateFields(command.fields);
        }
        if (command.hasOwnProperty('controls')){
            this.gameController.player.setPlayerControlled(command.controls);
        }
        if(command.hasOwnProperty('moveTo')){
            this.gameController.player.position = {...command.moveTo};
        }
        if (command.hasOwnProperty('attachEntity')){
            let child = this.gameController.entityMap[command.attachEntity];
            child.position = {x:child.position.x-this.gameController.player.position.x, y:child.position.y-this.gameController.player.position.y};
            this.gameController.player.addChild(child);
        }        
        if(command.keyPressed){
            this.gameController.player.processInput({type:"down",key:command.keyPressed});

            if(command.time){
                if(!this.isWaiting){
                    this.lastEventTime = gameTime;
                }
                this.isWaiting = true;
                if(gameTime > this.lastEventTime+command.time){
                    this.gameController.player.processInput({type:"up",key:command.keyPressed});
                    this.scriptPtr++;
                    this.isWaiting = false;
                    return true;
                }
                return false;
            }
        }
        
        const entity = this.gameController.player;
        if(command.block){
            if(this.isWaiting != true){
                command.args["block"] = {...command.block};
                if("args" in command){
                    if(typeof command.args == "string") 
                        entity[command.fn](command.args);
                    else 
                        entity[command.fn]({...command.args});
                }else{
                    entity[command.fn]();
                }
            }
            this.isWaiting = true;
            if(entity.getSequencerStatus(command.block.statusID)){
                this.isWaiting = false;
                this.scriptPtr++;
                return true;
            }
            return false;
        }

        if("fn" in command && "args" in command){
            if(typeof command.args == "string") 
                entity[command.fn](command.args);
            else 
                entity[command.fn]({...command.args});
        }else if("fn" in command){
            entity[command.fn]();
        }        

        this.scriptPtr++;
        return true;
    }

    command_Dialog(dtPackage,command){
        if(command.open)
            this.gameController.currentScene.dialogManager.setupDialog(command.text);
        if(!command.open)
            this.gameController.currentScene.dialogManager.close();
        this.scriptPtr++;
    }

    command_State(dtPackage,command){
        this.gameController.entityMap[command.entity].state = command.state;
        this.scriptPtr++;
    }
    
    command_Camera({dt, currentTime, gameTime},command){

        if(command.time && (command.zoom || command.timeScale)){
            if(!this.isWaiting){
                this.commandGlobals.startZoom = this.gameController.camera.zoom;
                this.commandGlobals.startTimeScale = timeScale;
                this.lastEventTime = gameTime;
                this.isWaiting = true;
            }

            const percent = Math.min(((gameTime-this.lastEventTime)/command.time),1);

            if(percent>=1){
                console.log("relesed");
                this.scriptPtr++;
                this.isWaiting = false;
                return true;
            }

            if(command.zoom){
                let zoom = Tools.tween1D(this.commandGlobals.startZoom, command.zoom, percent);
                this.gameController.camera.setZoom(zoom);
            }

            if(command.timeScale){
                let newTimeScale = Tools.tween1D(this.commandGlobals.startTimeScale, command.timeScale, percent);
                timeScale = newTimeScale;
            }

            return false;                    
        }
        else{
            if(command.zoom) this.gameController.camera.setZoom(command.zoom);
            if(command.timeScale) timeScale = command.timeScale;
        }
        
        // if(command.zoom){
        //     if(command.time){
        //         if(!this.isWaiting){
        //             this.commandGlobals.startZoom = this.gameController.camera.zoom;
        //             this.lastEventTime = gameTime;
        //         }
        //         this.isWaiting = true;
        //         const percent = (gameTime-this.lastEventTime)/command.time;
        //         let zoom = Tools.tween1D(this.commandGlobals.startZoom, command.zoom, percent);
        //         if(percent>=1){
        //             zoom = command.zoom;
        //             this.scriptPtr++;
        //             this.isWaiting = false;
        //             return true;
        //         }
        //         this.gameController.camera.setZoom(zoom);
        //         return false;
        //     }
        //     this.gameController.camera.setZoom(command.zoom);
        // }

        if(command.hasOwnProperty('shake')){
            this.gameController.camera.shake = command.shake;
            if(command.shakeIntensity)
                this.gameController.camera.shakeIntensity = {...command.shakeIntensity};
            else
                this.gameController.camera.shakeIntensity = {x:0,y:0};
        }
        if(command.moveTo || command.moveToEntity){

            if(command.time){
                if(!this.isWaiting){
                    if(command.moveToEntity){
                        if(command.moveToEntity==="Player"){
                            this.commandGlobals.to_x = this.gameController.player.position.x;
                            this.commandGlobals.to_y = this.gameController.player.position.y;
                        }
                        else{
                            this.commandGlobals.to_x = this.gameController.entityMap[command.moveToEntity].position.x;
                            this.commandGlobals.to_y = this.gameController.entityMap[command.moveToEntity].position.y;
                        }
                    }
                    if(command.fromEntity){
                        if(command.fromEntity==="Player"){
                            this.commandGlobals.from_x = this.gameController.player.position.x;
                            this.commandGlobals.from_y = this.gameController.player.position.y;
                        }
                        else{
                            this.commandGlobals.from_x = this.gameController.entityMap[command.fromEntity].position.x;
                            this.commandGlobals.from_y = this.gameController.entityMap[command.fromEntity].position.y;
                        }
                    }
                    if(command.from){
                        this.commandGlobals.from_x = command.from.x;
                        this.commandGlobals.from_y = command.from.y;
                    }
                    if(command.moveTo){
                        this.commandGlobals.to_x = command.moveTo.x;
                        this.commandGlobals.to_y = command.moveTo.y;
                    }
                    this.lastEventTime = gameTime;
                }
                this.isWaiting = true;
                const percent = (gameTime-this.lastEventTime)/command.time;
                let moveTo_x = Tools.tween1D(this.commandGlobals.from_x, this.commandGlobals.to_x, percent);
                let moveTo_y = Tools.tween1D(this.commandGlobals.from_y, this.commandGlobals.to_y, percent);
                if(percent>=1){
                    moveTo_x = this.commandGlobals.to_x;
                    moveTo_y = this.commandGlobals.to_y;
                    this.scriptPtr++;
                    this.isWaiting = false;
                    return true;
                }
                this.gameController.camera.offWindow.x = moveTo_x - this.gameController.camera.screenWindow.width / 2;
                this.gameController.camera.offWindow.y = moveTo_y - this.gameController.camera.screenWindow.height / 2;
                return false;
            }          

            this.gameController.camera.offWindow.x = command.moveTo.x - this.gameController.camera.screenWindow.width / 2;
            this.gameController.camera.offWindow.y = command.moveTo.y - this.gameController.camera.screenWindow.height / 2;
        }

        if(command.detach){
            if(command.detach == "Player") 
                this.gameController.player.camera = null;
            else
                this.gameController.entityMap[command.detach].camera = null;
        }
        if(command.attach){
            if(command.attach == "Player"){
                this.gameController.entities.forEach(entity=>entity.camera = null);
                this.gameController.player.camera = this.gameController.camera;
            }                 
        }
        if(command.attachToEntity){
            this.gameController.entities.forEach(entity=>entity.camera = null);
            this.gameController.entityMap[command.attachToEntity].camera = this.gameController.camera;
        }
        this.scriptPtr++;
        return true;
    }

    command_Delay({dt, currentTime, gameTime},command){
  
        if(!this.isWaiting) this.lastEventTime = gameTime;

        this.isWaiting = true;
        // console.log(gameTime, this.lastEventTime+command.params.delayTime)
        if(gameTime > this.lastEventTime+command.delayTime){
            this.isWaiting = false;
            this.scriptPtr++;
            return true;
        }
        return false;
    }
}

class Sequencer{
    sequences = [];
    sequenceMap = {};
    gameController = null;

    constructor(gameController){
        this.gameController = gameController;
        this.addSequence(new Sequence("startBossBattle",gameController,startBossBattleSequence));
        this.addSequence(new Sequence("miniBossDeath",gameController,miniBossDeathSequence));
        this.addSequence(new Sequence("golemAttack",gameController,golemAttackSequence));
        this.addSequence(new Sequence("rescueSpirit",gameController,rescueSpiritSequence));
        this.addSequence(new Sequence("playerDeath",gameController, playerDeathSequence));
        this.addSequence(new Sequence("activateGolem",gameController, activateGolemSequence));
        this.addSequence(new Sequence("stealObeliskPower",gameController, stealObeliskPowerSequence));        
        this.addSequence(new Sequence("win",gameController, winSequence));        
    }

    addSequence(sequence){
        this.sequences.push(sequence);
        this.sequenceMap[sequence.name] = sequence;
    }

    pauseSequence(sequenceName, pause){ this.sequenceMap[sequenceName].pause(pause);}
    startSequence(sequenceName){ this.sequenceMap[sequenceName].start();}

    update(dtPackage){
        this.sequences.forEach(sequence=>sequence.update(dtPackage));
    }
}