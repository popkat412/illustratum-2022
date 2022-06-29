import EntityManager from "../EntityComponentSystem/EntityManager";
import ECSSystem from "../EntityComponentSystem/System";
import { HasPixiApp } from "../Environments/EnvironmentInterfaces";
import checkmarkSvg from "bundle-text:../assets/checkmark.svg";
import crossSvg from "bundle-text:../assets/cross.svg";
import * as PIXI from "pixi.js";

type GoalMetStatus = "success" | "failure" | "undecided";

export default abstract class Scene<E extends HasPixiApp> {
  htmlContainer: HTMLDivElement;
  readonly resetButton: HTMLButtonElement;

  environment: E;
  entityManager = new EntityManager();

  systems: ECSSystem<E>[] = [];

  readonly fpsText: PIXI.Text;

  // goal related things
  abstract readonly goalMessage: string;
  private _goalMetStatus: GoalMetStatus = "undecided";
  get goalMetStatus(): GoalMetStatus {
    return this._goalMetStatus;
  }
  set goalMetStatus(newValue: GoalMetStatus) {
    switch (newValue) {
      case "success":
        this.goalMessageSpan.classList.add("strikethrough");
        this.goalMetIcon.hidden = false;
        break;
      case "failure":
        this.goalFailedIcon.hidden = false;
        break;
      default:
        this.goalMessageSpan.classList.remove("strikethrough");
        this.goalMetIcon.hidden = true;
    }
  }
  goalMessageDiv: HTMLDivElement;
  goalMessageSpan: HTMLSpanElement;
  goalMetIcon: HTMLDivElement;
  goalFailedIcon: HTMLDivElement;

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
    this.goalMetIcon.classList.add("goal-icon", "goal-met-icon");
    this.goalMetIcon.innerHTML = checkmarkSvg;
    this.goalMetIcon.hidden = true;

    this.goalFailedIcon = document.createElement("div");
    this.goalFailedIcon.classList.add("goal-icon", "goal-failed-icon");
    this.goalFailedIcon.innerHTML = crossSvg;
    this.goalFailedIcon.hidden = true;

    this.goalMessageDiv.appendChild(this.goalMessageSpan);
    this.htmlContainer.appendChild(this.goalMessageDiv);
    this.htmlContainer.appendChild(this.goalMetIcon);
    this.htmlContainer.appendChild(this.goalFailedIcon);

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

    // fps text
    this.fpsText.text = `${this.environment.app.ticker.FPS.toFixed()} FPS`;
  }

  reset(): void {
    this.goalMetStatus = "undecided";
  }
}
