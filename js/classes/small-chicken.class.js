class SmallChicken extends MovableObject {
    height = 40;
    width = 30;
    IMAGES_WALKING =[
        '../assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        '../assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        '../assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];
    IMAGE_DEAD =
        '../assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
   
    offset = {
        top: 10,
        left: 5,
        right: 10,
        bottom: 10
      }
      constructor(x, y, speed){
        super().loadImage('assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.x = x;
        this.y = y;
        this.speed = speed;
        // this.x = 200 + Math.random()*500;
        this.loadImages(this.IMAGES_WALKING);
        // this.speed = 0.15 + Math.random() * 0.3;
        this.animate();
    }

    animate(){
        setInterval(() => {
           this.moveLeft();
        }, 1000 / 60);
        setInterval(() =>{
            this.playAnimation(this.IMAGES_WALKING);
        }, 1000/ 6);
    }

    }