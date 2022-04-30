import ECSComponent, { ECSComponentClass } from "./Component";
import ECSEntity, { ECSEntityId } from "./Entity";

export default class EntityManager {
  private entities: Set<ECSEntityId>;
  private componentsByComponentClass: Map<
    ECSComponentClass,
    Map<ECSEntityId, ECSComponent>
  >;

  private lowestUnassignedEID: ECSEntityId = 1;

  constructor() {
    this.entities = new Set();
    this.componentsByComponentClass = new Map();
  }

  addComponent<T extends ECSComponent>(entity: ECSEntity, component: T): void {
    const componentClass = component.constructor as ECSComponentClass;
    if (!this.componentsByComponentClass.get(componentClass)) {
      this.componentsByComponentClass.set(componentClass, new Map());
    }
    this.componentsByComponentClass
      .get(componentClass)!
      .set(entity.eid, component);
  }

  getComponent<T extends ECSComponent>(
    entity: ECSEntity,
    componentClass: ECSComponentClass
  ): T | undefined {
    return this.componentsByComponentClass
      .get(componentClass)
      ?.get(entity.eid) as T | undefined;
  }

  createEntity(): ECSEntity {
    const entity = new ECSEntity(this.generateNewEID());
    this.entities.add(entity.eid);
    return entity;
  }

  removeEntity(entity: ECSEntity): void {
    for (const [_, components] of this.componentsByComponentClass) {
      components.delete(entity.eid);
    }
    this.entities.delete(entity.eid);
  }

  allEntitiesWithComponent<T extends ECSComponent>(
    componentClass: ECSComponentClass
  ): [ECSEntity, T][] {
    const components = this.componentsByComponentClass.get(componentClass);
    if (!components) return [];

    const res: [ECSEntity, T][] = [];
    for (const [eid, component] of components) {
      res.push([new ECSEntity(eid), component as T]);
    }
    return res;
  }

  private generateNewEID(): ECSEntityId {
    if (this.lowestUnassignedEID < Number.MAX_SAFE_INTEGER) {
      return this.lowestUnassignedEID++;
    }
    for (let i = 1; i < Number.MAX_SAFE_INTEGER; i++) {
      if (!this.entities.has(i)) return i;
    }
    throw new Error("No available EIDs");
  }
}
