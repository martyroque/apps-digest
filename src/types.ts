interface Constructable<T> {
  new (...args: unknown[]): T;
}

interface AppsDigestStoreInterface {
  destroy?: () => void;
}

type AppsDigestStoreDefinition<S extends AppsDigestStoreInterface> = {
  name: string;
  Class: Constructable<S>;
};

export { AppsDigestStoreInterface, AppsDigestStoreDefinition };
