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

  // goal related things
  abstract goalIsMet(): boolean;
  abstract readonly goalMessage: string;
  goalMessageDiv: HTMLDivElement;

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
    this.resetButton.classList.add("reset-button");
    this.htmlContainer.appendChild(this.resetButton);

    // goal message
    this.goalMessageDiv = document.createElement("div");
    setTimeout(() => {
      // very ugly hack to access a abstract property
      this.goalMessageDiv.innerHTML = `Goal: ${this.goalMessage}`;
    });
    this.goalMessageDiv.classList.add("goal-message");
    this.htmlContainer.appendChild(this.goalMessageDiv);

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
    // systems
    for (const system of this.systems) {
      system.update(deltaTime);
    }

    // goals
    const goalMet = this.goalIsMet();
    if (goalMet) {
      console.log("goal met");
    }

    // fps text
    this.fpsText.text = `${this.environment.app.ticker.FPS.toFixed()} FPS`;
  }

  abstract reset(): void;
}
