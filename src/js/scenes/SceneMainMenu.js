import Phaser from "phaser";
import SlideButton from "../hud/SlideButton"
import * as Globals from "../Globals"

export default class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super({ key: "SceneMainMenu" });
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
    this.load.spritesheet("arrows", "sprites/hud/arrows.png", {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  create() {
    this.height = this.cameras.main.height;
    this.width = this.cameras.main.width;

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


    this.message = this.add
      .text(this.width / 2, this.height / 2 - 86, "a game about a worm that\ntries to bite his own tail", {
        font: "16pt PearSoda",
        align: "center",
        color: Globals.PALETTE_HEX[1]
      })
      .setOrigin(0.5, 0.5);

    this.difficultySlide = new SlideButton(
      this,
      this.width / 2,
      this.height / 2 + 64,
      "Difficulty",
      1
    );

    this.buttonSprite = this.add
      .sprite(this.width / 2, this.height / 2 + 192, "button")
      .setOrigin(0.5, 0.5)
      .setInteractive();
    this.buttonSprite.on("pointerup", this.onStartGame, this);
    this.buttonSprite.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNames("button", { start: 0, end: 2 }),
      frameRate: 6,
      repeat: -1
    });
    this.buttonSprite.play("idle");
    this.buttonText = this.add
      .text(this.buttonSprite.x + 2, this.buttonSprite.y, "START", {
        font: "14pt pearsoda",
        color: Globals.PALETTE_HEX[1]
      })
      .setOrigin(0.5, 0.5);

    this.creditText = this.add
      .text(this.width / 2, this.height - 32, "..EpicRamen3D 2022 // Made for Black And White gamejam #8.. ", {
        font: "14pt pearsoda",
        align: "center",
        color: Globals.PALETTE_HEX[1]
      })
      .setOrigin(0.5, 0.5);
  }

  onStartGame() {
    this.scene.start("SceneMain", { difficulty: this.difficultySlide.value });
  }
}