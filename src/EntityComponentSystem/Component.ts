export type ECSComponentClass = new (...args: any[]) => ECSComponent;

export default abstract class ECSComponent {}
