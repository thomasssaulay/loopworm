import Phaser from "phaser";
import * as Globals from "../Globals";

export default class WormPart extends Phaser.GameObjects.Sprite {
    constructor(scene, worm, tile) {
        super(scene);

        this.scene = scene;
        this.worm = worm;
        this.currentTile = tile;
        this.isHead = false;
        this.isTail = false;
        this.x = tile.x;
        this.y = tile.y;
        this.direction = tile.direction;
        this.sprite = this.scene.add.sprite(this.x, this.y, "worm", 0).setDepth(0).setTint(Globals.PALETTE[1]);



        this.movingTimeline = null;
        this.movingTween = null;
    }

    // moveTo(x, y) {
    //     this.x = x;
    //     this.y = y;
    //     this.scene.tweens.add({
    //         targets: this.spriteList[0],
    //         x: x,
    //         y: y,
    //         ease: "Power2",
    //         duration: 700,
    //         onCompleteScope: this,
    //         onComplete: function() {

    //         }
    //     });
    // }

    // Move worm part to a tile, update tile, set frame, count loop
    moveToTile(t) {
        // Directions parts
        // 0 - vertical | 1 - StoE | 2 - WtoS
        // 3 - horizontal | 4 - NtoE | 5 - WtoN
        // Directions head/tail
        // 0 - east | 90 - down 
        // 180 - west | 270 - north

        this.movingTween = this.scene.tweens.add({
            targets: this.sprite,
            x: t.x,
            y: t.y,
            ease: "Linear",
            duration: this.worm.speed,
            onStartScope: this,
            onStart: function() {
                let newDir = 0;
                if ((t.x > this.currentTile.x && t.y === this.currentTile.y) || (t.x < this.currentTile.x && t.y === this.currentTile.y))
                    newDir = 0;
                if ((t.y > this.currentTile.y && t.x === this.currentTile.x) || (t.y < this.currentTile.y && t.x === this.currentTile.x))
                    newDir = 90;

                if (!this.isHead && !this.isTail)
                    this.sprite.setRotation(newDir * (Math.PI / 180));
            },
            onCompleteScope: this,
            onComplete: function() {
                if (this.isHead || this.isTail) {
                    if (this.direction !== t.direction) {
                        let angle = 0;
                        if (t.direction === 1) {
                            if (t.indY === this.currentTile.indY)
                                angle += -90;
                            else
                                angle += 90;
                        }
                        if (t.direction === 2 || t.direction === 4)
                            angle += -90;
                        if (t.direction === 5) {
                            if (t.indX === this.currentTile.indX)
                                angle += 90;
                            else
                                angle += -90;
                        }

                        this.direction = t.direction;
                        this.scene.tweens.add({
                            targets: this.sprite,
                            angle: this.sprite.angle + angle,
                            ease: 'Linear',
                            duration: this.worm.speed / 2,
                        });
                    }
                }

                this.x = t.x;
                this.y = t.y;
                this.currentTile = t;

                if (this.isHead) {
                    if (this.currentTile.pathInd === this.scene.path.length - 1) {
                        this.worm.incLoopCount();
                    }
                    this.worm.moveToNextTile();
                }
            }
        });
    }

    moveOnPath(tileList) {
        if (this.movingTimeline !== null) this.movingTimeline.stop();
        this.movingTimeline = this.scene.tweens.createTimeline();

        tileList.forEach((t) => {
            // let t = tileList[i];
            this.movingTimeline.add({
                targets: this.sprite,
                x: t.x,
                y: t.y,
                ease: "Linear",
                duration: this.worm.speed,
                onCompleteScope: this,
                onComplete: function() {
                    this.x = t.x;
                    this.y = t.y;
                    this.currentTile = t;

                    // TAKES TILE DAMAGE
                    // if (t.direct_dmg[1] > 0 && t.direct_dmg[0] !== this) {
                    //     this.substractHP(t.direct_dmg[1]);
                    //     this.blink();
                    // }
                    // TAKES TILE MONEY
                    // if (t.direct_money[1] > 0 && t.direct_money[0] === this) {
                    //     this.addMoney(t.direct_money[1]);
                    //     ParticleManager.emitMoneyParticles(
                    //         this.scene,
                    //         this,
                    //         this.scene.hud.HUDmoney[this.playerID],
                    //         t.direct_money[1],
                    //         this.color
                    //     );
                    // }

                    //TAKES TILE HP
                    // if (t.direct_hp > 0) this.addHP(t.direct_hp);

                    // CAMOUFLAGE
                    // if (t.camouflage === this && !this.isCamo) this.camo();
                    // if (!t.camouflage && this.isCamo) this.unCamo();

                    // REGEN
                    // this.addHP(this.regenRate);

                    // ENGAGE COMBAT
                    // if (t.contains.length > 0 && !this.isCamo) {
                    //     this.inCombat = true;
                    //     this.pauseMoving();
                    //     this.scene.engageCombat(t.contains);
                    // }

                    // END OF LOOP TILE REACHED
                    // if (t.pathInd === this.scene.path.length - 1) {
                    //     this.loopCount++;
                    // this.scene.onEndOfLoop(this);
                    // }

                    // this.scene.emitUpdateHud();
                }
            });
        });

        this.movingTimeline.setCallback(
            "onComplete",
            function() {
                if (this.isHead) {
                    this.worm.incLoopCount();
                    this.worm.moveOnPath(this.scene.path);
                }
            },
            null,
            this
        );

        this.movingTimeline.play();
    }

    setHead() {
        this.isHead = true;
        this.sprite.setFrame(1);
        this.sprite.setRotation(180 * (Math.PI / 180));
    }
    setTail(direction = 90) {
            this.isTail = true;
            this.sprite.setFrame(2);
            this.sprite.setRotation(direction * (Math.PI / 180));
        }
        // unsetTail() {
        //     this.isTail = false;
        //     this.sprite.setFrame(0);
        // }

    refreshDirection() {
        // TODO :: FUNCTION REFRESH DIRECTION IN WORMPART
        // Compute if top / bottom / left /right side of map and angle tail properly

        // Directions head/tail
        // 0 - east | 90 - down 
        // 180 - west | 270 - north

        // TODO :: END OF PATH CASE !!!!!!
        const nextTile = this.scene.path[this.currentTile.pathInd + 1];
        let angle = 0;
        if (nextTile.indX < this.scene.map.length / 2) {
            if (nextTile.indY < this.scene.map[0].length / 2) {
                console.log("top left ", nextTile.indX, nextTile.indY, nextTile.direction);
                if (nextTile.direction === 3)
                    angle = 0;
                if (nextTile.direction === 1)
                    angle = 270;
                if (nextTile.direction === 5)
                    angle = 0;
                if (nextTile.direction === 0)
                    angle = 270;
            } else {
                console.log("bottom left ", nextTile.indX, nextTile.indY, nextTile.direction);
            }
        } else {
            if (nextTile.indY < this.scene.map[0].length / 2) {
                console.log("top right ", nextTile.indX, nextTile.indY, nextTile.direction);
                if (nextTile.direction === 3)
                    angle = 0;
                if (nextTile.direction === 1)
                    angle = 270;
                if (nextTile.direction === 5)
                    angle = 0;
                if (nextTile.direction === 2)
                    angle = 90;
                if (nextTile.direction === 0)
                    angle = 90;
            } else {
                console.log("bottom right ", nextTile.indX, nextTile.indY, nextTile.direction);
            }
        }
        this.sprite.angle = angle;


        // let angle = 0;
        // if (this.current.direction === 1) {
        //     if (t.indY === this.currentTile.indY)
        //         angle = ;
        //     else
        //         angle = 90;
        // }
        // if (t.direction === 2 || t.direction === 4)
        //     angle = -90;
        // if (t.direction === 5) {
        //     if (t.indX === this.currentTile.indX)
        //         angle = 90;
        //     else
        //         angle = -90;
        // }
        // this.bodyPartList[this.bodyPartList.length - 1].sprite.angle = angle;

    }
}