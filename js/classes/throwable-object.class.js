class ThrowableObject extends MovableObject{
    IMAGES_ROTATION = [
        "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
        "assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
        "assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
        "assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png"
    ];

    IMAGES_SPLASH =[
        "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
        "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
        "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
        "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
        "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
        "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
    ];

    constructor(x, y, otherDirection, world){
        super();
        this.loadImage("assets/img/7_statusbars/3_icons/icon_salsa_bottle.png");
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.otherDirection = otherDirection;
        this.throw();
        this.height = 70;
        this.width = 70;
        this.remove = false;
        this.isSplashing = false;
        this.world = world;
    }

    throw(){
        this.speedY = 10;
        this.applyGravity();
        this.throwInterval = setInterval(() => {
            if(this.otherDirection){
               this.x -= 10; //throw to left
            } else {
                this.x += 10; //throw to right
            };
            this.startFlyingAnimation();  
        }, 25);
       this.playThrowingSound(); 
       
    }

    playThrowingSound(){
        if(!AudioManager.isMuted){ //??So funktionell?
            // audioList.throw.play(); //noch einen suchen
        }
    }

    startFlyingAnimation(){
         let rotationIndex = 0;
         this.rotationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_ROTATION);
            if (rotationIndex < this.IMAGES_ROTATION.length - 1) {
                rotationIndex++;
            } else {
                rotationIndex = 0;
            }
        }, 50); 
    }

    splash(){
        this.isSplashing = true;
        clearInterval(this.rotationInterval);
        clearInterval(this.throwInterval);
        this.playAnimation(this.IMAGES_SPLASH);
        setTimeout(() => {
            this.remove = true;
        }, 500);
        this.isSplashing = false;
    }
}