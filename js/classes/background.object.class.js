class BackgroundObject extends MovableObject {
    height = 420;
    width = 720;
    constructor(imagePath, x){
        super().loadImage(imagePath);
        this.y = 480 - this.height;
        this.x = x;
    }
}