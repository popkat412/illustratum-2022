import * as PIXI from "pixi.js";
import { addCelestialBody } from "./Entities/CelestialBody";
import Entity from "./EntitySystem/Entity";
import EntityManager from "./EntitySystem/EntityManager";
import NBodySystemEnvironment from "./Environments/NBodySystemEnvironment";
import GravitySystem from "./Systems/GravitySystem";
import MoveParticleSystem from "./Systems/MoveParticleSystem";
import RendererSystem from "./Systems/RendererSystem";
import TrailRendererSystem from "./Systems/TrailRendererSystem";
import { randInt } from "./utils";
import Vec2 from "./Vec2";

const app = new PIXI.Application();
document.body.appendChild(app.view);

const fpsText = new PIXI.Text(
  "",
  new PIXI.TextStyle({
    fill: "white",
  })
);
fpsText.position.set(10, 10);
fpsText.zIndex = 10;
app.stage.addChild(fpsText);

const entityManager = new EntityManager();
const environment = new NBodySystemEnvironment(app);
environment.timeFactor = 1e5;

const entities: Entity[] = [
  // sun
  addCelestialBody(entityManager, {
    mass: 1.989e30,
    color: randInt(0, 0xffffff),
    radius: 35,
    fixed: true,
    initialPos: new Vec2(
      app.renderer.width / 2 / environment.scaleFactor,
      app.renderer.height / 2 / environment.scaleFactor
    ),
  }),
  // two "earth"s
  addCelestialBody(entityManager, {
    mass: 5.972e24,
    color: randInt(0, 0xffffff),
    radius: 20,
    initialPos: new Vec2(
      app.renderer.width / 2 / environment.scaleFactor,
      app.renderer.height / 4 / environment.scaleFactor
    ),
    initialVel: new Vec2(30000, 0),
  }),
  addCelestialBody(entityManager, {
    mass: 5.972e24,
    color: randInt(0, 0xffffff),
    radius: 20,
    initialPos: new Vec2(
      app.renderer.width / 2 / environment.scaleFactor,
      (app.renderer.height * 3.5) / 4 / environment.scaleFactor
    ),
    initialVel: new Vec2(10000, 0),
  }),
];

const systems = [
  new GravitySystem(entityManager, environment),
  new MoveParticleSystem(entityManager, environment),
  new RendererSystem(entityManager, environment),
  new TrailRendererSystem(entityManager, environment),
];

for (const system of systems) {
  system.setup();
}

console.log(entityManager);

app.ticker.add((deltaTime: number) => {
  for (const system of systems) {
    system.update(deltaTime);
  }

  fpsText.text = `${app.ticker.FPS.toFixed()} FPS`;
});
