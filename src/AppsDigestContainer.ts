import {
  AppsDigestStoreInterface,
  AppsDigestStoreDefinition,
  AppsDigestStoreConstructable,
} from './types';
import { generateStoreDefinition } from './utils';

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

  private instantiate<S>(storeDefinition: AppsDigestStoreDefinition<S>) {
    if (this.stores.has(storeDefinition.storeId)) {
      console.warn(
        `Store record for ${storeDefinition.storeId} already exists`,
      );
      return;
    }

    this.stores.set(storeDefinition.storeId, {
      instance: new storeDefinition.storeClass(),
      refCount: 0,
    });
  }

  public static getInstance(): AppsDigestContainer {
    return AppsDigestContainer.instance;
  }

  public getStoreDefinition<S>(
    store: AppsDigestStoreConstructable<S>,
  ): AppsDigestStoreDefinition<S> {
    if ('getStoreDefinition' in store.prototype) {
      return store.prototype.getStoreDefinition();
    }

    const storeDefinition = generateStoreDefinition(store);
    Object.assign(store.prototype, {
      getStoreDefinition: () => storeDefinition,
    });

    return storeDefinition;
  }

  public get<S>(store: AppsDigestStoreConstructable<S>): S {
    const storeDefinition = this.getStoreDefinition(store);

    if (!this.stores.has(storeDefinition.storeId)) {
      this.instantiate(storeDefinition);
    }

    const storeRecord = this.stores.get(storeDefinition.storeId) as StoreRecord;

    this.stores.set(storeDefinition.storeId, {
      ...storeRecord,
      refCount: storeRecord.refCount + 1,
    });

    return storeRecord.instance as S;
  }

  public remove<S>(store: AppsDigestStoreConstructable<S>) {
    const storeDefinition = this.getStoreDefinition(store);
    const storeRecord = this.stores.get(storeDefinition.storeId);

    if (!storeRecord) {
      console.warn(
        `Store record for ${storeDefinition.storeId} does not exist`,
      );
      return false;
    }

    if (storeRecord.refCount > 1) {
      this.stores.set(storeDefinition.storeId, {
        ...storeRecord,
        refCount: storeRecord.refCount - 1,
      });

      return true;
    }

    if (storeRecord.instance.destroy) {
      storeRecord.instance.destroy();
    }

    return this.stores.delete(storeDefinition.storeId);
  }
}

export { AppsDigestContainer };
