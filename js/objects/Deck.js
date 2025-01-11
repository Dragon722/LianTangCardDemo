// js/objects/Deck.js
export class Deck {
    constructor() {
        // 初始化牌库，每种牌10张，总共50张
        this.cards = [];
        const cardTypes = ['a', 'b', 'c', 'd', 'e'];
        cardTypes.forEach(type => {
            for (let i = 0; i < 10; i++) {
                this.cards.push(type);
            }
        });
        
        // 洗牌
        this.shuffle();
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    drawCard() {
        if (this.cards.length > 0) {
            return this.cards.pop();
        }
        return null; // 牌库空了
    }

    getCardsCount() {
        return this.cards.length;
    }
}