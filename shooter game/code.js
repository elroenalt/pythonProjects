const Border = {"x": 500,"y": 500}
const canvas = document.querySelector('#gameScreen')
const ctx = canvas.getContext('2d')
const HitBoxOfSet = 2
let dificulty = 1;
const mouse = {
    "x": 0,
    "y": 0,
}
const enemieColor = [
    "#FF0000", "#DC143C", "#FFA500", "#800000", "#FF2400",
    "#6B8E23", "#A0522D", "#006400", "#708090", "#483C32",
    "#00FFFF", "#8A2BE2", "#7FFF00", "#FFD700", "#FF69B4",
    "#F5F5F5", "#000000", "#4B0082", "#008080", "#964B00"
]
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
    collided() {

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
        this.stats = {
            "projectyleCountdown": 50,
            "projectyleSpeed": 6,
            "projectyleLife": 20,
        }
        this.health = maxHealth;
        this.type = type; 
        this.form = form;
        this.invunerable = 5;
        this.projectyleCountdown = this.stats.projectyleCountdown

    }
    drawAimHelper() {

    }
    shootProjectyles() {
        const dx = mouse.x - this.pos.x
        const dy = mouse.y - this.pos.y
        const radians = Math.atan2(dy, dx)
        const x = this.pos.x + Math.cos(radians) * 40
        const y = this.pos.y + Math.sin(radians) * 40
        ctx.fillStyle = 'rgba(156, 9, 46, 0.5)'
        ctx.beginPath()
        ctx.arc(x, y,15,0,2*Math.PI)
        ctx.fill()
        if(this.projectyleCountdown <= 0) {
            this.projectyleCountdown = this.stats.projectyleCountdown
            const vx = Math.cos(radians) * this.stats.projectyleSpeed
            const vy = Math.sin(radians) * this.stats.projectyleSpeed
            Projectyles.push(new Projectyle(x,y,4,4,vx,vy,0,0,'black'))
        }
    }
    draw() {
        const x = this.pos.x - this.size.width;
        const y = this.pos.y - this.size.height; 
        const width = this.size.width * 2;
        const height = this.size.height * 2;

        ctx.fillStyle = "darkgray";
        ctx.fillRect(x, y, width, height);

        ctx.strokeStyle = 'black';
        ctx.strokeRect(x, y, width, height);
    }
    tickUpdate() {
        if(this.health <= 0) {
            this.active = false
        }
        this.invunerable -= 1;
        this.projectyleCountdown -= 1;
        this.drawAimHelper()
        this.handelKeyInput()
        this.checkAllColl()
        super.tickUpdate()
        this.shootProjectyles()

        drawText(`Health: ${this.health}/${this.maxHealth}`,10,20)
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
class Projectyle extends Entity {
    constructor(x, y, w, h, vx, vy, rotx, roty, color, damage = 2, type ="Projectyle", form = 'circle') {
        super(x, y, w, h, vx, vy, rotx, roty, color, type, form); 
        
        this.damage = damage;
        this.type = type; 
        this.form = form;
        this.bulletLife = 300;
    }
    tickUpdate() {
        this.bulletLife -= 1;
        if(this.bulletLife <= 0) {this.active = false}
        this.checkAllColl()
        super.tickUpdate()
    }
    move() {
        this.v.x *= 1.0001;
        this.v.y *= 1.0001;
        super.move()
    }
    checkAllColl() {
        for(let entity of Entities) {
            if(!entity.active) {continue}
            const collided = this.checkColission(entity)
            if(collided) {
                this.hitEntity(entity)
            }
        }
    }
    hitEntity(Entity2) {
        this.active = false
        Entity2.active = false;
        Entity2.health -= this.damage
        
    }
}
class Enemy extends Entity {
    constructor(x, y, w, h, vx, vy, rotx, roty, color, maxHealth, damage = 2, type ="enemy", form = 'circle') {
        super(x, y, w, h, vx, vy, rotx, roty, color, type, form); 
        this.speed = 2;
        this.damage = damage;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.type = type; 
        this.form = form;
        this.moveCoolUpdateCooldown = 5
    }
    tickUpdate() {
        this.moveCoolUpdateCooldown -= 1;
        super.tickUpdate()
    }
    move() {
        if(this.moveCoolUpdateCooldown <= 0) {
            this.moveCoolUpdateCooldown = 5
            const dx = player.pos.x - this.pos.x
            const dy = player.pos.y - this.pos.y
            const radians = Math.atan2(dy, dx)
            const vx = Math.cos(radians)  * this.speed
            const vy = Math.sin(radians) * this.speed
            console.log(this.pos.x + " : " + this.pos.y )
            this.v.x += vx;
            this.v.y += vy;
        }
        this.v.x *= 0.8;
        this.v.y *= 0.8
        super.move()
    }
}
let Projectyles = [
    
]
let Entities = [
    
]
const player = new Player(200,290,20,20,0,0,0,0,'blue',20)
function gameLoop() {
    if(!player.active) return
    ctx.clearRect(0,0,Border.x,Border.y)
    for(let entity of Entities) {
        if(entity.active) {
            entity.tickUpdate()
        }
    }
    for(let projectyle of Projectyles) {
        projectyle.tickUpdate()
    }
    Entities = Entities.filter(entity => entity.active);
    Projectyles = Projectyles.filter(projectyl => projectyl.active);
    if(Entities.length == 0) {
        for(let i = 0; i < dificulty; i ++) {
            Entities.push(new Enemy(randInt(100,400),randInt(30,50),randInt(10,20),10,0,0,0,0,enemieColor[randInt(0,20)]),)
        }
        dificulty += 1
    }
    player.tickUpdate()
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
function randInt(min,max) {
    return Math.floor(Math.random() * (max - min + 1)) + min; 
}
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
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouse.x = x
    mouse.y = y
})