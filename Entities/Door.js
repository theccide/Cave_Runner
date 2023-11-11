class Door extends Entity{
    attachedEntities = [];

    constructor (gameController, id, {type}, position, attachedEntities) {        
        super(gameController, id, null, position);
        if(attachedEntities) this.attachedEntities = attachedEntities;
        this.isClosed = true;
        this.isOpening = false;
        this.isCLosing = false;        
        this.isLocked = false;
        this.isHor = (type=="hor");
        this.doorOnMap = [];

        if(this.isHor){
            this.doorOnMap=[ {x:this.position.x-16, y:this.position.y}, {x:this.position.x+16, y:this.position.y} ];
            this.initSpriteSheet( {
                sprite: null,
                fileName: "Images/spritemaps/hor_door.png",
                cellSize: { width: 72, height: 41 },
                spriteSize: { width: 36, height: 20 },
                grid: { rows: 4, columns: 1 },
                startAnimation: "CLOSED",
                animations:{
                    "CLOSED": [[0,0]], 
                    "OPENING": [[0,0],[0,1],[0,2],[0,3]], 
                    "CLOSING": [[0,3],[0,2],[0,1],[0,0]], 
                    "OPEN": [[0,3]]
                }
            });
        }
        if(!this.isHor){
            this.doorOnMap=[ {x:this.position.x, y:this.position.y-16}, {x:this.position.x, y:this.position.y+16} ];
            this.initSpriteSheet( {
                sprite: null,
                fileName: "Images/spritemaps/ver_door.png",
                cellSize: { width: 20, height: 72 },
                spriteSize: { width: 10, height: 36 },
                grid: { rows: 1, columns: 4 },
                startAnimation: "CLOSED",
                animations:{
                    "CLOSED": [[0,0]], 
                    "OPENING": [[0,0],[1,0],[2,0],[3,0]], 
                    "CLOSING": [[3,0],[2,0],[1,0],[0,0]], 
                    "OPEN": [[3,0]]
                }
            });
        }
        this.frameChangeInterval = 0.2;
    }

    setLock({shouldLock}){
        this.isLocked=shouldLock;
        this.doorOnMap.forEach(doorSlot=>
            this.gameController.levelMap.switchCellValueFromMap(doorSlot,shouldLock?1:0)
        );
    }

    doorShouldBeOpen(){
        let shouldBeOpen = false;
        if(Tools.distanceBetweenPoints(this.gameController.player.position, this.position) < 80)
            return true;

        shouldBeOpen = this.attachedEntities.filter(entity => 
            Tools.distanceBetweenPoints(entity.position, this.position) < 80
        ).length > 0;

        return shouldBeOpen;
    }
    brain=({dt, currentTime, gameTime})=>{
        if(this.isLocked) return;

        if(this.doorShouldBeOpen()){
            if(this.isClosed){
                this.isClosed = false;
                this.isOpening = true;
                this.switchAnimation("OPENING");
                this.endAnimationCallback=()=>{
                    this.isOpening = false;
                    this.isClosed = false;
                    this.switchAnimation("OPEN");              
                }
            }
        }
        else{
            if(!this.isClosed){
                this.switchAnimation("CLOSING");
                this.isClosing = true;
                this.endAnimationCallback=()=>{
                    this.isClosing = false;
                    this.isClosed = true;
                    this.switchAnimation("CLOSED");
                }
            }
        }
    }
}