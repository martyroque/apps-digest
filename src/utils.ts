import { AppsDigestStoreDefinition, Constructable } from './types';

function generateStoreDefinition<S>(
  storeClass: Constructable<S>,
): AppsDigestStoreDefinition<S> {
  return {
    name: storeClass.name,
    Class: storeClass,
  };
}

export { generateStoreDefinition };
