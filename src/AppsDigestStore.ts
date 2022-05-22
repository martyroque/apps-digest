import { AppsDigestInjectable } from './AppsDigestInjectable';
import { AppsDigestReadOnlyValueInterface } from './AppsDigestValue';
import { AppsDigestStoreInterface } from './types';

abstract class AppsDigestStore
  extends AppsDigestInjectable
  implements AppsDigestStoreInterface
{
  private subscriptions: Map<string, (subId: string) => boolean> = new Map();

  protected subscribeToStoreValue<V>(
    storeValue: AppsDigestReadOnlyValueInterface<V>,
    callback: (value: V) => void,
  ): void {
    const subId = storeValue.subscribe(callback);

    this.subscriptions.set(subId, storeValue.unsubscribe);
  }

  public destroy(): void {
    for (const [subId, unsubscribe] of this.subscriptions) {
      unsubscribe(subId);
      this.subscriptions.delete(subId);
    }

    super.destroy();
  }
}

export { AppsDigestStore };
