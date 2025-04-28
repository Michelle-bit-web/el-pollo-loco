class Statusbar extends DrawableObject{
    percentage = 100;
    type;
    images;

    IMAGES_ENERGY = [
        "../assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
        "../assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
        "../assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
        "../assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
        "../assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
        "../assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
    ];
    IMAGES_COIN = [
        "../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
        "../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
        "../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
        "../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
        "../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
        "../assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
    ];
    IMAGES_BOTTLE = [
        "../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
        "../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
        "../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
        "../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
        "../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
        "../assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
    ];

    constructor(type, x, y){
        super();
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 200;
        this.height = 50;
        this.loadTypeImages();
        this.setPercentage(100);
    }

    loadTypeImages(){
        if(this.type == "energy"){
            this.images = this.IMAGES_ENERGY;
        }else if(this.type == "coin"){
            this.images = this.IMAGES_COIN;
        }else if(this.type == "bottle"){
            this.images = this.IMAGES_BOTTLE;
        };
        this.loadImages(this.images);
    }

    setPercentage(percentage){
        this.percentage = percentage;
        let path = this.images[this.resolveImageIndex()]
        this.img = this.imageCache[path];
    }
    
        resolveImageIndex(){
            if(this.percentage == 100){
            return 5
            } else if(this.percentage >= 80){
                return 4
            }else if(this.percentage >= 60){
                return 3
            }else if(this.percentage >= 40){
                return 2
            }else if(this.percentage >= 20){
                return 1
            }else{
                return 0
            }
        }
}