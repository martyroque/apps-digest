import { nanoid } from 'nanoid';

import {
  AppsDigestStoreDefinition,
  AppsDigestStoreConstructable,
} from './types';

function generateStoreDefinition<S>(
  storeClass: AppsDigestStoreConstructable<S>,
): AppsDigestStoreDefinition<S> {
  return {
    storeId: nanoid(),
    storeClass,
  };
}

export { generateStoreDefinition };
