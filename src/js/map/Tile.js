import Phaser from "phaser";
import * as ParticleManager from "../particles/ParticleManager";
import * as EntityManager from "../entities/EntityManager";
import * as Globals from "../Globals";

const neighboors = [
    [0, 1],
    [1, 0],
    [1, 1],
    [0, -1],
    [-1, 0],
    [-1, 1],
    [-1, -1],
    [1, -1]
];
const neighboors4 = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
];

export default class Tile extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, indX, indY, type = "land") {
        super(scene, x, y);

        this.scene = scene;
        this.x = x;
        this.y = y;
        this.indX = indX;
        this.indY = indY;
        this.pathInd = null;
        this.type = type;
        this.direction = 0;
        this.orientation = 0;
        this.contains = [];
        this.containsWorm = false;
        this.spawns = null;
        this.isSpawner = false;
        this.isProtected = false;
        this.spawnTiles = [];
        this.spawnTimer = null;
        this.cooldown = 0;
        this.maxCooldown = 0;
        this.direct_dmg = [null, 0];
        this.direct_money = [null, 0];
        this.direct_hp = 0;
        this.dmg_boost = 0;
        this.buff_area = 0;
        this.camouflage = false;
        this.isCoastal = false;
        this.isObstacle = false;

        this.sprite = this.scene.add.sprite(this.x, this.y, "").setDepth(2);
        this.topSprite = null;
        this.setTypeland();

        this.width = this.sprite.displayWidth;
        this.height = this.sprite.displayHeight;

        this.thickness = 3;
        this.contourShape = new Phaser.Geom.Polygon([
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.x + this.width / 2,
            this.y - this.height / 2,
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.x - this.width / 2,
            this.y + this.height / 2
        ]);
        this.contour = scene.add.graphics();
        this.contour.setDepth(10);

        this.on("pointerup", this.onPointerUpHandler).on(
            "pointerdown",
            this.onPointerDownHandler
        );
    }
    onPointerDownHandler() {
        this.contour.lineStyle(this.thickness, 0xffffff, 0.75);
        this.contour.strokePoints(this.contourShape.points, true);
    }
    onPointerUpHandler() {
        this.scene.clearContour();

        // // BUILD OPTIONS
        // A card is selected
        if (this.scene.buildCard !== false) {
            // Click on 'path' tile
            if (this.type === "path") {
                // Card is indeed path type
                if (this.scene.buildCard.data.cardType === "path" && this.scene.buildCard.name === "Orb" && this.contains.length === 0) {
                    EntityManager.spawnEntity(this.scene, "orb", this.scene.path[this.pathInd]);
                    this.scene.buildCard.disable();
                }

                if (this.scene.buildCard.data.eraser) {
                    // ERASER
                    if (this.scene.buildCard.data.eraser) {
                        this.contains.forEach(el => {
                            el.destroy();
                        });
                        let fogSprite = this.scene.add.sprite(
                            this.x,
                            this.y,
                            "builds",
                            21
                        ).setDepth(3);
                        this.scene.anims.create({
                            key: "idle",
                            frames: this.scene.anims.generateFrameNames("builds", {
                                start: 21,
                                end: 23
                            }),
                            frameRate: 6,
                            repeat: -1
                        });
                        fogSprite.play("idle");

                        ParticleManager.emitHealParticles(this.scene, this);
                        this.scene.buildCard.disable();

                        this.scene.time.delayedCall(2000, () => { fogSprite.destroy(); }, [], this);
                    }
                }


                this.scene.buildCard.setActive(false);
                this.scene.hud.hideCardInfo();
                this.scene.hud.toggleBuildOff();
            } // End of 'path' case


            // Click on 'land' tiles
            if (this.type === "land") {
                // If card is 'coastal' type
                if (this.scene.buildCard.data.cardType === "coastal") {
                    // If tile is indeed coastal
                    if (this.isCoastal) {
                        this.setTypeBuild(this.scene.buildCard);
                    }
                }
                // If card is 'land' type
                else if (this.scene.buildCard.data.cardType === "land") {
                    this.setTypeBuild(this.scene.buildCard);
                }
            }
        }

        // // SHOW BUILD INFO
        // if (this.type === "build") {
        //     // show buff area
        //     if (this.buff_area > 0) {
        //         for (let i = -this.buff_area; i <= this.buff_area; i++) {
        //             for (let j = -this.buff_area; j <= this.buff_area; j++) {
        //                 if (
        //                     this.indX + i >= 0 &&
        //                     this.indY + j >= 0 &&
        //                     this.indX + i < this.scene.mapConfig.x &&
        //                     this.indY + j < this.scene.mapConfig.y
        //                 ) {
        //                     const tile = this.scene.map[this.indX + i][this.indY + j];
        //                     if (tile !== undefined && tile !== this) {
        //                         tile.sprite.setTint(this.color);
        //                         this.scene.time.delayedCall(1500, () => {
        //                             tile.sprite.setTint(tile.backgroundColor);
        //                         });
        //                     }
        //                 }
        //             }
        //         }
        //     }
        //     // show 8 neighboors area
        //     if (this.isSpawner) {
        //         neighboors.forEach((n) => {
        //             const tile = this.scene.map[this.indX + n[0]][this.indY + n[1]];
        //             if (tile !== undefined && tile.type === "path") {
        //                 tile.sprite.setTint(this.color);
        //                 this.scene.time.delayedCall(1500, () => {
        //                     tile.sprite.setTint(tile.backgroundColor);
        //                 });
        //             }
        //         });
        //     }
        // }

        if (Globals.DEBUG_TILE_INFO) {
            console.warn("====== TILE INFO ======")
            console.warn("type", this.type)
            console.warn("direction", this.direction)
            console.warn("orientation", this.orientation)
            console.warn("pathInd", this.pathInd)
            console.warn("indX indY", this.indX, this.indY)
            console.warn("containsWorm", this.containsWorm)
            console.warn("contains", this.contains)
            console.warn("spawns", this.spawns)
            console.warn("spawnTiles", this.spawnTiles)
            console.warn("isProtected", this.isProtected)
            console.warn("=======================")
        }

        this.contour.clear();
    }

    setTypePath() {
        // 0 - vertical | 1 - StoE | 2 - WtoS
        // 3 - horizontal | 4 - NtoE | 5 - WtoN
        this.type = "path";
        if (this.sprite.anims.currentAnim !== null) {
            this.sprite.anims.currentAnim.destroy();
        }
        this.sprite.setTexture("path", this.direction).clearTint().setDepth(2);
        if (this.topSprite !== null) this.topSprite.destroy();
        this.topSprite = null;
    }
    setCoastal() {
        this.isCoastal = true;
    }
    unsetCoastal() {
        this.isCoastal = false;
    }
    setTypeland() {
        this.type = "land";
        this.direction = 0;
        this.sprite.setTexture(this.type, Phaser.Math.Between(0, 2));
        const r = Math.random();
        if (r < 0.16) {
            let frame = 0;
            if (r < 0.07) {
                frame = 3;
            }
            if (r >= 0.07 && r < 0.13) {
                frame = 6;
            }
            if (r >= 0.13 && r < 0.15) {
                frame = 9;
                this.isObstacle = true;
            }
            if (r >= 0.15 && r < 0.16) {
                frame = 12;
            }
            this.topSprite = this.scene.add.sprite(this.x, this.y, this.type, frame).setDepth(3);
            this.topSprite.anims.create({
                key: "idle",
                frames: this.anims.generateFrameNames(this.type, {
                    start: frame,
                    end: frame + 2
                }),
                frameRate: 6,
                repeat: -1
            });
            this.topSprite.play("idle");

        }
        // Hilighting sprite, only shown when clicking on a corresponding cuild card
        this.hilightSprite = this.scene.add.sprite(this.x, this.y, "land", 15).setDepth(4).setAlpha(0);
        this.hilightSprite.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNames("land", {
                start: 15,
                end: 17
            }),
            frameRate: 6,
            repeat: -1
        });
        this.hilightSprite.play("idle");
    }

    setTypeBuild(card) {
        this.type = "build";

        // Hide card info
        this.scene.hud.hideCardInfo();

        // Build sprite
        if (this.topSprite !== null) {
            this.topSprite.destroy();
            this.topSprite = null;
        }
        this.topSprite = this.scene.add.sprite(
            this.x,
            this.y,
            "builds",
            card.data.offsetSprite * 3
        ).setDepth(3);
        this.topSprite.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNames("builds", {
                start: card.data.offsetSprite * 3,
                end: card.data.offsetSprite * 3 + 2
            }),
            frameRate: 6,
            repeat: -1
        });
        this.topSprite.play("idle");

        // EMIT PARTICLES
        ParticleManager.emitBuildarticles(
            this.scene,
            this
        );

        // DIRECT BUFF
        if (card.data.speedBuff > 0) this.scene.worm.speed += card.data.speedBuff;
        if (card.data.cooldownBuff > 0) {
            this.scene.hud.HUDCards.forEach(c => {
                if (c.cooldown > 300)
                    c.cooldown -= card.data.cooldownBuff;
            });
        }

        // SPAWNER
        if (card.data.spawns && this.isCoastal) {
            this.scene.spawnerList.push(this);
            neighboors.forEach((n) => {
                const tile = this.scene.map[this.indX + n[0]][this.indY + n[1]];
                if (tile !== undefined) {
                    if (tile.type === "path") {
                        this.isSpawner = true;
                        this.maxCooldown = card.data.spawnCooldown;
                        this.cooldown = card.data.spawnCooldown;
                        this.spawns = card.data.spawns;
                        this.spawnTiles.push(tile);
                    }
                }
            });
            this.spawnTimer = this.scene.time.addEvent({
                delay: this.maxCooldown,
                callback: () => {
                    // Spawns the entity every cooldown
                    // First get the occupied tiles off
                    let selectedTile = this.spawnTiles.filter(t => t.contains.length === 0);
                    // Then random pick between the rest
                    selectedTile = Phaser.Math.RND.pick(selectedTile);
                    // Then spawn the shit
                    EntityManager.spawnEntity(this.scene, this.spawns, selectedTile);
                },
                callbackScope: this,
                loop: true
            });
        }

        // SHIELD
        if (card.data.shield && this.isCoastal) {
            this.scene.spawnerList.push(this);
            neighboors.forEach((n) => {
                const tile = this.scene.map[this.indX + n[0]][this.indY + n[1]];
                if (tile !== undefined)
                    if (tile.type === "path")
                    // if (n.type === 'path')
                        tile.isProtected = true;

            });
            this.spawnTimer = this.scene.time.addEvent({
                delay: this.maxCooldown,
                callback: () => {
                    // Spawns the entity every cooldown
                    // First get the occupied tiles off
                    let selectedTile = this.spawnTiles.filter(t => t.contains.length === 0);
                    // Then random pick between the rest
                    selectedTile = Phaser.Math.RND.pick(selectedTile);
                    // Then spawn the shit
                    EntityManager.spawnEntity(this.scene, this.spawns, selectedTile);
                },
                callbackScope: this,
                loop: true
            });
        }

        this.scene.hud.toggleBuildOff();
        card.disable();
        this.scene.emitUpdateHud();

    }

    eraseMobs() {
        this.contains.forEach((mob) => {
            mob.kill();
        });
        this.contains = [];
    }
}