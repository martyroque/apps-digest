import { nanoid } from "nanoid";

interface AppsDigestReadOnlyValueInterface<V> {
  currentValue: () => V;
  subscribe: (callback: (value: V) => void) => string;
  unsubscribe: (subId: string) => boolean;
}

interface AppsDigestValueInterface<V>
  extends AppsDigestReadOnlyValueInterface<V> {
  publish: (newValue: V) => boolean;
}

class AppsDigestValue<V> implements AppsDigestValueInterface<V> {
  private value: V;
  private subscribers: Map<string, { callback: (value: V) => void }> =
    new Map();

  constructor(initialValue: V) {
    this.value = initialValue;
  }

  currentValue(): V {
    return this.value;
  }

  publish(newValue: V) {
    if (newValue === this.value) {
      return false;
    }

    this.value = newValue;

    for (const [, subscriber] of this.subscribers) {
      subscriber.callback(this.value);
    }

    return true;
  }

  subscribe(callback: (value: V) => void) {
    const subId = nanoid();

    this.subscribers.set(subId, { callback });

    return subId;
  }

  unsubscribe(subId: string) {
    if (!this.subscribers.has(subId)) {
      console.warn(`Subscriber ${subId} not found`);
      return false;
    }

    return this.subscribers.delete(subId);
  }
}

export {
  AppsDigestValue,
  AppsDigestValueInterface,
  AppsDigestReadOnlyValueInterface,
};
