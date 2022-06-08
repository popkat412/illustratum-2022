import * as PIXI from "pixi.js";
import { addCelestialBody } from "./Entities/CelestialBody";
import ECSEntity from "./EntityComponentSystem/Entity";
import EntityManager from "./EntityComponentSystem/EntityManager";
import NBodySystemEnvironment from "./Environments/NBodySystemEnvironment";
import DraggableItemSystem from "./Systems/DraggableItemSystem";
import FieldLinesSystem from "./Systems/FieldLinesSystem";
import GravitySystem from "./Systems/GravitySystem";
import MoveParticleSystem from "./Systems/MoveParticleSystem";
import ParticleUISystem from "./Systems/ParticleUISystem";
import RendererSystem from "./Systems/RendererSystem";
import SelectableItemSystem from "./Systems/SelectableItemSystem";
import ShowVectorFieldSystem from "./Systems/ShowVectorFieldSystem";
import ShowVectorSystem from "./Systems/ShowVectorSystem";
import TrailRendererSystem from "./Systems/TrailRendererSystem";
import { randInt } from "./Utils/math";
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

const entities: ECSEntity[] = [
  // sun
  addCelestialBody(entityManager, {
    mass: 1.989e30,
    color: randInt(0, 0xffffff),
    radius: 25,
    fixed: true,
    initialPos: new Vec2(
      app.renderer.width / 2 / environment.scaleFactor,
      app.renderer.height / 2 / environment.scaleFactor
    ),
  }),
  addCelestialBody(entityManager, {
    // mass: 5.972e24,
    mass: 1.989e30,
    color: randInt(0, 0xffffff),
    // radius: 20,
    radius: 25,
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
    initialVel: new Vec2(10500, 0),
  }),
];

const systems = [
  new GravitySystem(entityManager, environment),
  new MoveParticleSystem(entityManager, environment),
  new SelectableItemSystem(entityManager, environment),
  new DraggableItemSystem(entityManager, environment),
  new RendererSystem(entityManager, environment),
  new TrailRendererSystem(entityManager, environment),
  new ParticleUISystem(entityManager, environment),
  new ShowVectorSystem(entityManager, environment),
  new ShowVectorFieldSystem(entityManager, environment),
  new FieldLinesSystem(entityManager, environment),
];

for (const system of systems) {
  system.setup();
}

environment.app.stage.sortChildren();

console.log(entityManager);

app.ticker.add((deltaTime: number) => {
  for (const system of systems) {
    system.update(deltaTime);
  }

  fpsText.text = `${app.ticker.FPS.toFixed()} FPS`;
});

app.stage.sortChildren();
