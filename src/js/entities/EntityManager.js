import Orb from "./Orb";
import Spike from "./Spike";

export function spawnOrbAtRandom(scene) {
    const randomTile = Phaser.Math.RND.pick(scene.path);

    scene.orbs.push(new Orb(scene, randomTile));
    randomTile.contains.push(scene.orbs[scene.orbs.length - 1]);
}
export function spawnSpikeAtRandom(scene) {
    const randomTile = Phaser.Math.RND.pick(scene.path);

    scene.spikes.push(new Spike(scene, randomTile));
    randomTile.contains.push(scene.spikes[scene.spikes.length - 1]);
}