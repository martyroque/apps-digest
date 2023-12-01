import { useCallback, useMemo } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

import { AppsDigestStoreConstructable } from './types';
import { AppsDigestContainer } from './AppsDigestContainer';
import { AppsDigestReadOnlyValueInterface } from './AppsDigestValue';

function useStore<S>(store: AppsDigestStoreConstructable<S>): S {
  const appsDigestContainer = AppsDigestContainer.getInstance();

  const [getStore, cleanup] = useMemo(() => {
    const storeInstance = appsDigestContainer.get(store);
    return [
      () => storeInstance,
      () => {
        return () => {
          appsDigestContainer.remove(store);
        };
      },
    ];
  }, []);

  return useSyncExternalStore(cleanup, getStore);
}

function useValue<V>(storeValue: AppsDigestReadOnlyValueInterface<V>): V {
  const subscribe = useCallback((onStoreChange: () => void) => {
    const subId = storeValue.subscribe(onStoreChange);

    return () => {
      storeValue.unsubscribe(subId);
    };
  }, []);
  const getter = useCallback(() => storeValue.value, [storeValue.value]);

  return useSyncExternalStore(subscribe, getter);
}

export { useStore, useValue };
