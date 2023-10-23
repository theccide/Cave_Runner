const testSequence = [
    {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":54,"y":740}}},
    {command:"Delay", params:{delayTime:100}},
    {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":413,"y":729}}},
    {command:"Delay", params:{delayTime:100}},
    {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":640,"y":730}}},
    {command:"Delay", params:{delayTime:100}},
    {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":650,"y":936}}},
    {command:"Delay", params:{delayTime:100}},
    {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":715,"y":996}}},
    {command:"Delay", params:{delayTime:100}},
    {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":868,"y":994}}},
    {command:"Delay", params:{delayTime:100}},
    {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":873,"y":1101}}},
    {command:"Delay", params:{delayTime:100}},
    {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":818,"y":1096}}},
    {command:"Delay", params:{delayTime:100}},
    {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":740,"y":1149}}},
    {command:"Delay", params:{delayTime:100}},
    {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":742,"y":1327}}},
    {command:"Delay", params:{delayTime:100}},
    {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":444,"y":1327}}},
    {command:"Delay", params:{delayTime:100}},
    {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":235,"y":1324}}},
    {command:"Delay", params:{delayTime:100}},
    {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":48,"y":1317}}},
    {command:"Delay", params:{delayTime:100}},
    {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":48,"y":1107}}},
    {command:"Delay", params:{delayTime:100}},
    {command:"Spawn", params:{entityType:"Torch",type:"thick",pos:{"x":59,"y":881}}},
    {command:"Delay", params:{delayTime:500}},
    {command:"Spawn", params:{entityType:"Boss", pos:{"x":380,"y":1000}}}
];

class Sequence{
    gameController = null;
    script = null;
    name="";
    scriptPtr = 0;
    isPaused = true;
    isWaiting = false;
    lastEventTime = 0;

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
                this.command_Spawn(dt,command);
            break;
            case "Delay":
                return this.command_Delay(dt,command);            
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
        this.gameController.spawn(this.gameController, command.params);
    }

    command_Delay(dt,command){
  
        const currentTime = (new Date()).getTime();
        if(!this.isWaiting) this.lastEventTime = currentTime;

        this.isWaiting = true;
        // console.log(currentTime, this.lastEventTime+command.params.delayTime)
        if(currentTime > this.lastEventTime+command.params.delayTime){
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