class MovableObject extends DrawableObject{
  speed = 0.4;
  otherDirection = false;
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
  energy = 100;
  lastHit = 0;
  
  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }
//Das könnte als höherer Schwierigkeitsgrad beim Münzen sammeln sein
//Diese Funktion eher fürs Münzen sammeln? Für enemy eher ein "oder"
  drawOffsetFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "red";
  
      const offsetX = this.x + this.offset.left;
      const offsetY = this.y + this.offset.top;
      const offsetWidth = this.width - this.offset.left - this.offset.right;
      const offsetHeight = this.height - this.offset.top - this.offset.bottom;
  
      ctx.rect(offsetX, offsetY, offsetWidth, offsetHeight);
      ctx.stroke();
    }
  }

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

  jump() {
    this.speedY = 30;
  }
  
  //hier werden auch die Hühner berücksichtigt
  isColliding(mo){
    return this.x + this.width > mo.x &&
    this.y + this.height > mo.y
    && this.x < mo.x 
    && this.y < mo.y + mo.height;
  }

//Hier reagiert es nicht auf den Endboss
  // isColliding(mo){
  //      return (this.x + this.width - this.offset.right) >= (mo.x  + mo.offset.left) && 
  //      (this.x + this.offset.left) <= (mo.x + mo.width - mo.offset.right) && 
  //      (this.y + this.height - this.offset.bottom ) >= (mo.y + mo.offset.top) &&
  //      (this.y + this.offset.top) <= (mo.y + mo.height - mo.offset.bottom) 
  //   }

  hit(){
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
