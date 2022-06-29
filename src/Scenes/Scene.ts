import EntityManager from "../EntityComponentSystem/EntityManager";
import ECSSystem from "../EntityComponentSystem/System";
import { HasPixiApp } from "../Environments/EnvironmentInterfaces";
import checkmarkSvg from "bundle-text:../assets/checkmark.svg";
import crossSvg from "bundle-text:../assets/cross.svg";
import * as PIXI from "pixi.js";
import { GoalStatus } from "./Goals";

export default abstract class Scene<E extends HasPixiApp> {
  htmlContainer: HTMLDivElement;
  readonly resetButton: HTMLButtonElement;

  environment: E;
  entityManager = new EntityManager();

  systems: ECSSystem<E>[] = [];

  readonly fpsText: PIXI.Text;

  // goal related things
  abstract readonly goalMessage: string;
  private goalMetStatus: GoalStatus = new GoalStatus();
  private onGoalMetStatusUpdate(newValue: GoalStatus) {
    const setupSucessFailureUI = (icon: HTMLDivElement) => {
      this.goalMetMessageDiv.hidden = false;
      this.goalContainer.hidden = false;
      this.goalContainer.classList.add("goal-container-animation");
      icon.classList.add("goal-icon-animation");
      console.log("goal status msg", this.goalMetStatus.msg);
      if (this.goalMetStatus.msg) {
        this.goalMetMessageDiv.innerHTML = this.goalMetStatus.msg;
      }
    };
    switch (newValue.status) {
      case "success":
        setupSucessFailureUI(this.goalMetIcon);
        this.goalMessageSpan.classList.add("strikethrough");
        this.goalMetIcon.hidden = false;
        this.goalMetMessageDiv.classList.add("goal-green");
        break;
      case "failure":
        setupSucessFailureUI(this.goalFailedIcon);
        this.goalFailedIcon.hidden = false;
        this.goalMetMessageDiv.classList.add("goal-red");
        break;
      default:
        this.goalMessageSpan.classList.remove("strikethrough");
        this.goalContainer.hidden = true;
        this.goalMetMessageDiv.hidden = true;
        this.goalMetMessageDiv.classList.remove("goal-green", "goal-red");
        // TODO: refactor so this is a map of goal status to icon
        this.goalMetIcon.classList.remove("goal-icon-animation");
        this.goalFailedIcon.classList.remove("goal-icon-animation");
        this.goalMetIcon.hidden = true;
        this.goalFailedIcon.hidden = true;

        this.goalContainer.classList.remove("goal-container-animation");
        break;
    }
  }
  goalMessageDiv: HTMLDivElement;
  goalMessageSpan: HTMLSpanElement;

  goalContainer: HTMLDivElement;
  goalMetIcon: HTMLDivElement;
  goalFailedIcon: HTMLDivElement;
  goalMetMessageDiv: HTMLDivElement;

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

    // goal system
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

    this.goalMetMessageDiv = document.createElement("div");
    this.goalMetMessageDiv.classList.add("goal-met-message");
    this.goalMetMessageDiv.hidden = true;

    this.goalContainer = document.createElement("div");
    this.goalContainer.hidden = true;
    this.goalContainer.classList.add("goal-container");

    this.goalMessageDiv.appendChild(this.goalMessageSpan);

    this.goalContainer.appendChild(this.goalMetIcon);
    this.goalContainer.appendChild(this.goalFailedIcon);
    this.goalContainer.appendChild(this.goalMetMessageDiv);

    this.htmlContainer.appendChild(this.goalMessageDiv);
    this.htmlContainer.appendChild(this.goalContainer);

    this.goalMetStatus.onUpdate = this.onGoalMetStatusUpdate.bind(this);

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
    this.goalMetStatus.undecided();
  }
}
