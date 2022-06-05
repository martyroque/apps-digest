import { AppsDigestStore } from '../AppsDigestStore';
import { AppsDigestContainer } from '../AppsDigestContainer';
import { AppsDigestValue } from '../AppsDigestValue';
import { generateStoreDefinition } from '../utils';

const storeContainer = AppsDigestContainer.getInstance();

class MockSubStore {
  testValue = new AppsDigestValue(1);

  public static getStoreName() {
    return 'MockSubStore';
  }
}

const mockSubStoreDefinition = generateStoreDefinition(MockSubStore);

const mockSubscribeCallback = jest.fn();

class MockStore extends AppsDigestStore {
  public subStore = this.inject(mockSubStoreDefinition);

  constructor() {
    super();
    this.subscribeToStoreValue(this.subStore.testValue, mockSubscribeCallback);
  }

  public static getStoreName() {
    return 'MockStore';
  }
}

const mockStoreDefinition = generateStoreDefinition(MockStore);

describe('AppsDigestStore tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should subscribe to any store value', () => {
    storeContainer.get(mockStoreDefinition);
    const mockSubStore = storeContainer.get(mockSubStoreDefinition);

    mockSubStore.testValue.publish(2);

    expect(mockSubscribeCallback).toHaveBeenCalledWith(2);

    storeContainer.remove(mockStoreDefinition);
  });

  it('should unsubscribe from all values when main store is removed', () => {
    storeContainer.get(mockStoreDefinition);
    const mockSubStore = storeContainer.get(mockSubStoreDefinition);

    storeContainer.remove(mockStoreDefinition);

    mockSubStore.testValue.publish(2);

    expect(mockSubscribeCallback).not.toHaveBeenCalled();
  });
});
