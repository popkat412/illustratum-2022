import ParticleComponent from "../Components/ParticleComponent";
import PixiGraphicsRenderComponent from "../Components/PIXIGraphicsRenderComponent";
import ECSSystem from "../EntityComponentSystem/System";
import {
  HasPixiApp,
  HasViewport,
  HasRenderScale,
} from "../Environments/EnvironmentInterfaces";
import { updateGraphicsComponent } from "../utils";

export default class RendererSystem<
  E extends HasViewport & HasPixiApp & HasRenderScale
> extends ECSSystem<E> {
  setup() {
    for (const [
      entity,
      pixiGraphicsComponent,
    ] of this.entityManager.allEntitiesWithComponent<PixiGraphicsRenderComponent>(
      PixiGraphicsRenderComponent
    )) {
      this.environment.viewport.addChild(pixiGraphicsComponent.pixiGraphics);

      const particleComponent =
        this.entityManager.getComponent<ParticleComponent>(
          entity,
          ParticleComponent
        );
      if (particleComponent) {
        updateGraphicsComponent(
          pixiGraphicsComponent,
          particleComponent,
          this.environment.scaleFactor
        );
      }
    }
  }

  update() {
    for (const [
      entity,
      pixiGraphicsComponent,
    ] of this.entityManager.allEntitiesWithComponent<PixiGraphicsRenderComponent>(
      PixiGraphicsRenderComponent
    )) {
      const particleComponent =
        this.entityManager.getComponent<ParticleComponent>(
          entity,
          ParticleComponent
        );
      if (particleComponent) {
        updateGraphicsComponent(
          pixiGraphicsComponent,
          particleComponent,
          this.environment.scaleFactor
        );
      }
    }
  }
}
