class BackgroundObject extends MovableObject {
    height = 480;
    width = 720;
    constructor(imagePath, x, y, w, h){
        super().loadImage(imagePath);
        this.y = 0;
        this.x = x;
        if(w !== undefined && h !== undefined && y !== undefined){
            this.width = w;
            this.height = h;
            this.y = y;
        };
        if(imagePath === "assets/img/5_background/level-end/level-end-arrow.png"){
            console.log('Level-End geladen', { width: this.width, height: this.height });
        }
    }
}