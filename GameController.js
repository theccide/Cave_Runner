class GameController {
    score = 0;
    images = {};
    sounds = {};
    scripts = {};
    entities = [];
    entityMap = {};
    enemies = [];
    spikeTraps = [];
    bullets = [];
    resouncesReady = false;
    levelMap = {};
    camera = null;
    currentScene = null;
    entitiesToRemove = [];
    entitiesToInstatiate = [];
    triggers = [];
    triggerEntityMap = {};
    hiddenObjectDef = {};
    sequencer=null;
    useDarkOverlay = true;
    darkOverlayLevel = 0.99;

    getMouseInput=(event)=>{if(this.player) this.player.getMouseInput(event);}    
    getMouseMoveInput=(event)=>{if(this.player) this.player.getMouseMoveInput(event);}
    getKeyboardInput=(event)=>{if(this.player) this.player.getKeyboardInput(event);}

    start = (scene) => {
        this.currentScene = scene;
        this.camera = scene.camera;
        this.levelMap = new LevelMap(this);
        loadImages([
            "Images/spritemaps/skeleton.png",
            "Images/spritemaps/complete_hero.png",
            "Images/spritemaps/complete_hero_hit.png",
            "Images/spritemaps/torch.png",
            "Images/spritemaps/torch2.png",
            "Images/spritemaps/miniboss.png",
            "Images/spritemaps/boss.png",
            "Images/spritemaps/fx.png",
            "Images/map1.png",
            "Images/lightsource.png",
            "Images/gems.png",
            "Images/hud.png",
            "Images/lava1.png",
            "Images/lava2.png",
            "Images/heatlhback.png",
            "Images/heatlhgreen.png",
            "Images/heatlhred.png",
        ],this.imagesFinished);

        loadSounds(["Sounds/noise.wav"],this.soundsFinished);
        if(localStorage.getItem('objectModel')){
            this.jsonsFinished({
                "resources/scripts/objects.json":JSON.parse(localStorage.getItem('objectModel')),
                "resources/scripts/triggers.json":JSON.parse(localStorage.getItem('triggers'))
            });
        }
        else
        loadJSONs(["resources/scripts/objects.json","resources/scripts/triggers.json"], this.jsonsFinished);
    }

    imagesFinished=(loadedImages)=>{
        this.images = loadedImages;
        this.resourceFinished();
    }

    soundsFinished=(loadedSounds)=>{
        this.sounds = loadedSounds;
        this.resourceFinished();
    }

    jsonsFinished=(loadedJSONs)=>{
        this.scripts = loadedJSONs;
        this.resourceFinished();
    }

    resourceCounter = 0;
    resourceFinished = () => {
        this.resourceCounter ++;
        if(this.resourceCounter >= 3) this.finishedLoadingResources();
    }

    addEntity(self, entity){
        let newID = (entity?.id)?entity.id:generateRandomId(8);
        if(newID in self.entityMap) newID=generateRandomId(8);
        entity.id = newID; 
        self.entityMap[newID]=entity;
        self.entities.push(entity);
        return entity;
    }

    finishedLoadingResources = () => {
        const buildEnemy=(obj, id)=>{
            if (obj.type === enemyTypes.SKELITON){
                return new Enemy(this, id,{
                    sprite:null, 
                    fileName: "Images/spritemaps/skeleton.png",            
                    cellSize: { width: 32, height: 32 },
                    spriteSize: { width: 32, height: 32 },
                    grid: { rows: 16, columns: 8 },
                    startAnimation: "IDLE_DOWN",
                    animations:{
                        "IDLE_DOWN":    [[0,0],[1,0],[2,0],[3,0]], // 0
                        "IDLE_RIGHT":   [[0,1],[1,1],[2,1],[3,1]], // 1
                        "IDLE_UP":      [[0,2],[1,2],[2,2],[3,2]], // 2
                        "IDLE_LEFT":    [[0,6],[1,6],[2,6],[3,6]], // 6
                        "WALK_DOWN":    [[0,3],[1,3],[2,3],[3,3]], // 3
                        "WALK_RIGHT":   [[0,4],[1,4],[2,4],[3,4]], // 4
                        "WALK_UP":      [[0,5],[1,5],[2,5],[3,5]], // 5
                        "WALK_LEFT":    [[0,7],[1,7],[2,7],[3,7]], // 7
                        "HIT":          [[0,8],[1,8]], // 8
                    }
                }, 
                    {x:obj.x, y:obj.y}, // position
                    obj.wp.map(wp=>{wp.x = Math.round(wp.x/32); wp.y = Math.round(wp.y/32); return wp}) // patrol points
                );                
            }
            if (obj.type === enemyTypes.WIZARD){
                return new MiniBoss(this, "miniboss",
                    {x:obj.x, y:obj.y}, // position
                    obj.wp // spawn points
                );                
            }            
        }

        const removeHiddenObjects=(objs,entityType)=> {        
            return objs.filter(obj => {                
                if (obj?.hidden) {
                    obj["entityType"]=entityType;
                    obj["type"]=obj.type;
                    this.hiddenObjectDef[obj.id] = obj;
                    return false;
                }
                return true;
            });        
        }

        this.triggers = this.scripts["resources/scripts/triggers.json"];
        this.triggers.forEach(trigger=>{
            if(trigger.entity)
                this.triggerEntityMap[trigger.id]=trigger;
        });
        
        const objLocations = this.scripts["resources/scripts/objects.json"];
        removeHiddenObjects(objLocations.gems, "Gem").forEach(obj=>this.entities.push(new Gem(this, obj.id, obj.type,{x:obj.x,y:obj.y})));
        removeHiddenObjects(objLocations.torches, "Torch").forEach(obj=>this.entities.push(new Torch(this, obj.id, ["thin","thick"][obj.type],{x:obj.x,y:obj.y})));
        removeHiddenObjects(objLocations.enemies, "Enemy").forEach(obj=>{
            let enemy = buildEnemy(obj, obj.id);
            this.entities.push(enemy);
            this.enemies.push(enemy);
        });        
        
        this.entities.forEach(entity=>{
            let newID = entity.id;
            if(!newID) newID = generateRandomId(8);
            if(newID in this.entityMap) newID = generateRandomId(8);
            entity.id = newID;
            this.entityMap[newID]=entity;
        });
        // this.entities.push(new Boss(this, {x:400,y:800}));

        this.player = new Player(this);
        this.addTriggerEntities();

        this.sequencer = new Sequencer(this);        
        this.resouncesReady = true;
    }

    addTriggerEntities(){
        const createSpikes=(x,y)=>{
            const trap = new SpikeTrap(this, generateRandomId(8), {x, y});
            this.spikeTraps.push(trap);
            this.addEntity(this, trap);
        }

        for(let i_row=0; i_row<this.levelMap.grid.numRows; i_row++){
            for(let i_col=0; i_col<this.levelMap.grid.numCols; i_col++){
                const col = this.levelMap.grid.matrix[i_row][i_col];
                if(col in this.triggerEntityMap){
                    if(this.triggerEntityMap[col].entity=="spikes") createSpikes((i_col*32)+16,(i_row*32)+16);
                }
            }
        }
    }

    runTrigger(trigger){ eval(trigger.code); }

    runSpikes(self){ if(self.spikeTraps[0].isUP) this.player.hit(0,0); }
    
    triggerPlaySequence(self, sequenceName, removeTrigger){
        if(removeTrigger){
            self.levelMap.switchCellValue({x:self.player.position.x, y:self.player.position.y},0);
        }
        this.playSequence(self, sequenceName);
    }

    playSequence(self, sequenceName){
        console.log("playing sequence: "+sequenceName);
        self.sequencer.startSequence(sequenceName);
    }

    triggerSpawn(self, id, removeTrigger){
        if(removeTrigger){
            self.levelMap.switchCellValue({x:self.player.position.x, y:self.player.position.y},0);
        }
        this.spawnFromOjectDefID(self, id);
    }

    spawnFromOjectDefID(self, id){
        let objdef = self.hiddenObjectDef[id];
        this.spawn(objdef)
    }

    spawn(self, objDef, id){

        if(objDef.entityType == "Gem"){ 
            let gem = (objDef.pos) ? new Gem(self, id, obj.type,{x:objDef.pos.x,y:objDef.pos.y}) : new Gem(self, id,obj.type,{x:objDef.x,y:objDef.y});
            return self.addEntity(self, gem);
        };
        if(objDef.entityType == "Torch") {
            let torch = (objDef.pos) ? new Torch(self, id, objDef.type,{x:objDef.pos.x,y:objDef.pos.y}) : new Torch(self, id,["thin","thick"][objDef.type],{x:objDef.x,y:objDef.y});
            return self.addEntity(self, torch);
        }
        if(objDef.entityType == "Fx") {
            let fx = (objDef.pos) ? new Fx(self, id, {fxType:objDef.fxType, destroyOnFinishAnim:objDef.destroyOnFinishAnim},{x:objDef.pos.x,y:objDef.pos.y}) : new Fx(self,id,{fxType:objDef.type, destroyOnFinishAnim:objDef.destroyOnFinishAnim},{x:objDef.x,y:objDef.y});
            return self.addEntity(self, fx);
        }        
        if(objDef.entityType == "Boss") {
            let boss = (objDef.pos) ? new Boss(self, id, {x:objDef.pos.x,y:objDef.pos.y}) : new Boss(self, {x:objDef.x,y:objDef.y});
            boss.id = id;
            return self.addEntity(self, boss);
        }
        if(objDef.entityType == "Enemy") {
            let enemy = buildEnemy(objDef, id);
            self.enemies.push(enemy);
            return self.addEntity(self, enemy);
        }
    }

    destroy=(entity)=>{        
        this.entitiesToRemove.push(entity);
    }

    instatiate=(entityInfo)=>{
        this.entitiesToInstatiate.push(entityInfo);
    }

    _instatiate=(entityInfo)=>{
        let newEntity = null;
        if(entityInfo.className==="Gem") newEntity = new Gem(this, generateRandomId(8), entityInfo.type, entityInfo.position);
        if(entityInfo.className==="Fx") newEntity = new Fx(this, generateRandomId(8), entityInfo.params, entityInfo.position);
        if(entityInfo.className==="Bullet"){
            newEntity = new Bullet(this, generateRandomId(8), entityInfo.params, entityInfo.position);
            this.bullets.push(newEntity);
        } 
        if(newEntity) this.addEntity(this, newEntity);        
    }

    startTime = Date.now();
    getFadeValue() {
        const duration = 5000;  // Duration for a complete cycle (fade in and fade out) in milliseconds
        const elapsed = (Date.now() - this.startTime) % duration;
        const progress = elapsed / duration;
        
        // Use a sine wave to calculate the fade value
        const fadeValue = (Math.sin(progress * 2 * Math.PI) + 1) / 2;
        
        return fadeValue;
    }

    update = (deltaTime) => {        
        if(!this.resouncesReady) return;

        this.sequencer.update(deltaTime);

        if(this.entitiesToRemove.length != 0){
            this.entitiesToRemove.forEach(entity=>{
                delete this.entityMap[entity.id];
                if(entity instanceof Enemy) this.enemies = this.enemies.filter(obj => !this.entitiesToRemove.includes(obj));
                if(entity instanceof Bullet) this.bullets = this.bullets.filter(obj => !this.entitiesToRemove.includes(obj));
            });          
            this.entities = this.entities.filter(obj => !this.entitiesToRemove.includes(obj));
            this.entitiesToRemove = [];
        }

        if(this.entitiesToInstatiate.length != 0){
            this.entitiesToInstatiate.forEach(e=>this._instatiate(e));
            this.entitiesToInstatiate = [];
        }

        drawImageFrom00(this.currentScene.backBuffer, this.images["Images/lava2.png"],
                        1385,23,this.images["Images/lava1.png"].width,this.images["Images/lava2.png"].height);
        this.currentScene.backBuffer.globalAlpha = this.getFadeValue();
        drawImageFrom00(this.currentScene.backBuffer, this.images["Images/lava1.png"],
                        1385,23,this.images["Images/lava1.png"].width,this.images["Images/lava1.png"].height);
        this.currentScene.backBuffer.globalAlpha = 1;
        drawImageFrom00(this.currentScene.backBuffer, this.images["Images/map1.png"],
                        0,0,this.currentScene.offBounds.width,this.currentScene.offBounds.height);

        this.levelMap.update(deltaTime);

        this.entities.forEach(entity => {
            entity.update(deltaTime);
        });
        
        this.player.update(deltaTime);
    }
}