class BackgroundObject extends MovableObject {
    height = 420;
    width = 720;
    constructor(imagePath, x, y){
        super().loadImage(imagePath);
        this.y = y - this.height;
        this.x = x;
    }
}