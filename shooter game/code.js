const canvas = document.querySelector('#gameScreen')
const ctx = canvas.getContext('2d')
const GAME_CONFIG = {
    BORDER: { x: canvas.width, y: canvas.height },
    HITBOX_OFFSET: 2,
    ENEMY_COLORS: [
        "#FF0000", "#DC143C", "#FFA500", "#800000", "#FF2400",
        "#6B8E23", "#A0522D", "#006400", "#708090", "#483C32",
        "#00FFFF", "#8A2BE2", "#7FFF00", "#FFD700", "#FF69B4",
        "#F5F5F5", "#000000", "#4B0082", "#008080", "#964B00"
    ],
    PLAYER_BASE: {
        SPEED: 2,
        HEALTH: { MAX: 20, INVULNERABILITY: 10 },
        PROJECTILE: { COOLDOWN: 50, SPEED: 6, LIFE: 300, DAMAGE: 2 }
    },
    ENEMY_BASE: {
        SPEED: 2,
        DAMAGE: 2,
        HEALTH: { MAX: 10, INVULNERABILITY: 10 },
        MOVE_CHECK_COOLDOWN: 20
    }
};
const mouse = {
    "x": 0,
    "y": 0,
}
const keys = {
    "w": false,
    "s": false,
    "a": false,
    "d": false,
}

class Entity {
    constructor(config = {"dim": {"height": 10, "width": 10},"pos":{"x": 0,"y":0,"rotX":0,"rotY":0},"v": {"x": 0,"y":0},"color": 'red',"stats": {"speed":2,"damage": 20,"health":{"max": 20,"cur":20,"invunerability":10},"projectyle": {"cooldown":50,"speed":6,"life": 20,"damage":2},},},managerInstance) {
        this.active = true
        this.manager = managerInstance
        this.dim = {"height": config.dim.height, "width": config.dim.width,"hitboxHeight": config.dim.height + GAME_CONFIG.HITBOX_OFFSET, "hitboxWidth": config.dim.width + GAME_CONFIG.HITBOX_OFFSET}
        this.v = config.v
        this.pos = config.pos
        this.color = config.color
        this.stats = config.stats;
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
        ctx.arc(this.pos.x,this.pos.y,this.dim.width,0,2*Math.PI)
        ctx.fill()
    }
    move() {
        const newPosX = this.pos.x + this.v.x
        const newPosY = this.pos.y + this.v.y
        if(newPosX - this.dim.hitboxWidth <= 0 || newPosX + this.dim.hitboxWidth >= GAME_CONFIG.BORDER.x) {
            this.v.x *= -1
        }
        if(newPosY - this.dim.hitboxWidth <= 0 || newPosY + this.dim.hitboxWidth >= GAME_CONFIG.BORDER.y) {
            this.v.y *= -1
        }
        this.pos.x += this.v.x
        this.pos.y += this.v.y
    }
    checkColission(Object2) {
        const dx = Object2.pos.x - this.pos.x
        const dy = Object2.pos.y - this.pos.y
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
    constructor(config = {"dim": {"height": 10, "width": 10},"pos":{"x": 0,"y":0,"rotX":0,"rotY":0},"v": {"x": 0,"y":0},"color": 'red',"stats": {"speed":2,"damage": 20,"health":{"max": 20,"cur":20,"invunerability":10},"projectyle": {"cooldown":50,"speed":6,"life": 20,"damage":2},},},managerInstance) {
        super(config, managerInstance);
        this.invunerable = this.stats.health.invunerability;
        this.projectylCooldown = this.stats.projectyle.cooldown

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
        if(this.projectylCooldown <= 0) {
            this.projectylCooldown = this.stats.projectyle.cooldown
            const vx = Math.cos(radians) * this.stats.projectyle.speed
            const vy = Math.sin(radians) * this.stats.projectyle.speed
            this.manager.Projectyles.push(new Projectyle({
                "dim": {
                    "height": 6, 
                    "width": 6},
                "pos":{
                    "x": x,
                    "y":y,
                    "rotX":0,
                    "rotY":0},
                "v": {
                    "x": vx,
                    "y":vy,},
                "color": 'black',
                "stats": {
                    "life":this.stats.projectyle.life,
                    "penetrate":this.stats.projectyle.penetrate,
                    "damage":this.stats.projectyle.damage},}
                ,this.manager))
        }
    }
    draw() {
        const x = this.pos.x - this.dim.width;
        const y = this.pos.y - this.dim.height; 
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
        this.handelKeyInput()
        this.checkAllColl()
        super.tickUpdate()
        this.shootProjectyles()
        drawText(`Health: ${this.stats.health.cur}/${this.stats.health.max}`,10,20)
    }
    checkAllColl() {
        for(let entity of this.manager.Entities) {
            if(entity === this || !entity.active) {continue} 
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
    constructor(config = {"dim": {"height": 10, "width": 10},"pos":{"x": 0,"y":0,"rotX":0,"rotY":0},"v": {"x": 0,"y":0},"color": 'red',"stats": {"life":300,"penetrate":1,"damage":2},},managerInstance) {
        super(config, managerInstance);
        this.type = "Projectyle"; 
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
        for(let entity of this.manager.Entities) {
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
    constructor(config = {"dim": {"height": 10, "width": 10},"pos":{"x": 0,"y":0,"rotX":0,"rotY":0},"v": {"x": 0,"y":0},"color": 'red',"stats": {"moveCheckCooldown": 10,"speed":2,"damage": 20,"health":{"max": 20,"cur":20,"invunerability":10},},},managerInstance) {
        super(config, managerInstance);
        this.moveCooldown = this.stats.moveCheckCooldown
    }
    tickUpdate() {
        this.moveCooldown-= 1;
        super.tickUpdate()
        drawText(`Enemy: ${this.stats.health.cur}/${this.stats.health.max}`,this.pos.x- this.dim.hitboxWidth * 2,this.pos.y- this.dim.hitboxHeight * 2)
    }
    move() {
        if(this.moveCooldown <= 0) {
            this.moveCooldown= this.stats.moveCheckCooldown
            const dx = this.manager.player.pos.x - this.pos.x
            const dy = this.manager.player.pos.y - this.pos.y
            const radians = Math.atan2(dy, dx)
            const vx = Math.cos(radians)  * this.stats.speed
            const vy = Math.sin(radians) * this.stats.speed
            this.v.x = vx;
            this.v.y = vy;
        }
        super.move()
    }
}
class GameManager {
    constructor() {
        this.Wave = 0
        this.player = new Player({
            "dim": {
                "height": 20, 
                "width": 20},
            "pos":{
                "x": GAME_CONFIG.BORDER.x /2,
                "y":GAME_CONFIG.BORDER.y/2,
                "rotX":0,
                "rotY":0},
            "v": {
                "x": 0,
                "y":0},
            "color": 'blue',
            "stats": {
                "speed":GAME_CONFIG.PLAYER_BASE.SPEED,
                "damage": 2,
                "health":{
                    "max": GAME_CONFIG.PLAYER_BASE.HEALTH.MAX,
                    "cur":GAME_CONFIG.PLAYER_BASE.HEALTH.MAX,
                    "invunerability":GAME_CONFIG.PLAYER_BASE.HEALTH.INVULNERABILITY},
                "projectyle": {
                    "cooldown":GAME_CONFIG.PLAYER_BASE.PROJECTILE.COOLDOWN,
                    "speed":GAME_CONFIG.PLAYER_BASE.PROJECTILE.SPEED,
                    "life": GAME_CONFIG.PLAYER_BASE.PROJECTILE.LIFE,
                    "damage":GAME_CONFIG.PLAYER_BASE.PROJECTILE.DAMAGE,
                    "penetrate": 1
                },},}
            ,this)
        this.Projectyles = [
            
        ]
        this.Entities = [
            
        ]
        requestAnimationFrame(this.gameLoop)
    }
    spawnNewWave() {
        const health = Math.floor(GAME_CONFIG.ENEMY_BASE.HEALTH.MAX + 2*Math.cbrt(Math.pow(this.Wave,2.5)));
        const speed = GAME_CONFIG.ENEMY_BASE.SPEED + (0.1 * this.Wave) + (0.01 * Math.pow(this.Wave, 2));
        const damage = Math.floor((GAME_CONFIG.ENEMY_BASE.DAMAGE + (1 * this.Wave) + (0.3 * Math.pow(this.Wave, 2))));
        const EnemyCount = Math.ceil(1 + (this.Wave / 5) + (Math.pow(this.Wave, 2) / 200));
        for(let i = 0; i < EnemyCount; i++) {
            const x = 100;
            const y = 100;
            const size = 20;
            const color = GAME_CONFIG.ENEMY_COLORS[randInt(0,20)]
            this.Entities.push(
                new Enemy({
                    "dim": {
                        "height": size, 
                        "width": size},
                    "pos":{
                        "x": x,
                        "y":y,
                        "rotX":0,
                        "rotY":0},
                    "v": {
                        "x": 0,
                        "y":0},
                    "color": color,
                    "stats": {
                        "moveCheckCooldown": GAME_CONFIG.ENEMY_BASE.MOVE_CHECK_COOLDOWN,
                        "speed":speed,
                        "damage": damage,
                        "health":{
                            "max": health,
                            "cur": health,
                            "invunerability": GAME_CONFIG.ENEMY_BASE.MOVE_CHECK_COOLDOWN},
                        },}
                    ,this)
            )
        }
        this.Wave += 1
    }
    gameLoop = () => {
        if(gameRunning) {
            if(!this.player.active) return
                this.EntityUpdate()
            }else {
        }
        requestAnimationFrame(this.gameLoop)
    }
    EntityUpdate() {
        ctx.clearRect(0,0,GAME_CONFIG.BORDER.x,GAME_CONFIG.BORDER.y)
        for(let entity of this.Entities) {
            entity.tickUpdate()
        }
        for(let projectyle of this.Projectyles) {
            projectyle.tickUpdate()
        }
        this.Entities = this.Entities.filter(entity => entity.active);
        this.Projectyles = this.Projectyles.filter(projectyl => projectyl.active);
        if(this.Entities.length == 0) {
           this.spawnNewWave()
        }
        this.player.tickUpdate()
    }
}
class HomeScreen {
    constructor() {
        this.show = true
    }
}
let gameRunning = true
const waveManager = new GameManager(baseV = {"maxHealth": 4, "speed": 2,"damage":2,"enemyCount":1},playerStats = {"projectyle": {"cooldown":50,"speed":6,"life": 20,"damage":2},"speed":2,"health": 20})
function gamePaused() {
    ctx.fillStyle = "rgba(255, 0, 179, 0.005)"
    ctx.fillRect(0,0,GAME_CONFIG.BORDER.x,GAME_CONFIG.BORDER.y)

    drawText("Game Paused",GAME_CONFIG.BORDER.x/2,GAME_CONFIG.BORDER.y/2-40, fontColor = 'black', fontSize = '50px', fontFamily = 'sans-serif',textAlign = 'center',textBaseline = 'middle')
    drawText("click ESC to unPause",GAME_CONFIG.BORDER.x/2,GAME_CONFIG.BORDER.y/2+50, fontColor = 'black', fontSize = '40px', fontFamily = 'sans-serif',textAlign = 'center',textBaseline = 'middle')
}
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