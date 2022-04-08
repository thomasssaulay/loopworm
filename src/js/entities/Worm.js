import Phaser from "phaser";
import WormPart from "./WormPart";
import * as ParticleManager from "../particles/ParticleManager"
import * as Globals from "../Globals"

export default class Worm extends Phaser.GameObjects.Sprite {
    constructor(scene, tile) {
        super(scene);

        this.scene = scene;
        this.x = tile.x;
        this.y = tile.y;

        // STATS
        this.speed = Globals.STARTING_SPEED;
        this.loopCount = 1;
        this.isMoving = false;

        // BODY
        this.bodySize = Globals.STARTING_SIZE;
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

        // Fix for tail fucking up direction
        this.refreshTailDirectionTimer = scene.time.addEvent({
            delay: this.speed * 2,
            callback: () => { this.bodyPartList[this.bodyPartList.length - 1].refreshDirection() },
            callbackScope: this,
            loop: true
        });

    }

    moveOnPath(headTileList) {
        // UNUSED FOR NOW
        let tileList = headTileList.slice();
        this.isMoving = true;
        this.bodyPartList.forEach(b => {
            b.moveOnPath(tileList);
            tileList.unshift(tileList.pop());
        });
    }

    moveToNextTile() {
        // Main function for recursive moves of each body part of the worm
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
        // Increase loop count, reduce next wave time and emit update HUD event
        this.loopCount++;
        this.scene.hud.nextWaveTime -= Globals.ADD_TIME_PER_LOOP;
        this.scene.emitUpdateHud();
    }

    incSize() {
        // Increment worm size by one. This also lowers its speed (making the worm faster), does particle effects and emits an update HUD event
        const newTileInd = this.bodyPartList[this.bodyPartList.length - 1].currentTile.pathInd - 1;
        this.bodyPartList.splice(this.bodyPartList.length - 1, 0, new WormPart(this.scene, this, newTileInd));
        this.bodyPartList[this.bodyPartList.length - 2].sprite.x = this.bodyPartList[this.bodyPartList.length - 3].sprite.x;
        this.bodyPartList[this.bodyPartList.length - 2].sprite.y = this.bodyPartList[this.bodyPartList.length - 3].sprite.y;
        this.bodyPartList[this.bodyPartList.length - 1].toRefresh = true;

        this.bodySize++;
        this.speed -= Globals.SPEED_PER_HIT;

        // Win condition
        if (this.bodySize === this.scene.path.length) {
            this.scene.onWinGame();
        }

        ParticleManager.emitHealParticles(this.scene, this.bodyPartList[0]);
        this.scene.hud.scaleUpDownAnim(this.scene.hud.HUDWormSize);
        this.scene.emitUpdateHud();
    }

    decSize() {
        // Decrement worm size by one. This also raises its speed (making the worm slower), does particles effects and emits an update HUD event
        if (this.bodySize > 2) {
            // If not dead...
            const toDestroy = this.bodyPartList[this.bodyPartList.length - 2];
            const nextPart = this.bodyPartList[this.bodyPartList.length - 3];

            this.bodyPartList.splice(this.bodyPartList.length - 2, 1);

            this.bodySize--;
            this.speed += Globals.SPEED_PER_HIT;

            // UGLY FIX -- TAIL IS BUGGY AS FUCK
            this.scene.time.delayedCall(this.speed, () => {
                this.scene.tweens.add({
                    targets: toDestroy.sprite,
                    x: nextPart.sprite.x,
                    y: nextPart.sprite.y,
                    ease: 'Linear',
                    duration: this.speed / 1.5,
                    onCompleteScope: this,
                    onComplete: function () {
                        toDestroy.sprite.destroy();
                    }
                });
            }, [], this);


            ParticleManager.emitHurtParticles(this.scene, this.bodyPartList[0]);

            this.scene.shakeCamera(.5);
            this.scene.hud.scaleUpDownAnim(this.scene.hud.HUDWormSize);
            this.scene.emitUpdateHud();

        } else {
            // DEATH CONDITION
            ParticleManager.emitDeathParticles(this.scene, this.bodyPartList[0]);
            ParticleManager.emitDeathParticles(this.scene, this.bodyPartList[1]);

            this.bodyPartList[0].movingTween.pause();
            this.bodyPartList[1].movingTween.pause();
            this.bodyPartList[0].sprite.setAlpha(0);
            this.bodyPartList[1].sprite.setAlpha(0);

            this.scene.hud.stopWaveTimer();

            this.scene.time.delayedCall(2000, () => {
                this.scene.scene.start("SceneGameOver", { win: false, loopCount: this.loopCount });
            }, [], this);

            this.scene.shakeCamera(.75, 500);



        }

    }

}