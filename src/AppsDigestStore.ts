import { AppsDigestInjectable } from './AppsDigestInjectable';
import {
  AppsDigestReadOnlyValueInterface,
  AppsDigestValue,
} from './AppsDigestValue';
import { AppsDigestStoreInterface } from './types';

type UnwrappedAppsDigestValue<T> = T extends AppsDigestReadOnlyValueInterface<
  infer R
>
  ? R
  : T;

type UnwrappedAppsDigestValues<
  // The value types of the tuple can be anything
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Array<AppsDigestReadOnlyValueInterface<any>>,
> = {
  [P in keyof T]: UnwrappedAppsDigestValue<T[P]>;
};

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

  protected computedValue<
    V,
    // The value types of the tuple can be anything
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    A extends AppsDigestReadOnlyValueInterface<any>[] | [],
  >(
    storeValues: A,
    callback: (...args: UnwrappedAppsDigestValues<A>) => V,
  ): AppsDigestReadOnlyValueInterface<V> {
    function getComputedValue(): V {
      const values = storeValues.map((storeValue) => {
        return storeValue.value;
      });

      return callback(...(values as UnwrappedAppsDigestValues<A>));
    }

    const computedValue = new AppsDigestValue(getComputedValue());

    function computedValueCallback() {
      const newComputedValue = getComputedValue();

      computedValue.value = newComputedValue;
    }

    storeValues.forEach((storeValue) => {
      this.subscribeToStoreValue(storeValue, computedValueCallback);
    });

    return computedValue;
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
