import ParticleComponent from "../Components/ParticleComponent";
import PixiGraphicsRenderComponent from "../Components/PIXIGraphicsRenderComponent";
import ECSSystem from "../EntityComponentSystem/System";
import {
  HasPixiApp,
  HasRenderScale,
} from "../Environments/EnvironmentInterfaces";
import { updateGraphicsComponent } from "../utils";

export default class RendererSystem<
  E extends HasPixiApp & HasRenderScale
> extends ECSSystem<E> {
  setup() {
    for (const [
      entity,
      pixiGraphicsComponent,
    ] of this.entityManager.allEntitiesWithComponent<PixiGraphicsRenderComponent>(
      PixiGraphicsRenderComponent
    )) {
      this.environment.app.stage.addChild(pixiGraphicsComponent.pixiGraphics);

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
