import * as Globals from "../Globals";
import Entity from "./Entity";

export default class Orb extends Entity {
    constructor(scene, tile) {
        super(scene, tile);

        this.name = "Orb";
        this.sprite = this.scene.add.sprite(this.x, this.y, "orb", 0).setTint(Globals.PALETTE[1]);
        this.sprite.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNames("orb", {
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
    }
}