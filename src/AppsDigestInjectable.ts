import { AppsDigestContainer } from './AppsDigestContainer';
import { AppsDigestStoreInterface, AppsDigestStoreDefinition } from './types';

abstract class AppsDigestInjectable {
  private injectedStores: Map<
    string,
    AppsDigestStoreDefinition<AppsDigestStoreInterface>
  > = new Map();
  private storeContainer = AppsDigestContainer.getInstance();

  protected inject<S>(storeDefinition: AppsDigestStoreDefinition<S>): S {
    this.injectedStores.set(storeDefinition.name, storeDefinition);

    return this.storeContainer.get(storeDefinition);
  }

  public destroy(): void {
    for (const [, injectedStore] of this.injectedStores) {
      this.storeContainer.remove(injectedStore);
    }
  }
}

export { AppsDigestInjectable };
