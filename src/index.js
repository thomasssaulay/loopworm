/**
 * Author: Thomas SAULAY
 */

import Phaser from 'phaser';

import SceneGameOver from "./js/scenes/SceneGameOver";
import SceneMainMenu from "./js/scenes/SceneMainMenu";
import SceneMain from "./js/scenes/SceneMain";

import * as Globals from "./js/Globals";

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: Globals.PALETTE[0],
    width: 800,
    height: 600,
    // zoom: 2,
    scene: [SceneMainMenu, SceneMain, SceneGameOver]
};

const game = new Phaser.Game(config);