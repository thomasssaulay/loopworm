import Phaser from "phaser";
import LoadingBar from "./LoadingBar";
import Card from "./Card";
import * as Globals from "../Globals";


export default class HudScene extends Phaser.Scene {
    constructor() {
        super({ key: "Hud", active: true });
    }

    create() {
        this.sceneMain = this.scene.get("SceneMain");
        // PAS DE LIEN ENTRE SCENES DANS LE CREATE()
        this.height = this.cameras.main.height;
        this.width = this.cameras.main.width;

        this.sceneMain.events.on("updateHud", this.updateHud, this);
    }

    initHudScene() {
        //  UI
        this.HUDTitle = this.add
            .text(150, 30, "LoopWorm", {
                font: "25pt PearSoda",
                align: "left",
                color: Globals.PALETTE_HEX[1]
            })
            .setOrigin(0.5, 0.5);
        this.HUDLoopCounter = this.add
            .text(128, 48, "LOOP 0", {
                font: "14pt PearSoda",
                color: Globals.PALETTE_HEX[1]
            })
            .setOrigin(0.5, 0.5);
        this.HUDWormSize = this.add
            .text(182, 48, "SIZE 0", {
                font: "14pt PearSoda",
                color: Globals.PALETTE_HEX[1]
            })
            .setOrigin(0.5, 0.5);
        this.HUDQuit = this.add
            .sprite(this.width - 128, 36, "quit", 0)
            .setOrigin(0.5, 0.5);

        // Cards related
        this.HUDCardInfoBack = this.add
            .sprite(this.width - 128, this.height + 64, "infocard", 0)
            .setOrigin(0.5, 0.5);
        this.HUDCardInfoText = this.add
            .text(this.width - 128, this.height + 64, "", {
                font: "12pt PearSoda",
                align: "center",
                color: Globals.PALETTE_HEX[1]
            })
            .setOrigin(0.5, 0.5);
        this.HUDCards = [];
        this.addCard("Card_Orb");
        this.addCard("Card_Orb_Dispenser");
        this.HUDCards.forEach((card) => {
            card.refresh();
        });

        this.HUDCardInfoBack.setTexture("infocard").setScale(1.5);
        this.HUDCardInfoBack.anims.create({
            key: "idle",
            frames: this.HUDCardInfoBack.anims.generateFrameNames("infocard", {
                start: 0,
                end: 2
            }),
            frameRate: 6,
            repeat: -1
        });
        this.HUDCardInfoBack.play("idle");
        this.cardInfoAnim = false;

        // Quit button
        this.HUDQuit.setTexture("quit");
        this.HUDQuit.anims.create({
            key: "idle",
            frames: this.HUDQuit.anims.generateFrameNames("quit", {
                start: 0,
                end: 2
            }),
            frameRate: 6,
            repeat: -1
        });
        this.HUDQuit.play("idle");
        this.HUDQuit.setInteractive();
        this.HUDQuit.on("pointerup", this.onQuitGame, this);
    }

    updateHud(event) {

        this.HUDLoopCounter.setText("LOOP " + this.sceneMain.worm.loopCount);
        this.HUDWormSize.setText("SIZE " + this.sceneMain.worm.bodySize);
        this.updateCards();

    }

    updateCards() {
        this.HUDCards.forEach(c => {
            if (c.data.price > this.sceneMain.worm.bodySize) {
                c.disable();
                c.hide();
            } else {
                c.enable();
                c.show();
            }
        });
    }

    onToggleBuild(card) {
        if (card.isEnabled) {
            const build = Globals.CARDS[card.name];

            if (this.sceneMain.buildMode === false) {
                //     if (
                //         this.sceneMain.player[this.sceneMain.currentPlayer].money >= card.price
                //     ) {
                //         // IF ENOUGH MONEY
                //         this.toggleDiceOff();
                this.sceneMain.buildMode = card;
                card.setActive(true);
                this.input.setDefaultCursor("crosshair");
                this.showCardInfo(card);
                //         if (building.coastal) this.sceneMain.showCoastal();
                //     } else {
                //         card.shake();
                // }
            } else {
                //     this.toggleDiceOn();
                this.hideCardInfo();
                this.toggleBuildOff();
                card.setActive(false);
                //     this.sceneMain.hideCoastal();
            }
        }
    }
    toggleBuildOff() {
        this.sceneMain.buildMode = false;
        // this.toggleDiceOn();
        // this.HUDCards.forEach((card) => {
        //     card.setToPlayerColor(card.owner.playerID);
        // });
        // this.sceneMain.hideCoastal();
        this.input.setDefaultCursor("default");
    }

    addCard(cardName) {
        const offset_x = 128;
        const offset_gap = 96;
        const newCard = new Card(
            this,
            offset_x + offset_gap * this.HUDCards.length,
            this.height + 64,
            cardName
        );
        this.HUDCards.push(newCard);
        this.HUDCards[this.HUDCards.length - 1].hide();
    }

    showCardInfo(card) {
        if (!this.cardInfoAnim) {
            this.sceneMain.tweens.add({
                targets: [this.HUDCardInfoBack, this.HUDCardInfoText],
                y: "-=128",
                ease: "Bounce",
                duration: 500,
                onCompleteScope: this,
                onComplete: function() {
                    this.cardInfoAnim = true;
                }
            });
            this.HUDCardInfoText.setText(card.data.info);
        }
    }
    hideCardInfo() {
        if (this.cardInfoAnim) {
            this.sceneMain.tweens.add({
                targets: [this.HUDCardInfoBack, this.HUDCardInfoText],
                y: "+=128",
                ease: "Bounce",
                duration: 500,
                onCompleteScope: this,
                onComplete: function() {
                    this.cardInfoAnim = false;
                }
            });
        }
    }
    disableAllCards() {
        this.HUDCards.forEach((c) => {
            c.disable();
        });
    }
    enableAllCards() {
        this.HUDCards.forEach((c) => {
            c.enable();
        });
    }
    scaleUpDownAnim(target) {
        this.tweens.add({
            targets: target,
            scale: 1.3,
            yoyo: true,
            repeat: 2,
            ease: "Power2",
            duration: 100
        });
    }
    onQuitGame() {
        this.hud = this.sceneMain.scene.stop("Hud");
        this.sceneMain.scene.start("SceneMainMenu");
    }
}