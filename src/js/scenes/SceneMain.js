import Phaser from "phaser";
import * as MapManager from "../map/MapManager"
import * as EntityManager from "../entities/EntityManager"
import * as Globals from "../Globals"
import Worm from "../entities/Worm";
import Orb from "../entities/Orb";
import LoadingBar from "../hud/LoadingBar";

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
        this.load.spritesheet("orb", "sprites/entities/orb.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("norb", "sprites/entities/norb.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("spike", "sprites/entities/spike.png", {
            frameWidth: 32,
            frameHeight: 32
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
        this.availablePath = this.path;

        this.orbs = [];
        this.spikes = [];

        this.worm = new Worm(this, this.path[0]);
        // this.worm.moveOnPath(this.path);
        this.worm.moveToNextTile();

        this.bar = new LoadingBar(this, 128, 48, 80, 100);

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
                EntityManager.spawnSpikeAtRandom(this);
            }
            if (event.code === "ArrowDown") {
                EntityManager.spawnOrbAtRandom(this);
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