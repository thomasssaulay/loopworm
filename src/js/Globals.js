// DEBUG
export const DEBUG_MODE = false;
export const DEBUG_TILE_INFO = false;

// GAME CONSTANTS
export const STARTING_SPEED = 600;
export const SPEED_PER_HIT = 10;
export const STARTING_SIZE = 4;
export const SPEED_PER_PILL = 60;
export const START_WAVE_TIMER = 15000; //20000
export const ADD_TIME_PER_LOOP = 1000;
export const MIN_LOOP_TO_SPAWN_SPIKES = 2;
export const COOLDOWN_BUFF = 300;

export const PALETTE = [
    "0x222323",
    "0xf0f6f0"
];
export const PALETTE_HEX = [
    "#222323",
    "#f0f6f0"
];
export const ALTERNATIVE_PALETTE = [
    "0x382b26",
    "0xb8c2b9"
];
export const CARDS = {
    "Orb": {
        name: "Orb",
        cardType: "path",
        offsetSprite: 0,
        price: 2,
        cooldown: 3000,
        info: "Feed the worm\nwith it !"
    },
    "Fog": {
        name: "Fog",
        cardType: "path",
        offsetSprite: 7,
        price: 6,
        eraser: true,
        cooldown: 10000, // 10000
        info: "Makes stuff\ndisappears !"
    },
    "Dispenser": {
        name: "Dispenser",
        cardType: "coastal",
        spawns: "orb",
        spawnCooldown: 12000,
        offsetSprite: 1,
        price: 9,
        cooldown: 10000,
        info: "Drops one orb\nevery 12 seconds."
    },
    "Pill": {
        name: "Pill",
        cardType: "land",
        offsetSprite: 10,
        price: 11,
        speedBuff: SPEED_PER_PILL,
        cooldown: 10000,
        info: "Calm down\nthe worm."
    },
    "Mushroom": {
        name: "Mushroom",
        cardType: "land",
        offsetSprite: 3,
        cooldownBuff: COOLDOWN_BUFF,
        price: 14,
        cooldown: 10000,
        info: "Reduce cooldown\nof all the cards."
    },
    "Crystal": {
        name: "Crystal",
        cardType: "coastal",
        offsetSprite: 4,
        spawns: "fragment",
        spawnCooldown: 20000,
        price: 18,
        cooldown: 20000,
        info: "Drops one\ncrystal fragment\nevery 20 seconds."
    }
}