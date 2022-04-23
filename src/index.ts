import * as PIXI from "pixi.js";
import CelestialBody from "./CelestialBody";

const app = new PIXI.Application();
document.body.appendChild(app.view);

function randFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randInt(min: number, max: number) {
  return Math.round(randFloat(min, max));
}

const fpsText = new PIXI.Text("", new PIXI.TextStyle({
  fill: "white",
}));
fpsText.position.set(10, 10);
app.stage.addChild(fpsText);

const GRAVITATIONAL_CONSTANT = 700;
const EPSILON = 20; 

let bodies = [
  new CelestialBody(8, randInt(0, 0xFFFFFF), 25, true),
  new CelestialBody(5, randInt(0, 0xFFFFFF), 25),
  new CelestialBody(5, randInt(0, 0xFFFFFF), 25),
];

for (const body of bodies) {
  app.stage.addChild(body.pixiTrailGraphics);
}

for (const body of bodies) {
  app.stage.addChild(body.pixiGraphics);
}

for (const body of bodies) {
  if (body.fixed) {
    body.pixiGraphics.x = app.renderer.width / 2;
    body.pixiGraphics.y = app.renderer.height / 2;
  } else {
    body.pixiGraphics.x = randFloat(0, app.renderer.width);
    body.pixiGraphics.y = randFloat(0, app.renderer.height);
    body.velocity.set(randFloat(-5, 5), randFloat(-5, 5));
  }
}

function updateLoop(deltaTime: number) {
  fpsText.text = `${app.ticker.FPS.toFixed()} FPS`;

  const toRemove: CelestialBody[] = []

  // apply gravitational force
  for (const body of bodies) {
    for (const other of bodies) {
      if (other == body) continue;
      const diff = other.pos.sub(body.pos);
  
      // check collision
      if (diff.mag() < EPSILON) {
        toRemove.push(body);
        toRemove.push(other);
      }

      const magF= GRAVITATIONAL_CONSTANT * (body.mass * other.mass) / diff.magSq();
      const f = diff.normalize().mult(magF);
      body.applyForce(f);
    }
  }

  for (let i = bodies.length - 1; i >= 0; i--) {
    if (toRemove.includes(bodies[i])) {
      console.info(`Removing body ${i}`);
      bodies[i].destroy();
      bodies.splice(i, 1);
    }
  }

  for (const body of bodies) {
    body.update(deltaTime);
  }
}

app.ticker.add(updateLoop);
