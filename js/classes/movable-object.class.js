class MovableObject {
    x = 10;
    y = 350;
    img;
    height = 200;
    width = 170;

    loadImage(path){
        this.img = new Image(); //alternative zu: doc.ElById('image') <img id="image">
        this.img.src = path;
    }

    moveRight(){
        console.log('Moving right');
    }

    moveLeft(){
        
    }
}