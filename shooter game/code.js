const canvas = document.querySelector('#gameScreen')
canvas.height = window.innerHeight
canvas.width = window.innerWidth
const ctx = canvas.getContext('2d')
const CONFIG = {
    SCREEN_SIZE: { x: canvas.width, y: canvas.height },
    PLAYER_STATS: { 
        SIZE: {
            WIDTH: 40,
            HEIGHT: 40,},
        CUBE: {
            COLOR1: 'red',
            COLOR2: 'black',
            LINE_WIDTH: 4,
        }

    }
};
function startGame() {
    console.log('Starting Game');
    homeScreen.active = false;
}
function openSkillMenu() {
    upgradeMenu.active = !upgradeMenu.active
}
function drawText(text,x,y,fontColor = 'white',fontSize = '20px',fontFamily = 'sans-serif',textAlign = 'left',textBaseline = 'middle') {
    ctx.font = `${fontSize} ${fontFamily}`;
    ctx.textAlign = textAlign
    ctx.textBaseline = textBaseline
    ctx.fillStyle = fontColor
    ctx.fillText(text,x,y)
}
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
function work() {
    console.log('worked')
}
class UpgradeMenu {
    constructor() {
        this.pos = {"x": 0,"y": 0}
        this.size = {"width": (CONFIG.SCREEN_SIZE.x / 2),"height":(CONFIG.SCREEN_SIZE.y / 3) * 2}
        this.color = {"main": "white","border": "black","borderWidth": 4}
        this.active = false
    }
    updateLoop() {
        if(!this.active) return
        this.drawScreen()
    }
    drawScreen() {
        ctx.fillStyle = this.color.main
        ctx.fillRect(this.pos.x,this.pos.y,this.size.width,this.size.height)

        ctx.lineWidth = this.color.borderWidth
        ctx.strokeStyle = this.color.border
        ctx.strokeRect(this.pos.x,this.pos.y,this.size.width,this.size.height)
    }
}
class HomeScreen {
    constructor() {
        this.buttons = {
            "startGame": new Button({
                "pos": {
                    "x": CONFIG.SCREEN_SIZE.x/2,
                    "y":CONFIG.SCREEN_SIZE.y/2},
                "size": {
                    "w": 200,
                    "h":75},
                "text":{
                    "content":"startGame",
                    "color": "black",
                    "size":"50px",
                    "style":"Bebas Neue",},
                "fill": {
                    "color": "darkcyan"},
                "stroke": {
                    "color": "black",
                    "lineWidth":4},
                "active": true, 
                "action": startGame},),

            "openUpgrades": new Button({
                "pos": {
                    "x": CONFIG.SCREEN_SIZE.x -150,
                    "y": CONFIG.SCREEN_SIZE.y - 150},
                "size": {
                    "w": 200,
                    "h":75},
                "text":{
                    "content":"Upgrades",
                    "color": "black",
                    "size":"50px",
                    "style":"Bebas Neue",},
                "fill": {
                    "color": "darkcyan"},
                "stroke": {
                    "color": "black",
                    "lineWidth":4},
                "active": true, 
                "action": openSkillMenu},)
        
        }
        this.active = true;
        this.animation = {
            "cube": {
                "pos": {
                    "x": 0,
                    "y": CONFIG.SCREEN_SIZE.y / 5.5 - CONFIG.PLAYER_STATS.SIZE.HEIGHT - 5 
                },
                "v": {
                    "x": 2,
                    "y": 0,
                }
            },
            "circle": {
                "pos": {
                    "x": - CONFIG.PLAYER_STATS.SIZE.HEIGHT * 6,
                    "y": CONFIG.SCREEN_SIZE.y / 5.5 - CONFIG.PLAYER_STATS.SIZE.HEIGHT /2,
                },
                "v": {
                    "x": 2,
                    "y": 0,
                }
            }
        };
    }
    updateLoop() {
        if(!this.active) return
        this.update()
        this.drawScreen()
    }
    update() {
        this.animation.cube.pos.x += this.animation.cube.v.x;
        this.animation.cube.pos.y += this.animation.cube.v.y;
        if(this.animation.cube.pos.x + CONFIG.PLAYER_STATS.SIZE.WIDTH >= CONFIG.SCREEN_SIZE.x) {
            this.animation.cube.pos.x = 0
        }
        
        this.animation.circle.pos.x += this.animation.circle.v.x;
        this.animation.circle.pos.y += this.animation.circle.v.y;
        if(this.animation.circle.pos.x + CONFIG.PLAYER_STATS.SIZE.HEIGHT >= CONFIG.SCREEN_SIZE.x) {
            this.animation.circle.pos.x = 0
        }
    }
    drawScreen() {
        ctx.clearRect(0, 0, CONFIG.SCREEN_SIZE.x, CONFIG.SCREEN_SIZE.y);
        
        ctx.fillStyle = 'blue'
        const CircleX = this.animation.circle.pos.x
        const CircleY = this.animation.circle.pos.y
        ctx.beginPath()
        ctx.arc(CircleX,CircleY,CONFIG.PLAYER_STATS.SIZE.HEIGHT / 2,0,2*Math.PI)
        ctx.fill()

        const cubeX = this.animation.cube.pos.x;
        const cubeY = this.animation.cube.pos.y;
        const cubeW = CONFIG.PLAYER_STATS.SIZE.WIDTH;
        const cubeH = CONFIG.PLAYER_STATS.SIZE.HEIGHT;

        ctx.fillStyle = CONFIG.PLAYER_STATS.CUBE.COLOR1
        ctx.fillRect(cubeX, cubeY, cubeW, cubeH)

        ctx.strokeStyle = CONFIG.PLAYER_STATS.CUBE.COLOR2
        ctx.lineWidth = CONFIG.PLAYER_STATS.CUBE.LINE_WIDTH
        ctx.strokeRect(cubeX, cubeY, cubeW, cubeH)

        for (const button of Object.values(this.buttons)) {
            button.draw()
        }
        drawText("Cuby Shooter", CONFIG.SCREEN_SIZE.x/2, CONFIG.SCREEN_SIZE.y/4, 'black', '100px', 'Bebas Neue', 'center', 'middle')
    }
}
class Button {
    constructor(config = {"pos": {"x": 0,"y":0},"size": {"w": 10,"h":10},"text":{"color": "red","size":"100px","style":"Bebas Neue",},"fill": {"color": "red"},"stroke": {"color": "blue","lineWidth":4},"active": true, "action": work},) {
        this.size = config.size
        this.pos = {"x": config.pos.x ,"y": config.pos.y }
        this.fill = config.fill
        this.stroke = config.stroke
        this.text = config.text
        this.action = config.action
        this.active = config.active
        this.init()
    }
    draw() {
        ctx.strokeStyle = this.stroke.color;
        ctx.lineWidth = this.stroke.lineWidth;
        ctx.beginPath();
        ctx.strokeRect(this.pos.x - this.size.w / 2, this.pos.y - this.size.h / 2, this.size.w, this.size.h);
        
        ctx.fillStyle = this.fill.color;
        ctx.fillRect(this.pos.x - this.size.w / 2, this.pos.y - this.size.h / 2, this.size.w, this.size.h);
        drawText(this.text.content, this.pos.x, this.pos.y, this.text.color, this.text.size, this.text.style, 'center', 'middle');
    }
    init() {
        canvas.addEventListener('click', (e) => {
            if (this.active && 
                (mouse.x > this.pos.x - this.size.w / 2 && mouse.x < this.pos.x + this.size.w / 2) && 
                (mouse.y > this.pos.y - this.size.h / 2 && mouse.y < this.pos.y + this.size.h / 2)) {
                
                this.action();
            }
        });
    }
}
class Entity {
    constructor(stats = {
        "dim": {
            "h": 10, 
            "w": 10},
        "pos":{
            "x": 0,
            "y":0,
            "rotX":0,
            "rotY":0},
        "v": {
            "x": 0,
            "y":0},
        "color": 'red',
        "move": {
            "checkCooldown": 10,
            "speed":2,},
        "attack": {
            "damage": 2,
            "cooldown":2},
        "health":{
            "max": 20,
            "cur":20,
            "invunerability":10},},) {
        this.stats = stats;
        this.active = true
    }
    tickUpdate() {
        this.checkDeath()
        if(!this.active) return
        this.move()
        this.draw()
    }
    collided() {

    }
    gotHit() {

    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.stats.color
        ctx.arc(this.stats.pos.x,this.stats.pos.y,this.stats.dim.w/2,0,2*Math.PI)
        ctx.fill()
    }
    move() {
        const newX = this.stats.pos.x + this.stats.v.x
        const newY = this.stats.pos.y + this.stats.v.y
        if(newX - this.stats.dim.w / 2< 0 || newX + this.stats.dim.w / 2> CONFIG.SCREEN_SIZE.x) {
            this.stats.v.x *= -1
        }
        if(newY - this.stats.dim.h / 2< 0 || newY + this.stats.dim.h / 2> CONFIG.SCREEN_SIZE.y) {
            this.stats.v.y *= -1
        }
        this.stats.pos.x += this.stats.v.x
        this.stats.pos.y += this.stats.v.y
        
    }
    checkCollision(Entity2) {
        const dx = this.stats.pos.x - Entity2.stats.pos.x
        const dy = this.stats.pos.y - Entity2.stats.pos.y
        const d = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2))
        if(d <= this.stats.dim.w + Entity2.stats.dim.w ) {
            this.collided()
            return true
        }
    }
    checkDeath() {
        if(this.stats.health && this.stats.health.cur <= 0) {
            this.active = false
        }
    }
}
class Player extends Entity {
    constructor(stats = {
        "dim": {
            "h": 20, 
            "w": 20},
        "pos":{
            "x": 0,
            "y":0,
            "rotX":0,
            "rotY":0},
        "v": {
            "x": 0,
            "y":0},
        "color": {
            "body": "darkgray",
            "border": "black",
        },
        "move": {
            "checkCooldown": 10,
            "speed":2,},
        "attack": {
            "damage": 2,
            "cooldown":2},
        "health":{
            "regenerate": {
                "cooldown": 300,
                "by": 2},
            "max": 20,
            "cur":20,
            "invunerability":10},
        "projectyle": {
            "penetrate": 2,
            "cooldown":50,
            "speed":6,
            "life": 20,
            "color": 'black',
            "damage":2}},) {
        super(stats)
        this.projectyleCooldown = this.stats.projectyle.cooldown
        this.invunerable = this.stats.health.invunerability;
        this.regenerationCooldown = this.stats.health.regenerate.cooldown
        this.name = "Player"
    }
    shootProjectyle() {
        const dx = mouse.x -  this.stats.pos.x
        const dy = mouse.y - this.stats.pos.y
        const radians = Math.atan2(dy,dx)
        const x = this.stats.pos.x + Math.cos(radians) * this.stats.dim.w * 1.1
        const y = this.stats.pos.y + Math.sin(radians) * this.stats.dim.w * 1.1
        
        ctx.fillStyle = 'rgba(156, 9, 46, 0.5)'
        ctx.beginPath()
        ctx.arc(x, y,15,0,2*Math.PI)
        ctx.fill()
        
        if(this.projectyleCooldown <= 0) {
            this.projectyleCooldown = this.stats.projectyle.cooldown
            const vx = Math.cos(radians) * this.stats.projectyle.speed
            const vy = Math.sin(radians) * this.stats.projectyle.speed
            projectiles.push(new Projectyle({
                "dim": {
                    "h": 10, 
                    "w": 10},
                "pos":{
                    "x": x,
                    "y":y,
                    "rotX":0,
                    "rotY":0},
                "v": {
                    "x": vx,
                    "y":vy,},
                "color": this.stats.projectyle.color,
                "projectyle": {
                    "life":this.stats.projectyle.life,
                    "penetrate":this.stats.projectyle.penetrate,
                    "damage":this.stats.projectyle.damage},}
                ,))
        }
    }
    draw() {
        const x = this.stats.pos.x - this.stats.dim.w / 2;
        const y = this.stats.pos.y - this.stats.dim.h / 2; 
        const width = this.stats.dim.w;
        const height = this.stats.dim.h;
        ctx.fillStyle = this.stats.color.body;
        ctx.fillRect(x, y, width, height);

        ctx.strokeStyle = this.stats.color.border;
        ctx.strokeRect(x, y, width, height);
    }
    tickUpdate() {
        if(!this.active) return
        this.regenerationCooldown -= 1
        this.invunerable -= 1;
        this.projectyleCooldown -= 1;
        if(this.regenerationCooldown <= 0) {
            this.regenerationCooldown = this.stats.health.regenerate.cooldown
            if(this.stats.health.cur < this.stats.health.max) {
                this.stats.health.cur += this.stats.health.regenerate.by
                if(this.stats.health.cur > this.stats.health.max) {
                    this.stats.health.cur = this.stats.health.max
                }
            }
        }
        this.checkDeath()
        this.handelKeyInput()
        this.move()
        this.draw()
        this.shootProjectyle()
        drawText(`Health: ${this.stats.health.cur}/${this.stats.health.max}`,10,20) 
    }
    move() {
        this.stats.v.x *= 0.8;
        this.stats.v.y *= 0.8;
        super.move()
    }
    handelKeyInput() {
        if(keys.w) this.stats.v.y -= this.stats.move.speed
        if(keys.s) this.stats.v.y += this.stats.move.speed
        if(keys.a) this.stats.v.x -= this.stats.move.speed
        if(keys.d) this.stats.v.x += this.stats.move.speed
    }
}
class Projectyle extends Entity {
    constructor(stats = {
                "dim": {
                    "height": 6, 
                    "width": 6},
                "pos":{
                    "x": 0,
                    "y":0,
                    "rotX":0,
                    "rotY":0},
                "v": {
                    "x": 0,
                    "y":0,},
                "color": 'black',
                "projectyle": {
                    "life":300,
                    "penetrate":1,
                    "damage":2},}) {
        super(stats);
        this.name = "Projectyle"
    }
    tickUpdate() {
        this.stats.projectyle.life -= 1;
        if(this.stats.projectyle.life <= 0 || this.stats.projectyle.penetrate <= 0) {this.active = false}
        if(!this.active) return
        this.move()
        this.draw()
        this.checkAllColl()
    }
    checkAllColl() {
        for(let entity of enemies) {
            if(!entity.active) {continue}
            const collided = this.checkCollision(entity)
            if(collided) {
                this.hitEntity(entity)
            }
        }
    }
    hitEntity(Entity2) {
        this.stats.projectyle.penetrate -= 1;
        if(this.stats.projectyle.penetrate <= 0) {
            this.active = false
        }
        Entity2.stats.health.cur -= this.stats.projectyle.damage;
    }
}
class Enemy extends Entity {
        constructor(stats = {
        "dim": {
            "h": 10, 
            "w": 10},
        "pos":{
            "x": 0,
            "y":0,
            "rotX":0,
            "rotY":0},
        "v": {
            "x": 0,
            "y":0},
        "color": 'red',
        "move": {
            "checkCooldown": 10,
            "speed":2,},
        "attack": {
            "damage": 2,
            "cooldown":2},
        "health":{
            "max": 20,
            "cur":20,
            "invunerability":10},}) {
        super(stats);
        this.moveCooldown = this.stats.move.checkCooldown
        this.attackCooldown = this.stats.attack.cooldown
        this.name = "Enemy"
    }
    tickUpdate() {
        this.attackCooldown -= 1;
        this.moveCooldown-= 1;
        if(this.moveCooldown <= 0) {
            this.pathFindToPlayer()
        }
        super.tickUpdate()
        this.checkPlayerCollision()
        drawText(`${this.name}: ${this.stats.health.cur}/${this.stats.health.max}`,this.stats.pos.x- this.stats.dim.h * 1.1,this.stats.pos.y- this.stats.dim.h * 1.1)
    }
    pathFindToPlayer() {
        this.moveCooldown= this.stats.move.checkCooldown
        const dx = player.stats.pos.x - this.stats.pos.x
        const dy = player.stats.pos.y - this.stats.pos.y
        const radians = Math.atan2(dy, dx)
        const vx = Math.cos(radians)  * this.stats.move.speed
        const vy = Math.sin(radians) * this.stats.move.speed
        this.stats.v.x = vx;
        this.stats.v.y = vy;
    }
    hitPlayer() {
        player.invunerable = player.stats.health.invunerability
        player.stats.health.cur -= this.stats.attack.damage
        
    }
    checkPlayerCollision() {
        if(player.invunerable <= 0 && this.attackCooldown <= 0) {
            if(this.checkCollision(player)) {
                this.hitPlayer()
            }
        }
    }
}
const upgradeMenu = new UpgradeMenu()
const homeScreen = new HomeScreen()
let player = new Player({
        "dim": {
            "h": 50, 
            "w": 50},
        "pos":{
            "x": 500,
            "y":500,
            "rotX":0,
            "rotY":0},
        "v": {
            "x": 0,
            "y":0},
        "color": {
            "body": "darkgray",
            "border": "black",
        },
        "move": {
            "checkCooldown": 10,
            "speed":2,},
        "attack": {
            "damage": 2,
            "cooldown":2},
        "health":{
            "regenerate": {
                "cooldown": 300,
                "by": 2},
            "max": 20,
            "cur":20,
            "invunerability":10},
        "projectyle": {
            "penetrate": 1,
            "cooldown":50,
            "speed":6,
            "life": 300,
            "color": 'black',
            "damage":2}})

let enemies = [new Enemy({
        "dim": {
            "h": 30, 
            "w": 30},
        "pos":{
            "x": 100,
            "y":100,
            "rotX":0,
            "rotY":0},
        "v": {
            "x": 0,
            "y":0},
        "color": 'red',
        "move": {
            "checkCooldown": 10,
            "speed":2,},
        "attack": {
            "damage": 2,
            "cooldown":2},
        "health":{
            "max": 20,
            "cur":20,
            "invunerability":10},})]
let projectiles = []
function animationLoop() {
    ctx.clearRect(0,0,CONFIG.SCREEN_SIZE.x,CONFIG.SCREEN_SIZE.y)
    if(homeScreen.active) {
        homeScreen.updateLoop()
        upgradeMenu.updateLoop()
    }else {
        for(let enemie of enemies) {
            enemie.tickUpdate()
        }
        for(let projectyl of projectiles) {
            projectyl.tickUpdate()
        }
        player.tickUpdate()
        enemies = enemies.filter(enemy => enemy.active);
        projectiles = projectiles.filter(projectyl => projectyl.active);
        if(!player.active) homeScreen.active = true
    }
    requestAnimationFrame(animationLoop)
}
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouse.x = x
    mouse.y = y
})
function randInt(min,max) {
    return Math.floor(Math.random() * (max - min + 1)) + min; 
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
requestAnimationFrame(animationLoop)