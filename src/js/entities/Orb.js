import * as Globals from "../Globals";
import Entity from "./Entity";

export default class Orb extends Entity {
    constructor(scene, tile, isFragment = false) {
        super(scene, tile);

        this.name = "Orb";
        this.isFragment = isFragment;
        let texture = "orb";
        if (isFragment) texture = "fragment";
        this.sprite = this.scene.add.sprite(this.x, this.y, texture, 0);
        this.sprite.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNames(texture, {
                start: 0,
                end: 2
            }),
            frameRate: 6,
            repeat: -1
        });
        this.sprite.play("idle");
    }

    onCollide() {
        this.destroy();
        this.scene.worm.incSize();
        if (this.isFragment) {
            this.scene.worm.incSize();
            this.scene.worm.incSize();
        }
    }
}