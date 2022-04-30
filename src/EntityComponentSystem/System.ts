import EntityManager from "./EntityManager";

export default abstract class ECSSystem<E> {
  entityManager: EntityManager;
  environment: E;

  constructor(entityManager: EntityManager, environment: E) {
    this.entityManager = entityManager;
    this.environment = environment;
  }

  abstract setup(): void;
  abstract update(deltaTime: number): void;
}
