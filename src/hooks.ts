import { useCallback, useMemo } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

import { AppsDigestStoreConstructable } from './types';
import { AppsDigestContainer } from './AppsDigestContainer';
import { AppsDigestReadOnlyValueInterface } from './AppsDigestValue';

function useAppsDigestStore<S>(store: AppsDigestStoreConstructable<S>): S {
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

function useAppsDigestValue<V>(
  storeValue: AppsDigestReadOnlyValueInterface<V>,
): V {
  const subscribe = useCallback((onStoreChange: () => void) => {
    const subId = storeValue.subscribe(onStoreChange);

    return () => {
      storeValue.unsubscribe(subId);
    };
  }, []);

  return useSyncExternalStore(subscribe, storeValue.currentValue);
}

export { useAppsDigestStore, useAppsDigestValue };
