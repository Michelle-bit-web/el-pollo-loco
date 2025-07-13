class Chicken extends MovableObject {
    height = 70;
    width = 50;
    isDead = false;
    isFading = false;
    IMAGES_WALKING =[
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
    ];

    IMAGE_DEAD = "assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png";

    IMAGE_GHOST = "assets/img/3_enemies_chicken/chicken_ghost.png";
   
    offset = {
        top: 8,
        left: 5,
        right: 10,
        bottom: 10
      }

    constructor(x, y, speed){
        super().loadImage("assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }

    animate(){
        this.animationIntervals["ChickenMovesLeft"] = setInterval(() => {
           this.moveLeft();
           if(!this.isDead){
            // audioList.chicken.shouldPlay = true;
            audioList.chicken.play();}
        }, 1000 / 60);
        this.animationIntervals["ChickenPlayAnimation"] = setInterval(() =>{
            this.playAnimation(this.IMAGES_WALKING);
        }, 1000/ 6);
    }

    markAsDead() {
        audioList.jumpOnChicken.shouldPlay = true;
        audioList.jumpOnChicken.play();
        this.isDead = true;
        this.stopAnimation("ChickenMovesLeft");
        this.stopAnimation("ChickenPlayAnimation");
        this.loadImage(this.IMAGE_DEAD);
        setTimeout(() => {
           audioList.jumpOnChicken.stop();
           audioList.chicken.stop();
            this.loadImage(this.IMAGE_GHOST);
            this.speedY = -10;
            this.acceleration = -1;
            this.applyGravity();
            audioList.ghost.shouldPlay = true;
            audioList.ghost.play(); 
            this.removalCheckInterval = setInterval(() => {
                if (this.y + this.height < 0) { // vollständig nach oben verschwunden
                    this.removeFromLevel();
                    clearInterval(this.removalCheckInterval); // Sicherheitsmaßnahme
                    audioList.ghost.stop(); 
                }
            }, 1000 / 30); // 30 FPS-Check
        }, 1000);
    }

    removeFromLevel() {
        if (world && world.level && Array.isArray(world.level.enemies)) {
            let index = world.level.enemies.indexOf(this);
            if (index !== -1) {
                world.level.enemies.splice(index, 1);
            }
        }
    }
 }