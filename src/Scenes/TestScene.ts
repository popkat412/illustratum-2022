/*
import * as PIXI from "pixi.js";
import { addCelestialBody } from "../Entities/CelestialBody";
import NBodySystemEnvironment from "../Environments/NBodySystemEnvironment";
import DraggableItemSystem from "../Systems/DraggableItemSystem";
import FieldLinesSystem from "../Systems/FieldLinesSystem";
import GravitySystem from "../Systems/GravitySystem";
import MoveParticleSystem from "../Systems/MoveParticleSystem";
import ParticleUISystem from "../Systems/ParticleUISystem";
import RendererSystem from "../Systems/RendererSystem";
import SelectableItemSystem from "../Systems/SelectableItemSystem";
import ShowVectorFieldSystem from "../Systems/ShowVectorFieldSystem";
import ShowVectorSystem from "../Systems/ShowVectorSystem";
import TrailRendererSystem from "../Systems/TrailRendererSystem";
import { randInt } from "../Utils/math";
import Vec2 from "../Vec2";
import Scene from "./Scene";

export default class TestScene extends Scene<NBodySystemEnvironment> {
  constructor(htmlContainer: HTMLDivElement) {
    const app = new PIXI.Application();
    const environment = new NBodySystemEnvironment(app);

    super(htmlContainer, environment);

    // set up systems
    this.systems = [
      new GravitySystem(this.entityManager, this.environment),
      new MoveParticleSystem(this.entityManager, this.environment),
      new SelectableItemSystem(this.entityManager, this.environment),
      new DraggableItemSystem(this.entityManager, this.environment),
      new RendererSystem(this.entityManager, this.environment),
      new TrailRendererSystem(this.entityManager, this.environment),
      new ParticleUISystem(this.entityManager, this.environment),
      new ShowVectorSystem(this.entityManager, this.environment),
      new ShowVectorFieldSystem(this.entityManager, this.environment),
      new FieldLinesSystem(this.entityManager, this.environment),
    ];

    // set up entities
    addCelestialBody(this.entityManager, {
      mass: 1.989e30,
      color: randInt(0, 0xffffff),
      radius: 25,
      fixed: true,
      initialPos: new Vec2(
        app.renderer.width / 2 / environment.scaleFactor,
        app.renderer.height / 2 / environment.scaleFactor
      ),
    });
    addCelestialBody(this.entityManager, {
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
    });
    addCelestialBody(this.entityManager, {
      mass: 5.972e24,
      color: randInt(0, 0xffffff),
      radius: 20,
      initialPos: new Vec2(
        app.renderer.width / 2 / environment.scaleFactor,
        (app.renderer.height * 3.5) / 4 / environment.scaleFactor
      ),
      initialVel: new Vec2(10500, 0),
    });
  }
}
*/
