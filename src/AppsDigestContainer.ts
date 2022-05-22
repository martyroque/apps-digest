import { AppsDigestStoreInterface, AppsDigestStoreDefinition } from './types';

type StoreRecord = {
  instance: AppsDigestStoreInterface;
  refCount: number;
};

class AppsDigestContainer {
  private static instance: AppsDigestContainer = new AppsDigestContainer();
  private stores: Map<string, StoreRecord> = new Map();

  constructor() {
    if (AppsDigestContainer.instance) {
      throw new Error(
        'Error: Instantiation failed. Use AppsDigestContainer.getInstance() instead.',
      );
    }

    AppsDigestContainer.instance = this;
  }

  private instantiate<S>(store: AppsDigestStoreDefinition<S>) {
    if (this.stores.has(store.name)) {
      console.warn(`Store record for ${store.name} already exists`);
      return;
    }

    this.stores.set(store.name, {
      instance: new store.Class(),
      refCount: 0,
    });
  }

  public static getInstance(): AppsDigestContainer {
    return AppsDigestContainer.instance;
  }

  public get<S>(store: AppsDigestStoreDefinition<S>): S {
    if (!this.stores.has(store.name)) {
      this.instantiate(store);
    }

    const storeRecord = this.stores.get(store.name) as StoreRecord;

    this.stores.set(store.name, {
      ...storeRecord,
      refCount: storeRecord.refCount + 1,
    });

    return storeRecord.instance as S;
  }

  public remove<S>(store: AppsDigestStoreDefinition<S>) {
    const storeRecord = this.stores.get(store.name);

    if (!storeRecord) {
      console.warn(`Store record for ${store.name} does not exist`);
      return false;
    }

    if (storeRecord.refCount > 1) {
      this.stores.set(store.name, {
        ...storeRecord,
        refCount: storeRecord.refCount - 1,
      });

      return true;
    }

    if (storeRecord.instance.destroy) {
      storeRecord.instance.destroy();
    }

    return this.stores.delete(store.name);
  }
}

export { AppsDigestContainer };
