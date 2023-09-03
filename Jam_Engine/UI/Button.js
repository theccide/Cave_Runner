class Button {
    bounds = {};
    onClick = null;
    color = "black";
    id = -1;
    self=null;
    text="";
    fontSize = 21;
    fontY =0;

    getMouseInput(event){
        if(Collision.testPointOnBox(event.position, this.bounds)){
            this.onClick(this.self, this.id);
        }
    } 

    constructor(self, id, bounds, color, text, onClick){
        this.onClick = onClick;
        this.bounds = bounds;
        this.color = color;
        this.id = id;
        this.self = self;
        this.text = text;

        this.fontY = this.bounds.y+((this.bounds.height/2)-this.fontSize/1.5)+this.fontSize;
    }

    update(){
        drawBox(this.bounds.x,this.bounds.y,this.bounds.width,this.bounds.height, this.color);
        drawBox(this.bounds.x,this.bounds.y,this.bounds.width,this.bounds.height, "black",{outline:true, thickness:3});
        drawText(this.bounds.x,this.fontY, this.text, this.fontSize, "white");
    }
}