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
    constructor(x,y,w,h,vx,vy,rotx,roty,color,stats = {"damage": 20,"health": {"max": 10,"cur":5,"invunerability":10}},type = "entity",form = "circle") {
        this.active = true
        this.dim = {"height": h, "width": w,"hitboxHeight": h + HitBoxOfSet, "hitboxWidth": w + HitBoxOfSet}
        this.v = {"x": vx, "y": vy}
        this.loc = {"posX":x,"posY":y,"rotX": rotx,"rotY": roty}
        this.color = color
        this.type = type; 
        this.form = form;
        this.stats = stats;
    }
    tickUpdate() {
        if(!this.active) return
        this.move();
        this.checkDeath()
        this.draw();
    }
    collided() {
    }
    draw() {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.loc.posX,this.loc.posY,this.dim.width,0,2*Math.PI)
        ctx.fill()
    }
    move() {
        const newPosX = this.loc.posX + this.v.x
        const newPosY = this.loc.posY + this.v.y
        if(newPosX - this.dim.hitboxWidth <= 0 || newPosX + this.dim.hitboxWidth >= Border.x) {
            this.v.x *= -1
        }
        if(newPosY - this.dim.hitboxWidth <= 0 || newPosY + this.dim.hitboxWidth >= Border.y) {
            this.v.y *= -1
        }
        this.loc.posX += this.v.x
        this.loc.posY += this.v.y
    }
    checkColission(Object2) {
        const dx = Object2.loc.posX - this.loc.posX
        const dy = Object2.loc.posY - this.loc.posY
        const d = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
        if(d <= Object2.dim.hitboxWidth + this.dim.hitboxWidth) {
            this.collided()
            return true;
        }
        return false
    }
    checkDeath() {
        if(this.type != "Projectyle" && this.stats.health.cur <= 0) {
            this.active = false
        }
    }
}
class Player extends Entity{
    constructor(x, y, w, h, vx, vy, rotx, roty, color,stats = {"speed":2,"damage": 20,"health":{"max": 20,"cur":20,"invunerability":10},"projectyle": {"cooldown":50,"speed":6,"life": 20,"damage":2},}, type ="player", form = 'circle') {
        super(x, y, w, h, vx, vy, rotx, roty, color, type, form); 
        this.stats = stats
        this.type = type; 
        this.form = form;
        this.invunerable = stats.health.invunerability;
        this.projectylCooldown = this.stats.projectyle.cooldown

    }
    drawAimHelper() {

    }
    shootProjectyles() {
        const dx = mouse.x - this.loc.posX
        const dy = mouse.y - this.loc.posY
        const radians = Math.atan2(dy, dx)
        const x = this.loc.posX + Math.cos(radians) * 40
        const y = this.loc.posY + Math.sin(radians) * 40
        ctx.fillStyle = 'rgba(156, 9, 46, 0.5)'
        ctx.beginPath()
        ctx.arc(x, y,15,0,2*Math.PI)
        ctx.fill()
        if(this.projectylCooldown <= 0) {
            this.projectylCooldown = this.stats.projectyle.cooldown
            const vx = Math.cos(radians) * this.stats.projectyle.speed
            const vy = Math.sin(radians) * this.stats.projectyle.speed
            Projectyles.push(new Projectyle(x,y,6,6,vx,vy,0,0,'black',{"damage": 2,"life": 300,"penetrate": 1}))
        }
    }
    draw() {
        const x = this.loc.posX - this.dim.width;
        const y = this.loc.posY - this.dim.height; 
        const width = this.dim.width * 2;
        const height = this.dim.height * 2;

        ctx.fillStyle = "darkgray";
        ctx.fillRect(x, y, width, height);

        ctx.strokeStyle = 'black';
        ctx.strokeRect(x, y, width, height);
    }
    tickUpdate() {
        if(this.stats.health.cur <= 0) {
            this.stats.health.cur = 0
            this.active = false
        }
        this.invunerable -= 1;
        this.projectylCooldown -= 1;
        this.drawAimHelper()
        this.handelKeyInput()
        this.checkAllColl()
        super.tickUpdate()
        this.shootProjectyles()
        drawText(`Health: ${this.stats.health.cur}/${this.stats.health.max}`,10,20)
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
            this.stats.health.cur -= Entity2.stats.damage
            this.invunerable = this.stats.health.invunerability;
        }
    }
    move() {
        this.v.x *= 0.8;
        this.v.y *= 0.8;
        super.move()
    }
    handelKeyInput() {
        if(keys.w) this.v.y -= this.stats.speed
        if(keys.s) this.v.y += this.stats.speed
        if(keys.a) this.v.x -= this.stats.speed
        if(keys.d) this.v.x += this.stats.speed
    }
    
}
class Projectyle extends Entity {
    constructor(x = 0, y = 0, w = 10, h = 10, vx = 0, vy = 0, rotx = 0, roty = 0, color = 'black', stats = {"damage": 20,"life": 300,"penetrate": 1}, type ="Projectyle", form = 'circle') {
        super(x, y, w, h, vx, vy, rotx, roty, color, type, form); 
        this.type = type; 
        this.form = form;
        this.stats = stats
    }
    tickUpdate() {
        this.stats.life -= 1;
        if(this.stats.life <= 0 || this.stats.penetrate <= 0) {this.active = false}
        super.tickUpdate()
        this.checkAllColl()
    }
    move() {
        this.v.x *= 1.001;
        this.v.y *= 1.001;
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
        this.stats.penetrate -= 1;
        if(this.stats.penetrate <= 0) {
            this.active = false
        }
        Entity2.stats.health.cur -= this.stats.damage;
    }
}
class Enemy extends Entity {
    constructor(x, y, w, h, vx, vy, rotx, roty, color,stats = {"speed":2,"moveCheckCooldown": 20,"damage": 2,"health":{"max": 10,"cur":5,"invunerability":10}} , type ="enemy", form = 'circle') {
        super(x, y, w, h, vx, vy, rotx, roty, color, type, form); 
        this.speed = 2;
        this.type = type; 
        this.form = form;
        this.stats = stats
        this.moveCoolown = this.stats.moveCheckCooldown
    }
    tickUpdate() {
        this.moveCoolown-= 1;
        super.tickUpdate()
        drawText(`Enemy: ${this.stats.health.cur}/${this.stats.health.max}`,this.loc.posX- this.dim.hitboxWidth * 2,this.loc.posY - this.dim.hitboxHeight * 2)
    }
    move() {
        if(this.moveCoolown <= 0) {
            this.moveCoolown= this.stats.moveCheckCooldown
            const dx = player.loc.posX - this.loc.posX
            const dy = player.loc.posY - this.loc.posY
            const radians = Math.atan2(dy, dx)
            const vx = Math.cos(radians)  * this.stats.speed
            const vy = Math.sin(radians) * this.stats.speed
            this.v.x = vx;
            this.v.y = vy;
        }
        super.move()
    }
}
class WaveManager {
    constructor(baseV = {"maxHealth": 4, "speed": 2,"damage":2,"enemyCount":1}) {
        this.baseV = baseV
        this.Wave = 0
    }
    spawnNewWave() {
        const health = this.baseV.maxHealth + (5 * this.Wave) + (1.5 * Math.pow(this.Wave, 2));
        const speed = this.baseV.speed + (0.1 * this.Wave) + (0.01 * Math.pow(this.Wave, 2));
        const damage = Math.floor((this.baseV.damage + (1 * this.Wave) + (0.3 * Math.pow(this.Wave, 2))));
        const EnemyCount = Math.ceil(this.baseV.enemyCount + (this.Wave / 5) + (Math.pow(this.Wave, 2) / 200));
        console.log(EnemyCount)
        for(let i = 0; i < EnemyCount; i++) {
            const x = 200;
            const y = 200;
            const size = 20;
            const color = enemieColor[randInt(0,20)]
            const stats = {
                "speed":speed,
                "moveCheckCooldown": 10,
                "damage": damage,
                "health":{"max": health,"cur":health,"invunerability":10}
            }
            Entities.push(
                new Enemy(x,y,size,size,0,0,0,0,color,stats)
            )
        }
        this.Wave += 1
    }
}
let Projectyles = [
    
]
let Entities = [
    
]
let gameRunning = true
const waveManager = new WaveManager()
const player = new Player(200,290,20,20,0,0,0,0,'blue')
function gameLoop() {
    if(gameRunning) {
        if(!player.active) return
        EntityUpdate()
    }else {
    }
    requestAnimationFrame(gameLoop)
}
function gamePaused() {
    ctx.fillStyle = "rgba(255, 0, 179, 0.005)"
    ctx.fillRect(0,0,Border.x,Border.y)

    drawText("Game Paused",Border.x/2,Border.y/2-40, fontColor = 'black', fontSize = '50px', fontFamily = 'sans-serif',textAlign = 'center',textBaseline = 'middle')
    drawText("click ESC to unPause",Border.x/2,Border.y/2+50, fontColor = 'black', fontSize = '40px', fontFamily = 'sans-serif',textAlign = 'center',textBaseline = 'middle')
}
function EntityUpdate() {
    ctx.clearRect(0,0,Border.x,Border.y)
    for(let entity of Entities) {
        entity.tickUpdate()
    }
    for(let projectyle of Projectyles) {
        projectyle.tickUpdate()
    }
    Entities = Entities.filter(entity => entity.active);
    Projectyles = Projectyles.filter(projectyl => projectyl.active);
    if(Entities.length == 0) {
        waveManager.spawnNewWave()
    }
    player.tickUpdate()
}
requestAnimationFrame(gameLoop)
document.addEventListener('keydown', (e) => {
    const key = e.key 
    if(e.key === 'Escape') {
        gameRunning = !gameRunning
        gamePaused()
        return
    }
    keys[key] = true
})
document.addEventListener('keyup', (e) => {
    const key = e.key
    keys[key] = false
})
function randInt(min,max) {
    return Math.floor(Math.random() * (max - min + 1)) + min; 
}
function drawText(text, x, y, fontColor = 'white', fontSize = '20px', fontFamily = 'sans-serif',textAlign = 'left',textBaseline = 'middle') {
    ctx.font = `${fontSize} ${fontFamily}`;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.fillStyle = fontColor;
    ctx.fillText(text, x, y);
}
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouse.x = x
    mouse.y = y
})