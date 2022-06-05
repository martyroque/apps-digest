import {
  AppsDigestStoreDefinition,
  AppsDigestStoreConstructable,
} from './types';

function generateStoreDefinition<S>(
  storeClass: AppsDigestStoreConstructable<S>,
): AppsDigestStoreDefinition<S> {
  return {
    name: storeClass.getStoreName(),
    Class: storeClass,
  };
}

export { generateStoreDefinition };
