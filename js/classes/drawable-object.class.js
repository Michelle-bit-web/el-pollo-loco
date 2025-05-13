class DrawableObject {
  x = 10;
  y = 350;
  height = 200;
  width = 170;
  img;
  imageCache = {};
  currentImage = 0;
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
  
  loadImage(path) {
    this.img = new Image(); 
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

  //---später entfernen---

  // drawOffsetFrame(ctx) {
  //   if (this instanceof Character || this instanceof Chicken || this instanceof SmallChicken || this instanceof Endboss) {
  //     ctx.beginPath();
  //     ctx.lineWidth = "3";
  //     ctx.strokeStyle = "red";
  
  //     const offsetX = this.x + this.offset.left;
  //     const offsetY = this.y + this.offset.top;
  //     const offsetWidth = this.width - this.offset.left - this.offset.right;
  //     const offsetHeight = this.height - this.offset.top - this.offset.bottom;
  
  //     ctx.rect(offsetX, offsetY, offsetWidth, offsetHeight);
  //     ctx.stroke();
  //   }
  // }
}
