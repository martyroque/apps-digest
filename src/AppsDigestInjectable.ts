import { AppsDigestContainer } from './AppsDigestContainer';
import {
  AppsDigestStoreDefinition,
  AppsDigestStoreConstructable,
} from './types';

abstract class AppsDigestInjectable {
  private injectedStores: Map<string, AppsDigestStoreDefinition<unknown>> =
    new Map();
  private storeContainer = AppsDigestContainer.getInstance();

  protected inject<S>(store: AppsDigestStoreConstructable<S>): S {
    const storeDefinition = this.storeContainer.getStoreDefinition(store);

    this.injectedStores.set(storeDefinition.storeId, storeDefinition);

    return this.storeContainer.get(store);
  }

  public destroy(): void {
    for (const [, injectedStore] of this.injectedStores) {
      this.storeContainer.remove(injectedStore.storeClass);
    }
  }
}

export { AppsDigestInjectable };
