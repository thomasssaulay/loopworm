export default class SlideButton {
    constructor(scene, x, y, name, defaultValue, maxValue = 2, minValue = 0) {
        this.scene = scene;
        this.value = defaultValue;
        this.maxValue = maxValue;
        this.minValue = minValue;

        this.valueToText = [
            "Easy",
            "Normal",
            "Hard"
        ];

        this.nameText = this.scene.add
            .text(x, y - 32, name, {
                font: "15pt pearsoda",
                color: "white"
            })
            .setOrigin(0.5, 0.5);
        this.valueText = this.scene.add
            .text(x, y, this.valueToText[this.value], {
                font: "20pt pearsoda",
                color: "white"
            })
            .setOrigin(0.5, 0.5);
        this.leftArrow = this.scene.add
            .sprite(x - 64, y, "arrows", 0)
            .setInteractive();
        this.leftArrow.anims.create({
            key: "idle",
            frames: this.leftArrow.anims.generateFrameNames("arrows", {
                start: 0,
                end: 2
            }),
            frameRate: 6,
            repeat: -1
        });
        this.leftArrow.play("idle");
        this.rightArrow = this.scene.add
            .sprite(x + 64, y, "arrows", 0)
            .setInteractive()
            .setFlipX(1);
        this.rightArrow.anims.create({
            key: "idle",
            frames: this.rightArrow.anims.generateFrameNames("arrows", {
                start: 0,
                end: 2
            }),
            frameRate: 6,
            repeat: -1
        });
        this.rightArrow.play("idle");

        this.rightArrow.on("pointerup", this.increaseValue, this);
        this.leftArrow.on("pointerup", this.decreaseValue, this);
    }

    increaseValue() {
        if (this.value < this.maxValue) {
            this.value++;
            this.valueText.setText(this.valueToText[this.value]);
        }
    }
    decreaseValue() {
        if (this.value > this.minValue) {
            this.value--;
            this.valueText.setText(this.valueToText[this.value]);
        }
    }
}