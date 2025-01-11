// js/scenes/Menu.js
export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        this.add.image(640, 360, 'background');
        
        const startButton = this.add.text(640, 700, 'Start Game', {
            fontSize: '32px',
            fill: '#fff'
        })
        .setOrigin(0.5)
        .setInteractive();

        startButton.on('pointerdown', () => {
            this.scene.start('BattleScene');
        });
    }
}