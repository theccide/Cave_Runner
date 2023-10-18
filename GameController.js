class GameController {
    score = 0;
    images = {};
    sounds = {};
    scripts = {};
    entities = [];
    enemies = [];
    bullets = [];
    resouncesReady = false;
    levelMap = {};
    camera = null;
    currentScene = null;
    entitiesToRemove = [];
    entitiesToInstatiate = [];

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
            "Images/spritemaps/fx.png",
            "Images/map1.png",
            "Images/lightsource.png",
            "Images/gems.png"
        ],this.imagesFinished);

        loadSounds(["Sounds/noise.wav"],this.soundsFinished);
        if(localStorage.getItem('objectModel')){
            this.jsonsFinished({"resources/scripts/objects.json":JSON.parse(localStorage.getItem('objectModel'))});
        }
        else
        loadJSONs(["resources/scripts/objects.json"], this.jsonsFinished);
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

    finishedLoadingResources = () => {
        const buildEnemy=(obj)=>{
            if (obj.type === enemyTypes.SKELITON){
                return new Enemy(this,obj.id,{
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
                return new MiniBoss(this, 
                    {x:obj.x, y:obj.y}, // position
                    obj.wp // spawn points
                );                
            }            
        }
                   
        const objLocations = this.scripts["resources/scripts/objects.json"];
        objLocations.gems.forEach(obj=>this.entities.push(new Gem(this, obj.type,{x:obj.x,y:obj.y})));
        objLocations.torches.forEach(obj=>this.entities.push(new Torch(this, ["thin","thick"][obj.type],{x:obj.x,y:obj.y})));
        objLocations.enemies.forEach(obj=>{
            let enemy = buildEnemy(obj);
            this.entities.push(enemy);
            this.enemies.push(enemy);
        });
        // this.entities.push(new MiniBoss(this, {x:400,y:200}));

        this.player = new Player(this);
        this.resouncesReady = true;
    }

    destroy=(entity)=>{
        this.entitiesToRemove.push(entity);
    }

    instatiate=(entityInfo)=>{
        this.entitiesToInstatiate.push(entityInfo);
    }

    _instatiate=(entityInfo)=>{
        if(entityInfo.className==="Gem") this.entities.push(new Gem(this, entityInfo.type, entityInfo.position));
        if(entityInfo.className==="Fx") this.entities.push(new Fx(this, entityInfo.params, entityInfo.position));        
        if(entityInfo.className==="Bullet"){
            let bullet = new Bullet(this, entityInfo.params, entityInfo.position);
            this.entities.push(bullet);
            this.bullets.push(bullet);
        } 
    }

    update = (deltaTime) => {        
        if(!this.resouncesReady) return;

        if(this.entitiesToRemove.length != 0){
            this.entitiesToRemove.forEach(entity=>{
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

        drawImageFrom00(this.currentScene.backBuffer, this.images["Images/map1.png"],
                        0,0,this.currentScene.offBounds.width,this.currentScene.offBounds.height);

        this.levelMap.update(deltaTime);

        this.entities.forEach(entity => {
            entity.update(deltaTime);
        });
        
        this.player.update(deltaTime);
    }
}