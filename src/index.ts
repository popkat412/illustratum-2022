import NBodySystemEnvironment from "./Environments/NBodySystemEnvironment";
import Scene from "./Scenes/Scene";
import { sectionManager } from "./SectionManager";

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
