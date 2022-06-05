interface AppsDigestStoreConstructable<T> {
  new (...args: unknown[]): T;
  getStoreName(): string;
}

interface AppsDigestStoreInterface {
  destroy?: () => void;
}

type AppsDigestStoreDefinition<S extends AppsDigestStoreInterface> = {
  name: string;
  Class: AppsDigestStoreConstructable<S>;
};

export {
  AppsDigestStoreInterface,
  AppsDigestStoreDefinition,
  AppsDigestStoreConstructable,
};
