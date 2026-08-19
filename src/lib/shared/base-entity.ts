export abstract class BaseEntity<TId = number> {
  protected constructor(readonly id: TId) {}
}
