import ParticleComponent from "../Components/ParticleComponent";
import PixiGraphicsRenderComponent from "../Components/PIXIGraphicsRenderComponent";
import System from "../EntitySystem/System";
import {
  HasPixiApp,
  HasRenderScale,
} from "../Environments/EnvironmentInterfaces";

export default class RendererSystem<
  E extends HasPixiApp & HasRenderScale
> extends System<E> {
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
        this.updateGraphicsComponent(pixiGraphicsComponent, particleComponent);
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
        this.updateGraphicsComponent(pixiGraphicsComponent, particleComponent);
      }
    }
  }

  private updateGraphicsComponent(
    pixiGraphicsComponent: PixiGraphicsRenderComponent,
    particleComponent: ParticleComponent
  ) {
    pixiGraphicsComponent.pixiGraphics.x =
      particleComponent.pos.x * this.environment.scaleFactor;
    pixiGraphicsComponent.pixiGraphics.y =
      particleComponent.pos.y * this.environment.scaleFactor;
  }
}
