const Border = {"x": 500,"y": 500}
const canvas = document.querySelector('#gameScreen')
const ctx = canvas.getContext('2d')
const HitBoxOfSet = 2
const keys = {
    "w": false,
    "s": false,
    "a": false,
    "d": false,
}

class Entity {
    constructor(x,y,w,h,vx,vy,rotx,roty,color,damage = 2,type = "entity",form = "circle") {
        this.active = true
        this.v = {"x": vx, "y": vy}
        this.size = {"height": h, "width": w}
        this.hitbox = {"height": h + HitBoxOfSet, "width": w + HitBoxOfSet}
        console.log(this.hitbox)
        this.pos = {"x":x,"y":y}
        this.rot = {"x": rotx,"y": roty}
        this.color = color
        this.type = type; 
        this.form = form;
        this.damage = damage;
    }
    tickUpdate() {
        if(!this.active) return
        this.move();
        this.checkDeath();
        this.draw();
    }
    draw() {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.pos.x,this.pos.y,this.hitbox.width,0,2*Math.PI)
        ctx.fill()
    }
    move() {
        const newPosX = this.pos.x + this.v.x
        const newPosY = this.pos.y + this.v.y
        if(newPosX - this.hitbox.width <= 0 || newPosX + this.hitbox.width >= Border.x) {
            this.v.x *= -1
        }
        if(newPosY - this.hitbox.width <= 0 || newPosY + this.hitbox.width >= Border.y) {
            this.v.y *= -1
        }
        this.pos.x += this.v.x
        this.pos.y += this.v.y
    }
    checkColission(Object2) {
        const dx = Object2.pos.x - this.pos.x
        const dy = Object2.pos.y - this.pos.y
        const d = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
        if(d <= Object2.hitbox.width + this.hitbox.width) {
            return true;
        }
        return false
    }
    checkDeath() {
        if(this.health <= 0) {
            this.active = false
        }
    }
}
class Player extends Entity{
    constructor(x, y, w, h, vx, vy, rotx, roty, color, maxHealth, type ="player", form = 'circle') {
        super(x, y, w, h, vx, vy, rotx, roty, color, type, form); 
        
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.type = type; 
        this.form = form;
        this.invunerable = 5;
    }
    draw() {
        const x = this.pos.x - this.size.width;
        const y = this.pos.y - this.size.height; 
        const width = this.size.width * 2;
        const height = this.size.height * 2;

        ctx.fillStyle = "gray";
        ctx.fillRect(x, y, width, height);

        ctx.strokeStyle = 'green';
        ctx.strokeRect(x, y, width, height);
    }
    tickUpdate() {
        this.invunerable -= 1;
        this.handelKeyInput()
        this.checkAllColl()
        super.tickUpdate()
        drawText(`Healt: ${this.health}/${this.maxHealth}`,10,20)
    }
    checkAllColl() {
        for(let entity of Entities) {
            if(entity.type == "player" || !entity.active) {continue}
            const collided = this.checkColission(entity)
            if(collided) {
                this.hitEntity(entity)
            }
        }
    }
    hitEntity(Entity2) {
        if(this.invunerable <= 0) {
            console.log(this.health)
            this.health -= Entity2.damage
            this.invunerable = 10;
        }
    }
    move() {
        this.v.x *= 0.8;
        this.v.y *= 0.8;
        super.move()
    }
    handelKeyInput() {
        if(keys.w) this.v.y -= 2
        if(keys.s) this.v.y += 2
        if(keys.a) this.v.x -= 2
        if(keys.d) this.v.x += 2
    }
    
}
const Entities = [
    new Entity(200,200,10,10,1.5,-1,0,0,'green'),
    new Entity(200,220,10,10,0,0,0,0,'red'),
    new Player(200,290,20,20,0,0,0,0,'blue',20),
]
function gameLoop() {
    ctx.clearRect(0,0,Border.x,Border.y)
    for(let entity of Entities) {
        if(entity.active) {
            entity.tickUpdate()
        }
    }
    requestAnimationFrame(gameLoop)
}
requestAnimationFrame(gameLoop)

document.addEventListener('keydown', (e) => {
    const key = e.key
    keys[key] = true
})
document.addEventListener('keyup', (e) => {
    const key = e.key
    keys[key] = false
})
function drawText(text, x, y, fontColor = 'white', fontSize = '20px', fontFamily = 'sans-serif') {
    ctx.font = `${fontSize} ${fontFamily}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = fontColor;
    ctx.fillText(text, x, y);
    
    // ctx.strokeStyle = 'black';
    // ctx.lineWidth = 2;
    // ctx.strokeText(text, x, y);
}