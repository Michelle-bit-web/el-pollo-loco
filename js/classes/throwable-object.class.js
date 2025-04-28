class ThrowableObject extends MovableObject{

    constructor(){
        super();
        this.loadImage("../assets/img/7_statusbars/3_icons/icon_salsa_bottle.png");
        this.x = 100;
        this.y = 100;
        this.throw(100, 150);
        this.height = 70;
        this.width = 70;
    }

    throw(x, y){
        this.x = x;
        this.y = y;
        this.speedY = 30;
        this.applyGravity();
    }
}