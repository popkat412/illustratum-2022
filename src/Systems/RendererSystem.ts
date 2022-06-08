import ParticleComponent from "../Components/ParticleComponent";
import PixiContainerComponent from "../Components/PIXIContainerComponent";
import PixiGraphicsRenderComponent from "../Components/PIXIGraphicsRenderComponent";
import ECSSystem from "../EntityComponentSystem/System";
import {
  HasPixiApp,
  HasRenderScale,
} from "../Environments/EnvironmentInterfaces";
import { updatePixiContainer } from "../Utils/render";

export default class RendererSystem<
  E extends HasPixiApp & HasRenderScale
> extends ECSSystem<E> {
  setup() {
    for (const [
      entity,
      pixiContainerComponent,
    ] of this.entityManager.allEntitiesWithComponent<PixiContainerComponent>(
      PixiContainerComponent
    )) {
      this.environment.app.stage.addChild(pixiContainerComponent.container);

      const particleComponent =
        this.entityManager.getComponent<ParticleComponent>(
          entity,
          ParticleComponent
        );
      if (particleComponent) {
        updatePixiContainer(
          pixiContainerComponent,
          particleComponent,
          this.environment.scaleFactor
        );
      }

      const pixiGraphicsComponent =
        this.entityManager.getComponent<PixiGraphicsRenderComponent>(
          entity,
          PixiGraphicsRenderComponent
        );
      if (pixiGraphicsComponent) {
        pixiContainerComponent.container.addChild(
          pixiGraphicsComponent.pixiGraphics
        );
      }
    }
  }

  update() {
    for (const [
      entity,
      pixiContainerComponent,
    ] of this.entityManager.allEntitiesWithComponent<PixiContainerComponent>(
      PixiContainerComponent
    )) {
      const particleComponent =
        this.entityManager.getComponent<ParticleComponent>(
          entity,
          ParticleComponent
        );
      if (particleComponent) {
        updatePixiContainer(
          pixiContainerComponent,
          particleComponent,
          this.environment.scaleFactor
        );
      }
    }
  }
}
