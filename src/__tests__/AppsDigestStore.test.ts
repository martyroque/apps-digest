import { AppsDigestStore } from '../AppsDigestStore';
import { AppsDigestContainer } from '../AppsDigestContainer';
import { AppsDigestValue } from '../AppsDigestValue';

const storeContainer = AppsDigestContainer.getInstance();

class MockSubStore {
  testValue = new AppsDigestValue(1);
}

const mockSubscribeCallback = jest.fn();

class MockStore extends AppsDigestStore {
  public subStore = this.inject({
    name: 'MockSubStore',
    Class: MockSubStore,
  });

  constructor() {
    super();
    this.subscribeToStoreValue(this.subStore.testValue, mockSubscribeCallback);
  }
}

const mockStoreDefinition = {
  name: 'mockStoreDefinition',
  Class: MockStore,
};

describe('AppsDigestStore tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should subscribe to any store value', () => {
    const mockStore = storeContainer.get(mockStoreDefinition);

    mockStore.subStore.testValue.publish(2);

    expect(mockSubscribeCallback).toHaveBeenCalledWith(2);

    storeContainer.remove(mockStoreDefinition);
  });

  it('should unsubscribe from all values when main store is removed', () => {
    const mockStore = storeContainer.get(mockStoreDefinition);

    storeContainer.remove(mockStoreDefinition);

    mockStore.subStore.testValue.publish(2);

    expect(mockSubscribeCallback).not.toHaveBeenCalled();
  });
});
