class Endboss extends MovableObject{
    height = 400;
    width = 250;
    y = 60;
    IMAGES_WALKING =[
        '../assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        '../assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        '../assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        '../assets/img/4_enemie_boss_chicken/1_walk/G4.png',
        // '../assets/img/4_enemie_boss_chicken/1_walk/G5.png',
        // '../assets/img/4_enemie_boss_chicken/1_walk/G6.png',
        // '../assets/img/4_enemie_boss_chicken/1_walk/G7.png',
        // '../assets/img/4_enemie_boss_chicken/1_walk/G8.png',
        // '../assets/img/4_enemie_boss_chicken/1_walk/G9.png',
        // '../assets/img/4_enemie_boss_chicken/1_walk/G10.png',
        // '../assets/img/4_enemie_boss_chicken/1_walk/G11.png',
        // '../assets/img/4_enemie_boss_chicken/1_walk/G12.png',
    ];
    offset = {
        top: 80,
        left: 40,
        right: 40,
        bottom: 40
      }

    constructor(){
        super().loadImage('../assets/img/4_enemie_boss_chicken/1_walk/G1.png');
        this.x = 700;
        this.loadImages(this.IMAGES_WALKING);
        this.speed = 0.4 
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