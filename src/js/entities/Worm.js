import Phaser from "phaser";
import WormPart from "./WormPart";
import * as ParticleManager from "../particles/ParticleManager"

export default class Worm extends Phaser.GameObjects.Sprite {
    constructor(scene, tile) {
        super(scene);

        this.scene = scene;
        this.x = tile.x;
        this.y = tile.y;

        // STATS
        this.speed = 400;
        this.loopCount = 1;
        this.isMoving = false;

        // BODY
        this.bodySize = 4;
        this.bodyPartList = [];

        // DRAW BODY FROM HEAD TO TAIL
        // compute indexes behind starting tile
        let ind = tile.pathInd + 1;
        for (let i = 0; i < this.bodySize; i++) {
            ind--;
            if (ind < 0) {
                ind = this.scene.path.length - 1;
            }
            this.bodyPartList.push(new WormPart(this.scene, this, this.scene.path[ind]));
        }
        this.bodyPartList[0].setHead();
        this.bodyPartList[this.bodySize - 1].setTail();

        // TODO :: QUICKER ?
        this.refreshTailDirectionTimer = scene.time.addEvent({
            delay: this.speed * 2,
            callback: () => { this.bodyPartList[this.bodyPartList.length - 1].refreshDirection() },
            callbackScope: this,
            loop: true
        });

    }

    moveOnPath(headTileList) {
        let tileList = headTileList.slice();
        this.isMoving = true;
        this.bodyPartList.forEach(b => {
            b.moveOnPath(tileList);
            tileList.unshift(tileList.pop());
        });
    }

    moveToNextTile() {
        this.isMoving = true;
        let ind = this.bodyPartList[0].currentTile.pathInd + 1;
        this.bodyPartList.forEach((b) => {
            if (ind >= this.scene.path.length) ind = 0;

            b.moveToTile(this.scene.path[ind]);

            ind--;
            if (ind < 0) ind = this.scene.path.length - 1;
        });
    }

    incLoopCount() {
        this.loopCount++;
        this.scene.emitUpdateHud();
    }

    incSize() {
        const newTileInd = this.bodyPartList[this.bodyPartList.length - 1].currentTile.pathInd - 1;
        this.bodyPartList.splice(this.bodyPartList.length - 1, 0, new WormPart(this.scene, this, newTileInd));
        this.bodyPartList[this.bodyPartList.length - 2].sprite.x = this.bodyPartList[this.bodyPartList.length - 3].sprite.x;
        this.bodyPartList[this.bodyPartList.length - 2].sprite.y = this.bodyPartList[this.bodyPartList.length - 3].sprite.y;
        this.bodyPartList[this.bodyPartList.length - 1].toRefresh = true;

        // this.bodyPartList[this.bodyPartList.length - 1].refreshDirection();

        this.bodySize++;
        this.speed += 50;

        ParticleManager.emitHealParticles(this.scene, this.bodyPartList[0]);
        this.scene.hud.scaleUpDownAnim(this.scene.hud.HUDWormSize);
        this.scene.emitUpdateHud();
    }

    decSize() {
        if (this.bodySize > 2) {
            const tail = this.bodyPartList[this.bodyPartList.length - 1];
            const toDestroy = this.bodyPartList[this.bodyPartList.length - 2];
            const nextPart = this.bodyPartList[this.bodyPartList.length - 3];

            this.bodyPartList.splice(this.bodyPartList.length - 2, 1);

            this.bodySize--;
            this.speed -= 50;

            // UGLY FIX
            this.scene.time.delayedCall(this.speed, () => {
                this.scene.tweens.add({
                    targets: toDestroy.sprite,
                    x: nextPart.sprite.x,
                    y: nextPart.sprite.y,
                    ease: 'Linear',
                    duration: this.speed / 1.5,
                    onCompleteScope: this,
                    onComplete: function() {
                        toDestroy.sprite.destroy();
                    }
                });
            }, [], this);

        } else {
            console.error("YOU ARE DEAD")
        }

        ParticleManager.emitHurtParticles(this.scene, this.bodyPartList[0]);
        
        this.scene.shakeCamera(.5);
        this.scene.hud.scaleUpDownAnim(this.scene.hud.HUDWormSize);
        this.scene.emitUpdateHud();
    }



    // decSize() {
    //     if (this.bodySize > 2) {
    //         // TODO :: NOT WORKING PROPERLY
    //         // HEEEEELPP!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! FOR FUCK SAKE

    //         let tail = this.bodyPartList[this.bodyPartList.length - 1];

    //         // Tile index of the one in front of the one being deleted, plus one... OK ? Zero if end of path...
    //         const nextTileInd = this.bodyPartList[this.bodyPartList.length - 3].currentTile.pathInd + 1 >= this.scene.path.length ? 0 : this.bodyPartList[this.bodyPartList.length - 3].currentTile.pathInd + 1;

    //         // Tail currenttile is now the one of the one in front of the one being deleted. YEAH OK ?
    //         this.bodyPartList[this.bodyPartList.length - 1].currentTile = this.bodyPartList[this.bodyPartList.length - 3].currentTile;

    //         // Pause the head and the one before
    //         this.bodyPartList[0].movingTween.pause();
    //         this.bodyPartList[1].movingTween.pause();

    //         // The tail now move towards its new place
    //         tail.movingTween = this.scene.tweens.add({
    //             targets: tail.sprite,
    //             x: this.scene.path[nextTileInd].x,
    //             y: this.scene.path[nextTileInd].y,
    //             ease: 'Linear',
    //             duration: this.speed,
    //             onCompleteScope: this,
    //             onComplete: function() {
    //                 this.bodyPartList[this.bodyPartList.length - 2].sprite.destroy();
    //                 this.bodyPartList.splice(this.bodyPartList.length - 2, 1);
    //                 this.bodyPartList[this.bodyPartList.length - 1].currentTile = this.bodyPartList[this.bodyPartList.length - 2].currentTile;
    //                 this.bodyPartList[this.bodyPartList.length - 1].refreshDirection();

    //                 this.bodyPartList[0].movingTween.play();
    //                 this.bodyPartList[1].movingTween.play();
    //             }
    //         });
    //         this.bodySize--;
    //         this.speed -= 50;

    //     } else {
    //         console.error("YOU ARE DEAD")
    //     }
    //     this.scene.emitUpdateHud();
    // }

}