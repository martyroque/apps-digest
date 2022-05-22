import { AppsDigestContainer } from './AppsDigestContainer';
import { AppsDigestStoreInterface, AppsDigestStoreDefinition } from './types';

abstract class AppsDigestInjectable {
  private injectedStores: Map<
    string,
    AppsDigestStoreDefinition<AppsDigestStoreInterface>
  > = new Map();
  private storeContainer = AppsDigestContainer.getInstance();

  protected inject<S>(store: AppsDigestStoreDefinition<S>): S {
    this.injectedStores.set(store.name, store);

    return this.storeContainer.get(store);
  }

  public destroy(): void {
    for (const [, injectedStore] of this.injectedStores) {
      this.storeContainer.remove(injectedStore);
    }
  }
}

export { AppsDigestInjectable };
