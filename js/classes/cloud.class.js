class Cloud  extends MovableObject {
    y = 50;
    width = 450;

    constructor(){
        super().loadImage('assets/img/5_background/layers/4_clouds/1.png');
        this.x = Math.random()*500;
        this.animate();
    }

    animate(){
        setInterval(() => {
            this.x -= 0.4;
        }, 1000 / 60);
        
    }
}
