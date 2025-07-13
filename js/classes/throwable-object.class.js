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
        this.x = x + 60;
        this.y = y + 40;
        this.otherDirection = otherDirection;
        this.throw();
        this.height = 70;
        this.width = 70;
        this.remove = false;
        this.isSplashing = false;
        this.world = world;
        this.rotationIndex = 0;
    }

    throw(){
        this.speedY = 20;
        this.applyGravity();
        this.startFlyingAnimation();   
        this.throwInterval = setInterval(() => {
            if (this.isSplashing) return; 
            if(this.otherDirection){
               this.x -= 10;
            } else {
                this.x += 10;
            };
            
        }, 25);
       this.playThrowingSound(); 
    }

    playThrowingSound(){
        if(!AudioManager.isMuted){
            audioList.throw.play(); 
        }
    }

    startFlyingAnimation(){
         this.rotationInterval = setInterval(() => {
            if (this.isSplashing) return;
            this.playAnimation(this.IMAGES_ROTATION);
            this.rotationIndex = (this.rotationIndex + 1) % this.IMAGES_ROTATION.length;
        }, 50); 
    }

    splash(){
        if (this.isSplashing) return;
        this.isSplashing = true;
        audioList.bottleBreaks.play();
        audioList.bottleSplash.play();
        clearInterval(this.rotationInterval);
        clearInterval(this.throwInterval);
        this.playAnimation(this.IMAGES_SPLASH);
        setTimeout(() => {
            // this.remove = true;
            this.fadeOutOpacity = 1; // Starte mit voller Sichtbarkeit
             this.startFadeOut();  
        }, 500);
        // this.isSplashing = false;
    }

    startFadeOut() {
        this.fadeOutInterval = setInterval(() => {
            this.fadeOutOpacity -= 0.05;
            if (this.fadeOutOpacity <= 0) {
                this.remove = true;
                clearInterval(this.fadeOutInterval);
            }
        }, 50);
        this.world.throwableObjects.splice(0,1);
    }
}