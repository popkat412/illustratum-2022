export type ECSEntityId = number;

export default class ECSEntity {
  eid: ECSEntityId;
  constructor(id: ECSEntityId) {
    this.eid = id;
  }

  toString(): string {
    return this.eid.toString();
  }
}
