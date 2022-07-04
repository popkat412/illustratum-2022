import * as PIXI from "pixi.js";
import { DIST_FONT_NAME, VEC_FONT_NAME } from "./constants";
import NBodySystemEnvironment from "./Environments/NBodySystemEnvironment";
import Scene from "./Scenes/Scene";
import { sectionManager } from "./SectionManager";

// set up fonts
PIXI.BitmapFont.from(
  VEC_FONT_NAME,
  {
    fontFamily: "Arial",
    fill: "white",
    fontSize: 13,
  },
  { chars: PIXI.BitmapFont.ASCII }
);
PIXI.BitmapFont.from(
  DIST_FONT_NAME,
  {
    fontFamily: "Arial",
    fill: "white",
    fontSize: 14,
  },
  { chars: PIXI.BitmapFont.ASCII }
);

// scenes
const scenes: Scene<NBodySystemEnvironment>[] = [];

for (const [k, v] of sectionManager.sceneList) {
  const div = document.getElementById(k) as HTMLDivElement;
  if (!div) continue;
  const scene = new v(div);
  scenes.push(scene);
}

for (const scene of scenes) {
  scene.setup();
}
