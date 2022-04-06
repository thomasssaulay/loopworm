import Phaser from "phaser";
import * as MapManager from "../map/MapManager"
import * as EntityManager from "../entities/EntityManager"
import * as Globals from "../Globals"
import Worm from "../entities/Worm";

export default class SceneMain extends Phaser.Scene {
    constructor() {
        super({ key: "SceneMain" });
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
        this.load.spritesheet("spike", "sprites/entities/spike.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("spike_particle", "sprites/entities/spike_particle.png", {
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

    }

    create() {
        const { width, height } = this.sys.game.config;
        this.width = width;
        this.height = height;

        this.buildMode = false;

        // Load main font -- useless now
        // new FontFace("PearSoda", "url(./src/assets/fonts/PearSoda.ttf)").load().then(function(loaded) {
        //     document.fonts.add(loaded);
        // }).catch(function(error) {
        //     return error;
        // });

        // Draw the map, then draw a procedurally generated path 
        this.mapConfig = { x: 20, y: 12, border: 2 };
        this.map = MapManager.drawMap(this, this.mapConfig, { x: 0, y: -32 });
        this.path = MapManager.drawPath(this.map, this.mapConfig.border);

        // TODO :: COMPUTE AVAILABLE PATH
        // 
        // 
        // 
        //         
        this.availablePath = this.path;


        // Initialize entities lists
        this.orbs = [];
        this.spikes = [];

        this.worm = new Worm(this, this.path[0]);
        this.worm.moveToNextTile();

        EntityManager.spawnSpike(this, this.path[9]);
        EntityManager.spawnOrb(this, this.path[11]);

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
        this.input.keyboard.on("keydown", (event) => {
            if (event.code === "ArrowLeft") {
                this.worm.decSize();
            }
            if (event.code === "ArrowRight") {
                this.worm.incSize();
            }
            if (event.code === "ArrowUp") {
                // EntityManager.spawnSpikeAtRandom(this);
                this.hud.HUDCards[0].startCooldown();
            }
            if (event.code === "ArrowDown") {
                // EntityManager.spawnOrbAtRandom(this);
                this.hud.HUDCards[0].stopCooldown();
            }
        });
    }

    emitUpdateHud() {
        // Update HUD event
        this.events.emit("updateHud");
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
}