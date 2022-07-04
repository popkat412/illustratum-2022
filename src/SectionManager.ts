import ForcesScene from "./Scenes/ForcesScene";
import GravitationalFieldScene from "./Scenes/GravitationalFieldScene";
import CircularObitScene from "./Scenes/CircularOrbitScene";
import ApoapsisPointScene from "./Scenes/ApoapsisPointScene";
import PeriapsisPointScene from "./Scenes/PeriapsisPointScene";
import CircularOrbitScene from "./Scenes/CircularOrbitScene";
import GravitationalFieldScene2 from "./Scenes/GravitationalFieldScene2";

export type AllScenesConstructor =
  | typeof ForcesScene
  | typeof GravitationalFieldScene
  | typeof GravitationalFieldScene2
  | typeof CircularObitScene
  | typeof ApoapsisPointScene
  | typeof PeriapsisPointScene;
// last bool is for whether it has goal or not
type SceneList = readonly (readonly [string, AllScenesConstructor, boolean])[];

class SectionManager {
  private instructionText = document.createElement("div");
  private explanationSectionContainers = document.getElementsByClassName(
    "explanation-section-container"
  ) as HTMLCollectionOf<HTMLDivElement>;

  readonly sceneList: SceneList;

  private unlockedUntil = 0;

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

  solveScene(sceneClass: AllScenesConstructor): void {
    const unlockedUntil = this.unlockedUntil;
    let newUnlockedUntil =
      this.sceneList.findIndex(([, v]) => v == sceneClass) + 1;
    for (
      let i = 0;
      i < newUnlockedUntil;
      i++ // this is like super fragile but idc
    )
      if (!this.sceneList[i][2]) newUnlockedUntil--;

    console.log(unlockedUntil, newUnlockedUntil);

    if (newUnlockedUntil - unlockedUntil > 1) {
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
  ["forces", ForcesScene, true],
  ["gravitational-field", GravitationalFieldScene, false],
  ["gravitational-field-2", GravitationalFieldScene2, false],
  ["circular-orbit", CircularOrbitScene, true],
  ["apoapsis", ApoapsisPointScene, true],
  ["periapsis", PeriapsisPointScene, true],
] as const;

export const sectionManager = new SectionManager(SCENE_LIST);
