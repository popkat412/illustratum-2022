import * as PIXI from "pixi.js";
import CelestialBody from "./CelestialBody";
import { randFloat, randInt } from "./utils";

const app = new PIXI.Application();
document.body.appendChild(app.view);

const fpsText = new PIXI.Text("", new PIXI.TextStyle({
  fill: "white",
}));
fpsText.position.set(10, 10);
app.stage.addChild(fpsText);

const GRAVITATIONAL_CONSTANT = 6.67408e-11;
const EPSILON = 1e10; 

const SCALE_FACTOR = 1e-9;
const TIME_FACTOR = 1e5;

let bodies = [
  new CelestialBody(1.989e30, randInt(0, 0xFFFFFF), 35, true),
  new CelestialBody(5.972e24, randInt(0, 0xFFFFFF), 25),
  new CelestialBody(5.972e24, randInt(0, 0xFFFFFF), 25),
];

let frameCount = 0;

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
    body.pos.set(body.pixiGraphics.x / SCALE_FACTOR, body.pixiGraphics.y/SCALE_FACTOR);
  } else {
    // body.pos.set((app.renderer.width/2)/SCALE_FACTOR, (app.renderer.height/2)/SCALE_FACTOR - 1.496e11);
    body.pos.set(
      randFloat(0, app.renderer.width)/SCALE_FACTOR, 
      randFloat(0, app.renderer.height)/SCALE_FACTOR
    );
    body.updateScreenPos(SCALE_FACTOR);
    body.velocity.set(randFloat(-30000, 30000), randFloat(-30000, 30000));
  }
}

console.log(bodies);

function updateLoop(deltaTime: number) {
  if (frameCount % 10 == 0) {
    fpsText.text = `${app.ticker.FPS.toFixed()} FPS`;
  }

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
      app.stage.removeChild(bodies[i].pixiGraphics);
      app.stage.removeChild(bodies[i].pixiTrailGraphics);
      bodies.splice(i, 1);
    }
  }

  for (const body of bodies) {
    body.update(deltaTime, SCALE_FACTOR, TIME_FACTOR);
  }

  frameCount++;
}

app.ticker.add(updateLoop);

