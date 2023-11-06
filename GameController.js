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
    interactableObjects = [];
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
    gameTime = 0;

    getMouseInput=(event)=>{if(this.player) this.player.getMouseInput(event);}    
    getMouseMoveInput=(event)=>{if(this.player) this.player.getMouseMoveInput(event);}
    getKeyboardInput=(event)=>{
        if(this?.currentScene?.dialogManager) this.currentScene.dialogManager.getKeyboardInput(event);
        if(this.player) this.player.getKeyboardInput(event);
    }

    start = (scene) => {
        if(this.resouncesReady) return;
        this.currentScene = scene;
        this.currentScene.dialogManager = new Dialog(this);
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
            "Images/spritemaps/hor_door.png",
            "Images/spritemaps/ver_door.png",
            "Images/spritemaps/bubble.png",
            "Images/spritemaps/key.png",
            "Images/spritemaps/saw.png",
            "Images/spritemaps/flamethrower1.png",
            "Images/spritemaps/flamethrower2.png",
            "Images/spritemaps/pots.png",
            "Images/spritemaps/skull.png",
            "Images/spritemaps/golem.png",
            "Images/spritemaps/obelisk.png",
            "Images/spritemaps/smokeFx.png",
            "Images/spritemaps/smokeFx02.png",
            "Images/spritemaps/smokeFx03.png",
            "Images/map1.png",
            "Images/lightsource.png",
            "Images/gems.png",
            "Images/hud.png",
            "Images/arrow.png",
            "Images/lava1.png",
            "Images/lava2.png",
            "Images/heatlhback.png",
            "Images/heatlhgreen.png",
            "Images/heatlhred.png",
            "Images/dialog.png",
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

    addEntity(self, entity, isInteractable){
        let newID = (entity?.id)?entity.id:generateRandomId(8);
        if(newID in self.entityMap) newID=generateRandomId(8);
        entity.id = newID; 
        self.entityMap[newID]=entity;
        self.entities.push(entity);
        if(isInteractable) self.interactableObjects.push(entity); 
        if(entity instanceof Bullet) self.bullets.push(entity);
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
        removeHiddenObjects(objLocations.gems, "Gem").forEach(obj=>this.entities.push(new Gem(this, obj.id, {gemType:obj.type},{x:obj.x,y:obj.y})));
        removeHiddenObjects(objLocations.torches, "Torch").forEach(obj=>this.entities.push(new Torch(this, obj.id, {type:["thin","thick"][obj.type], isInteractable:false},{x:obj.x,y:obj.y})));
        removeHiddenObjects(objLocations.enemies, "Enemy").forEach(obj=>{
            let enemy = buildEnemy(obj, obj.id);
            this.entities.push(enemy);
            this.enemies.push(enemy);
        });        
        
        this.doors = [
            new Door(this, "midbossOutdoor", {type:"hor"}, {x:287, y:696}), 
            new Door(this, "midbossINdoor", {type:"hor"}, {x:543, y:696}, this.enemies),
            new Door(this, "door3", {type:"hor"}, {x:833, y:696}, this.enemies),
            new Door(this, "spikesdoor", {type:"hor"}, {x:1312, y:470}), 
            new Door(this, "To lavadoortop", {type:"hor"}, {x:1345, y:245}), 
            new Door(this, "lavadoorbot", {type:"hor"}, {x:1505, y:696}), 
            new Door(this, "dragondoor", {type:"hor"}, {x:2016, y:696}), 
            new Door(this, "lavadoortop", {type:"hor"}, {x:1505, y:245}), 
            new Door(this, "lavadoorright", {type:"ver"}, {x:1936, y:95}),
            new Door(this, "rubydoor", {type:"ver"}, {x:976, y:95}),
            new Door(this, "door6", {type:"ver"}, {x:912, y:543}, this.enemies),
            new Door(this, "door7", {type:"ver"}, {x:912, y:863}, this.enemies),
            new Door(this, "door8", {type:"ver"}, {x:1168, y:1280}, this.enemies),
            new Door(this, "door9", {type:"ver"}, {x:1424, y:768}, this.enemies)
        ];
        this.entities = this.entities.concat(this.doors);

        //this.entities.push(new Fx(this, "key", {fxType:"0", destroyOnFinishAnim: false, spriteMap:"KEY"}, {x:220,y:420}));
        this.entities.push(new Saw(this, "SAW", {x:800,y:400}));

        this.entities.push(new Golem(this, "Golem", {x:2600,y:1200}));
        this.entities.push(new Obelisk(this, "Obelisk", {x:2400,y:1000}));

        this.entities.push(new Pot(this, "Pot", {type:"ONE"}, {x:800,y:500}));
        this.entities.push(new Pot(this, "Pot", {type:"TWO"}, {x:750,y:500}));
        this.entities.push(new Pot(this, "Pot", {type:"THREE"}, {x:700,y:500}));
        this.entities.push(new Pot(this, "Pot", {type:"THREE",dropSequence:"rescueSpirit"}, {x:850,y:500}));

        // this.entities.push(new Fx(this, "smoke", {fxType:"SEVEN", destroyOnFinishAnim: false, spriteMap:"SMOKEFX02"}, {x:800,y:420}));

        this.interactableObjects = this.entities.filter(entity=>entity.playerInteractable);
        this.entities = this.entities.concat(this.interactableObjects);
        this.entities.push(new FlameThrower(this, "FlameThrower", 0, {x:720,y:143}));

        this.entities.forEach(entity=>{
            let newID = entity.id;
            if(!newID) newID = generateRandomId(8);
            if(newID in this.entityMap) newID = generateRandomId(8);
            entity.id = newID;
            this.entityMap[newID]=entity;
        });
        // this.entities.push(new Boss(this, {x:400,y:800}));

        
        this.player = new Player(this);
        this.entityMap["miniboss"].addChild(new Key(this,"key", {shouldRotate:true}, {x:35, y:35}));
        this.addTriggerEntities();

        this.sequencer = new Sequencer(this);
        this.lavaManager = new LavaManager(this);
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
    
    arrowReloadTime = 500;
    lastArrowTime = 0;
    shootArrow(self){
        if(this.lastArrowTime == 0){
            this.spawn(self, {entityType:"Arrow", params:{}, pos:{x:self.player.position.x, y:self.player.position.y-400}}, "arrow");
            this.lastArrowTime = gameTime;
        }
        if(gameTime > this.lastArrowTime+this.arrowReloadTime){
            this.lastArrowTime = 0;
        }

    }
    
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

    // triggerSpawn(self, id, removeTrigger){
    //     if(removeTrigger){
    //         self.levelMap.switchCellValue({x:self.player.position.x, y:self.player.position.y},0);
    //     }
    //     this.spawnFromOjectDefID(self, id);
    // }

    // spawnFromOjectDefID(self, id){
    //     let objdef = self.hiddenObjectDef[id];
    //     this.spawn(objdef)
    // }

    spawn(self, objDef, id){

        if(objDef.entityType == "Enemy") {
            let enemy = buildEnemy(objDef, id);
            self.enemies.push(enemy);
            return self.addEntity(self, enemy, false);
        }

        const createInstance=(className, context, id, params, pos)=>{
            const classes = { Bullet, Gem, Fx, Torch, Boss, Arrow, FallingRock, Skull, Key };
            return new classes[className](context, id, params, pos);
        }
        
        let entity = createInstance(objDef.entityType, this, (objDef.id)?objDef.id:id, {...objDef.params}, {...objDef.pos});
        if("fields" in objDef) entity.updateFields(objDef.fields);
        this.addEntity(self, entity, entity.playerInteractable);
        return entity;
    }

    destroy=(entity)=>{        
        this.entitiesToRemove.push(entity);
    }

    instatiate=(entityInfo)=>{
        this.entitiesToInstatiate.push(entityInfo);
    }

    _instatiate=(entityInfo)=>{
        this.spawn(this, entityInfo, generateRandomId(8));
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

    update = ({dt, currentTime, gameTime}) => {

        if(!this.resouncesReady) return;

        this.sequencer.update({dt, currentTime, gameTime});

        if(this.entitiesToRemove.length != 0){
            this.entitiesToRemove.forEach(entity=>{
                delete this.entityMap[entity.id];
                if(entity instanceof Enemy) this.enemies = this.enemies.filter(obj => !this.entitiesToRemove.includes(obj));
                if(entity instanceof Bullet) this.bullets = this.bullets.filter(obj => !this.entitiesToRemove.includes(obj));
                if(entity.playerInteractable) this.interactableObjects = this.interactableObjects.filter(obj => !this.entitiesToRemove.includes(obj));
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

        this.levelMap.update({dt, currentTime, gameTime});

        this.entities.forEach(entity => {
            entity.update({dt, currentTime, gameTime});
        });

        this.lavaManager.update({dt, currentTime, gameTime});
        
        this.player.update({dt, currentTime, gameTime});
    }
}