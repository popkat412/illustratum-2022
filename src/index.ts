import ForcesScene from "./Scenes/ForcesScene";
// import TestScene from "./Scenes/TestScene";
import CircularObitScene from "./Scenes/CircularOrbitScene";
import ApoapsisPointScene from "./Scenes/ApoapsisPointScene";
import PeriapsisPointScene from "./Scenes/PeriapsisPointScene";

const SCENES_MAP = {
  // test: TestScene,
  forces: ForcesScene,
  "circular-orbit": CircularObitScene,
  apoapsis: ApoapsisPointScene,
  periapsis: PeriapsisPointScene,
};

const scenes = [];

for (const [k, v] of Object.entries(SCENES_MAP)) {
  const div = document.getElementById(k) as HTMLDivElement;
  if (!div) continue;
  const scene = new v(div);
  scenes.push(scene);
}

console.log(scenes);

for (const scene of scenes) {
  scene.setup();
}
