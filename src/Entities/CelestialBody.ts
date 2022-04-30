import * as PIXI from "pixi.js";
import DraggableComponent from "../Components/DraggableComponent";
import GravityComponent from "../Components/GravityComponent";
import ParticleComponent from "../Components/ParticleComponent";
import PixiGraphicsRenderComponent from "../Components/PIXIGraphicsRenderComponent";
import TrailRenderComponent from "../Components/TrailRenderComponent";
import ECSEntity from "../EntityComponentSystem/Entity";
import EntityManager from "../EntityComponentSystem/EntityManager";
import Vec2 from "../Vec2";

export interface CelestialBodyOptions {
  mass: number;
  color: number;
  radius: number;
  fixed?: boolean;
  initialPos?: Vec2;
  initialVel?: Vec2;
}

export function addCelestialBody(
  entityManager: EntityManager,
  {
    mass,
    color,
    radius,
    fixed = false,
    initialPos: pos = new Vec2(),
    initialVel: vel = new Vec2(),
  }: CelestialBodyOptions
): ECSEntity {
  const pixiCircle = new PIXI.Graphics();
  pixiCircle.beginFill(color);
  pixiCircle.drawCircle(0, 0, radius);
  pixiCircle.endFill();

  const entity = entityManager.createEntity();

  entityManager.addComponent(
    entity,
    new ParticleComponent({ mass, fixed, vel, pos })
  );
  entityManager.addComponent(entity, new GravityComponent());

  entityManager.addComponent(entity, new TrailRenderComponent(color));
  entityManager.addComponent(
    entity,
    new PixiGraphicsRenderComponent(pixiCircle)
  );

  const colorMatrixFilter = new PIXI.filters.ColorMatrixFilter();
  colorMatrixFilter.saturate(1, true);
  colorMatrixFilter.brightness(1, true);
  entityManager.addComponent(entity, new DraggableComponent(colorMatrixFilter));

  return entity;
}
