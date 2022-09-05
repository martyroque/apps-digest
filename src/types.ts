interface AppsDigestStoreInterface {
  destroy?: () => void;
}

interface AppsDigestStoreConstructable<T> {
  new (...args: unknown[]): T & AppsDigestStoreInterface;
  getStoreName(): string;
}

type AppsDigestStoreDefinition<S> = {
  name: string;
  Class: AppsDigestStoreConstructable<S>;
};

export {
  AppsDigestStoreInterface,
  AppsDigestStoreDefinition,
  AppsDigestStoreConstructable,
};
