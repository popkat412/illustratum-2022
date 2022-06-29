import * as PIXI from "pixi.js";
import PixiGraphicsRenderComponent from "../Components/PIXIGraphicsRenderComponent";
import TooltipComponent from "../Components/TooltipComponent";
import ECSSystem from "../EntityComponentSystem/System";
import Vec2 from "../Vec2";
export default class TooltipSystem<E> extends ECSSystem<E> {
  setup(): void {
    console.log("setting up tooltip system");
    // setup UI
    const tooltipDiv = document.createElement("div");
    tooltipDiv.classList.add("tooltip");
    tooltipDiv.style.display = "none";
    document.body.appendChild(tooltipDiv);

    for (const [
      entity,
      tooltipComponent,
    ] of this.entityManager.allEntitiesWithComponent<TooltipComponent>(
      TooltipComponent
    )) {
      const pixiGraphicsRenderComponent =
        this.entityManager.getComponent<PixiGraphicsRenderComponent>(
          entity,
          PixiGraphicsRenderComponent
        );
      if (!pixiGraphicsRenderComponent) continue;
      const graphics = pixiGraphicsRenderComponent.pixiGraphics;
      graphics.interactive = true;
      graphics.on("pointerover", (ev: PIXI.InteractionEvent) => {
        const canvas = ev.data.originalEvent.target as HTMLCanvasElement;
        tooltipDiv.style.display = "block";
        tooltipDiv.innerHTML = tooltipComponent.tooltipContent;
        const pixiCoords = Vec2.fromVec(
          pixiGraphicsRenderComponent.pixiGraphics.getGlobalPosition()
        );
        const canvasClientCoords = Vec2.fromVec(canvas.getBoundingClientRect());
        const canvasScale = new Vec2(
          canvas.clientWidth / canvas.width,
          canvas.clientHeight / canvas.height
        );
        console.log(canvasScale);
        const pixiClientCoords = pixiCoords
          .multComponents(canvasScale)
          .add(canvasClientCoords);
        const tooltipWidth = tooltipDiv.clientWidth;
        const offset = new Vec2(-tooltipWidth / 2, -60);
        const tooltipPosition = pixiClientCoords.add(offset);
        tooltipDiv.style.left = `${tooltipPosition.x}px`;
        tooltipDiv.style.top = `${tooltipPosition.y}px`;
      });
      graphics.on("pointerout", () => {
        tooltipDiv.style.display = "none";
      });
    }
  }

  update(_deltaTime: number): void {}
}
