import { useEffect, useState } from 'react';

import { AppsDigestStoreDefinition } from './types';
import { AppsDigestContainer } from './AppsDigestContainer';
import { AppsDigestReadOnlyValueInterface } from './AppsDigestValue';

function useOnce(once: () => void) {
  return useEffect(once, []);
}

function useAppsDigestStore<S>(
  storeDefinition: AppsDigestStoreDefinition<S>,
): S {
  const appsDigestContainer = AppsDigestContainer.getInstance();
  const storeInstance = useState(() =>
    appsDigestContainer.get(storeDefinition),
  )[0];

  useOnce(() => {
    return () => {
      appsDigestContainer.remove(storeDefinition);
    };
  });

  return storeInstance;
}

function useAppsDigestValue<V>(
  storeValue: AppsDigestReadOnlyValueInterface<V>,
): V {
  const [value, setValue] = useState(storeValue.currentValue());

  useOnce(() => {
    const subId = storeValue.subscribe(setValue);

    return () => {
      storeValue.unsubscribe(subId);
    };
  });

  return value;
}

export { useAppsDigestStore, useAppsDigestValue };
