class SmallChicken extends MovableObject {
    height = 40;
    width = 30;
    isDead = false;
    IMAGES_WALKING =[
        "assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
    ];
    IMAGE_DEAD =
        "assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png";
    
    IMAGE_GHOST = "assets/img/3_enemies_chicken/chicken_ghost.png";
   
    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }
      constructor(x, y, speed){
        super().loadImage("assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }

    animate(){
        this.animationIntervals["smallChickenMovesLeft"] = setInterval(() => {
           this.moveLeft();
           if(!this.isDead){
            // audioList.chicken.shouldPlay = true;
            audioList.chicken.play();}
        }, 1000 / 60);
       this.animationIntervals["smallChickenPlayAnimation"] = setInterval(() =>{
            this.playAnimation(this.IMAGES_WALKING);
        }, 1000/ 6);
    }

    markAsDead() {
        audioList.jumpOnChicken.shouldPlay = true;
        audioList.jumpOnChicken.play();
        this.isDead = true;
        this.stopAnimation("smallChickenMovesLeft"); // Stoppe die Animation
        this.stopAnimation("smallChickenPlayAnimation"); // Stoppe die Animation
        this.loadImage(this.IMAGE_DEAD);
        setTimeout(() => {
            audioList.jumpOnChicken.stop();
            audioList.chicken.stop();
            this.loadImage(this.IMAGE_GHOST);
            this.speedY = -0.1;
            this.acceleration = -1;
            this.applyGravity();
            audioList.ghost.shouldPlay = true;
            audioList.ghost.play(); 
            this.removalCheckInterval = setInterval(() => {
                if (this.y + this.height < 0) { // vollständig nach oben verschwunden
                    this.removeFromLevel();
                    clearInterval(this.removalCheckInterval);
                     audioList.ghost.stop(); 
                }
            }, 1000 / 30);
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