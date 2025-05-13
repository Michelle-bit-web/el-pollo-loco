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
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  automaticMovement(targetX, callback) {
    const interval = setInterval(() => {
        if (this.x < targetX) {
            this.moveRight();
        } else {
            clearInterval(interval);
            callback();
        }
    }, 800);
  }

  stopMoving() {
        this.speed = 0;     
        this.speedY = 0;
    }
  
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  stopAnimation(intervalType, path) {
    if (this.animationIntervals[intervalType]) {
        clearInterval(this.animationIntervals[intervalType]); 
        delete this.animationIntervals[intervalType]; // Entferne den Eintrag
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
   if(higherJump == undefined){
     this.speedY = 30;
   }else{
    this.speedY = higherJump;
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
  
  applyGravity() {
   this.gravityInterval = setInterval(() => {
      if(this.isSplashing) return;
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration; 
      }
      if(this instanceof Chicken || this instanceof SmallChicken){
        this.y -= this.speedY;
        this.speedY -= this.acceleration; 
      }
      // Endboss landet 30px höher als der Boden
        if (this instanceof Endboss && this.y > 120) { 
            this.y = 120; // Setze Endboss auf höhere Bodenposition
            this.speedY = 0; // Beende Gravitation
            this.onLand(); // Trigger für Landung
        }
    }, 1000 / 25);
  }

  isAboveGround() {
    if((this instanceof ThrowableObject)){
      return true
    } 
    if (this instanceof Endboss) {
        return this.y < 120; // Endboss landet 30px höher
    } else{
      return this.y < 150;
    }
    
  }
  
  changeEnergy(){
      if(this.energy == 0){
        this.isDead();
       }else{
         this.energy -= 5;
         this.lastHit = new Date().getTime();
       }
  }

  isHurt(){
    let timepassed = new Date().getTime() - this.lastHit; //miliseconds
    timepassed = timepassed / 1000 //time in seconds
    return timepassed < 1;
  }

  isDead(){
    return this.energy == 0;
  }

}
