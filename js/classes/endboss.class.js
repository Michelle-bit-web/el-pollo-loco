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
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
    }
    
    animate() {
        this.endbossInterval = setInterval(() => {
            this.updateSpeedBasedOnEnergy();
    
            // if (this.isDead || this.energy <= 0) {
            //     this.deadAnimation();
            // } 
            if (this.isBeingHit) {
                this.hurtAnimation();
            }
            else if (this.firstContactCharacter && this.totalContacts > 10) {
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
    }

    updateSpeedBasedOnEnergy() {
        if (this.energy <= 50) {
            this.speed += 0.3;
            this.speedLevel = 2;
        }
        if (this.energy <= 25 && this.speedLevel == 2) {
            this.moveRight();
            // if(!this.isJumping) {
            //     this.jump();
            // };
        }; 
    }

    jump(){
        if (!this.isJumping) { // Verhindere mehrfaches Springen
            this.isJumping = true; // Setze den Sprungstatus
            this.speedY = 50; // Vertikalgeschwindigkeit nach oben
            this.applyGravity(); // Gravitation wirken lassen
    
            setTimeout(() => {
                this.isJumping = false; // Nach dem Sprungstatus zurücksetzen
            }, 1000); // Nach 1 Sekunde kann der Boss erneut springen
            this.moveTowardCharacter();
        }
    // checkFirstContact() {
    //     return this.world.character.x > 2100 && !this.firstContactCharacter;
    }

    handleFirstContact() {
        this.firstContactCharacter = true;
        this.statusbar = new Statusbar("energyEndboss", 500, 5);
        this.playAnimation(this.IMAGES_ALERT);
    }

    hurtAnimation(){
        this.playAnimation(this.IMAGES_HURT);
        this.isBeingHit = false;
    }

    attackAnimation(){
        this.moveTowardCharacter();
        this.playAnimation(this.IMAGES_ATTACK);
    }

    walkingAnimation() {
        this.playAnimation(this.IMAGES_WALKING);
    
        // Bewege den Boss basierend auf der Richtung
        if (!this.otherDirection) {
            this.moveLeft();
            if (this.x <= 2000) { // Grenze links
                this.otherDirection = true; // Richtung wechseln
            }
        } else {
            this.moveRight();
            if (this.x >= 2500) { // Grenze rechts
                this.otherDirection = false; // Richtung wechseln
            }
        }
    }

    deadAnimation(){
        this.playAnimation(this.IMAGES_DEAD);

        //---Timeout funktioniert nicht dazu---
    //    setTimeout(() => {
        clearInterval(this.endbossInterval);
    //     }   , 1000); // Warte 1 Sekunde, bevor die Funktion aufgerufen wird
    }

    takeDamage(amount) {
        this.energy -= amount;
        if (this.energy <= 0){
            this.deadAnimation();
        };
        if (this.statusbar) {
            const percentage = (this.energy / 100) * 100;
            // console.log("[DEBUG] Aktualisiere Statusbar auf:", percentage); // Debug-Ausgabe
            this.statusbar.setPercentage(percentage);
        }
        if (this.energy <= 0) {
            this.playAnimation(this.IMAGES_DEAD);
        } 
    }

    moveTowardCharacter() {
        if (this.world.character.x > this.x || this.world.character.x == this.x) {
            this.moveRight();
            this.otherDirection = true;
        } else {
            this.moveLeft();
            this.otherDirection = false;
        }
    }

    hit() {
        // if (this.isDead) return;
        this.isBeingHit = true;
    }
}