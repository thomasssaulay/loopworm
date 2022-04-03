import Phaser from "phaser";
import Worm from "../entities/Worm";
import * as MapManager from "../map/MapManager"
import * as Globals from "../Globals"

export default class SceneMain extends Phaser.Scene {
    constructor() {
        super({ key: "SceneMain" });
    }

    preload() {
        this.load.setPath("./src/assets");

        this.load.spritesheet("path", "sprites/world/path.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("land", "sprites/world/land.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("worm", "sprites/entities/worm.png", {
            frameWidth: 48,
            frameHeight: 48
        });
    }

    create() {
        const { width, height } = this.sys.game.config;
        this.width = width;
        this.height = height;

        new FontFace("PearSoda", "url(./src/assets/fonts/PearSoda.ttf)").load().then(function(loaded) {
            document.fonts.add(loaded);
        }).catch(function(error) {
            return error;
        });

        this.mapConfig = { x: 20, y: 12, border: 2 };
        this.map = MapManager.drawMap(this, this.mapConfig, { x: 0, y: -32 });
        this.path = MapManager.drawPath(this.map, this.mapConfig.border);

        this.worm = new Worm(this, this.path[0]);
        // this.worm.moveOnPath(this.path);
        this.worm.moveToNextTile();

        this.add
            .text(width / 2, 30, "LoooooopWorm", {
                font: "25pt PearSoda",
                color: Globals.PALETTE_HEX[1]
            })
            .setOrigin(0.5, 0.5);

        this.handleInputs();
    }

    update(time, delta) {}

    handleInputs() {
        this.input.keyboard.on("keydown", (event) => {
            if (event.code === "ArrowLeft") {
                // this.worm.decSize();
                this.worm.decSize();
            }
            if (event.code === "ArrowRight") {
                this.worm.incSize();
            }
            if (event.code === "ArrowUp") {
                this.add.tween({
                    targets: this.worm.bodyPartList[0].sprite,
                    duration: 200,
                    ease: "Linear",
                    angle: this.worm.bodyPartList[0].sprite.angle - 90
                });
            }
            if (event.code === "ArrowDown") {
                this.add.tween({
                    targets: this.worm.bodyPartList[0].sprite,
                    duration: 200,
                    ease: "Linear",
                    angle: this.worm.bodyPartList[0].sprite.angle + 90
                });
            }
        });
    }

    clearContour() {
        this.map.forEach((t) => {
            t.forEach((tc) => {
                tc.contour.clear();
            });
        });
    }
}