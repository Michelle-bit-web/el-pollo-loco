class SmallChicken extends MovableObject {
    height = 40;
    width = 30;
    isDead = false;
    IMAGES_WALKING =[
        '../assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        '../assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        '../assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];
    IMAGE_DEAD =
        '../assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
   
    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }
      constructor(x, y, speed){
        super().loadImage('assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }

    animate(){
        this.animationIntervals['smallChickenMovesLeft'] = setInterval(() => {
           this.moveLeft();
        }, 1000 / 60);
       this.animationIntervals['smallChickenPlayAnimation'] = setInterval(() =>{
            this.playAnimation(this.IMAGES_WALKING);
        }, 1000/ 6);
    }

    markAsDead() {
        this.isDead = true;
        this.stopAnimation('smallChickenMovesLeft'); // Stoppe die Animation
        this.stopAnimation('smallChickenPlayAnimation'); // Stoppe die Animation
        this.loadImage(this.IMAGE_DEAD); // Lade das "tote" Bild

      }

    }