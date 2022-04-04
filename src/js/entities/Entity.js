import Phaser from "phaser";

export default class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, tile) {
        super(scene);

        this.name = "Entity";
        this.scene = scene;
        this.currentTile = tile;
        this.x = tile.x;
        this.y = tile.y;

        this.sprite = null;
    }

    moveToRandomTile(availablePath) {
        const randomTile = Phaser.Math.RND.pick(availablePath);
        if (randomTile.contains.length <= 3) {
            this.enemyList.push(
                new Enemy(this, randomTile.x, randomTile.y, randomTile, name)
            );
            randomTile.contains.push(this.enemyList[this.enemyList.length - 1]);
            availablePath.splice(availablePath.indexOf(randomTile), 1);
        }
        return availablePath;
    }

    onCollide() {
        console.log("Collide with " + this.name);
    }

    destroy() {
        if (this.sprite !== null)
            this.sprite.destroy();

        this.currentTile.contains = [];
    }

}