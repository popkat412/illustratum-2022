export type EntityId = number;

export default class Entity {
  eid: EntityId;
  constructor(id: EntityId) {
    this.eid = id;
  }
}
