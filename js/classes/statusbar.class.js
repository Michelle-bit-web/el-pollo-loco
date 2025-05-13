class Statusbar extends DrawableObject{
    percentage = 0;
    bottle = 0;
    coins= 0;
    type;
    images;
    maxCoins = 16;
    maxBottles = 8;

    IMAGES_ENERGY = [
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
    ];
    IMAGES_COIN = [
        "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
        "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
        "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
        "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
        "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
        "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
    ];
    IMAGES_BOTTLE = [
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
    ];
    IMAGES_ENERGY_ENDBOSS = [
        "assets/img/7_statusbars/2_statusbar_endboss/orange/orange0.png",
        "assets/img/7_statusbars/2_statusbar_endboss/orange/orange20.png",
        "assets/img/7_statusbars/2_statusbar_endboss/orange/orange40.png",
        "assets/img/7_statusbars/2_statusbar_endboss/orange/orange60.png",
        "assets/img/7_statusbars/2_statusbar_endboss/orange/orange80.png",
        "assets/img/7_statusbars/2_statusbar_endboss/orange/orange100.png",
    ];

    constructor(type, x, y, world){
        super();
        this.world = world;
        this.x = x
        this.y = y;
        this.type = type;
        this.width = 200;
        this.height = 50;
        this.loadTypeImages();
        this.percentage = this.type === "energy" || this.type === "energyEndboss" ? 100 : 0;
        this.setPercentage(this.percentage);
    }

    loadTypeImages(){
        if(this.type == "energy"){
            this.images = this.IMAGES_ENERGY;
        }else if(this.type == "coin"){
            this.images = this.IMAGES_COIN;
        }else if(this.type == "bottle"){
            this.images = this.IMAGES_BOTTLE;
        }else if(this.type == "energyEndboss"){
            this.images = this.IMAGES_ENERGY_ENDBOSS;
        }
        this.loadImages(this.images);
    }

    draw(ctx){
        let path = this.images[this.resolveImageIndex()]; 
        this.img = this.imageCache[path];
        super.draw(ctx);
    }

    setPercentage(percentage){
        // console.log("[DEBUG] Neuer Percentage-Wert:", percentage);
        this.percentage = Math.max(0, Math.min(percentage, 100));
        let path = this.images[this.resolveImageIndex()];
        // console.log("[DEBUG] Bildpfad für Statusbar:", path);
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage > 0) return 1;
        return 0;
    }
}