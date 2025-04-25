class MovableObject {
  x = 10;
  y = 350;
  img;
  height = 200;
  width = 170;
  speed = 0.4;
  currentImage = 0;
  imageCache = {};
  otherDirection = false;
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }

  loadImage(path) {
    this.img = new Image(); //alternative zu: doc.ElById('image') <img id="image">
    this.img.src = path;
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

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
  
  // isColliding(mo){
  //   return this.x + this.width > mo.x &&
  //   this.y + this.height > mo.y
  //   && this.x < mo.x 
  //   && this.y < mo.y + mo.height;
  // }

  isColliding(mo){
       return (this.x + this.width - this.offset.right) >= (mo.x  + mo.offset.left) && 
       (this.x + this.offset.left) <= (mo.x + mo.width - mo.offset.right) && 
       (this.y + this.height + this.offset.top ) >= (mo.y + mo.y + mo.offset.top) &&
       (this.y + this.offset.top) <= (mo.y + mo.height - mo.offset.bottom) 
    }
}
