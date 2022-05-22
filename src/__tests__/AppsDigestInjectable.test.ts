import { AppsDigestInjectable } from '../AppsDigestInjectable';
import { AppsDigestContainer } from '../AppsDigestContainer';

const storeContainer = AppsDigestContainer.getInstance();

const mockDestroy = jest.fn();

class MockSubStore {
  destroy = mockDestroy;
}

class MockStore extends AppsDigestInjectable {
  public subStore = this.inject({
    name: 'MockSubStore',
    Class: MockSubStore,
  });
}

const mockStoreDefinition = {
  name: 'mockStoreDefinition',
  Class: MockStore,
};

describe('AppsDigestInjectable tests', () => {
  it('should inject a store', () => {
    const mockStore = storeContainer.get(mockStoreDefinition);

    expect(mockStore.subStore).toBeInstanceOf(MockSubStore);

    storeContainer.remove(mockStoreDefinition);
  });

  it('should destroy injected store when main store is destroyed', () => {
    storeContainer.get(mockStoreDefinition);

    storeContainer.remove(mockStoreDefinition);

    expect(mockDestroy).toHaveBeenCalled();
  });
});
