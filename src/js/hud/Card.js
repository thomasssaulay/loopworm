import * as Globals from "../Globals";
import LoadingBar from "../hud/LoadingBar";

export default class Card {
    constructor(scene, x, y, name) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.name = name;
        this.data = Globals.CARDS[name];
        this.isShown = true;
        this.isEnabled = false;
        this.cooldown = this.data.cooldown;

        this.shakeAnim = this.scene.tweens.add({
            targets: [this.sprite, this.cardSprite, this.priceText, this.text],
            duration: 0
        });

        this.text = this.scene.add
            .text(x, y, this.data.name, {
                font: "13pt PearSoda",
                color: Globals.PALETTE_HEX[1]
            })
            .setOrigin(0.5, 0.5);
        this.sprite = this.scene.add
            .sprite(x, this.scene.height + 8, "builds", this.data.offsetSprite * 3)
            .setInteractive();

        this.cardSprite = this.scene.add.sprite(x, this.scene.height + 8, "card", 0).setInteractive();
        this.cardSprite.on(
            "pointerup",
            () => this.scene.onToggleBuild(this),
            this.scene
        );
        this.priceText = this.scene.add
            .text(x, this.scene.height + 8 - 32, this.data.price + "", {
                font: "18pt PearSoda",
                color: Globals.PALETTE_HEX[1]
            })
            .setOrigin(0.5, 0.5);

        this.bar = new LoadingBar(this.scene, x, y - 64, 0, this.cooldown);
        this.bar.bar.setAlpha(0);
        this.bar.bg.setAlpha(0);
        this.barTimer = null;

        this.disable();
    }

    refresh() {
        this.sprite.anims.create({
            key: "idle",
            frames: this.sprite.anims.generateFrameNames("builds", {
                start: this.data.offsetSprite * 3,
                end: this.data.offsetSprite * 3 + 2
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
        if (this.isShown) {
            this.scene.tweens.add({
                targets: [this.sprite, this.cardSprite],
                y: this.scene.height + 8,
                ease: "Bounce",
                duration: 1000,
            });
            this.scene.tweens.add({
                targets: this.priceText,
                y: this.scene.height + 8 - 32,
                ease: "Bounce",
                duration: 1000,
            });
            this.scene.tweens.add({
                targets: this.text,
                y: this.scene.height + 8 + 32,
                ease: "Bounce",
                duration: 1000,
            });
            this.scene.tweens.add({
                targets: [this.bar.bg, this.bar.bar],
                y: -58,
                alpha: 0,
                ease: "Linear",
                duration: 750,
            });

            this.stopCooldown();
            this.isShown = false;
            this.disable();
        }
    }
    show() {
        if (!this.isShown) {
            this.scene.tweens.add({
                targets: this.sprite,
                y: this.scene.height - 56,
                ease: "Bounce",
                duration: 1000,
            });
            this.scene.tweens.add({
                targets: this.cardSprite,
                y: this.scene.height - 64,
                ease: "Bounce",
                duration: 1000,
            });
            this.scene.tweens.add({
                targets: this.priceText,
                y: this.scene.height - 64 - 32,
                ease: "Bounce",
                duration: 1000,
            });
            this.scene.tweens.add({
                targets: this.text,
                y: this.scene.height - 64 + 32,
                ease: "Bounce",
                duration: 1000,
            });
            this.scene.tweens.add({
                targets: [this.bar.bg, this.bar.bar],
                y: -128,
                alpha: 1,
                ease: "Linear",
                duration: 750,
            });

            this.isShown = true;
            this.startCooldown();
        }
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
                scale: 1.1,
                ease: "Power2",
                duration: 60
            });
        } else {
            this.scene.tweens.add({
                targets: [this.sprite, this.cardSprite, this.priceText, this.text],
                scale: 1,
                ease: "Power2",
                duration: 60
            });
        }
    }
    enable() {
        if (!this.isEnabled) {
            // console.log(this.name + " is enabled");
            // if (this.cardSprite._events.pointerup === undefined) {
            // }
            this.isEnabled = true;
        }
    }
    disable() {
        if (this.isEnabled) {
            // console.log(this.name + " is disabled");
            this.setActive(false);
            // this.cardSprite.off("pointerup");
            this.isEnabled = false;
            this.bar.set(0);
            if (this.isShown) {
                this.startCooldown();
            }
        }
    }
    startCooldown() {
        this.barTimer = this.scene.time.addEvent({
            delay: this.cooldown / 100,
            callback: () => {
                this.bar.setPercent(this.barTimer.getOverallProgress())
                if (this.barTimer.getOverallProgress() === 1)
                    this.enable();

            },
            callbackScope: this,
            repeat: 100
        });
    }
    stopCooldown() {
        this.scene.time.removeEvent(this.barTimer);
    }

    remove() {
        this.sprite.destroy();
        this.cardSprite.destroy();
        this.text.destroy();
        this.priceText.destroy();
    }
}