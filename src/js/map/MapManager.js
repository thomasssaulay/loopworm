import Tile from "./Tile";

export function drawMap(scene, size, offsetFromCenter = { x: 0, y: 0 }) {
    const spriteSize = 32;
    const start = {
        x: (scene.width - (size.x - 1) * spriteSize) / 2,
        y: (scene.height - (size.y - 1) * spriteSize) / 2
    };

    let map = [];

    for (let i = 0; i < size.x; i++) {
        map[i] = [];
        for (let j = 0; j < size.y; j++) {
            map[i][j] = new Tile(
                scene,
                start.x + i * spriteSize + offsetFromCenter.x,
                start.y + j * spriteSize + offsetFromCenter.y,
                i,
                j,
                "land"
            ).setInteractive();
        }
    }

    return map;
}

export function drawPath(map, border) {
    // 0 - vertical | 1 - StoE | 2 - WtoS
    // 3 - horizontal | 4 - NtoE | 5 - WtoN
    const smoothCorners = 3;
    const radius = { x: map.length - border - 1, y: map[0].length - border - 1 };
    const deviationChance = 0.26;
    let deviations = 0;

    let path = [];

    let cursor = { x: radius.x, y: border };
    path.push(map[cursor.x][cursor.y]);
    path[path.length - 1].direction = 2;
    // adding tiles to path
    // NE to NW
    while (cursor.x > border) {
        cursor.x -= 1;
        path.push(map[cursor.x][cursor.y]);
        path[path.length - 1].direction = 3;
        if (
            Math.random() < deviationChance &&
            cursor.x > border + smoothCorners &&
            cursor.x < radius.x - smoothCorners &&
            deviations < map[0].length / 2 - border - 1
        ) {
            cursor.y += 1;
            path[path.length - 1].direction = 1;
            path.push(map[cursor.x][cursor.y]);
            path[path.length - 1].direction = 5;
            deviations++;
        }
    }
    deviations = 0;
    path[path.length - 1].direction = 1;

    // NW to SW
    while (cursor.y < radius.y) {
        cursor.y += 1;
        path.push(map[cursor.x][cursor.y]);
        if (
            Math.random() < deviationChance &&
            cursor.y < radius.y - smoothCorners &&
            cursor.y > border + smoothCorners &&
            deviations < map.length / 2 - border - 1
        ) {
            cursor.x += 1;
            path.push(map[cursor.x][cursor.y]);
            deviations++;
        }
    }
    deviations = 0;
    path[path.length - 1].direction = 4;

    // SW to SE
    while (cursor.x < radius.x) {
        cursor.x += 1;
        path.push(map[cursor.x][cursor.y]);
        path[path.length - 1].direction = 3;
        if (
            Math.random() < deviationChance &&
            cursor.x < radius.x - smoothCorners &&
            cursor.x > border + smoothCorners &&
            deviations < map[0].length / 2 - border - 1
        ) {
            cursor.y -= 1;
            path[path.length - 1].direction = 5;
            path.push(map[cursor.x][cursor.y]);
            path[path.length - 1].direction = 1;
            deviations++;
        }
    }
    deviations = 0;
    path[path.length - 1].direction = 5;

    // SE to NE
    while (cursor.y > border) {
        cursor.y -= 1;
        path.push(map[cursor.x][cursor.y]);
        if (
            Math.random() < deviationChance &&
            cursor.y > border + smoothCorners &&
            cursor.y < radius.y - smoothCorners &&
            deviations < map.length / 2 - border - 1
        ) {
            cursor.x -= 1;
            path.push(map[cursor.x][cursor.y]);
            deviations++;
        }
    }

    // remove extra parts if any
    while (cursor.x < radius.x) {
        cursor.x += 1;
        const toRemove = path.find(
            (tile) => tile.indX === cursor.x && tile.indY === cursor.y
        );
        path.splice(path.indexOf(toRemove), 1);
    }
    if (path[path.length - 1] !== path[0]) {
        path.pop();
    }

    // remove extra overlapping tile
    path.pop();

    // DRAW FINAL PATH
    path.forEach((tile, i) => {
        tile.setTypePath();
        tile.pathInd = i;
    });

    // ADD COAST LIST
    let coastTiles = [];
    path.forEach((tile) => {
        const neighboors = [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0],
            [-1, -1],
            [1, 1],
            [1, -1],
            [-1, 1]
        ];
        neighboors.forEach((n) => {
            const neightboorTile = map[tile.indX + n[0]][tile.indY + n[1]];
            if (
                neightboorTile.type === "land" &&
                !coastTiles.includes(neightboorTile)
            ) {
                coastTiles.push(neightboorTile);
                neightboorTile.setCoastal();
            }
        });
    });

    return path;
}

export function clearMap(map) {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            map[i][j].sprite.destroy();
            map[i][j].destroy();
            map[i][j] = null;
        }
    }
}