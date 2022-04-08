import Phaser from "phaser";
import * as Globals from "../Globals"

export default class SceneGameOver extends Phaser.Scene {
  constructor(key) {
    super({ key: "SceneGameOver" });
  }

  init(data) {
    this.data = data;
  }

  preload() {
    this.load.setPath("./src/assets");
    this.load.spritesheet("titlescreen", "sprites/hud/titlescreen.png", {
      frameWidth: 470,
      frameHeight: 270
    });
    this.load.spritesheet("button", "sprites/hud/button.png", {
      frameWidth: 96,
      frameHeight: 48
    });
  }

  create() {
    this.height = this.cameras.main.height;
    this.width = this.cameras.main.width;

    this.scene.stop("Hud");

    this.title = this.add.sprite(this.width / 2, 128, "titlescreen", 0).setOrigin(0.5, 0.5).setScale(.5);
    this.title.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNames("titlescreen", {
        start: 0,
        end: 2
      }),
      frameRate: 6,
      repeat: -1
    });
    this.title.play("idle");


    let msg = "";
    if (this.data.win) msg = "Congrats !\nYou won !";
    else msg = "Sorry !\nWorm is DED.\nTry again...";

    this.message = this.add
      .text(this.width / 2, this.height / 2, msg, {
        font: "35pt PearSoda",
        align: "center",
        color: Globals.PALETTE_HEX[1]
      })
      .setOrigin(0.5, 0.5);

    if (this.data.win)
      this.scoreText = this.add
        .text(this.width / 2, this.height / 2 + 64, "You suceeded in " + this.data.loopCount + " loops.", {
          font: "25pt PearSoda",
          align: "center",
          color: Globals.PALETTE_HEX[1]
        })
        .setOrigin(0.5, 0.5);

    this.buttonSprite = this.add
      .sprite(this.width / 2, this.height / 2 + 128, "button")
      .setOrigin(0.5, 0.5)
      .setInteractive();
    this.buttonSprite.on("pointerup", this.onBackToMenu, this);
    this.buttonSprite.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNames("button", { start: 0, end: 2 }),
      frameRate: 6,
      repeat: -1
    });
    this.buttonSprite.play("idle");
    this.buttonText = this.add
      .text(this.buttonSprite.x + 2, this.buttonSprite.y, "BACK", {
        font: "14pt pearsoda",
        color: "white"
      })
      .setOrigin(0.5, 0.5);
  }

  onBackToMenu() {
    this.scene.start("SceneMainMenu");
  }
}