class Cloud  extends MovableObject {
   width = 450;
   
    constructor(x, y, speed){
        super().loadImage('assets/img/5_background/layers/4_clouds/1.png');
            this.speed = speed;
            this.x = x; 
            this.y = y; 
        
        this.animate();
    }

    animate(){
        setInterval(() => {
            this.moveLeft();
        }, 100)
    }}
