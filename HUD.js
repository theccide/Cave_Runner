class HUD{
    gameController = null;
    
    constructor(gameController){
        this.gameController = gameController;
    }

    update(dt){
        if(!this.gameController.resouncesReady) return;
        const hudImage =this.gameController.images["Images/hud.png"];
        drawImageFrom00(screenBuffer,hudImage,10,10,hudImage.width/2, hudImage.height/2);

        const healthPillImage =this.gameController.images["Images/heatlhgreen.png"];
        

        for(let i=0; i<5; i++) drawImageFrom00(screenBuffer,this.gameController.images["Images/heatlhback.png"],153+(i*14),25,healthPillImage.width/2, healthPillImage.height/2);
        for(let i=0; i<this.gameController.player.hp; i++) drawImageFrom00(screenBuffer,healthPillImage,153+(i*14),25,healthPillImage.width/2, healthPillImage.height/2);        
        drawText(screenBuffer,153,93,this.gameController.player.score, 15, "white",{canvasProps:{font:"bold 20pt monospace"}});
    }
}