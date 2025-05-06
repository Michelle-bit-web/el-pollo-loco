class Endboss extends MovableObject{
    height = 400;
    width = 250;
    y = 60;
    isDead = false;
    endbossAppeared = false;
    statusbar;
    isBeingHit = false;
    state = "idle";
    contactFrames = 0; 
    energy = 100;
    speed = 0.4; 
    speedLevel = 1;

    IMAGES_WALKING =[
        '../assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        '../assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        '../assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        '../assets/img/4_enemie_boss_chicken/1_walk/G4.png',
    ];
    IMAGES_ALERT =[
        '../assets/img/4_enemie_boss_chicken/2_alert/G5.png',
        '../assets/img/4_enemie_boss_chicken/2_alert/G6.png',
        '../assets/img/4_enemie_boss_chicken/2_alert/G7.png',
        '../assets/img/4_enemie_boss_chicken/2_alert/G8.png',
        '../assets/img/4_enemie_boss_chicken/2_alert/G9.png',
        '../assets/img/4_enemie_boss_chicken/2_alert/G10.png',
        '../assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        '../assets/img/4_enemie_boss_chicken/2_alert/G12.png',
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

    IMAGES_SEQUENCE = [
        this.IMAGES_WALKING,
        this.IMAGES_ALERT,
        this.IMAGES_ATTACK,
    ];

    offset = {
        top: 80,
        left: 40,
        right: 40,
        bottom: 40
      }

    constructor(x){
        super().loadImage('../assets/img/4_enemie_boss_chicken/1_walk/G1.png');
        this.x = x;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
        this.previousState = 'idle';
    }
    
    animate() {
        setInterval(() => {
            if (!this.endbossAppeared) return;
            this.updateSpeedBasedOnEnergy(); 
            if (this.isDead) {
                this.state = 'dead';
                this.playAnimation(this.IMAGES_DEAD);
            } 
            // else if (this.isBeingHit) {
            //     this.state = 'hurt';
                // bereits in der hit-Methode gesetzt
            // } 
            else if (this.firstContact()) {
                this.hadFirstContact = true;
                this.endbossAppeared = true;
                // this.world.gameSounds.endbossIntroSound.play();
                this.statusbar = new Statusbar('energyEndboss', 500, 5);
                this.state = 'alert';
                this.contactFrames = 0;
            }
    
            if (this.state === 'alert') {
                this.contactFrames++;
                this.playAnimation(this.IMAGES_ALERT);
                if (this.contactFrames > 30) { // Nach ca. 5 Sekunden
                    this.state = 'attack';
                }
            } else if (this.state === 'attack') {
                // this.world.gameSounds.endbossAttackSound.play();
                this.moveTowardCharacter();
                this.playAnimation(this.IMAGES_ATTACK);
            }
        }, 100);
    }

    updateSpeedBasedOnEnergy() {
        if (this.energy <= 25 && this.speedLevel < 3) {
            this.speed = 1.5;
            this.speedLevel = 3;
        } else if (this.energy <= 50 && this.speedLevel < 2) {
            this.speed = 0.6;
            this.speedLevel = 2;
        }
        console.log(this.energy)
    }

    takeDamage(amount) {
        if (this.isDead) return;
    
        this.energy -= amount;
        this.energy = Math.max(0, this.energy); // Verhindere, dass die Energie negativ wird
        console.log('[DEBUG] Endboss-Energie:', this.energy);
    
        if (this.statusbar) {
            const percentage = (this.energy / 100) * 100;
            this.statusbar.setPercentage(percentage); // Update der Statusleiste
        }
    
        if (this.energy <= 0) {
            this.markAsDead();
        }
    }

    moveTowardCharacter() {
        if (this.world.character.x > this.x) {
            this.moveRight();
            this.otherDirection = true;
        } else {
            this.moveLeft();
            this.otherDirection = false;
        }
    }

    firstContact() {
        return this.world.character.x > 2100 && !this.hadFirstContact;
    }

    hit() {
        if (this.isDead) return;

        this.previousState = this.state; // Zustand merken
        this.isBeingHit = true;
        this.state = 'hurt';
    
        this.playAnimationOnce(this.IMAGES_HURT, () => {
            this.isBeingHit = false;
            this.state = this.previousState; // Zustand zurücksetzen
        });
    }
    
    playAnimationOnce(images, callback) {
        let index = 0;
        const interval = setInterval(() => {
            this.img = this.imageCache[images[index]];
            index++;
            if (index >= images.length) {
                clearInterval(interval);
                callback?.(); //Schreibfehler?
            }
        }, 1000 / 10);
    }

    markAsDead() {
        this.isDead = true;
        this.IMAGES_DEAD.forEach(img => this.playAnimation(img))
      }
}