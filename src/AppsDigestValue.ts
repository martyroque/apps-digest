import { nanoid } from 'nanoid';

interface AppsDigestReadOnlyValueInterface<V> {
  currentValue: () => V;
  subscribe: (callback: (value: V) => void) => string;
  unsubscribe: (subId: string) => boolean;
}

interface AppsDigestValueInterface<V>
  extends AppsDigestReadOnlyValueInterface<V> {
  publish: (newValue: V) => boolean;
}

type Subscriber<V> = {
  callback: (value: V) => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;
type MaybePromisify<T> = T | Promise<T>;

type PromisifyMethods<T> = {
  [K in keyof T]: T[K] extends AnyFunction
    ? (...args: Parameters<T[K]>) => MaybePromisify<ReturnType<T[K]>>
    : T[K];
};

export type SupportedStorage = PromisifyMethods<
  Pick<Storage, 'getItem' | 'setItem'>
>;

export type AppsDigestValueOptions = {
  storage: SupportedStorage;
};

class AppsDigestValue<V> implements AppsDigestValueInterface<V> {
  private value: V;
  private subscribers: Map<string, Subscriber<V>> = new Map();
  private persistKey?: string;
  private storage?: SupportedStorage;

  constructor(
    initialValue: V,
    persistKey?: string,
    options?: AppsDigestValueOptions,
  ) {
    this.value = initialValue;
    this.persistKey = persistKey;

    if (persistKey) {
      this.storage = options?.storage || localStorage;
    }

    this.currentValue = this.currentValue.bind(this);
    this.publish = this.publish.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);

    this.hydrate();
  }

  private async hydrate() {
    if (this.persistKey && this.storage) {
      const rawPersistedValue = await this.storage.getItem(this.persistKey);

      if (rawPersistedValue) {
        try {
          const persistedValue: V = JSON.parse(rawPersistedValue);

          this.publish(persistedValue);
        } catch (error) {
          console.error(
            `Could not parse value ${rawPersistedValue} for ${this.persistKey}. Error:`,
            error,
          );
        }
      } else {
        // fire-and-forget
        this.storage.setItem(this.persistKey, JSON.stringify(this.value));
      }
    }
  }

  public currentValue(): V {
    return this.value;
  }

  public publish(newValue: V) {
    if (newValue === this.value) {
      return false;
    }

    this.value = newValue;

    if (newValue !== undefined && this.persistKey && this.storage) {
      // fire-and-forget
      this.storage.setItem(this.persistKey, JSON.stringify(newValue));
    }

    for (const [, subscriber] of this.subscribers) {
      subscriber.callback(this.value);
    }

    return true;
  }

  public subscribe(callback: (value: V) => void) {
    const subId = nanoid();

    this.subscribers.set(subId, { callback });

    return subId;
  }

  public unsubscribe(subId: string) {
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
