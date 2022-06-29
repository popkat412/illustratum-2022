type GoalStatusStr = "success" | "failure" | "undecided";

export class GoalStatus {
  // ONLY modify these through the provided methods
  // or else onUpdate will not run
  private _status: GoalStatusStr;
  private _msg: string | null;
  get status(): GoalStatusStr {
    return this._status;
  }
  get msg(): string | null {
    return this._msg;
  }

  onUpdate: ((newValue: GoalStatus) => void) | undefined = undefined;

  constructor(status: GoalStatusStr = "undecided", msg: string | null = null) {
    this._status = status;
    this._msg = msg;
  }

  undecided(): void {
    this._status = "undecided";
    if (this.onUpdate) this.onUpdate(this);
  }

  success(msg: string | null = null): void {
    this._status = "success";
    this._msg = msg;
    if (this.onUpdate) this.onUpdate(this);
  }

  failure(msg: string | null = null): void {
    this._status = "failure";
    this._msg = msg;
    if (this.onUpdate) this.onUpdate(this);
  }

  isUndecided(): boolean {
    return this.status == "undecided";
  }

  isSuccess(): boolean {
    return this.status == "success";
  }

  isFailure(): boolean {
    return this.status == "failure";
  }
}
