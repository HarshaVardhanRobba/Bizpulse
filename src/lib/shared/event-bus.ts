type Handler<T = unknown> = (payload: T) => void | Promise<void>;

class EventBus {
  private handlers = new Map<string, Set<Handler>>();

  subscribe<T = unknown>(eventName: string, handler: Handler<T>): () => void {
    const set = this.handlers.get(eventName) ?? new Set<Handler>();
    set.add(handler as Handler);
    this.handlers.set(eventName, set);
    return () => set.delete(handler as Handler);
  }

  async publish<T = unknown>(eventName: string, payload: T): Promise<void> {
    const set = this.handlers.get(eventName);
    if (!set) return;
    await Promise.all([...set].map((handler) => handler(payload)));
  }
}

export const eventBus = new EventBus();
