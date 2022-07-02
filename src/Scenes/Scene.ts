import EntityManager from "../EntityComponentSystem/EntityManager";
import ECSSystem from "../EntityComponentSystem/System";
import { HasPixiApp } from "../Environments/EnvironmentInterfaces";
import checkmarkSvg from "bundle-text:../assets/checkmark.svg";
import crossSvg from "bundle-text:../assets/cross.svg";
import * as PIXI from "pixi.js";
import { GoalStatus } from "./Goals";
import { playCssAnimation } from "../Utils/render";

export default abstract class Scene<E extends HasPixiApp> {
  htmlContainer: HTMLDivElement;
  readonly resetButton: HTMLButtonElement;

  environment: E;
  entityManager = new EntityManager();

  systems: ECSSystem<E>[] = [];

  readonly fpsText: PIXI.Text;

  // goal related things
  abstract readonly goalMessage: string;
  protected goalMetStatus: GoalStatus = new GoalStatus();
  private onGoalMetStatusUpdate(newValue: GoalStatus) {
    const setupSucessFailureUI = (icon: HTMLDivElement) => {
      resetGoalUI();

      setTimeout(() => {
        this.unhideElement(this.goalMetMessageDiv, this.goalContainer);
        playCssAnimation(this.goalContainer, "goal-container-animation");
        // this.goalContainer.classList.add("goal-container-animation");
        playCssAnimation(icon, "goal-icon-animation");
        // icon.classList.add("goal-icon-animation");
        console.log("goal status msg", this.goalMetStatus.msg);
        if (this.goalMetStatus.msg) {
          this.goalMetMessageDiv.innerHTML = this.goalMetStatus.msg;
        } else {
          this.goalMetMessageDiv.innerHTML = "";
        }
      });
    };
    const resetGoalUI = () => {
      this.goalMessageSpan.classList.remove("strikethrough");
      this.hideElement(
        this.goalContainer,
        this.goalContainer,
        this.goalMetMessageDiv,
        this.goalMetIcon,
        this.goalFailedIcon
      );
      this.goalMetMessageDiv.classList.remove("goal-green", "goal-red");
      // TODO: refactor so this is a map of goal status to icon
      this.goalMetIcon.classList.remove("goal-icon-animation");
      this.goalFailedIcon.classList.remove("goal-icon-animation");

      this.goalContainer.classList.remove("goal-container-animation");
    };
    switch (newValue.status) {
      case "success":
        setupSucessFailureUI(this.goalMetIcon);
        this.goalMessageSpan.classList.add("strikethrough");
        this.unhideElement(this.goalMetIcon);
        this.goalMetMessageDiv.classList.add("goal-green");
        break;
      case "failure":
        setupSucessFailureUI(this.goalFailedIcon);
        this.unhideElement(this.goalFailedIcon);
        this.goalMetMessageDiv.classList.add("goal-red");
        break;
      default:
        resetGoalUI();
        break;
    }
  }
  private goalMessageDiv: HTMLDivElement;
  private goalMessageSpan: HTMLSpanElement;

  private goalContainer: HTMLDivElement;
  private goalMetIcon: HTMLDivElement;
  private goalFailedIcon: HTMLDivElement;
  private goalMetMessageDiv: HTMLDivElement;

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
    this.resetButton.onclick = (ev) => {
      ev.stopPropagation();
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
    this.hideElement(this.goalMetIcon);

    this.goalFailedIcon = document.createElement("div");
    this.goalFailedIcon.classList.add("goal-icon", "goal-failed-icon");
    this.goalFailedIcon.innerHTML = crossSvg;
    this.hideElement(this.goalFailedIcon);

    this.goalMetMessageDiv = document.createElement("div");
    this.goalMetMessageDiv.classList.add("goal-met-message");
    this.hideElement(this.goalMetMessageDiv);

    this.goalContainer = document.createElement("div");
    this.hideElement(this.goalContainer);
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

  private hideElement(...elements: HTMLElement[]): void {
    for (const el of elements) {
      el.style.display = "none";
    }
  }
  private unhideElement(...elements: HTMLElement[]): void {
    for (const el of elements) {
      el.style.display = "block";
    }
  }
}
