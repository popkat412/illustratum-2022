import Entity, { EntityId } from "./Entity";
import Component, { ComponentClass } from "./Component";

export default class EntityManager {
  private entities: Set<EntityId>;
  private componentsByComponentClass: Map<
    ComponentClass,
    Map<EntityId, Component>
  >;

  private lowestUnassignedEID: EntityId = 1;

  constructor() {
    this.entities = new Set();
    this.componentsByComponentClass = new Map();
  }

  addComponent<T extends Component>(entity: Entity, component: T): void {
    const componentClass = component.constructor as ComponentClass;
    if (!this.componentsByComponentClass.get(componentClass)) {
      this.componentsByComponentClass.set(componentClass, new Map());
    }
    this.componentsByComponentClass
      .get(componentClass)!
      .set(entity.eid, component);
  }

  getComponent<T extends Component>(
    entity: Entity,
    componentClass: ComponentClass
  ): T | undefined {
    return this.componentsByComponentClass
      .get(componentClass)
      ?.get(entity.eid) as T | undefined;
  }

  createEntity(): Entity {
    const entity = new Entity(this.generateNewEID());
    this.entities.add(entity.eid);
    return entity;
  }

  removeEntity(entity: Entity): void {
    for (const [_, components] of this.componentsByComponentClass) {
      components.delete(entity.eid);
    }
    this.entities.delete(entity.eid);
  }

  allEntitiesWithComponent<T extends Component>(
    componentClass: ComponentClass
  ): [Entity, T][] {
    const components = this.componentsByComponentClass.get(componentClass);
    if (!components) return [];

    const res: [Entity, T][] = [];
    for (const [eid, component] of components) {
      res.push([new Entity(eid), component as T]);
    }
    return res;
  }

  private generateNewEID(): EntityId {
    if (this.lowestUnassignedEID < Number.MAX_SAFE_INTEGER) {
      return this.lowestUnassignedEID++;
    }
    for (let i = 1; i < Number.MAX_SAFE_INTEGER; i++) {
      if (!this.entities.has(i)) return i;
    }
    throw new Error("No available EIDs");
  }
}
