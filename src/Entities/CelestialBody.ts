import { GlowFilter } from "@pixi/filter-glow";
import * as PIXI from "pixi.js";
import DraggableComponent from "../Components/DraggableComponent";
import GravityComponent from "../Components/GravityComponent";
import ParticleComponent from "../Components/ParticleComponent";
import PixiContainerComponent from "../Components/PIXIContainerComponent";
import PixiGraphicsRenderComponent from "../Components/PIXIGraphicsRenderComponent";
import SelectableComponent from "../Components/SelectableComponent";
import ShowDistanceComponent, {
  ShowDistanceData,
} from "../Components/ShowDistanceComponent";
import ShowVectorComponent, {
  ShowVectorData,
} from "../Components/ShowVectorComponent";
import TooltipComponent from "../Components/TooltipComponent";
import TrailRenderComponent from "../Components/TrailRenderComponent";
import {
  GRAVITY_SYSTEM_SHOW_VECTOR_COMPONENT_ID,
  VELOCITY_SHOW_VECTOR_COMPONENT_ID,
} from "../constants";
import ECSEntity from "../EntityComponentSystem/Entity";
import EntityManager from "../EntityComponentSystem/EntityManager";
import {
  lightenHexColor,
  makeInverseSqrtScalingFn,
  makeSqrtScalingFn,
} from "../Utils/math";
import Vec2 from "../Vec2";

export interface CelestialBodyOptions {
  mass: number;
  color: number;
  radius: number;
  fixed?: boolean;
  initialPos?: Vec2;
  initialVel?: Vec2;
  showDistData?: ShowDistanceData[];
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
    showDistData = [],
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
  entityManager.addComponent(entity, new PixiContainerComponent());
  entityManager.addComponent(
    entity,
    new PixiGraphicsRenderComponent(pixiCircle)
  );

  entityManager.addComponent(entity, new DraggableComponent());

  const colorMatrixFilter = new PIXI.filters.ColorMatrixFilter();
  colorMatrixFilter.saturate(1, true);
  colorMatrixFilter.brightness(1, true);
  const glowFilter = new GlowFilter({
    distance: 20,
    color: lightenHexColor(color, 0.1),
  });
  entityManager.addComponent(
    entity,
    new SelectableComponent([colorMatrixFilter, glowFilter])
  );

  entityManager.addComponent(
    entity,
    new ShowVectorComponent([
      new ShowVectorData(
        GRAVITY_SYSTEM_SHOW_VECTOR_COMPONENT_ID,
        "F",
        "N",
        0xffffff,
        makeSqrtScalingFn(1e22),
        makeInverseSqrtScalingFn(1e22)
      ),
      new ShowVectorData(
        VELOCITY_SHOW_VECTOR_COMPONENT_ID,
        "v",
        "m/s",
        0xa3ffbb,
        makeSqrtScalingFn(1e3),
        makeInverseSqrtScalingFn(1e3)
      ),
    ])
  );

  entityManager.addComponent(entity, new ShowDistanceComponent(showDistData));

  entityManager.addComponent(entity, new TooltipComponent());

  return entity;
}
