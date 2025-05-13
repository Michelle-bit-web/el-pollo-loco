class Character extends MovableObject {
  height = 280;
  speed = 15;
  y = -80;
  state = "alive"; // 'alive', 'dying', 'ripFall', 'done'
  isPlayingDyingAnimation = false; // Status für die Todesanimation
  ripY = 0;
  sombreroY = 0;
  sombreroX = 0;
  sombreroDirection = 1;
  dyingAnimationPlayed = false;

  IMAGES_IDLE = [
    "assets/img/2_character_pepe/1_idle/idle/I-1.png",
   "assets/img/2_character_pepe/1_idle/idle/I-2.png",
   "assets/img/2_character_pepe/1_idle/idle/I-3.png",
   "assets/img/2_character_pepe/1_idle/idle/I-4.png",
   "assets/img/2_character_pepe/1_idle/idle/I-5.png",
   "assets/img/2_character_pepe/1_idle/idle/I-6.png",
   "assets/img/2_character_pepe/1_idle/idle/I-7.png",
   "assets/img/2_character_pepe/1_idle/idle/I-8.png",
   "assets/img/2_character_pepe/1_idle/idle/I-9.png",
   "assets/img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_IDLE_LONG = [
    "assets/img/2_character_pepe/1_idle/long_idle/I-11.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-12.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-13.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-14.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-15.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-16.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-17.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-18.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-19.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];


  IMAGES_WALKING = [
    "assets/img/2_character_pepe/2_walk/W-21.png",
    "assets/img/2_character_pepe/2_walk/W-22.png",
    "assets/img/2_character_pepe/2_walk/W-23.png",
    "assets/img/2_character_pepe/2_walk/W-24.png",
    "assets/img/2_character_pepe/2_walk/W-25.png",
    "assets/img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "assets/img/2_character_pepe/3_jump/J-31.png",
    "assets/img/2_character_pepe/3_jump/J-32.png",
    "assets/img/2_character_pepe/3_jump/J-33.png",
    "assets/img/2_character_pepe/3_jump/J-34.png",
    "assets/img/2_character_pepe/3_jump/J-35.png",
    "assets/img/2_character_pepe/3_jump/J-36.png",
    "assets/img/2_character_pepe/3_jump/J-37.png",
    "assets/img/2_character_pepe/3_jump/J-38.png",
    "assets/img/2_character_pepe/3_jump/J-39.png",
  ];
  IMAGES_HURT = [
    "assets/img/2_character_pepe/4_hurt/H-41.png",
    "assets/img/2_character_pepe/4_hurt/H-42.png",
    "assets/img/2_character_pepe/4_hurt/H-43.png",
  ];
  IMAGES_DYING = [
    "assets/img/2_character_pepe/5_dead/D-51.png",
    "assets/img/2_character_pepe/5_dead/D-52.png",
    "assets/img/2_character_pepe/5_dead/D-53.png",
    "assets/img/2_character_pepe/5_dead/D-54.png",
    "assets/img/2_character_pepe/5_dead/D-55.png",
    "assets/img/2_character_pepe/5_dead/D-56.png",
    "assets/img/2_character_pepe/5_dead/D-57.png",
  ];
  IMAGES_RIP = ["assets/img/2_character_pepe/5_dead/rip.png", "assets/img/2_character_pepe/5_dead/sombrero.png"];

  offset = {
    top: 140,
    left: 45,
    right: 47,
    bottom: 13,
  };

  constructor(world) {
    super().loadImage("assets/img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_IDLE_LONG);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DYING);
    this.loadImages(this.IMAGES_RIP);
    this.world = world;
    this.animate();
    this.applyGravity();
    this.lastTimeMoved = new Date().getTime();
  }

  animate() {
    this.animationIntervals["movement"] = setInterval(() => {

      //Move right
      if (this.world.keyboard.RIGHT && this.x < this.world.level.levelEndX) {
        this.moveRight();
        this.otherDirection = false;
        // this.walking_sound.play();
        this.lastTimeMoved = new Date().getTime(); 
      }
      //Move left
      if (this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft();
        this.otherDirection = true;
        // this.walking_sound.play();
        this.lastTimeMoved = new Date().getTime(); 
      }
      //Jumping
      if (this.world.keyboard.SPACE && !this.isAboveGround()) {
        this.jump();
        // this.jumping_sound.play();
        this.lastTimeMoved = new Date().getTime(); 
      }
      //Camera focus on character
      if(!this.world.fightScene){
        this.world.camera_x = -this.x + 100;
      }
    }, 1000 / 30);

    //Imgage for different animation types
    this.animationIntervals["animation"] = setInterval(() => {
      if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
         // this.hurt_sound.play();

      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);

      } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          this.playAnimation(this.IMAGES_WALKING);
          // this.world.gameSounds.walkingSound.audio.play();

        } else if (this.checkMovementStatus()){
         this.playIdleAnimation();
        }
        else {
        // Kein Input → Default-Bild anzeigen
        this.loadImage("assets/img/2_character_pepe/2_walk/W-21.png");
      }
    }, 200);

    this.animationIntervals["dying"] = setInterval(() => {
      if (this.isDead()) {
        this.isPlayingDyingAnimation = true;
        this.world.gameSounds.characterDead.audio.play();
        this.handleRipanimation();
      }
      if(this.isPlayingDyingAnimation){
        clearInterval(this.animationIntervals["dying"]);
        AudioManager.sounds.forEach(sound => sound.stop());
      }
    }, 1000 / 30);
    
  }

  handleRipanimation(){
    if(this.otherDirection) {this.otherDirection = false}
        this.stopAllAnimations("assets/img/2_character_pepe/5_dead/rip.png");
        this.height = 120; // Höhe des RIP-Bildes
        this.width = 70;
        this.y = 0; // Setze die Y-Position auf 0, damit es am oberen Bildschirmrand erscheint
        const fallInterval = setInterval(() => {
          if (this.y + this.height < 420) {
            this.y += 5;
          } else {
            clearInterval(fallInterval);
            this.world.gameSounds.onLandingSound.audio.play();
          }
        }, 1000 / 60);
        this.world.gameSounds.onLandingSound.audio.stop();
    }
  
  checkMovementStatus(){
    return !this.world.keyboard.RIGHT && 
    !this.world.keyboard.LEFT && 
    !this.world.keyboard.SPACE && 
    !this.world.keyboard.THROW;
  }

  playIdleAnimation() {
    let pastTime = new Date().getTime() - this.lastTimeMoved;
    pastTime = pastTime / 1000; 
    if (pastTime < 9) {
      this.playAnimation(this.IMAGES_IDLE);
      //here a sound
    } else if( pastTime >= 9){
      this.playAnimation(this.IMAGES_IDLE_LONG);
      //here a sound
    }
  }

  drawImage(imagePath, x, y, width, height) {
    const img = new Image();
    img.src = imagePath;
    img.onload = () => {
      this.ctx.drawImage(img, x, y, width, height);
    };
  }

  hit(hittenObject) {
    if (hittenObject instanceof Chicken || hittenObject instanceof SmallChicken || hittenObject instanceof Endboss) {
      this.changeEnergy();
    }
  }
}
