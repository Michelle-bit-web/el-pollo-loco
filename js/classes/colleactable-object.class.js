class CollectableObject extends MovableObject{
    imageType;

    IMAGES_COIN = [
        "../assets/img/8_coin/coin_1.png",
        "../assets/img/8_coin/coin_2.png",
    ];
    IMAGE_BOTTLE = "../assets/img/7_statusbars/3_icons/icon_salsa_bottle.png";

    constructor(imageType, x, y){
        super();
        this.y = y;
        this.x = x;
        this.imageType = imageType;
        this.getImageType();
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
        }
    }

    setSize(height, width){
        this.height = height;
        this.width = width;
    }
    animate(){
        setInterval(() => {
            this.playAnimation(this.IMAGES_COIN)
        }, 500)
    }
}