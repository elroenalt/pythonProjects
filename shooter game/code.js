const canvas = document.querySelector('#gameScreen')
canvas.height = window.innerHeight
canvas.width = window.innerWidth
const ctx = canvas.getContext('2d')
const gameScreenW = canvas.width <= 850 || canvas.height <= 850 ? canvas.height < canvas.width ? canvas.height - 50 : canvas.width -50 : 800
const SM = Math.floor((gameScreenW / 800) * 1.2)
const CONFIG = {
    SCREEN_SIZE: { w: canvas.width, h: canvas.height },
    GAME_SCREEN: {w: gameScreenW,h:gameScreenW,x:  canvas.width/2 - gameScreenW / 2, y: canvas.height/2 - gameScreenW / 2},
    PLAYER_STATS: { 
        SIZE: {
            WIDTH: 40 * SM,
            HEIGHT: 40 * SM,},
        CUBE: {
            COLOR1: 'red',
            COLOR2: 'black',
            LINE_WIDTH: 1,},
        MOVE: {
            SPEED: 8,
        },
        HEALTH: {
            REGENERATE: {
                COOLDOWN: 300,
                BY: 2,},
        MAX: 20,
        INVUNERABILITY: 10,},
        ABILITIES: {
            PROJECTYLE: {
                PENETRATE: 1,
                COOLDOWN: 50,
                SPEED: 10,
                LIFE: 300,
                COlOR: "black",
                DAMAGE: 2,
            },
        },
    },
    ENEMY_STATS: {
        SIZE: {
            WIDTH: 30 * SM,
            HEIGHT: 30 * SM,
        },
        MOVE: {
            SPEED: 2.5,
            CHECKCOOLDOWN: 10,
        },
        ATTACK: {
            DAMAGE: 2,
            COOLDOWN: 2,
        },
        HEALTH: {
            MAX: 4,
            INVUNERABILITY: 10
        }
    }
};
function startGame() {
    console.log('Starting Game');
    gameManager = new GameManager({"enemy": {"count": 2,"health":  CONFIG.ENEMY_STATS.HEALTH.MAX,"damage": CONFIG.ENEMY_STATS.ATTACK.DAMAGE}})
    gameManager.Wave = 0
    gameManager.nextWave()
    homeScreen.active = false;
}
function openSkillMenu(open) {
    upgradeMenu.opening = open ? false : true
    upgradeMenu.closing = open ? true : false
    upgradeMenu.active = true
}
function drawText(config = {text: 'text',x: 0,y: 0,fontColor: 'white',fontSize: '20px',fontFamily: 'sans-serif',textAlign: 'left',textBaseline: 'middle'}) {
    ctx.font = `${config.fontSize} ${config.fontFamily}`;
    ctx.textAlign = config.textAlign
    ctx.textBaseline = config.textBaseline
    ctx.fillStyle = config.fontColor
    ctx.fillText(config.text,config.x,config.y)
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
class Screen {
    constructor() {
        this.pos = {x: 0,y: CONFIG.SCREEN_SIZE.h / 2 ,aX: 0,aY: CONFIG.SCREEN_SIZE.h}
        this.animationSpeed = 10
        this.size = {w: CONFIG.SCREEN_SIZE.w,h:CONFIG.SCREEN_SIZE.h,aW: CONFIG.SCREEN_SIZE.w,aH:CONFIG.SCREEN_SIZE.h,}
        this.color = {main: "white",border: "red",lineWidth: 10}
        this.textDisplays = []
        this.buttons = []
        this.active = false
        this.closing = false
        this.opening = false
    }
    closeScreen() {
        this.pos.aY = 0
        this.closing = true
    }
    openScreen() {
        this.pos.aY = CONFIG.SCREEN_SIZE.h
        this.opening = true
    }
    tickUpdate() {
        if(!this.active) return
        if(this.opening === true) {
            this.openAnimation()
        }
        if(this.closing === true) {
            this.closeAnimation()
        }
        this.drawScreen()
        this.drawElements()
        this.screenDecoration()
    }
    closeAnimation() {
        this.pos.aY += this.animationSpeed
        if(this.pos.aY > CONFIG.SCREEN_SIZE.h) {
            this.active = false
            this.closing = false
        }
    }
    openAnimation() {
        if(this.pos.aY > this.pos.y) {
            this.pos.aY -= this.animationSpeed
        }else if(this.pos.aY < this.pos.y) {
            this.pos.aY = this.pos.y
            this.opening = false
        }
    }
    screenDecoration() {

    }
    drawElements(){
        for(let textDisplay of this.textDisplays) {
            textDisplay.draw(this.pos.aX,this.pos.aY)
        }
        for(let button of this.buttons) {
            button.draw(this.pos.aX,this.pos.aY)
        }
    }
    drawScreen() {

        ctx.strokeStyle = this.color.border
        ctx.lineWidth = this.color.lineWidth
        ctx.strokeRect(this.pos.aX,this.pos.aY ,this.size.aW,this.size.aH)
        
        ctx.fillStyle = this.color.main
        ctx.fillRect(this.pos.aX,this.pos.aY ,this.size.aW,this.size.aH)
    }
}
class UpgradeMenu extends Screen {
    constructor() {
        super()
        this.pos = {x: 0,y: CONFIG.SCREEN_SIZE.h/2 ,aX: 0,aY: CONFIG.SCREEN_SIZE.h}
        this.size = {w:CONFIG.SCREEN_SIZE.w,h:(CONFIG.SCREEN_SIZE.w/5 ) / 5 * 4,aW: CONFIG.SCREEN_SIZE.w, aH:(CONFIG.SCREEN_SIZE.w/5 )*4}
        this.textDisplays = [ new Text()]
        this.buttons = [new Button({"pos": {"x": CONFIG.SCREEN_SIZE.w - 200,"y":0},"size": {"w": 200,"h":100},"text":{"color": "black","size":"50px","style":"monospace","content": "v"},"fill": {"color": "darkslategray"},"stroke": {"color": "darkcyan","lineWidth":10},"active": true, "action": () => openSkillMenu(true),"draw": false,"parent": this})]
        this.size = {w: CONFIG.SCREEN_SIZE.w,h:CONFIG.SCREEN_SIZE.h,aW: CONFIG.SCREEN_SIZE.w,aH:CONFIG.SCREEN_SIZE.h,}
        this.color = {main: "darkslategray",border: "darkcyan",lineWidth: 20}
    }
}
class Text {
    constructor(config = {text: 'text',x: 20,y: 20,fontColor: 'red',fontSize: '100px',fontFamily: 'sans-serif',textAlign: 'left',textBaseline: 'top'}) {
        this.config = config
    }
    draw(x,y) {
        drawText({
            text: this.config.text,
            x: x + this.config.x,
            y: y + this.config.y, 
            fontColor: this.config.fontColor,
            fontSize: this.config.fontSize,
            fontFamily: this.config.fontFamily,
            textAlign: this.config.textAlign,
            textBaseline: this.config.textBaseline 
        })
    }
}
class HomeScreen {
    constructor() {
        this.pos = {x:0,y:0,aX:0,aY:0}
        this.buttons = {
            "startGame": new Button({
                "pos": {
                    "x": CONFIG.SCREEN_SIZE.w/2,
                    "y":CONFIG.SCREEN_SIZE.h/2 - 90},
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
                "action": startGame,
                "parent": this},),

            "openUpgrades": new Button({
                "pos": {
                    "x": CONFIG.SCREEN_SIZE.w -150,
                    "y": CONFIG.SCREEN_SIZE.h - 150},
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
                "action": openSkillMenu,
                "parent": this},)
        
        }
        this.active = true;
        this.animation = {
            "cube": {
                "pos": {
                    "x": 0,
                    "y": CONFIG.SCREEN_SIZE.h / 5.5 - CONFIG.PLAYER_STATS.SIZE.HEIGHT - 5 
                },
                "v": {
                    "x": 2,
                    "y": 0,
                }
            },
            "circle": {
                "pos": {
                    "x": - CONFIG.PLAYER_STATS.SIZE.HEIGHT * 6,
                    "y": CONFIG.SCREEN_SIZE.h / 5.5 - CONFIG.PLAYER_STATS.SIZE.HEIGHT /2,
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
        if(this.animation.cube.pos.x + CONFIG.PLAYER_STATS.SIZE.WIDTH >= CONFIG.SCREEN_SIZE.w) {
            this.animation.cube.pos.x = 0
        }
        
        this.animation.circle.pos.x += this.animation.circle.v.x;
        this.animation.circle.pos.y += this.animation.circle.v.y;
        if(this.animation.circle.pos.x + CONFIG.PLAYER_STATS.SIZE.HEIGHT >= CONFIG.SCREEN_SIZE.w) {
            this.animation.circle.pos.x = 0
        }
    }
    drawScreen() {
        ctx.clearRect(0, 0, CONFIG.SCREEN_SIZE.w, CONFIG.SCREEN_SIZE.h);
        
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
            button.draw(0,0)
        }
        drawText({
            text: "Cuby Shooter", 
            x: CONFIG.SCREEN_SIZE.w/2, 
            y: CONFIG.SCREEN_SIZE.h/4, 
            fontColor: 'black', 
            fontSize: '100px', 
            fontFamily: 'Bebas Neue', 
            textAlign: 'center', 
            textBaseline: 'middle'
        })
    }
}
class Button {
    constructor(config = {"pos": {"x": 0 +200,"y":200 +100},"size": {"w": 200,"h":100},"text":{"color": "black","size":"50px","style":"Bebas Neue","content": "idk"},"fill": {"color": "gray"},"stroke": {"color": "black","lineWidth":10},"active": true, "action": work,"draw": false,"parent": screen},) {
        this.size = config.size
        this.pos = {"x": config.pos.x ,"y": config.pos.y }
        this.fill = config.fill
        this.stroke = config.stroke
        this.text = config.text
        this.action = config.action
        this.active = config.active
        this.parent = config.parent
        if(config.draw) {
            this.draw = config.draw
        }
        this.init()
    }
    draw(x,y) {
        ctx.strokeStyle = this.stroke.color;
        ctx.lineWidth = this.stroke.lineWidth;
        ctx.beginPath();
        ctx.strokeRect(x +this.pos.x - this.size.w / 2, y+this.pos.y - this.size.h / 2, this.size.w, this.size.h);
        ctx.fillStyle = this.fill.color;
        ctx.fillRect(x+this.pos.x - this.size.w / 2, y+this.pos.y - this.size.h / 2, this.size.w, this.size.h);
        drawText({
            text: this.text.content,
            x: x + this.pos.x,     
            y: y + this.pos.y,    
            fontColor: this.text.color,
            fontSize: this.text.size,
            fontFamily: this.text.style,
            textAlign: 'center',   
            textBaseline: 'middle' 
        });
    }
    init() {
        canvas.addEventListener('click', (e) => {
        
        const absCenterX = this.parent.pos.aX + this.pos.x;
        const absCenterY = this.parent.pos.aY + this.pos.y;
        
        if (this.active && 
            (mouse.x > absCenterX - this.size.w / 2 && 
             mouse.x < absCenterX + this.size.w / 2) && 
            (mouse.y > absCenterY - this.size.h / 2 && 
             mouse.y < absCenterY + this.size.h / 2)) {
                
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
        if(newX - this.stats.dim.w / 2 < CONFIG.GAME_SCREEN.x || newX + this.stats.dim.w / 2> CONFIG.GAME_SCREEN.x + CONFIG.GAME_SCREEN.w ) {
            this.stats.v.x *= -1
        }
        if(newY - this.stats.dim.h / 2< CONFIG.GAME_SCREEN.y || newY + this.stats.dim.h / 2> CONFIG.GAME_SCREEN.y + CONFIG.GAME_SCREEN.h) {
            this.stats.v.y *= -1
        }
        this.stats.pos.x += this.stats.v.x
        this.stats.pos.y += this.stats.v.y
        
    }
    checkCollision(Entity2) {
        const dx = this.stats.pos.x - Entity2.stats.pos.x
        const dy = this.stats.pos.y - Entity2.stats.pos.y
        const d = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2))
        if(d <= this.stats.dim.w / 2 + Entity2.stats.dim.w / 2) {
            this.collided()
            return true
        }
    }
    onDeath() {

    }
    checkDeath() {
        if(this.stats.health && this.stats.health.cur <= 0) {
            this.active = false
            this.onDeath()
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
            "body": CONFIG.PLAYER_STATS.CUBE.COLOR1,
            "border": CONFIG.PLAYER_STATS.CUBE.COLOR2,
            "line_width": CONFIG.PLAYER_STATS.CUBE.LINE_WIDTH,},
        "move": {
            "speed": CONFIG.PLAYER_STATS.MOVE.SPEED,},
        "health":{
            "regenerate": {
                "cooldown": CONFIG.PLAYER_STATS.HEALTH.REGENERATE.COOLDOWN,
                "by": CONFIG.PLAYER_STATS.HEALTH.REGENERATE.BY},
            "max": CONFIG.PLAYER_STATS.HEALTH.MAX,
            "cur": CONFIG.PLAYER_STATS.HEALTH.MAX,
            "invunerability":10},
        "projectyle": {
            "penetrate": CONFIG.PLAYER_STATS.ABILITIES.PROJECTYLE.PENETRATE,
            "cooldown": CONFIG.PLAYER_STATS.ABILITIES.PROJECTYLE.COOLDOWN,
            "speed": CONFIG.PLAYER_STATS.ABILITIES.PROJECTYLE.SPEED,
            "life": CONFIG.PLAYER_STATS.ABILITIES.PROJECTYLE.LIFE,
            "color": CONFIG.PLAYER_STATS.ABILITIES.PROJECTYLE.COLOR,
            "damage": CONFIG.PLAYER_STATS.ABILITIES.PROJECTYLE.DAMAGE}}) {
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
                    "h": 13, 
                    "w": 13},
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

        ctx.lineWidth = this.stats.color.line_width
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
                    "height": 20, 
                    "width": 20},
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
        "drop": {
            "item": "coin",
            "coins": 20
        },
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
        drawText({
            text: `${this.name}: ${this.stats.health.cur}/${this.stats.health.max}`,
            x: this.stats.pos.x,
            y: this.stats.pos.y - this.stats.dim.h / 2 - 10,
            fontColor: 'black', 
            fontSize: '20px', 
            fontFamily: 'Bebas Neue', 
            textAlign: 'center', 
            textBaseline: 'middle'
        })
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
    onDeath() {
        if(this.stats.drop.item === "coin") {
            items.push(new Coin({
                "dim": {
                    "h": 20 * SM, 
                    "w": 20 * SM},
                "pos":{
                    "x": this.stats.pos.x,
                    "y": this.stats.pos.y,
                    "rotX":0,
                    "rotY":0},
                "v": {
                    "x": 0,
                    "y": 0,},
                "color": "gold",
                "value": this.stats.drop.coins}))
        }else {
            items.push(new Magnet({
                "dim": {
                    "h": 20 * SM, 
                    "w": 20 * SM},
                "pos":{
                    "x": this.stats.pos.x,
                    "y": this.stats.pos.y,
                    "rotX":0,
                    "rotY":0},
                "v": {
                    "x": 0,
                    "y": 0,},
                "color": "brown",}))
        }
        
    }
}
class Magnet extends Entity {
    constructor(stats = {
                "dim": {
                    "h": 20, 
                    "w": 20},
                "pos":{
                    "x": 0,
                    "y": 0,
                    "rotX":0,
                    "rotY":0},
                "v": {
                    "x": 0,
                    "y": 0,},
                "color": "brown",}) {
        super(stats)
    }
    checkPlayerCollision() {
        if(this.checkCollision(player)) {
            this.active = false
            this.hitPlayer()
        }
    }
    tickUpdate() {
        if(!this.active) return
        this.draw()
        this.checkPlayerCollision()
    }
    hitPlayer() {
        magnet = 10
    }
}
class Coin extends Entity {
    constructor(stats = {
                "dim": {
                    "h": 20, 
                    "w": 20},
                "pos":{
                    "x": 0,
                    "y": 0,
                    "rotX":0,
                    "rotY":0},
                "v": {
                    "x": 0,
                    "y": 0,},
                "color": "black",
                "value": 200}) {
        super(stats)
        this.type = "coin"
    }
    tickUpdate() {
        if(!this.active) return
        if(magnet) {
            this.magnetCheckCooldown = 0
            if(this.magnetCheckCooldown <= 0) {
                this.pathFindToPlayer()
                this.magnetCheckCooldow = 100
            }
            this.magnetCheckCooldow  <= 0
            this.stats.pos.x += this.stats.v.x
            this.stats.pos.y += this.stats.v.y
        }
        this.draw()
        this.checkPlayerCollision()
    }
    pathFindToPlayer() {
        const dx = player.stats.pos.x - this.stats.pos.x
        const dy = player.stats.pos.y - this.stats.pos.y
        const radians = Math.atan2(dy, dx)
        const vx = Math.cos(radians)  * magnet
        const vy = Math.sin(radians) * magnet
        this.stats.v.x = vx;
        this.stats.v.y = vy;
    }
    draw() {
        super.draw()
        drawText({
            text: "$",
            x: this.stats.pos.x,
            y: this.stats.pos.y,
            fontColor: 'white', 
            fontSize: '20px', 
            fontFamily: 'Bebas Neue', 
            textAlign: 'center', 
            textBaseline: 'middle'
        })
        drawText({
            text: `${this.stats.value}$`,
            x: this.stats.pos.x,
            y: this.stats.pos.y - this.stats.dim.h / 2 - 10,
            fontColor: 'black', 
            fontSize: '20px', 
            fontFamily: 'Bebas Neue', 
            textAlign: 'center', 
            textBaseline: 'middle'
        })
    }
    hitPlayer() {
        this.active = false
        player.stats.coins += this.stats.value
        this.stats.value = 0;
    }
    checkPlayerCollision() {
        if(this.checkCollision(player)) {
            this.hitPlayer()
        }
    }
}
class GameManager {
    constructor(baseV = {"enemy": {"count": 2,"health":  CONFIG.ENEMY_STATS.HEALTH.MAX,"damage": CONFIG.ENEMY_STATS.ATTACK.DAMAGE}}) {
        this.pos = {x: 0,y:0,aX:0,aY:0}
        this.Wave = 4
        this.baseV = baseV
        this.waveCooldown = 300
        player = new Player({
        "dim": {
            "h": CONFIG.PLAYER_STATS.SIZE.HEIGHT, 
            "w": CONFIG.PLAYER_STATS.SIZE.WIDTH},
        "pos":{
            "x": CONFIG.SCREEN_SIZE.w /2,
            "y": CONFIG.SCREEN_SIZE.h /2,
            "rotX":0,
            "rotY":0},
        "v": {
            "x": 0,
            "y":0},
        "color": {
            "body": CONFIG.PLAYER_STATS.CUBE.COLOR1,
            "border": CONFIG.PLAYER_STATS.CUBE.COLOR2,
            "line_width": CONFIG.PLAYER_STATS.CUBE.LINE_WIDTH,},
        "move": {
            "speed": CONFIG.PLAYER_STATS.MOVE.SPEED,},
        "health":{
            "regenerate": {
                "cooldown": CONFIG.PLAYER_STATS.HEALTH.REGENERATE.COOLDOWN,
                "by": CONFIG.PLAYER_STATS.HEALTH.REGENERATE.BY},
            "max": CONFIG.PLAYER_STATS.HEALTH.MAX,
            "cur": CONFIG.PLAYER_STATS.HEALTH.MAX,
            "invunerability":10},
        "coins": 20,
        "projectyle": {
            "penetrate": CONFIG.PLAYER_STATS.ABILITIES.PROJECTYLE.PENETRATE,
            "cooldown": CONFIG.PLAYER_STATS.ABILITIES.PROJECTYLE.COOLDOWN,
            "speed": CONFIG.PLAYER_STATS.ABILITIES.PROJECTYLE.SPEED,
            "life": CONFIG.PLAYER_STATS.ABILITIES.PROJECTYLE.LIFE,
            "color": CONFIG.PLAYER_STATS.ABILITIES.PROJECTYLE.COlOR,
            "damage": CONFIG.PLAYER_STATS.ABILITIES.PROJECTYLE.DAMAGE}
        })
        this.button = new Button({
            pos: {
                x: CONFIG.GAME_SCREEN.x + CONFIG.GAME_SCREEN.w / 2,
                y: CONFIG.GAME_SCREEN.y + 10}, 
            size: {w:40,h:30},
            active: true,
            "action": () => {
                changeGameRunning()
            },
            "draw": () => {
                ctx.fillStyle = 'darkgreen'
                if(gameRunning) {
                    const x1 = CONFIG.GAME_SCREEN.x + CONFIG.GAME_SCREEN.w / 2 
                    const x2 = CONFIG.GAME_SCREEN.x + CONFIG.GAME_SCREEN.w / 2 + 40 -15
                    const y = CONFIG.GAME_SCREEN.y + 10
                    ctx.fillRect(x1,y,15,30)
                    ctx.fillRect(x2,y,15,30)
                }else {
                    const x = CONFIG.GAME_SCREEN.x + CONFIG.GAME_SCREEN.w / 2 + 5
                    const x2 = CONFIG.GAME_SCREEN.x + CONFIG.GAME_SCREEN.w / 2 + 30 + 5
                    const y = CONFIG.GAME_SCREEN.y + 10
                    const y2 = CONFIG.GAME_SCREEN.y + 10 + 30 / 2
                    const y3 = CONFIG.GAME_SCREEN.y + 10 + 30
                    ctx.beginPath() 
                    ctx.moveTo(x,y)
                    ctx.lineTo(x2,y2)
                    ctx.lineTo(x,y3)
                    ctx.lineTo(x,y)
                    ctx.fill()
                }
            },
            "parent":this})
        enemies = []
        projectiles = []
    }
    tickUpdate() {
        ctx.clearRect(0,0,CONFIG.SCREEN_SIZE.w,CONFIG.SCREEN_SIZE.h)
        ctx.lineWidth = 10
        ctx.fillStyle = "black"
        ctx.fillStyle = "darkgrey"
        ctx.strokeRect(CONFIG.GAME_SCREEN.x,CONFIG.GAME_SCREEN.y,CONFIG.GAME_SCREEN.w,CONFIG.GAME_SCREEN.h)
        ctx.fillRect(CONFIG.GAME_SCREEN.x,CONFIG.GAME_SCREEN.y,CONFIG.GAME_SCREEN.w,CONFIG.GAME_SCREEN.h)
        this.button.draw()
        this.entityUpdate()
        drawText({
            text: `Wave: ${this.Wave + 1}`,
            x: CONFIG.GAME_SCREEN.x + CONFIG.GAME_SCREEN.w -10, 
            y: CONFIG.GAME_SCREEN.y + 10, 
            fontColor: 'white', 
            fontSize: '20px', 
            fontFamily: 'sans-serif', 
            textAlign: 'right', 
            textBaseline: 'top'
        })
        drawText({
            text: `Coins: ${player.stats.coins}$`, 
            x: CONFIG.GAME_SCREEN.x  + 10, 
            y: CONFIG.GAME_SCREEN.y + 50, 
            fontColor: 'white', 
            fontSize: '20px', 
            fontFamily: 'sans-serif', 
            textAlign: 'left', 
            textBaseline: 'top'
        })
        drawText({
            text: `Health: ${player.stats.health.cur}/${player.stats.health.max}`, 
            x: CONFIG.GAME_SCREEN.x  + 10, 
            y: CONFIG.GAME_SCREEN.y + 10, 
            fontColor: 'white', 
            fontSize: '20px', 
            fontFamily: 'sans-serif', 
            textAlign: 'left', 
            textBaseline: 'top'
        })
        if(!player.active) homeScreen.active = true
        if(enemies.length <= 0) {
            this.waveCooldown -= 1
            if(this.waveCooldown <= 0) {
                this.waveCooldown = 300
                this.Wave += 1
                this.nextWave()
            }
        }
    }
    entityUpdate() {
        let coins = 0
        for(let item of items) {
            item.tickUpdate()
            if(item.type === "coin") {
                coins++;
            }
        }
        if(coins <= 0 ) {
            magnet = false
        }
        for(let enemie of enemies) {
            enemie.tickUpdate()
        }
        for(let projectyl of projectiles) {
            projectyl.tickUpdate()
        }
        player.tickUpdate()
        enemies = enemies.filter(enemy => enemy.active);
        items = items.filter(coin => coin.active);
        projectiles = projectiles.filter(projectyl => projectyl.active);
    }
    nextWave() {
        const baseGraph = Math.floor(Math.pow(this.Wave,0.7))
        const EnemyCount = baseGraph + this.baseV.enemy.count
        const EnemyHealth = 2*baseGraph + this.baseV.enemy.health
        const EnemyDAMAGE = baseGraph + this.baseV.enemy.damage
        for(let i = 0; i < EnemyCount; i++) {
            const side = Math.random() < 0.5 ? true : false
            let x;
            let y;
            if(side) {
                x = Math.random() < 0.5 ? CONFIG.GAME_SCREEN.x + CONFIG.GAME_SCREEN.w - 60 : CONFIG.GAME_SCREEN.x + 60
                y = randInt(CONFIG.GAME_SCREEN.y + 60, CONFIG.GAME_SCREEN.y + CONFIG.GAME_SCREEN.h - 60)
            }else {
                y = Math.random() < 0.5 ? CONFIG.GAME_SCREEN.y + CONFIG.GAME_SCREEN.h - 60 : CONFIG.GAME_SCREEN.y + 60
                x = randInt(CONFIG.GAME_SCREEN.x + 60, CONFIG.GAME_SCREEN.x + CONFIG.GAME_SCREEN.w - 60)
            }
            const drop = Math.random() < 0.1 ? {"item":"magnet"} : {"item": "coin","coins": 20 + baseGraph}
            enemies.push(new Enemy({
                "dim": {
                    "h": CONFIG.ENEMY_STATS.SIZE.HEIGHT, 
                    "w": CONFIG.ENEMY_STATS.SIZE.WIDTH},
            "pos":{
                "x": x,
                "y":y,
                "rotX":0,
                "rotY":0},
            "v": {
                "x": 0,
                "y":0},
            "color": 'red',
            "drop": drop,
            "move": {
                "checkCooldown": CONFIG.ENEMY_STATS.MOVE.CHECKCOOLDOWN,
                "speed": CONFIG.ENEMY_STATS.MOVE.SPEED,},
            "attack": {
                "damage": EnemyDAMAGE,
                "cooldown":2},
            "health":{
                "max": EnemyHealth,
                "cur":EnemyHealth,
                "invunerability": CONFIG.ENEMY_STATS.HEALTH.INVUNERABILITY}}))
        }
    }
}
const upgradeMenu = new UpgradeMenu()
const homeScreen = new HomeScreen()
let magnet = false
let gameRunning = true
let player;
let gameManager;
let enemies = []
let projectiles = []
let items = []
function animationLoop() {
    if(homeScreen.active) {
        ctx.clearRect(0,0,CONFIG.SCREEN_SIZE.w,CONFIG.SCREEN_SIZE.h)
        homeScreen.updateLoop()
        upgradeMenu.tickUpdate()
    }else if(gameRunning){
        gameManager.tickUpdate()
        
    }
    requestAnimationFrame(animationLoop)
}
function changeGameRunning() {
    gameRunning = !gameRunning
    gameManager.tickUpdate()
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
        changeGameRunning()
        return
    }
    keys[key] = true
})
document.addEventListener('keyup', (e) => {
    const key = e.key
    keys[key] = false
})
requestAnimationFrame(animationLoop)