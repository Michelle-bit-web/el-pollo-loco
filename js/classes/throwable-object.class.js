class ThrowableObject extends MovableObject{

    constructor(x, y){
        super();
        this.loadImage("../assets/img/7_statusbars/3_icons/icon_salsa_bottle.png");
        this.x = x;
        this.y = y;
        this.throw();
        this.height = 70;
        this.width = 70;
    }

    throw(){
        this.speedY = 30;
        this.applyGravity();
        setInterval(() => {
            this.x += 10;
        }, 25)
    }
}