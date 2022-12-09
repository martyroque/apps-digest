interface AppsDigestStoreInterface {
  destroy?: () => void;
}

interface AppsDigestStoreConstructable<T> {
  new (...args: unknown[]): T & AppsDigestStoreInterface;
}

type AppsDigestStoreDefinition<S> = {
  storeId: string;
  storeClass: AppsDigestStoreConstructable<S>;
};

export {
  AppsDigestStoreInterface,
  AppsDigestStoreDefinition,
  AppsDigestStoreConstructable,
};
