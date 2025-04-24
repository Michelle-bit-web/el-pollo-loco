class World {
    character = new Character();
    enemies = [
        new Chicken(),
        new Chicken(),
        new Chicken(),
    ];
    clouds = [
        new Cloud()
    ];
    backgroundobjects = [];
    canvas;
    ctx;
    keyboard;
    camera_x = 0;

    constructor(canvas, keyboard){
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.collectBgImages();
        this.setWorld();
        this.draw();
    }
    
    collectBgImages(){
        for (let i = 0; i <= 4; i++) {
            let position = 719 * i;
            let number = i % 2 === 1 ? 1 : 2;
            this.backgroundobjects.push(
                new BackgroundObject('../assets/img/5_background/layers/air.png', position),
                new BackgroundObject(`../assets/img/5_background/layers/3_third_layer/${number}.png`, position),
                new BackgroundObject(`../assets/img/5_background/layers/2_second_layer/${number}.png`, position),
                new BackgroundObject(`../assets/img/5_background/layers/1_first_layer/${number}.png`, position),
            )
        }
    }

    setWorld(){
        this.character.world = this;
    }

    draw(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.backgroundobjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.clouds);

        this.ctx.translate(-this.camera_x, 0);

        requestAnimationFrame( () => this.draw());
    }
    addObjectsToMap(objects){
        objects.forEach(obj => this.addToMap(obj))
    }

    addToMap(mo) {
        if(mo.otherDirection){
            this.ctx.save();
            this.ctx.translate(mo.width, 0);
            this.ctx.scale(-1,1);
            mo.x = mo.x * -1;
        }
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
        if(mo.otherDirection){
            mo.x = mo.x * -1;
            this.ctx.restore();
        }
    }
}