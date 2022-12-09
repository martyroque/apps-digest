import { useCallback, useMemo } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

import { AppsDigestStoreDefinition } from './types';
import { AppsDigestContainer } from './AppsDigestContainer';
import { AppsDigestReadOnlyValueInterface } from './AppsDigestValue';

function useAppsDigestStore<S>(
  storeDefinition: AppsDigestStoreDefinition<S>,
): S {
  const appsDigestContainer = AppsDigestContainer.getInstance();

  const [getStore, cleanup] = useMemo(() => {
    const store = appsDigestContainer.get(storeDefinition);
    return [
      () => store,
      () => {
        return () => {
          appsDigestContainer.remove(storeDefinition);
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
