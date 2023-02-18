import { AppsDigestInjectable } from '../AppsDigestInjectable';
import { AppsDigestContainer } from '../AppsDigestContainer';

const storeContainer = AppsDigestContainer.getInstance();

const mockDestroy = jest.fn();

class MockSubStore {
  destroy = mockDestroy;
}

class MockStore extends AppsDigestInjectable {
  public subStore = this.inject(MockSubStore);
}

describe('AppsDigestInjectable tests', () => {
  it('should inject a store', () => {
    const mockStore = storeContainer.get(MockStore);

    expect(mockStore.subStore).toBeInstanceOf(MockSubStore);

    storeContainer.remove(MockStore);
  });

  it('should destroy injected store when main store is destroyed', () => {
    storeContainer.get(MockStore);

    storeContainer.remove(MockStore);

    expect(mockDestroy).toHaveBeenCalled();
  });
});
