import { EXPLANATION_SECTION_LOCALSTORAGE_KEY } from "./constants";
import ForcesScene from "./Scenes/ForcesScene";
import CircularObitScene from "./Scenes/CircularOrbitScene";
import ApoapsisPointScene from "./Scenes/ApoapsisPointScene";
import PeriapsisPointScene from "./Scenes/PeriapsisPointScene";
import CircularOrbitScene from "./Scenes/CircularOrbitScene";

export type AllScenesConstructor =
  | typeof ForcesScene
  | typeof CircularObitScene
  | typeof ApoapsisPointScene
  | typeof PeriapsisPointScene;
type SceneList = readonly (readonly [string, AllScenesConstructor])[];

class SectionManager {
  private instructionText = document.createElement("div");
  private explanationSectionContainers = document.getElementsByClassName(
    "explanation-section-container"
  ) as HTMLCollectionOf<HTMLDivElement>;

  readonly sceneList: SceneList;

  constructor(sceneList: SceneList) {
    this.sceneList = sceneList;

    this.instructionText.classList.add("instruction-text");
    this.instructionText.innerText =
      "Solve the previous demo before you unlock the next one :p";

    const unlockedUntil = this.unlockedUntil;

    if (unlockedUntil < this.explanationSectionContainers.length - 1) {
      const next = this.explanationSectionContainers[unlockedUntil + 1];
      // blur the next one
      next.firstElementChild?.classList.add("blurred");

      // add the instruction text
      next.appendChild(this.instructionText);

      // hide the others
      for (
        let i = unlockedUntil + 2;
        i < this.explanationSectionContainers.length;
        i++
      ) {
        this.explanationSectionContainers[i].style.display = "none";
      }
    }
  }

  get unlockedUntil(): number {
    const stored = localStorage.getItem(EXPLANATION_SECTION_LOCALSTORAGE_KEY);
    if (!stored) return 0;
    const num = parseInt(stored, 10);
    if (!isNaN(num)) return num;
    return 0;
  }

  private set unlockedUntil(newValue: number) {
    localStorage.setItem(
      EXPLANATION_SECTION_LOCALSTORAGE_KEY,
      newValue.toString()
    );
  }

  solveScene(sceneClass: AllScenesConstructor): void {
    const unlockedUntil = this.unlockedUntil;
    const newUnlockedUntil =
      this.sceneList.findIndex(
        ([, v]) => v == sceneClass // TODO: not sure if this truly works
      ) + 1;
    console.log(unlockedUntil, newUnlockedUntil);

    if (newUnlockedUntil - unlockedUntil != 1) {
      throw new Error(
        `inconsistent scene order, newUnlockedUnti: ${newUnlockedUntil}, unlockedUntil: ${unlockedUntil}`
      );
    }

    const curr = this.explanationSectionContainers[unlockedUntil + 1];
    curr.removeChild(this.instructionText);
    curr.firstElementChild?.classList.remove("blurred");

    if (unlockedUntil < this.explanationSectionContainers.length - 2) {
      const next = this.explanationSectionContainers[unlockedUntil + 2];
      console.log(next);
      next.firstElementChild?.classList.add("blurred");
      next.appendChild(this.instructionText);
      next.style.display = "block";
    }

    this.unlockedUntil = unlockedUntil + 1;
  }
}

const SCENE_LIST: SceneList = [
  ["forces", ForcesScene],
  ["circular-orbit", CircularOrbitScene],
  ["apoapsis", ApoapsisPointScene],
  ["periapsis", PeriapsisPointScene],
] as const;

export const sectionManager = new SectionManager(SCENE_LIST);
