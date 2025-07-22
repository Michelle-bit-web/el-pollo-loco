class Endboss extends MovableObject{
    world;
    height = 400;
    width = 250;
    y = 60;
    energy = 100;
    statusbar;
    isBeingHit = false;
    firstContactCharacter = false;
    totalContacts = 0;
    speed = 2; 
    speedLevel = 1;
    isJumping = false;
    walkTowardsCharacter = false;

    IMAGES_WALKING =[
        "assets/img/4_enemie_boss_chicken/1_walk/G1.png",
        "assets/img/4_enemie_boss_chicken/1_walk/G2.png",
        "assets/img/4_enemie_boss_chicken/1_walk/G3.png",
        "assets/img/4_enemie_boss_chicken/1_walk/G4.png",
    ];
    IMAGES_ALERT =[
        "assets/img/4_enemie_boss_chicken/2_alert/G5.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G6.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G7.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G8.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G9.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G10.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G11.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G12.png",
    ];
    IMAGES_ATTACK =[
        "assets/img/4_enemie_boss_chicken/3_attack/G13.png",
        "assets/img/4_enemie_boss_chicken/3_attack/G14.png",
        "assets/img/4_enemie_boss_chicken/3_attack/G15.png",
        "assets/img/4_enemie_boss_chicken/3_attack/G16.png",
        "assets/img/4_enemie_boss_chicken/3_attack/G17.png",
        "assets/img/4_enemie_boss_chicken/3_attack/G18.png",
        "assets/img/4_enemie_boss_chicken/3_attack/G19.png",
        "assets/img/4_enemie_boss_chicken/3_attack/G20.png",
    ];
    IMAGES_HURT =[
        "assets/img/4_enemie_boss_chicken/4_hurt/G21.png",
        "assets/img/4_enemie_boss_chicken/4_hurt/G22.png",
        "assets/img/4_enemie_boss_chicken/4_hurt/G23.png",
    ];
    IMAGES_DEAD =[
        "assets/img/4_enemie_boss_chicken/5_dead/G24.png",
        "assets/img/4_enemie_boss_chicken/5_dead/G25.png",
        "assets/img/4_enemie_boss_chicken/5_dead/G26.png",
    ];
    IMAGES_DIZY = [
        "assets/img/4_enemie_boss_chicken/4_hurt/G23.png",
    ];
    offset = {
        top: 80,
        left: 40,
        right: 40,
        bottom: 40
    }

    constructor(x){
        super().loadImage("assets/img/4_enemie_boss_chicken/1_walk/G1.png");
        this.x = x;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DIZY);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
    }
    
    animate() {
        this.animationIntervals.endbossInterval = setInterval(() => {
            if (this.isBeingHit) {
                this.hurtAnimation();
            }
            else if (this.firstContactCharacter && this.totalContacts > 30) {
                this.attackAnimation();
            }
            else if (this.firstContactCharacter) {
                this.handleFirstContact();
                this.totalContacts++;
                this.updateSpeedBasedOnEnergy();
            } 
            else{
                this.walkingAnimation();
            }
        }, 100);
    }

    handleFirstContact() {
        audioList.gamePlay.stop();
        audioList.chicken.stop(); 
        this.statusbar = new Statusbar("energyEndboss", 500, 5);
        this.x = 2500;
        this.playAnimation(this.IMAGES_ALERT);
    }

    updateSpeedBasedOnEnergy() {
        if(this.energy <= 80){
        this.speed += 0.2;
        this.speedLevel = 2;
        this.moveTowardCharacter();
        }
        if (this.energy <= 40 && this.speedLevel == 2 && !this.isJumping) {
            setInterval(() => {
            this.jump();
            this.isJumping = true;
            }, 5000);
            this.moveTowardCharacter();
        } 
        else {
            this.moveTowardCharacter();
        }
    }

    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.speedY = 30; // Sprunghöhe
            this.applyGravity();
        };
    }

    onLand() {
        this.world.character.jump(35); 
    }

    hurtAnimation(){
        let frameCount = 0;
        const dizyInterval = setInterval(() => {
            audioList.endbossHurt.play(); //Vogelzwitschern einbauen
            this.playAnimation(this.IMAGES_DIZY);
            frameCount++;
            if (frameCount >= 3 ) { 
                clearInterval(dizyInterval);
            }
        }, 500);
        setTimeout(() =>{
        audioList.endbossHurt.play();
        this.playAnimation(this.IMAGES_HURT);
        this.isBeingHit = false;
        }, 200);
    }

    attackAnimation(){
        if(this.energy <= 0){
            this.stopAllAnimations();
            return;
        }
        this.moveTowardCharacter();
        this.playAnimation(this.IMAGES_ATTACK);
    }

    walkingAnimation() {
        this.playAnimation(this.IMAGES_WALKING);
        if (!this.otherDirection) {
            this.moveLeft();
            if (this.x <= 2300) { // Grenze links
                this.otherDirection = true; // Richtung wechseln
            }
        } else {
            this.moveRight();
            if (this.x >= 2900) { // Grenze rechts
                this.otherDirection = false; // Richtung wechseln
            }
        }
    }

    deadAnimation() {
        clearInterval(this.endbossInterval);
        this.stopAllAnimations();
        let frameCount = 0;
        const deadInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_DEAD);
            frameCount++;
            if (frameCount >= 4 ) {
                clearInterval(deadInterval);
                this.loadImage("assets/img/4_enemie_boss_chicken/5_dead/G26.png");
                this.world.fightScene = false;
            }
        }, 500);
    
    }

    takeDamage(amount) {
        this.energy -= amount;
        if (this.energy <= 0){
            this.deadAnimation();
        };
        if (this.statusbar) {
            const percentage = (this.energy / 100) * 100;
            this.statusbar.setPercentage(percentage);
            audioList.endbossHurt.play();
            this.hurtAnimation();
        }
    }

    moveTowardCharacter() {
        if(!this.walkTowardsCharacter){
            if (this.world.character.x >= this.x){
                setTimeout(() => {
                    this.moveRight();
                    this.otherDirection = true;
                }, 1000); 
            } else {
                setTimeout(() => {
                    this.moveLeft();
                    this.otherDirection = false;
                }, 1000);
            };
            this.walkTowardsCharacter = true
        };
        setTimeout(() => {
            this.walkTowardsCharacter = false;
        }, 4000)
    }

    hit() {
        // if (this.isDead) return;
        this.isBeingHit = true;
    }
}
