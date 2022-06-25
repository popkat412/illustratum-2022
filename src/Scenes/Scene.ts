import EntityManager from "../EntityComponentSystem/EntityManager";
import ECSSystem from "../EntityComponentSystem/System";
import { HasPixiApp } from "../Environments/EnvironmentInterfaces";
import checkmarkSvg from "bundle-text:../assets/checkmark.svg";
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
  abstract goalMetFn(): void;
  abstract readonly goalMessage: string;
  private _goalMetAlready = false;
  get goalMetAlready(): boolean {
    return this._goalMetAlready;
  }
  set goalMetAlready(newValue: boolean) {
    if (newValue) {
      this.goalMessageSpan.classList.add("strikethrough");
      this.goalMetIcon.hidden = false;
    } else {
      this.goalMessageSpan.classList.remove("strikethrough");
      this.goalMetIcon.hidden = true;
    }
  }
  goalMessageDiv: HTMLDivElement;
  goalMessageSpan: HTMLSpanElement;
  goalMetIcon: HTMLDivElement;

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
    this.goalMessageSpan = document.createElement("span");

    this.goalMessageDiv = document.createElement("div");
    setTimeout(() => {
      // very ugly hack to access a abstract property
      this.goalMessageSpan.innerHTML = `Goal: ${this.goalMessage}`;
    });
    this.goalMessageDiv.classList.add("goal-message");

    this.goalMetIcon = document.createElement("div");
    this.goalMetIcon.classList.add("goal-met-icon");
    this.goalMetIcon.innerHTML = checkmarkSvg;
    this.goalMetIcon.hidden = true;

    this.goalMessageDiv.appendChild(this.goalMessageSpan);
    this.htmlContainer.appendChild(this.goalMessageDiv);
    this.htmlContainer.appendChild(this.goalMetIcon);

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
      this.goalMetFn();
    }

    // fps text
    this.fpsText.text = `${this.environment.app.ticker.FPS.toFixed()} FPS`;
  }

  reset(): void {
    this.goalMetAlready = false;
  }
}
