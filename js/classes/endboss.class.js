class Endboss extends MovableObject{
    height = 400;
    width = 250;
    y = 60;
    isDead = false;
    endbossAppeared = false;
    isBeingHit = false;

    IMAGES_WALKING =[
        '../assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        '../assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        '../assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        '../assets/img/4_enemie_boss_chicken/1_walk/G4.png',
    ];
    IMAGES_ALERT =[
        '../assets/img/4_enemie_boss_chicken/1_walk/G5.png',
        '../assets/img/4_enemie_boss_chicken/1_walk/G6.png',
        '../assets/img/4_enemie_boss_chicken/1_walk/G7.png',
        '../assets/img/4_enemie_boss_chicken/1_walk/G8.png',
        '../assets/img/4_enemie_boss_chicken/1_walk/G9.png',
        '../assets/img/4_enemie_boss_chicken/1_walk/G10.png',
        '../assets/img/4_enemie_boss_chicken/1_walk/G11.png',
        '../assets/img/4_enemie_boss_chicken/1_walk/G12.png',
    ];
    IMAGES_ATTACK =[
        '../assets/img/4_enemie_boss_chicken/3_attack/G13.png',
        '../assets/img/4_enemie_boss_chicken/3_attack/G14.png',
        '../assets/img/4_enemie_boss_chicken/3_attack/G15.png',
        '../assets/img/4_enemie_boss_chicken/3_attack/G16.png',
        '../assets/img/4_enemie_boss_chicken/3_attack/G17.png',
        '../assets/img/4_enemie_boss_chicken/3_attack/G18.png',
        '../assets/img/4_enemie_boss_chicken/3_attack/G19.png',
        '../assets/img/4_enemie_boss_chicken/3_attack/G20.png',
       
    ];

    IMAGES_HURT =[
        '../assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
        '../assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
        '../assets/img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    IMAGES_DEAD =[
        '../assets/img/4_enemie_boss_chicken/5_dead/G24.png',
        '../assets/img/4_enemie_boss_chicken/5_dead/G25.png',
        '../assets/img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    offset = {
        top: 80,
        left: 40,
        right: 40,
        bottom: 40
      }

    constructor(){
        super().loadImage('../assets/img/4_enemie_boss_chicken/1_walk/G1.png');
        this.x = 2000;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.speed = 0.4 
        this.animate();
    }
    
    animate(){
        setInterval(() => this.randomMove(), 1000 / 60);

        setInterval(() => {
            if (!this.isDead && !this.isBeingHit) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 1000 / 6);
    }

    randomMove() {
        if (this.isDead || this.isBeingHit) return;
    
       let direction = -1
       this.x += this.speed * direction;
    
        // Begrenzung des Bewegungsbereichs
        const minX = 2300;
        const maxX = 2800;
    
        if (this.x < minX) direction = 1;
        if (this.x > maxX) direction = -1;
    }

    hit(){
        if(this.isDead || this.isBeingHit) return;
        this.isBeingHit = true;

        this.playSequenceAnimation([
            this.IMAGES_HURT,
            this.IMAGES_ALERT,
            this.IMAGES_ATTACK,
            this.IMAGES_WALKING,
        ],() => {
            this.isBeingHit = false;
        });
    }
    playSequentialAnimations(animationGroups, onComplete) {
        let current = 0;
    
        const playNext = () => {
            if (current >= animationGroups.length) {
                onComplete?.();
                return;
            }
    
            this.playAnimationOnce(animationGroups[current], () => {
                current++;
                playNext();
            });
        };
    
        playNext();
    }
    
    playAnimationOnce(images, callback) {
        let index = 0;
        const interval = setInterval(() => {
            this.img = this.imageCache[images[index]];
            index++;
            if (index >= images.length) {
                clearInterval(interval);
                callback?.();
            }
        }, 1000 / 10);
    }

    markAsDead() {
        this.isDead = true;
        this.IMAGES_DEAD.forEach(img => this.playAnimation(img))
      }
}