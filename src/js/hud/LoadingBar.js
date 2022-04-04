import Phaser from "phaser";
import * as Globals from "../Globals";

export default class LoadingBar {
    constructor(scene, x, y, value, maxValue) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.value = value;
        this.maxValue = maxValue;

        this.width = 96;
        this.height = 8;

        this.bg = new Phaser.GameObjects.Graphics(this.scene);
        this.bar = new Phaser.GameObjects.Graphics(this.scene);

        this.draw();

        scene.add.existing(this.bg);
        scene.add.existing(this.bar);
    }

    set(value, maxValue) {
        this.value = value;
        this.maxValue = maxValue;

        if (this.value < 0) {
            this.value = 0;
        }

        this.draw();

        // let d = this.value / this.maxValue;
        // console.log(this.bar)
        // this.scene.add.tween({
        //     targets: this.bar,
        //     duration: 500,
        //     ease: "Power2",
        //     width: d * this.width - 4
        // });

        return this.value === 0;
    }

    draw() {
        this.bar.clear();
        this.bg.clear();

        //  BG
        this.bg.lineStyle(1, Globals.PALETTE[1]);
        this.bg.strokeRect(this.x, this.y, this.width, this.height);

        //  Value
        this.bar.fillStyle(Globals.PALETTE[1]);

        let d = this.value / this.maxValue;

        this.bar.fillRect(
            this.x + 2,
            this.y + 2,
            d * this.width - 4,
            this.height - 4
        );
    }
}