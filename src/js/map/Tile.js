import Phaser from "phaser";
import * as ParticleManager from "../particles/ParticleManager";
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
const TILE_COLORS = [0x6b4cb6, 0x201737, 0xc79370, 0x20de8b];

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
        this.contains = [];
        this.spawns = null;
        this.isSpawner = false;
        this.spawnTiles = [];
        this.cooldown = 0;
        this.maxCooldown = 0;
        this.direct_dmg = [null, 0];
        this.direct_money = [null, 0];
        this.direct_hp = 0;
        this.dmg_boost = 0;
        this.buff_area = 0;
        this.camouflage = false;
        this.isCoastal = false;
        this.color = 0x101010;
        this.backgroundColor = 0x101010;

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
        // let containsString = "";
        // if (this.contains.length > 0) {
        //     this.contains.forEach((c) => (containsString += c.name));
        //     console.log("contains " + containsString);
        // }
        // if (this.isSpawner) {
        //     ParticleManager.emitDamageParticles(
        //         this.scene,
        //         this.sprite,
        //         this.cooldown
        //     );
        // }

        // // BUILD OPTIONS
        // if (this.scene.buildMode !== false) {
        //     if (this.scene.buildMode.eraser) {
        //         if (this.type === "path") {
        //             this.scene.buildMode.remove();
        //             ParticleManager.emitFogParticle(
        //                 this.scene,
        //                 this,
        //                 this.scene.player[this.scene.currentPlayer].color
        //             );
        //             this.eraseMobs();
        //             this.scene.hud.hideCardInfo();
        //             this.scene.hud.toggleBuildOff();
        //             this.scene.hud.toggleDiceOn();
        //             this.scene.emitUpdateHud();
        //         }
        //     } else {
        //         if (this.type === "land") {
        //             if (this.scene.buildMode.coastal) {
        //                 if (this.isCoastal) this.setTypeBuilding(this.scene.buildMode);
        //             } else {
        //                 this.setTypeBuilding(this.scene.buildMode);
        //             }
        //         }
        //     }
        // }

        // // SHOW BUILD INFO
        // if (this.type === "building") {
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

        console.warn(this.direction)
        console.warn(this.indX, this.indY)

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
        this.backgroundColor = TILE_COLORS[0];
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
                // weed
                frame = 3;
                this.color = TILE_COLORS[3];
            }
            if (r >= 0.07 && r < 0.13) {
                // small weed
                frame = 6;
                this.color = TILE_COLORS[3];
            }
            if (r >= 0.13 && r < 0.15) {
                // rocks
                frame = 9;
                this.color = TILE_COLORS[2];
            }
            if (r >= 0.15 && r < 0.16) {
                // small rocks
                frame = 12;
                this.color = TILE_COLORS[2];
            }
            this.topSprite = this.scene.add.sprite(this.x, this.y, this.type, frame);
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
    }
    setTypeBuilding(card) {
        this.type = "building";

        // HIDE CARD INFO
        this.scene.hud.hideCardInfo();

        // BUILDING SPRITE
        if (this.topSprite !== null) {
            this.topSprite.destroy();
            this.topSprite = null;
        }
        this.topSprite = this.scene.add.sprite(
            this.x,
            this.y,
            "buildings",
            card.spriteOffset
        );
        this.color = card.owner.color;
        this.topSprite.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNames("buildings", {
                start: card.spriteOffset,
                end: card.spriteOffset + 2
            }),
            frameRate: 6,
            repeat: -1
        });
        this.topSprite.play("idle");

        // EMIT PARTICLES
        ParticleManager.emitBuildarticles(
            this.scene,
            this,
            parseInt(this.color, 16)
        );

        // PAY THE BUILDING
        card.owner.substractMoney(card.price);

        // DIRECT BUFF
        if (card.hp_boost > 0) card.owner.addMaxHP(card.hp_boost);
        if (card.dmg_boost > 0 && card.buff_area === undefined)
            card.owner.addDMG(card.dmg_boost);

        // SPAWNER RELATED
        if (card.spawns && this.isCoastal) {
            this.scene.spawnerList.push(this);
            neighboors.forEach((n) => {
                const tile = this.scene.map[this.indX + n[0]][this.indY + n[1]];
                if (tile !== undefined) {
                    if (tile.type === "path") {
                        this.isSpawner = true;
                        this.maxCooldown = card.cooldown;
                        this.cooldown = card.cooldown;
                        this.spawns = card.spawns;
                        this.spawnTiles.push(tile);
                    }
                }
            });
        }

        // BUFF AREA RELATED
        if (card.buff_area > 0) {
            this.buff_area = card.buff_area;
            for (let i = -card.buff_area; i <= card.buff_area; i++) {
                for (let j = -card.buff_area; j <= card.buff_area; j++) {
                    if (
                        this.indX + i >= 0 &&
                        this.indY + j >= 0 &&
                        this.indX + i < this.scene.mapConfig.x &&
                        this.indY + j < this.scene.mapConfig.y
                    ) {
                        const tile = this.scene.map[this.indX + i][this.indY + j];
                        if (tile !== undefined && tile !== this && tile.type === "path") {
                            if (card.direct_hp > 0) tile.direct_hp = card.direct_hp;
                            if (card.dmg_boost > 0) tile.dmg_boost = card.dmg_boost;
                            if (card.camouflage) {
                                tile.camouflage = card.owner;
                            }
                        }
                    }
                }
            }
        }

        // DIRECT DAMAGE
        if (card.direct_dmg) {
            neighboors4.forEach((n) => {
                const tile = this.scene.map[this.indX + n[0]][this.indY + n[1]];
                if (tile !== undefined) {
                    if (tile.type === "path") {
                        tile.direct_dmg[1] = card.direct_dmg;
                        tile.direct_dmg[0] = card.owner;
                    }
                }
            });
        }
        // DIRECT MONEY
        if (card.direct_money) {
            neighboors4.forEach((n) => {
                const tile = this.scene.map[this.indX + n[0]][this.indY + n[1]];
                if (tile !== undefined) {
                    if (tile.type === "path") {
                        tile.direct_money[1] = card.direct_money;
                        tile.direct_money[0] = card.owner;
                    }
                }
            });
        }

        this.scene.hud.toggleBuildOff();
        this.scene.hud.toggleDiceOn();
        card.remove();
        this.scene.emitUpdateHud();

        //UPDATE AVAILABLE TILE LIST
        if (card.coastal === true)
            this.scene.availableCoastalTiles.splice(
                this.scene.availableCoastalTiles.indexOf(this),
                1
            );
        else
            this.scene.availableLandTiles.splice(
                this.scene.availableLandTiles.indexOf(this),
                1
            );
    }

    eraseMobs() {
        this.contains.forEach((mob) => {
            mob.kill();
        });
        this.contains = [];
    }
}