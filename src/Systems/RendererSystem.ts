import PixiGraphicsRenderComponent from "../Components/PIXIGraphicsRenderComponent";
import System from "../EntitySystem/System";
import { HasPixiApp } from "../Environments/EnvironmentInterfaces";

export default class RendererSystem<E extends HasPixiApp> extends System<E> {
  setup() {
    for (const [
      _,
      pixiGraphicsRenderComponent,
    ] of this.entityManager.allEntitiesWithComponent<PixiGraphicsRenderComponent>(
      PixiGraphicsRenderComponent
    )) {
      this.environment.app.stage.addChild(
        pixiGraphicsRenderComponent.pixiGraphics
      );
    }
  }

  update() {}
}
