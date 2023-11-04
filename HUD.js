class HUD{
    gameController = null;
    
    constructor(gameController){
        this.gameController = gameController;
    }

    lastBarTime = 0;
    update(dt){
        const currentTime = (new Date()).getTime();
        if(!this.gameController.resouncesReady) return;
        const hudImage =this.gameController.images["Images/hud.png"];
        drawImageFrom00(screenBuffer,hudImage,10,10,hudImage.width/2, hudImage.height/2);

        let healthPillImage =this.gameController.images["Images/heatlhgreen.png"];
        if(this.gameController.player.hp < 3)
            healthPillImage = this.gameController.images["Images/heatlhred.png"];

        for(let i=0; i<5; i++) drawImageFrom00(screenBuffer,this.gameController.images["Images/heatlhback.png"],153+(i*14),25,healthPillImage.width/2, healthPillImage.height/2);
        
        if(this.gameController.player.hp == 1 && this.lastBarTime == 0) this.lastBarTime = currentTime;

        if(this.gameController.player.hp == 1 && currentTime > this.lastBarTime+1000){ // make the last health bar flash after 1 second delay
            const seconds = Math.floor(currentTime/500);
            if(seconds%2==0)
                drawImageFrom00(screenBuffer,healthPillImage,153,25,healthPillImage.width/2, healthPillImage.height/2);
        }
        else{
            for(let i=0; i<this.gameController.player.hp; i++) 
                drawImageFrom00(screenBuffer,healthPillImage,153+(i*14),25,healthPillImage.width/2, healthPillImage.height/2);        
        }
        drawText(screenBuffer,153,93,this.gameController.player.score, 15, "white",{canvasProps:{font:"bold 20pt monospace"}});
    }
}