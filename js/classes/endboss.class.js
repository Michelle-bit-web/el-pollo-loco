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

    //z.B. 
    // alert_sound = new Audio('audio/boss_intro_sound.mp3');
    // hurt_sound = new Audio('audio/chicken_hurt.mp3');
    // dead_sound = new Audio('audio/boss_dead.mp3');

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

    //---hier vllt Sounds definieren & prüfen, ob endboss auf AudioManager zugreifen kann
    // alert_sound = new AudioManager(src...);
    // hurt_sound = new AudioManager(src..);
    // dead_sound = new AudioManager(src);

    constructor(x){
        super().loadImage("assets/img/4_enemie_boss_chicken/1_walk/G1.png");
        this.x = x;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DIZY);
        this.loadImages(this.IMAGES_DEAD);
        // AudioManager.sounds.push(this.alert_sound, this.hurt_sound, this.dead_sound)
        this.animate();
    }
    
    animate() {
        this.animationIntervals.endbossInterval = setInterval(() => {
            this.updateSpeedBasedOnEnergy();
    
            // if (this.isDead || this.energy <= 0) {
            //     this.deadAnimation();
            // } 
            if (this.isBeingHit) {
                this.hurtAnimation();
            }
            else if (this.firstContactCharacter && this.totalContacts > 30) {
                this.attackAnimation();
            }
            else if (this.firstContactCharacter) {
                this.handleFirstContact();
                this.totalContacts++;
            } 
            else{
                this.walkingAnimation();
            }
        }, 100);
        //--müsste man doch dann so alles in intervals reinbekommen und mit this.stopAnimation o. stopAllanimations nutzen
        //habe aber auch ein Objekt dem Intervalle hinzugefügt werden können

        // this.animationIntervals[animationInterval]; 
        // addInterval(animationInterval);
    }

    handleFirstContact() {
        // AudioManager.backgroundMusicGeneral.stop(); wirft noch Fehler
        // AudioManager.chickenSound.stop(); 
        // this.firstContactCharacter = true; //is doch dann schon true??
        this.statusbar = new Statusbar("energyEndboss", 500, 5);
        this.x = 2500;
        this.playAnimation(this.IMAGES_ALERT);
        
        // this.world.controlEnabled = true;
    }

    // updateSpeedBasedOnEnergy() {
    //     if (this.energy <= 50) {
    //         this.speed += 0.3;
    //         this.speedLevel = 2;
    //     }
    //     if (this.energy <= 25 && this.speedLevel == 2) {
    //         this.moveRight();
    //         // if(!this.isJumping) {
    //         //     this.jump();
    //         // };
    //     }; 
    // }

    updateSpeedBasedOnEnergy() {
    if(this.energy <= 80){
       this.speed += 0.2;
       this.speedLevel = 2;
       this.moveTowardCharacter();
    }
    if (this.energy <= 40 && this.speedLevel == 2 && !this.isJumping) {
        setInterval(() => {
        this.jump(); // Endboss jumps once
        this.isJumping = true;
        }, 5000);
        this.moveTowardCharacter();
    } 
    // else {
    //     this.moveTowardCharacter(); // Continue attacking
    // }
}

    jump() {
    if (!this.isJumping) {
        this.isJumping = true;
        this.speedY = 30; // Sprunghöhe
        this.applyGravity();

        // Character wird in die Luft geworfen
        // if (this.world.character.isColliding(this)) {
        //     this.world.character.speedY = 20;
        // }
        setTimeout(() => {
            this.isJumping = false;
        }, 3000); // Nach 1 Sekunde kann der Boss erneut springen
    };
}

    onLand() {
         this.world.character.jump(35); 

    // Character wird bei Landung in die Luft geworfen
    // if (this.world.character.isColliding(this)) {
    //     this.world.character.jump(45); // Character springt
    // }
    }

    hurtAnimation(){
        if(this.isJumping && this.world.character.isAboveGround()){
            const dizyInterval = setInterval(() => {
                audioList.endbossHurt.play();
                this.playAnimation(this.IMAGES_DIZY);
                frameCount++;
                if (frameCount >= 6 ) { 
                    clearInterval(dizyInterval);
                }
           }, 500);
        }
        else{
            audioList.endbossHurt.play();
            this.playAnimation(this.IMAGES_HURT);
            this.isBeingHit = false;
        }
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
    
        // Bewege den Boss basierend auf der Richtung
        if (!this.otherDirection) {
            this.moveLeft();
            if (this.x <= 2100) { // Grenze links
                this.otherDirection = true; // Richtung wechseln
            }
        } else {
            this.moveRight();
            if (this.x >= 2700) { // Grenze rechts
                this.otherDirection = false; // Richtung wechseln
            }
        }
    }

    // deadAnimation(){
    //     this.playAnimation(this.IMAGES_DEAD);

    //     //---Timeout funktioniert nicht dazu---
    // //    setTimeout(() => {
    //     clearInterval(this.endbossInterval);
    //     this.world.fightScene = false;
    // //     }   , 1000); // Warte 1 Sekunde, bevor die Funktion aufgerufen wird
    // }

    deadAnimation() {
        clearInterval(this.endbossInterval);
        this.stopAllAnimations();

        let frameCount = 0; // Anzahl der Abspielungen der Animation

        const deadInterval = setInterval(() => {
        this.playAnimation(this.IMAGES_DEAD);
        frameCount++;
        if (frameCount >= 4 ) { // Animation 3 Sekunden lang
            clearInterval(deadInterval);
            this.loadImage("assets/img/4_enemie_boss_chicken/5_dead/G26.png");
            this.world.fightScene = false;
        }
    }, 1000); // Animation alle 500ms
   
}
    takeDamage(amount) {
        this.energy -= amount;
        if (this.energy <= 0){
            this.deadAnimation();
        };
        if (this.statusbar) {
            const percentage = (this.energy / 100) * 100;
            this.statusbar.setPercentage(percentage);
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
