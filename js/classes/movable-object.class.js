class MovableObject extends DrawableObject{
  speed = 0.4;
  otherDirection = false;
  speedY = 0;
  acceleration = 3;
  energy = 100;
  coins = 0;
  bottles = 0;
  lastHit = 0;
  animationIntervals = {};
  levelEndX = 3800;

  moveRight() {
    if (!controlEnabled) return;
    this.x += this.speed;
  }

  moveLeft() {
    if (!controlEnabled) return;
    this.x -= this.speed;
  }

  stopMoving() { 
    this.speed = 0;     
    this.speedY = 0;
  }
  
  playAnimation(images) {
    if (!controlEnabled) return;
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  //Die Animationen-Stop_Methode nochmal genau anschauen
  //Kann man ja dann selektiv nutzen z.B. nur für Character, nur für Endboss usw.
  stopAnimation(intervalType, path) {
    if (this.animationIntervals[intervalType]) {
      clearInterval(this.animationIntervals[intervalType]); 
      delete this.animationIntervals[intervalType];
    }
    if (path) {
      this.loadImage(path);
    }
  }

  stopAllAnimations(path) {
    for (let key in this.animationIntervals) {
      clearInterval(this.animationIntervals[key]);
      delete this.animationIntervals[key];
    };
    clearInterval(this.endbossInterval); 
    if (path) {
      this.loadImage(path); 
    }
  }

  jump(higherJump) {
    if (!controlEnabled) return;
    if(higherJump == undefined){
     this.speedY = 30;
    } else{
      this.speedY = higherJump;
    }
  }

  applyGravity() {
    this.gravityInterval = setInterval(() => {
      if(this.isSplashing) return;
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration; 
      } else if (this instanceof ThrowableObject && !this.isSplashing) {
        this.y = 350;
        this.splash();
      }
      if(this instanceof Chicken || this instanceof SmallChicken){
        this.y -= this.speedY;
        this.speedY -= this.acceleration; 
      }
      if (this instanceof Endboss && this.y > 120) { 
        this.y = 120;
        this.speedY = 0;
        this.onLand();
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if((this instanceof ThrowableObject)){
      return this.y < 350;
    } 
    if (this instanceof Endboss) {
      return this.y < 120;
    } else{
      return this.y < 150;
    }
  }
  
  isColliding(mo) {
    const offsetX = this.x + this.offset.left;
    const offsetY = this.y + this.offset.top;
    const offsetWidth = this.width - this.offset.left - this.offset.right;
    const offsetHeight = this.height - this.offset.top - this.offset.bottom;
  
    const moOffsetX = mo.x + mo.offset.left;
    const moOffsetY = mo.y + mo.offset.top;
    const moOffsetWidth = mo.width - mo.offset.left - mo.offset.right;
    const moOffsetHeight = mo.height - mo.offset.top - mo.offset.bottom;
  
    return offsetX + offsetWidth > moOffsetX &&
    offsetY + offsetHeight > moOffsetY &&
    offsetX < moOffsetX + moOffsetWidth &&
    offsetY < moOffsetY + moOffsetHeight;
  }

  takeDamage(damage) {
    if (!controlEnabled) return;
    if(this.isHurt()){
      return;
    }
    this.energy = Math.max(0, this.energy - damage); 
    this.updateStatusbar("energy");
    this.lastHit = new Date().getTime();
    if (this.energy == 0) {
      this.isDead();
    }
  }

  recoverEnergy(amount) {
    this.energy = Math.min(100, this.energy + amount);
    this.updateStatusbar("energy");
  }

  isHurt(){
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  isDead(){
    return this.energy <= 0;
  }

  collectCoin() {
    this.coins++;
    this.updateStatusbar("coin");
    if (this.coins >= this.world.coinStatusbar.maxCoins) {
      this.recoverEnergy(20);
      this.coins = 0;
      this.updateStatusbar("coin");
      audioList.energyRecovery.play();
    } else{
      audioList.coinCollected.play();
    }
  }

  collectBottle() {
    this.bottles++;
    this.updateStatusbar("bottle");
    audioList.bottleCollected.play();
  }

  updateStatusbar(type) {
    if (type === "energy") {
      this.world.energyStatusbar.setPercentage(this.energy);
    } else if (type === "coin") {
      const coinPercentage = (this.coins / this.world.coinStatusbar.maxCoins) * 100;
      this.world.coinStatusbar.setPercentage(coinPercentage);
    } else if (type === "bottle") {
      const bottlePercentage = (this.bottles / this.world.bottleStatusbar.maxBottles) * 100;
      this.world.bottleStatusbar.setPercentage(bottlePercentage);
    }
  }
}
