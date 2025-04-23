class MoveableObject {
    x = 10;
    y = 20;
    img;
    height = 200;
    width = 60;

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