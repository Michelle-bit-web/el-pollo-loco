class Statusbar extends DrawableObject{
    percentage = 100;
    bottle = 0;
    coins= 0;
    type;
    images;

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

    constructor(type, x, y){
        super();
        this.x = x
        this.y = y;
        this.type = type;
        this.width = 200;
        this.height = 50;
        this.loadTypeImages();
        // Initialwert je nach Typ setzen
        if (this.type === 'energy' || this.type === 'energyEndboss') {
            this.setPercentage(100);
        } else {
            this.setPercentage(0); // gilt für 'coin' und 'bottle'
        }
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
        let path = this.images[this.resolveImageIndex()]; //Da wird immer das aktuelle Bild geladen
        // console.log("[DEBUG] draw() wird ausgeführt. Bildpfad:", path);
        this.img = this.imageCache[path];
       super.draw(ctx);
    }

    setPercentage(percentage){
       
        if (this.type === 'bottle') {
            this.bottles = percentage;
        } else if (this.type === 'coin') {
            this.coins = percentage;
            // if(this.coins == 5){
            //     this.coins = 0;
            //     this.world.energyBar.percentage += 20;
            // }
        }else{
            this.percentage = percentage;
        }
        let path = this.images[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    //Hier nochmal die Max-Werte überlegen, damit man z.B. mehr Coins sammeln kann
    resolveImageIndex() {
        let value = this.type === 'energy' || this.type === 'energyEndboss' ? this.percentage : (this.type === 'coin' ? this.coins : this.bottles);
        if (value >= 100 || value === 5) return 5;
        else if (value >= 80 || value === 4) return 4;
        else if (value >= 60 || value === 3) return 3;
        else if (value >= 40 || value === 2) return 2;
        else if (value >= 20 || value === 1) return 1;
        else return 0;
    }
}