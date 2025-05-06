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
  levelEndX = 3000;

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  stopAnimation(intervalType, path) {
    if (this.animationIntervals[intervalType]) {
        clearInterval(this.animationIntervals[intervalType]); // Stoppe das spezifische Intervall
        delete this.animationIntervals[intervalType]; // Entferne den Eintrag
    }
    if (path) {
        this.loadImage(path); // Setze ein statisches Bild (optional)
    }
}

stopAllAnimations(path) {
    // Stoppe alle gespeicherten Animationen
    for (let key in this.animationIntervals) {
        clearInterval(this.animationIntervals[key]);
        delete this.animationIntervals[key];
    }if (path) {
      this.loadImage(path); // Setze ein statisches Bild (optional)
  }
}

  jump() {
    this.speedY = 30;
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
    }, 1000 / 25);
  }

  isAboveGround() {
    if((this instanceof ThrowableObject)){
      return true
    }else{
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

  sleep(){}
}
