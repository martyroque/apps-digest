import { AppsDigestStore } from '../AppsDigestStore';
import { AppsDigestContainer } from '../AppsDigestContainer';
import { AppsDigestValue } from '../AppsDigestValue';

const storeContainer = AppsDigestContainer.getInstance();

class MockSubStore {
  testValue = new AppsDigestValue(1);
  boolValue = new AppsDigestValue(false);
  stringValue = new AppsDigestValue<string | undefined>(undefined);
}

const mockSubscribeCallback = jest.fn();

class MockStore extends AppsDigestStore {
  public subStore = this.inject(MockSubStore);

  public computed = this.computedValue(
    [this.subStore.boolValue, this.subStore.stringValue],
    (boolValue, stringValue) => {
      return boolValue && stringValue === 'TEST';
    },
  );

  constructor() {
    super();
    this.subscribeToStoreValue(this.subStore.testValue, mockSubscribeCallback);
  }
}

describe('AppsDigestStore tests', () => {
  let mockStore: MockStore;
  let mockSubStore: MockSubStore;
  beforeEach(() => {
    jest.clearAllMocks();
    mockStore = storeContainer.get(MockStore);
    mockSubStore = storeContainer.get(MockSubStore);
  });

  afterEach(() => {
    storeContainer.remove(MockStore);
  });

  describe('subscribeToStoreValue', () => {
    it('should subscribe to any store value', () => {
      mockSubStore.testValue.publish(2);

      expect(mockSubscribeCallback).toHaveBeenCalledWith(2);
    });

    it('should unsubscribe from all values when main store is removed', () => {
      storeContainer.remove(MockStore);

      mockSubStore.testValue.publish(2);

      expect(mockSubscribeCallback).not.toHaveBeenCalled();
    });
  });

  describe('computedValue', () => {
    it('should return initial computed value', () => {
      expect(mockStore.computed.currentValue()).toBe(false);
    });

    it('should return updated computed value', () => {
      mockSubStore.boolValue.publish(true);
      mockSubStore.stringValue.publish('TEST');

      expect(mockStore.computed.currentValue()).toBe(true);
    });

    it('should not update computed value when main store is removed', () => {
      mockSubStore.boolValue.publish(false);
      mockSubStore.stringValue.publish(undefined);

      storeContainer.remove(MockStore);

      mockSubStore.boolValue.publish(true);
      mockSubStore.stringValue.publish('TEST');

      expect(mockStore.computed.currentValue()).toBe(false);
    });
  });
});
