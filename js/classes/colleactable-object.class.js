class CollectableObject extends MovableObject{
    imageType;

    IMAGES_COIN = [
        "assets/img/8_coin/coin_1.png",
        "assets/img/8_coin/coin_2.png",
    ];

    IMAGE_BOTTLE = "assets/img/7_statusbars/3_icons/icon_salsa_bottle.png";
    
    IMAGE_BOTTLE_GROUND = [
        "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        "assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
    ];

    constructor(imageType, x, y){
        super();
        this.y = y;
        this.imageType = imageType;
        this.x = this.setXValue(x);
        this.getImageType();
    }

    setXValue(x){
        if (this.imageType === 'bottleGround') {
            return x + Math.random()*300;
        } else {
          return x;
        }
    }

    getImageType(){
        if(this.imageType == "coin"){
            this.setSize(130, 130);
            this.loadImages(this.IMAGES_COIN);
            this.loadImage(this.IMAGES_COIN[0]);
            this.animate();
        } else if(this.imageType == "bottle"){
            this.setSize(70, 70);
            this.loadImage(this.IMAGE_BOTTLE);
        }else if(this.imageType == "bottleGround"){
            this.setSize(70, 70);
            this.loadImage(this.IMAGE_BOTTLE_GROUND[0]);
        }
    }

    setSize(height, width){
        this.height = height;
        this.width = width;
    }
    animate(){
        setInterval(() => {
            this.playAnimation(this.IMAGES_COIN)
        }, 400)
    }
}