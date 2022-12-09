import { AppsDigestInjectable } from '../AppsDigestInjectable';
import { AppsDigestContainer } from '../AppsDigestContainer';
import { generateStoreDefinition } from '../utils';

const storeContainer = AppsDigestContainer.getInstance();

const mockDestroy = jest.fn();

class MockSubStore {
  destroy = mockDestroy;
}

const mockSubStoreDefinition = generateStoreDefinition(MockSubStore);

class MockStore extends AppsDigestInjectable {
  public subStore = this.inject(mockSubStoreDefinition);
}

const mockStoreDefinition = generateStoreDefinition(MockStore);

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
