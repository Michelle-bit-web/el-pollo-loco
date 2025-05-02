class Character extends MovableObject {
  height = 280;
  speed = 15;
  y = -80;
  state = 'alive'; // 'alive', 'dying', 'ripFall', 'done'
  isPlayingDyingAnimation = false; // Status für die Todesanimation
  ripY = 0;
  sombreroY = 0;
  sombreroX = 0;
  sombreroDirection = 1;
  dyingAnimationPlayed = false;

  IMAGES_SLEEPING = [
    "../assets/img/2_character_pepe/1_idle/long_idle/I-11.png",
    "../assets/img/2_character_pepe/1_idle/long_idle/I-12.png",
    "../assets/img/2_character_pepe/1_idle/long_idle/I-13.png",
    "../assets/img/2_character_pepe/1_idle/long_idle/I-14.png",
    "../assets/img/2_character_pepe/1_idle/long_idle/I-15.png",
    "../assets/img/2_character_pepe/1_idle/long_idle/I-16.png",
    "../assets/img/2_character_pepe/1_idle/long_idle/I-17.png",
    "../assets/img/2_character_pepe/1_idle/long_idle/I-18.png",
    "../assets/img/2_character_pepe/1_idle/long_idle/I-19.png",
    "../assets/img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  IMAGES_WALKING = [
    "../assets/img/2_character_pepe/2_walk/W-21.png",
    "../assets/img/2_character_pepe/2_walk/W-22.png",
    "../assets/img/2_character_pepe/2_walk/W-23.png",
    "../assets/img/2_character_pepe/2_walk/W-24.png",
    "../assets/img/2_character_pepe/2_walk/W-25.png",
    "../assets/img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "../assets/img/2_character_pepe/3_jump/J-31.png",
    "../assets/img/2_character_pepe/3_jump/J-32.png",
    "../assets/img/2_character_pepe/3_jump/J-33.png",
    "../assets/img/2_character_pepe/3_jump/J-34.png",
    "../assets/img/2_character_pepe/3_jump/J-35.png",
    "../assets/img/2_character_pepe/3_jump/J-36.png",
    "../assets/img/2_character_pepe/3_jump/J-37.png",
    "../assets/img/2_character_pepe/3_jump/J-38.png",
    "../assets/img/2_character_pepe/3_jump/J-39.png",
  ];
  IMAGES_HURT = [
    "../assets/img/2_character_pepe/4_hurt/H-41.png",
    "../assets/img/2_character_pepe/4_hurt/H-42.png",
    "../assets/img/2_character_pepe/4_hurt/H-43.png",
  ];
  IMAGES_DYING = [
    "../assets/img/2_character_pepe/5_dead/D-51.png",
    "../assets/img/2_character_pepe/5_dead/D-52.png",
    "../assets/img/2_character_pepe/5_dead/D-53.png",
    "../assets/img/2_character_pepe/5_dead/D-54.png",
    "../assets/img/2_character_pepe/5_dead/D-55.png",
    "../assets/img/2_character_pepe/5_dead/D-56.png",
    "../assets/img/2_character_pepe/5_dead/D-57.png",
  ];
  IMAGES_RIP = [
    "../assets/img/2_character_pepe/5_dead/rip.png",
    "../assets/img/2_character_pepe/5_dead/sombrero .png",
  ];

  world;
  offset = {
    top: 140,
    left: 50,
    right: 47,
    bottom: 20,
  };

  constructor() {
    super().loadImage("../assets/img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DYING);
    this.loadImages(this.IMAGES_RIP);
    this.animate();
    this.applyGravity();
  }

  animate() {
  this.animationIntervals['movement'] = setInterval(() => {
      if (this.world.keyboard.RIGHT && this.x < this.world.level.levelEndX) {
        this.moveRight();
        this.otherDirection = false;
        // this.walking_soung.play();
      }
      if (this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft();
        this.otherDirection = true;
        // this.walking_soung.play();
      }
      if (this.world.keyboard.SPACE && !this.isAboveGround()) {
        this.jump();
      }
      this.world.camera_x = -this.x + 100;
    }, 1000 / 30);

    this.animationIntervals['animation'] = setInterval(() => {
      if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          this.playAnimation(this.IMAGES_WALKING);
        }
      };
    }, 50);

    this.animationIntervals['dying'] = setInterval(() => {
      if(this.isDead()){
        this.stopAllAnimations("../assets/img/2_character_pepe/5_dead/rip.png");
      }
   });
  
  //     if (this.isDead() && !this.isPlayingDyingAnimation) {
  //         this.playDyingAnimation();
  //     } else if (this.isDead() && this.isPlayingDyingAnimation) {
  //         this.animateRIP();
  //     }
  // }, 100);
  }

//   playDyingAnimation() {
//     this.isPlayingDyingAnimation = true; // Animation starten
//     let i = 0;

//     const dyingInterval = setInterval(() => {
//         if (i < this.IMAGES_DYING.length) {
//             this.loadImage(this.IMAGES_DYING[i]); // Lade nacheinander die Bilder
//             i++;
//         } else {
//             clearInterval(dyingInterval); // Stoppe die Animation
//             this.startRIPAnimation(); // Starte RIP-Fallanimation
//         }
//     }, 200); // Zeitintervall zwischen den Bildern
// }

// //-----HIER NOCHMAL PRÜFEN-----

// startRIPAnimation() {
//   this.ripY = this.y + this.height; // Setze RIP auf die endgültige Position
//   this.sombreroX = this.x - 50; // Starte den Sombrero leicht links vom Charakter
//   this.sombreroY = 0; // Startposition des Sombreros oben
//   this.animateRIP(); // Starte die Animation
// }

// animateRIP() {
//   clearInterval(118);
//   const ripInterval = setInterval(() => {
//     // Zeichne das RIP-Bild fest
//     this.drawImage(this.IMAGES_RIP[0], this.x, this.ripY, 100, 100);

//     // Bewege das Sombrero-Bild (schwenkend nach links/rechts und nach unten)
//     if (this.sombreroY < this.ripY) {
//       this.sombreroY += 5; // Sombrero fällt nach unten
//       this.sombreroX += this.sombreroDirection * 2; // Schwenkbewegung
//       if (this.sombreroX <= this.x - 50 || this.sombreroX >= this.x + 50) {
//         this.sombreroDirection *= -1; // Richtung wechseln, wenn Grenze erreicht
//       }
//     } else {
//       this.sombreroY = this.ripY; // Stoppe die vertikale Bewegung
//       clearInterval(ripInterval); // Beende die Animation
//     }

//     // Zeichne das schwenkende Sombrero-Bild
//     this.drawImage(this.IMAGES_RIP[1], this.sombreroX, this.sombreroY, 80, 80);
//   }, 50); // Aktualisierung alle 50ms
// }

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
    // } else if (hittenObject instanceof CollectableObject) {
    //     if (hittenObject.imageType === "coin") {
    //         this.coins++;
    //         this.world.coinStatusbar.setPercentage(this.coins);
    //     } else if (hittenObject.imageType === "bottle" || hittenObject.imageType === "bottleGround") {
    //         this.bottles++;
    //         this.world.bottleStatusbar.setPercentage(this.bottles);
    //     }
    }
}
}
