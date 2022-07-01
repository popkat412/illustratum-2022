import ForcesScene from "./Scenes/ForcesScene";
// import TestScene from "./Scenes/TestScene";
import CircularObitScene from "./Scenes/CircularOrbitScene";
import ApoapsisPointScene from "./Scenes/ApoapsisPointScene";

const SCENES_MAP = {
  // test: TestScene,
  forces: ForcesScene,
  "circular-orbit": CircularObitScene,
  apoapsis: ApoapsisPointScene,
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
