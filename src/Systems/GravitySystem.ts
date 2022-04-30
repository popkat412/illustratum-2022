import GravityComponent from "../Components/GravityComponent";
import ParticleComponent from "../Components/ParticleComponent";
import System from "../EntitySystem/System";
import { HasGravitationalConstant } from "../Environments/EnvironmentInterfaces";
import { unzipList } from "../utils";

export default class GravitySystem<
  E extends HasGravitationalConstant
> extends System<E> {
  setup() {}

  update(_deltaTime: number): void {
    const [entities] = unzipList(
      this.entityManager.allEntitiesWithComponent<GravityComponent>(
        GravityComponent
      )
    );
    for (const entity of entities) {
      for (const other of entities) {
        if (entity.eid == other.eid) continue;

        const particleComponent1 =
          this.entityManager.getComponent<ParticleComponent>(
            entity,
            ParticleComponent
          );
        const particleComponent2 =
          this.entityManager.getComponent<ParticleComponent>(
            other,
            ParticleComponent
          );

        if (!(particleComponent1 && particleComponent2)) continue;

        const diff = particleComponent2.pos.sub(particleComponent1.pos);

        const magF =
          (this.environment.gravitationalConstant *
            (particleComponent1.mass * particleComponent2.mass)) /
          diff.magSq();
        const f = diff.normalize().mult(magF);
        particleComponent1.applyForce(f);
      }
    }
  }
}