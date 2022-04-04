import Phaser from "phaser";
import WormPart from "./WormPart";

export default class Worm extends Phaser.GameObjects.Sprite {
    constructor(scene, tile) {
        super(scene);

        this.scene = scene;
        // this.currentHeadTile = tile;
        this.x = tile.x;
        this.y = tile.y;

        // STATS
        this.speed = 600;
        this.loopCount = 1;
        this.isMoving = false;

        // BODY
        this.bodySize = 5;
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
        console.log("<<<<LOOP N°" + this.loopCount + ">>>>");
    }

    incSize() {
        const newTileInd = this.bodyPartList[this.bodyPartList.length - 1].currentTile.pathInd - 1;
        this.bodyPartList.splice(this.bodyPartList.length - 1, 0, new WormPart(this.scene, this, newTileInd));
        this.bodyPartList[this.bodyPartList.length - 2].sprite.x = this.bodyPartList[this.bodyPartList.length - 3].sprite.x;
        this.bodyPartList[this.bodyPartList.length - 2].sprite.y = this.bodyPartList[this.bodyPartList.length - 3].sprite.y;

        // this.bodyPartList[this.bodyPartList.length - 1].refreshDirection();

        this.bodySize++;
        this.speed += 20;
        console.log(this.bodyPartList);
    }
    decSize() {
        this.bodyPartList[this.bodyPartList.length - 2].sprite.destroy();
        this.bodyPartList.splice(this.bodyPartList.length - 2, 1);
        this.bodyPartList[this.bodyPartList.length - 1].currentTile = this.bodyPartList[this.bodyPartList.length - 2].currentTile;
        this.bodyPartList[this.bodyPartList.length - 1].toRefresh = true;

        // this.bodyPartList[this.bodyPartList.length - 1].refreshDirection();

        this.bodySize--;
        this.speed -= 20;
        // console.log(this.bodyPartList);
    }

}