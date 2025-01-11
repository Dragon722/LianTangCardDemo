// js/scenes/Battle.js
import { Deck } from '../objects/Deck.js';
import { Card } from '../objects/Card.js';

export class BattleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BattleScene' });
        this.playerHand = [];
        this.opponentHand = [];
        this.playerHealth = 5;
        this.opponentHealth = 5;
        this.selectedCards = [];  // 存储被选中的卡牌
    }

    create() {

        // 创建牌库
        this.playerDeck = new Deck();
        this.opponentDeck = new Deck();

        // 添加背景
        this.add.image(640, 360, 'background');

        // 添加健康值显示
        this.createHealthDisplays();

        // 显示牌库数量
        this.createDeckCountDisplay();

        // 初始抽牌（比如各抽5张）
        this.initialDraw();

        // 创建出牌按钮
        this.createPlayCardButton();

        // 添加回合结束按钮
        this.createEndTurnButton();
    }

    // 创建健康值显示
    createHealthDisplays() {
        // 玩家血量显示
        this.add.text(50, 600, 'Player HP:', { fontSize: '24px', fill: '#fff' });
        this.playerHealthText = this.add.text(50, 650, this.playerHealth.toString(), {
            fontSize: '24px',
            fill: '#fff'
        });

        // 对手血量显示
        this.add.text(50, 150, 'Opponent HP:', { fontSize: '24px', fill: '#fff' });
        this.opponentHealthText = this.add.text(50, 100, this.opponentHealth.toString(), {
            fontSize: '24px',
            fill: '#fff'
        });
    }

    // 创建牌库数量显示
    createDeckCountDisplay() {
        this.playerDeckText = this.add.text(1100, 500, `Deck: ${this.playerDeck.getCardsCount()}`, {
            fontSize: '20px',
            fill: '#fff'
        });
        this.opponentDeckText = this.add.text(1100, 200, `Deck: ${this.opponentDeck.getCardsCount()}`, {
            fontSize: '20px',
            fill: '#fff'
        });
    }

    // 初始抽牌
    initialDraw() {
        // 双方各抽5张牌
        for (let i = 0; i < 5; i++) {
            this.drawCard('player');
            this.drawCard('opponent');
        }
    }

    drawCard(player) {
        const deck = player === 'player' ? this.playerDeck : this.opponentDeck;
        const hand = player === 'player' ? this.playerHand : this.opponentHand;
        const card = deck.drawCard();
        
        if (card) {
            //const x = 300 + hand.length * 100; //计算卡牌的x坐标
            const deckX = 1100;  // 初始位置（在界面最右侧）
            const y = player === 'player' ? 600 : 120;
            
            const cardSprite = new Card(this, deckX, y, card);

            if (player === 'opponent') {
                cardSprite.cardSprite.setTexture('cardBack');
                cardSprite.cardSprite.setAngle(180);
                cardSprite.faceUp = false;
                cardSprite.cardSprite.cardData = cardSprite;
            }


            hand.push(cardSprite);
            
            // 更新牌库显示
            this.updateDeckCount(player);

            // 更新手牌位置
            this.rearrangeHand(player);
        }
    }
    // 重新排列手牌
    rearrangeHand(player) {
        const hand = player === 'player' ? this.playerHand : this.opponentHand;
        const cardWidth = 90;  // 缩放后的卡牌宽度
        const spacing = 100;   // 卡牌间距
        const totalWidth = (hand.length - 1) * spacing;  // 总宽度
        const startX = 640 - (totalWidth / 2);  // 居中起始位置（640是画面中心）
    
        // 为每张卡牌设置新位置
        hand.forEach((card, index) => {
            const newX = startX + (index * spacing);
            
            // 使用补间动画移动卡牌
            this.tweens.add({
                targets: card.cardSprite,
                x: newX,
                y: card.selected ? card.originalY - 30 : card.originalY,   // 如果卡牌被选中，保持抬起状态
                duration: 300,
                ease: 'Power2'
            });
    
            // 更新卡牌的原始Y坐标
            if (card.cardData) {
                card.cardData.originalY = card.cardData.originalY;
            }
        });
    }
    // 更新牌库剩余数量
    updateDeckCount(player) {
        const deck = player === 'player' ? this.playerDeck : this.opponentDeck;
        const text = player === 'player' ? this.playerDeckText : this.opponentDeckText;
        text.setText(`Deck: ${deck.getCardsCount()}`);
    }

    
/*
    // 切换卡牌状态（在选中与未选中之间切换）
    toggleCardSelection(card) {
        if (!card.cardData.selected) {
            // 选中卡牌
            card.cardData.selected = true;
            card.setTint(0x00ff00);  // 设置绿色高亮
            // 上移卡牌
            this.tweens.add({
                targets: card,
                y: card.cardData.originalY - 30,
                duration: 200
            });
            this.selectedCards.push(card);
        } else {
            // 取消选中
            card.cardData.selected = false;
            card.clearTint();
            // 恢复位置
            this.tweens.add({
                targets: card,
                y: card.cardData.originalY,
                duration: 200
            });
            // 从选中列表中移除
            const index = this.selectedCards.indexOf(card);
            console.log(index);
            if (index > -1) {
                this.selectedCards.splice(index, 1);
            }
        }
    }
    
    // 切换卡牌显示面
    toggleCardFace(card) {
        if (card.cardData.faceUp) {
            card.setTexture('cardBack');
            card.setAngle(180);
            card.cardData.faceUp = false;
        } else {
            card.setTexture(card.cardType);
            card.setAngle(0);
            card.cardData.faceUp = true;
        }
    }
*/

    // 添加出牌按钮
    createPlayCardButton() {
        const playCardButton = this.add.text(1100, 500, 'Play Cards', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#444',
            padding: { x: 10, y: 5 }
            })
            .setInteractive()
            .on('pointerdown', () => {
                this.playSelectedCards();
            })
            .on('pointerover', () => {
                playCardButton.setStyle({ fill: '#ff0' });
            })
            .on('pointerout', () => {
                playCardButton.setStyle({ fill: '#fff' });
            });
        const notResistantButton = this.add.text(1100, 550, 'Skip', { 
            fontSize: '28px', 
            fill: '#fff' ,
            backgroundColor: '#444',
            padding: { x: 10, y: 5 }
            })
            .setInteractive()
            .on('pointerdown', () => {
                this.skipAttack();
            })
            .on('pointerover', () => {
                notResistantButton.setStyle({ fill: '#ff0' });
            })
            .on('pointerout', () => {
                notResistantButton.setStyle({ fill: '#fff' });
            });
    }

    createEndTurnButton() {
        const endTurnButton = this.add.text(1100, 360, 'End Turn', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#444',
            padding: { x: 10, y: 5 }
        })
        .setInteractive()
        .on('pointerdown', () => {
            this.endTurn();
        })
        .on('pointerover', () => {
            endTurnButton.setStyle({ fill: '#ff0' });
        })
        .on('pointerout', () => {
            endTurnButton.setStyle({ fill: '#fff' });
        });
    }


    // 玩家出牌后的伤害计算逻辑与游戏行为
    playSelectedCards() {
        const cardsCount = this.selectedCards.length;
        if (cardsCount < 2) {
            // 显示提示：至少需要2张牌
            this.showMessage('Need at least 2 cards!');
            return;
        }


        // 检查所有选中的卡牌是否为同一类型
        const firstCardType = this.selectedCards[0].cardData.cardType;
        const allSameType = this.selectedCards.every(card => card.cardData.cardType === firstCardType);

        if (!allSameType) {
            // 显示提示：只能选择相同类型的卡牌
            this.showMessage('All selected cards must be of the same type!');
            return;
        }


        // 将选中的卡牌亮出，放在屏幕中
        this.selectedCards.forEach(card => {
            this.tweens.add({
                targets: card.cardSprite,
                y: 300,  // 将卡牌放在屏幕中间
                duration: 300,
                ease: 'Power2'
            });
        });

        // 进入防御环节
        this.enterDefensePhase();

 /*       
        // 计算伤害：每2张牌造成1点伤害，向下取整
        const damage = Math.floor(cardsCount / 2);
        
        // 扣除对手血量
        this.opponentHealth -= damage;
        this.opponentHealthText.setText(this.opponentHealth.toString());

        // 移除使用的卡牌
        this.selectedCards.forEach(card => {
            this.tweens.add({
                targets: card,
                y: 120,
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    const index = this.playerHand.indexOf(card);
                    if (index > -1) {
                        this.playerHand.splice(index, 1);
                    }
                    card.destroy();
                }
            });
        });

        // 显示伤害
        this.showDamage(damage, 300);

        // 清空选中的卡牌
        this.selectedCards = [];

        // 检查游戏是否结束
        this.checkGameOver();

*/
    }

    // 跳过玩家此次攻击
    skipAttack() {
        // 进入对方的攻击环节
        this.enterOpponentAttackPhase();
    }


    // 进入对方的防御环节
    enterDefensePhase() {
        // 显示提示：对方进入防御环节
        this.showMessage('Opponent\'s defense phase!');
    
        // 等待对方选择防御卡牌
        // 这里可以添加对方选择防御卡牌的逻辑
        // 假设对方选择了三张防御卡牌
        const opponentDefenseCards = this.opponentHand.slice(0, 3);
    

        // 在我方视角显示对手防御牌的正面
        opponentDefenseCards.forEach(defenseCard => {
            defenseCard.toggleCardFace();
        });

        // 检查防御卡牌是否能够克制攻击卡牌
        let damageBlocked = 0;
        const attackCard = this.selectedCards[0].cardData;
        opponentDefenseCards.forEach(defenseCard => {
            console.log(defenseCard); // 打印 defenseCard 对象
            if (this.canCounter(defenseCard.cardSprite.cardData.cardType, attackCard.cardType)) {
                damageBlocked++;
            }
        });
        
    
        // 计算最终伤害
        const cardsCount = this.selectedCards.length;
        const damage = Math.floor(cardsCount - 1) - damageBlocked;
        console.log(damage);
    
        // 扣除对手血量
        this.opponentHealth -= Math.max(damage, 0);
        this.opponentHealthText.setText(this.opponentHealth.toString());
    
        // 移除使用的卡牌
        this.selectedCards.forEach(card => {
            this.tweens.add({
                targets: card.cardSprite,
                y: 120,
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    const index = this.playerHand.indexOf(card.cardData);
                    if (index > -1) {
                        this.playerHand.splice(index, 1);
                    }
                    card.cardData.destroy();
                }
            });
        });
    

        // 显示伤害
        this.showDamage(damage, 300);

        // 清空选中的卡牌
        this.selectedCards = [];

        // 检查游戏是否结束
        this.checkGameOver();
    
        // 进入对方的攻击环节
        this.enterOpponentAttackPhase();
    }
    
    canCounter(defenseType, attackType) {
        const counterRules = {
            'a': 'e',
            'b': 'a',
            'c': 'b',
            'd': 'c',
            'e': 'd'
        };
        return counterRules[defenseType] === attackType;
    }


    // 进入对方的攻击环节
    enterOpponentAttackPhase() {
        // 显示提示：对方的攻击环节
        this.showMessage('Opponent\'s attack phase!');

        // 这里可以添加人机攻击的逻辑
        // (1) 假设对方选择了前面三张攻击卡牌
        //this.opponentSelectedCards = this.opponentHand.slice(0, 3);

        // (2) 选择数量最多的卡牌出牌
        // 统计每种类型卡牌的数量
        const cardTypeCounts = this.opponentHand.reduce((counts, card) => {
            counts[card.cardType] = (counts[card.cardType] || 0) + 1;
            return counts;
        }, {});
        // 找到数量最多的卡牌类型
        const maxCount = Math.max(...Object.values(cardTypeCounts));
        const mostCommonTypes = Object.keys(cardTypeCounts).filter(type => cardTypeCounts[type] === maxCount);
        // 如果有多个类型数量相同，则随机选择一个
        const selectedType = mostCommonTypes[Math.floor(Math.random() * mostCommonTypes.length)];
        // 选择该类型的卡牌
        this.opponentSelectedCards = this.opponentHand.filter(card => card.cardType === selectedType).slice(0, 3);


        // 将对方选中的卡牌亮出，放在屏幕中
        this.opponentSelectedCards.forEach(card => {
            this.tweens.add({
                targets: card.cardSprite,
                y: 300,  // 将卡牌放在屏幕中间
                duration: 300,
                ease: 'Power2'
            });

            // 判断选中的卡牌，若是背面朝上，则翻转为正面
            if (!card.faceUp) {
                card.toggleCardFace();
            }
        });

        // 显示防御按钮
        this.showDefenseButton();

        // 显示提示：我方进入防御环节
        this.showMessage('Your defense phase!');
    }

    showDefenseButton() {
        const defenseButton = this.add.text(1100, 600, 'Defend', {
            fontSize: '28px', 
            fill: '#fff' ,
            backgroundColor: '#444',
            padding: { x: 10, y: 5 }
            })
            //.setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.enterPlayerDefensePhase('defenseButton');
                //defenseButton.destroy();  // 移除防御按钮
            })
            .on('pointerover', () => {
                defenseButton.setStyle({ fill: '#ff0' });
            })
            .on('pointerout', () => {
                defenseButton.setStyle({ fill: '#fff' });
            });
        const notResistantButton = this.add.text(1100, 650, 'Skip Defend', { 
            fontSize: '28px', 
            fill: '#fff' ,
            backgroundColor: '#444',
            padding: { x: 10, y: 5 }
            })
            .setInteractive()
            .on('pointerdown', () => {
                this.enterPlayerDefensePhase('notDefenseButton');
                //notResistantButton.destroy();  // 移除防御按钮
            })
            .on('pointerover', () => {
                notResistantButton.setStyle({ fill: '#ff0' });
            })
            .on('pointerout', () => {
                notResistantButton.setStyle({ fill: '#fff' });
            });
    }

    // 玩家进入防御环节
    enterPlayerDefensePhase(buttonSource) {
        
        let playerDefenseCards = [];
        if (buttonSource === 'defenseButton') {
            console.log('是从防御按钮进入的');

            const cardsCount_d = this.selectedCards.length;
            if (cardsCount_d < 3) {
                // 显示提示：至少需要3张牌
                this.showMessage('Need at least 3 cards!');
                return;
            }

    /*
            // 将选中的卡牌亮出，放在屏幕中
            this.selectedCards.forEach(card => {
                this.tweens.add({
                    targets: card,
                    y: 300,  // 将卡牌放在屏幕中间
                    duration: 300,
                    ease: 'Power2'
                });
            });
    */


            // 等待玩家选择防御卡牌
            // 这里可以添加玩家选择防御卡牌的逻辑
            // 假设玩家选择了三张防御卡牌
            playerDefenseCards = this.selectedCards;

            // 取消选中所有卡牌
            this.selectedCards.forEach(card => {
                card.setTint(0xffffff); // 恢复卡牌的原始颜色
                card.setInteractive(); // 恢复卡牌的交互性
            });
            this.selectedCards = []; // 清空选中的卡牌数组

        } else if (buttonSource === 'notDefenseButton') {
            console.log('是从不防御按钮进入的');
            
            // 不防御，直接扣除血量
            playerDefenseCards = [];

        }


        // 检查防御卡牌是否能够克制对方攻击卡牌
        let damageBlocked = 0;
        const attackCard = this.opponentSelectedCards[0].cardSprite.cardData;
        playerDefenseCards.forEach(defenseCard => {
            if (this.canCounter(defenseCard.cardData.cardType, attackCard.cardType)) {
                damageBlocked++;
            }
        });

        // 计算最终伤害
        const cardsCount = this.opponentSelectedCards.length;
        const damage = Math.floor(cardsCount - 1) - damageBlocked;

        // 扣除我方血量
        this.playerHealth -= Math.max(damage, 0);
        this.playerHealthText.setText(this.playerHealth.toString());

        // 移除对方使用的卡牌
        this.opponentSelectedCards.forEach(card => {
            this.tweens.add({
                targets: card.cardSprite,
                y: 120,
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    const index = this.opponentHand.indexOf(card);
                    if (index > -1) {
                        this.opponentHand.splice(index, 1);
                    }
                    card.cardSprite.cardData.destroy();
                }
            });
        });

        // 清空对方选中的卡牌
        this.opponentSelectedCards = [];


        // 检查游戏是否结束
        this.checkGameOver();

        // 双方各抽一张牌
        this.time.delayedCall(1000, () => {
            this.drawCard('player');
            this.drawCard('opponent');
        });
        
        // 进入我方的攻击环节
        //this.enterPlayerAttackPhase();

        // 显示提示：我方的攻击环节
        this.showMessage('Your attack phase!');
    }


/*
    endTurn() {
        // 敌方回合
        this.opponentTurn();
    }

    opponentTurn() {
        // 简单AI：尽可能使用最多的牌
        const cardsToUse = this.opponentHand.length >= 2 ? 
            Math.floor(this.opponentHand.length / 2) * 2 : 0;

        if (cardsToUse >= 2) {
            const damage = Math.floor(cardsToUse / 2);
            this.playerHealth -= damage;
            this.playerHealthText.setText(this.playerHealth.toString());

            // 移除使用的卡牌
            for (let i = 0; i < cardsToUse; i++) {
                const card = this.opponentHand[i];
                this.tweens.add({
                    targets: card,
                    y: 600,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => card.destroy()
                });
            }
            this.opponentHand.splice(0, cardsToUse);

            // 显示伤害
            this.showDamage(damage, 420);

            // 添加震动效果
            this.cameras.main.shake(200, 0.01);
        }

        // 双方各抽一张牌
        this.time.delayedCall(1000, () => {
            this.drawCard('player');
            this.drawCard('opponent');
        });

        // 检查游戏是否结束
        this.checkGameOver();
    }
*/
    showDamage(damage, y) {
        const damageText = this.add.text(640, y, `Damage: ${damage}!`, {
            fontSize: '48px',
            fill: '#ff0000',
            stroke: '#ffffff',
            strokeThickness: 4
        })
        .setOrigin(0.5);

        this.time.delayedCall(2000, () => {
            damageText.destroy();
        });
    }

    showMessage(message) {
        const text = this.add.text(640, 360, message, {
            fontSize: '32px',
            fill: '#ff0000',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        })
        .setOrigin(0.5);

        this.time.delayedCall(2000, () => {
            text.destroy();
        });
    }


    checkGameOver() {
        if (this.playerHealth <= 0) {
            this.showGameOver('Opponent Wins!');
        } else if (this.opponentHealth <= 0) {
            this.showGameOver('Player Wins!');
        }
    }

    showGameOver(message) {
        this.add.text(640, 360, message, {
            fontSize: '64px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}