import GravityComponent from "../Components/GravityComponent";
import ParticleComponent from "../Components/ParticleComponent";
import ShowVectorComponent from "../Components/ShowVectorComponent";
import ECSEntity from "../EntityComponentSystem/Entity";
import ECSSystem from "../EntityComponentSystem/System";
import { HasGravitationalConstant } from "../Environments/EnvironmentInterfaces";
import { unzipList } from "../utils";
import Vec2 from "../Vec2";

export default class GravitySystem<
  E extends HasGravitationalConstant
> extends ECSSystem<E> {
  setup() {}

  update(_deltaTime: number): void {
    const entities = this.gravityEntities();
    for (const entity of entities) {
      const particleComponent =
        this.entityManager.getComponent<ParticleComponent>(
          entity,
          ParticleComponent
        );
      if (!particleComponent) continue;
      const [, particleComponents] = unzipList(
        this.entityManager.allEntitiesWithComponent<ParticleComponent>(
          ParticleComponent
        )
      );
      // ??? i have no idea why this works even though the particleComponents does include itself, but it works
      console.assert(particleComponents.includes(particleComponent));
      const field = this.gravitationlField(
        particleComponent.pos,
        particleComponents
      );
      const f = field.mult(particleComponent.mass);
      particleComponent.applyForce(f);

      const showVectorComponent =
        this.entityManager.getComponent<ShowVectorComponent>(
          entity,
          ShowVectorComponent
        );
      if (showVectorComponent && !particleComponent.fixed) {
        showVectorComponent.vec = f;
      }
    }
  }

  private gravityEntities(): ECSEntity[] {
    const [entities] = unzipList(
      this.entityManager.allEntitiesWithComponent<GravityComponent>(
        GravityComponent
      )
    );
    return entities;
  }

  private gravitationlField(
    pos: Vec2,
    dueToParticles: ParticleComponent[]
  ): Vec2 {
    let totalField = new Vec2();
    for (const particle of dueToParticles) {
      const diff = particle.pos.sub(pos);
      const field = diff.setMag(
        (this.environment.gravitationalConstant * particle.mass) / diff.magSq()
      );
      totalField = totalField.add(field);
    }
    return totalField;
  }
}
