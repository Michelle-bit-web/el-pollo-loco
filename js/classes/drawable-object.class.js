class DrawableObject {
  x = 10;
  y = 350;
  height = 200;
  width = 170;
  img;
  imageCache = {};
  currentImage = 0;

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
}
