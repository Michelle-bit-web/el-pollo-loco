class Character extends MovableObject {
    height = 250;
    constructor(){
       super().loadImage('../assets/img/2_character_pepe/2_walk/W-21.png');
       this.y = 440 - this.height
    }

    jump(){
        
    }
}