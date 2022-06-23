import EntityManager from "../EntityComponentSystem/EntityManager";
import ECSSystem from "../EntityComponentSystem/System";
import { HasPixiApp } from "../Environments/EnvironmentInterfaces";
import * as PIXI from "pixi.js";

export default abstract class Scene<E extends HasPixiApp> {
  htmlContainer: HTMLDivElement;
  readonly resetButton: HTMLButtonElement;

  environment: E;
  entityManager = new EntityManager();

  systems: ECSSystem<E>[] = [];

  readonly fpsText: PIXI.Text;

  constructor(htmlContainer: HTMLDivElement, environment: E) {
    this.htmlContainer = htmlContainer;
    this.environment = environment;
    this.htmlContainer.appendChild(this.environment.app.view);

    // fps text
    this.fpsText = new PIXI.Text(
      "",
      new PIXI.TextStyle({
        fill: "white",
      })
    );
    this.fpsText.position.set(10, 10);
    this.fpsText.zIndex = 10;
    this.environment.app.stage.addChild(this.fpsText);

    // reset button
    this.resetButton = document.createElement("button");
    this.resetButton.innerText = "Reset";
    this.resetButton.onclick = () => {
      this.reset();
    };
    this.resetButton.style.position = "absolute";
    this.resetButton.style.bottom = "20px";
    this.resetButton.style.left = "10px";
    this.htmlContainer.appendChild(this.resetButton);

    // update function
    this.environment.app.ticker.add((deltaTime: number) => {
      this.update(deltaTime);
    });
  }

  setup(): void {
    for (const system of this.systems) {
      system.setup();
    }
    this.environment.app.stage.sortChildren();
  }

  update(deltaTime: number): void {
    for (const system of this.systems) {
      system.update(deltaTime);
    }
    this.fpsText.text = `${this.environment.app.ticker.FPS.toFixed()} FPS`;
  }

  abstract reset(): void;
}
