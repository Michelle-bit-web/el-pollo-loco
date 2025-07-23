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
    if (this.fadeOutOpacity !== undefined) {
      ctx.globalAlpha = this.fadeOutOpacity;
    };
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    ctx.globalAlpha = 1.0;
  }
}
