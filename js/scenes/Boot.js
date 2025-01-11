// js/scenes/Boot.js

//在该sense中加载资源，被i俺家到
export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // 加载资源
        //this.load.image('cardBack', 'https://labs.phaser.io/assets/cards/back.png');
        this.load.image('background', 'https://labs.phaser.io/assets/skies/space3.png');
        this.load.image('cardBack', 'assets/cards/card_back.png');
        //this.load.image('background','assets/ui/background_start.png');
        //this.load.image('background_battle','assets/ui/background_battle.png');
        this.load.image('background_battle','https://labs.phaser.io/assets/skies/space3.png');
        //this.load.image('cardFront', 'assets/cards/card_fire.png');  // 如果你有正面卡牌图片
        this.load.audio('attackSound', 'assets/audio/attack.wav');  // 如果你想添加音效

        this.load.image('a', 'assets/cards/card_A.png');
        this.load.image('b', 'assets/cards/card_B.png');
        this.load.image('c', 'assets/cards/card_C.png');
        this.load.image('d', 'assets/cards/card_D.png');
        this.load.image('e', 'assets/cards/card_E.png');
    }

    create() {
        this.scene.start('MenuScene');
    }
}