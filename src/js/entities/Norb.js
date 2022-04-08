import * as Globals from "../Globals";
import Entity from "./Entity";

export default class Norb extends Entity {
    constructor(scene, tile) {
        super(scene, tile);

        this.name = "Norb";
        this.sprite = this.scene.add.sprite(this.x, this.y, "norb", 0);
        this.sprite.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNames("norb", {
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
        this.scene.worm.decSize();
    }
}