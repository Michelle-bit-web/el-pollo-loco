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

    loadImage(path){
        this.img = new Image(); //alternative zu: doc.ElById('image') <img id="image">
        this.img.src = path;
    }

    loadImages(arr){
        arr.forEach(path =>{
            let img = new Image();
            img.src = path; 
            this.imageCache[path] = img;
        });
    }

    moveRight(){
        console.log('Moving right');
    }

    moveLeft(){
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }
}