import ParticleComponent from "../Components/ParticleComponent";
import PixiGraphicsRenderComponent from "../Components/PIXIGraphicsRenderComponent";
import System from "../EntitySystem/System";
import {
  HasRenderScale,
  HasTimeFactor,
} from "../Environments/EnvironmentInterfaces";

export default class MoveParticleSystem<
  E extends HasRenderScale & HasTimeFactor
> extends System<E> {
  setup() {
    for (const [
      entity,
      particleComponent,
    ] of this.entityManager.allEntitiesWithComponent<ParticleComponent>(
      ParticleComponent
    )) {
      const pixiGraphicsRenderComponent =
        this.entityManager.getComponent<PixiGraphicsRenderComponent>(
          entity,
          PixiGraphicsRenderComponent
        );
      if (!pixiGraphicsRenderComponent) continue;
      this.updatePixiGraphics(particleComponent, pixiGraphicsRenderComponent);
    }
  }

  update(_deltaTime: number): void {
    for (const [
      entity,
      particleComponent,
    ] of this.entityManager.allEntitiesWithComponent<ParticleComponent>(
      ParticleComponent
    )) {
      if (particleComponent.fixed) continue;

      const pixiGraphicsRenderComponent =
        this.entityManager.getComponent<PixiGraphicsRenderComponent>(
          entity,
          PixiGraphicsRenderComponent
        );

      // console.log({ acc: particleComponent.acc, vel: particleComponent.vel });

      particleComponent.vel = particleComponent.vel.add(
        particleComponent.acc.mult(this.environment.timeFactor)
      );

      particleComponent.pos = particleComponent.pos.add(
        particleComponent.vel.mult(this.environment.timeFactor)
      );
      particleComponent.acc.set(0, 0);

      // console.log({ pos: particleComponent.pos });

      if (pixiGraphicsRenderComponent) {
        this.updatePixiGraphics(particleComponent, pixiGraphicsRenderComponent);
      }
    }
  }

  /**
   * Update the pixi graphics pos using the particle pos
   */
  private updatePixiGraphics(
    particleComponent: ParticleComponent,
    pixiGraphicsRenderComponent: PixiGraphicsRenderComponent
  ) {
    // console.log({
    //   deltaTime,
    //   scaleFactor: this.environment.scaleFactor,
    //   timeFactor: this.environment.timeFactor,
    //   pos: particleComponent.pos,
    // });

    pixiGraphicsRenderComponent.pixiGraphics.x =
      particleComponent.pos.x * this.environment.scaleFactor;
    pixiGraphicsRenderComponent.pixiGraphics.y =
      particleComponent.pos.y * this.environment.scaleFactor;

    // console.log("particleComponent.pos", {
    //   x: particleComponent.pos.x,
    //   y: particleComponent.pos.y,
    // });
    // console.log("pixiGraphics.position", {
    //   x: pixiGraphicsRenderComponent.pixiGraphics.x,
    //   y: pixiGraphicsRenderComponent.pixiGraphics.y,
    // });
  }
}
