import ParticleComponent from "../Components/ParticleComponent";
import ECSSystem from "../EntityComponentSystem/System";
import {
  HasRenderScale,
  HasTimeFactor,
} from "../Environments/EnvironmentInterfaces";
import Vec2 from "../Vec2";

export default class MoveParticleSystem<
  E extends HasRenderScale & HasTimeFactor
> extends ECSSystem<E> {
  setup() {}

  update(_deltaTime: number): void {
    for (const [
      ,
      particleComponent,
    ] of this.entityManager.allEntitiesWithComponent<ParticleComponent>(
      ParticleComponent
    )) {
      if (!particleComponent.fixed) {
        particleComponent.vel = particleComponent.vel.add(
          particleComponent.acc.mult(this.environment.timeFactor)
        );

        particleComponent.pos = particleComponent.pos.add(
          particleComponent.vel.mult(this.environment.timeFactor)
        );
      }
      particleComponent.acc = new Vec2();
    }
  }
}
