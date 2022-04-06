import * as Globals from "../Globals";

export default class Card {
    constructor(scene, x, y, name) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.name = name;
        this.data = Globals.CARDS[name];

        this.shakeAnim = this.scene.tweens.add({
            targets: [this.sprite, this.cardSprite, this.priceText, this.text],
            duration: 0
        });

        this.text = this.scene.add
            .text(x, y, this.data.name, {
                font: "13pt pearsoda",
                color: Globals.PALETTE_HEX[1]
            })
            .setOrigin(0.5, 0.5);
        this.sprite = this.scene.add
            .sprite(x, y + 25, "orb", 0)
            .setInteractive();
        this.cardSprite = this.scene.add.sprite(x, y + 30, "card", 0);
        this.priceText = this.scene.add
            .text(x, y + 55, this.data.price + "", {
                font: "18pt pearsoda",
                color: Globals.PALETTE_HEX[1]
            })
            .setOrigin(0.5, 0.5);
    }

    moveToX(x) {
        this.x = x;

        this.scene.tweens.add({
            targets: [this.sprite, this.priceText, this.text],
            x: x,
            ease: "Power2",
            duration: 700
        });
        this.scene.tweens.add({
            targets: this.cardSprite,
            x: x - 2,
            ease: "Power2",
            duration: 700
        });
    }

    refresh() {
        this.sprite.anims.create({
            key: "idle",
            frames: this.sprite.anims.generateFrameNames("orb", {
                start: 0,
                end: 2
            }),
            frameRate: 6,
            repeat: -1
        });
        this.sprite.play("idle");
        this.cardSprite.anims.create({
            key: "idle",
            frames: this.cardSprite.anims.generateFrameNames("card", {
                start: 0,
                end: 2
            }),
            frameRate: 6,
            repeat: -1
        });
        this.cardSprite.play("idle");
        this.cardSprite.setInteractive();
    }

    hide() {
        this.scene.tweens.add({
            targets: [this.sprite, this.cardSprite],
            y: this.scene.height + 8,
            ease: "Bounce",
            duration: 1000,
            onCompleteScope: this,
            onComplete: function() {
                this.enable();
            }
        });
        this.scene.tweens.add({
            targets: this.priceText,
            y: this.scene.height + 8 - 32,
            ease: "Bounce",
            duration: 1000,
            onCompleteScope: this,
            onComplete: function() {}
        });
        this.scene.tweens.add({
            targets: this.text,
            y: this.scene.height + 8 + 32,
            ease: "Bounce",
            duration: 1000,
            onCompleteScope: this,
            onComplete: function() {}
        });
    }
    show() {
        this.scene.tweens.add({
            targets: [this.sprite, this.cardSprite],
            y: this.scene.height - 64,
            ease: "Bounce",
            duration: 1000,
            onCompleteScope: this,
            onComplete: function() {
                this.enable();
            }
        });
        this.scene.tweens.add({
            targets: this.priceText,
            y: this.scene.height - 64 - 32,
            ease: "Bounce",
            duration: 1000,
            onCompleteScope: this,
            onComplete: function() {}
        });
        this.scene.tweens.add({
            targets: this.text,
            y: this.scene.height - 64 + 32,
            ease: "Bounce",
            duration: 1000,
            onCompleteScope: this,
            onComplete: function() {}
        });
    }

    shake() {
        if (!this.shakeAnim.isPlaying())
            this.shakeAnim = this.scene.tweens.add({
                targets: [this.sprite, this.cardSprite, this.priceText, this.text],
                x: "-=5",
                yoyo: true,
                repeat: 5,
                ease: "Power2",
                duration: 60
            });
    }

    setActive(bool) {
        if (bool) {
            this.scene.tweens.add({
                targets: [this.sprite, this.cardSprite, this.priceText, this.text],
                scale: "+=0.1",
                ease: "Power2",
                duration: 60
            });
        } else {
            this.scene.tweens.add({
                targets: [this.sprite, this.cardSprite, this.priceText, this.text],
                scale: "-=0.1",
                ease: "Power2",
                duration: 60
            });
        }
    }
    enable() {
        if (this.cardSprite._events.pointerup === undefined) {
            this.cardSprite.on(
                "pointerup",
                () => this.scene.onToggleBuild(this),
                this.scene
            );
        }
    }
    disable() {
        this.cardSprite.off("pointerup");
    }
    remove() {
        this.sprite.destroy();
        this.cardSprite.destroy();
        this.text.destroy();
        this.priceText.destroy();
    }
}