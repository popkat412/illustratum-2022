import GravityComponent from "../Components/GravityComponent";
import ParticleComponent from "../Components/ParticleComponent";
import ShowVectorComponent from "../Components/ShowVectorComponent";
import ECSEntity from "../EntityComponentSystem/Entity";
import ECSSystem from "../EntityComponentSystem/System";
import { HasGravitationalConstant } from "../Environments/EnvironmentInterfaces";
import { unzipList } from "../Utils/prog";
import Vec2 from "../Vec2";

export default class GravitySystem<
  E extends HasGravitationalConstant
> extends ECSSystem<E> {
  setup() {}

  update(_deltaTime: number): void {
    // todo: see if any way to remove duplicate between this and GravitySystem.ts
    const entities = this.gravityEntities();
    const particleComponents: ParticleComponent[] = entities
      .map((e) =>
        this.entityManager.getComponent<ParticleComponent>(e, ParticleComponent)
      )
      .filter((e) => e) as ParticleComponent[];

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
      const field = gravitationlField(
        particleComponent.pos,
        particleComponents.filter((v) => v != particleComponent),
        this.environment.gravitationalConstant
      );
      if (!field) continue;
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
}

export function gravitationlField(
  pos: Vec2,
  dueToParticles: ParticleComponent[],
  gravitationalConstant: number
): Vec2 | undefined {
  const epsilon = 1;
  // returns undefined if its too close to an actual body
  let totalField = new Vec2();
  for (const particle of dueToParticles) {
    const diff = particle.pos.sub(pos);
    const distSq = diff.magSq();
    if (distSq < epsilon) return undefined;
    const field = diff.setMag((gravitationalConstant * particle.mass) / distSq);
    totalField = totalField.add(field);
  }
  return totalField;
}
