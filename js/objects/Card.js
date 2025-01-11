export class Card {
    /**
     * Card 类的构造函数
     * @param {Object} scene - 游戏场景对象
     * @param {number} x - 卡牌在场景中的 x 坐标
     * @param {number} y - 卡牌在场景中的 y 坐标
     * @param {string} cardType - 卡牌的类型，用于确定卡牌的纹理
     */
    constructor(scene, x, y, cardType) {
        // 将传入的场景对象赋值给当前实例的 scene 属性
        this.scene = scene;
        // 将传入的卡牌类型赋值给当前实例的 cardType 属性
        this.cardType = cardType;
        // 初始化卡牌的选中状态为 false
        this.selected = false;
        // 初始化卡牌的正面朝上状态为 true
        this.faceUp = true;
        // 记录卡牌的原始 y 坐标
        this.originalY = y;

        // 在场景中添加一个图像作为卡牌精灵，并设置其纹理为 cardType，缩放比例为 0.7
        this.cardSprite = this.scene.add.image(x, y, cardType)
            .setScale(0.3);

        // 设置卡牌精灵为可交互的
        this.cardSprite.setInteractive();
        // 将当前 Card 实例绑定到卡牌精灵的 cardData 属性上，以便在事件处理中访问
        this.cardSprite.cardData = this;

        // 为卡牌精灵添加 pointerdown 事件监听器，当点击卡牌时调用 toggleCardSelection 方法
        this.cardSprite.on('pointerdown', () => {
            this.toggleCardSelection();
            //this.toggleCardFace();
        });
    }

    /**
     * 切换卡牌的选中状态
     * 如果卡牌当前未被选中，则选中该卡牌并更新相关状态
     * 如果卡牌当前已被选中，则取消选中该卡牌并更新相关状态
     */
    toggleCardSelection() {
        // 检查卡牌是否未被选中
        if (!this.selected) {
            // 将卡牌的选中状态设置为 true
            this.selected = true;
            // 给卡牌添加绿色色调，以表示选中状态
            this.cardSprite.setTint(0x00ff00);
            // 使用补间动画将卡牌向上移动 30 像素
            this.scene.tweens.add({
                targets: this.cardSprite,
                y: this.originalY - 30,
                duration: 200
            });
            // 将卡牌添加到场景的选中卡牌数组中
            this.scene.selectedCards.push(this.cardSprite);
        } else {
            // 将卡牌的选中状态设置为 false
            this.selected = false;
            // 清除卡牌的色调，以表示未选中状态
            this.cardSprite.clearTint();
            // 使用补间动画将卡牌恢复到原始位置
            this.scene.tweens.add({
                targets: this.cardSprite,
                y: this.originalY,
                duration: 200
            });
            // 从场景的选中卡牌数组中移除该卡牌
            const index = this.scene.selectedCards.indexOf(this.cardSprite);
            console.log(index);
            if (index > -1) {
                this.scene.selectedCards.splice(index, 1);
            }
        }
    }

     /**
     * 切换卡牌的显示面
     * 如果卡牌当前正面朝上，则将其切换为背面
     * 如果卡牌当前背面朝上，则将其切换为正面
     */
    toggleCardFace() {
        if (this.faceUp) {
            this.cardSprite.setTexture('cardBack');
            this.cardSprite.setAngle(180);
            this.faceUp = false;
        } else {
            this.cardSprite.setTexture(this.cardType);
            this.cardSprite.setAngle(0);
            this.faceUp = true;
        }
    }
    /**
     * 销毁卡牌对象
     * 该方法将从场景中移除卡牌精灵，并清理与卡牌相关的任何资源
     */
    destroy() {
        // 从场景中移除卡牌精灵
        this.cardSprite.destroy();
    
        // 移除卡牌精灵的 pointerdown 事件监听器
        this.cardSprite.off('pointerdown');
    
        // 从场景的选中卡牌数组中移除该卡牌（如果存在）
        const index = this.scene.selectedCards.indexOf(this.cardSprite);
        if (index > -1) {
            this.scene.selectedCards.splice(index, 1);
        }
    
        // 清除卡牌精灵的 cardData 属性引用
        this.cardSprite.cardData = null;
    
        // 可选：执行其他清理操作，例如取消任何正在进行的动画或定时器
        // this.scene.tweens.killTweensOf(this.cardSprite);
        // clearTimeout(this.someTimeoutId);
    }
}
