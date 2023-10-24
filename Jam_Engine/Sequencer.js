const testSequence = [
    {command:"Camera", params:{zoom:3}},
    {command:"Delay", params:{delayTime:10}},
    {command:"Camera", params:{detach:"Player"}},
    {command:"Player", params:{controls:false}},
    {command:"Player", params:{keyPressed:"s",time:500}},
    {command:"Spawn", params:{entityType:"Fx", fxType:"5", destroyOnFinishAnim: true, pos:{x: 525, y: 692}}},

    {command:"Camera", params:{moveTo:{"x":54,"y":740}}},
    {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":54,"y":740}}},

    
    //{command:"Camera", params:{detach:"Player", zoom:3, time:1500}},
    {command:"End"},

    // {command:"Delay", params:{delayTime:500}},
    // {command:"Camera", params:{moveTo:{"x":640,"y":730}, time:1000}},
    // {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":640,"y":730}}},
    // {command:"Delay", params:{delayTime:500}},
    // {command:"Delay", params:{moveTo:{"x":818,"y":1096}, delayTime:500}},
    // {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":818,"y":1096}}},
    // {command:"Delay", params:{delayTime:500}},
    // {command:"Delay", params:{moveTo:{"x":235,"y":1324}, delayTime:250}},
    // {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":235,"y":1324}}},
    // {command:"Delay", params:{delayTime:500}},
    // {command:"Delay", params:{moveTo:{"x":59,"y":881}, delayTime:100}},
    // {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":59,"y":881}}},

    // {command:"Delay", params:{delayTime:500}},
    // {command:"Spawn", params:{entityType:"Boss", pos:{"x":380,"y":1000}}},
    // {command:"Camera", params:{shake:true, time:1000, force:{x:10,y:10}}},

    // {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":413,"y":729}}},
    // {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":650,"y":936}}},
    // {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":715,"y":996}}},
    // {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":868,"y":994}}},
    // {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":873,"y":1101}}},
    // {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":740,"y":1149}}},
    // {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":742,"y":1327}}},
    // {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":444,"y":1327}}},
    // {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":48,"y":1317}}},
    // {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":48,"y":1107}}}

];
// const testSequence = [
//     {command:"Camera", params:{detach:"Player"}},
//     {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":54,"y":740}}},
//     {command:"Delay", params:{delayTime:100}},
//     {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":413,"y":729}}},
//     {command:"Delay", params:{delayTime:100}},
//     {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":640,"y":730}}},
//     {command:"Delay", params:{delayTime:100}},
//     {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":650,"y":936}}},
//     {command:"Delay", params:{delayTime:100}},
//     {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":715,"y":996}}},
//     {command:"Delay", params:{delayTime:100}},
//     {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":868,"y":994}}},
//     {command:"Delay", params:{delayTime:100}},
//     {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":873,"y":1101}}},
//     {command:"Delay", params:{delayTime:100}},
//     {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":818,"y":1096}}},
//     {command:"Delay", params:{delayTime:100}},
//     {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":740,"y":1149}}},
//     {command:"Delay", params:{delayTime:100}},
//     {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":742,"y":1327}}},
//     {command:"Delay", params:{delayTime:100}},
//     {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":444,"y":1327}}},
//     {command:"Delay", params:{delayTime:100}},
//     {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":235,"y":1324}}},
//     {command:"Delay", params:{delayTime:100}},
//     {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":48,"y":1317}}},
//     {command:"Delay", params:{delayTime:100}},
//     {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":48,"y":1107}}},
//     {command:"Delay", params:{delayTime:100}},
//     {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":59,"y":881}}},
//     {command:"Delay", params:{delayTime:500}},
//     {command:"Spawn", params:{entityType:"Boss", pos:{"x":380,"y":1000}}}
// ];

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

    runCommand(dt,command){
        switch(command.command){
            case "Spawn":
                this.command_Spawn(dt,command.params);
            break;
            case "Delay":
                return this.command_Delay(dt,command.params);
            case "Camera":
                return this.command_Camera(dt,command.params);
            case "Player":
                return this.command_Player(dt,command.params);
            default:
                console.log("Command Not Found!");
        }
        this.scriptPtr++;
        return true;
    }

    update(dt){
        if(this.isPaused) return;
        if(this.scriptPtr >= this.script.length-1) return;
        while(this.scriptPtr < this.script.length && this.runCommand(dt,this.script[this.scriptPtr])){}
    }

    command_Spawn(dt,command){
        this.gameController.spawn(this.gameController, command);
    }

    command_Player(dt,command){ 
        const currentTime = (new Date()).getTime();

        if (command.hasOwnProperty('controls')){        
            this.gameController.player.setPlayerControlled(command.controls);
        }
        if(command.keyPressed){
            this.gameController.player.processInput({type:"down",key:command.keyPressed});

            if(command.time){
                if(!this.isWaiting){
                    this.lastEventTime = currentTime;
                }
                this.isWaiting = true;
                if(currentTime > this.lastEventTime+command.time){
                    this.gameController.player.processInput({type:"up",key:command.keyPressed});
                    this.scriptPtr++;
                    this.isWaiting = false;
                    return true;
                }
                return false;
            }
        }
        
        this.scriptPtr++;
        return true;
    }
    
    command_Camera(dt,command){
  
        const currentTime = (new Date()).getTime();
        if(command.zoom){
            if(command.time){
                if(!this.isWaiting){
                    this.commandGlobals.startZoom = this.gameController.camera.zoom;
                    this.lastEventTime = currentTime;
                }
                this.isWaiting = true;
                const percent = (currentTime-this.lastEventTime)/command.time;
                let zoom = Tools.tween1D(this.commandGlobals.startZoom, command.zoom, percent);
                if(percent>=1){
                    zoom = command.zoom;
                    this.scriptPtr++;
                    this.isWaiting = false;
                    return true;
                }
                this.gameController.camera.setZoom(zoom);
                return false;
            }
            this.gameController.camera.setZoom(command.zoom);
        }

        if(command.moveTo){
            this.gameController.camera.offWindow.x = command.moveTo.x;
            this.gameController.camera.offWindow.y = command.moveTo.y;
        }

        if(command.detach){
            if(command.detach == "Player") 
                this.gameController.player.camera = null;
        }
        
        this.scriptPtr++;
        return true;
    }

    command_Delay(dt,command){
  
        const currentTime = (new Date()).getTime();
        if(!this.isWaiting) this.lastEventTime = currentTime;

        this.isWaiting = true;
        // console.log(currentTime, this.lastEventTime+command.params.delayTime)
        if(currentTime > this.lastEventTime+command.delayTime){
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
        this.addSequence(new Sequence("startBossBattle",gameController,testSequence));
    }

    addSequence(sequence){
        this.sequences.push(sequence);
        this.sequenceMap[sequence.name] = sequence;
    }

    pauseSequence(sequenceName, pause){ this.sequenceMap[sequenceName].pause(pause);}
    startSequence(sequenceName){ this.sequenceMap[sequenceName].start();}

    update(dt){
        this.sequences.forEach(sequence=>sequence.update(dt));
    }
}