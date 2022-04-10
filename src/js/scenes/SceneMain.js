import Phaser from "phaser";
import * as MapManager from "../map/MapManager"
import * as EntityManager from "../entities/EntityManager"
import * as Globals from "../Globals"
import Worm from "../entities/Worm";

export default class SceneMain extends Phaser.Scene {
    constructor() {
        super({ key: "SceneMain" });
    }

    init(data) {
        this.data = data;
    }

    preload() {
        this.load.setPath("./src/assets");

        // WORLD
        this.load.spritesheet("path", "sprites/world/path.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("land", "sprites/world/land.png", {
            frameWidth: 32,
            frameHeight: 32
        });

        // ENTITIES
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
        this.load.spritesheet("fragment", "sprites/entities/fragment.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("spike", "sprites/entities/spike.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("spike_particle", "sprites/entities/spike_particle.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("builds", "sprites/entities/builds.png", {
            frameWidth: 32,
            frameHeight: 32
        });

        // HUD
        this.load.spritesheet("quit", "sprites/hud/quit.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("card", "sprites/hud/card.png", {
            frameWidth: 72,
            frameHeight: 96
        });
        this.load.spritesheet("infocard", "sprites/hud/infocard.png", {
            frameWidth: 96,
            frameHeight: 64
        });

        // AUDIO
        this.load.audio("eat1", "audio/eat1.mp3");
        this.load.audio("eat2", "audio/eat2.mp3");
        this.load.audio("eat3", "audio/eat3.mp3");
        this.load.audio("hurt1", "audio/hurt1.mp3");
        this.load.audio("hurt2", "audio/hurt2.mp3");
        this.load.audio("hurt3", "audio/hurt3.mp3");
    }

    create() {
        const { width, height } = this.sys.game.config;
        this.width = width;
        this.height = height;

        // Draw the map, then draw a procedurally generated path according to difficulty
        if (this.data.difficulty === 2) this.mapConfig = { x: 24, y: 12, border: 2 }; // HARD
        if (this.data.difficulty === 1) this.mapConfig = { x: 20, y: 12, border: 2 }; // NORMAL
        if (this.data.difficulty === 0) this.mapConfig = { x: 16, y: 10, border: 2 }; // EASY

        this.map = MapManager.drawMap(this, this.mapConfig, { x: 0, y: -32 });
        this.path = MapManager.drawPath(this.map, this.mapConfig.border);

        // List of spawning tiles for later update
        this.spawnerList = []

        // Initialize entities lists
        this.orbs = [];
        this.norbs = [];
        this.spikes = [];

        this.worm = new Worm(this, this.path[0]);
        this.worm.moveToNextTile();

        // Current selected card 
        this.buildCard = false;

        // Starting spawn
        EntityManager.spawnEntity(this, "spike", this.path[Phaser.Math.Between(this.path.length / 2 - 5, this.path.length / 2 + 5)]);
        EntityManager.spawnEntity(this, "orb", this.path[Phaser.Math.Between(this.path.length / 4 - 5, this.path.length / 4 + 5)]);

        // First update of paths
        this.availableCoastalTiles = [];
        this.availableLandTiles = [];
        this.availablePathIncludingWorm = [];
        this.availablePathExludingWorm = [];
        this.updateAvailablePath();

        // Initialize HUD scene
        // Re-run it if already loaded in a previous run
        this.hud = this.scene.get("Hud");
        if (!this.hud.scene.isActive())
            this.scene.run("Hud");
        this.hud.initHudScene();

        // Keyboard and mouse inputs handler
        this.handleInputs();

        // First update of the hud
        // this.time.delayedCall(1000, () => this.emitUpdateHud(), [], this);
        this.emitUpdateHud();
    }


    update(time, delta) {}

    handleInputs() {
        if (Globals.DEBUG_MODE) {
            this.input.keyboard.on("keydown", (event) => {
                if (event.code === "ArrowLeft") {
                    this.worm.decSize();
                }
                if (event.code === "ArrowRight") {
                    this.worm.incSize();
                }
                if (event.code === "ArrowUp") {
                    this.hud.HUDCards[0].startCooldown();
                }
                if (event.code === "ArrowDown") {
                    this.hud.HUDCards[0].stopCooldown();
                }
            });
        }
    }

    emitUpdateHud() {
        // Update HUD event
        this.events.emit("updateHud");
    }

    updateAvailablePath() {
        // Compute available path
        this.availablePathIncludingWorm = this.path.filter(tile => (tile.contains.length === 0 && !tile.isProtected));
        this.availablePathExludingWorm = this.availablePathIncludingWorm.filter(tile => tile.containsWorm === false);

        // NOT VERY EFFICIENT :: TODO
        this.availableCoastalTiles = [];
        this.availableLandTiles = [];
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[0].length; j++) {
                if (this.map[i][j].type === "land" && this.map[i][j].isCoastal && !this.map[i][j].isObstacle)
                    this.availableCoastalTiles.push(this.map[i][j]);
                // If is land and not obstacle
                if (this.map[i][j].type === "land" && !this.map[i][j].isObstacle)
                    this.availableLandTiles.push(this.map[i][j]);
            }
        }


        if (Globals.DEBUG_MODE) {
            this.path.forEach(t => t.sprite.setTint(0xff0000));
            this.availablePathExludingWorm.forEach(t => t.sprite.clearTint());
        }
    }

    clearContour() {
        // Clears the tile contouring on mouseUp
        this.map.forEach((t) => {
            t.forEach((tc) => {
                tc.contour.clear();
            });
        });
    }

    shakeCamera(intensity, time = 250) {
        // Camera shake effect
        this.cameras.main.shake(time, intensity / 100);
    }

    onWinGame() {
        // Go to win screen after 2sec
        this.hud.stopWaveTimer();
        this.time.delayedCall(2000, () => {
            this.scene.start("SceneGameOver", { win: true, loopCount: this.worm.loopCount });
        }, [], this);
    }
}