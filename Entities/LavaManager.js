class LavaManager{
    lavaBounds = [
        {x:1435,y:260,width:135,height:417},
        {x:1570,y:40,width:350,height:405+8},
        {x:1570+350,y:270,width:190,height:180}
    ];

    constructor(gameController){
        this.gameController = gameController;
        this.timeDelay = 2000;
        this.lastEventTime = (new Date()).getTime();        
    }

    update(dt){
        const currentTime = (new Date()).getTime();
        if(currentTime > this.lastEventTime+this.timeDelay){
            this.lastEventTime = currentTime;
            const pos = {x: (Math.random() * this.lavaBounds[1].width)+this.lavaBounds[1].x,
                         y:(Math.random() * this.lavaBounds[1].height)+this.lavaBounds[1].y}
            this.gameController.spawn(
                this.gameController, 
                {entityType:"Fx", params:{fxType:"0", destroyOnFinishAnim: true, spriteMap:"BUBBLE"}, pos},
                 "bubble");
        }
    }
}