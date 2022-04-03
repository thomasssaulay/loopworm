export function emitDamageParticles(scene, target, dmg, color = "#ffffff") {
    let dmgText = scene.add
        .text(target.x, target.y - 60, dmg, {
            font: "28pt pearsoda",
            color: color
        })
        .setOrigin(0.5, 0.5);
    scene.tweens.add({
        targets: dmgText,
        alpha: 0,
        y: "-=80",
        ease: "Linear",
        duration: 2000,
        onComplete: function(tween, targets) {
            targets[0].destroy();
        }
    });
}
export function emitHurtParticles(scene, target, color = 0xffffff) {
    let particles = scene.add
        .particles("shot")
        .setDepth(5)
        .createEmitter({
            x: target.x,
            y: target.y,
            angle: { min: 0, max: 360 },
            speed: { min: -100, max: 100 },
            lifespan: 1500,
            scale: { start: 1, end: 0.0 },
            blendMode: "ADD",
            quantity: 20,
            tint: color,
            on: true
        });
    particles.explode();
}
export function emitDeathParticles(scene, target, color = 0xffffff) {
    let particles = scene.add
        .particles("shot")
        .setDepth(5)
        .createEmitter({
            x: target.x,
            y: target.y,
            angle: { min: 0, max: 360 },
            speed: { min: -50, max: 50 },
            lifespan: 2000,
            scale: { start: 4, end: 0.0 },
            blendMode: "ADD",
            quantity: 40,
            tint: color,
            on: true
        });
    particles.explode();
}

export function emitBuildarticles(scene, target, color = 0xffffff) {
    let particles = scene.add
        .particles("shot")
        .setDepth(5)
        .createEmitter({
            x: target.x,
            y: target.y,
            angle: { min: 0, max: 360 },
            speed: { min: -50, max: 50 },
            lifespan: 1000,
            gravityY: 120,
            scale: { start: 1.5, end: 0.0 },
            blendMode: "NORMAL",
            quantity: 20,
            tint: color,
            on: true
        });
    particles.explode();
}

export function emitMoneyParticles(
    scene,
    target,
    destination,
    qt = 5,
    color = 0xffffff
) {
    let spriteList = [];
    for (let i = 0; i < qt; i++) {
        const randSize = Math.random() * (0.8 - 0.3) + 0.3;
        spriteList.push(scene.add.sprite(target.x, target.y, "money"));
        spriteList[i]
            .setTint(color)
            .setDepth(5)
            .setScale(randSize)
            .setVisible(false);
        scene.tweens.add({
            targets: spriteList[i],
            x: destination.x,
            y: destination.y,
            delay: 500 + i * 50,
            ease: "Power2",
            duration: 1500,
            onStart: function(tween, targets) {
                targets[0].setVisible(true);
            },
            onComplete: function(tween, targets) {
                targets[0].destroy();
            }
        });
    }
}
export function emitFogParticle(scene, target, color = 0xffffff) {
    const fog = scene.add
        .sprite(target.x, target.y, "buildings", 27)
        .setScale(0.1)
        .setTint(color);

    scene.tweens.add({
        targets: fog,
        scale: 1.5,
        yoyo: true,
        ease: "Power2",
        duration: 1000,
        onComplete: function(tween, targets) {
            targets[0].destroy();
        }
    });
}