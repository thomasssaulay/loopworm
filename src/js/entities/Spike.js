import * as Globals from "../Globals";
import Entity from "./Entity";

export default class Spike extends Entity {
    constructor(scene, tile) {
        super(scene, tile);

        this.name = "Spike";
        this.sprite = this.scene.add.sprite(this.x, this.y, "spike", 0).setTint(Globals.PALETTE[1]);
        this.sprite.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNames("spike", {
                start: 0,
                end: 2
            }),
            frameRate: 6,
            repeat: -1
        });
        this.sprite.play("idle");
    }

    onCollide() {
        this.scene.worm.decSize();
    }
}