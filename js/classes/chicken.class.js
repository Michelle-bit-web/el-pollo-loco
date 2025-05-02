class Chicken extends MovableObject {
    height = 70;
    width = 50;
    isDead = false;
    isFading = false;
    IMAGES_WALKING =[
        '../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        '../assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        '../assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

    IMAGE_DEAD =
        '../assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
   
    offset = {
        top: 10,
        left: 5,
        right: 10,
        bottom: 10
      }

    constructor(x, y, speed){
        super().loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }

    animate(){
        this.animationIntervals['ChickenMovesLeft'] = setInterval(() => {
           this.moveLeft();
        }, 1000 / 60);
        this.animationIntervals['ChickenPlayAnimation'] = setInterval(() =>{
            this.playAnimation(this.IMAGES_WALKING);
        }, 1000/ 6);
    }

    markAsDead() {
        this.isDead = true;
        this.stopAnimation('ChickenMovesLeft'); // Stoppe die Animation
        this.stopAnimation('ChickenPlayAnimation'); // Stoppe die Animation
        this.loadImage(this.IMAGE_DEAD); // Lade das "tote" Bild
      }
  
 }